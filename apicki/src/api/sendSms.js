import { sendSmsNotification } from "../functions/sendSmsNotification";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { to, message } = req.body;

  if (!to || !message) {
    res.status(400).json({ error: "Missing 'to' or 'message' in request body" });
    return;
  }

  try {
    await sendSmsNotification(to, message);
    res.status(200).json({ message: "SMS sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send SMS" });
  }
}
