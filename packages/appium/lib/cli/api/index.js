import { fs } from 'appium-support';
import path from 'path';
import { exec } from 'teen_process';
import _ from 'lodash';
import supportedDrivers from '../supported-drivers';

const appiumDriversPath = path.resolve('appium-drivers');
const driversJsonPath = path.resolve(appiumDriversPath, 'drivers.json');

/**
 * Install an Appium Driver
 *
 * @param  {String} driverName The name of the driver to install
 * @param  {String} source Where to install from. If empty, installs from Appium approved drivers list. Can be `npm`, `git` or `file`.
 */
export async function install (driverName, source) {
  await checkDriversDirIsReady();
  const installedDrivers = require(driversJsonPath);
  const pkg = getInstallCommand(driverName, source);
  installedDrivers[pkg] = pkg;
  await fs.writeFile(driversJsonPath, JSON.stringify(installedDrivers));
  await exec('yarn', ['add', pkg, '--production'], {cwd: appiumDriversPath});
}

function getInstallCommand (driverName, source) {
  if (_.isUndefined(source)) {
    const appiumDriver = supportedDrivers[driverName];
    if (!appiumDriver) {
      throw new Error(`Could not find supported driver: ${driverName}. Supported drivers are: [${_.keys(supportedDrivers).join(', ')}]`);
    }
    return appiumDriver.package;
  } else {
    source = source.toLowerCase();
    if (source === 'git') {
      return `git://${driverName}`;
    } else if (source === 'file') {
      return `file://${driverName}`;
    } else if (source === 'npm') {
      return driverName;
    } else {
      throw new Error(`Unknown source type '${source}'. Supported source types are: [git, file, npm]`);
    }
  }
}

async function checkDriversDirIsReady () {
  if (!await fs.exists(driversJsonPath)) {
    await fs.writeFile(driversJsonPath, JSON.stringify({}), "utf8");
  }
  const packageJsonPath = path.resolve(appiumDriversPath, 'package.json');
  if (!await fs.exists()) {
    const packageJsonBase = path.resolve(appiumDriversPath, 'package-base.json');
    await fs.copyFile(packageJsonBase, packageJsonPath);
  }
}
