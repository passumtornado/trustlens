import { useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Globe2,
  Link2,
  LoaderCircle,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { websiteUrlSchema } from "../../lib/scan-schemas";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const examples = ["aliexpress.com", "paypal.com", "amazon.com"];

const scanFeatures = [
  {
    title: "Domain information",
    description: "Registration, age, owner",
    icon: Globe2,
    tone: "text-primary bg-primary/10",
  },
  {
    title: "Security checks",
    description: "HTTPS, certificates",
    icon: ShieldCheck,
    tone: "text-violet-600 bg-violet-500/10",
  },
  {
    title: "Threat intelligence",
    description: "Phishing, malware",
    icon: FileSearch,
    tone: "text-violet-600 bg-violet-500/10",
  },
  {
    title: "Website analysis",
    description: "Screenshots, content",
    icon: SearchCheck,
    tone: "text-primary bg-primary/10",
  },
  {
    title: "Brand detection",
    description: "Find impersonations",
    icon: CheckCircle2,
    tone: "text-risk-safe bg-risk-safe/10",
  },
  {
    title: "AI explanation",
    description: "Clear, easy to understand",
    icon: Sparkles,
    tone: "text-violet-600 bg-violet-500/10",
  },
] as const;

type ScanState = "idle" | "loading" | "queued" | "error";

export function NewScanContent() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<ScanState>("idle");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = websiteUrlSchema.safeParse(url);

    if (!result.success) {
      setState("error");
      setError(result.error.issues[0]?.message ?? "Enter a valid website URL.");
      return;
    }

    setError("");
    setState("loading");
    window.setTimeout(() => setState("queued"), 700);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Investigation
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          New Scan
        </h1>
        <p className="mt-2 text-base text-muted-foreground sm:text-lg">
          Enter a website URL to start a security and trust investigation.
        </p>
      </header>

      <section
        className="rounded-xl border border-border bg-card px-4 py-8 shadow-sm sm:px-10 sm:py-10 lg:px-16"
        aria-labelledby="check-website-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Globe2 size={34} strokeWidth={1.8} />
          </div>
          <h2
            id="check-website-heading"
            className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Check a Website
          </h2>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">
            Find out if a website is safe, suspicious or potentially fraudulent.
          </p>

          <form className="mt-8" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
              <div className="relative flex-1">
                <Link2
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={21}
                />
                <Input
                  value={url}
                  onChange={(event) => {
                    setUrl(event.target.value);
                    if (state === "error") setState("idle");
                  }}
                  placeholder="Enter a website URL (e.g. example.com)"
                  className="h-14 rounded-xl pl-12 pr-4 text-base sm:rounded-r-none sm:text-lg"
                  aria-label="Website URL"
                  required
                  aria-invalid={state === "error"}
                  aria-describedby={
                    state === "error" ? "scan-url-error" : undefined
                  }
                  disabled={state === "loading"}
                />
              </div>
              <Button
                type="submit"
                disabled={state === "loading" || !url.trim()}
                className="h-14 rounded-xl bg-primary px-7 text-base text-primary-foreground hover:bg-primary/90 sm:rounded-l-none sm:text-lg"
              >
                {state === "loading" ? (
                  <>
                    <LoaderCircle className="animate-spin" size={19} />{" "}
                    Checking...
                  </>
                ) : (
                  <>
                    Start Scan <ArrowRight size={20} />
                  </>
                )}
              </Button>
            </div>
            {state === "error" && (
              <p
                id="scan-url-error"
                className="mt-2 text-left text-sm font-medium text-risk-danger"
                role="alert"
              >
                {error}
              </p>
            )}
            {state === "queued" && (
              <div
                className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-risk-safe"
                role="status"
              >
                <CheckCircle2 size={17} /> Investigation queued for a safe,
                isolated environment.
              </div>
            )}
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="mr-1">Try an example:</span>
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setUrl(example);
                  setState("idle");
                  setError("");
                }}
                className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-2 font-medium text-primary transition-colors hover:bg-primary/10"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        className="grid gap-x-8 gap-y-7 sm:grid-cols-2 xl:grid-cols-3"
        aria-label="Investigation capabilities"
      >
        {scanFeatures.map(({ title, description, icon: Icon, tone }) => (
          <article key={title} className="flex items-center gap-4">
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-full ${tone}`}
            >
              <Icon size={24} />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </article>
        ))}
      </section>

      <aside className="flex items-start gap-4 rounded-xl border border-primary/15 bg-primary/5 px-5 py-5 sm:items-center sm:px-7">
        <ShieldCheck
          className="mt-0.5 shrink-0 text-primary sm:mt-0"
          size={34}
        />
        <div>
          <h2 className="font-semibold">Your safety comes first</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            We analyse websites in a safe, isolated environment. You don&apos;t
            have to visit the site directly.
          </p>
        </div>
      </aside>
    </div>
  );
}
