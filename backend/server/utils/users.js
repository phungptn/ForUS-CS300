const User = require("../models/user");
const bcrypt = require("bcrypt");

const tokenGen = require("../../config/jwtToken");

const RESET_PASSWORD_EXPIRY = 15 * 60 * 1000;

const findToken = function (req) {
	return req.body.token;
}

module.exports = {
	findUserById: async function (req, update = false) {
		let data;
		try { data = tokenGen.decodeToken(findToken(req)) } catch (e) { return null };
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
	userByIdExists: async function (req) {
		return (await this.findUserById(findToken(req))) != null;
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
	setPassword: async function (user, password) {
		// generate password hash, with salt 10
		const salt = await bcrypt.genSalt(10);
    	user.passwordHash = await bcrypt.hash(password, salt);
		await user.save();
	},
	resetTokenLifespan: async function (user) {
		user.lastAccessed = user.sessionStart = Date.now();
		await user.save();
	},
	getToken: async function (user, skipReset = false, forced = false) {
		if (!skipReset && (user.sessionStart == null || user.lastAccessed == null || Date.now() - user.lastAccessed > tokenGen.DEFAULT_DAY_ALIVE)) {
			// user is inactive for too long or this is first time, reset session info
			await this.resetTokenLifespan(user);
		}
		else await this.updateLastAccessed(user);
		return tokenGen.generateToken(user);
	},
	getPasswordResetToken: async function (user, forceCreate = false) {
		if (forceCreate || user.passwordResetExpiry == null || Date.now() - user.passwordResetExpiry > RESET_PASSWORD_EXPIRY) {
			if (forceCreate) await this.createPasswordResetSession(user);
			else return null;
		}

		return tokenGen.generatePasswordResetToken(user);
	},
	createPasswordResetSession: async function (user) {
		user.passwordResetExpiry = Date.now();
		await user.save();
	},
	findUserWithPasswordTokenRequest: async function (token) {
		let data = tokenGen.decodeToken(token);
		if (data == null || data.id == null) return null;

		let user = await User.findById(data.id);
		if (user == null) return null;

		console.log(user);

		if (user.passwordResetExpiry == null || user.passwordResetExpiry != data.session || Date.now() - user.passwordResetExpiry > RESET_PASSWORD_EXPIRY) {
			return null;
		}

		return user;
	},
	updateLastAccessed: async function (user, deferSave = false) {
		user.lastAccessed = Date.now();
		if (!deferSave) await user.save();
	}
}