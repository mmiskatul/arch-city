import { ReactNode } from "react";

type MarketingHeroFrameProps = {
  thresholdId: string;
  badge: string;
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  media?: ReactNode;
  sectionClassName?: string;
  contentClassName?: string;
  thresholdClassName?: string;
  id?: string;
};

export function MarketingHeroFrame({
  thresholdId,
  badge,
  title,
  description,
  action,
  media,
  sectionClassName = "px-4 pb-20 pt-10 sm:px-6 lg:px-8",
  contentClassName = "mx-auto flex max-w-4xl flex-col items-center text-center",
  thresholdClassName = "mt-10 h-px w-full",
  id,
}: MarketingHeroFrameProps) {
  return (
    <section id={id} className={`relative overflow-hidden ${sectionClassName}`}>
      <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#a50f15]/35 blur-[120px]" />
      <div className="absolute left-[-10%] top-28 h-72 w-72 rounded-full bg-[#7f1015]/20 blur-[120px]" />
      <div className="absolute right-[-8%] top-20 h-80 w-80 rounded-full bg-[#3c0b0d]/25 blur-[150px]" />

      <div className={`relative ${contentClassName}`}>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/82">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ef242a]" />
          {badge}
        </div>

        {title}

        <div className="mt-8 max-w-3xl text-base leading-8 text-white/88 sm:text-lg">
          {description}
        </div>

        {action ? <div className="mt-10">{action}</div> : null}

        <div id={thresholdId} aria-hidden="true" className={thresholdClassName} />
      </div>

      {media}
    </section>
  );
}
