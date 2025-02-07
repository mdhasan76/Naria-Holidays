const nodemailer = require("nodemailer");

export const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "cornell.stracke83@ethereal.email",
    pass: "m7Ets8UNBdUD9E5CVQ",
  },
});
// cornell.stracke83@ethereal.email
// m7Ets8UNBdUD9E5CVQ
// Cornell Stracke
