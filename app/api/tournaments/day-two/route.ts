import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient, getSupabaseServerClient } from "../../../lib/supabase-server";

export const runtime = "nodejs";

type FormatChoice = "tiers_1_2_singles" | "tiers_3_4_singles";
type CoinTossNodeKey = "reentry1" | "reentry2" | "semifinal1" | "semifinal2";
type Member = { playerId: string | null; name: string; tier: number; draftOrder: number };
type Team = { id: string; name: string; sortOrder: number; members: Member[] };
type Score = {
  schedule_match_id: string;
  side_a_set1: number | null;
  side_b_set1: number | null;
  side_a_set2: number | null;
  side_b_set2: number | null;
  side_a_set3: number | null;
  side_b_set3: number | null;
  winner_side: "A" | "B" | null;
};
type ScheduleMatch = {
  id: string;
  day_number: number;
  time_label: string;
  court_label: string;
  format: string;
  tier_rule: string | null;
  team_a_id: string | null;
  team_b_id: string | null;
  team_a_label: string | null;
  team_b_label: string | null;
  external_match_id: string | null;
  sort_order: number;
  score: Score | null;
};
type Metrics = { wins: number; losses: number; setsWon: number; setsLost: number; gamesWon: number; gamesLost: number };
type Standing = Team & Metrics & { seed: number; setPercentage: number; gamePercentage: number };
type NodeState = { key: string; teamA: Team | null; teamB: Team | null; winner: Team | null; loser: Team | null };
type Decision = { bracket_node_key: CoinTossNodeKey; winning_team_id: string; format_choice: FormatChoice };
type MatchDefinition = { format: "Singles" | "Doubles"; tiers: number[]; tierRule: string; timeLabel?: string; startTime?: string; courtLabel?: string };

const coinTossKeys = new Set<CoinTossNodeKey>(["reentry1", "reentry2", "semifinal1", "semifinal2"]);

function one<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function emptyMetrics(): Metrics {
  return { wins: 0, losses: 0, setsWon: 0, setsLost: 0, gamesWon: 0, gamesLost: 0 };
}

function addScore(metrics: Metrics, score: Score | null, side: "A" | "B") {
  if (!score?.winner_side) return;
  if (score.winner_side === side) metrics.wins += 1;
  else metrics.losses += 1;
  const ownScores = side === "A"
    ? [score.side_a_set1, score.side_a_set2, score.side_a_set3]
    : [score.side_b_set1, score.side_b_set2, score.side_b_set3];
  const opponentScores = side === "A"
    ? [score.side_b_set1, score.side_b_set2, score.side_b_set3]
    : [score.side_a_set1, score.side_a_set2, score.side_a_set3];
  ownScores.forEach((own, index) => {
    const opponent = opponentScores[index];
    if (own == null || opponent == null || own === opponent) return;
    if (own > opponent) metrics.setsWon += 1;
    else metrics.setsLost += 1;
    if (index < 2) {
      metrics.gamesWon += own;
      metrics.gamesLost += opponent;
    } else if (own > opponent) {
      metrics.gamesWon += 1;
    } else {
      metrics.gamesLost += 1;
    }
  });
}

