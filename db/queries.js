const pool = require('./pool');

// Returns a list of all messages
async function getAllMessages() {
  const { rows } = await pool.query(`
    SELECT * FROM messages;
    `);
  return rows;
}

// Checks if username exists
async function findUsername(username) {
  const { rows } = await pool.query(`
    SELECT username FROM users
    WHERE username = ($1)
    `, [username]);
  return rows;
}

// Create new user
async function createNewUser(firstName, lastName, username, password, isAdmin){
  await pool.query(`
    INSERT INTO users (first_name, last_name, username, password, is_admin)
    VALUES (($1), ($2), ($3), ($4), ($5))
    `, [firstName, lastName, username, password, isAdmin]);
}

module.exports = {
  getAllMessages,
  findUsername,
  createNewUser
}