const express = require("express");

const users = require("../utils/users");
const box = require("../controllers/box");
const loginRouter = require("./login");
const logoutRouter = require("./logout");

const isPath = function (url, sample) {
	return url.startsWith(sample + "/") || url == sample;
}

module.exports = function (app) {
	// middleware app
	app.use((req, res, next) => {
		let denied = false;
		if (isPath(req.url, "/user/login")) {
			if (req.method != "POST") denied = true;
		}
		else {
			let user = users.findUserById(req.body.token, true);
			if (user == null) denied = true;
		}

		if (denied) {
			res.status(403).json({
				error: "Access denied."
			});
		}
		else next();
	});

	// setup routes
	app.use("/login", loginRouter);
	app.use("/logout", logoutRouter);

	// setup ultimate ending for all routes
	app.all("*", (req, res) => {
		res.status(404).json({ error: "Not found" });
	});
}