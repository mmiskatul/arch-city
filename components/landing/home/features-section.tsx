import Image from "next/image";
import Link from "next/link";

export function FeaturesSection() {
  return (
    <section
      id="students"
      className="relative bg-white px-4 pb-24 pt-16 text-[#111111] sm:px-6 sm:pt-20 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ef242a]" />
            Main Features
          </div>

          <h2 className="mt-8 max-w-4xl text-4xl font-bold tracking-[-0.06em] text-[#111111] sm:text-4xl lg:text-6xl lg:leading-[0.95]">
            Book
            <span className="mx-3 inline-block rotate-[-2deg] rounded-[1rem] bg-[#f8d7d7] px-4 py-1 text-red-600 shadow-[0_8px_30px_rgba(239,36,42,0.08)]">
              Tutors
            </span>
            with Ease.
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#6b6b6b] sm:text-lg">
            We understand that students and their families have busy
            schedules. This is why we provide flexible scheduling, allowing our
            students to receive tailored instruction that fits into their
            schedules.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <article className="flex min-h-[28rem] flex-col justify-between rounded-[1.6rem] bg-[#efe4e1] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8">
            <div className="max-w-lg">
              <p className="text-[0.95rem] font-semibold leading-8 text-[#3f3737]">
                Whether our students prefer meeting with a tutor on a regular
                basis, or just need guidance and support before an exam, we are
                here to provide personalized and convenient in-person or
                virtual instruction to students of all ages.
              </p>

              <Link
                href="/signup"
                className="mt-6 inline-flex items-center rounded-full bg-[#ef242a] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#ff343a]"
              >
                Try it now
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>

            <div className="relative mt-8 h-[14rem] w-full">
              <Image
                src="/main-features-1.webp"
                alt="Students collaborating with a tutor"
                fill
                className="object-contain object-bottom"
              />
            </div>
          </article>

          <article className="flex min-h-[28rem] flex-col rounded-[1.6rem] bg-[#050505] p-6 text-white shadow-[0_22px_60px_rgba(0,0,0,0.22)] sm:p-8">
            <div className="relative h-[12.5rem] w-full">
              <Image
                src="/main-features-2.webp"
                alt="Qualified educators"
                fill
                className="object-contain object-top"
              />
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-bold tracking-[-0.04em]">
                Qualified Educators
              </h3>
              <p className="mt-4 text-[0.95rem] leading-8 text-white/82">
                Our tutors are carefully selected for subject expertise and the
                ability to teach effectively in a way that meets students where
                they are academically.
              </p>
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/signup"
                className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-bold text-[#ef242a] transition hover:bg-[#f3f3f3]"
              >
                Get started
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </article>

          <article className="flex min-h-[25rem] flex-col rounded-[1.6rem] bg-[#050505] p-5 text-white shadow-[0_22px_60px_rgba(0,0,0,0.22)] sm:p-6">
            <div className="relative overflow-hidden rounded-[1.2rem]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/main-features-3.webp"
                  alt="Virtual tutoring session"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-bold tracking-[-0.04em]">
                Safe, Flexible, and Tailored Tutoring
              </h3>
              <p className="mt-4 text-[0.95rem] leading-8 text-white/82">
                At Arch City Tutors, safety is our top priority, with strict
                vetting for all tutors. We offer flexible, pay-as-you-go
                sessions and support learning beyond the classroom.
              </p>
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/signup"
                className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-bold text-[#ef242a] transition hover:bg-[#f3f3f3]"
              >
                Get started
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </article>

          <article className="flex min-h-[25rem] flex-col justify-between rounded-[1.6rem] bg-[#efe4e1] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8">
            <div className="mx-auto max-w-xl text-center">
              <h3 className="text-3xl font-bold tracking-[-0.04em] text-[#232323]">
                Empowering Students to Learn Beyond the Classroom
              </h3>
              <p className="mt-4 text-[0.98rem] leading-8 text-[#5d5757]">
                We help our students grasp concepts more efficiently, so they
                have time to explore additional learning opportunities that can
                also be learned outside the classroom.
              </p>
            </div>

            <div className="relative mt-8 h-[17rem] w-full">
              <Image
                src="/main-features-4.webp"
                alt="Student studying independently"
                fill
                className="object-contain object-bottom"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
