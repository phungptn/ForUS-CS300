const users = require("../utils/users");

module.exports = (req, res, next) => {
	let user = users.findUserById(req.body.token);
	if (user == null) res.status(200).json({ message: "Invalid session" });
	else res.status(200).json({ message: "Logged out successfully."});
}