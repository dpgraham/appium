import BaseCommand from '../base-command';

class Clean extends BaseCommand {
  async run () {
    const {flags} = this.parse(Clean);
    return await this.runCommand('clean', [], flags);
  }
}

Clean.description = `Removes all Appium drivers`;

export default Clean;