function rankDayOneTeams(teams: Team[], matches: ScheduleMatch[]) {
  const teamById = new Map(teams.map((team) => [team.id, team]));
  const matchupGroups = new Map<string, ScheduleMatch[]>();
  matches.forEach((match) => {
    const pair = [match.team_a_id || match.team_a_label || "team-a", match.team_b_id || match.team_b_label || "team-b"].sort().join(":");
    const key = `${match.time_label}:${pair}`;
    matchupGroups.set(key, [...(matchupGroups.get(key) || []), match]);
  });
  const teamRecords = new Map<string, { wins: number; losses: number }>(teams.map((team) => [team.id, { wins: 0, losses: 0 }]));
  matchupGroups.forEach((teamMatches) => {
    const firstMatch = teamMatches[0];
    const teamA = firstMatch.team_a_id ? teamById.get(firstMatch.team_a_id) || null : null;
    const teamB = firstMatch.team_b_id ? teamById.get(firstMatch.team_b_id) || null : null;
    const result = getTeamTieResult(teamA, teamB, teamMatches, 3);
    if (!result.winner || !result.loser) return;
    const winnerRecord = teamRecords.get(result.winner.id);
    const loserRecord = teamRecords.get(result.loser.id);
    if (winnerRecord) winnerRecord.wins += 1;
    if (loserRecord) loserRecord.losses += 1;
  });
  const standings = teams.map((team) => {
    const metrics = emptyMetrics();
    const teamMatches = matches.filter((match) => match.team_a_id === team.id || match.team_b_id === team.id);
    teamMatches.forEach((match) => addScore(metrics, match.score, match.team_a_id === team.id ? "A" : "B"));
    const totalSets = metrics.setsWon + metrics.setsLost;
    const totalGames = metrics.gamesWon + metrics.gamesLost;
    return {
      ...team,
      ...metrics,
      wins: teamRecords.get(team.id)?.wins || 0,
      losses: teamRecords.get(team.id)?.losses || 0,
      seed: 0,
      scheduledMatches: teamMatches.length,
      completedMatches: teamMatches.filter((match) => Boolean(match.score?.winner_side)).length,
      setPercentage: totalSets ? (metrics.setsWon / totalSets) * 100 : 0,
      gamePercentage: totalGames ? (metrics.gamesWon / totalGames) * 100 : 0
    };
  }).sort((left, right) => right.wins - left.wins
    || right.setPercentage - left.setPercentage
    || right.gamePercentage - left.gamePercentage
    || left.sortOrder - right.sortOrder
    || left.name.localeCompare(right.name));
  const allComplete = standings.length === 8 && standings.every((standing) => standing.scheduledMatches > 0 && standing.completedMatches === standing.scheduledMatches);
  const hasUnresolvedTie = allComplete && standings.some((standing, index) => {
    const next = standings[index + 1];
    return Boolean(next
      && standing.wins === next.wins
      && Math.abs(standing.setPercentage - next.setPercentage) < 0.0001
      && Math.abs(standing.gamePercentage - next.gamePercentage) < 0.0001);
  });
  return {
    final: allComplete && !hasUnresolvedTie,
    standings: standings.map((standing, index) => ({ ...standing, seed: index + 1 })) as Standing[]
  };
}

function getTeamTieResult(teamA: Team | null, teamB: Team | null, matches: ScheduleMatch[], expectedMatches: number) {
  if (!teamA || !teamB) return { winner: null, loser: null };
  const metricsA = emptyMetrics();
  const metricsB = emptyMetrics();
  matches.forEach((match) => {
    addScore(metricsA, match.score, match.team_a_id === teamA.id ? "A" : "B");
    addScore(metricsB, match.score, match.team_a_id === teamB.id ? "A" : "B");
  });
  const completed = matches.filter((match) => Boolean(match.score?.winner_side)).length;
  const remaining = Math.max(0, matches.length - completed);
  const hasFullCard = matches.length >= expectedMatches;
  const clinched = hasFullCard && Math.abs(metricsA.wins - metricsB.wins) > remaining;
  const allComplete = hasFullCard && completed === matches.length;
  let winner: Team | null = null;
  if (clinched || (allComplete && metricsA.wins !== metricsB.wins)) {
    winner = metricsA.wins > metricsB.wins ? teamA : teamB;
  } else if (allComplete) {
    const setsA = metricsA.setsWon + metricsA.setsLost;
    const setsB = metricsB.setsWon + metricsB.setsLost;
    const setPercentageA = setsA ? metricsA.setsWon / setsA : 0;
    const setPercentageB = setsB ? metricsB.setsWon / setsB : 0;
    if (Math.abs(setPercentageA - setPercentageB) > 0.0001) {
      winner = setPercentageA > setPercentageB ? teamA : teamB;
    } else {
      const gamesA = metricsA.gamesWon + metricsA.gamesLost;
      const gamesB = metricsB.gamesWon + metricsB.gamesLost;
      const gamePercentageA = gamesA ? metricsA.gamesWon / gamesA : 0;
      const gamePercentageB = gamesB ? metricsB.gamesWon / gamesB : 0;
      if (Math.abs(gamePercentageA - gamePercentageB) > 0.0001) winner = gamePercentageA > gamePercentageB ? teamA : teamB;
    }
  }
  return { winner, loser: winner ? (winner.id === teamA.id ? teamB : teamA) : null };
}

