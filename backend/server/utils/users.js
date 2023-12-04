const userTests = [
	{ id: "12345", username: "admin", password: "1234", admin: "true" },
	{ id: "74568", username: "user", password: "newTest" },
];

const tokenGen = require("../../config/jwtToken");

module.exports = {
	findUserById: function (token, update = false) {
		let data;
		try { data = tokenGen.decodeToken(token) } catch (e) { return null };
		if (data == null) return null;
		let user = userTests.find(u => u.id === data.id);
		if (user == null || /* No user */
			data.session == null || user.sessionStart == null || /* No session data? */
			data.session != user.sessionStart || /* session data in token is different from database */
			user.lastAccessed == null ||  /* no last accessed time (first time) */
			Date.now() - user.lastAccessed > tokenGen.DEFAULT_DAY_ALIVE /* last accessed more than 1 year */
		) return null;
		
		if (update) this.updateLastAccessed(user);
		return user;
	},
	userByIdExists: function (token) {
		return this.findUserById(token) != null;
	},
	findUserByCredentials: function (username, password) {
		return userTests.find(u => u.username === username && u.password === password);
	},
	getToken: function (user, skipReset = false) {
		if (!skipReset && (user.sessionStart == null || user.lastAccessed == null || Date.now() - user.lastAccessed > tokenGen.DEFAULT_DAY_ALIVE)) {
			// user is inactive for too long or this is first time, reset session info
			user.sessionStart = Date.now();
		}
		this.updateLastAccessed(user);
		return tokenGen.generateToken(user);
	},
	updateLastAccessed: function (user) {
		user.lastAccessed = Date.now();
	}
}