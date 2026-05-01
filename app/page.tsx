import { LoginScreen } from "./tennis-app";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return <LoginScreen nextPath={next} />;
}
