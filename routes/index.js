var express = require('express');
var { router: authRouter } = require('./auth');
var router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

router.use('/', require('./scheduler'));
router.use('/', require('./validator'));
router.use('/', authRouter);
router.use('/', require('./post'));
router.use('/', require('./profile'));

module.exports = router;
