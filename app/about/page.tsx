"use client";

import Link from "next/link";
import { House, Trophy, UsersRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type FeaturedVideo = {
  title: string;
  label: string;
  duration: string;
  url: string;
};

type TournamentHighlight = {
  title: string;
  date: string;
  albumUrl: string;
  thumbs: string[];
};

type TestimonialCategory =
  | "founders"
  | "organizer"
  | "mumenaat"
  | "youth"
  | "participant"
  | "volunteer"
  | "senior"
  | "partner"
  | "sponsor"
  | "advisor";

type Testimonial = {
  name: string;
  role: string;
  category: TestimonialCategory;
  excerpt: string;
  fullText: string[];
};

type FeaturedTestimonial = Testimonial;

type TeamMember = {
  name: string;
  short: string;
  role: string;
  initials: string;
};

type TeamGroupKey = "founders" | "sportLeads" | "regionalLeads" | "operations";

type Team = Record<TeamGroupKey, TeamMember[]>;

const FEATURED_VIDEO: FeaturedVideo = {
  title: "3rd Annual Tennis Tournament 2025",
  label: "Highlights reel",
  duration: "3 min",
  url: "https://drive.google.com/file/d/1oyHOkUphZ4X1i48bDWPRkwmbXqhDfxxm/view?usp=drive_link"
};

const FEATURED_VIDEO_PREVIEW_URL = "https://drive.google.com/file/d/1oyHOkUphZ4X1i48bDWPRkwmbXqhDfxxm/preview";

const TOURNAMENTS: TournamentHighlight[] = [
  {
    title: "South Regional",
    date: "Apr 2026",
    albumUrl: "https://photos.app.goo.gl/DZkfEqfGDmYJHBr17",
    thumbs: ["/images/about-tournaments/south-regional-2026-01.jpg"]
  },
  {
    title: "Northeast Regional",
    date: "Jan 2026",
    albumUrl: "https://photos.app.goo.gl/hqN5hxRYannDHzpV6",
    thumbs: ["/images/about-tournaments/northeast-regional-2026-01.jpg"]
  },
  {
    title: "North America Tennis",
    date: "2025",
    albumUrl: "https://photos.app.goo.gl/5TXzAeMxDkxvfzfg8",
    thumbs: [
      "/images/about-tournaments/north-america-tennis-2025-01.jpg",
      "/images/about-tournaments/north-america-tennis-2025-02.jpg",
      "/images/about-tournaments/north-america-tennis-2025-03.jpg"
    ]
  },
  {
    title: "South Regional",
    date: "Apr 2025",
    albumUrl: "https://photos.app.goo.gl/wPtjBZpyBGEsvG3X8",
    thumbs: ["/images/about-tournaments/south-regional-2025-01.jpg"]
  },
  {
    title: "Midwest Regional",
    date: "Apr 2025",
    albumUrl: "https://photos.app.goo.gl/ZHZA5wkSmMrUNNkK8",
    thumbs: ["/images/about-tournaments/midwest-regional-2025-01.jpg"]
  },
  {
    title: "Tennis & Pickleball",
    date: "2024",
    albumUrl: "https://photos.app.goo.gl/oL2hzcfCT1BYXsiD8",
    thumbs: ["/images/about-tournaments/tennis-pickleball-2024-01.jpg"]
  },
  {
    title: "Tri-Sports Tournament",
    date: "2023",
    albumUrl: "https://photos.app.goo.gl/dS3ZxkBNL5xcRngy8",
    thumbs: [
      "/images/about-tournaments/tri-sports-2023-01.jpg",
      "/images/about-tournaments/tri-sports-2023-02.jpg",
      "/images/about-tournaments/tri-sports-2023-03.jpg"
    ]
  }
];

const TESTIMONIALS_DOC = "https://docs.google.com/document/d/1rk7yaP2LOSZuaIAY8O8jDENCNSENoG1pFcVKExwD-7c/edit";

const FEATURED_TESTIMONIAL: FeaturedTestimonial = {
  name: "Huzefa Gulamhusein & Moiz Broachwala",
  role: "Co-founders",
  category: "founders",
  excerpt: "The goal was simple — to bring Mumineen together through racquet sports. We knew the players were already out there, spread across cities. What was missing was a larger space where people could come together and push each other to improve…",
  fullText: [
    "“The goal was simple, to bring Mumineen together through racquet sports, in line with Moula’s guidance on Umoor Sehat and togetherness. We felt that racquet sports, especially tennis, are among the healthiest ways to stay active and mentally strong. Yet, despite so much talent across North America, there wasn’t one common platform that brought everyone together. We knew the players were already out there. They were spread across cities and jamaats, often playing on their own or in small groups. What felt missing was a larger space where people could come together, compete meaningfully, and push each other to improve. Our hope was that competition would not just be about winning, but about growing a love for racquet sports, encouraging more Mumineen to get involved, and motivating players to prepare better both on court and off it. The idea grew quickly and the execution was ambitious. We wanted to build something that went beyond a single tournament and could scale across North America, with regional centers in different parts of the continent. At times, it felt challenging and even overwhelming. But Alhamdulillah, with consistency, community support, and Maula’s raza, MRSA has grown to over 500 members today and continues to grow. What has made this journey truly special is not just the tournaments themselves, but everything around them. The discipline of training, the focus on fitness and mental strength, the joy of learning, and most importantly, the relationships that formed along the way. MRSA has become a place where Mumineen compete, support one another, and build friendships not only within their own jamaats, but across North America. We both share a deep love for sports, and creating this racquet sports community is what we were most passionate about. Along the way, many wonderful individuals joined the effort, and building MRSA together with them has been incredibly fulfilling. It continues to feel less like an organization and more like a shared journey we are grateful to be part of.”"
  ]
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Hussain Boxwalla",
    role: "Lead organiser · NA Tennis",
    category: "organizer",
    excerpt: "What began as a small, local tennis tournament in Chicago three years ago has grown into something far beyond what I ever imagined…",
    fullText: [
      "What began as a small, local tennis tournament in Chicago just three years ago has grown into something far beyond what I ever imagined. In the first year, our participants were mainly Chicago locals, coming together simply for the love of the sport. Today, the tournament has expanded across multiple Jamaats throughout America, bringing communities together through healthy competition and shared passion. We started with individual play, but as interest and participation grew, we evolved into team‑based formats - creating a stronger sense of camaraderie and unity among players. Our age range now spans from 13 to 50+, proving that tennis truly is a sport for everyone that has a passion for it. One of the most rewarding outcomes has been the formation of a dedicated group in Chicago that meets weekly for coaching and training - something that began only after MRSA Tennis was launched. Seeing players come together consistently to improve their game and build friendships has been the true highlight of this journey. What started as a simple idea has now become a growing tradition, and I look forward to seeing how much more our community can achieve together."
    ]
  },
  {
    name: "Dr. Batul Kaj",
    role: "Mumenaat events lead",
    category: "mumenaat",
    excerpt: "Incredible to watch Mumenaat flourish in racquet sports. The first pickleball tournament brought together behno of all ages — including a 75yr old finalist!",
    fullText: [
      "“It has been incredible to watch Mumenaat flourish in racquet sports over the past few years. The first pickleball tournament in Chicago showcased emerging talent and brought together behno of all ages including a 75yr old finalist! Since then there’s been an explosion of interest in pickleball and badminton, with 50+ Mumenaat from across the Midwest participating in the tri-sports tournament in Detroit, as well as the pickleball tournament in Austin. We now have Mumenaat playing regularly, with new teamwork and friendships developing every day. Inshallah with Moula TUS dua, we will continue to grow Mumenaat racquet sports and camaraderie across North America”"
    ]
  },
  {
    name: "Burhanuddin Moosabhoy",
    role: "Young participant",
    category: "youth",
    excerpt: "This program helped me grow my passion for racquet sports and truly believe in myself. With Moulana's dua, I won a trophy in every event I entered…",
    fullText: [
      "“This program has helped me grow my passion for racquet sports and truly believe in myself. I competed in tennis in Chicago and table tennis, badminton, and pickleball in Detroit, always pushing myself to do my best. Since I had faith in myself and with Moulana’s dua, I was able to win a trophy in every event I entered. The tournament was very well organized and a great opportunity for young athletes like me to compete and I am thankful to MRSA for organizing this, as I got the chance to meet so many new friends and fellow mumineen athletes”"
    ]
  },
  {
    name: "Mustafa Zirapury",
    role: "Participant",
    category: "participant",
    excerpt: "Seeing the growth of the community has been truly incredible. People of all ages come together — winning is the goal, but we win the right way.",
    fullText: [
      "“⁠⁠Being a participant in the MRSA tournaments over the past few years has truly been amazing. First of all seeing the growth of the community has been something truly incredible. It’s amazing to see how many mumineen across the North America Jamiat share the same passion for racquet sports. People of all ages come together and enjoy playing and each other's company. Alhamdolillah, one of the biggest differences I see in our tournaments is the compassion players share with each other, and the respect players share. Winning is always the goal of course, but in this community we see people take on Moula’s khushi and try to win the right way.”"
    ]
  },
  {
    name: "Mufaddal Husain",
    role: "Volunteer · 3rd Annual NA Tennis",
    category: "volunteer",
    excerpt: "From behind the camera I saw more than matches — I saw focus, sportsmanship, laughter, and genuine camaraderie. It didn't feel like just another tournament…",
    fullText: [
      "“⁠⁠I was introduced to MRSA through some of its passionate pioneers, and their vision of bringing the community together through sport truly resonated with me. Their sincerity and enthusiasm inspired me to step forward and offer my khidmat in whatever way I could. I was grateful for the opportunity to volunteer at MRSA’s 3rd Annual North America Tennis Tournament in Chicago. Even though I wasn’t playing, I helped manage social media and photography, capturing the moments and overall atmosphere of the event. From behind the camera, I witnessed more than just matches - I saw focus, sportsmanship, laughter, and genuine camaraderie. It was truly special to experience those moments up close. Beyond my main responsibilities, I stepped in wherever help was needed. The organizing committee worked tirelessly, and their love for the sport was evident in every detail. From how smoothly everything was run to the warmth with which they welcomed participants from across North America, their dedication was clear. It didn’t feel like just another tournament, it felt like something built with care, unity, and purpose. Through this experience, I developed a deep appreciation for tennis and the discipline it requires. More importantly, I had the privilege of connecting with passionate mumineen from across North America, which made the experience even more meaningful. InshaAllah, next year I hope to step onto the court myself and participate. May Khuda Ta’ala grant long life to our beloved Aqa Maula, who continually encourages mumineen toward sports, fitness, and leading a healthy and active lifestyle.”"
    ]
  },
  {
    name: "Dr. Murtaza Hussain",
    role: "Participant",
    category: "senior",
    excerpt: "The level of play was challenging, the hospitality unmatched. The experience reminded me why I still love this game at 62.",
    fullText: [
      "The level of play was challenging, the hospitality unmatched. The experience reminded me why I still love this game at 62."
    ]
  },
  {
    name: "Robin Henders",
    role: "President · Five Star Tennis Center",
    category: "partner",
    excerpt: "We're extremely proud to host the MRSA National Tennis Tournament. Events like this showcase what makes tennis so special.",
    fullText: [
      "We're extremely proud to host the MRSA National Tennis Tournament. Events like this showcase what makes tennis so special."
    ]
  },
  {
    name: "Quresh Tyebji",
    role: "Vice President · Shipcom",
    category: "sponsor",
    excerpt: "It is a privilege to support the MRSA Tennis Tournament year after year. Seeing our community come together is incredibly fulfilling.",
    fullText: [
      "It is a privilege to support the MRSA Tennis Tournament year after year. Seeing our community come together is incredibly fulfilling."
    ]
  },
  {
    name: "Dr. Hussain Malbari",
    role: "Advisor · MRSA NA",
    category: "advisor",
    excerpt: "Making friendships through the lens of faith and sport has a deeply synergistic effect that nourishes the mind, body, and soul.",
    fullText: [
      "Making friendships through the lens of faith and sport has a deeply synergistic effect that nourishes the mind, body, and soul."
    ]
  }
];

