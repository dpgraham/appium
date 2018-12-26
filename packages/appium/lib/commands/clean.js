import { Command, flags as Flags } from '@oclif/command';
import api from '../api';

class Clean extends Command {
  async run () {
    const {flags} = this.parse(Clean);
    this.log(`Removing all drivers`);
    await api.clean(flags.verbose);
    this.log(`Successfully removed all drivers`);
  }
}

Clean.description = `Removes all Appium drivers`;

Clean.flags = {
  verbose: Flags.boolean({description: 'Show full logs'}),
};

module.exports = Clean;
