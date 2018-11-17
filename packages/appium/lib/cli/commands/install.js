import { Command } from '@oclif/command';
import { exec } from 'teen_process';
import { fs } from 'appium-support';
import path from 'path';

class Install extends Command {
  async run () {
    const {args} = this.parse(Install);
    const {package: pkg} = args;
    this.log(`Installing package "${pkg}"`);

    // TODO: Temporary. This logic needs to be moved to an API
    const appiumDriversPath = path.resolve('appium-drivers');
    const driversJsonPath = path.resolve(appiumDriversPath, 'drivers.json');
    if (!await fs.exists(driversJsonPath)) {
      await fs.writeFile(driversJsonPath, JSON.stringify({}), "utf8");
    }
    const packageJsonPath = path.resolve(appiumDriversPath, 'package.json');
    if (!await fs.exists()) {
      const packageJsonBase = path.resolve(appiumDriversPath, 'package-base.json');
      await fs.copyFile(packageJsonBase, packageJsonPath);
    }
    const installedDrivers = require(driversJsonPath);
    installedDrivers[pkg] = pkg;
    await fs.writeFile(driversJsonPath, JSON.stringify(installedDrivers));
    await exec('yarn', ['add', args.package, '--production'], {cwd: appiumDriversPath});
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
