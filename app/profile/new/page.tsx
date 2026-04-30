import { NewPlayerScreen } from "../../tennis-app";

export default async function NewPlayerPage({
  searchParams
}: {
  searchParams: Promise<{ claim?: string }>;
}) {
  const { claim } = await searchParams;

  return <NewPlayerScreen claimPlayerId={claim} />;
}
