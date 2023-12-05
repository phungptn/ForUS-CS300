const users = require("../utils/users");

module.exports = (req, res, next) => {
	let exists = users.findUserById(req.body.token);
	if (exists != null) res.status(403).json({ error: `Already logged in as another user: ${exists.username}. Please log out first.` });
	else {
		let { username, password } = req.body;
		let user = users.findUserByCredentials(username, password);
		if (user == null) res.status(403).json({error: "Authentication error."});
		else res.status(200).json({ message: "Logged in successfully.", token: users.getToken(user) });
	}
}