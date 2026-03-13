import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"GovResolve System" <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.message,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${options.email}`);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};