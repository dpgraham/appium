import { fs } from 'appium-support';
import path from 'path';
import helpers from './helpers';
import jsonFormat from 'json-format';
import supportedDrivers from '../supported-drivers';
import _ from 'lodash';

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
    driverName = driverName.toLowerCase();

    let npmInstallationCommand;
    if (_.isUndefined(source)) {
      const appiumDriver = supportedDrivers[driverName];
      if (!appiumDriver) {
        this.errorAndThrow(`Could not find driver '${driverName}' in the registry. Supported drivers are: [${_.keys(supportedDrivers).join(', ')}]`);
      }
      npmInstallationCommand = appiumDriver.package;
      this.logger.info(`Found driver '${appiumDriver.package}'`);
    } else {
      source = source.toLowerCase();
      if (source === 'git') {
        npmInstallationCommand = `git://${driverName}`;
      } else if (source === 'file') {
        npmInstallationCommand = `file://${driverName}`;
      } else if (source === 'npm') {
        npmInstallationCommand = driverName;
      } else {
        this.errorAndThrow(`Unknown source type '${source}'. Supported source types are: [git, file, npm]`);
      }
    }

    this.logger.info(`Installing '${npmInstallationCommand}' via npm`);
    await this.execYarn(['add', npmInstallationCommand]);
    const installedDrivers = this.getInstalledDrivers();
    installedDrivers[driverName] = {
      package: npmInstallationCommand,
      source,
    };
    await fs.writeFile(helpers.driversJsonPath, jsonFormat(installedDrivers));
    this.logger.info(`Installation successful. '${driverName}' is now available via automationName '${driverName}`);
  }

  /**
   * Uninstall all Appium drivers
   */
  async clean () {
    this.logger.info(`Uninstalling all drivers`);
    await fs.rimraf(path.resolve(helpers.appiumDriversPath));
    await fs.copyFile(helpers.appiumDriversBasePath, helpers.appiumDriversPath);
    this.logger.info(`All drivers are uninstalled`);
  }

  errorAndThrow (message) {
    this.logger.error(message);
    throw new Error(message);
  }

  getInstalledDrivers () {
    return require(helpers.driversJsonPath);
  }
}

export default API;
