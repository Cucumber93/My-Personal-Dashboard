// Get API URL from environment variable, fallback to default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3100/api';

// User API
export const signUp = async (data: { name: string; email: string; passwordHash: string }) => {
  const response = await fetch(`${API_BASE_URL}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to sign up');
  }

  return response.json();
};

export const signIn = async (data: { email: string; passwordHash: string }) => {
  const response = await fetch(`${API_BASE_URL}/users/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to sign in');
  }

  return response.json();
};

// Upload API - Upload image to MinIO and get URL
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image to MinIO');
  }

  const data = await response.json();
  return data.url; // Return MinIO URL
};

// Project API
export const getProjects = async (userId?: number) => {
  const url = userId 
    ? `${API_BASE_URL}/projects?userId=${userId}`
    : `${API_BASE_URL}/projects`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  
  return response.json();
};

export const getProjectById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch project');
  }
  
  return response.json();
};

export const createProject = async (data: {
  userId: number;
  projectName: string;
  image?: string | null;
  description?: string | null;
}) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create project');
  }

  return response.json();
};

export const updateProject = async (
  id: number,
  userId: number,
  data: {
    projectName?: string;
    image?: string | null;
    description?: string | null;
  }
) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update project');
  }

  return response.json();
};

export const deleteProject = async (id: number, userId: number) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}?userId=${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete project');
  }
};

export const searchProjects = async (query: string, userId?: number) => {
  const url = userId
    ? `${API_BASE_URL}/projects/search?q=${encodeURIComponent(query)}&userId=${userId}`
    : `${API_BASE_URL}/projects/search?q=${encodeURIComponent(query)}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to search projects');
  }
  
  return response.json();
};
