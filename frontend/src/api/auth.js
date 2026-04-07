const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const API_URL = `${API_BASE}/auth`;

// Helper to handle API responses
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new Error(`Server connection failed (${response.status}). Please make sure the backend is running.`);
    }
    throw new Error('Received invalid JSON from server.');
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Register user
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// Login user
export const loginUser = async (userData) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// Get profile
export const getProfile = async (token) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Get all users (Admin only)
export const getUsers = async (token) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Update profile
export const updateProfile = async (userData, token) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// Update password
export const updatePassword = async (passwordData, token) => {
  const response = await fetch(`${API_URL}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(passwordData),
  });
  return handleResponse(response);
};

// Delete account
export const deleteAccount = async (token) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Delete user (Admin only)
export const deleteAdminUser = async (id, token) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};
// Export data
export const exportUserData = async (token) => {
  const response = await fetch(`${API_URL}/export`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};
