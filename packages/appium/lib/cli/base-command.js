import { Command, flags as Flags } from '@oclif/command';
import api from '../api';

class BaseCommand extends Command {
  async runCommand (commandName, commandArgs, flags) {
    // TODO: Handle the 'verbose' case here
    const res = await api[commandName].apply(null, commandArgs);
    if (flags.json) {
      return res;
    }
  }
}

BaseCommand.description = `Removes all Appium drivers`;

BaseCommand.flags = {
  verbose: Flags.boolean({description: 'Show full logs'}),
};

export default BaseCommand;
