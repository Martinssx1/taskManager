const nodemailer = require("nodemailer");
require("dotenv").config();
const jwttoken = require("jsonwebtoken");
const pool = require("../db");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmailVerificationLink(email, verificationLink) {
  try {
    await transporter.sendMail({
      from: `"Task App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your Task App account",

      text: `
Thanks for creating your Task App account!

Please verify your email address by clicking the link below:

${verificationLink}

This verification link will expire in 15 minutes.

If you didn't create a Task App account, you can safely ignore this email.

— The Task App Team
  `,

      html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your Task App account</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f4f5;
        font-family: Arial, Helvetica, sans-serif;
        color: #18181b;
      ">

        <div style="
          width: 100%;
          padding: 50px 20px;
          box-sizing: border-box;
        ">

          <div style="
            max-width: 520px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          ">

            <!-- Header -->
            <div style="
              padding: 28px 32px;
              background-color: #18181b;
              text-align: center;
            ">
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 24px;
                font-weight: 700;
              ">
                Task App
              </h1>
            </div>

            <!-- Content -->
            <div style="
              padding: 40px 32px;
            ">

              <h2 style="
                margin: 0 0 16px;
                font-size: 24px;
                line-height: 1.3;
              ">
                Verify your email
              </h2>

              <p style="
                margin: 0 0 20px;
                font-size: 16px;
                line-height: 1.6;
                color: #52525b;
              ">
                Thanks for creating your Task App account!
              </p>

              <p style="
                margin: 0 0 28px;
                font-size: 16px;
                line-height: 1.6;
                color: #52525b;
              ">
                Please verify your email address to finish setting up
                your account.
              </p>

              <!-- Button -->
              <div style="
                text-align: center;
                margin: 30px 0;
              ">
                <a
                  href="${verificationLink}"
                  style="
                    display: inline-block;
                    padding: 14px 28px;
                    background-color: #18181b;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                  "
                >
                  Verify my email
                </a>
              </div>

              <p style="
                margin: 0 0 12px;
                font-size: 14px;
                line-height: 1.6;
                color: #71717a;
              ">
                This verification link will expire in
                <strong>10 minutes</strong>.
              </p>

              <p style="
                margin: 24px 0 0;
                padding-top: 24px;
                border-top: 1px solid #e4e4e7;
                font-size: 13px;
                line-height: 1.6;
                color: #a1a1aa;
              ">
                If you didn't create a Task App account, you can safely
                ignore this email.
              </p>

            </div>

            <!-- Footer -->
            <div style="
              padding: 22px 32px;
              background-color: #fafafa;
              text-align: center;
              border-top: 1px solid #e4e4e7;
            ">
              <p style="
                margin: 0;
                font-size: 12px;
                color: #a1a1aa;
              ">
                © ${new Date().getFullYear()} Task App. All rights reserved.
              </p>
            </div>

          </div>

        </div>

      </body>
    </html>
  `,
    });
  } catch (err) {
    console.error("Error sending email verification link: ", err);
    throw err;
  }
}
async function emailPullVerify(req, res) {
  const token = req.params.token;

  if (!token) return;
  try {
    const decoded = jwttoken.verify(token, process.env.JWT_SECRET_KEY_EMAIL);
   
    ///some touching?
    const [result] = await pool.query(
      ` UPDATE taskappusers 
        SET email_verified = ? WHERE ID = ? `,
      [true, decoded.userId],
    );
    if (result.affectedRows === 1) {
      return res.json({
        message: "Email verified successfully",
        updated: result,
      });
    }
    //edit
    return res.json({
      message: "Email verification failed",
    });
  } catch (err) {
    throw Error("error verifying code expired or invalid", err);
  }
}
module.exports = { sendEmailVerificationLink, emailPullVerify };
