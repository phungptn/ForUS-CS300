const users = require("../utils/users");

module.exports = {
	default: (req, res, next) => {
		let user = users.findUserById(req.body.token) ?? null;
		res.status(200).json({
			message: "success",
			method: req.method,
			user_id: user.id
		});
	},
	initialize: null
}