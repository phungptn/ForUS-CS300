const User = require("../models/user");
const bcrypt = require("bcrypt");

const tokenGen = require("../../config/jwtToken");

module.exports = {
	findUserById: async function (token, update = false) {
		let data;
		try { data = tokenGen.decodeToken(token) } catch (e) { return null };
		if (data == null) return null;
		console.log(data);
		let user = await User.findById(data.id);
		console.log(user);
		if (user == null || /* No user */
			data.session == null || user.sessionStart == null || /* No session data? */
			data.session != user.sessionStart || /* session data in token is different from database */
			user.lastAccessed == null ||  /* no last accessed time (first time) */
			Date.now() - user.lastAccessed > tokenGen.DEFAULT_DAY_ALIVE /* last accessed more than 1 year */
		) {
			console.log("User not found or session expired");
			return null;
		}
		
		if (update) await this.updateLastAccessed(user);

		console.log("User found");
		return user;
	},
	userByIdExists: async function (token) {
		return (await this.findUserById(token)) != null;
	},
	findUserByCredentials: async function (username, password) {
		let user = await User.findOne({ username });
		console.log(user);
		try {
			let match = await bcrypt.compare(password, user.passwordHash);
			return match ? user : null;
		}
		catch (e) {
			return null
		}
	},

	getToken: async function (user, skipReset = false) {
		if (!skipReset && (user.sessionStart == null || user.lastAccessed == null || Date.now() - user.lastAccessed > tokenGen.DEFAULT_DAY_ALIVE)) {
			// user is inactive for too long or this is first time, reset session info
			user.sessionStart = Date.now();
		}
		await this.updateLastAccessed(user);
		return tokenGen.generateToken(user);
	},
	getResetPasswordToken: async function (user) {
		user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes from now to reset password
		user.passwordResetToken = tokenGen.generateToken(user);
		await user.save();
		return user.passwordResetToken;
	},
	updateLastAccessed: async function (user, deferSave = false) {
		user.lastAccessed = Date.now();
		if (!deferSave) await user.save();
	}
}