const router = require('express').Router();
const bookRoutes = require('./api/bookRoutes.js');


const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/books', bookRoutes);

module.exports = router;
