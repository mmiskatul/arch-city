import Image from "next/image";

const bookingSteps = [
  {
    number: "01.",
    title: "Register",
    image: "/booking-1.webp",
    description:
      "Registration is simple and only takes a few minutes to complete. If a student is 17 years or younger, their parent or guardian creates a profile for them. If a parent or guardian has more than one child, a family profile can be created, which will contain a profile for each student. If a student is 18 years or older, they are able to create their own profile, however, a parent or guardian can still create a profile on their behalf. Our student profiles contain the student's first name and last initial, current grade, current school, what they are hoping to receive from their tutoring sessions, and any other information the student or parent believes the tutor should be aware of. Each student profile is required to have a credit card on file and will be charged a monthly, nonrefundable membership fee of $10.",
  },
  {
    number: "02.",
    title: "Book",
    image: "/booking-2.webp",
    description:
      "Once a student profile is created, the student, or their parent or guardian, can view the available tutors and schedule a tutoring session with a tutor of their choosing. For each tutoring session booked, a scheduling fee of $5 is charged to the credit card on file.",
  },
  {
    number: "03.",
    title: "Confirmation",
    image: "/booking-3.webp",
    description:
      "After a student has booked a tutoring session, they will receive a confirmation email confirming the tutor, date, time and location of the tutoring session. In the event either the student or tutor opted to complete the session remotely, the details for completing the session virtually will also be included.",
  },
  {
    number: "04.",
    title: "Payment",
    image: "/booking-4.webp",
    description:
      "Upon completion of the tutoring session, our tutors are paid directly by the students, at the tutors agreed upon rate. Depending on how the tutoring session is completed, our students usually pay via cash, check, Venmo or PayPal. Tips are not required, and our tutors' rates reflect the total amount they expect to be paid.",
  },
  {
    number: "05.",
    title: "Repeat",
    image: "/booking-5.webp",
    description:
      "Repeat as often as needed, with 24/7 access to your account. Students can request time changes, cancel appointments, and continue working with the same tutor whenever they find a great fit.",
  },
];

export function AboutBookingSection() {
  return (
    <section className="bg-white px-4 pb-24 pt-8 text-[#111111] sm:px-6 sm:pt-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e3d9d6] bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2d2d2d] shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#df1620]" />
            Booking
          </div>

          <h2 className="mt-8 max-w-4xl text-3xl font-bold tracking-[-0.06em] text-[#111111] sm:text-4xl lg:text-5xl lg:leading-[0.95]">
            How
            <span className="mx-3 inline-block rotate-[-2deg] rounded-[1rem] bg-[#f3d6d6e7] px-4 py-1 text-[#ef242a] shadow-[0_8px_30px_rgba(239,36,42,0.08)]">
              Booking
            </span>
            Works.
          </h2>
        </div>

        <div className="mx-auto mt-14 max-w-5xl">
          {bookingSteps.map((step) => (
            <article
              key={step.number}
              className="grid gap-8 border-b border-[#e6dddd] py-12 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-12"
            >
              <div>
                <p className="text-sm font-bold text-[#ef242a]">
                  {step.number}
                </p>
                <h3 className="mt-4 text-3xl font-bold tracking-[-0.05em] text-[#111111] sm:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-5 max-w-xl text-base leading-8 text-[#5f5a5a]">
                  {step.description}
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[1.5rem]">
                <div className="relative aspect-square w-full">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
