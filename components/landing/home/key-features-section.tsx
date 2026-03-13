import Link from "next/link";

import { AiOutlineArrowRight, AiOutlineDatabase, AiOutlineHeart, AiOutlineRadarChart, AiOutlineSafety, AiOutlineThunderbolt } from "react-icons/ai";

function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#df1620] text-white">
      {children}
    </div>
  );
}

const cards = [
  { title: "User-friendly Interface", icon: <AiOutlineThunderbolt /> },
  { title: "Advanced Member Dashboard", icon: <AiOutlineDatabase /> },
  { title: "Certified, Screened Tutors", icon: <AiOutlineSafety /> },
  { title: "Secure and Reliable Payment", icon: <AiOutlineRadarChart /> },
  { title: "24/7 Dedicated Support", icon: <AiOutlineHeart /> },
  { title: "Advanced Filtering Options", icon: <AiOutlineDatabase /> },
];

export function KeyFeaturesSection() {
  return (
    <section className="bg-white px-4 pb-28 pt-8 text-[#111111] sm:px-6 sm:pt-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e3d9d6] bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#df1620]" />
            Key Features
          </div>

          <p className="mt-8 max-w-5xl text-xl leading-[1.45] tracking-[-0.04em] text-[#202020] sm:text-2xl lg:text-3xl lg:leading-[1.38]">
            With an <span className="font-bold">easy-to-use</span> and advanced
            dashboard, Arch City Tutors is your gateway to finding the{" "}
            <span className="font-bold">perfect tutor</span> and{" "}
            <span className="font-bold"> scheduling tutoring sessions</span>{" "}
            with ease.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.slice(0, 4).map((card) => (
            <article
              key={card.title}
              className="flex min-h-[17rem] flex-col rounded-xl bg-[#efe4e1] p-7 transition-transform duration-300 ease-out hover:scale-105"
            >
              <IconWrap>{card.icon}</IconWrap>
              <h3 className="mt-auto max-w-[10rem] text-[1.05rem] font-bold leading-[1.18] tracking-[-0.03em] text-[#111111]">
                {card.title}
              </h3>
            </article>
          ))}

          {cards.slice(4, 6).map((card) => (
            <article
              key={card.title}
              className="flex min-h-[17rem] flex-col rounded-xl bg-[#efe4e1] p-7 transition-transform duration-300 ease-out hover:scale-105 sm:col-span-1"
            >
              <IconWrap>{card.icon}</IconWrap>
              <h3 className="mt-auto max-w-[10rem] text-[1.05rem] font-bold leading-[1.18] tracking-[-0.03em] text-[#111111]">
                {card.title}
              </h3>
            </article>
          ))}

          <div className="flex min-h-[17rem] flex-col items-center justify-center rounded-xl bg-white p-7 text-center sm:col-span-2 xl:col-span-2">
              <Link
                href="#create-account"
                className="flex h-20 w-20 items-center justify-center rounded-full bg-[#efe4e1] text-[#df1620] transition hover:bg-[#e8d8d4]"
                aria-label="Get started today"
              >
                <AiOutlineArrowRight className="h-7 w-7" />
              </Link>
            <p className="mt-5 text-[1.05rem] font-semibold text-[#2c2c2c]">
              Get started today
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
