import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WhiteboardSelectionProps {
  username: string;
  onCreateNew: () => void;
  onJoinExisting: () => void;
}

const WhiteboardSelection: React.FC<WhiteboardSelectionProps> = ({
  username,
  onCreateNew,
  onJoinExisting
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome, {username}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-center text-gray-600">
              Would you like to create a new whiteboard or join an existing one?
            </p>
            <div className="grid grid-cols-1 gap-4">
              <Button 
                onClick={onCreateNew}
                className="w-full"
                size="lg"
              >
                Create New Whiteboard
              </Button>
              <Button 
                onClick={onJoinExisting}
                className="w-full"
                variant="outline"
                size="lg"
              >
                Join Existing Whiteboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhiteboardSelection;
