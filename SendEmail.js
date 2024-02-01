require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const error_handler = require("./errorHandling");

const oauth2Client = new google.auth.OAuth2(
  process.env.G_CLIENTID,
  process.env.G_SECRET_ID,
  process.env.REDIRECT
);
oauth2Client.setCredentials({ refresh_token: process.env.G_REFRESH_TOKEN });

async function Send(req, res, next) {
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
    if (!req.headers) {
      return next(error_handler(404, "Error in cors"));
    }

    const { isSign, email, isDelete } = req.query;
    if (isSign === "true") {
      subject = "Ideavista - Signin Succesfull";
      text = "Welcome back to Ideavista!";
      html = `<p>Welcome back to Ideavista!</p>
      <div style="padding: 15px; background-color: #4CAF50; color: white; font-size: 24px; text-align: center;">
        <strong>🎉 Success!</strong>
      </div>
      <p>You have successfully signed in to your Ideavista account.</p>
      <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
      <p>Keep exploring and sharing your amazing ideas!</p>
      <p>Best regards,<br>Ideavista Team</p>`;
    }
    if (isDelete === "true") {
      subject = "Ideavista - Delete Request";
      text = "Account Deletion Request !";
      html = `<p>You have requested to delete your account. Please use the following OTP to proceed:</p>
      <div style="padding: 15px; background-color: #f0f0f0; font-size: 24px; text-align: center;">
        <strong>${randomNumber}</strong>
      </div>
      <p>This OTP is valid for a only <b>2 minutes</b>. Do not share it with anyone for security reasons.</p>
      <p>If you did not request this change, please ignore this email.</p>
      <p>Best regards,<br>Ideavista Team</p>`;
    }

    let maileroptions = {
      from: `Ideavista`,
      to: email,
      subject: subject,
      text: text,
      html: html,
    };

    await transport.sendMail(maileroptions);
    if (isSign === "true") {
      res.json({ msg: "Email Sent" });
    }
    if (isDelete === "true") {
      res.json({ msg: ["Email sent", randomNumber] });
    }
  } catch (error) {
    console.log(error);
  }
}

function GenerateRandom() {
  let num = Math.floor(Math.random() * 10000 + 1);
  if (num >= 1000 && num <= 9999 && !undefined) {
    return num;
  } else {
    GenerateRandom();
  }
}

module.exports = Send;
