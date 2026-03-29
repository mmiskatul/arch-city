"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";

import { FormStatusMessage } from "@/components/shared/form-status-message";
import {
  AiOutlineArrowLeft,
  AiOutlineCheckCircle,
  AiOutlineDesktop,
  AiOutlineDollarCircle,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineHeart,
} from "react-icons/ai";
import { submitPublicApi } from "@/lib/api/public-api";
import {
  PARENT_DASHBOARD_ROUTE,
  SIGNUP_ROUTE,
  STUDENT_DASHBOARD_ROUTE,
  TUTOR_DASHBOARD_ROUTE,
} from "@/lib/routes";

type AuthMode = "login" | "signup";
type SignupRole = "student" | "tutor" | "parent";
type SmsConsent = "yes" | "no" | "";
type SubmitState = "idle" | "submitting" | "success" | "error";

type AuthShellProps = {
  mode: AuthMode;
};

type TouchedFields = Record<string, boolean>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function shouldRouteToStudentDashboard(data: unknown) {
  if (!isRecord(data)) {
    return false;
  }

  const role = readString(data.role);
  const user = isRecord(data.user) ? data.user : null;
  const userRole = readString(user?.role);

  return role === "student" || userRole === "student";
}

function shouldRouteToParentDashboard(data: unknown) {
  if (!isRecord(data)) {
    return false;
  }

  const role = readString(data.role);
  const user = isRecord(data.user) ? data.user : null;
  const userRole = readString(user?.role);

  return role === "parent" || userRole === "parent";
}

function shouldRouteToTutorDashboard(data: unknown) {
  if (!isRecord(data)) {
    return false;
  }

  const role = readString(data.role);
  const user = isRecord(data.user) ? data.user : null;
  const userRole = readString(user?.role);

  return role === "tutor" || userRole === "tutor";
}

function EyeIcon({ open }: { open: boolean }) {
  const Icon = open ? AiOutlineEye : AiOutlineEyeInvisible;

  return <Icon className="h-4 w-4" aria-hidden="true" />;
}

function GraduationCapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11.5V16c0 1 2.7 3 6 3s6-2 6-3v-4.5" />
    </svg>
  );
}

function TutorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </svg>
  );
}

function ParentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function BackIcon() {
  return <AiOutlineArrowLeft className="h-5 w-5" aria-hidden="true" />;
}

