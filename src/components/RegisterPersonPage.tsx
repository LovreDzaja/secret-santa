// RegisterPersonPage.tsx
import React, { useState } from 'react';
import { Person } from '../Person';
import logo from '../logo.svg';
import { Box, Button, Snackbar, TextField } from '@mui/material';
import { AddCircleRounded } from '@mui/icons-material';
import DeletableChips from './DeletableChips';

export const RegisterPersonPage: React.FC<{
  prepareSendingEmail: (persons: Person[]) => void;
}> = ({ prepareSendingEmail }) => {
  const [currentName, setCurrentName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [persons, setPersons] = useState<Person[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorMessage('');
  };

  const isValidEmail = (email: string): boolean => {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return expression.test(email);
  };

  const handleAddPerson = () => {
    if (currentName.trim() === '') {
      setErrorMessage('The name cannot be empty.');
      return;
    }

    if (!isValidEmail(currentEmail)) {
      setErrorMessage('The email is incorrect.');
      return;
    }

    setPersons((prevPersons) => [
      ...prevPersons,
      new Person(currentName, currentEmail),
    ]);
    setCurrentName('');
    setCurrentEmail('');
  };

  const handleDeletePerson = (index: number) => {
    setPersons((prevPersons) =>
      prevPersons.filter((_, index2) => index2 !== index)
    );
  };

  const prepareAndContinue = () => {
    if (persons.length < 2) {
      setErrorMessage('You need at least two participants.');
      return;
    }

    const giftReceivers = generateRandomAssignments(persons);

    if (!giftReceivers) {
      setErrorMessage('Error generating assignments. Please try again.');
      return;
    }

    const personsWithAssignments = persons.map((person, index) => ({
      ...person,
      assignedPerson: giftReceivers[index],
    }));

    prepareSendingEmail(personsWithAssignments);
  };

  const generateRandomAssignments = (participants: Person[]): number[] | null => {
    const participantsCount = participants.length;
  
    // Create an array [0, 1, ..., n-1] to represent the indices of participants
    const indices = Array.from({ length: participantsCount }, (_, index) => index);
  
    // Shuffle a copy of the indices array randomly
    const shuffledIndices = [...indices].sort(() => Math.random() - 0.5);
  
    // Check if each person gets a unique receiver
    for (let i = 0; i < participantsCount; i++) {
      if (shuffledIndices[i] === indices[i]) {
        // If any person gets themselves, shuffle again
        return generateRandomAssignments(participants);
      }
    }
  
    return shuffledIndices;
  };
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextField
          sx={{ m: 2 }}
          label="Name"
          variant="standard"
          value={currentName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setCurrentName(event.target.value)
          }
        />

        <TextField
          sx={{ m: 2 }}
          label="Email"
          variant="standard"
          value={currentEmail}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setCurrentEmail(event.target.value)
          }
        />

          <AddCircleRounded sx={{ m: 2 }} onClick={handleAddPerson} />
        </Box>

        {persons.map((person, index) => (
            <DeletableChips
              key={index}
              name={person.name}
              handleDelete={() => handleDeletePerson(index)}
            />

        ))}

        <Button variant="contained" onClick={prepareAndContinue}>
          Continue to Secret Santa
        </Button>
      </header>

      <Snackbar
        open={errorMessage !== ''}
        autoHideDuration={6000}
        onClose={handleClose}
        message={errorMessage}
      />
    </div>
  );
};
