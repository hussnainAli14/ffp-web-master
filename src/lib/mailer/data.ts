'use server';

import nodemailer from 'nodemailer';

import { QueryData } from '@ffp-web/app/index.types';
import { unpackError } from '@ffp-web/utils/error.utils';

import { generateNewPasswordToken, generateResetToken } from '../user/data';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function mailResetPassword({ email, isUser }: { email: string, isUser?: boolean }): Promise<QueryData<string>> {
  try {
    const { data: resetToken } = await generateResetToken({ email, isUser });

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/${isUser ? 'user' : 'dashboard'}/password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    return { data: 'Successfully sent reset link to email' };
  } catch (err) {
    return { message: unpackError(err) };
  }
}

export async function mailApproveUser(email: string): Promise<QueryData<string>> {
  try {
    const { data: passwordToken } = await generateNewPasswordToken(email);

    const passwordLink = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/password?token=${passwordToken}&action=new`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'User Request Approved',
      text: `Click the link to create password: ${passwordLink}`,
      html: `<p>Click <a href="${passwordLink}">here</a> to create your password.</p>`,
    });

    return { data: 'Successfully sent approve notification to email' };
  } catch (err) {
    return { message: unpackError(err) };
  }
}

export async function mailContactUsNotify(
  data: { name: string, email: string, phone?: string, message: string }
): Promise<QueryData<string>> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM,
      subject: 'Someone reach out from Contact Us',
      html: `
        <div>
          <div><b>Name:</b></div>
          <div>${data.name}</div>
          <br>
          <div><b>Email:</b></div>
          <div>${data.email}</div>
          <br>
          <div><b>Phone:</b></div>
          <div>${data.phone || '-'}</div>
          <br>
          <div><b>Message:</b></div>
          <p>"${data.message}"</p>
        </div>
      `,
    });

    return { data: 'Successfully sent notify email' };
  } catch (err) {
    return { message: unpackError(err) };
  }
}

export async function mailVerifyUser({ email, verifyToken }: { email: string, verifyToken: string }): Promise<QueryData<string>> {
  try {
    const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/user/verify?token=${verifyToken}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify Account Registration',
      text: `Click the link to verify your registration: ${verifyLink}`,
      html: `<p>Click <a href="${verifyLink}">here</a> to verify your registration.</p>`,
    });

    return { data: 'Successfully sent reset link to email' };
  } catch (err) {
    return { message: unpackError(err) };
  }
}