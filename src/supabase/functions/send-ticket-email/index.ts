import { serve } from "https://deno.land/x/sift@0.5.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@0.1.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { email, ticketDetails } = await req.json();

    if (!email || !ticketDetails) {
      return new Response("Missing email or ticket details", { status: 400 });
    }

    const emailResponse = await resend.emails.send({
      from: "no-reply@yourdomain.com",
      to: email,
      subject: "Your Event Ticket",
      html: `
        <h1>Thank you for your purchase!</h1>
        <p>Here are your ticket details:</p>
        <pre>${JSON.stringify(ticketDetails, null, 2)}</pre>
      `,
    });

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});import { serve } from "https://deno.land/x/sift@0.5.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://deno.land/x/resend@0.1.0/mod.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { email, ticketDetails } = await req.json();

    if (!email || !ticketDetails) {
      return new Response("Missing email or ticket details", { status: 400 });
    }

    const emailResponse = await resend.emails.send({
      from: "no-reply@yourdomain.com",
      to: email,
      subject: "Your Event Ticket",
      html: `
        <h1>Thank you for your purchase!</h1>
        <p>Here are your ticket details:</p>
        <pre>${JSON.stringify(ticketDetails, null, 2)}</pre>
      `,
    });

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});