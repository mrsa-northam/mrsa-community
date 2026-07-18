import { TournamentScheduleTeamScreen } from "../../../../tennis-app";

export default async function ScheduleTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TournamentScheduleTeamScreen teamId={id} />;
}
