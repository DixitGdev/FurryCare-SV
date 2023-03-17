//define all controller
commonController = module.exports = require('../controllers/common');

//JWT Token
apiJwtController = module.exports = require('../controllers/api/jwt');

//APIs Controller - user management
usersApiController = module.exports = require('../controllers/api/users/users');
loginHistoryController = module.exports = require('../controllers/api/users/login_history');
contactusController= module.exports= require('../controllers/api/contact_us/contact_us')
