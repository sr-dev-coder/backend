import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

const sendMail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html
    })
}

const sendVerificationEmail = async (email, rawToken) => {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`

    await sendMail({
        to: email,
        subject: "Verify your email",
        html: `<p>Welcome! Please verify your email by clicking the link below:</p>
               <p><a href="${verifyUrl}">${verifyUrl}</a></p>
               <p>This link will expire soon.</p>`
    })
}

const sendResetPasswordEmail = async (email, rawToken) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`

    await sendMail({
        to: email,
        subject: "Reset your password",
        html: `<p>You requested a password reset. Click the link below to set a new password:</p>
               <p><a href="${resetUrl}">${resetUrl}</a></p>
               <p>This link will expire in 15 minutes. If you did not request this, ignore this email.</p>`
    })
}

export { sendVerificationEmail, sendResetPasswordEmail }
