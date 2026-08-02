import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const CONFIRMATION_FLAG = "--confirm-live-test";
const KEEP_DATA_FLAG = "--keep-test-data";
const RESET_DATA_FLAG = "--reset-kept-test-data";
const DAY_ONE_QF_FLAG = "--day-one-and-qf";
const SIMULATION_PREFIX = "day2:";
const REPORT_DIRECTORY = resolve(process.cwd(), "artifacts");
const REPORT_PATH = resolve(REPORT_DIRECTORY, "mrsa-2026-complete-test-results.csv");
const STATE_PATH = resolve(REPORT_DIRECTORY, "mrsa-2026-simulation-state.json");

if (!process.argv.includes(CONFIRMATION_FLAG)) {
  throw new Error(`Refusing to touch live tournament data without ${CONFIRMATION_FLAG}.`);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const insertedDayOneScoreIds = [];
const insertedDayTwoMatchIds = [];
let tournamentId = "";

function single(value) {
  return Array.isArray(value) ? value[0] : value;
}

function requireData(result, context) {
  if (result.error) throw new Error(`${context}: ${result.error.message}`);
  return result.data || [];
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function scoreFor(winnerSide, variant = 0) {
  const loserSide = winnerSide === "A" ? "B" : "A";
  const tieBreaker = variant % 4 === 3;
  const closeMatch = variant % 3 === 2;
  const winningSetOne = 4;
  const losingSetOne = closeMatch ? 3 : variant % 3;
  const winningSetTwo = 4;
  const losingSetTwo = closeMatch ? 2 : (variant + 1) % 4;
  const values = tieBreaker
    ? { winnerSet1: 4, loserSet1: 2, winnerSet2: 3, loserSet2: 4, winnerSet3: 10, loserSet3: 8 }
    : { winnerSet1: winningSetOne, loserSet1: losingSetOne, winnerSet2: winningSetTwo, loserSet2: losingSetTwo, winnerSet3: null, loserSet3: null };
  const sideAIsWinner = winnerSide === "A";
  return {
    side_a_set1: sideAIsWinner ? values.winnerSet1 : values.loserSet1,
    side_b_set1: sideAIsWinner ? values.loserSet1 : values.winnerSet1,
    side_a_set2: sideAIsWinner ? values.winnerSet2 : values.loserSet2,
    side_b_set2: sideAIsWinner ? values.loserSet2 : values.winnerSet2,
    side_a_set3: sideAIsWinner ? values.winnerSet3 : values.loserSet3,
    side_b_set3: sideAIsWinner ? values.loserSet3 : values.winnerSet3,
    winner_side: winnerSide,
    loser_side: loserSide
  };
}

function emptyMetrics() {
  return { wins: 0, losses: 0, setsWon: 0, setsLost: 0, gamesWon: 0, gamesLost: 0 };
}

function addScore(metrics, score, side) {
  if (!score?.winner_side) return;
  if (score.winner_side === side) metrics.wins += 1;
  else metrics.losses += 1;
  const own = side === "A"
    ? [score.side_a_set1, score.side_a_set2, score.side_a_set3]
    : [score.side_b_set1, score.side_b_set2, score.side_b_set3];
  const opponent = side === "A"
    ? [score.side_b_set1, score.side_b_set2, score.side_b_set3]
    : [score.side_a_set1, score.side_a_set2, score.side_a_set3];
  own.forEach((value, index) => {
    const opposingValue = opponent[index];
    if (value == null || opposingValue == null || value === opposingValue) return;
    if (value > opposingValue) metrics.setsWon += 1;
    else metrics.setsLost += 1;
    if (index < 2) {
      metrics.gamesWon += value;
      metrics.gamesLost += opposingValue;
    } else if (value > opposingValue) {
      metrics.gamesWon += 1;
    } else {
      metrics.gamesLost += 1;
    }
  });
}

function rankTeams(teams, dayOneMatches, scoresByMatch) {
  const matchupGroups = new Map();
  dayOneMatches.forEach((match) => {
    const pair = [match.team_a_id, match.team_b_id].sort().join(":");
    const key = `${match.time_label}:${pair}`;
    matchupGroups.set(key, [...(matchupGroups.get(key) || []), match]);
  });
  const teamRecords = new Map(teams.map((team) => [team.id, { wins: 0, losses: 0 }]));
  matchupGroups.forEach((matches) => {
    const firstMatch = matches[0];
    let winsA = 0;
    let winsB = 0;
    matches.forEach((match) => {
      const score = scoresByMatch.get(match.id);
      if (score?.winner_side === "A") winsA += 1;
      if (score?.winner_side === "B") winsB += 1;
    });
    if (matches.length < 3 || winsA === winsB) return;
    const winnerId = winsA > winsB ? firstMatch.team_a_id : firstMatch.team_b_id;
    const loserId = winsA > winsB ? firstMatch.team_b_id : firstMatch.team_a_id;
    teamRecords.get(winnerId).wins += 1;
    teamRecords.get(loserId).losses += 1;
  });
  return teams.map((team) => {
    const metrics = emptyMetrics();
    dayOneMatches.forEach((match) => {
      if (match.team_a_id === team.id) addScore(metrics, scoresByMatch.get(match.id), "A");
      if (match.team_b_id === team.id) addScore(metrics, scoresByMatch.get(match.id), "B");
    });
    const totalSets = metrics.setsWon + metrics.setsLost;
    const totalGames = metrics.gamesWon + metrics.gamesLost;
    return {
      ...team,
      ...metrics,
      wins: teamRecords.get(team.id)?.wins || 0,
      losses: teamRecords.get(team.id)?.losses || 0,
      setPercentage: totalSets ? (metrics.setsWon / totalSets) * 100 : 0,
      gamePercentage: totalGames ? (metrics.gamesWon / totalGames) * 100 : 0
    };
  }).sort((left, right) => right.wins - left.wins
    || right.setPercentage - left.setPercentage
    || right.gamePercentage - left.gamePercentage
    || left.sort_order - right.sort_order
    || left.name.localeCompare(right.name))
    .map((team, index) => ({ ...team, seed: index + 1 }));
}

function teamMembers(team) {
  const members = (team.tournament_team_members || []).map((member) => {
    const player = single(member.players) || {};
    return {
      playerId: member.player_id || player.id || null,
      name: player.full_name || `Tier ${member.tier_at_draft || "?"} player`,
      tier: Number(member.tier_at_draft || 99),
      draftOrder: Number(member.draft_order || 99)
    };
  });
  const assignedTiers = new Set(members.map((member) => member.tier));
  const hasCompleteTierOrder = [1, 2, 3, 4].every((tier) => assignedTiers.has(tier));
  if (hasCompleteTierOrder) return members.sort((left, right) => left.tier - right.tier || left.draftOrder - right.draftOrder);
  return members
    .sort((left, right) => left.draftOrder - right.draftOrder || left.name.localeCompare(right.name))
    .map((member, index) => ({ ...member, tier: index + 1 }));
}

function playersForTier(team, tiers) {
  const members = teamMembers(team);
  const selected = tiers.map((tier) => members.find((member) => member.tier === tier)).filter(Boolean);
  if (selected.length !== tiers.length) {
    throw new Error(`${team.name} does not have one assigned player for every requested tier (${tiers.join(", ")}).`);
  }
  return selected;
}

function standardMatchDefinitions(useUpperTierDoubles) {
  return useUpperTierDoubles
    ? [
        { format: "Doubles", tiers: [1, 2], tierRule: "Tier 1/2 Doubles" },
        { format: "Singles", tiers: [3], tierRule: "Tier 3 Singles" },
        { format: "Singles", tiers: [4], tierRule: "Tier 4 Singles" }
      ]
    : [
        { format: "Singles", tiers: [1], tierRule: "Tier 1 Singles" },
        { format: "Singles", tiers: [2], tierRule: "Tier 2 Singles" },
        { format: "Doubles", tiers: [3, 4], tierRule: "Tier 3/4 Doubles" }
      ];
}

function finalMatchDefinitions() {
  return [
    { format: "Doubles", tiers: [1, 2], tierRule: "Tier 1/2 Doubles" },
    { format: "Doubles", tiers: [3, 4], tierRule: "Tier 3/4 Doubles" },
    { format: "Singles", tiers: [1], tierRule: "Tier 1 Singles" },
    { format: "Singles", tiers: [2], tierRule: "Tier 2 Singles" },
    { format: "Singles", tiers: [3], tierRule: "Tier 3 Singles" },
    { format: "Singles", tiers: [4], tierRule: "Tier 4 Singles" }
  ];
}

function formatScore(score) {
  if (!score) return "Paused after championship clinched";
  const sets = [
    `${score.side_a_set1}-${score.side_b_set1}`,
    `${score.side_a_set2}-${score.side_b_set2}`
  ];
  if (score.side_a_set3 != null && score.side_b_set3 != null) sets.push(`[${score.side_a_set3}-${score.side_b_set3}]`);
  return sets.join(" ");
}

function buildDayTwoMatch({ nodeKey, phase, timeLabel, startTime, podLabel, courts, teamA, teamB, winnerTeamId, useUpperTierDoubles, sortBase, final = false, scoreMatches = true }) {
  const definitions = final ? finalMatchDefinitions() : standardMatchDefinitions(useUpperTierDoubles);
  const winnerSide = winnerTeamId === teamA.id ? "A" : "B";
  const loserSide = winnerSide === "A" ? "B" : "A";
  const outcomes = !scoreMatches
    ? definitions.map(() => null)
    : final
    ? [winnerSide, loserSide, winnerSide, winnerSide, winnerSide, null]
    : [winnerSide, loserSide, winnerSide];
  const matches = [];
  const participants = [];
  const scores = [];

  definitions.forEach((definition, index) => {
    const id = randomUUID();
    const score = outcomes[index] ? scoreFor(outcomes[index], sortBase + index) : null;
    const playersA = playersForTier(teamA, definition.tiers);
    const playersB = playersForTier(teamB, definition.tiers);
    const courtLabel = courts[index] || courts.at(-1) || "Court TBD";
    const matchTimeLabel = final && index >= 2 ? "5:10 PM" : timeLabel;
    const matchStartTime = final && index >= 2 ? "17:10" : startTime;
    matches.push({
      id,
      tournament_id: tournamentId,
      day_number: 2,
      day_label: "Day 2: Sun",
      start_time: matchStartTime,
      time_label: matchTimeLabel,
      court_label: courtLabel,
      pod_label: podLabel,
      format: definition.format,
      match_type: phase,
      match_color: null,
      tier_rule: definition.tierRule,
      team_a_id: teamA.id,
      team_b_id: teamB.id,
      team_a_sort_order: teamA.sort_order,
      team_b_sort_order: teamB.sort_order,
      team_a_label: teamA.name,
      team_b_label: teamB.name,
      external_match_id: `${SIMULATION_PREFIX}${nodeKey}:${index + 1}`,
      status: score ? "completed" : scoreMatches && final ? "paused" : "scheduled",
      sort_order: sortBase + index,
      is_published: true
    });
    [...playersA.map((player) => ({ player, side: "A", team: teamA })), ...playersB.map((player) => ({ player, side: "B", team: teamB }))].forEach(({ player, side, team }) => {
      const sidePlayers = side === "A" ? playersA : playersB;
      participants.push({
        tournament_id: tournamentId,
        schedule_match_id: id,
        team_id: team.id,
        player_id: player.playerId,
        side,
        slot: sidePlayers.indexOf(player) + 1,
        tier_at_match: player.tier,
        source_player_name: player.name
      });
    });
    if (score) {
      scores.push({
        id: randomUUID(),
        tournament_id: tournamentId,
        schedule_match_id: id,
        side_a_set1: score.side_a_set1,
        side_b_set1: score.side_b_set1,
        side_a_set2: score.side_a_set2,
        side_b_set2: score.side_b_set2,
        side_a_set3: score.side_a_set3,
        side_b_set3: score.side_b_set3,
        winner_side: score.winner_side,
        submitted_by: null,
        submitted_at: new Date().toISOString()
      });
    }
  });
  return { matches, participants, scores, winner: winnerTeamId === teamA.id ? teamA : teamB, loser: winnerTeamId === teamA.id ? teamB : teamA };
}

function reportRow({ day, time, phase, court, format, tierRule, teamA, playersA, teamB, playersB, score, winner, status }) {
  return [day, time, phase, court, format, tierRule, teamA, playersA, teamB, playersB, formatScore(score), winner, status].map(csvCell).join(",");
}

async function cleanup() {
  const cleanupErrors = [];
  if (insertedDayTwoMatchIds.length) {
    const result = await supabase.from("tournament_schedule_matches").delete().in("id", insertedDayTwoMatchIds);
    if (result.error) cleanupErrors.push(`Day 2 matches: ${result.error.message}`);
  }
  if (insertedDayOneScoreIds.length) {
    const result = await supabase.from("tournament_match_scores").delete().in("id", insertedDayOneScoreIds);
    if (result.error) cleanupErrors.push(`Day 1 scores: ${result.error.message}`);
  }
  if (cleanupErrors.length) throw new Error(`Simulation cleanup failed — ${cleanupErrors.join("; ")}`);
}

async function run() {
  const dayOneAndQfOnly = process.argv.includes(DAY_ONE_QF_FLAG);
  const tournament = single(requireData(await supabase
    .from("tournaments")
    .select("id,name,season_year,status,starts_on,ends_on")
    .in("status", ["registration_open", "registration_closed", "live"])
    .order("starts_on", { ascending: false })
    .limit(1), "Load active tournament"));
  if (!tournament) throw new Error("No active tournament was found.");
  tournamentId = tournament.id;

  const [teamRows, dayOneMatches, participantRows, existingScores, existingDayTwo] = await Promise.all([
    supabase.from("tournament_teams")
      .select("id,name,sort_order,is_published,tournament_team_members(id,player_id,tier_at_draft,draft_order,players(id,full_name))")
      .eq("tournament_id", tournamentId)
      .eq("is_published", true)
      .order("sort_order"),
    supabase.from("tournament_schedule_matches")
      .select("id,external_match_id,time_label,court_label,format,match_type,tier_rule,team_a_id,team_b_id,team_a_label,team_b_label,sort_order")
      .eq("tournament_id", tournamentId)
      .eq("day_number", 1)
      .eq("is_published", true)
      .order("sort_order"),
    supabase.from("tournament_schedule_match_players")
      .select("schedule_match_id,side,slot,source_player_name")
      .eq("tournament_id", tournamentId),
    supabase.from("tournament_match_scores").select("id").eq("tournament_id", tournamentId),
    supabase.from("tournament_schedule_matches").select("id,external_match_id").eq("tournament_id", tournamentId).eq("day_number", 2)
  ]);
  const teams = requireData(teamRows, "Load teams");
  const dayOne = requireData(dayOneMatches, "Load Day 1 matches");
  const participants = requireData(participantRows, "Load match participants");
  const scoresBefore = requireData(existingScores, "Check existing scores");
  const dayTwoBefore = requireData(existingDayTwo, "Check existing Day 2 matches");

  if (teams.length !== 8) throw new Error(`Expected 8 published teams, found ${teams.length}.`);
  if (dayOne.length !== 60) throw new Error(`Expected 60 published Day 1 matches, found ${dayOne.length}.`);
  if (scoresBefore.length) throw new Error(`Refusing to simulate because ${scoresBefore.length} score rows already exist.`);
  if (dayTwoBefore.length) throw new Error(`Refusing to simulate because ${dayTwoBefore.length} Day 2 player matches already exist.`);

  const teamById = new Map(teams.map((team) => [team.id, team]));
  const participantMap = new Map();
  participants.forEach((participant) => {
    const key = `${participant.schedule_match_id}:${participant.side}`;
    participantMap.set(key, [...(participantMap.get(key) || []), participant].sort((left, right) => left.slot - right.slot));
  });

  const dayOneScores = dayOne.map((match, index) => {
    const teamA = teamById.get(match.team_a_id);
    const teamB = teamById.get(match.team_b_id);
    if (!teamA || !teamB) throw new Error(`Day 1 match ${match.id} has an unresolved team.`);
    const winnerSide = teamA.sort_order <= teamB.sort_order ? "A" : "B";
    const score = scoreFor(winnerSide, index);
    const id = randomUUID();
    insertedDayOneScoreIds.push(id);
    return {
      id,
      tournament_id: tournamentId,
      schedule_match_id: match.id,
      side_a_set1: score.side_a_set1,
      side_b_set1: score.side_b_set1,
      side_a_set2: score.side_a_set2,
      side_b_set2: score.side_b_set2,
      side_a_set3: score.side_a_set3,
      side_b_set3: score.side_b_set3,
      winner_side: score.winner_side,
      submitted_by: null,
      submitted_at: new Date().toISOString()
    };
  });
  requireData(await supabase.from("tournament_match_scores").insert(dayOneScores), "Insert temporary Day 1 scores");

  const dayOneScoresByMatch = new Map(dayOneScores.map((score) => [score.schedule_match_id, score]));
  const standings = rankTeams(teams, dayOne, dayOneScoresByMatch);
  const seed = (number) => standings[number - 1];

  const nodeSpecs = [];
  const addNode = (spec) => {
    const node = buildDayTwoMatch(spec);
    nodeSpecs.push({ ...node, ...spec });
    return node;
  };

  const qf1 = addNode({ nodeKey: "qf1", phase: "Quarterfinal", timeLabel: "9:00 AM", startTime: "09:00", podLabel: "Pod B (6-8)", courts: ["Court 6", "Court 7", "Court 8"], teamA: seed(1), teamB: seed(8), winnerTeamId: seed(1).id, useUpperTierDoubles: false, sortBase: 1000, scoreMatches: !dayOneAndQfOnly });
  const qf2 = addNode({ nodeKey: "qf2", phase: "Quarterfinal", timeLabel: "9:00 AM", startTime: "09:00", podLabel: "Pod C (9-11)", courts: ["Court 9", "Court 10", "Court 11"], teamA: seed(4), teamB: seed(5), winnerTeamId: seed(4).id, useUpperTierDoubles: false, sortBase: 1010, scoreMatches: !dayOneAndQfOnly });
  const qf3 = addNode({ nodeKey: "qf3", phase: "Quarterfinal", timeLabel: "10:10 AM", startTime: "10:10", podLabel: "Pod B (6-8)", courts: ["Court 6", "Court 7", "Court 8"], teamA: seed(3), teamB: seed(6), winnerTeamId: seed(3).id, useUpperTierDoubles: false, sortBase: 1020, scoreMatches: !dayOneAndQfOnly });
  const qf4 = addNode({ nodeKey: "qf4", phase: "Quarterfinal", timeLabel: "10:10 AM", startTime: "10:10", podLabel: "Pod C (9-11)", courts: ["Court 9", "Court 10", "Court 11"], teamA: seed(2), teamB: seed(7), winnerTeamId: seed(2).id, useUpperTierDoubles: false, sortBase: 1030, scoreMatches: !dayOneAndQfOnly });
  let championship = null;
  if (!dayOneAndQfOnly) {
    const survival1 = addNode({ nodeKey: "survival1", phase: "Survival", timeLabel: "11:20 AM", startTime: "11:20", podLabel: "Pod B (6-8)", courts: ["Court 6", "Court 7", "Court 8"], teamA: qf1.loser, teamB: qf2.loser, winnerTeamId: qf1.loser.id, useUpperTierDoubles: true, sortBase: 1040 });
    const survival2 = addNode({ nodeKey: "survival2", phase: "Survival", timeLabel: "11:20 AM", startTime: "11:20", podLabel: "Pod C (9-11)", courts: ["Court 9", "Court 10", "Court 11"], teamA: qf3.loser, teamB: qf4.loser, winnerTeamId: qf3.loser.id, useUpperTierDoubles: true, sortBase: 1050 });
    const advantage1 = addNode({ nodeKey: "advantage1", phase: "Advantage", timeLabel: "12:30 PM", startTime: "12:30", podLabel: "Pod B (6-8)", courts: ["Court 6", "Court 7", "Court 8"], teamA: qf1.winner, teamB: qf2.winner, winnerTeamId: qf1.winner.id, useUpperTierDoubles: true, sortBase: 1060 });
    const advantage2 = addNode({ nodeKey: "advantage2", phase: "Advantage", timeLabel: "12:30 PM", startTime: "12:30", podLabel: "Pod C (9-11)", courts: ["Court 9", "Court 10", "Court 11"], teamA: qf3.winner, teamB: qf4.winner, winnerTeamId: qf3.winner.id, useUpperTierDoubles: true, sortBase: 1070 });
    const reentry1 = addNode({ nodeKey: "reentry1", phase: "Re-entry", timeLabel: "1:40 PM", startTime: "13:40", podLabel: "Pod B (6-8)", courts: ["Court 6", "Court 7", "Court 8"], teamA: survival1.winner, teamB: advantage2.loser, winnerTeamId: survival1.winner.id, useUpperTierDoubles: false, sortBase: 1080 });
    const reentry2 = addNode({ nodeKey: "reentry2", phase: "Re-entry", timeLabel: "1:40 PM", startTime: "13:40", podLabel: "Pod C (9-11)", courts: ["Court 9", "Court 10", "Court 11"], teamA: survival2.winner, teamB: advantage1.loser, winnerTeamId: survival2.winner.id, useUpperTierDoubles: true, sortBase: 1090 });
    const semifinal1 = addNode({ nodeKey: "semifinal1", phase: "Semifinal", timeLabel: "2:50 PM", startTime: "14:50", podLabel: "Pod B (6-8)", courts: ["Court 6", "Court 7", "Court 8"], teamA: advantage1.winner, teamB: reentry2.winner, winnerTeamId: advantage1.winner.id, useUpperTierDoubles: true, sortBase: 1100 });
    const semifinal2 = addNode({ nodeKey: "semifinal2", phase: "Semifinal", timeLabel: "2:50 PM", startTime: "14:50", podLabel: "Pod C (9-11)", courts: ["Court 9", "Court 10", "Court 11"], teamA: advantage2.winner, teamB: reentry1.winner, winnerTeamId: advantage2.winner.id, useUpperTierDoubles: false, sortBase: 1110 });
    championship = addNode({ nodeKey: "final", phase: "Final", timeLabel: "4:00 PM", startTime: "16:00", podLabel: "Championship courts", courts: ["Court 6", "Court 7", "Court 6", "Court 7", "Court 8", "Court 9"], teamA: semifinal1.winner, teamB: semifinal2.winner, winnerTeamId: semifinal1.winner.id, useUpperTierDoubles: true, sortBase: 1120, final: true });
  }

  const dayTwoMatchRows = nodeSpecs.flatMap((node) => node.matches);
  const dayTwoParticipantRows = nodeSpecs.flatMap((node) => node.participants);
  const dayTwoScoreRows = nodeSpecs.flatMap((node) => node.scores);
  insertedDayTwoMatchIds.push(...dayTwoMatchRows.map((match) => match.id));
  requireData(await supabase.from("tournament_schedule_matches").insert(dayTwoMatchRows), "Insert temporary Day 2 matches");
  requireData(await supabase.from("tournament_schedule_match_players").insert(dayTwoParticipantRows), "Insert temporary Day 2 participants");
  requireData(await supabase.from("tournament_match_scores").insert(dayTwoScoreRows), "Insert temporary Day 2 scores");

  const verification = await Promise.all([
    supabase.from("tournament_match_scores").select("id", { count: "exact", head: true }).eq("tournament_id", tournamentId),
    supabase.from("tournament_schedule_matches").select("id", { count: "exact", head: true }).eq("tournament_id", tournamentId).eq("day_number", 2),
    supabase.from("tournament_schedule_match_players").select("id", { count: "exact", head: true }).eq("tournament_id", tournamentId).in("schedule_match_id", insertedDayTwoMatchIds)
  ]);
  verification.forEach((result, index) => {
    if (result.error) throw new Error(`Verification query ${index + 1}: ${result.error.message}`);
  });
  const expectedScores = dayOneAndQfOnly ? 60 : 101;
  const expectedDayTwoMatches = dayOneAndQfOnly ? 12 : 42;
  const expectedDayTwoParticipants = dayOneAndQfOnly ? 32 : 112;
  if (verification[0].count !== expectedScores) throw new Error(`Expected ${expectedScores} completed score rows, found ${verification[0].count}.`);
  if (verification[1].count !== expectedDayTwoMatches) throw new Error(`Expected ${expectedDayTwoMatches} Day 2 matches, found ${verification[1].count}.`);
  if (verification[2].count !== expectedDayTwoParticipants) throw new Error(`Expected ${expectedDayTwoParticipants} Day 2 participant rows, found ${verification[2].count}.`);

  const header = ["Day", "Time", "Round", "Court", "Format", "Tier/Pairing", "Team A", "Players A", "Team B", "Players B", "Score (A-B)", "Winner", "Status"].map(csvCell).join(",");
  const dayOneReportRows = dayOne.map((match) => {
    const score = dayOneScoresByMatch.get(match.id);
    const teamA = teamById.get(match.team_a_id);
    const teamB = teamById.get(match.team_b_id);
    const playersA = (participantMap.get(`${match.id}:A`) || []).map((row) => row.source_player_name).join(" / ");
    const playersB = (participantMap.get(`${match.id}:B`) || []).map((row) => row.source_player_name).join(" / ");
    return reportRow({ day: 1, time: match.time_label, phase: "Round 1", court: match.court_label, format: match.format, tierRule: match.tier_rule, teamA: teamA.name, playersA, teamB: teamB.name, playersB, score, winner: score.winner_side === "A" ? teamA.name : teamB.name, status: "Final" });
  });
  const dayTwoParticipants = new Map();
  dayTwoParticipantRows.forEach((participant) => {
    const key = `${participant.schedule_match_id}:${participant.side}`;
    dayTwoParticipants.set(key, [...(dayTwoParticipants.get(key) || []), participant].sort((left, right) => left.slot - right.slot));
  });
  const dayTwoScoresByMatch = new Map(dayTwoScoreRows.map((score) => [score.schedule_match_id, score]));
  const dayTwoReportRows = dayTwoMatchRows.map((match) => {
    const score = dayTwoScoresByMatch.get(match.id);
    const playersA = (dayTwoParticipants.get(`${match.id}:A`) || []).map((row) => row.source_player_name).join(" / ");
    const playersB = (dayTwoParticipants.get(`${match.id}:B`) || []).map((row) => row.source_player_name).join(" / ");
    return reportRow({ day: 2, time: match.time_label, phase: match.match_type, court: match.court_label, format: match.format, tierRule: match.tier_rule, teamA: match.team_a_label, playersA, teamB: match.team_b_label, playersB, score, winner: score ? (score.winner_side === "A" ? match.team_a_label : match.team_b_label) : "—", status: score ? "Final" : match.status === "scheduled" ? "Pending" : "Paused" });
  });
  await mkdir(REPORT_DIRECTORY, { recursive: true });
  await writeFile(REPORT_PATH, [header, ...dayOneReportRows, ...dayTwoReportRows].join("\n") + "\n", "utf8");

  return {
    tournament: tournament.name,
    dayOneMatches: dayOne.length,
    dayTwoMatches: dayTwoMatchRows.length,
    completedScores: dayOneScores.length + dayTwoScoreRows.length,
    pendingDayTwoMatches: dayTwoMatchRows.length - dayTwoScoreRows.length,
    champion: championship?.winner.name || "Pending",
    runnerUp: championship?.loser.name || "Pending",
    seeds: standings.map((team) => `${team.seed}. ${team.name}`),
    reportPath: REPORT_PATH
  };
}

if (process.argv.includes(RESET_DATA_FLAG)) {
  const state = JSON.parse(await readFile(STATE_PATH, "utf8"));
  if (!state?.tournamentId || !Array.isArray(state.dayOneScoreIds) || !Array.isArray(state.dayTwoMatchIds)) throw new Error("The saved simulation state is invalid.");
  tournamentId = state.tournamentId;
  insertedDayOneScoreIds.push(...state.dayOneScoreIds);
  insertedDayTwoMatchIds.push(...state.dayTwoMatchIds);
  await cleanup();
  await unlink(STATE_PATH);
  console.log(JSON.stringify({ tournamentId, removedDayOneScores: insertedDayOneScoreIds.length, removedDayTwoMatches: insertedDayTwoMatchIds.length, databaseReset: true }, null, 2));
  process.exit(0);
}

const keepTestData = process.argv.includes(KEEP_DATA_FLAG);
if (keepTestData) {
  try {
    await readFile(STATE_PATH, "utf8");
    throw new Error(`A kept simulation already exists. Reset it first with ${RESET_DATA_FLAG}.`);
  } catch (error) {
    if (error instanceof Error && !error.message.includes("ENOENT")) throw error;
  }
}

let summary;
let runError;
let keptTestData = false;
try {
  summary = await run();
  if (keepTestData) {
    await writeFile(STATE_PATH, JSON.stringify({ tournamentId, dayOneScoreIds: insertedDayOneScoreIds, dayTwoMatchIds: insertedDayTwoMatchIds, createdAt: new Date().toISOString() }, null, 2) + "\n", "utf8");
    keptTestData = true;
  }
} catch (error) {
  runError = error;
} finally {
  if (!keptTestData) {
    try {
      await cleanup();
    } catch (cleanupError) {
      if (runError) {
        runError = new Error(`${runError.message} Cleanup also failed: ${cleanupError.message}`);
      } else {
        runError = cleanupError;
      }
    }
  }
}

if (runError) throw runError;

if (keptTestData) {
  console.log(JSON.stringify({ ...summary, databaseReset: false, statePath: STATE_PATH }, null, 2));
} else {
  const [remainingScores, remainingDayTwo] = await Promise.all([
    supabase.from("tournament_match_scores").select("id", { count: "exact", head: true }).eq("tournament_id", tournamentId),
    supabase.from("tournament_schedule_matches").select("id", { count: "exact", head: true }).eq("tournament_id", tournamentId).eq("day_number", 2)
  ]);
  if (remainingScores.error || remainingDayTwo.error) {
    throw new Error(`Final cleanup verification failed: ${remainingScores.error?.message || remainingDayTwo.error?.message}`);
  }
  if (remainingScores.count !== 0 || remainingDayTwo.count !== 0) {
    throw new Error(`Database was not fully reset (scores: ${remainingScores.count}, Day 2 matches: ${remainingDayTwo.count}).`);
  }
  console.log(JSON.stringify({ ...summary, databaseReset: true }, null, 2));
}
