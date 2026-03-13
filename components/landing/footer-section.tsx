import Image from "next/image";
import Link from "next/link";

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.8 12 4.8 12 4.8s-5.8 0-7.6.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.4 7.6.4 7.6.4s5.8 0 7.6-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

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

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "/#contact" },
];

const navLinks = [
  { label: "Students", href: "/students" },
  { label: "Tutors", href: "/#tutors" },
  { label: "FAQs", href: "/students#faqs" },
];

const resourceLinks = [
  { label: "Join as a Student", href: "/#create-account" },
  { label: "Become a Tutor", href: "/#tutors" },
  { label: "Terms of Service", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
];

export function FooterSection() {
  return (
    <footer className="mx-3 my-4 overflow-hidden rounded-[28px] bg-[#050505] px-6 py-10 text-white sm:px-8 sm:py-12 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.75fr_0.55fr_0.85fr] lg:gap-12">
          <div className="max-w-md">
            <Link href="/" aria-label="Arch City Tutors home">
              <Image
                src="/logo-dark.svg"
                alt="Arch City Tutors"
                width={220}
                height={64}
                className="h-auto w-[220px]"
              />
            </Link>

            <p className="mt-6 text-[1.05rem] leading-9 text-white/82">
              Flexible scheduling, personalized learning, and safety-first tutoring for students of all ages.
            </p>
          </div>

          <div>
            <div className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/46">
              Company
            </div>
            <div className="mt-6 grid gap-4">
              {companyLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[1.05rem] font-bold text-white transition hover:text-[#ef242a]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-8 lg:pt-12">
            <div className="grid gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[1.05rem] font-bold text-white transition hover:text-[#ef242a]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/46">
              Resources
            </div>
            <div className="mt-6 grid gap-4">
              {resourceLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[1.05rem] font-bold text-white transition hover:text-[#ef242a]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-6 text-white/62 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[1.05rem] font-medium">
              Arch City Tutors © 2025, All rights reserved.
            </p>

            <div className="flex items-center gap-5 text-white/62">
              <Link href="#" aria-label="YouTube" className="transition hover:text-white">
                <YoutubeIcon />
              </Link>
              <Link href="#" aria-label="Facebook" className="transition hover:text-white">
                <FacebookIcon />
              </Link>
              <Link href="#" aria-label="Instagram" className="transition hover:text-white">
                <InstagramIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
