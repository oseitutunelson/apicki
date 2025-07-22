import twilio from "twilio";

const accountSid = import.meta.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendSmsNotification(to, message) {
  try {
    const messageInstance = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log("SMS sent: ", messageInstance.sid);
  } catch (error) {
    console.error("Failed to send SMS: ", error);
  }
}
