import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import Email from '../../emails/verificationEmail';

export const sendVerificationEmail = async ({
  email,
  username,
  verifyCode,
}: any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAIL_TRANSPORTER_USER_ID,
        pass: process.env.MAIL_TRANSPORTER_PASS,
      },
    });

    const emailHtml = await render(Email({ username, otp: verifyCode }));

    const options = {
      from: 'priyathik.mailer@service.com',
      to: email,
      subject: 'hello world',
      html: emailHtml,
    };

    const info = await transporter.sendMail(options);
    console.log('Email sent:', info);

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email' };
  }
};
