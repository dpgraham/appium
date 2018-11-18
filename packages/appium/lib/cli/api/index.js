import path from 'path';
import helpers from './helpers';
import { fs } from 'appium-support';

const api = {};

/**
 * Install an Appium Driver
 *
 * @param  {String} driverName The name of the driver to install
 * @param  {String} source Where to install from. If empty, installs from Appium approved drivers list. Can be `npm`, `git` or `file`.
 * @param  {boolean} verbose If true, show complete Appium logs
 */
api.install = async function (driverName, source, verbose) {
  await helpers.checkDriversDirIsReady();
  const installedDrivers = api.getInstalledDrivers();
  const pkg = helpers.getInstallCommand(driverName.toLowerCase(), source);
  installedDrivers[driverName] = {
    package: pkg,
    source,
  };
  await fs.writeFile(helpers.driversJsonPath, JSON.stringify(installedDrivers));
  await helpers.execYarn(['add', pkg], verbose);
};

/**
 * Uninstall all Appium drivers
 */
api.clean = async function (verbose) {
  const log = helpers.getLogger(verbose);
  log.info(`Removing all drivers`);
  await fs.rimraf(path.resolve(helpers.appiumDriversPath));
  await fs.copyFile(helpers.appiumDriversBasePath, helpers.appiumDriversPath);
  log.info(`Drivers successfully removed`);
};

api.getInstalledDrivers = function () {
  return require(helpers.driversJsonPath);
};

export default api;