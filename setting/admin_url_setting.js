/*
 *	SERVER DEFAULT URL
 * 	--- START ----
 **/

adminUrlHandler = module.exports = require("./admin/login_url");
adminUrlHandler.BindUrl();

dashboardUrlHandler = module.exports = require("./admin/dashboard_url");
dashboardUrlHandler.BindUrl();

userUrlHandler = module.exports = require("./admin/user/user_url");
userUrlHandler.BindUrl();

countryUrlHandler = module.exports = require("./admin/location/country_url");
countryUrlHandler.BindUrl();

stateUrlHandler = module.exports = require("./admin/location/state_url");
stateUrlHandler.BindUrl();

cityUrlHandler = module.exports = require("./admin/location/city_url");
cityUrlHandler.BindUrl();

districtUrlHandler = module.exports = require("./admin/location/district_url");
districtUrlHandler.BindUrl();

addOnsUrlHandler = module.exports = require("./admin/addons/addons_url");
addOnsUrlHandler.BindUrl();

groomer_productsUrlHandler =
  module.exports = require("./admin/groomer_products/groomer_products_url");
groomer_productsUrlHandler.BindUrl();

groomer_tool_req_UrlHandler =
  module.exports = require("./admin/groomer_tool_req/groomer_tool_req_url");
groomer_tool_req_UrlHandler.BindUrl();

packagesUrlHandler = module.exports = require("./admin/packages/packages_url");
packagesUrlHandler.BindUrl();

// producthandler = module.exports = require("./admin/products/product_url");
// producthandler.BindUrl();


admincategoryhandler = module.exports = require('./admin/holiday/holiday_url');
admincategoryhandler.BindUrl();

servicecategoryhandler = module.exports = require('./admin/service_category/service_category_url');
servicecategoryhandler.BindUrl();

groomershandler= module.exports=require('./admin/groomers/groomers_url')
groomershandler.BindUrl();


groomerleavehandler= module.exports=require('./admin/groomer_leave/groomer_leave_url')
groomerleavehandler.BindUrl();


groomerwallethistoryhandler= module.exports=require('./admin/grommer_wallet_history/groomer_wallet_history_url')
groomerwallethistoryhandler.BindUrl();

groomerattendancehandler= module.exports=require('./admin/groomer_attendance/groomer_attendance_url')
groomerattendancehandler.BindUrl();

contactushandler=module.exports= require("./admin/contact_us/contact_us_url")
contactushandler.BindUrl();

/*
 *	SERVER DEFAULT URL
 * 	--- END ----
 **/
