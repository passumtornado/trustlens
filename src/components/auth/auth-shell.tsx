import type { ReactNode } from "react";

import { FileText, Search, ShieldCheck, Users } from "lucide-react";

import { Link } from "@tanstack/react-router";

import backgroundImage from "../../assets/login_bg.png";
import logo from "../../assets/logo/trustlens-medium-240x60.svg";
import mobileLogo from "../../assets/logo/trustlens-navbar-light-320x80.svg";

type AuthShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: "/login" | "/register";
};

const trustSignals = [
  { label: "Detect suspicious websites", icon: Search },
  { label: "Identify potential impersonations", icon: ShieldCheck },
  { label: "Get clear, AI-powered explanations", icon: FileText },
  { label: "Stay safer online", icon: Users },
];

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthShellProps) {
  return (
    <main className="h-dvh overflow-x-hidden bg-[#eef3fb] p-1 text-[#0a2a5e] sm:min-h-dvh sm:h-auto sm:p-3 lg:h-dvh lg:overflow-hidden">
      <div className="mx-auto grid h-full max-w-384 overflow-hidden rounded-xl border border-white/80 bg-[#f6f9fe] shadow-[0_8px_30px_rgba(10,42,94,0.08)] sm:min-h-[calc(100dvh-1.5rem)] sm:h-auto lg:h-full lg:min-h-0 lg:grid-cols-[42%_58%]">
        <section
          className="relative hidden overflow-hidden bg-[#06234b] bg-cover bg-center px-10 py-10 text-white lg:flex lg:flex-col xl:px-14"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-[#031c3d]/20" />
          <Link
            to="/"
            className="relative z-10 w-fit"
            aria-label="TrustLens home"
          >
            <img src={logo} alt="TrustLens" className="h-auto w-52" />
          </Link>
          <div className="relative z-10 mt-16 max-w-xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#55b9ff]/60 bg-[#062d60]/50 px-4 py-2 text-xs font-medium tracking-wide text-[#d8f0ff]">
              <ShieldCheck size={15} className="text-[#55b9ff]" />
              SAFER INTERNET, BRIGHTER TOMORROW
            </div>
            <h2 className="max-w-lg text-5xl font-bold leading-[1.03] tracking-tight xl:text-6xl">
              A safer internet
              <br />
              for <span className="text-[#31a8ff]">everyone.</span>
            </h2>
            <p className="mt-6 max-w-md text-xl leading-8 text-white/90">
              Verify websites, detect scams and protect what matters most.
            </p>
            <ul className="mt-10 space-y-6 text-base text-white/90">
              {trustSignals.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center gap-5">
                  <Icon
                    size={29}
                    strokeWidth={1.8}
                    className="text-[#38a9ff]"
                  />
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative z-10 mt-auto flex items-center gap-3 rounded-lg border border-[#cfe3ff] bg-[#f1f7ff] px-4 py-3 text-[#174798] shadow-lg sm:px-5 sm:py-4">
            <ShieldCheck size={31} className="shrink-0 text-[#0b63f6]" />
            <div>
              <p className="text-sm font-bold">Your security matters</p>
              <p className="mt-1 text-xs text-[#6e83ac]">
                We never store the content of websites you scan.
              </p>
            </div>
          </div>
        </section>

        <section className="flex h-full min-h-0 flex-col px-2 py-2 sm:min-h-[calc(100dvh-1.5rem)] sm:h-auto sm:px-6 sm:py-5 md:px-10 lg:min-h-0 lg:overflow-hidden lg:px-11 xl:px-16">
          <div className="flex items-center justify-between">
            <Link to="/" className="lg:hidden" aria-label="TrustLens home">
              <img src={mobileLogo} alt="TrustLens" className="w-40" />
            </Link>
          </div>

          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-start py-2 sm:justify-center sm:py-8 lg:min-h-0">
            <div className="rounded-xl bg-white px-3 py-3 shadow-[0_3px_22px_rgba(10,42,94,0.04)] sm:px-10 sm:py-8 xl:px-24">
              <div className="mb-4 flex justify-end text-xs text-[#273d68] sm:mb-6 sm:text-sm">
                <span>
                  {footerText}{" "}
                  <Link
                    to={footerLinkTo}
                    className="ml-2 font-semibold text-[#0b63f6] hover:underline"
                  >
                    {footerLinkText}
                  </Link>
                </span>
              </div>
              <div className="mb-3 sm:mb-6">
                <span className="sr-only">{eyebrow}</span>
                <h1 className="text-3xl font-bold tracking-tight text-[#071331] sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-1 text-sm text-[#41547d] sm:mt-3 sm:text-xl">
                  {description}
                </p>
              </div>
              {children}
            </div>
          </div>
          <div className="flex items-center justify-between pt-5 text-[10px] text-[#63759d] sm:pt-6 sm:text-xs">
            <span className="max-sm:hidden">
              © 2024 TrustLens. All rights reserved.
            </span>
            <span className="hidden gap-7 sm:flex">
              <a href="#privacy" className="hover:text-[#0b63f6]">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-[#0b63f6]">
                Terms of Service
              </a>
              <a href="#help" className="hover:text-[#0b63f6]">
                Help
              </a>
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
