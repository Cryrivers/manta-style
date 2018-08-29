import inquirer = require('inquirer');

type Choice<T> = { name: string; value: T };

export function multiSelect<T>(
  title: string,
  options: ReadonlyArray<Choice<T>>,
  selectionDefaults: ReadonlyArray<T>,
): Promise<ReadonlyArray<T>> {
  return inquirer
    .prompt<{ answer: ReadonlyArray<T> }>([
      {
        type: 'checkbox',
        name: 'answer',
        message: title,
        choices: options,
        default: selectionDefaults,
      },
    ])
    .then((answers) => answers.answer);
}
