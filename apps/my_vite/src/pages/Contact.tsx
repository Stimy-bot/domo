import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  subscribe: z.boolean().optional(),
});

type ContactValues = z.infer<typeof ContactSchema>;

function Contact() {
  const [status, setStatus] = useState<null | "idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      subscribe: false,
    },
    onSubmit: async (values) => {
      setStatus("submitting");
      setErrorMessage(null);

      // Server-side validation with Zod before sending
      const parsed = ContactSchema.safeParse(values);
      if (!parsed.success) {
        // Map Zod errors to field errors
        const fieldErrors = parsed.error.flatten().fieldErrors;
        Object.entries(fieldErrors).forEach(([key, msgs]) => {
          if (msgs && msgs.length) {
            form.setFieldMeta(key as keyof ContactValues, (meta) => ({
              ...meta,
              errorMap: { ...meta.errorMap, onSubmit: msgs[0] },
            }));
          }
        });
        setStatus("error");
        setErrorMessage("Please fix the highlighted fields.");
        return;
      }

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload?.message || `Request failed with status ${res.status}`);
        }

        setStatus("success");
        form.reset();
      } catch (err: unknown) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      } finally {
        setTimeout(() => setStatus("idle"), 2000);
      }
    },
  });

  const getError = (field: keyof ContactValues) => form.getFieldMeta(field)?.errorMap?.onSubmit;

  return (
    <form
      onSubmit={form.handleSubmit}
      className="max-w-xl mx-auto bg-white shadow-md pt-30 rounded-md p-6 space-y-5"
      noValidate
      aria-live="polite"
    >
      <h2 className="text-2xl font-semibold">Contact Us</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          value={form.state.values.name}
          onChange={(e) => form.setFieldValue("name", e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            getError("name") ? "border-red-500" : "border-gray-300"
          }`}
          aria-invalid={!!getError("name")}
          aria-describedby={getError("name") ? "name-error" : undefined}
        />
        {getError("name") && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {getError("name")}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={form.state.values.email}
          onChange={(e) => form.setFieldValue("email", e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            getError("email") ? "border-red-500" : "border-gray-300"
          }`}
          aria-invalid={!!getError("email")}
          aria-describedby={getError("email") ? "email-error" : undefined}
        />
        {getError("email") && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {getError("email")}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <input
          value={form.state.values.subject}
          onChange={(e) => form.setFieldValue("subject", e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            getError("subject") ? "border-red-500" : "border-gray-300"
          }`}
          aria-invalid={!!getError("subject")}
          aria-describedby={getError("subject") ? "subject-error" : undefined}
        />
        {getError("subject") && (
          <p id="subject-error" className="mt-1 text-sm text-red-600">
            {getError("subject")}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          rows={6}
          value={form.state.values.message}
          onChange={(e) => form.setFieldValue("message", e.target.value)}
          className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            getError("message") ? "border-red-500" : "border-gray-300"
          }`}
          aria-invalid={!!getError("message")}
          aria-describedby={getError("message") ? "message-error" : undefined}
        />
        {getError("message") && (
          <p id="message-error" className="mt-1 text-sm text-red-600">
            {getError("message")}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="subscribe"
          type="checkbox"
          checked={form.state.values.subscribe}
          onChange={(e) => form.setFieldValue("subscribe", e.target.checked)}
          className="h-4 w-4 text-indigo-600"
        />
        <label htmlFor="subscribe" className="text-sm text-gray-700">
          Subscribe to updates
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {status === "submitting" ? "Sending..." : "Send message"}
        </button>

        {status === "success" && <p className="text-sm text-green-600">Thanks — your message was sent.</p>}
        {status === "error" && <p className="text-sm text-red-600">Error: {errorMessage}</p>}
      </div>
    </form>
  );
}

export { Contact };