const TEAM: Team = {
  founders: [
    { name: "Moiz Broachwala", short: "Moiz B.", role: "Co-founder", initials: "MB" },
    { name: "Huzefa Gulamhusein", short: "Huzefa G.", role: "Co-founder", initials: "HG" }
  ],
  sportLeads: [
    { name: "Hussain Boxwalla", short: "Hussain B.", role: "Tennis", initials: "HB" },
    { name: "Shabbir Shams", short: "Shabbir S.", role: "Table Tennis", initials: "SS" },
    { name: "Shoaib Shabbir", short: "Shoaib S.", role: "Pickleball", initials: "SS" },
    { name: "Batul Kaj", short: "Batul K.", role: "Badminton", initials: "BK" }
  ],
  regionalLeads: [
    { name: "Hussain Malbari", short: "Hussain M.", role: "South · Sehat advisor", initials: "HM" },
    { name: "Ahmed Hussain", short: "Ahmed H.", role: "Midwest", initials: "AH" },
    { name: "Husein Kapadia", short: "Husein K.", role: "Northeast", initials: "HK" }
  ],
  operations: [
    { name: "Mufaddal Hussain", short: "Mufaddal H.", role: "Marketing & experience", initials: "MH" },
    { name: "Mohammed Segval", short: "Mohammed S.", role: "Tech", initials: "MS" }
  ]
};

