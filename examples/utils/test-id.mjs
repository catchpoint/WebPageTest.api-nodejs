export function readTestIdArgument(command, argument = process.argv[2]) {
  if (!argument || !/^\d+$/.test(argument)) {
    throw new Error(`Pass an existing test ID: npm run ${command} -- <testId>`);
  }
  const testId = Number(argument);
  if (!Number.isSafeInteger(testId) || testId <= 0) {
    throw new Error('The test ID must be a positive safe integer.');
  }
  return testId;
}
