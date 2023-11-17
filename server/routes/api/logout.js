const { initialization } = require("./login");

module.exports = {
	default: (req, res, next) => {
		delete req.session.user_id;
		res.status(200).json({ message: "Logged out successfully."});
	},
	initialize: null
}