import { TournamentScheduleMatchScreen } from "../../../../tennis-app";

export default async function ScheduleMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TournamentScheduleMatchScreen matchId={id} />;
}
