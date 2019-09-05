var express = require('express');
var readline = require('readline');
var fs = require('fs');
var router = express.Router();
var path = require('path');

router.get('/validator', async (req, res) => {
  let department = req.query.department;
  let code = req.query.code;

  if (department === "" || code === "") {
    return res.status(400).json({ error: 'Course not found' });
  }

  var lineReader = readline.createInterface({
    input: fs.createReadStream(path.resolve('..') + '/server/scheduler/Data/fullGoldDB.db')
  });

  let validated = false;

  lineReader.on('line', (line) => {
    var elements = line.split(' ');
    if (department === elements[0] && code === elements[1]) {
      validated = true;
    }
  }).on('close', () => {
    return res.status(200).json({ validated: validated });
  });
});

module.exports = router;
