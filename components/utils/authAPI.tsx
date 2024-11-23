interface User {
  id: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

const API_BASE_URL = 'https://calendar-backend-tjs1.onrender.com/api'; 

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
}

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);
    return data; 
  },

  signup: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);
    return data; 
  },

  verifyToken: async (token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await handleResponse(response);
    return data; 
  }
};
