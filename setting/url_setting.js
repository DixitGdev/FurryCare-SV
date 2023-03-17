/*
 *	SERVER DEFAULT URL
 * 	--- START ----
*/
urlHandler  = module.exports = require('./url');
urlHandler.BindUrl();
/*
 *	SERVER DEFAULT URL
 * 	--- END ----
*/

/*
 *	APIs URL Handalder
 * 	--- START ----
*/
usersApiUrlHandler  = module.exports = require('./api/users/users');
usersApiUrlHandler.BindUrl();

contactusApiUrlHandler= module.exports= require('./api/contact_us/contact_us_url');
contactusApiUrlHandler.BindUrl();

/*
 * 	APIs URL Handalder
 * --- END ----
*/

