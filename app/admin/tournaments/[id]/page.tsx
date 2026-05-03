import { AdminTournamentDetailScreen } from "../../admin-app";

export default async function AdminTournamentDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AdminTournamentDetailScreen tournamentId={id} />;
}
