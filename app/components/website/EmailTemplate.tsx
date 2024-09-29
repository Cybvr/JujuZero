// app/components/EmailTemplate.tsx
import * as React from 'react';

interface EmailTemplateProps {
  email: string;
  feedback: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ email, feedback }) => (
  <div>
    <h1>Feedback Received</h1>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Feedback:</strong> {feedback}</p>
  </div>
);