const CATEGORY_BADGES: Record<TestimonialCategory, { label: string; className: string }> = {
  founders: { label: "Founders", className: "bg-[var(--brand-primary-tint)] text-[var(--accent-ink)]" },
  organizer: { label: "Organizer", className: "bg-[var(--brand-primary-tint)] text-[var(--brand-mid)]" },
  mumenaat: { label: "Mumenaat lead", className: "bg-[var(--category-rose-tint)] text-[var(--category-rose-ink)]" },
  youth: { label: "Young player", className: "bg-[var(--brand-primary-tint)] text-[var(--brand-primary-text)]" },
  participant: { label: "Participant", className: "bg-[var(--brand-primary-tint)] text-[var(--brand-primary-text)]" },
  volunteer: { label: "Volunteer", className: "bg-[var(--partner-gold-tint)] text-[var(--partner-gold-ink)]" },
  senior: { label: "Senior player", className: "bg-[var(--brand-primary-tint)] text-[var(--brand-primary-text)]" },
  partner: { label: "Partner", className: "bg-[var(--urgent-tint)] text-[var(--urgent-ink)]" },
  sponsor: { label: "Sponsor", className: "bg-[var(--partner-gold-tint)] text-[var(--partner-gold-ink)]" },
  advisor: { label: "Advisor", className: "bg-[var(--avatar-purple)] text-[var(--avatar-purple-ink)]" }
};

