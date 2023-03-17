module.exports = {
	BindUrl: function () {
		app.get('/', function (req, res) {
			try {
				var respData = {
					title: 'Doggers',
					config: config
				};
				res.render("web/index.html", respData);
			} catch (err) {
				res.status(404).send(err)
			}
		});
		app.get('/login', function (req, res) {
			try {
				var respData = {
					title: 'Login',
					config: config,
					script: {
						available: 1,
						js: 'login'
					},
				};
				res.render("web/login.html", respData);
			} catch (err) {
				res.status(404).send(err)
			}
		});
		app.get('/signup', function (req, res) {
			try {
				var respData = {
					title: 'SignUp',
					config: config,
					script: {
						available: 1,
						js: 'signup'
					},
				};
				res.render("web/signup.html", respData);
			} catch (err) {
				res.status(404).send(err)
			}
		});
		app.get('/about', function (req, res) {
			try {
				var respData = {
					title: 'About Us',
					config: config
				};
				res.render("web/about.html", respData);
			} catch (err) {
				res.status(404).send(err)
			}
		});
		app.get('/contact', function (req, res) {
			try {
				var respData = {
					title: 'Contact Us',
					config: config
				};
				res.render("web/contact.html", respData);
			} catch (err) {
				res.status(404).send(err)
			}
		});
		app.get('/feature', function (req, res) {
			try {
				var respData = {
					title: 'Features',
					config: config
				};
				res.render("web/feature.html", respData);
			} catch (err) {
				res.status(404).send(err)
			}
		});
		app.get('/404', function (req, res) {
			try {
				var respData = {
					title: 'Error',
					config: config
				};
				res.render("web/404.html", respData);
			} catch (err) {
				res.status(404).send(err)
			}
		});
		app.get('/project', function (req, res) {
			try {
				var respData = {
					title: 'Project',
					config: config
				};
				res.render("web/project.html", respData);
			} catch (err) {
				res.status(404).send(err)
			}
		});
		app.get('/service', function (req, res) {
			try {
				var respData = {
					title: 'Service',
					config: config
				};
				res.render("web/service.html", respData);
			} catch (err) {
				res.status(404).send(err)
			}
		});
		app.get('/team', function (req, res) {
			try {
				var respData = {
					title: 'Team',
					config: config
				};
				res.render("web/team.html", respData);
			} catch (err) {
				res.status(404).send(err)
			}
		});
		app.get('/testimonial', function (req, res) {
			try {
				var respData = {
					title: 'Testimonial',
					config: config
				};
				res.render("web/testimonial.html", respData);
			} catch (err) {
				res.status(404).send(err)
			}
		});
	}
}