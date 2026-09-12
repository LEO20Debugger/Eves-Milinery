"use client";

import { useActionState, useId } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { submitEnquiry, type EnquiryState } from "@/app/actions";
import { categories, pieces } from "@/content/pieces";
import { EXPO_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const initialState: EnquiryState = { status: "idle" };

/** Shared field chrome: a bottom rule that lights up on focus. */
function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <label htmlFor={name} className="eyebrow block text-bone-faint">
        {label}
      </label>
      {children}
      <span className="relative block h-px w-full bg-bone/15">
        <span className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:scale-x-100" />
      </span>
      {error && (
        <p id={`${name}-error`} className="mt-2 text-xs text-gold-soft">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full bg-transparent pt-3 pb-2 text-bone placeholder:text-bone-faint/60 focus:outline-none";

export default function EnquiryForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  const params = useSearchParams();
  const formId = useId();

  // Arriving from a piece page or the gele CTA prefills the interest field.
  const presetInterest = params.get("piece") ?? "";

  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EXPO_OUT }}
        className="border-t rule pt-10"
        role="status"
      >
        <p className="eyebrow text-gold">Enquiry received</p>
        <p className="mt-6 max-w-md font-display text-4xl font-light text-bone">{state.message}</p>
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="space-y-10" id={formId} noValidate>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <Field label="Your name" name="name" error={state.errors?.name}>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby={state.errors?.name ? "name-error" : undefined}
            className={inputClass}
          />
        </Field>

        <Field label="Email" name="email" error={state.errors?.email}>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={state.errors?.email ? "email-error" : undefined}
            className={inputClass}
          />
        </Field>

        <Field label="Phone (optional)" name="phone" error={state.errors?.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </Field>

        <Field label="Interested in" name="interest" error={state.errors?.interest}>
          <select
            id="interest"
            name="interest"
            defaultValue={presetInterest}
            className={cn(inputClass, "appearance-none")}
          >
            <option value="" className="bg-ink">
              Not sure yet
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id} className="bg-ink">
                {category.label}
              </option>
            ))}
            <optgroup label="A specific piece">
              {pieces.map((piece) => (
                <option key={piece.slug} value={piece.slug} className="bg-ink">
                  {piece.name}
                </option>
              ))}
            </optgroup>
          </select>
        </Field>

        <Field label="Occasion" name="eventType" error={state.errors?.eventType}>
          <input
            id="eventType"
            name="eventType"
            type="text"
            placeholder="Wedding, race day, ceremony…"
            className={inputClass}
          />
        </Field>

        <Field label="Date of the event" name="eventDate" error={state.errors?.eventDate}>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            className={cn(inputClass, "[color-scheme:dark]")}
          />
        </Field>
      </div>

      <Field label="About the occasion" name="message" error={state.errors?.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
          placeholder="The outfit, the colours, the light, anything you have already pictured."
          className={cn(inputClass, "resize-none")}
        />
      </Field>

      {/* Honeypot. Hidden from sight and from assistive technology; only bots
          fill it in, and anything submitted in it is silently discarded. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-8 border-t rule pt-8">
        <button
          type="submit"
          disabled={pending}
          className="group relative overflow-hidden border border-bone/30 px-10 py-4 transition-colors duration-500 hover:border-gold disabled:opacity-50"
        >
          <span className="eyebrow relative z-10 text-bone transition-colors duration-500 group-hover:text-ink">
            {pending ? "Sending" : "Send enquiry"}
          </span>
          {/* Fill wipes up from the foot of the button on hover. */}
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
        </button>

        <AnimatePresence>
          {state.status === "error" && state.message && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gold-soft"
            >
              {state.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
