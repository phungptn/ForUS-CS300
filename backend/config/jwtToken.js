// generating JWT
const jwt = require("jsonwebtoken");

const DEFAULT_DAY_ALIVE = 12 * 30 * 24 * 60 * 60 * 1000;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const generateToken = (user) => {
  return jwt.sign({ id: user.id, session: user.sessionStart }, JWT_SECRET, { noTimestamp: true });
};

const decodeToken = (accessToken) => {
  try { return jwt.verify(accessToken, JWT_SECRET); }
  catch (e) { return null }
};

module.exports = { generateToken, decodeToken, DEFAULT_DAY_ALIVE };
