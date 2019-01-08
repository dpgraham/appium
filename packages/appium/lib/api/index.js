import { fs } from 'appium-support';
import path from 'path';
import helpers from './helpers';
import jsonFormat from 'json-format';

class API {
  constructor ({verbose, logger}) {
    this.verbose = !!verbose;
    this.logger = logger || helpers.silentLogger;
  }

  async execYarn (...args) {
    return await helpers.execYarn.apply(null, [...args, this.verbose]);
  }

  /**
   * Install an Appium Driver
   *
   * @param  {String} driverName The name of the driver to install
   * @param  {String} source Where to install from. If empty, installs from Appium approved drivers list. Can be `npm`, `git` or `file`.
   */
  async install (driverName, source) {
    await helpers.checkDriversDirIsReady();
    const installedDrivers = this.getInstalledDrivers();
    const pkg = helpers.getInstallCommand(driverName.toLowerCase(), source);
    installedDrivers[driverName] = {
      package: pkg,
      source,
    };
    await fs.writeFile(helpers.driversJsonPath, jsonFormat(installedDrivers));
    this.logger.info(`Installing package: ${pkg}`);
    await this.execYarn(['add', pkg]);
  }

  /**
   * Uninstall all Appium drivers
   */
  async clean () {
    this.logger.info(`Removing all drivers`);
    await fs.rimraf(path.resolve(helpers.appiumDriversPath));
    await fs.copyFile(helpers.appiumDriversBasePath, helpers.appiumDriversPath);
    this.logger.info(`Drivers successfully removed`);
  }

  getInstalledDrivers () {
    return require(helpers.driversJsonPath);
  }
}

export default API;
