import Image from "next/image";

const detailSections = [
  {
    title: "What does Arch City Tutors do for our tutors?",
    description:
      "Although many teachers want to tutor, they don't always want to be responsible for marketing their services and running a tutoring business. At Arch City Tutors, our goal is to provide you with an endless supply of students, and our platform allows you to choose when and how often you want to tutor, allowing you to balance your tutoring commitments with other responsibilities or pursuits. In other words, we help you tutor as much, or as little, as you would like, and we take care of the business side of things. All you have to do is create a profile, mark the dates and times you want to tutor, and show up to your tutoring sessions.",
    image: "/details-1 (1).webp",
    imageLeft: true,
  },
  {
    title: "How does Arch City Tutors work?",
    description:
      "It all starts when a potential tutor creates an Arch City Tutors profile. After a tutor profile is created, our internal team verifies the profile and completes a background check. After a tutor profile is verified, and the tutor passes a background check, the profile is activated. After a tutor's profile has been activated, our tutors update their profiles to list dates and times they are available to tutor. Once a profile is updated with dates and times the tutor is available, students are able to view the profile and schedule tutoring session(s) with the tutor. Unless a tutor's profile says otherwise, students book tutoring sessions at the time and place of the tutor's choosing. After a student schedules a tutoring session with the tutor, the tutor is notified by our platform that a student booked the session, and the tutor is able to see the student's profile and communicate with the student regarding the tutoring session.",
    image: "/details-2 (1).webp",
    imageLeft: false,
  },
  {
    title: "Will my personal contact information be shared with students?",
    description:
      "No. It is prohibited for students and tutors to directly contact each other outside of the platform. All booking and communications will take place through Arch City Tutor's website and message platform.",
    image: "/details-3 (1).webp",
    imageLeft: true,
  },
  {
    title: "What's the catch?",
    description:
      "There is no catch. Our goal is to provide educators with the opportunity to provide their services outside of the classroom, connecting with students in our community.",
    image: "/details-4 (1).webp",
    imageLeft: false,
  },
];

export function TutorsDetailsSection() {
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
