const express = require("express");

const users = require("../utils/users");
const userRouter = require("./user");
const box = require("../controllers/box");

const isPath = function (url, sample) {
	return url.startsWith(sample + "/") || url == sample;
}

module.exports = function (app) {
	// middleware app
	// app.use((req, res, next) => {
	// 	let denied = false;
	// 	if (isPath(req.url, "/users/login")) {
	// 		if (req.method != "POST") denied = true;
	// 	}
	// 	else {
	// 		let user = users.findUserById(req.body.token, true);
	// 		if (user == null) denied = true;
	// 	}

	// 	if (denied) {
	// 		res.status(403).json({
	// 			error: "Access denied!."
	// 		});
	// 	}
	// 	else next();
	// });

	// setup routes
	app.use("/users", userRouter);
	// setup ultimate ending for all routes
	app.all("*", (req, res) => {
		res.status(404).json({ error: "Not found" });
	});
}