function PasswordRule({
  label,
  satisfied,
}: {
  label: string;
  satisfied: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-sm font-medium ${
        satisfied ? "text-[#4fb36e]" : "text-[#6b7280]"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${
          satisfied
            ? "border-[#8ddb9e] bg-[#ecf9f0] text-[#4fb36e]"
            : "border-[#d1d5db] bg-white text-[#9ca3af]"
        }`}
        aria-hidden="true"
      >
        {satisfied ? "✓" : ""}
      </span>
      <span>{label}</span>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm font-medium text-[#df1620]">{message}</p>;
}

function getInputClass(hasError: boolean) {
  return `h-14 w-full rounded-[18px] border px-4 text-base text-[#111827] outline-none transition placeholder:text-[#a6aebf] ${
    hasError
      ? "border-[#ef7a80] bg-transparent focus:border-[#df1620]"
      : "border-[#e2e6ed] bg-transparent focus:border-[#a0afc7]"
  }`;
}

function AuthVisualPanel() {
  return (
    <aside className="hidden lg:block">
      <div className="lg:sticky lg:top-0">
        <div className="m-5 overflow-visible rounded-[36px] bg-black/0">
          <Image
            src="/signup-page-1.webp"
            alt="Student learning with Arch City Tutors"
            width={900}
            height={900}
            className="h-screen w-full rounded-xl object-cover"
            priority
          />
          <div className="absolute inset-x-9 bottom-3 rounded-xl bg-white px-7 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
            <ul className="space-y-3 text-sm font-medium text-[#111827]">
              {[
            ].map((item, index) => {
              const IconComponent = badgeIcons[index];
              return (
                <li key={item.text} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fde7e7] text-[#df1620]">
                    <IconComponent className="h-4 w-4" />
                  </span>
                  <span>{item.text}</span>
                </li>
              );
            })}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}

const badgeIcons = [
  AiOutlineCheckCircle,
  AiOutlineDollarCircle,
  AiOutlineDesktop,
  AiOutlineHeart,
];

const signupRoleOptions = [
  {
    key: "student" as const,
    title: "I'm a Student",
    description: "If you are 18 or older, and a student looking for help.",
    icon: <GraduationCapIcon />,
  },
  {
    key: "tutor" as const,
    title: "I'm a Tutor",
    description: "If you are a tutor, and want to share your knowledge with students.",
    icon: <TutorIcon />,
  },
  {
    key: "parent" as const,
    title: "I'm a Parent",
    description:
      "If you are a parent and want to manage your child's account while they are under 18.",
    icon: <ParentIcon />,
  },
];


const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\-\s]{10,}$/;

const memberAgreement = `THIS MEMBER AGREEMENT (this "Agreement"), effective as of March, 2026 is entered into by and between STL TUTORING SOLUTIONS, LLC, a Missouri limited liability company, doing business as ARCH CITY TUTORS (the "Company" and/or "ACT") and ("Client") (the Company and Client are each referred to individually as a "Party" and collectively as the "Parties").

WITNESSETH:

WHEREAS, the Company is a limited liability company organized and existing, in good standing, under the laws of the State of Missouri;

WHEREAS, the Company is in the business of providing and/or arranging for the provision of accessible, affordable, and more convenient supplemental educational instruction and tutoring solutions to help students achieve academic excellence; and

WHEREAS, Client desires to create an account on the Company's Site and use the Company's platform to request tutoring sessions and related services.

NOW THEREFORE, for and in consideration of the mutual covenants and benefits contained herein, and for such other adequate and valuable consideration, the receipt and sufficiency of which is expressly acknowledged by the Parties, the Company and Client, intending to be legally bound hereby, do expressly and forever agree as follows:

1. Term: The Term of this Agreement shall commence upon the Effective Date first set forth above and shall remain in full force and effect for a period of six (6) consecutive months (the "Term"). During the Term, either Party may terminate this Agreement at any time upon not less than thirty (30) days prior written notice to the other Party.

2. Services: Client understands that membership provides access to the Arch City Tutors platform and related support. Tutoring sessions, scheduling fees, cancellation terms, and tutor rates are governed by the policies displayed on the platform at the time of booking.

3. Communications: Client agrees to receive service-related emails and account notices necessary for membership, scheduling, confirmations, and support. Promotional messages remain optional and may be declined by the Client.

4. User Responsibilities: Client agrees that all account information submitted during registration is true and accurate, and that the platform will be used only for lawful and platform-approved purposes.

5. Platform Policies: By continuing, Client agrees to comply with the Company's terms of service, privacy policy, and booking policies, each as amended from time to time and made available through the Company's website.

6. Acceptance: Client acknowledges that reading and accepting this Agreement is required in order to create an account and use the Company's services.`;

export function AuthShell({ mode }: AuthShellProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginTouched, setLoginTouched] = useState<TouchedFields>({});
  const [signupRole, setSignupRole] = useState<SignupRole>("student");
  const [signupStep, setSignupStep] = useState<"role" | "form">("role");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [heardFrom, setHeardFrom] = useState("");
  const [agreementScrolledToEnd, setAgreementScrolledToEnd] = useState(false);
  const [acceptedAgreement, setAcceptedAgreement] = useState(false);
  const [smsConsent, setSmsConsent] = useState<SmsConsent>("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [signupTouched, setSignupTouched] = useState<TouchedFields>({});
  const [loginSubmitState, setLoginSubmitState] = useState<SubmitState>("idle");
  const [loginSubmitMessage, setLoginSubmitMessage] = useState("");
  const [signupSubmitState, setSignupSubmitState] = useState<SubmitState>("idle");
  const [signupSubmitMessage, setSignupSubmitMessage] = useState("");
  const isLogin = mode === "login";

  const loginErrors = useMemo(() => {
    const identifier = loginIdentifier.trim();
    const password = loginPassword.trim();

    return {
      identifier:
        identifier.length === 0
          ? "Enter your email address or student id."
          : identifier.includes("@") && !EMAIL_PATTERN.test(identifier)
            ? "Enter a valid email address."
            : "",
      password:
        password.length === 0
          ? "Enter your password."
          : password.length < 8
            ? "Password must be at least 8 characters."
            : "",
    };
  }, [loginIdentifier, loginPassword]);

  const passwordChecks = useMemo(() => {
    const uppercase = /[A-Z]/.test(signupPassword);
    const number = /\d/.test(signupPassword);
    const special = /[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\;]/.test(signupPassword);
    const length = signupPassword.length >= 8;
    const match =
      signupPassword.length > 0 &&
      signupConfirmPassword.length > 0 &&
      signupPassword === signupConfirmPassword;

    return {
      uppercase,
      number,
      special,
      length,
      match,
    };
  }, [signupConfirmPassword, signupPassword]);

  const signupCanContinue =
    signupFirstName.trim().length > 0 &&
    signupLastName.trim().length > 0 &&
    signupEmail.length > 0 &&
    PHONE_PATTERN.test(signupPhone.trim()) &&
    passwordChecks.uppercase &&
    passwordChecks.number &&
    passwordChecks.special &&
    passwordChecks.length &&
    passwordChecks.match &&
    heardFrom.length > 0 &&
    acceptedAgreement &&
    smsConsent.length > 0 &&
    acceptedTerms;

  const signupErrors = useMemo(() => {
    return {
      firstName:
        signupFirstName.trim().length === 0 ? "Enter your first name." : "",
      lastName:
        signupLastName.trim().length === 0 ? "Enter your last name." : "",
      email:
        signupEmail.trim().length === 0
          ? "Enter your email address."
          : !EMAIL_PATTERN.test(signupEmail.trim())
            ? "Enter a valid email address."
            : "",
      phone:
        signupPhone.trim().length === 0
          ? "Enter your phone number."
          : !PHONE_PATTERN.test(signupPhone.trim())
            ? "Enter a valid phone number."
            : "",
      password:
        signupPassword.length === 0
          ? "Create a password."
          : !(
                passwordChecks.uppercase &&
                passwordChecks.number &&
                passwordChecks.special &&
                passwordChecks.length
              )
            ? "Password must meet all of the rules below."
            : "",
      confirmPassword:
        signupConfirmPassword.length === 0
          ? "Confirm your password."
          : !passwordChecks.match
            ? "Passwords do not match."
            : "",
      heardFrom:
        heardFrom.length === 0
          ? "Select how you heard about Arch City Tutors."
          : "",
      agreement:
        acceptedAgreement || !agreementScrolledToEnd
          ? ""
          : "Accept the agreement to continue.",
      smsConsent:
        smsConsent.length === 0 ? "Choose one SMS consent option." : "",
      terms:
        acceptedTerms ? "" : "You must agree to the Terms of Service.",
    };
  }, [
    acceptedAgreement,
    acceptedTerms,
    agreementScrolledToEnd,
    heardFrom,
    passwordChecks.length,
    passwordChecks.match,
    passwordChecks.number,
    passwordChecks.special,
    passwordChecks.uppercase,
    signupConfirmPassword.length,
    signupEmail,
    signupFirstName,
    signupLastName,
    signupPassword.length,
    signupPhone,
    smsConsent,
  ]);

  const loginCanSubmit = !loginErrors.identifier && !loginErrors.password;

  function markLoginTouched(field: string) {
    setLoginTouched((current) => ({ ...current, [field]: true }));
  }

  function markSignupTouched(field: string) {
    setSignupTouched((current) => ({ ...current, [field]: true }));
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginTouched({
      identifier: true,
      password: true,
    });

    if (!loginCanSubmit) {
      setLoginSubmitState("error");
      setLoginSubmitMessage("Please fix the highlighted fields before submitting.");
      return;
    }

    setLoginSubmitState("submitting");
    setLoginSubmitMessage("");

    const response = await submitPublicApi({
      endpoint: "login",
      payload: {
        identifier: loginIdentifier.trim(),
        password: loginPassword,
      },
    });

    if (!response.ok) {
      setLoginSubmitState("error");
      setLoginSubmitMessage(response.error);
      return;
    }

    setLoginSubmitState("success");

    if (shouldRouteToStudentDashboard(response.data)) {
      setLoginSubmitMessage("Login successful. Redirecting to student dashboard...");
      router.push(STUDENT_DASHBOARD_ROUTE);
      return;
    }

    if (shouldRouteToParentDashboard(response.data)) {
      setLoginSubmitMessage("Login successful. Redirecting to parent dashboard...");
      router.push(PARENT_DASHBOARD_ROUTE);
      return;
    }

    if (shouldRouteToTutorDashboard(response.data)) {
      setLoginSubmitMessage("Login successful. Redirecting to tutor dashboard...");
      router.push(TUTOR_DASHBOARD_ROUTE);
      return;
    }

    setLoginSubmitMessage("Login request sent successfully.");
  }

  async function handleSignupSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignupTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      heardFrom: true,
      agreement: true,
      smsConsent: true,
      terms: true,
    });

    if (!signupCanContinue) {
      setSignupSubmitState("error");
      setSignupSubmitMessage("Please complete all required fields before continuing.");
      return;
    }

    setSignupSubmitState("submitting");
    setSignupSubmitMessage("");

    const response = await submitPublicApi({
      endpoint: "signup",
      payload: {
        role: signupRole,
        firstName: signupFirstName.trim(),
        lastName: signupLastName.trim(),
        email: signupEmail.trim(),
        phone: signupPhone.trim(),
        password: signupPassword,
        confirmPassword: signupConfirmPassword,
        heardFrom,
        acceptedAgreement,
        smsConsent,
        acceptedTerms,
      },
    });

    if (!response.ok) {
      setSignupSubmitState("error");
      setSignupSubmitMessage(response.error);
      return;
    }

    setSignupSubmitState("success");
    setSignupSubmitMessage("Signup request sent successfully.");
  }

  if (!isLogin && signupStep === "role") {
    return (
      <main className="min-h-screen bg-[#f3f0ef]">
        <div className="grid min-h-screen bg-[#f3f0ef]">
          <section className="flex items-start justify-center px-6 py-10 sm:px-10 lg:px-14">
            <div className="w-full max-w-5xl text-center">
              <Link
                href="/"
                aria-label="Arch City Tutors home"
                className="mx-auto block w-fit"
              >
              <Image
                src="/logo-primary.85801dda.svg"
                alt="Arch City Tutors"
                width={160}
                height={56}
                priority
                className="h-auto w-[96px] sm:w-[108px]"
              />
              </Link>

              <h1 className="mt-9 text-4xl font-black tracking-[-0.05em] text-[#0f172a] sm:text-[3rem]">
                Welcome to Arch City Tutors
              </h1>
              <p className="mt-4 text-lg leading-8 text-[#6b7280]">
                Let&apos;s get started by telling us who you are:
              </p>

              <div className="mt-12 grid gap-5 lg:grid-cols-3">
                {signupRoleOptions.map((option) => {
                  const isSelected = option.key === signupRole;

                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setSignupRole(option.key)}
                      className={`rounded-[1.6rem] border px-8 py-10 text-center transition ${
                        isSelected
                          ? "border-[#ef7a80] bg-[#f8efef] text-[#df1620] shadow-[0_16px_40px_rgba(239,36,42,0.08)]"
                          : "border-[#e5e7eb] bg-transparent text-[#111827] hover:border-[#ef7a80]/60 hover:bg-white/35"
                      }`}
                    >
                      <div className="flex justify-center">{option.icon}</div>
                      <h2 className="mt-5 text-2xl font-bold tracking-[-0.04em]">
                        {option.title}
                      </h2>
                      <p className="mt-4 text-base leading-7 text-[#6b7280]">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setSignupStep("form")}
                className="mt-10 inline-flex h-14 min-w-[10rem] items-center justify-center rounded-xl bg-[#df1620] px-8 text-lg font-bold text-white shadow-[0_18px_40px_rgba(223,22,32,0.22)] transition hover:bg-[#f02029]"
              >
                Continue
                <span className="flex item-center justify-center ml-3" aria-hidden="true">
                  <FaArrowRightLong />
                </span>
              </button>

              <p className="mt-6 text-center text-base text-[#4b5563]">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-[#ef242a]">
                  Log in
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main
      className={
        isLogin
          ? "min-h-screen bg-[#fafafa] px-4 py-6 sm:px-6 lg:px-8"
          : "min-h-screen bg-[#f3f0ef]"
      }
    >
      <div
        className={
          isLogin
            ? "mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] bg-[#f3f0ef] shadow-[0_32px_80px_rgba(15,23,42,0.08)] lg:grid-cols-2 lg:gap-0"
            : "grid min-h-screen bg-[#f3f0ef] lg:grid-cols-2 lg:gap-0"
        }
      >
        <section
          className={`flex items-start px-4 py-12 sm:px-10 lg:px-16 ${
            isLogin ? "justify-center" : "justify-start"
          }`}
        >
          <div className={`w-full ${isLogin ? "max-w-md" : ""}`}>
            {!isLogin ? (
              <button
                type="button"
                onClick={() => setSignupStep("role")}
                aria-label="Back to account type selection"
                className="inline-flex size-8 items-center justify-center rounded-full border border-[#d9d9d9] bg-white text-[#4b5563] shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition hover:border-[#cfcfcf] hover:bg-[#f8f8f8]"
              >
                <BackIcon />
              </button>
            ) : null}

            <Link
              href="/"
              aria-label="Arch City Tutors home"
              className="mx-auto block w-fit"
            >
              <Image
                src="/logo-primary.85801dda.svg"
                alt="Arch City Tutors"
                width={160}
                height={56}
                priority
                className="h-auto w-[80px] sm:w-[96px]"
              />
            </Link>

            <div className="mt-9 text-center">
              <h1 className="text-4xl font-black tracking-[-0.05em] text-[#0f172a] sm:text-5xl">
                {isLogin ? "Hey, Welcome Back!" : "Ready to Get Started?"}
              </h1>

              <p className="mt-5 text-base leading-7 text-[#6b7280]">
                {isLogin
                  ? "A brand new day is here. It's your day to shape. Log in and find the perfect tutor for you."
                  : "A brand new day is here. It's your day to shape. Sign up and find the perfect tutor for you."}
              </p>
            </div>


            {isLogin ? (
              <form className="mt-12 space-y-5" onSubmit={handleLoginSubmit} noValidate>
                <FormStatusMessage
                  type={
                    loginSubmitState === "success"
                      ? "success"
                      : loginSubmitState === "error"
                        ? "error"
                        : "idle"
                  }
                  message={loginSubmitMessage}
                />
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#4b5563]">
                    Email address or student id
                  </label>
                  <input
                    type="email"
                    value={loginIdentifier}
                    onChange={(event) => setLoginIdentifier(event.target.value)}
                    onBlur={() => markLoginTouched("identifier")}
                    className={getInputClass(Boolean(loginTouched.identifier && loginErrors.identifier))}
                  />
                  <FieldError
                    message={loginTouched.identifier ? loginErrors.identifier : ""}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#4b5563]">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      onBlur={() => markLoginTouched("password")}
                      className={`${getInputClass(
                        Boolean(loginTouched.password && loginErrors.password),
                      )} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#6b7280]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  <FieldError
                    message={loginTouched.password ? loginErrors.password : ""}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-1 text-xs sm:text-base">
                  <label className="flex items-center gap-3 text-[#374151]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#d1d5db]"
                    />
                    Remember me
                  </label>

                  <Link
                    href={SIGNUP_ROUTE}
                    className="font-medium text-[#ef242a] transition hover:text-[#c81a21]"
                  >
                    I forgot my password
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={!loginCanSubmit || loginSubmitState === "submitting"}
                  className={`inline-flex h-14 w-full items-center justify-center rounded-xl text-lg font-bold text-white transition ${
                    loginCanSubmit && loginSubmitState !== "submitting"
                      ? "bg-[#df1620] shadow-[0_18px_40px_rgba(223,22,32,0.22)] hover:bg-[#f02029]"
                      : "bg-[#d8dde6]"
                  }`}
                >
                  {loginSubmitState === "submitting" ? "Submitting..." : "Log in"}
                  <span className=" ml-3" aria-hidden="true">
                    <FaArrowRightLong />
                  </span>
                </button>
              </form>
            ) : (
              <form
                className="mt-10 space-y-6 rounded-[24px] border border-transparent bg-transparent px-10 py-10 shadow-none"
                onSubmit={handleSignupSubmit}
                noValidate
              >
                <FormStatusMessage
                  type={
                    signupSubmitState === "success"
                      ? "success"
                      : signupSubmitState === "error"
                        ? "error"
                        : "idle"
                  }
                  message={signupSubmitMessage}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b5563]">
                      First name
                    </label>
                    <input
                      type="text"
                      value={signupFirstName}
                      onChange={(event) => setSignupFirstName(event.target.value)}
                      onBlur={() => markSignupTouched("firstName")}
                      placeholder="Enter your first name"
                      className={getInputClass(
                        Boolean(signupTouched.firstName && signupErrors.firstName),
                      )}
                    />
                    <FieldError
                      message={signupTouched.firstName ? signupErrors.firstName : ""}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4b5563]">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={signupLastName}
                      onChange={(event) => setSignupLastName(event.target.value)}
                      onBlur={() => markSignupTouched("lastName")}
                      placeholder="Enter your last name"
                      className={getInputClass(
                        Boolean(signupTouched.lastName && signupErrors.lastName),
                      )}
                    />
                    <FieldError
                      message={signupTouched.lastName ? signupErrors.lastName : ""}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#4b5563]">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(event) => setSignupEmail(event.target.value)}
                    onBlur={() => markSignupTouched("email")}
                    className={getInputClass(
                      Boolean(signupTouched.email && signupErrors.email),
                    )}
                  />
                  <FieldError message={signupTouched.email ? signupErrors.email : ""} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#4b5563]">
                    Phone
                  </label>
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(event) => setSignupPhone(event.target.value)}
                      onBlur={() => markSignupTouched("phone")}
                      placeholder="Enter your phone number"
                      className={getInputClass(
                        Boolean(signupTouched.phone && signupErrors.phone),
                      )}
                    />
                  <FieldError message={signupTouched.phone ? signupErrors.phone : ""} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#4b5563]">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signupPassword}
                      onChange={(event) => setSignupPassword(event.target.value)}
                      onBlur={() => markSignupTouched("password")}
                      className={`${getInputClass(
                        Boolean(signupTouched.password && signupErrors.password),
                      )} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#6b7280]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  <FieldError
                    message={signupTouched.password ? signupErrors.password : ""}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#4b5563]">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={signupConfirmPassword}
                      onChange={(event) =>
                        setSignupConfirmPassword(event.target.value)
                      }
                      onBlur={() => markSignupTouched("confirmPassword")}
                      className={`${getInputClass(
                        Boolean(
                          signupTouched.confirmPassword &&
                            signupErrors.confirmPassword,
                        ),
                      )} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#6b7280]"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      <EyeIcon open={showConfirmPassword} />
                    </button>
                  </div>
                  <FieldError
                    message={
                      signupTouched.confirmPassword
                        ? signupErrors.confirmPassword
                        : ""
                    }
                  />
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-3">
                  <PasswordRule
                    label="Uppercase letters"
                    satisfied={passwordChecks.uppercase}
                  />
                  <PasswordRule
                    label="Numbers"
                    satisfied={passwordChecks.number}
                  />
                  <PasswordRule
                    label="Special characters (!@#$%^&*)"
                    satisfied={passwordChecks.special}
                  />
                  <PasswordRule
                    label="8 Characters"
                    satisfied={passwordChecks.length}
                  />
                  <PasswordRule
                    label="Passwords match"
                    satisfied={passwordChecks.match}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#4b5563]">
                    How did you hear about Arch City Tutors?
                  </label>
                  <select
                    value={heardFrom}
                    onChange={(event) => setHeardFrom(event.target.value)}
                    onBlur={() => markSignupTouched("heardFrom")}
                    className={getInputClass(
                      Boolean(signupTouched.heardFrom && signupErrors.heardFrom),
                    )}
                  >
                    <option value="">Select</option>
                    <option value="google">Google</option>
                    <option value="friend">Friend or family</option>
                    <option value="school">School</option>
                    <option value="social">Social media</option>
                    <option value="other">Other</option>
                  </select>
                  <FieldError
                    message={signupTouched.heardFrom ? signupErrors.heardFrom : ""}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#4b5563]">
                    Read the full agreement carefully
                  </label>

                  <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                    <div
                      className="max-h-[22rem] overflow-y-auto px-4 py-4 text-sm leading-7 text-[#6b7280]"
                      onScroll={(event) => {
                        const target = event.currentTarget;
                        const reachedEnd =
                          target.scrollTop + target.clientHeight >=
                          target.scrollHeight - 10;
                        if (reachedEnd) {
                          setAgreementScrolledToEnd(true);
                        }
                      }}
                    >
                      {memberAgreement.split("\n\n").map((paragraph) => (
                        <p key={paragraph} className="mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-[#e5e7eb] px-4 py-4">
                      <button
                        type="button"
                        disabled={!agreementScrolledToEnd}
                        onClick={() => {
                          setAcceptedAgreement(true);
                          markSignupTouched("agreement");
                        }}
                        className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition ${
                          agreementScrolledToEnd
                            ? "bg-[#df1620] text-white hover:bg-[#f02029]"
                            : "bg-[#e5e7eb] text-[#9ca3af]"
                        }`}
                      >
                        I accept the terms
                      </button>

                      <div className="text-right text-xs font-medium text-[#9ca3af]">
                        {acceptedAgreement
                          ? "Agreement accepted"
                          : agreementScrolledToEnd
                            ? "You can now accept the terms"
                            : "Please read and scroll to the bottom to accept"}
                      </div>
                    </div>
                  </div>
                  <FieldError
                    message={signupTouched.agreement ? signupErrors.agreement : ""}
                  />
                </div>

                <div className="space-y-4 text-sm leading-7 text-[#4b5563]">
                  <p>
                    Do you agree to receive text messages from STL Tutoring
                    Solutions, LLC d/b/a Arch City Tutors sent from (314)
                    252-0967. Message frequency varies and may include
                    appointment reminders, service or order information,
                    promotional messages, etc. Message and data rates may apply.
                    Reply STOP at any time to end or unsubscribe. For
                    assistance, reply HELP or contact support at (314)
                    252-0967.
                  </p>

                  <label className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="smsConsent"
                      checked={smsConsent === "yes"}
                      onChange={() => {
                        setSmsConsent("yes");
                        markSignupTouched("smsConsent");
                      }}
                      className="mt-1 h-4 w-4 border-[#d1d5db]"
                    />
                    <span>
                      Yes, I agree to receive text messages from STL Tutoring
                      Solutions, LLC d/b/a Arch City Tutors sent from (314)
                      252-0967.
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="smsConsent"
                      checked={smsConsent === "no"}
                      onChange={() => {
                        setSmsConsent("no");
                        markSignupTouched("smsConsent");
                      }}
                      className="mt-1 h-4 w-4 border-[#d1d5db]"
                    />
                    <span>
                      No, I do not want to receive text messages from STL
                      Tutoring Solutions, LLC d/b/a Arch City Tutors.
                    </span>
                  </label>

                  <p>
                    See our{" "}
                    <Link href="/privacy-policy" className="text-[#ef242a]">
                      Privacy Policy
                    </Link>{" "}
                    for details on how we handle your information.
                  </p>
                  <FieldError
                    message={signupTouched.smsConsent ? signupErrors.smsConsent : ""}
                  />
                </div>

                <label className="flex items-start gap-3 text-sm font-medium text-[#4b5563]">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => {
                      setAcceptedTerms(event.target.checked);
                      markSignupTouched("terms");
                    }}
                    className="mt-1 h-4 w-4 rounded border-[#d1d5db]"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms-of-service" className="text-[#ef242a]">
                      Terms of Service
                    </Link>
                  </span>
                </label>
                <FieldError
                  message={signupTouched.terms ? signupErrors.terms : ""}
                />

                <button
                  type="submit"
                  disabled={
                    !signupCanContinue || signupSubmitState === "submitting"
                  }
                  className={`inline-flex h-14 w-full items-center justify-center rounded-xl text-lg font-bold transition ${
                    signupCanContinue && signupSubmitState !== "submitting"
                      ? "bg-[#df1620] text-white shadow-[0_18px_40px_rgba(223,22,32,0.22)] hover:bg-[#f02029]"
                      : "bg-[#d8dde6] text-white"
                  }`}
                >
                  {signupSubmitState === "submitting"
                    ? "Submitting..."
                    : "Continue"}
                  <span className="ml-3" aria-hidden="true">
                    {"->"}
                  </span>
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-base text-[#4b5563]">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link
                href={isLogin ? SIGNUP_ROUTE : "/login"}
                className="font-semibold text-[#ef242a]"
              >
                {isLogin ? "Create an account" : "Log in"}
              </Link>
            </p>
          </div>
        </section>

        <AuthVisualPanel />
      </div>
    </main>
  );
}
