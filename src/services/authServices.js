// src/services/authService.js

let mockUser = {
  username: "admin",
  password: "1234",
  name: "Administrador"
};

export const login = async ({ username, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === mockUser.username && password === mockUser.password) {
        resolve({ name: mockUser.name, username });
      } else {
        reject("Wrong user or password");
      }
    }, 500);
  });
};

export const updateMockUser = ({ username, password, name }) => {
  if (username) mockUser.username = username;
  if (password) mockUser.password = password;
  if (name) mockUser.name = name;
};

export const getMockUser = () => mockUser;
