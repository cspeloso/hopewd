const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = async ({ username, password }) => {
  console.log('Creating user:', username);
  try {
    // Check if username already exists
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );
    console.log('User created successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in createUser:', error.message);
    throw new Error('Could not create user');
  }
};

const findUserByUsername = async (username) => {
  console.log('Looking for user:', username);
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    console.log('User found:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in findUserByUsername:', error.message);
    throw new Error('Could not find user');
  }
};

module.exports = { createUser, findUserByUsername };