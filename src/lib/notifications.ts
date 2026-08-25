import nodemailer from 'nodemailer';

// Email Transporter
const getEmailTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: { user, pass },
  });
};

const generateEmailTemplate = (otp: string) => `
  <div style="background-color: #faf9f6; padding: 60px 20px; font-family: 'Times New Roman', Times, serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; padding: 60px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
          <div style="margin-bottom: 40px;">
              <h1 style="color: #1a1a1a; font-size: 28px; font-weight: 300; letter-spacing: 6px; text-transform: uppercase; margin: 0;">AKOD FOOD</h1>
              <div style="width: 40px; height: 1px; background-color: #d4af37; margin: 20px auto;"></div>
          </div>
          
          <h2 style="color: #444; font-size: 16px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 30px;">Verification Code</h2>
          
          <p style="color: #777; font-size: 14px; line-height: 1.8; margin-bottom: 40px; font-style: italic;">
              "Use the security verification code below to authenticate your session."
          </p>
          
          <div style="background-color: #1a1a1a; padding: 30px; margin: 0 auto 40px; width: fit-content; min-width: 200px; border-radius: 8px;">
              <span style="color: #d4af37; font-size: 36px; letter-spacing: 12px; font-weight: 700; font-family: monospace;">${otp}</span>
          </div>
          
          <p style="color: #999; font-size: 11px; line-height: 1.6; max-width: 400px; margin: 0 auto;">
              This code expires in 10 minutes.<br>
              If you did not request this code, please ignore this email.
          </p>
          
          <div style="margin-top: 60px; border-top: 1px solid #f0f0f0; padding-top: 30px;">
              <p style="color: #bbb; font-size: 9px; letter-spacing: 1px; text-transform: uppercase;">© ${new Date().getFullYear()} AKOD FOOD</p>
          </div>
      </div>
  </div>
`;

export const sendEmailOTP = async (email: string, otp: string) => {
  try {
    const transporter = getEmailTransporter();
    if (!transporter) {
      console.log(`[Development Mode] Email OTP for ${email}: ${otp}`);
      return true;
    }

    const mailOptions = {
      from: `"AKOD FOOD" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your AKOD Verification Security Code',
      html: generateEmailTemplate(otp),
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error('[Email Error]', error);
    throw new Error('Failed to send email verification');
  }
};
