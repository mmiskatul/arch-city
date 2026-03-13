import Image from "next/image";
import Link from "next/link";

export function StudentsCTASection() {
  return (
    <section className="mx-3 my-4 overflow-hidden rounded-[28px] bg-[#efe4e1] px-6 py-10 text-[#111111] sm:px-8 sm:py-12 lg:px-12 lg:py-14">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-12">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-black tracking-[-0.06em] text-[#080808] sm:text-5xl lg:text-[5rem] lg:leading-[0.96]">
            Sign up and Find the Perfect Tutor.
          </h2>

          <p className="mt-8 text-xl leading-9 text-[#1f1f1f] sm:text-2xl">
            Get started for just $10/month. Cancel anytime.
          </p>

          <Link
            href="/#create-account"
            className="mt-10 inline-flex items-center rounded-full bg-[#df1620] px-7 py-4 text-xl font-bold text-white transition hover:bg-[#f02029]"
          >
            Get started
            <span className="ml-3" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[42rem]">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src="/home-06-builder-tools.webp"
              alt="Students getting started with Arch City Tutors"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