function getNodeMatches(matches: ScheduleMatch[], nodeKey: string) {
  return matches.filter((match) => match.external_match_id?.startsWith(`day2:${nodeKey}:`));
}

function makeNode(matches: ScheduleMatch[], key: string, teamA: Team | null, teamB: Team | null, expectedMatches = 3): NodeState {
  const result = getTeamTieResult(teamA, teamB, getNodeMatches(matches, key), expectedMatches);
  return { key, teamA, teamB, winner: result.winner, loser: result.loser };
}

function buildBracket(standings: Standing[], dayTwoMatches: ScheduleMatch[]) {
  const seed = (number: number) => standings[number - 1] || null;
  const qf1 = makeNode(dayTwoMatches, "qf1", seed(1), seed(8));
  const qf2 = makeNode(dayTwoMatches, "qf2", seed(4), seed(5));
  const qf3 = makeNode(dayTwoMatches, "qf3", seed(3), seed(6));
  const qf4 = makeNode(dayTwoMatches, "qf4", seed(2), seed(7));
  const survival1 = makeNode(dayTwoMatches, "survival1", qf1.loser, qf2.loser);
  const survival2 = makeNode(dayTwoMatches, "survival2", qf3.loser, qf4.loser);
  const advantage1 = makeNode(dayTwoMatches, "advantage1", qf1.winner, qf2.winner);
  const advantage2 = makeNode(dayTwoMatches, "advantage2", qf3.winner, qf4.winner);
  const reentry1 = makeNode(dayTwoMatches, "reentry1", survival1.winner, advantage2.loser);
  const reentry2 = makeNode(dayTwoMatches, "reentry2", survival2.winner, advantage1.loser);
  const semifinal1 = makeNode(dayTwoMatches, "semifinal1", advantage1.winner, reentry2.winner);
  const semifinal2 = makeNode(dayTwoMatches, "semifinal2", advantage2.winner, reentry1.winner);
  const final = makeNode(dayTwoMatches, "final", semifinal1.winner, semifinal2.winner, 3);
  return { qf1, qf2, qf3, qf4, survival1, survival2, advantage1, advantage2, reentry1, reentry2, semifinal1, semifinal2, final };
}

function standardDefinitions(choice: FormatChoice): MatchDefinition[] {
  return choice === "tiers_1_2_singles"
    ? [
        { format: "Singles", tiers: [1], tierRule: "Tier 1 Singles" },
        { format: "Singles", tiers: [2], tierRule: "Tier 2 Singles" },
        { format: "Doubles", tiers: [3, 4], tierRule: "Tier 3/4 Doubles" }
      ]
    : [
        { format: "Doubles", tiers: [1, 2], tierRule: "Tier 1/2 Doubles" },
        { format: "Singles", tiers: [3], tierRule: "Tier 3 Singles" },
        { format: "Singles", tiers: [4], tierRule: "Tier 4 Singles" }
      ];
}

