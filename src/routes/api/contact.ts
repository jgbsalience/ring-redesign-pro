import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

export const ContactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  enquiryType: z.string().min(1),
  message: z.string().min(1),
  // honeypot — must be empty
  website: z.string().optional().default(""),
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }

        const result = ContactSchema.safeParse(body);
        if (!result.success) {
          return json({ error: "Validation failed", issues: result.error.issues }, 422);
        }

        const { firstName, lastName, email, phone, enquiryType, message, website } = result.data;

        // Reject honeypot fills silently
        if (website.trim()) return json({ ok: true });

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!supabaseUrl || !supabaseKey) {
          return json({ error: "Server misconfiguration" }, 500);
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error } = await supabase.from("contact_submissions").insert({
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone ?? null,
          enquiry_type: enquiryType,
          message,
        });

        if (error) {
          console.error("[contact] supabase insert error", error);
          return json({ error: "Failed to save submission" }, 500);
        }

        return json({ ok: true });
      },
    },
  },
});
