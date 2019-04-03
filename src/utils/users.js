const users = [];

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // validate the data
  if (!username || !room) {
    return {
      error: "Username and Room are required"
    };
  }

  // Check for existing users
  const existingUser = users.find(
    user => user.room === room && user.username === username
  );

  // Validate username
  if (existingUser) {
    return {
      error: "Username is already in use"
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => {
  return users.find(user => user.id === id);
};

const getUsersInRoom = roomName => {
  return users.filter(user => user.room === roomName);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
