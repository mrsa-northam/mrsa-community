import { TournamentPlayerProfileScreen } from "../../../tennis-app";

export default async function TournamentPlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TournamentPlayerProfileScreen playerId={id} />;
}
