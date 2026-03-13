import Link from "next/link";

const pricingCards = [
  {
    title: "Tutor",
    price: "$0",
    suffix: "/ mo",
    description:
      "Only educators certified with the Missouri Department of Elementary and Secondary Education can apply and will be approved after successful completion of our vetting process.",
    bullets: [
      "Get paid directly by students",
      "Market your services to our vast network of students",
      "24/7 support from our team",
    ],
  },
  {
    title: "Scheduling Fee",
    price: "$5",
    suffix: "/ session",
    description:
      "This is a non-refundable scheduling fee paid directly to Arch City Tutors.",
    bullets: [
      "Top class vetted tutors",
      "Access to our vast network of tutors",
      "24/7 support from our team",
    ],
  },
  {
    title: "Student",
    price: "$10",
    suffix: "/ mo",
    description: "Get started for just $0.33/day. Billed monthly.",
    bullets: [
      "Top class vetted tutors",
      "Access to our vast network of tutors",
      "24/7 support from our team",
    ],
  },
  {
    title: "Parent",
    price: "",
    suffix: "",
    description:
      "Fixed monthly fee based on the number students included in a Parent's profile:\n$10/mo for 1 Student\n$17.50/mo for 2 Student\n$22.50/mo for 3 Students\n$26/mo for 4 Students",
    bullets: [
      "Top class vetted tutors",
      "Access to our vast network of tutors",
      "24/7 support from our team",
    ],
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}

export function PricingSection({
  thresholdId,
}: {
  thresholdId?: string;
}) {
  return (
    <section
      id="pricing"
      className="bg-[#050505] px-4 pb-24 pt-20 text-white sm:px-6 sm:pt-24 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/4 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/82">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ef242a]" />
            Pricing
          </div>

          <h2 className="mt-7 max-w-3xl text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl lg:text-6xl lg:leading-[0.95]">
            Simple
            <span className="mx-3 inline-block rotate-[-2deg] rounded-[1rem] bg-white px-4 py-1 text-[#ef242a] shadow-[0_8px_28px_rgba(255,255,255,0.08)]">
              Scalable 
            </span> <br />
            Pricing.
          </h2>

          <p className="mt-6 max-w-3xl text-xs leading-7 text-white/78 px-20 sm:text-sm sm:px-30">
            Students pay a fixed monthly membership fee to gain access to our
            vast network of tutors. Students pay a fixed scheduling fee each
            time they schedule a tutoring session. At the conclusion of each
            tutoring session, students pay an agreed upon tutoring fee directly
            to the tutor.
          </p>

          {thresholdId ? (
            <div id={thresholdId} aria-hidden="true" className="h-px w-full" />
          ) : null}
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {pricingCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[1.45rem] border border-black/8 bg-white p-5 text-[#121212] shadow-[0_18px_50px_rgba(0,0,0,0.24)] sm:p-6"
            >
              <div className="text-center">
                <div className="text-lg font-bold text-[#ef242a]">
                  {card.title}
                </div>

                {card.price ? (
                  <div className="mt-3 text-[#101010]">
                    <span className="text-5xl font-black tracking-[-0.06em]">
                      {card.price}
                    </span>
                    <span className="ml-1 text-xl font-bold text-[#2a2a2a]">
                      {card.suffix}
                    </span>
                  </div>
                ) : null}

                <p className="mx-auto mt-4 max-w-md whitespace-pre-line text-sm leading-7 text-[#4b4b4b]">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 rounded-[1rem] border border-[#e8e0de] bg-[#f8f6f6] p-4">
                <Link
                  href="#create-account"
                  className="flex h-12 w-full items-center justify-center rounded-full bg-[#ef242a] text-sm font-bold text-white transition hover:bg-[#ff343a]"
                >
                  Get started
                </Link>

                <div className="mt-5 space-y-3">
                  {card.bullets.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-[#4e4e4e]">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ffe7e7] text-[#ef242a]">
                        <CheckIcon />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-xs font-semibold text-white/62">
          Prices include any applicable taxes.
        </p>
      </div>
    </section>
  );
}