const TEAM_GROUPS: { key: TeamGroupKey; label: string }[] = [
  { key: "founders", label: "Founders" },
  { key: "sportLeads", label: "Sport leads" },
  { key: "regionalLeads", label: "Regional leads" },
  { key: "operations", label: "Operations" }
];

const TEAM_AVATAR_COLORS = [
  "bg-[var(--brand-primary-tint)] text-[var(--brand-primary-text)]",
  "bg-[var(--avatar-purple)] text-[var(--avatar-purple-ink)]",
  "bg-[var(--brand-primary-tint)] text-[var(--brand-mid)]",
  "bg-[var(--partner-gold-tint)] text-[var(--partner-gold-ink)]",
  "bg-[var(--urgent-tint)] text-[var(--urgent-ink)]"
];

export default function AboutPage() {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <main className="min-h-dvh bg-page px-3 pb-[calc(72px+env(safe-area-inset-bottom))] pt-0 font-sans text-text-primary">
      <AboutTopNav />
      <div className="mx-auto grid w-full max-w-[380px] gap-6 py-4">
        <HeroSection />
        <FeaturedVideoSection playing={videoPlaying} onPlayingChange={setVideoPlaying} />
        <PhotoHighlightsSection />
        <TestimonialsSection />
        <TeamSection />
        <ReadyToPlayCta />
      </div>
      <StandardAboutBottomNav />
    </main>
  );
}

function AboutTopNav() {
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 -mx-3 border-b-hairline border-surface bg-white/95 px-3 py-2.5 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[380px] items-center justify-between">
        <Link className="inline-flex items-center gap-2" href="/" aria-label="MRSA home">
          <span className="relative h-9 w-9 shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mrsa-logo.svg" alt="" aria-hidden="true" className="h-full w-full object-contain" />
          </span>
          <strong className="text-[22px] font-medium leading-none text-brand">MRSA</strong>
        </Link>
        <button className="grid h-9 w-9 place-items-center rounded-full border-hairline border-line bg-card text-brand" type="button" onClick={goBack} aria-label="Go back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative grid min-h-[190px] overflow-hidden rounded-hero bg-brand-deep p-[14px] text-white">
      <div className="pointer-events-none absolute inset-0 -right-16 -top-6 text-white opacity-[0.06]" aria-hidden="true">
        <svg className="h-full w-full scale-125" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="22" y="20" width="296" height="150" stroke="currentColor" strokeWidth="1.2" />
          <path d="M22 95H318M170 20V170M82 20V170M258 20V170M82 58H258M82 132H258" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>
      <div className="relative grid gap-4">
        <span className="inline-flex w-max items-center rounded-full bg-white/12 px-3 py-1 text-caption text-white/75">About MRSA</span>
        <div className="grid gap-3">
          <h1 className="text-[18px] font-medium leading-[1.2] text-white">Mumineen Racquet Sports Association</h1>
          <p className="text-[12px] leading-relaxed text-white/72">A North America-wide community bringing Mumineen together through racquet sports — tennis, table tennis, badminton, and pickleball. Over 500 members and growing.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <StatTile label="Established" value="2023" />
          <StatTile label="Members" value="500+" />
        </div>
      </div>
    </section>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-surface border-hairline border-white/10 bg-white/[0.08] p-4">
      <b className="block text-[10px] font-normal text-white/72">{label}</b>
      <strong className="block text-[16px] font-medium leading-tight text-white">{value}</strong>
    </span>
  );
}

