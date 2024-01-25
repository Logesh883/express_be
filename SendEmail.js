require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.G_CLIENTID,
  process.env.G_SECRET_ID,
  process.env.REDIRECT
);
oauth2Client.setCredentials({ refresh_token: process.env.G_REFRESH_TOKEN });

async function Send(req, res) {
  try {
    const accessToken = await oauth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.gmail,
        clientId: process.env.G_CLIENTID,
        clientSecret: process.env.G_SECRET_ID,
        refreshToken: process.env.G_REFRESH_TOKEN,
        accessToken: accessToken,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let randomNumber = GenerateRandom();

    let maileroptions = {
      from: `Ideavista`,
      to: "tlogeshwaran2003@gmail.com",
      subject: "Ideavista - Password Change OTP",
      text: "",
      html: `<p>You have requested to change your password. Please use the following OTP to proceed:</p>
      <div style="padding: 15px; background-color: #f0f0f0; font-size: 24px; text-align: center;">
        <strong>${randomNumber}</strong>
      </div>
      <p>This OTP is valid for a short period. Do not share it with anyone for security reasons.</p>
      <p>If you did not request this change, please ignore this email.</p>
      <p>Best regards,<br>Ideavista Team</p>`,
    };

    await transport.sendMail(maileroptions);
    res.json({ msg: "Email Sent" });
  } catch (error) {
    res, json(error);
  }
}

function GenerateRandom() {
  let num = Math.floor(Math.random() * 10000 + 1);
  if (num >= 1000 && num <= 9999) {
    return num;
  } else {
    GenerateRandom();
  }
}

module.exports = Send;
