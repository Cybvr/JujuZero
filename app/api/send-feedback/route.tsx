import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs' // This line is crucial

export async function POST(request: Request) {
  try {
    const { email, feedback, feedbackType } = await request.json();

    // Create a transporter using SMTP
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "jide@visual.ng", // Your actual email
      subject: "Juju App! New User Feedback",
      text: `Email: ${email}\n\nFeedback Type: ${feedbackType}\n\nFeedback: ${feedback}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Feedback Type:</strong> ${feedbackType}</p>
        <p><strong>Feedback:</strong></p>
        <p>${feedback}</p>
      `
    });

    return NextResponse.json({ message: 'Feedback sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in send-feedback route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}