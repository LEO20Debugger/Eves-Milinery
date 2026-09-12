"use server";

import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/content/site";
import { pieces } from "@/content/pieces";

const slugs = pieces.map((p) => p.slug);

const schema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(120),
  email: z.email("Please enter a valid email address.").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  interest: z.string().trim().max(120).optional().or(z.literal("")),
  eventType: z.string().trim().max(120).optional().or(z.literal("")),
  eventDate: z.string().trim().max(40).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "A sentence or two about the occasion helps us reply usefully.")
    .max(4000),
  // Honeypot. Real people never see this field, so anything in it is a bot.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field-level messages, keyed by input name. */
  errors?: Record<string, string>;
};

export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      errors[key] ??= issue.message;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors,
    };
  }

  const data = parsed.data;

  // Honeypot tripped — report success so the bot does not learn anything, and
  // send nothing.
  if (data.company) {
    return { status: "success", message: "Thank you — we will be in touch." };
  }

  const interestLabel = slugs.includes(data.interest ?? "")
    ? `${data.interest} (piece)`
    : data.interest || "Not specified";

  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not given"}`,
    `Interested in: ${interestLabel}`,
    `Occasion: ${data.eventType || "Not specified"}`,
    `Date: ${data.eventDate || "Not given"}`,
    "",
    data.message,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;

  // No key configured (local development, or before the account exists): log
  // and succeed, so the whole form is testable end to end without secrets.
  if (!apiKey) {
    console.info("[enquiry] RESEND_API_KEY not set — enquiry not emailed:\n" + lines);
    return {
      status: "success",
      message: "Thank you — we will reply within two working days.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.ENQUIRY_FROM ?? "enquiries@evesmillinery.com",
      to: process.env.ENQUIRY_TO ?? site.contact.email,
      replyTo: data.email,
      subject: `Commission enquiry — ${data.name}`,
      text: lines,
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[enquiry] failed to send", error);
    return {
      status: "error",
      message: `Something went wrong sending your enquiry. Please email us directly at ${site.contact.email}.`,
    };
  }

  return {
    status: "success",
    message: "Thank you — we will reply within two working days.",
  };
}
