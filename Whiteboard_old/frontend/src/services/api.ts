const API_BASE_URL = 'http://localhost:8000/api';

export interface User {
  username: string;
  created_at: string;
  active_whiteboard: string | null;
}

export interface Whiteboard {
  id: string;
  creator: string;
  created_at: string;
  connected_users: string[];
}

export async function createUser(username: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users?username=${encodeURIComponent(username)}`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  return response.json();
}

export async function getUser(username: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(username)}`);
  
  if (!response.ok) {
    throw new Error('Failed to get user');
  }
  
  return response.json();
}

export async function createWhiteboard(creator: string): Promise<{ whiteboard_id: string }> {
  const response = await fetch(`${API_BASE_URL}/whiteboards?creator=${encodeURIComponent(creator)}`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to create whiteboard');
  }
  
  return response.json();
}

export async function getWhiteboard(whiteboardId: string): Promise<Whiteboard> {
  const response = await fetch(`${API_BASE_URL}/whiteboards/${whiteboardId}`);
  
  if (!response.ok) {
    throw new Error('Failed to get whiteboard');
  }
  
  return response.json();
}

export async function joinWhiteboard(whiteboardId: string, username: string): Promise<Whiteboard> {
  const response = await fetch(
    `${API_BASE_URL}/whiteboards/${whiteboardId}/join?username=${encodeURIComponent(username)}`,
    { method: 'POST' }
  );
  
  if (!response.ok) {
    throw new Error('Failed to join whiteboard');
  }
  
  return response.json();
}

export async function leaveWhiteboard(whiteboardId: string, username: string): Promise<Whiteboard> {
  const response = await fetch(
    `${API_BASE_URL}/whiteboards/${whiteboardId}/leave?username=${encodeURIComponent(username)}`,
    { method: 'POST' }
  );
  
  if (!response.ok) {
    throw new Error('Failed to leave whiteboard');
  }
  
  return response.json();
}
