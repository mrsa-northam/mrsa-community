import {
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Mail,
  Menu,
  ShieldCheck,
  Swords,
  Trophy,
  UserRound
} from "lucide-react";
import Link from "next/link";

export function Backdrop() {
  return (
    <>
      <div className="animated-backdrop" />
      <div className="court-perspective" />
    </>
  );
}

export function BrandLockup() {
  return (
    <div className="brand-lockup">
      <span className="brand-symbol">M</span>
      <span>
        <strong>MRSA</strong>
        <small>Tennis Tournament</small>
      </span>
    </div>
  );
}

export function AuthShell({
  title,
  eyebrow,
  description,
  children
}: {
  title: string;
  eyebrow: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="app-shell">
      <Backdrop />
      <section className="auth-wrap">
        <div className="auth-card glass-card">
          <div className="auth-content">
            <BrandLockup />
            <span className="mini-badge"><Mail size={18} />{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
            {children}
          </div>
          <div className="auth-preview" aria-hidden="true">
            <div className="preview-toolbar">
              <span>Live flows</span>
              <span>MRSA</span>
            </div>
            <div className="preview-card-grid">
              <div className="preview-card tall">
                <span>Center Court</span>
                <strong>6 · 4</strong>
                <small>Match point</small>
              </div>
              <div className="preview-card">
                <span>Registration</span>
                <strong>46/64</strong>
              </div>
              <div className="preview-card accent">
                <span>Next</span>
                <strong>6:30</strong>
              </div>
              <div className="preview-card">
                <span>Rank</span>
                <strong>#14</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function AppShell({
  active,
  children
}: {
  active: "dashboard" | "tournaments" | "profile";
  children: React.ReactNode;
}) {
  return (
    <main className="app-shell">
      <Backdrop />
      <section className="product-shell">
        <aside className="desktop-sidebar glass-card" aria-label="Desktop navigation">
          <BrandLockup />
          <nav>
            <Link className={active === "dashboard" ? "active" : ""} href="/dashboard">
              <Clock3 size={18} />
              Dashboard
            </Link>
            <Link className={active === "tournaments" ? "active" : ""} href="/tournaments">
              <Trophy size={18} />
              Tournaments
            </Link>
            <Link className={active === "profile" ? "active" : ""} href="/profile">
              <UserRound size={18} />
              Profile
            </Link>
          </nav>
          <div className="sidebar-card">
            <span>Next match</span>
            <strong>Today · 6:30 PM</strong>
            <small>Court 2 warm-up opens at 6:00 PM.</small>
          </div>
        </aside>
        <div className="app-main">
        <header className="app-header glass-card">
          <details className="hamburger-menu">
            <summary aria-label="Open menu"><Menu size={21} /></summary>
            <nav className="menu-drawer glass-card" aria-label="MRSA menu">
              <div className="drawer-head">
                <span className="brand-symbol">M</span>
                <div>
                  <strong>MRSA Menu</strong>
                  <p>Move through your tennis portal.</p>
                </div>
              </div>
              <Link className={active === "dashboard" ? "selected" : ""} href="/dashboard">
                <span><strong>Dashboard</strong><small>Overview and live games</small></span>
                <ChevronRight size={18} />
              </Link>
              <Link className={active === "tournaments" ? "selected" : ""} href="/tournaments">
                <span><strong>Tournaments</strong><small>Active and past events</small></span>
                <ChevronRight size={18} />
              </Link>
              <Link className={active === "profile" ? "selected" : ""} href="/profile">
                <span><strong>Profile</strong><small>Player details and stats</small></span>
                <ChevronRight size={18} />
              </Link>
            </nav>
          </details>
          <Link className="header-brand" href="/dashboard">
            <span className="brand-symbol small">M</span>
            <span>MRSA</span>
          </Link>
          <div className="header-search" aria-label="Search preview">
            <span>Search tournaments, players, courts</span>
          </div>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <Link className={active === "dashboard" ? "active" : ""} href="/dashboard">Dashboard</Link>
            <Link className={active === "tournaments" ? "active" : ""} href="/tournaments">Tournaments</Link>
            <Link className={active === "profile" ? "active" : ""} href="/profile">Profile</Link>
          </nav>
          <div className="header-status"><span />Live</div>
        </header>
        {children}
        </div>
      </section>
    </main>
  );
}

export function SectionHeader({ title, action, type = "trophy" }: { title: string; action: string; type?: "trophy" | "clock" | "calendar" | "shield" | "swords" | "profile" }) {
  const icons = {
    trophy: <Trophy size={18} />,
    clock: <Clock3 size={18} />,
    calendar: <CalendarDays size={18} />,
    shield: <ShieldCheck size={18} />,
    swords: <Swords size={18} />,
    profile: <CircleUserRound size={18} />
  };

  return (
    <div className="section-header">
      <div>{icons[type]}<h2>{title}</h2></div>
      <span>{action}</span>
    </div>
  );
}
