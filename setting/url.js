var upload = multer({ dest: './views' });

module.exports = {
    BindUrl: function () {
		
		app.get('/version', function (req, res) {
			res.send('Version 1.0');
		});

		app.get('/test', function (req, res) {
			res.render('test.html');
		});

		app.get('/email-test', function(req, res) {
			var html =  "<p>Hey,</p><p>Welcome to <strong>Lyfstori!</strong></p><p>To get started, we need a few things from you. Please confirm your email address so our team knows where they should notifications.</p><p>Your one time password to verify your mail is <strong>123456</strong></p><p>To your continued success,</p><strong>Team Lyfstori!</strong>";
			var to = 'nikunjs.codezee@gmail.com';
			var subject = 'Lyfstori email verification';
			commonController.__sendEmail(to, subject, html);
			res.send('FCM Sent!');
		});

	}
}