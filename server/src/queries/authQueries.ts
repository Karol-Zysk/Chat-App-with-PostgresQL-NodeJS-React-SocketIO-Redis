export const existingUserQuery = "SELECT username from users WHERE username=$1"
export const potentialLoginQuery = "SELECT id, username, passhash FROM users u WHERE u.username=$1"
export const registerQuery = "INSERT INTO users(username, passhash) values($1,$2) RETURNING id, username"