function FeaturedVideoSection({
  playing,
  onPlayingChange
}: {
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [iframeSrc, setIframeSrc] = useState("");

  useEffect(() => {
    const card = cardRef.current;
    if (!card || iframeSrc) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIframeSrc(FEATURED_VIDEO_PREVIEW_URL);
        observer.disconnect();
      },
      { rootMargin: "200px" }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [iframeSrc]);

  return (
    <section className="grid gap-3">
      <div className="grid gap-1">
        <span className="text-[10px] font-medium uppercase tracking-[0.4px] text-text-secondary">Featured highlight</span>
        <h3 className="text-[14px] font-medium leading-snug text-text-primary">{FEATURED_VIDEO.title}</h3>
      </div>
      <div ref={cardRef} className="relative aspect-video w-full overflow-hidden rounded-lg bg-brand-deep text-white">
        {playing ? (
          <>
            <iframe
              src={iframeSrc || FEATURED_VIDEO_PREVIEW_URL}
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: 0, borderRadius: "inherit" }}
              title={FEATURED_VIDEO.title}
            />
            <button
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-[rgba(var(--brand-deep-rgb),0.45)] text-[14px] font-medium text-white"
              type="button"
              onClick={() => onPlayingChange(false)}
              aria-label="Close tournament highlights video"
            >
              ✕
            </button>
          </>
        ) : (
          <button className="group relative block h-full w-full overflow-hidden text-left text-white" type="button" onClick={() => onPlayingChange(true)} aria-label="Play tournament highlights video">
            <span className="absolute inset-0 bg-[rgba(var(--brand-deep-rgb),0.25)]" aria-hidden="true" />
            <span className="absolute left-3 top-3 rounded-full bg-[rgba(var(--brand-deep-rgb),0.30)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.4px] text-white/90">Tap to play</span>
            <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-[0_14px_34px_rgba(var(--brand-deep-rgb),0.24)] transition group-active:scale-95" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 11L1.5 20.5263L1.5 1.47372L18 11Z" fill="var(--brand-mid)" />
              </svg>
            </span>
            <span className="absolute bottom-3 left-3 grid gap-0.5">
              <strong className="text-[13px] font-medium leading-tight text-white">{FEATURED_VIDEO.label}</strong>
              <em className="text-[11px] not-italic text-white/72">{FEATURED_VIDEO.duration} · Drive video</em>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

function PhotoHighlightsSection() {
  return (
    <section className="grid gap-4">
      <SectionHeading eyebrow="Photo highlights" title="A look inside MRSA events" />
      <div className="grid gap-5">
        {TOURNAMENTS.map((tournament) => (
          <TournamentStrip tournament={tournament} key={`${tournament.title}-${tournament.date}`} />
        ))}
      </div>
    </section>
  );
}

function TournamentStrip({ tournament }: { tournament: TournamentHighlight }) {
  return (
    <article className="grid gap-2">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[12px] font-medium text-text-primary">{tournament.title}</h3>
          <p className="text-[12px] text-text-secondary">{tournament.date}</p>
        </div>
        <a className="whitespace-nowrap text-[11px] font-medium text-[var(--brand-mid)]" href={tournament.albumUrl} target="_blank" rel="noopener noreferrer">View album ↗</a>
      </div>
      <div className="-mx-3 flex snap-x snap-mandatory gap-1.5 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(tournament.thumbs.length > 0 ? tournament.thumbs : Array.from({ length: 3 }, () => "")).map((thumb, thumbnailIndex) => (
          <TournamentThumbnail
            alt={`${tournament.title} thumbnail ${thumbnailIndex + 1}`}
            key={`${tournament.title}-thumb-${thumbnailIndex}`}
            src={thumb}
          />
        ))}
      </div>
    </article>
  );
}

