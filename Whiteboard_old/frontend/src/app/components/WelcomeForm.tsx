import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface WelcomeFormProps {
  onUsernameSubmit: (username: string) => void;
}

const WelcomeForm: React.FC<WelcomeFormProps> = ({ onUsernameSubmit }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    
    if (username.trim().length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }
    
    setError('');
    onUsernameSubmit(username.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
           Very Early Iteration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-700"
              >
                     Pick A Name
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Name Here Pls"
                className="w-full"
              />
              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full"
            >
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeForm;
