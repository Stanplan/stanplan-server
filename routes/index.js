var express = require('express');
var router = express.Router();
var { authRouter: router } = require('./auth');

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

router.use('/', require('./scheduler'));
router.use('/', require('./validator'));
router.use('/', authRouter);
router.use('/', require('./post'));

module.exports = router;
