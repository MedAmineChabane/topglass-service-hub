import { Resend } from "https://esm.sh/resend@4.0.0";

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
    console.log("Received lead notification request:", data);

    const {
      leadId,
      name,
      email,
      phone,
      vehicleBrand,
      vehicleModel,
      vehicleType,
      registrationPlate,
      location,
      serviceType,
      description,
    } = data;

    // Validate required fields
    if (!leadId || !name || !email || !phone) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
      from: "TopGlass France <onboarding@resend.dev>",
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
