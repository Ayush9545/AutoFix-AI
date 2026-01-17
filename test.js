const validatePassword = require('./solution.js');

const tests = [
  {
    input: "Password123!",
    expected: true,
    description: "Valid password with all requirements"
  },
  {
    input: "a1!bcdef",
    expected: true,
    description: "Valid password at minimum length (8)"
  },
  {
    input: "a1!bcde",
    expected: false,
    description: "Too short (7 characters)"
  },
  {
    input: "NoSpecial123",
    expected: false,
    description: "Missing special character"
  },
  {
    input: "NoNumber!abc",
    expected: false,
    description: "Missing number"
  },
  {
    input: "12345678!",
    expected: false,
    description: "Missing letter"
  },
  {
    input: "        !",
    expected: false,
    description: "Missing number and letter"
  },
  {
    input: "",
    expected: false,
    description: "Empty string"
  },
  {
    input: null,
    expected: false,
    description: "Null input"
  }
];

tests.forEach(({ input, expected, description }) => {
  const result = validatePassword(input);
  if (result !== expected) {
    throw new Error(
      `Test Failed: ${description}\n` +
      `Input: "${input}"\n` +
      `Expected: ${expected}\n` +
      `Received: ${result}`
    );
  }
});

console.log("All tests passed successfully.");