const express = require("express");

const users = require("../utils/users");
const tree = require("./tree.json");

const isPath = function (url, sample) {
	return url.startsWith(sample + "/") || url == sample;
}

const setupRoutes = function (app, path, services) {
	for (let service of services) {
		const router = express.Router();

		router.use((req, res, next) => {
			if (service.allow_all_methods || service.allowed_methods.includes(req.method)) next();
			else res.status(403).json({ error: "Access denied." });
		});

		if (Array.isArray(service.services)) setupRoutes(router, path + service.name + "/", service.services);
		else service.default = true;

		if (service.default || service.initialization) {
			const setup = require(path + service.name); 
			
			if (service.default) router.use(setup.default);

			if (service.initialization) setup.initialize(router);
		}
		
		app.use("/" + service.name, router);
	}
}

module.exports = function (app) {
	// middleware app
	app.use((req, res, next) => {
		let denied = false;
		if (isPath(req.url, "/login")) {
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

	// setup services as built in tree.json
	setupRoutes(app, "./", tree);

	// setup ultimate ending for all routes
	app.all("*", (req, res) => {
		res.status(404).json({ error: "Not found" });
	});
}