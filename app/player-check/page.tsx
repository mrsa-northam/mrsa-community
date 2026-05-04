import { PlayerCheckScreen } from "../tennis-app";

export default async function PlayerCheckPage({
  searchParams
}: {
  searchParams: Promise<{ claim?: string; next?: string; player?: string; note?: string }>;
}) {
  const { claim, next, player, note } = await searchParams;

  return <PlayerCheckScreen claimStatus={claim} rejectedPlayerName={player} rejectionNote={note} nextPath={next} />;
}
