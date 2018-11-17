import { Command, flags as Flags } from '@oclif/command';
import { install } from '../api';

class Install extends Command {
  async run () {
    const {args, flags} = this.parse(Install);
    const {package: pkg} = args;

    let source;
    if (flags.git) { source = 'git'; }
    if (flags.npm) { source = 'npm'; }
    if (flags.file) { source = 'file'; }

    this.log(`Installing Appium driver: "${pkg}"${source ? ` from source ${source}` : ""}`);
    await install(args.package, source);
    this.log(`Successfully installed Appium Driver: "${args.package}"`);
  }
}

Install.description = `Installs an Appium driver
...
Extra documentation goes here
`;

Install.flags = {
  git: Flags.boolean({description: 'Install an Appium driver from a git repository'}),
  npm: Flags.boolean({description: 'Install an Appium driver from an NPM repository'}),
  file: Flags.boolean({description: 'Install an Appium driver from a local directory'}),
};

Install.args = [
  {name: 'package', required: true}
];

module.exports = Install;