function finalDefinitions(): MatchDefinition[] {
  return [
    { format: "Singles", tiers: [1], tierRule: "Tier 1 Singles", timeLabel: "4:00 PM", startTime: "16:00", courtLabel: "Court 6" },
    { format: "Singles", tiers: [2], tierRule: "Tier 2 Singles", timeLabel: "4:00 PM", startTime: "16:00", courtLabel: "Court 7" },
    { format: "Doubles", tiers: [3, 4], tierRule: "Tier 3/4 Doubles", timeLabel: "4:00 PM", startTime: "16:00", courtLabel: "Court 8" }
  ];
}

const nodeSchedule: Record<string, { phase: string; timeLabel: string; startTime: string; podLabel: string; courts: string[]; sortBase: number }> = {
  qf1: { phase: "Quarterfinal", timeLabel: "9:00 AM", startTime: "09:00", podLabel: "Pod B (6-8)", courts: ["Court 6", "Court 7", "Court 8"], sortBase: 1000 },
  qf2: { phase: "Quarterfinal", timeLabel: "9:00 AM", startTime: "09:00", podLabel: "Pod C (9-11)", courts: ["Court 9", "Court 10", "Court 11"], sortBase: 1010 },
  qf3: { phase: "Quarterfinal", timeLabel: "10:10 AM", startTime: "10:10", podLabel: "Pod B (6-8)", courts: ["Court 6", "Court 7", "Court 8"], sortBase: 1020 },
  qf4: { phase: "Quarterfinal", timeLabel: "10:10 AM", startTime: "10:10", podLabel: "Pod C (9-11)", courts: ["Court 9", "Court 10", "Court 11"], sortBase: 1030 },
  survival1: { phase: "Survival", timeLabel: "11:20 AM", startTime: "11:20", podLabel: "Pod B (6-8)", courts: ["Court 6", "Court 7", "Court 8"], sortBase: 1040 },
  survival2: { phase: "Survival", timeLabel: "11:20 AM", startTime: "11:20", podLabel: "Pod C (9-11)", courts: ["Court 9", "Court 10", "Court 11"], sortBase: 1050 },
  advantage1: { phase: "Advantage", timeLabel: "12:30 PM", startTime: "12:30", podLabel: "Pod B (6-8)", courts: ["Court 6", "Court 7", "Court 8"], sortBase: 1060 },
  advantage2: { phase: "Advantage", timeLabel: "12:30 PM", startTime: "12:30", podLabel: "Pod C (9-11)", courts: ["Court 9", "Court 10", "Court 11"], sortBase: 1070 },
  reentry1: { phase: "Re-entry", timeLabel: "1:40 PM", startTime: "13:40", podLabel: "Pod B (6-8)", courts: ["Court 6", "Court 7", "Court 8"], sortBase: 1080 },
  reentry2: { phase: "Re-entry", timeLabel: "1:40 PM", startTime: "13:40", podLabel: "Pod C (9-11)", courts: ["Court 9", "Court 10", "Court 11"], sortBase: 1090 },
  semifinal1: { phase: "Semifinal", timeLabel: "2:50 PM", startTime: "14:50", podLabel: "Pod C (9-11)", courts: ["Court 9", "Court 10", "Court 11"], sortBase: 1100 },
  semifinal2: { phase: "Semifinal", timeLabel: "2:50 PM", startTime: "14:50", podLabel: "Pod B (6-8)", courts: ["Court 6", "Court 7", "Court 8"], sortBase: 1110 },
  final: { phase: "Final", timeLabel: "4:00 PM", startTime: "16:00", podLabel: "Championship courts", courts: ["Court 6", "Court 7", "Court 8"], sortBase: 1120 }
};

function effectiveMembers(team: Team) {
  const assignedTiers = new Set(team.members.map((member) => member.tier));
  if ([1, 2, 3, 4].every((tier) => assignedTiers.has(tier))) return team.members.slice().sort((left, right) => left.tier - right.tier || left.draftOrder - right.draftOrder);
  return team.members.slice()
    .sort((left, right) => left.draftOrder - right.draftOrder || left.name.localeCompare(right.name))
    .map((member, index) => ({ ...member, tier: index + 1 }));
}

