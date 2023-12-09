// FinishSendEmail.tsx
import React, { useState } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Person } from '../Person';
import arrayShuffle from 'array-shuffle';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface EmailError {
  text: string;
  // Add other properties if needed
}

interface FinishSendEmailProps {
  persons: Person[];
  onEmailSent: () => void; // Callback to notify when the email is sent
}

const FinishSendEmail: React.FC<FinishSendEmailProps> = ({ persons, onEmailSent }) => {
  const [isSending, setIsSending] = useState(false);

  const shuffledPersons = arrayShuffle([...persons]);
  const shuffledRecipients = arrayShuffle([...persons]);

  const sendEmail = async (email: string, recipientName: string): Promise<boolean> => {
    try {
      const result: EmailJSResponseStatus = await emailjs.send(
        'service_xcge4j2',
        'template_7y0cg5p',
        { to_email: email, recipient_name: recipientName },
        '-HdvPVxYS-oV4jXOX'
      );
      console.log(result.text);
      return true;
    } catch (error) {
      const emailError = error as EmailError;
      console.log(emailError.text);
      return false;
    }
  };

  const sendEmails = async () => {
    setIsSending(true);

    try {
      for (let i = 0; i < shuffledPersons.length; i++) {
        const person = shuffledPersons[i];
        const recipient = getNextRecipientFor(i, shuffledRecipients);

        const body = `Hello, ${person.name} (${person.email}),
                      You have to buy a gift 🎁 for: ${recipient.name} (${recipient.email}).
                      Happy Christmas!! 🎅🎄`;

        await sendEmail(person.email, recipient.name);
      }

      setIsSending(false);
      onEmailSent(); // Notify parent component that all emails are sent
    } catch (error) {
      console.error('Error sending emails:', error);
      setIsSending(false);
    }
  };

  const getNextRecipientFor = (index: number, recipients: Person[]): Person => {
    const recipientIndex = (index + 1) % recipients.length;
    return recipients[recipientIndex];
  };

  return (
    <Stack direction="column" spacing={1} alignItems="center">
      {shuffledPersons.map((person, index) => (
        <React.Fragment key={index}>
          <Chip label={person.name} />
          <ArrowForwardIcon />
          <Chip label={getNextRecipientFor(index, shuffledRecipients).name} />
        </React.Fragment>
      ))}
      <button onClick={sendEmails} disabled={isSending}>
        Send Emails
      </button>
    </Stack>
  );
};

export default FinishSendEmail;