function TournamentThumbnail({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="grid h-[68px] w-[92px] shrink-0 snap-start place-items-center rounded-md bg-brand-light text-[10px] font-medium text-text-secondary">
        MRSA
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="h-[68px] w-[92px] shrink-0 snap-start rounded-md object-cover"
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function TestimonialsSection() {
  const [openItem, setOpenItem] = useState<Testimonial | null>(null);

  const openIndex = openItem ? TESTIMONIALS.findIndex((t) => t.name === openItem.name) : -1;
  const nextItem = openItem
    ? openIndex === -1 || openIndex === TESTIMONIALS.length - 1
      ? TESTIMONIALS[0]
      : TESTIMONIALS[openIndex + 1]
    : null;
  const prevItem = openItem
    ? openIndex <= 0
      ? TESTIMONIALS[TESTIMONIALS.length - 1]
      : TESTIMONIALS[openIndex - 1]
    : null;

  return (
    <section className="grid gap-4">
      <SectionHeading eyebrow="Voices of MRSA" title="In the community's words" />
      <button
        type="button"
        onClick={() => setOpenItem(FEATURED_TESTIMONIAL)}
        className="relative grid w-full overflow-hidden rounded-[22px] bg-brand-deep p-4 text-left text-white"
      >
        <svg className="absolute right-4 top-3 h-20 w-20 text-white opacity-10" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M24 16C15 21 10 28 10 38C10 44 14 48 20 48C25 48 29 44 29 39C29 34 26 31 22 31C20 31 18 31 17 32C18 27 22 23 28 20L24 16ZM48 16C39 21 34 28 34 38C34 44 38 48 44 48C49 48 53 44 53 39C53 34 50 31 46 31C44 31 42 31 41 32C42 27 46 23 52 20L48 16Z" fill="currentColor" />
        </svg>
        <div className="relative grid gap-4">
          <span className="w-max rounded-full bg-white/12 px-3 py-1 text-[12px] font-medium text-white/82">Featured · Founders</span>
          <p className="text-[13px] leading-[1.55] text-white [font-family:var(--font-serif)]">“{FEATURED_TESTIMONIAL.excerpt}”</p>
          <span className="grid gap-0.5">
            <strong className="text-[13px] font-medium text-white">{FEATURED_TESTIMONIAL.name}</strong>
            <em className="text-[12px] not-italic text-white/72">{FEATURED_TESTIMONIAL.role}</em>
          </span>
          <span className="text-[13px] font-medium text-[var(--brand-primary-tint)]">Read full story ↗</span>
        </div>
      </button>
      <div className="-mx-3 flex snap-x snap-mandatory gap-1.5 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialCard testimonial={testimonial} key={testimonial.name} onOpen={setOpenItem} />
        ))}
        <a
          className="grid w-[180px] shrink-0 snap-start content-center gap-3 rounded-[18px] border-hairline border-dashed border-line bg-surface p-3 text-text-primary"
          href={TESTIMONIALS_DOC}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6 18.5H5.5C4.11929 18.5 3 17.3807 3 16V7.5C3 6.11929 4.11929 5 5.5 5H22.5C23.8807 5 25 6.11929 25 7.5V16C25 17.3807 23.8807 18.5 22.5 18.5H13L7 23V18.5H6Z" stroke="var(--brand-mid)" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          <span className="grid gap-1">
            <strong className="text-[14px] font-medium">Read all stories</strong>
            <em className="text-[12px] not-italic text-[var(--brand-mid)]">Open the full doc ↗</em>
          </span>
        </a>
      </div>
      {openItem && nextItem && prevItem && (
        <TestimonialSheet
          item={openItem}
          nextItem={nextItem}
          prevItem={prevItem}
          onClose={() => setOpenItem(null)}
          onNext={() => setOpenItem(nextItem)}
          onPrev={() => setOpenItem(prevItem)}
        />
      )}
    </section>
  );
}

