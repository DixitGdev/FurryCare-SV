//include all module which require global
fs = require("fs");
express = require('express');
bodyParser = require('body-parser');
path = require('path');
app = module.exports = express();
http = module.exports = require('http').Server(app);
request = module.exports = require('request');
mongoose = module.exports = require('mongoose');
multer = module.exports = require('multer');
_ = module.exports = require('underscore');
cors = module.exports = require("cors");
jwt = module.exports = require('jsonwebtoken');
md5 = module.exports = require('md5');
cookieParser = module.exports = require('cookie-parser');
session = module.exports = require('express-session');
pagination = module.exports = require('pagination');
var FCM = require('fcm-node');
nodemailer = module.exports = require('nodemailer');

require("dotenv").config();
app.use(cors());

//include all module which require locally
var format = require('util').format;

const CONFIG_NAME = process.env.CONFIG_NAME || 'config.json';
const PORT = process.env.PORT || 3000;
SECRET_KEY = module.exports = process.env.SECRET_KEY || 'A3(B$s5D@BSHDad4SHLLEI*#&JD#JSJ';
serverKeyFcm = module.exports = process.env.SERVER_KEY_FCM || 'AAAAAx3mXl4:APA91bGTpu5iBKiRhKHF_Ds1xIN-UgjfUpNiJx9DPUJcstxiYkTQJLvOTy0acJu-4YMiu5XYrAmES_v1NuvZS1G2mTEoQE144cOUaj66QoJSGi8WVH9FO8T38_SVidtnPM-YLZRGRlJs';

var fcm = module.exports = new FCM(serverKeyFcm);

console.log("SERVER_START >> ", PORT);

app.use(cookieParser());
app.use(session({secret: SECRET_KEY, cookie: { maxAge: 24 * 60 * 60 * 1000 } }));

//set ejs in to html page 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//for set url 
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

config = module.exports = JSON.parse(fs.readFileSync(CONFIG_NAME));
config . document_root = __dirname;

//clients for socket store
clients = module.exports = {};

http.listen(PORT);
io = module.exports = require('socket.io')(http);

//var MONGO_URL = config.MONGO_URL;
mongoose.set('strictQuery', false);
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URL)
mongoose.pluralize(null);


console.log(process.env.MONGO_URL);

ObjectId = module.exports = mongoose.mongo.ObjectId;

//all url settings
require('./setting/url_setting.js');

//all controller settings
require('./setting/controllers_setting.js');

//socket setting
require('./setting/socket.js');

//admin all url settings
require('./setting/admin_url_setting.js');

//admin all controller settings
require('./setting/admin_controllers_setting.js');

//web all url settings
require('./setting/web_url_setting.js');

//run schedule script
require('./setting/schedule.js');
