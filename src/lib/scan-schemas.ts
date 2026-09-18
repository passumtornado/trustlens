import { z } from "zod";

export const websiteUrlSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed && !/^https?:\/\//i.test(trimmed)
      ? `https://${trimmed}`
      : trimmed;
  },
  z
    .string()
    .trim()
    .min(1, "Enter a website URL.")
    .url("Enter a valid website URL.")
    .refine(
      (value) => /^https?:\/\//i.test(value),
      "Use an http:// or https:// website URL.",
    )
    .refine((value) => {
      const hostname = new URL(value).hostname;
      return hostname === "localhost" || hostname.includes(".");
    }, "Enter a complete website domain."),
);

export type WebsiteUrlInput = z.infer<typeof websiteUrlSchema>;
