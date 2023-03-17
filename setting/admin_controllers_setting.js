//Validater
validationController = module.exports = require("../controllers/validation.js");

//APIs Controller - user management
loginAdminController = module.exports = require("../controllers/admin/login");
dashboardAdminController =
  module.exports = require("../controllers/admin/dashboard");
userAdminController =
  module.exports = require("../controllers/admin/user/user");
addOnAdminController =
  module.exports = require("../controllers/admin/addons/addons");
groomer_productsAdminController =
  module.exports = require("../controllers/admin/groomer_products/groomer_products");
groomer_tool_req_AdminController =
  module.exports = require("../controllers/admin/groomer_tool_req/groomer_tool_req");
productsAdminController =
  module.exports = require("../controllers/admin/products/products");
packagesAdminController =
  module.exports = require("../controllers/admin/packages/packages");
servicecategoryAdmincontroller =
  module.exports = require("../controllers/admin/service_category/service_category");
groomersAdmincontroller =
  module.exports = require("../controllers/admin/groomers/groomers");
//APIs Location data
countryAdminController =
  module.exports = require("../controllers/admin/location/country");
stateAdminController =
  module.exports = require("../controllers/admin/location/state");
cityAdminController =
  module.exports = require("../controllers/admin/location/city");
districtAdminController =
  module.exports = require("../controllers/admin/location/district");

holidayadmincontroller=module.exports= require("../controllers/admin/holiday/holiday")
groomerleaveadmincontroller= module.exports= require("../controllers/admin/groomer_leave/groomer_leave")
groomerwallethistorycontroller= module.exports= require("../controllers/admin/groomer_wallet_history/groomer_wallet_history")
groomerattendancecontroller= module.exports= require("../controllers/admin/groomer_attendance/groomer_attendance")
admincontactusController= module.exports= require("../controllers/admin/contact_us/contact_us")