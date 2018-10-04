'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// MongoDB
var mongodbUri = 'mongodb://@ds121373.mlab.com:21373/battle_db';
_mongoose2.default.connect(mongodbUri, {
    useMongoClient: true,
    auth: {
        user: 'battle_kk',
        password: 'b123456'
    }
});
_mongoose2.default.set('debug', true);
// Server config
app.set('port', 8001);
app.use((0, _compression2.default)());
app.use((0, _cors2.default)()); // Para hacer white list 
app.use(_bodyParser2.default.json({ type: '*/*' }));
// Sessions
app.set('trust proxy', 1); // trust first proxy
app.use((0, _expressSession2.default)({
    secret: 'SoyUnaClavejijij',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1800000 // Enable if is https maxAge: 30min
    } }));

(0, _router2.default)(app);

var server = _http2.default.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Server is up and listening at http://localhost:%s', app.get('port'));
});