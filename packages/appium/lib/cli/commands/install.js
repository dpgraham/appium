const {Command} = require('@oclif/command');
const {exec} = require('teen_process');

class Install extends Command {
  async run () {
    const {args} = this.parse(Install);
    this.log(`Installing package "${args.package}"`);

    // TODO: Temporary. This logic needs to be moved to an API
    await exec('npm', ['install', args.package], {cwd: "./appium-drivers"});
  }
}

Install.description = `Describe the command here
...
Extra documentation goes here
`;

Install.flags = {
};

Install.args = [
  {name: 'package', required: true}
];

module.exports = Install;
