type ServiceCategory = {
  title: string;
  items: string[];
};

const serviceCategories: ServiceCategory[] = [
  {
    title: "General Tutoring",
    items: ["1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade"],
  },
  {
    title: "English Language Arts (ELA)",
    items: [
      "Literature (fiction, non-fiction, poetry, drama)",
      "Reading Comprehension",
      "Writing (composition, grammar, creative writing, essay writing)",
    ],
  },
  {
    title: "Mathematics",
    items: [
      "Algebra",
      "Arithmetic (addition, subtraction, multiplication, division)",
      "Calculus (in advanced courses)",
      "Geometry",
      "Statistics and Probability",
      "Trigonometry",
    ],
  },
  {
    title: "Science",
    items: [
      "Anatomy and Physiology",
      "Astronomy",
      "Biology",
      "Chemistry",
      "Earth Science",
      "Environmental Science",
      "Physics",
    ],
  },
  {
    title: "Social Studies",
    items: [
      "Anthropology and Sociology",
      "Civics and Government",
      "Economics",
      "Geography",
      "U.S. History",
      "World History",
    ],
  },
  {
    title: "Foreign Languages",
    items: ["French", "German", "Japanese", "Latin", "Mandarin", "Spanish"],
  },
];

export function AboutServicesSection() {
  return (
    <section className="bg-white px-4 pb-20 pt-8 text-[#111111] sm:px-6 sm:pt-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e3d9d6] bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2d2d2d] shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#df1620]" />
            Offered Subjects
          </div>

          <h2 className="mt-8 max-w-4xl text-4xl font-black tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-[4.5rem] lg:leading-[0.95]">
            <span className="inline-block rotate-[-2deg] rounded-[1rem] bg-[#fff1f1] px-4 py-1 text-[#ef242a] shadow-[0_8px_30px_rgba(239,36,42,0.08)]">
              Services
            </span>
            <span className="ml-3">We Offer.</span>
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#6d6d6d]">
            At Arch City Tutors, we aim to provide a variety of tutoring
            subjects. Please see below for the available tutoring options.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-12">
          {serviceCategories.map((category) => (
            <div key={category.title}>
              <h3 className="text-2xl font-black tracking-[-0.04em] text-[#111111]">
                {category.title}
              </h3>

              <div className="mt-5 space-y-4">
                {category.items.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-[#5b5757]">
                    <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ffe7e7] text-[#ef242a]">
                      <CheckIcon />
                    </span>
                    <span className="text-base leading-7">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-5xl text-sm font-semibold text-[#817c7c]">
          ** Please note this is not a comprehensive list, but covers many of
          the available tutoring subjects.
        </p>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}
