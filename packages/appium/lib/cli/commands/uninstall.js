import { flags as Flags } from '@oclif/command';
import BaseCommand from '../base-command';

class Uninstall extends BaseCommand {
  async run () {
    const {flags} = this.parse(Uninstall);
    if (flags.all) {
      return await this.runCommand('clean', [], flags);
    }
    // TODO: Uninstall individual drivers here
  }
}

Uninstall.description = `Removes all Appium drivers`;

Uninstall.flags = Object.assign({}, BaseCommand.flags, {
  all: Flags.boolean('Uninstall all Appium drivers'),
});

export default Uninstall;
