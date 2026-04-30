import { NewPlayerScreen } from "../../tennis-app";

export default async function NewPlayerPage({
  searchParams
}: {
  searchParams: Promise<{ claim?: string; next?: string }>;
}) {
  const { claim, next } = await searchParams;

  return <NewPlayerScreen claimPlayerId={claim} nextPath={next} />;
}
