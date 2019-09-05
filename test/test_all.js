var { testAuthValidation } = require('./test_auth_validation');

function test() {
  console.log('Running test_auth_validation');
  let { numTests, numErrors } = testAuthValidation();

  console.log(`${numTests - numErrors} tests passed, ${numErrors} tests failed`)
}

test();
