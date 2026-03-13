import Link from "next/link";

export function ContactHeroSection({
  thresholdId,
}: {
  thresholdId: string;
}) {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 lg:px-8"
    >
      <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#a50f15]/35 blur-[120px]" />
      <div className="absolute left-[-10%] top-28 h-72 w-72 rounded-full bg-[#7f1015]/20 blur-[120px]" />
      <div className="absolute right-[-8%] top-20 h-80 w-80 rounded-full bg-[#3c0b0d]/25 blur-[150px]" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/82">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ef242a]" />
          Contact
        </div>

        <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-[5.2rem] lg:leading-[0.94]">
          Feel Free to
          <span className="mx-3 inline-block rotate-[-2deg] rounded-[1rem] bg-white px-4 py-1 text-[#ef242a] shadow-[0_12px_60px_rgba(255,255,255,0.1)]">
            Reach
          </span>
          Us.
        </h1>

        <p className="mt-8 max-w-3xl text-base leading-8 text-white/88 sm:text-lg">
          Using the options below, and our dedicated team will respond to your
          inquiries promptly.
        </p>
      </div>

      <div className="relative mx-auto mt-14 max-w-3xl">
        <div className="rounded-[1.75rem] bg-white px-6 py-8 text-left text-[#111111] shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:px-8 sm:py-10">
          <p className="max-w-2xl text-lg leading-8 text-[#7a7a7a]">
            Have a question or feedback? Fill out the form below, and
            we&apos;ll get back to you as soon as possible.
          </p>

          <form className="mt-8 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Full name"
                className="h-14 rounded-xl border border-[#ece6e4] px-4 text-base text-[#111111] outline-none transition placeholder:text-[#b4b4b4] focus:border-[#ef242a]"
              />
              <input
                type="email"
                placeholder="Your email"
                className="h-14 rounded-xl border border-[#ece6e4] px-4 text-base text-[#111111] outline-none transition placeholder:text-[#b4b4b4] focus:border-[#ef242a]"
              />
            </div>

            <input
              type="text"
              placeholder="Subject"
              className="h-14 rounded-xl border border-[#ece6e4] px-4 text-base text-[#111111] outline-none transition placeholder:text-[#b4b4b4] focus:border-[#ef242a]"
            />

            <textarea
              rows={6}
              placeholder="Your message.."
              className="rounded-xl border border-[#ece6e4] px-4 py-4 text-base text-[#111111] outline-none transition placeholder:text-[#b4b4b4] focus:border-[#ef242a]"
            />

            <button
              type="button"
              className="mt-2 inline-flex h-14 items-center justify-center rounded-full bg-[#df1620] px-8 text-lg font-bold text-white transition hover:bg-[#f02029]"
            >
              Send message
            </button>
          </form>

          <p className="mt-5 text-center text-lg text-[#6b6b6b]">
            Or drop us a message via{" "}
            <Link
              href="mailto:info@archcitytutors.com"
              className="font-semibold text-[#df1620]"
            >
              email
            </Link>
          </p>
        </div>
      </div>

      <div id={thresholdId} aria-hidden="true" className="mt-10 h-px w-full" />
    </section>
  );
}
