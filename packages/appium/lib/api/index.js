import { fs } from 'appium-support';
import path from 'path';
import helpers from './helpers';
import jsonFormat from 'json-format';
import supportedDrivers from '../supported-drivers';
import _ from 'lodash';

class API {
  constructor (opts = {}) {
    const {verbose, logger} = opts;
    this.verbose = !!verbose;
    this.logger = logger || helpers.silentLogger;
  }

  async execYarn (...args) {
    return await helpers.execYarn.apply(null, [...args, this.verbose]);
  }

  async install (driver, source) {
    await helpers.checkDriversDirIsReady();

    let npmInstallationCommand, packageName, automationName, version;

    if (_.isUndefined(source)) {
      // Get package name and version
      const info = driver.split('@');
      const driverName = info[0];
      version = info[1];

      // Look for the driver in our supported drivers registry
      const appiumDriver = supportedDrivers[driverName];
      if (!appiumDriver) {
        this.errorAndThrow(`Could not find driver '${driver}' in the registry. Supported drivers are: [${_.keys(supportedDrivers).join(', ')}]`);
      }

      // Meta-data about driver
      automationName = driverName;
      packageName = appiumDriver.package;

      // Get the latest version if none provided
      const res = await helpers.execYarnJSON(['info', packageName, 'versions']);
      const versions = res.data;
      let latestVersion = versions[versions.length - 1];

      if (version) {
        if (!versions.includes(version)) {
          this.errorAndThrow(`Could not install driver '${driver}'. No such version '${version}'.`);
        }
        this.logger.info(`Found driver '${driver}' at version ${version} (latest version is ${latestVersion}) `);
      } else {
        this.logger.info(`Found driver '${driver}, latest version ${latestVersion}'`);
      }
      version = version || latestVersion;

      npmInstallationCommand = `${packageName}@${version}`;
    }

    // Now install the package from NPM
    this.logger.info(`Installing '${npmInstallationCommand}' via npm`);
    await this.execYarn(['add', npmInstallationCommand]);

    // Save this to our list of installed drivers
    const installedDrivers = this.getInstalledDrivers();
    let info = {
      packageName,
      source,
      version,
    };
    installedDrivers[automationName] = info;
    await fs.writeFile(helpers.driversJsonPath, jsonFormat(installedDrivers));

    // Log that it was successful and exit
    this.logger.info(`Installation successful. '${driver}' is now available via automationName '${automationName}'`);
    return info;
  }

  /**
   * Install an Appium Driver
   *
   * @param  {String} driverName The name of the driver to install
   * @param  {String} source Where to install from. If empty, installs from Appium approved drivers list. Can be `npm`, `git` or `file`.
   */
  async installBak (driverName, source) {
    await helpers.checkDriversDirIsReady();

    let npmInstallationCommand;
    let automationName = 'unknown';
    let version;

    if (_.isUndefined(source)) {
      // By default, look for driver in our supported drivers registry
      const appiumDriver = supportedDrivers[driverName];
      if (!appiumDriver) {
        this.errorAndThrow(`Could not find driver '${driverName}' in the registry. Supported drivers are: [${_.keys(supportedDrivers).join(', ')}]`);
      }
      npmInstallationCommand = appiumDriver.package;
      automationName = driverName;

      const res = await helpers.execYarnJSON(['info', npmInstallationCommand]);
      version = res.data.version;

      this.logger.info(`Found driver '${appiumDriver.package}'`);
    } else {
      source = source.toLowerCase();
      if (source === 'git') {
        // Install as git package repository
        npmInstallationCommand = `git://${driverName}`;
        // TODO: Have it download the package.json and read the contents so we can save the automationName
      } else if (source === 'file') {
        // Install as local NPM package
        if (!await fs.exists(path.resolve(driverName, 'package.json'))) {
          this.errorAndThrow(`Could not find npm package at local path '${driverName}'`);
        }
        npmInstallationCommand = `file://${driverName}`;
        const pkgJSON = require(path.resolve(path.resolve(driverName, 'package.json')));
        automationName = pkgJSON.name;
        version = pkgJSON.version;
      } else if (source === 'npm') {
        // Install as NPM package
        try {
          npmInstallationCommand = driverName;

          // Get info about the package before installing it
          const res = await helpers.execYarnJSON(['info', npmInstallationCommand]);
          automationName = res.data.name;
          version = res.data.version;
        } catch (e) {
          this.logger.error(e.message);
          this.errorAndThrow(`Could not find npm package '${driverName}'`);
        }
      } else {
        this.errorAndThrow(`Unknown source type '${source}'. Supported source types are: [git, file, npm]`);
      }
    }

    // Install the package
    this.logger.info(`Installing '${npmInstallationCommand}' via npm`);
    await this.execYarn(['add', npmInstallationCommand]);

    // Save this to our list of installed drivers
    const installedDrivers = this.getInstalledDrivers();
    installedDrivers[automationName] = {
      packageName: npmInstallationCommand,
      source,
      version,
    };
    await fs.writeFile(helpers.driversJsonPath, jsonFormat(installedDrivers));

    // Log that it was successful and exit
    this.logger.info(`Installation successful. '${driverName}' is now available via automationName '${automationName}'`);
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
