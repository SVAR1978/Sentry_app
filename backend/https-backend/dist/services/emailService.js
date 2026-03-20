import axios from "axios";
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
class EmailService {
    async sendEmail(toEmail, subject, htmlContent) {
        try {
            const res = await axios.post(BREVO_API_URL, {
                sender: { email: process.env.FROM_EMAIL, name: process.env.FROM_NAME ?? "App" },
                to: [{ email: toEmail }],
                subject,
                htmlContent,
            }, {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            });
            console.log("Email sent:", res.data);
        }
        catch (err) {
            console.error("Failed to send email:", err.response?.data || err.message);
            throw err;
        }
    }
}
export const emailService = new EmailService();
//# sourceMappingURL=emailService.js.map