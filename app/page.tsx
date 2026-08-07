import { GuestHomeScreen, LoginScreen } from "./tennis-app";

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ next?: string; signin?: string }>;
}) {
  const { next, signin } = await searchParams;

  return next || signin === "1" ? <LoginScreen nextPath={next} /> : <GuestHomeScreen />;
}
