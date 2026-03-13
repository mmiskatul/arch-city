export function PricingDetailsSection() {
  return (
    <section className="px-4 pb-14 pt-6 text-[#111111] sm:px-6 sm:pt-8 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <article className="rounded-[1.75rem] bg-[#efe4e1] p-7 shadow-[0_18px_50px_rgba(15,23,42,0.04)] sm:p-8">
          <h3 className="text-xl font-bold tracking-[-0.04em] text-[#1a1a1a]">
            Tutor Fee - Varies
          </h3>
          <div className="mt-6 space-y-6 text-lg  leading-9 text-[#4f4a49]">
            <p>
              Each tutor determines their own rate and proudly displays it on
              their tutoring profile. By scheduling a tutoring session with a
              tutor, the account holder agrees to pay the tutor the rate set
              forth in their profile. After a tutoring session is completed,
              students pay the tutor directly via cash, check, Venmo, PayPal,
              or any other previously agreed upon payment method.
            </p>
            <p>
              The agreed upon fee is the total amount the tutor expects to
              receive. In other words, our students are NOT expected to tip our
              tutors, and our tutors are not expecting to receive a tip from
              our students.
            </p>
          </div>
        </article>

        <article className="rounded-[1.75rem] bg-[#efe4e1] p-7 shadow-[0_18px_50px_rgba(15,23,42,0.04)] sm:p-8">
          <h3 className="text-2xl font-bold tracking-[-0.04em] text-[#1a1a1a]">
            Membership Agreement
          </h3>
          <div className="mt-6 space-y-6 text-lg leading-9 text-[#4f4a49]">
            <p>
              We require members to thoroughly review our membership agreement
              and scheduling fees, along with available services and
              cancellation policies, PRIOR to registration. As a small
              business, we are unable to provide refunds to those who are
              uninformed on the services we provide, and the applicable fees.
            </p>
            <p>
              After registration, students are required to manage their
              account, and abide by the terms of the agreement while using our
              platform. Membership is subject to termination at any time due to
              breach of the membership agreement. This includes communications
              with our team that are rude, condescending and/or having
              unrealistic expectations of our staff, and communicating with our
              tutors outside of our platform.
            </p>
            <p>
              We choose to work with students and families who are respectful,
              and conscientious regarding the logistics of our platform that
              include a large network of quality tutors and staff. By
              registering and receiving services through Arch City Tutors, our
              students are indicating that they fully agree to our terms.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