function playersForTiers(team: Team, tiers: number[]) {
  const members = effectiveMembers(team);
  const players = tiers.map((tier) => members.find((member) => member.tier === tier)).filter(Boolean) as Member[];
  if (players.length !== tiers.length) throw new Error(`${team.name} is missing a player for Tier ${tiers.join("/")}.`);
  return players;
}

async function ensureNodeMatches(admin: NonNullable<ReturnType<typeof getSupabaseAdminClient>>, tournamentId: string, node: NodeState, definitions: MatchDefinition[], allMatches: ScheduleMatch[]) {
  if (!node.teamA || !node.teamB) return 0;
  const schedule = nodeSchedule[node.key];
  if (!schedule) return 0;
  let changes = 0;
  for (const [index, definition] of definitions.entries()) {
    const externalMatchId = `day2:${node.key}:${index + 1}`;
    const existing = allMatches.find((match) => match.external_match_id === externalMatchId);
    const existingHasScore = Boolean(existing?.score?.winner_side);
    if (existingHasScore && (existing?.team_a_id !== node.teamA.id || existing.team_b_id !== node.teamB.id)) {
      throw new Error(`${node.key} already has a submitted score for a different team pairing. An admin must review it.`);
    }
    const matchId = existing?.id || randomUUID();
    const matchPayload = {
      tournament_id: tournamentId,
      day_number: 2,
      day_label: "Day 2: Sun",
      start_time: definition.startTime || schedule.startTime,
      time_label: definition.timeLabel || schedule.timeLabel,
      court_label: definition.courtLabel || schedule.courts[index] || "Court TBD",
      pod_label: schedule.podLabel,
      format: definition.format,
      match_type: schedule.phase,
      match_color: null,
      tier_rule: definition.tierRule,
      team_a_id: node.teamA.id,
      team_b_id: node.teamB.id,
      team_a_sort_order: node.teamA.sortOrder,
      team_b_sort_order: node.teamB.sortOrder,
      team_a_label: node.teamA.name,
      team_b_label: node.teamB.name,
      external_match_id: externalMatchId,
      status: "scheduled",
      sort_order: schedule.sortBase + index,
      is_published: true
    };
    if (existing) {
      if (!existingHasScore || node.key === "semifinal1" || node.key === "semifinal2") {
        const updatePayload = existingHasScore
          ? { court_label: matchPayload.court_label, pod_label: matchPayload.pod_label }
          : matchPayload;
        const { error } = await admin.from("tournament_schedule_matches").update(updatePayload).eq("id", matchId);
        if (error) throw error;
      }
    } else {
      const { error } = await admin.from("tournament_schedule_matches").insert({ id: matchId, ...matchPayload });
      if (error) throw error;
      allMatches.push({ id: matchId, day_number: 2, time_label: matchPayload.time_label, court_label: matchPayload.court_label, format: matchPayload.format, tier_rule: matchPayload.tier_rule, team_a_id: node.teamA.id, team_b_id: node.teamB.id, team_a_label: node.teamA.name, team_b_label: node.teamB.name, external_match_id: externalMatchId, sort_order: matchPayload.sort_order, score: null });
    }
    if (!existingHasScore) {
      const { error: deleteError } = await admin.from("tournament_schedule_match_players").delete().eq("schedule_match_id", matchId);
      if (deleteError) throw deleteError;
      const playersA = playersForTiers(node.teamA, definition.tiers);
      const playersB = playersForTiers(node.teamB, definition.tiers);
      const participants = [
        ...playersA.map((player, slot) => ({ player, side: "A" as const, slot: slot + 1, team: node.teamA as Team })),
        ...playersB.map((player, slot) => ({ player, side: "B" as const, slot: slot + 1, team: node.teamB as Team }))
      ].map(({ player, side, slot, team }) => ({
        tournament_id: tournamentId,
        schedule_match_id: matchId,
        team_id: team.id,
        player_id: player.playerId,
        side,
        slot,
        tier_at_match: player.tier,
        source_player_name: player.name
      }));
      const { error: participantError } = await admin.from("tournament_schedule_match_players").insert(participants);
      if (participantError) throw participantError;
    }
    changes += 1;
  }
  return changes;
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Sign in is required." }, { status: 401 });
  const supabase = getSupabaseServerClient();
  const admin = getSupabaseAdminClient();
  if (!supabase || !admin) return NextResponse.json({ error: "Supabase server configuration is missing." }, { status: 500 });
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

  const body = await request.json().catch(() => ({})) as { tournamentId?: string; action?: string; nodeKey?: string; winningTeamId?: string; formatChoice?: string };
  if (!body.tournamentId) return NextResponse.json({ error: "Tournament id is required." }, { status: 400 });

  try {
    const [{ data: player }, { data: adminRole }] = await Promise.all([
      admin.from("players").select("id,is_admin").eq("auth_user_id", userData.user.id).maybeSingle(),
      admin.from("member_roles").select("auth_user_id").eq("auth_user_id", userData.user.id).eq("role", "admin").maybeSingle()
    ]);
    const isAdmin = Boolean(adminRole || player?.is_admin);
    const { data: registration } = player
      ? await admin.from("tournament_registrations").select("id").eq("tournament_id", body.tournamentId).eq("player_id", player.id).neq("status", "cancelled").in("payment_status", ["paid", "waived"]).maybeSingle()
      : { data: null };
    if (!isAdmin && (!player || !registration)) return NextResponse.json({ error: "Registered tournament player access required." }, { status: 403 });

    const [teamRowsResult, matchRowsResult, scoreRowsResult, decisionRowsResult] = await Promise.all([
      admin.from("tournament_teams").select("id,name,sort_order,tournament_team_members(player_id,tier_at_draft,draft_order,players(id,full_name))").eq("tournament_id", body.tournamentId).eq("is_published", true).order("sort_order"),
      admin.from("tournament_schedule_matches").select("id,day_number,time_label,court_label,format,tier_rule,team_a_id,team_b_id,team_a_label,team_b_label,external_match_id,sort_order").eq("tournament_id", body.tournamentId).eq("is_published", true).order("sort_order"),
      admin.from("tournament_match_scores").select("schedule_match_id,side_a_set1,side_b_set1,side_a_set2,side_b_set2,side_a_set3,side_b_set3,winner_side").eq("tournament_id", body.tournamentId),
      admin.from("tournament_day2_coin_tosses").select("bracket_node_key,winning_team_id,format_choice").eq("tournament_id", body.tournamentId)
    ]);
    const firstError = teamRowsResult.error || matchRowsResult.error || scoreRowsResult.error || decisionRowsResult.error;
    if (firstError) throw firstError;

    const teams: Team[] = (teamRowsResult.data || []).map((team) => ({
      id: team.id,
      name: team.name || "Team",
      sortOrder: team.sort_order || 0,
      members: (Array.isArray(team.tournament_team_members) ? team.tournament_team_members : team.tournament_team_members ? [team.tournament_team_members] : []).map((member) => {
        const memberPlayer = one(member.players);
        return { playerId: member.player_id || memberPlayer?.id || null, name: memberPlayer?.full_name || "Player", tier: Number(member.tier_at_draft || 99), draftOrder: Number(member.draft_order || 99) };
      })
    }));
    const scores = new Map<string, Score>((scoreRowsResult.data || []).map((score) => [score.schedule_match_id, score as Score]));
    const matches: ScheduleMatch[] = (matchRowsResult.data || []).map((match) => ({ ...match, score: scores.get(match.id) || null }));
    const ranking = rankDayOneTeams(teams, matches.filter((match) => match.day_number === 1));
    if (!ranking.final) return NextResponse.json({ synced: false, reason: "Day 1 seeding is not final yet." });
    let bracket = buildBracket(ranking.standings, matches.filter((match) => match.day_number === 2));
    const decisions = new Map<string, Decision>((decisionRowsResult.data || []).map((decision) => [decision.bracket_node_key, decision as Decision]));

    if (body.action === "coin-toss") {
      if (!coinTossKeys.has(body.nodeKey as CoinTossNodeKey)) return NextResponse.json({ error: "This round does not use a coin toss." }, { status: 400 });
      if (body.formatChoice !== "tiers_1_2_singles" && body.formatChoice !== "tiers_3_4_singles") return NextResponse.json({ error: "Choose which tiers play singles." }, { status: 400 });
      const node = bracket[body.nodeKey as CoinTossNodeKey];
      const knownTeamIds = [node.teamA?.id, node.teamB?.id].filter(Boolean) as string[];
      if (!body.winningTeamId || !knownTeamIds.includes(body.winningTeamId)) return NextResponse.json({ error: "Choose a team that has reached this round." }, { status: 400 });
      if (!isAdmin && player) {
        const { data: membership } = await admin.from("tournament_team_members").select("id,team_id").eq("player_id", player.id).in("team_id", knownTeamIds).limit(1).maybeSingle();
        if (!membership) return NextResponse.json({ error: "Only a player on a team in this round can enter its coin toss." }, { status: 403 });
      }
      const decision: Decision = { bracket_node_key: body.nodeKey as CoinTossNodeKey, winning_team_id: body.winningTeamId, format_choice: body.formatChoice };
      const { error } = await admin.from("tournament_day2_coin_tosses").upsert({
        tournament_id: body.tournamentId,
        ...decision,
        submitted_by: player?.id || null,
        decided_at: new Date().toISOString()
      }, { onConflict: "tournament_id,bracket_node_key" });
      if (error) throw error;
      decisions.set(decision.bracket_node_key, decision);
    }

    let materialized = 0;
    const syncNode = async (node: NodeState, choice: FormatChoice | null, final = false) => {
      if (!node.teamA || !node.teamB || (!choice && !final)) return;
      materialized += await ensureNodeMatches(admin, body.tournamentId as string, node, final ? finalDefinitions() : standardDefinitions(choice as FormatChoice), matches);
    };
    await syncNode(bracket.qf1, "tiers_1_2_singles");
    await syncNode(bracket.qf2, "tiers_1_2_singles");
    await syncNode(bracket.qf3, "tiers_1_2_singles");
    await syncNode(bracket.qf4, "tiers_1_2_singles");
    await syncNode(bracket.survival1, "tiers_3_4_singles");
    await syncNode(bracket.survival2, "tiers_3_4_singles");
    await syncNode(bracket.advantage1, "tiers_3_4_singles");
    await syncNode(bracket.advantage2, "tiers_3_4_singles");
    for (const key of ["reentry1", "reentry2", "semifinal1", "semifinal2"] as CoinTossNodeKey[]) {
      const node = bracket[key];
      const decision = decisions.get(key);
      const validDecision = decision && [node.teamA?.id, node.teamB?.id].filter(Boolean).includes(decision.winning_team_id) ? decision : null;
      await syncNode(node, validDecision?.format_choice || null);
    }
    await syncNode(bracket.final, null, true);

    bracket = buildBracket(ranking.standings, matches.filter((match) => match.day_number === 2));
    return NextResponse.json({ synced: true, materialized, action: body.action || "sync", seeds: ranking.standings.map((standing) => ({ seed: standing.seed, teamId: standing.id, teamName: standing.name })), bracketReady: Boolean(bracket.qf1.teamA && bracket.qf1.teamB) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Day 2 could not be updated.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
