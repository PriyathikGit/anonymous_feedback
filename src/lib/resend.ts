
import { Resend } from 'resend';
// containing resend api key
export const resend = new Resend(process.env.RESEND_API_KEY);

// otp email functionality flow

// use any email sender package, using resend here
// make a email sending utitly, refer docs (https://resend.com/docs/send-with-nextjs)
// i have distributed the api key in one file, and made email functionality in one file
// made a email template, refer docs (https://resend.com/docs/send-with-nextjs) 