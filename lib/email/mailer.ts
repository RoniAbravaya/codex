export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(payload: EmailPayload) {
  if (process.env.NODE_ENV !== "production") {
    console.log("[DEV MAILER]", payload);
    return;
  }
  console.log("TODO: plug provider", payload.to);
}
