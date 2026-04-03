const API_URL = '/api/courses';

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

// Get all courses
export const getCourses = async () => {
  const response = await fetch(API_URL);
  return handleResponse(response);
};

// Get specific course
export const getCourse = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return handleResponse(response);
};

// Create new course (Admin)
export const createCourse = async (courseData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });
  return handleResponse(response);
};

// Update course (Admin)
export const updateCourse = async (id, courseData, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });
  return handleResponse(response);
};

// Delete course (Admin)
export const deleteCourse = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};