function TestimonialCard({ testimonial, onOpen }: { testimonial: Testimonial; onOpen: (t: Testimonial) => void }) {
  const badge = CATEGORY_BADGES[testimonial.category];

  return (
    <button
      type="button"
      onClick={() => onOpen(testimonial)}
      className="grid w-[210px] shrink-0 snap-start gap-3 rounded-[18px] border-hairline border-line bg-white p-3 text-left shadow-[0_8px_20px_rgba(var(--brand-deep-rgb),0.04)]"
    >
      <span className={`w-max rounded-full px-2.5 py-1 text-[11px] font-medium ${badge.className}`}>{badge.label}</span>
      <p className="text-[13px] leading-[1.55] text-text-primary [font-family:var(--font-serif)]">“{testimonial.excerpt}”</p>
      <span className="grid gap-0.5">
        <strong className="text-[12px] font-medium text-text-primary">{testimonial.name}</strong>
        <em className="text-[11px] not-italic text-text-secondary">{testimonial.role}</em>
      </span>
      <span className="text-[12px] font-medium text-[var(--brand-mid)]">Read more →</span>
    </button>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

function TestimonialSheet({
  item,
  nextItem,
  prevItem,
  onClose,
  onNext,
  onPrev
}: {
  item: Testimonial;
  nextItem: Testimonial;
  prevItem: Testimonial;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const dragStateRef = useRef({ startY: 0, startTime: 0, delta: 0, active: false });

  const reducedMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [displayItem, setDisplayItem] = useState(item);
  const [contentVisible, setContentVisible] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (reducedMotion) {
      setOpen(true);
    } else {
      const id = window.requestAnimationFrame(() => setOpen(true));
      return () => {
        window.cancelAnimationFrame(id);
        document.body.style.overflow = previousOverflow;
        previousFocusRef.current?.focus?.();
      };
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (item.name === displayItem.name) return;
    if (reducedMotion) {
      setDisplayItem(item);
      return;
    }
    setContentVisible(false);
    const timeout = window.setTimeout(() => {
      setDisplayItem(item);
      setContentVisible(true);
    }, 150);
    return () => window.clearTimeout(timeout);
  }, [item, displayItem.name, reducedMotion]);

  const handleClose = () => {
    if (closing) return;
    if (reducedMotion) {
      onClose();
      return;
    }
    setClosing(true);
    setOpen(false);
    window.setTimeout(onClose, 250);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }
      if (event.key === "Tab" && sheetRef.current) {
        const focusables = sheetRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex='-1'])"
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && active === first) {
          last.focus();
          event.preventDefault();
        } else if (!event.shiftKey && active === last) {
          first.focus();
          event.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing, reducedMotion]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    dragStateRef.current = {
      startY: touch.clientY,
      startTime: Date.now(),
      delta: 0,
      active: true
    };
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state.active) return;
    const touch = event.touches[0];
    if (!touch) return;
    const delta = touch.clientY - state.startY;
    if (delta < 0) return;
    state.delta = delta;
    setDragOffset(delta);
  };

  const handleTouchEnd = () => {
    const state = dragStateRef.current;
    if (!state.active) return;
    const elapsed = Math.max(1, Date.now() - state.startTime);
    const velocity = state.delta / elapsed;
    state.active = false;
    if (state.delta > 80 && velocity > 0) {
      setDragOffset(0);
      handleClose();
    } else {
      setDragOffset(0);
    }
  };

  const sheetTransform = !open
    ? "translateY(100%)"
    : dragOffset > 0
      ? `translateY(${dragOffset}px)`
      : "translateY(0)";

  const sheetTransition = dragOffset > 0 || reducedMotion ? "none" : "transform 250ms ease-out";
  const backdropTransition = reducedMotion ? "none" : "opacity 250ms ease-out";
  const contentTransition = reducedMotion ? "none" : "opacity 150ms ease-out";

  const badge = CATEGORY_BADGES[displayItem.category];

  return (
    <div role="presentation" className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-[rgba(var(--brand-deep-rgb),0.45)]"
        style={{ opacity: open ? 1 : 0, transition: backdropTransition }}
        onClick={handleClose}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="testimonial-name"
        tabIndex={-1}
        className="testimonial-sheet absolute inset-x-0 bottom-0 flex flex-col overflow-hidden rounded-t-[20px] bg-card shadow-[0_-12px_36px_rgba(var(--brand-deep-rgb),0.18)]"
        style={{ transform: sheetTransform, transition: sheetTransition }}
      >
        <div
          className="cursor-grab pt-2 pb-1 active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <span className="mx-auto block h-1 w-9 rounded-full bg-line-strong" aria-hidden="true" />
        </div>
        <div className="flex items-center justify-between px-4 pt-2 pb-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${badge.className}`}>{badge.label}</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Close testimonial"
            className="grid h-7 w-7 place-items-center rounded-full border-hairline border-line bg-card text-text-secondary"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div
          className="flex-1 min-h-0 overflow-y-auto px-4 pb-4"
          style={{ opacity: contentVisible ? 1 : 0, transition: contentTransition }}
        >
          <div className="grid gap-1 pt-1">
            <strong id="testimonial-name" className="block text-[15px] font-medium text-text-primary">{displayItem.name}</strong>
            <em className="text-[12px] not-italic text-text-secondary">{displayItem.role}</em>
          </div>
          <svg className="mt-3 h-6 w-6 text-text-muted opacity-40" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M24 16C15 21 10 28 10 38C10 44 14 48 20 48C25 48 29 44 29 39C29 34 26 31 22 31C20 31 18 31 17 32C18 27 22 23 28 20L24 16ZM48 16C39 21 34 28 34 38C34 44 38 48 44 48C49 48 53 44 53 39C53 34 50 31 46 31C44 31 42 31 41 32C42 27 46 23 52 20L48 16Z" fill="currentColor" />
          </svg>
          <div className="mt-2">
            {displayItem.fullText.map((paragraph, index) => (
              <p
                key={`${displayItem.name}-${index}`}
                className="text-text-primary"
                style={{ fontFamily: "var(--font-serif)", fontSize: "14px", lineHeight: 1.65, marginBottom: "12px" }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div
          className="grid grid-cols-2 gap-2 border-t-hairline border-line bg-card p-3"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
          <button
            type="button"
            onClick={onPrev}
            aria-label={`Previous testimonial: ${prevItem.name}`}
            className="grid min-h-11 place-items-center rounded-[14px] border-hairline border-line bg-surface text-[12px] font-medium text-text-primary"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label={`Next testimonial: ${nextItem.name}`}
            className="grid min-h-11 place-items-center rounded-[14px] bg-[var(--brand-mid)] text-[12px] font-medium text-white"
          >
            Next story →
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamSection() {
  return (
    <section className="grid gap-4">
      <SectionHeading eyebrow="Meet the team" title="The people behind MRSA" />
      <div className="grid gap-5">
        {TEAM_GROUPS.map((group) => (
          <TeamStrip groupLabel={group.label} members={TEAM[group.key]} key={group.key} />
        ))}
      </div>
    </section>
  );
}

function TeamStrip({ groupLabel, members }: { groupLabel: string; members: TeamMember[] }) {
  return (
    <article className="grid gap-2">
      <h3 className="text-[13px] font-medium text-text-primary">{groupLabel}</h3>
      <div className="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {members.map((member, index) => (
          <div className="grid w-[86px] shrink-0 snap-start justify-items-center gap-2 text-center" key={member.name}>
            <span className={`grid h-16 w-16 place-items-center rounded-full text-[15px] font-medium ${TEAM_AVATAR_COLORS[index % TEAM_AVATAR_COLORS.length]}`}>{member.initials}</span>
            <span className="grid gap-0.5">
              <strong className="text-[12px] font-medium leading-tight text-text-primary">{member.short}</strong>
              <em className="text-[10px] not-italic leading-tight text-text-secondary">{member.role}</em>
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function ReadyToPlayCta() {
  return (
    <section className="grid gap-3 rounded-[22px] border-hairline border-line bg-white p-4 shadow-[0_8px_24px_rgba(var(--brand-deep-rgb),0.05)]">
      <p className="text-[12px] leading-relaxed text-text-secondary">To stay up to date with MRSA events and announcements</p>
      <a
        className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[var(--brand-mid)] px-4 text-center text-[13px] font-medium leading-tight text-white"
        href="https://chat.whatsapp.com/Lcl6BM01bu86LW00MVtf1V"
        target="_blank"
        rel="noopener noreferrer"
      >
        Join the MRSA WhatsApp Community channel
      </a>
    </section>
  );
}

function StandardAboutBottomNav() {
  const tabs = [
    { id: "home", href: "/dashboard", label: "Home", icon: House },
    { id: "tournament", href: "/tournaments", label: "Tournament", icon: Trophy },
    { id: "profile", href: "/profile", label: "Profile", icon: UsersRound }
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 grid border-t-hairline border-line bg-white px-4 py-3 shadow-[0_-18px_44px_rgba(var(--brand-deep-rgb),0.08)] md:inset-x-6 md:bottom-4 md:mx-auto md:max-w-shell md:rounded-[24px] md:border-hairline md:shadow-[0_18px_50px_rgba(var(--brand-deep-rgb),0.12)] lg:left-1/2 lg:right-auto lg:w-[min(760px,calc(100vw-64px))] lg:-translate-x-1/2"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`, paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
      aria-label="Primary mobile navigation"
    >
      {tabs.map(({ id, href, label, icon: Icon }) => (
        <Link className={id === "home" ? "grid min-h-12 place-items-center content-center gap-1 rounded-[16px] bg-[var(--brand-primary-tint)] text-[var(--brand-mid)]" : "grid min-h-12 place-items-center content-center gap-1 rounded-[16px] text-[var(--text-muted-token)]"} href={href} key={id}>
          <Icon size={20} strokeWidth={id === "home" ? 2.2 : 1.7} />
          <span className={id === "home" ? "text-[12px] font-medium leading-none" : "text-[12px] font-normal leading-none"}>{label}</span>
          <span className={id === "home" ? "h-1 w-1 rounded-full bg-[var(--brand-mid)]" : "h-1 w-1 rounded-full bg-transparent"} />
        </Link>
      ))}
    </nav>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="grid gap-1">
      <span className="text-[10px] font-medium uppercase tracking-[0.4px] text-text-secondary">{eyebrow}</span>
      <h2 className="text-[14px] font-medium leading-tight text-text-primary">{title}</h2>
    </div>
  );
}
