export function FeaturesSection() {
  return (
    <section
      id="students"
      className="relative bg-white px-4 pb-24 pt-16 text-[#111111] sm:px-6 sm:pt-20 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#3d3d3d] shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ef242a]" />
            Main Features
          </div>

          <h2 className="mt-8 max-w-4xl text-4xl font-black tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-[4.5rem] lg:leading-[0.95]">
            Book
            <span className="mx-3 inline-block rotate-[-2deg] rounded-[1rem] bg-[#fff1f1] px-4 py-1 text-[#ef242a] shadow-[0_8px_30px_rgba(239,36,42,0.08)]">
              Tutors
            </span>
            with Ease.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#686868] sm:text-lg">
            Browse matched tutors, compare expertise, and schedule sessions in
            a few clicks without the usual back-and-forth.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Fast Matching",
              body: "We connect students with qualified tutors based on subject, goals, and schedule.",
            },
            {
              title: "Simple Scheduling",
              body: "Pick times, confirm sessions, and manage changes from one clear dashboard.",
            },
            {
              title: "Clear Follow-Up",
              body: "Track upcoming lessons, completed sessions, and tutor communication in one place.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-[#ececec] bg-[#fcfcfc] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
            >
              <div className="inline-flex rounded-full bg-[#fff1f1] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ef242a]">
                Feature
              </div>
              <h3 className="mt-5 text-2xl font-bold tracking-[-0.04em] text-[#111111]">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-[#666666]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
