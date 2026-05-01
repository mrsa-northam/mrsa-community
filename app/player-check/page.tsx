import { PlayerCheckScreen } from "../tennis-app";

export default async function PlayerCheckPage({
  searchParams
}: {
  searchParams: Promise<{ claim?: string; next?: string; player?: string }>;
}) {
  const { claim, next, player } = await searchParams;

  return <PlayerCheckScreen claimStatus={claim} rejectedPlayerName={player} nextPath={next} />;
}
