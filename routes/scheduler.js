var express = require('express');
var fs = require('fs');
var router = express.Router();
var courses = require('../data/courses.json');
var path = require('path');
var { PythonShell } = require('python-shell');

function updateJsonCourseData(json) {
  for (let i = 0; i < json.length; i++) {
    for (let j = 0; j < json[i].section.length; j++) {
      for (let k = 0; k < json[i].section[j].subsection.length; k++) {
        let id = json[i].section[j].subsection[k].id;
        let departmentCode = id.split(" ")[0];
        let courseCode = id.split(" ")[1];
        let course = courses[departmentCode][courseCode];
        json[i].section[j].subsection[k].title = course.title;
        json[i].section[j].subsection[k].description = course.description;
        json[i].section[j].subsection[k].units = course.units;
      }
    }
  }
  return json;
}

router.post('/scheduler', (req, res) => {
  let classesAndPrefsJson = req.body;
  if (classesAndPrefsJson == null) {
    res.status(400).json({ error: 'Classes not found' });
  }
  console.log(classesAndPrefsJson);

  fs.writeFileSync(path.resolve('..') + '/server/scheduler/input.json', JSON.stringify(classesAndPrefsJson));

  // Runs scheduler in a Python shell
  // ----------------------------------
  let options = {
    pythonOptions: ['-u'], // get print results in real-time
    pythonPath: 'python3',
    scriptPath: path.resolve('..') + '/server/scheduler',
    args: ['-userInput', 'input.json']
  };

  PythonShell.run('run_sched.py', options, function (err, results) {
    if (err) throw err;
    //console.log("Results: " + results);
    console.log("Successfully created four-year schedule");

    delete require.cache[require.resolve('../scheduler/output.json')];
    let fourYearPlan = require('../scheduler/output.json');
    res.status(200).json({ plan: fourYearPlan });
  });
});

router.get('/courseoptions', async (req, res) => {
  let major = req.query.major;
  let track = req.query.track;

  if (major === "" || track === "") {
    return res.status(400).json({ error: 'Major / track not found' });
  }

  console.log(major + " : " + track);

  let generalEdRequirements = require('../data/generaled.json');
  let generalRequirements = require('../data/majors/' + major + '/general.json');
  //let trackRequirements = require('../data/majors/cs/test_blank.json');
  let trackRequirements = require('../data/majors/' + major  + '/' + track + '.json');
  generalEdRequirements = updateJsonCourseData(generalEdRequirements);
  generalRequirements = updateJsonCourseData(generalRequirements);
  trackRequirements = updateJsonCourseData(trackRequirements);

  res.status(200).json({ generalEdReqs: generalEdRequirements, generalReqs: generalRequirements, trackReqs: trackRequirements });
});

module.exports = router;
