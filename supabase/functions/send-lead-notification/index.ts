import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LeadNotificationRequest {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleType: string;
  registrationPlate: string;
  location: string;
  serviceType: string;
  description?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const data: LeadNotificationRequest = await req.json();
    const { leadId } = data;
    console.log("Received lead notification request for lead:", leadId);

    if (!leadId || typeof leadId !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing leadId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the lead actually exists and was created very recently.
    // This blocks attackers from invoking this endpoint directly with arbitrary content.
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select(
        "id, name, email, phone, vehicle_brand, vehicle_type, registration_plate, location, glass_type, notes, created_at"
      )
      .eq("id", leadId)
      .maybeSingle();

    if (leadError || !lead) {
      console.warn("Lead not found or lookup failed for id:", leadId);
      return new Response(
        JSON.stringify({ error: "Not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ageMs = Date.now() - new Date(lead.created_at).getTime();
    if (ageMs > 5 * 60 * 1000) {
      console.warn("Lead too old to notify:", leadId, "age(ms):", ageMs);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use trusted DB values (not the request body) to build the email.
    const name = lead.name;
    const email = lead.email;
    const phone = lead.phone;
    const vehicleBrand = lead.vehicle_brand;
    const vehicleModel = data.vehicleModel ?? "";
    const vehicleType = lead.vehicle_type;
    const registrationPlate = lead.registration_plate ?? "";
    const location = lead.location;
    const serviceType = lead.glass_type;
    const description = lead.notes ?? data.description ?? "";

    const serviceLabel = serviceType === "vitrage" ? "Vitrage / Pare-brise" : "Carrosserie";
    const adminUrl = `https://topglassfrancecom.lovable.app/admin`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle demande de devis</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #2a2a2a; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">🚗 Nouvelle demande de devis</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 24px 0; color: #333333; font-size: 20px; border-bottom: 2px solid #0ea5e9; padding-bottom: 8px;">
                Informations du client
              </h2>
              
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="color: #666666; width: 140px; vertical-align: top;"><strong>Nom complet</strong></td>
                  <td style="color: #333333;">${name}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="color: #666666; vertical-align: top;"><strong>Téléphone</strong></td>
                  <td style="color: #333333;"><a href="tel:${phone}" style="color: #0ea5e9; text-decoration: none;">${phone}</a></td>
                </tr>
                <tr>
                  <td style="color: #666666; vertical-align: top;"><strong>Email</strong></td>
                  <td style="color: #333333;"><a href="mailto:${email}" style="color: #0ea5e9; text-decoration: none;">${email}</a></td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="color: #666666; vertical-align: top;"><strong>Localisation</strong></td>
                  <td style="color: #333333;">${location}</td>
                </tr>
              </table>

              <h2 style="margin: 0 0 24px 0; color: #333333; font-size: 20px; border-bottom: 2px solid #0ea5e9; padding-bottom: 8px;">
                Véhicule
              </h2>
              
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="color: #666666; width: 140px; vertical-align: top;"><strong>Marque</strong></td>
                  <td style="color: #333333;">${vehicleBrand}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="color: #666666; vertical-align: top;"><strong>Modèle</strong></td>
                  <td style="color: #333333;">${vehicleModel}</td>
                </tr>
                <tr>
                  <td style="color: #666666; vertical-align: top;"><strong>Type</strong></td>
                  <td style="color: #333333;">${vehicleType}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                  <td style="color: #666666; vertical-align: top;"><strong>Immatriculation</strong></td>
                  <td style="color: #333333; font-family: monospace; font-size: 16px;">${registrationPlate}</td>
                </tr>
              </table>

              <h2 style="margin: 0 0 24px 0; color: #333333; font-size: 20px; border-bottom: 2px solid #0ea5e9; padding-bottom: 8px;">
                Service demandé
              </h2>
              
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="color: #666666; width: 140px; vertical-align: top;"><strong>Type</strong></td>
                  <td style="color: #333333;">
                    <span style="background-color: ${serviceType === 'vitrage' ? '#0ea5e9' : '#f97316'}; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold;">
                      ${serviceLabel}
                    </span>
                  </td>
                </tr>
                ${description ? `
                <tr style="background-color: #f9f9f9;">
                  <td style="color: #666666; vertical-align: top;"><strong>Description</strong></td>
                  <td style="color: #333333;">${description}</td>
                </tr>
                ` : ''}
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="${adminUrl}" style="display: inline-block; background-color: #0ea5e9; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      Voir dans l'admin
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 16px; text-align: center;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                TopGlass France - Cet email a été envoyé automatiquement lors de la soumission d'un formulaire de devis.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const emailText = `
Nouvelle demande de devis - TopGlass France

INFORMATIONS DU CLIENT
----------------------
Nom: ${name}
Téléphone: ${phone}
Email: ${email}
Localisation: ${location}

VÉHICULE
--------
Marque: ${vehicleBrand}
Modèle: ${vehicleModel}
Type: ${vehicleType}
Immatriculation: ${registrationPlate}

SERVICE DEMANDÉ
---------------
Type: ${serviceLabel}
${description ? `Description: ${description}` : ''}

Voir le détail dans l'admin: ${adminUrl}
    `;

    console.log("Sending email to topglassfrance@gmail.com and contact@topglassfrance.com");

    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: "TopGlass France <noreply@topglassfrance.com>",
      to: ["topglassfrance@gmail.com", "contact@topglassfrance.com"],
      subject: `🚗 Nouvelle demande de devis - ${name} - ${serviceLabel}`,
      html: emailHtml,
      text: emailText,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      return new Response(
        JSON.stringify({ error: emailError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, messageId: emailResult?.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-lead-notification:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
