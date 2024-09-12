const pool = require('./pool');

// Returns a list of all messages
async function getAllMessages() {
  const { rows } = await pool.query(`
    SELECT * FROM messages;
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
  await pool.query(`
    INSERT INTO users (first_name, last_name, username, password, member, is_admin)
    VALUES (($1), ($2), ($3), ($4), ($5), ($6))
    `, [firstName, lastName, username, password, member, isAdmin]);
}

// Update user club access status
async function grantClubAccess(id) {
  await pool.query(`
    UPDATE users
    SET member = true 
    WHERE id = ($1)
  `, [id]);
}

module.exports = {
  getAllMessages,
  findUser,
  createNewUser,
  grantClubAccess
}