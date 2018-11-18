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
    try {
      await install(args.package, source, flags.verbose);
      this.log(`Successfully installed Appium Driver: "${args.package}"`);
    } catch (e) {
      if (!flags.verbose) {
        this.log(`For more detailed logs, add the --verbose flag`);
      }
      this.error(e);
    }
  }
}

Install.description = `Installs an Appium driver
...
Install an Appium Driver from a list of supported drivers.

Or install an Appium Driver from npm, git or local folder
`;

Install.flags = {
  git: Flags.boolean({description: 'Install an Appium driver from a git repository'}),
  npm: Flags.boolean({description: 'Install an Appium driver from an NPM repository'}),
  file: Flags.boolean({description: 'Install an Appium driver from a local directory'}),
  verbose: Flags.boolean({description: 'Show full logs'}),
};

Install.args = [
  {name: 'package', required: true}
];

module.exports = Install;
