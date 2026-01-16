const validatePassword = require('./solution.js');

const tests = [
  {
    input: "Password123!",
    expected: true,
    description: "Valid password with all criteria"
  },
  {
    input: "A1!45678",
    expected: true,
    description: "Valid password at exactly 8 characters"
  },
  {
    input: "Short1!",
    expected: false,
    description: "Invalid: Less than 8 characters"
  },
  {
    input: "NoSpecialChar123",
    expected: false,
    description: "Invalid: Missing special character"
  },
  {
    input: "NoNumbers!",
    expected: false,
    description: "Invalid: Missing numbers"
  },
  {
    input: "12345678!",
    expected: false,
    description: "Invalid: Missing letters"
  },
  {
    input: "",
    expected: false,
    description: "Invalid: Empty string"
  },
  {
    input: null,
    expected: false,
    description: "Invalid: Null input"
  },
  {
    input: 12345678,
    expected: false,
    description: "Invalid: Non-string input"
  }
];

tests.forEach(({ input, expected, description }) => {
  const result = validatePassword(input);
  if (result !== expected) {
    throw new Error(
      `Test failed: ${description}\n` +
      `Input: ${input}\n` +
      `Expected: ${expected}\n` +
      `Actual: ${result}`
    );
  }
});

console.log("All tests passed successfully.");