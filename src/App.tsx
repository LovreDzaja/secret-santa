import React, { useState } from 'react';
import './App.css';
import { RegisterPersonPage } from './components/RegisterPersonPage';
import FinishSendEmail, {  } from './components/FinishSendEmail';
import { Person } from './Person';

const STAGE_REGISTER_PERSONS = 0;
const STAGE_SENDING_EMAIL = 1;

function App() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [stage, setStage] = useState(STAGE_REGISTER_PERSONS);

  const prepareSendingEmail = (persons: Person[]) => {
    setPersons(persons);
    setStage(STAGE_SENDING_EMAIL);
  };

  // Use the FinishSendEmailProps type for the props of FinishSendEmail component
  const handleEmailSent = () => {
    setStage(STAGE_REGISTER_PERSONS);
  };

  if (stage === STAGE_REGISTER_PERSONS) {
    return <RegisterPersonPage prepareSendingEmail={prepareSendingEmail} />;
  }

  return (
    // Pass the persons and onEmailSent props with the correct types
    <FinishSendEmail persons={persons} onEmailSent={handleEmailSent} />
  );
}

export default App;
