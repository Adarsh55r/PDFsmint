"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";

import { Button } from "@/components/ui/Button";

const inputClasses =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Front-end only for now — no backend is wired up yet.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="rounded-xl border border-primary-200 bg-primary-50/60 p-6"
        role="status"
        aria-live="polite"
      >
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-700 shadow-soft">
          <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <h2 className="mb-1 text-lg font-semibold text-neutral-900">
          Thanks for reaching out
        </h2>
        <p className="text-sm text-neutral-600">
          This is a demo form and isn&rsquo;t connected to email yet, so your
          message wasn&rsquo;t sent. In the meantime, please contact us directly
          at the email address listed on this page.
        </p>
        <Button
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => setSubmitted(false)}
        >
          Write another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block text-sm font-medium text-neutral-700"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-sm font-medium text-neutral-700"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          className={inputClasses}
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          className={`${inputClasses} resize-y`}
        />
      </div>

      <Button type="submit" size="lg" className="gap-2">
        <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        Send message
      </Button>
    </form>
  );
}
