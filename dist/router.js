'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _battle = require('./controllers/battle');

var btl = _interopRequireWildcard(_battle);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = function router(app) {
    app.post('/api/battle/add', btl.add);
    app.get('/api/battle/list', btl.list);
    app.get('/api/battle/count', btl.count);
    app.get('/api/battle/search', btl.searchBattle);
    app.get('/api/battle/stats', btl.statistics);
    // app.get('/api/battle', btl.user);
};

exports.default = router;