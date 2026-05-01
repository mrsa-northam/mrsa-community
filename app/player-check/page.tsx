import { PlayerCheckScreen } from "../tennis-app";

export default async function PlayerCheckPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return <PlayerCheckScreen nextPath={next} />;
}
