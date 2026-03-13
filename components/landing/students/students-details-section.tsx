import Image from "next/image";

const detailSections = [
  {
    title: "What does Arch City Tutors do for our students?",
    description:
      "We cover a network of qualified, trustworthy, and safe tutors for our students to choose from. Scheduling a tutoring session is as easy as selecting the date/time needed and selecting your tutor.",
    image: "/details-1.webp",
    imageLeft: true,
  },
  {
    title: "Is Arch City Tutors safe?",
    description:
      "Yes! Our tutors create detailed profiles that highlight their qualifications, areas of expertise, teaching style, availability, and pricing. Before we allow a tutor's profile to be placed on our platform, we thoroughly review their profile and complete a comprehensive background check. If a tutor passes our background check, and we determine that they are ready to tutor our students, we activate their profile. As parents ourselves, we do not let a tutor join our platform unless we would trust that tutor with our own children.",
    image: "/details-2.webp",
    imageLeft: false,
  },
  {
    title: "Is Arch City Tutors easy to use?",
    description:
      "Yes! After our students create their profile, they have access to our large network of tutors. Through our platform, our students can use search filters, such as subject, level, location, availability, and rating, to narrow down their options and find their preferred tutor. Once our students find a tutor that meets their requirements, they are able to schedule a tutoring session directly on our platform.",
    image: "/details-3.webp",
    imageLeft: true,
  },
  {
    title: "Where do tutoring sessions take place?",
    description:
      "It's up to the student and the tutor. Whether a student prefers in-person sessions, virtual tutoring, or a combination of both, our tutors will be able to accommodate their needs. When viewing a tutor's profile, students are able to see where that specific tutor is willing to tutor, whether that may be at a library, the student's home, virtual, or another agreed upon location.",
    image: "/details-4.webp",
    imageLeft: false,
  },
  {
    title: "Why Arch City Tutors?",
    description:
      "We worry about our tutors' qualifications, background and work history so you don't have to. Our tutors consist of state certified educators who may work in local school districts and schools. Each and every tutor on Arch City Tutors holds their teaching certification, and our management team reviews each application carefully before allowing the activation of the tutor's profile.",
    image: "/details-5.webp",
    imageLeft: true,
  },
  {
    title: "How will I complete a virtual tutoring session?",
    description:
      "Our tutors have their own account on one of many popular video apps, with Zoom being the most common. If a tutoring session has been requested virtually, the tutor will send the link to join the session via our Arch City Tutors Messages on the booking online so the student can easily join and complete their tutoring session.",
    image: "/details-6.webp",
    imageLeft: false,
  },
  {
    title: "What happens if I need to cancel my session?",
    description:
      "Parents and students may cancel any unneeded tutoring sessions at any time, from their online account. Tutors are unable to cancel booked sessions. Please note: if a booked session is cancelled, the $5 scheduling fee is nonrefundable. If a session must be cancelled within 12 hours of the scheduled start time, the student is still responsible to pay the full amount to the tutor. Please reach out to your tutor directly before canceling or reach out to our management team to assist.",
    image: "/details-7.webp",
    imageLeft: true,
  },
];

export function StudentsDetailsSection() {
  return (
    <section className="bg-white px-4 pb-20 pt-16 text-[#111111] sm:px-6 sm:pt-20 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {detailSections.map((section) => (
          <article
            key={section.title}
            className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
              section.imageLeft ? "" : "lg:[&>div:first-child]:order-2"
            }`}
          >
            <div className="relative overflow-hidden rounded-[1.65rem]">
              <div className="relative aspect-square w-full">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="max-w-xl">
              <h2 className="text-3xl font-black tracking-[-0.05em] text-[#111111] sm:text-4xl lg:text-[3.35rem] lg:leading-[0.98]">
                {section.title}
              </h2>

              <p className="mt-6 text-base leading-8 text-[#5e5a5a] sm:text-lg">
                {section.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
