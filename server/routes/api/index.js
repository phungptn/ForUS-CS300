module.exports = {
	default: null,
	initialize: app => {
		app.all("*", (req, res) => {
			res.status(404).json({ error: "Not found" });
		});
	}
}