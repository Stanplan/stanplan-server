from explorecourses import *
from explorecourses import filters
import json

def cleanTitle(title):
    # Remove alternative course code listings
    title = title.split(" (")[0]

    # Replaces double quotes with single quotes (messes up json)
    title = title.replace('"', "'")

    return title

def cleanDescription(description):
    # Replaces double quotes with single quotes (messes up json)
    description = description.replace('"', "'")

    return description

outPath = 'courses.json'
outFile = open(outPath, "w")
outputJSON = json.loads("{}")

connect = CourseConnection()

year = "2018-2019"
for school in connect.get_schools(year):
    for dept in school.departments:
        outputJSON[dept.code] = {}
        courses = connect.get_courses_by_department(dept.code, year=year)
        for course in courses:
            title = cleanTitle(course.title)
            description = cleanDescription(course.description)

            print(dept.code + " " + title)

            outputJSON[dept.code][course.code] = {}
            outputJSON[dept.code][course.code]["title"] = title
            outputJSON[dept.code][course.code]["description"] = description
            outputJSON[dept.code][course.code]["units"] = course.units_max

outFile.write(json.dumps(outputJSON, indent=2, sort_keys=True, ensure_ascii=True))
outFile.close()
