var { isEmailValid, isPasswordValid, isFirstNameValid, isLastNameValid, isGenderValid, isUniversityValid } = require('../routes/auth');
var { areArraysEqual } = require('../utils/array_helpers');

const expectedResults = [
  ['Email not found'],
  [],
  ['Password not found'],
  [`Password must be at least 6 characters long`],
  [],
  ['First name not found'],
  [],
  ['Last name not found'],
  [],
  ['Gender not found'],
  [],
  ['University not found'],
  []
];

function testAuthValidation() {
  let testNumber = 0;
  let numErrors = 0;

  let errors = isEmailValid('', []);
  let testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isEmailValid('test@gmail.com', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isPasswordValid('', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isPasswordValid('abcde', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isPasswordValid('abcdef', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isFirstNameValid('', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isFirstNameValid('Bob', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isLastNameValid('', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isLastNameValid('Smith', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isGenderValid('', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isGenderValid('Male', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isUniversityValid('', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isUniversityValid('Stanford University', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  return { numTests: testNumber, numErrors };
}

function printTestResult(testNumber, testResult, generated, expected) {
  if (testResult) {
    console.log(`Test ${testNumber} passed`);
  } else {
    console.error(`Test ${testNumber} failed\n
      Generated: ${generated}\n
      Expected: ${expected}`);
  }
}

module.exports = { testAuthValidation };
