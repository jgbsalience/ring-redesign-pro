import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

export const AppraisalSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email(),
  propertyAddress: z.string().optional(),
  suburb: z.string().optional(),
  propertyType: z.string().min(1),
  interests: z.array(z.string()).min(0),
  comments: z.string().optional(),
  // honeypot — must be empty
  website: z.string().optional().default(""),
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/appraisal")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }

        const result = AppraisalSchema.safeParse(body);
        if (!result.success) {
          return json({ error: "Validation failed", issues: result.error.issues }, 422);
        }

        const {
          name,
          phone,
          email,
          propertyAddress,
          suburb,
          propertyType,
          interests,
          comments,
          website,
        } = result.data;

        // Reject honeypot fills silently
        if (website.trim()) return json({ ok: true });

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!supabaseUrl || !supabaseKey) {
          return json({ error: "Server misconfiguration" }, 500);
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error } = await supabase.from("appraisal_submissions").insert({
          name,
          phone,
          email,
          property_address: propertyAddress ?? null,
          suburb: suburb ?? null,
          property_type: propertyType,
          interests,
          comments: comments ?? null,
        });

        if (error) {
          console.error("[appraisal] supabase insert error", error);
          return json({ error: "Failed to save submission" }, 500);
        }

        return json({ ok: true });
      },
    },
  },
});
