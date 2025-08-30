const fs = require('fs');
const path = require('path');
const readline = require('readline');

let projectName = process.argv[2];

async function getProjectName() {
  if (projectName) {
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  projectName = await new Promise(resolve => {
    rl.question('💻 Please enter the project name: ', resolve);
  });

  rl.close();

  if (!projectName) {
    console.error('Project name cannot be empty.');
    process.exit(1);
  }
}

async function main() {
  await getProjectName();

  const packageName = `@web-bench/${projectName}`;

  const projectTemplatePath = path.resolve(__dirname, '../../projects/project-template');
  const newProjectPath = path.resolve(__dirname, '../../projects', projectName);

  if (fs.existsSync(newProjectPath)) {
    console.error(`${newProjectPath} already exists.`);
    process.exit(1);
  }

  console.log(`Creating new project: ${projectName}...`);

  // Copy project template
  fs.cpSync(projectTemplatePath, newProjectPath, { recursive: true });

  // Update package.json
  const packageJsonPath = path.join(newProjectPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.name = packageName;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Update rush.json
  const rushJsonPath = path.resolve(__dirname, '../../rush.json');
  let rushJsonContent = fs.readFileSync(rushJsonPath, 'utf8');


  const newProjectString = `
    {
      "packageName": "${packageName}",
      "projectFolder": "projects/${projectName}"
    },`;

  // Find the index of the target project
  const insertBeforeIdentifier = `
    {
      "packageName": "@web-bench/test-util",
      "projectFolder": "libraries/test-util"
    },`;
  const insertIndex = rushJsonContent.indexOf(insertBeforeIdentifier);

  if (insertIndex === -1) {
    console.error('Rush Json parse error, please check rush.json');
    process.exit(1);
  }

  // insert text in insertIndex
  let newRushJsonContent = rushJsonContent.replace(insertBeforeIdentifier, `${newProjectString}${insertBeforeIdentifier}`);

  fs.writeFileSync(rushJsonPath, newRushJsonContent);

  console.log(`Project ${projectName} created successfully!`);
  console.log(`\n\x1b[1mPlease run "rush update" to install dependencies\x1b[0m\n\n`);

}

main();