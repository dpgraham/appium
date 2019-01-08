import { flags as Flags } from '@oclif/command';
import BaseCommand from '../base-command';

class Install extends BaseCommand {
  async run () {
    const {args, flags} = this.parse(Install);
    const {package: pkg} = args;

    let source;
    if (flags.git) { source = 'git'; }
    if (flags.npm) { source = 'npm'; }
    if (flags.file) { source = 'file'; }

    await this.runCommand('install', [pkg, source], flags);
  }
}

Install.description = `Installs an Appium driver
...
Install an Appium Driver from a list of supported drivers.

Or install an Appium Driver from npm, git or local folder
`;

Install.flags = Object.assign({}, BaseCommand.flags, {
  git: Flags.boolean({description: 'Install an Appium driver from a git repository'}),
  npm: Flags.boolean({description: 'Install an Appium driver from an NPM repository'}),
  file: Flags.boolean({description: 'Install an Appium driver from a local directory'}),
  verbose: Flags.boolean({description: 'Show full logs'}),
});

Install.args = [
  {name: 'package', required: true}
];

export default Install;
