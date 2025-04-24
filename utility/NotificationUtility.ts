import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport'; // <-- this is key
//Email


//Notification


//OTP
export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let otp_expiry = new Date();
  otp_expiry.setTime(otp_expiry.getTime() + 30 * 60 * 1000); // 30 minutes
  return {
    otp: otp,
    otp_expiry: otp_expiry,
  };
}

export const SendEmailOtp = async (email: string, subject: string, text: string) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  } as SMTPTransport.Options); // <-- cast it here

  await transport.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject,
    // text,
    html: text,
  });
}

//Payment notifications