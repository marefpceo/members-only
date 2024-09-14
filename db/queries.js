const pool = require('./pool');

// Returns a list of all messages
async function getAllMessages() {
  const { rows } = await pool.query(`
    SELECT messages.*, users.username FROM messages
    LEFT JOIN users ON messages.author = users.id
    `);
  return rows;
}

// Returns a list of all users
async function getAllUsers() {
  const { rows } = await pool.query(`
    SELECT * FROM users;
  `);
  return rows;
}

// Checks if username exists and returns found row
async function findUser(username) {
  const { rows } = await pool.query(`
    SELECT * FROM users
    WHERE username = ($1)
    `, [username]);
  return rows;
}

// Create new user
async function createNewUser(firstName, lastName, username, password, member, isAdmin){
  const { rows } = await pool.query(`
    INSERT INTO users (first_name, last_name, username, password, member, is_admin)
    VALUES (($1), ($2), ($3), ($4), ($5), ($6)) RETURNING id
    `, [firstName, lastName, username, password, member, isAdmin]);
  return rows;
}

// Update user club access status
async function grantClubAccess(id) {
  await pool.query(`
    UPDATE users
    SET member = true 
    WHERE id = ($1)
  `, [id]);
}

// Create a new message
async function createNewMessage(message_title, message_text, author) {
  await pool.query(`
    INSERT INTO messages (message_title, message_text, author)
    VALUES (($1), ($2), ($3))
  `, [message_title, message_text, author]);
}

// Get selected message and message author
async function getSelectedMessage(id) {
  const { rows } = await pool.query(`
    SELECT messages.*, users.first_name, users.last_name, users.username FROM messages
    LEFT JOIN users ON messages.author = users.id
    WHERE messages.id = ($1);
  `, [id]);
  return rows;
}

// Delete selcted message
async function deleteSelectedMessage(id) {
  await pool.query(`
    DELETE FROM messages
    WHERE id = ($1)
  `, [id]);
}

// Get messages created by selected user
async function getUserMessages(userId) {
  const { rows } = await pool.query(`
    SELECT * FROM messages
    WHERE author = ($1)
  `, [userId]);
  return rows;
}

// Get message count for selected user
async function getUserMessageCount(userId) {
  const { rows } = await pool.query(`
    SELECT COUNT(*) FROM messages
    WHERE author = ($1)
  `, [userId]);
  return rows;
}


 
module.exports = {
  getAllMessages,
  getAllUsers,
  findUser,
  createNewUser,
  grantClubAccess,
  createNewMessage,
  getSelectedMessage,
  deleteSelectedMessage,
  getUserMessages,
  getUserMessageCount
}