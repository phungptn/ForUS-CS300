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
		
		let loggedIn = users.userByIdExists(req.session.user_id);
		if (req.url == '/' || req.url == '/index.html') {
			// Redirects any access to main page to /home
			res.redirect('/home');
		}
		else if (!isPath(req.url, "/api")) {
			// Rejects any methods other than GET if target is not an API endpoint
			// Exclude /static folder from checks
			if (req.method != 'GET') {
				res.status(403).json({
					error: "Permission denied."
				});;
			}
			else if (isPath(req.url, "/static")) next();
			else if (isPath(req.url, "/login")) {
				if (loggedIn) res.redirect("/");
				else res.status(200).render("login");
			}
			else {
				if (loggedIn) next();
				else res.redirect("/login");
			}
		}
		else {
			// Accepts request to api-endpoint only if session is logged in or doing "post" request in login api
			let denied = false;
			if (isPath(req.url, "/api/login")) {
				if (req.method != "POST") denied = true;
			}
			else if (!loggedIn) denied = true;

			if (denied) {
				res.status(403).json({
					error: "Access denied."
				});
			}
			else next();
		}
	});

	// setup services as built in tree.json
	setupRoutes(app, "./", tree);

	// setup ultimate ending for all routes
	app.all("*", (req, res) => {
		res.status(404).render('404');
	})
}