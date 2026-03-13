import Link from "next/link";

import { ArrowIcon } from "@/components/landing/shared/arrow-icon";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V9c0-.9.3-1.5 1.6-1.5h1.7V4.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4v1.9H8V14h2.6v8h2.9Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2H7Zm10.4 1.7a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 14.8 2.8 2.8 0 0 0 12 9.2Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L7.2 10a16 16 0 0 0 6.8 6.8l1.5-1.8a2 2 0 0 1 1.8-.6l3 .5A2 2 0 0 1 22 16.9Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

const contactCards = [
  {
    title: "(314)252-0967",
    description: "Call us for any queries",
    href: "tel:+13142520967",
    icon: <PhoneIcon />,
  },
  {
    title: "info@archcitytutors.com",
    description: "Email us for any queries",
    href: "mailto:info@archcitytutors.com",
    icon: <MailIcon />,
  },
];

export function ContactMethodsSection() {
  return (
    <section className="bg-white px-4 pb-20 pt-16 text-[#111111] sm:px-6 sm:pt-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e3d9d6] bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2d2d2d] shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#df1620]" />
            Contact
          </div>

          <h2 className="mt-8 max-w-4xl text-4xl font-black tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-[4.5rem] lg:leading-[0.95]">
            Other Ways to
            <span className="mx-3 inline-block rotate-[-2deg] rounded-[1rem] bg-[#fff1f1] px-4 py-1 text-[#ef242a] shadow-[0_8px_30px_rgba(239,36,42,0.08)]">
              Reach
            </span>
            Us.
          </h2>

          <div className="mt-7 flex items-center gap-4 text-[#151515]">
            <Link href="#" aria-label="Facebook" className="transition hover:text-[#df1620]">
              <FacebookIcon />
            </Link>
            <Link href="#" aria-label="Instagram" className="transition hover:text-[#df1620]">
              <InstagramIcon />
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
          {contactCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="flex items-center gap-5 rounded-[1.5rem] bg-[#efe4e1] px-6 py-7 transition hover:scale-[1.01]"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-[#df1620] shadow-[0_10px_25px_rgba(15,23,42,0.06)]">
                {card.icon}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="text-2xl font-black tracking-[-0.04em] text-[#111111]">
                  {card.title}
                </div>
                <div className="mt-1 text-lg text-[#6b6666]">
                  {card.description}
                </div>
              </div>
              <div className="text-[#df1620]">
                <ArrowIcon />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
