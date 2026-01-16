const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const { exec } = require("child_process");
require("dotenv").config();

const chalk = require("chalk");
const ora = require("ora");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "models/gemini-3-flash-preview"
});

const TASK =
  "Write a Node.js function which has a password has at least 8 characters, one number, and one special character.";

async function runAgent() {
  console.log(chalk.bgBlue.bold("\n AI Coding Agent Started "));
  console.log(chalk.dim(`Task: ${TASK}\n`));
  console.log(chalk.dim("Using model: models/gemini-3-flash-preview\n"));

  const draftSpinner = ora("Generating initial solution...").start();

  let code = await generateSolution(TASK);
  let attempt = 0;
  const maxAttempts = 5;

  draftSpinner.stop();

  while (attempt < maxAttempts) {
    attempt++;
    console.log(chalk.yellow(`\nAttempt ${attempt} of ${maxAttempts}`));

    fs.writeFileSync("solution.js", code);

    const testSpinner = ora("Running...").start();
    const tests = await generateTests(TASK, code);
    fs.writeFileSync("test.js", tests);

    try {
      await runTests();
      testSpinner.succeed(chalk.green("DONE."));
      console.log(chalk.green("\nResult:\n"));
      console.log(code);
      return;
    } catch (err) {
      testSpinner.fail(chalk.red("Failed."));
      console.log(chalk.red(err.message.split("\n")[0]));

      const fixSpinner = ora("Fixing...").start();
      code = await fixSolution(code, err.message);
      fixSpinner.succeed("Update applied.");
    }
  }

  console.log(
    chalk.bgRed.white("\n Failed attempts. ")
  );
}

async function generateSolution(task) {
  const prompt = `
Write a Node.js module that solves the following task:

"${task}"

Output only valid JavaScript code.
`;

  const result = await model.generateContent(prompt);
  return clean(result.response.text());
}

async function generateTests(task, solutionCode) {
  const prompt = `
The following code exists in 'solution.js':

${solutionCode}

Write a Node.js test script that:
- Imports the function from './solution.js'
- Tests normal and edge cases for: "${task}"
- Throws an Error if any test fails

Output only valid JavaScript code.
`;

  const result = await model.generateContent(prompt);
  return clean(result.response.text());
}

async function fixSolution(brokenCode, errorMessage) {
  const prompt = `
The following code has a bug:

${brokenCode}

error message:
${errorMessage}

return the corrected JavaScript code.
`;

  const result = await model.generateContent(prompt);
  return clean(result.response.text());
}

function runTests() {
  return new Promise((resolve, reject) => {
    exec("node test.js", (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) return reject(new Error(stderr));
      resolve(stdout);
    });
  });
}

function clean(text) {
  return text.replace(/```javascript/g, "").replace(/```/g, "").trim();
}

runAgent();
