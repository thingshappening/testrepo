'use client';

import { useState } from 'react';
import WelcomeForm from './components/WelcomeForm';
import WhiteboardSelection from './components/WhiteboardSelection';
import WhiteboardCanvas from './components/WhiteboardCanvas';
import { createUser, createWhiteboard, getWhiteboard, leaveWhiteboard } from '@/services/api';
import type { Whiteboard } from './services/api';

type AppScreen = 'welcome' | 'selection' | 'whiteboard';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [username, setUsername] = useState<string>('');
  const [currentWhiteboard, setCurrentWhiteboard] = useState<Whiteboard | null>(null);

  const handleUsernameSubmit = async (submittedUsername: string) => {
    try {
      await createUser(submittedUsername);
      setUsername(submittedUsername);
      setCurrentScreen('selection');
    } catch (error) {
      console.error('Failed to create user:', error);
      // Handle error (show message to user)
    }
  };

  const handleCreateNewWhiteboard = async () => {
    try {
      const { whiteboard_id } = await createWhiteboard(username);
      const whiteboard = await getWhiteboard(whiteboard_id);
      setCurrentWhiteboard(whiteboard);
      setCurrentScreen('whiteboard');
    } catch (error) {
      console.error('Failed to create whiteboard:', error);
      // Handle error (show message to user)
    }
  };

  const handleJoinExisting = () => {
    // We'll implement this in the next iteration
    console.log('Joining existing whiteboard as user:', username);
  };

  const handleExitWhiteboard = async () => {
    if (currentWhiteboard) {
      try {
        await leaveWhiteboard(currentWhiteboard.id, username);
        setCurrentWhiteboard(null);
        setCurrentScreen('selection');
      } catch (error) {
        console.error('Failed to leave whiteboard:', error);
        // Handle error (show message to user)
      }
    }
  };

  return (
    <>
      {currentScreen === 'welcome' && (
        <WelcomeForm onUsernameSubmit={handleUsernameSubmit} />
      )}
      {currentScreen === 'selection' && (
        <WhiteboardSelection
          username={username}
          onCreateNew={handleCreateNewWhiteboard}
          onJoinExisting={handleJoinExisting}
        />
      )}
      {currentScreen === 'whiteboard' && currentWhiteboard && (
        <WhiteboardCanvas
          username={username}
          onExit={handleExitWhiteboard}
          whiteboard={currentWhiteboard}
        />
      )}
    </>
  );
}
