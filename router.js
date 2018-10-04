import * as btl from './controllers/battle';

const router = (app) => {
    app.post('/api/battle/add', btl.add);
    app.get('/api/battle/list', btl.list);
    app.get('/api/battle/count', btl.count);
    app.get('/api/battle/search', btl.searchBattle);
    app.get('/api/battle/stats', btl.statistics);
};

export default router;