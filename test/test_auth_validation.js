var { isEmailValid, isPasswordValid, isFirstNameValid, isLastNameValid, isGenderValid, isPhoneNumberValid, isUniversityValid } = require('../routes/auth');
var { areArraysEqual } = require('../utils/array_helpers');

const expectedResults = [
  ['Email not found'],
  ['Invalid email entered'],
  [],
  ['Password not found'],
  ['That password is too common'],
  [`Password must be at least 6 characters long`],
  [],
  ['First name not found'],
  ['First name uses invalid characters'],
  [],
  ['Last name not found'],
  ['Last name uses invalid characters'],
  [],
  ['Gender not found'],
  [],
  [],
  ['Invalid phone number entered'],
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

  errors = isEmailValid('abc', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
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

  errors = isPasswordValid('abc123', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isPasswordValid('rickygrannisvu', []);
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

  errors = isFirstNameValid('Bob!!!', []);
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

  errors = isLastNameValid('Smith!!!', []);
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

  errors = isPhoneNumberValid('', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isPhoneNumberValid('111-111-1111b', []);
  testResult = areArraysEqual(errors, expectedResults[testNumber]);
  if (!testResult) {
    numErrors++;
  }
  printTestResult(testNumber, testResult, errors, expectedResults[testNumber]);
  testNumber++;

  errors = isPhoneNumberValid('111-111-1111', []);
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
