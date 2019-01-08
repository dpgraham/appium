import { Command, flags as Flags } from '@oclif/command';
import AppiumAPI from '../api';

class BaseCommand extends Command {
  async runCommand (commandName, commandArgs, flags) {
    const oclifLogger = {
      info: this.log,
      error: this.error,
      warn: this.warn,
    };
    const api = new AppiumAPI({
      verbose: flags.verbose,
      logger: oclifLogger,
    });
    // TODO: Add mutex before and after this to prevent clashes
    const res = await api[commandName].apply(api, commandArgs);
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
