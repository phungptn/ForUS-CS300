module.exports = {
	default: (req, res, next) => {
		res.status(518).json({
			message: "success",
			method: req.method
		})
	},
	initialize: null
}