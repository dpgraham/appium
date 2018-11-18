import { fs, logger } from 'appium-support';
import path from 'path';
import { SubProcess } from 'teen_process';
import B from 'bluebird';
import _ from 'lodash';
import supportedDrivers from '../supported-drivers';


const log = logger.getLogger('Appium');


const appiumDriversPath = path.resolve('appium-drivers');
const driversJsonPath = path.resolve(appiumDriversPath, 'drivers.json');

/**
 * Install an Appium Driver
 *
 * @param  {String} driverName The name of the driver to install
 * @param  {String} source Where to install from. If empty, installs from Appium approved drivers list. Can be `npm`, `git` or `file`.
 * @param  {boolean} verbose If true, show complete Appium logs
 */
export async function install (driverName, source, verbose) {
  await checkDriversDirIsReady();
  const installedDrivers = require(driversJsonPath);
  const pkg = getInstallCommand(driverName.toLowerCase(), source);
  installedDrivers[pkg] = pkg;
  await fs.writeFile(driversJsonPath, JSON.stringify(installedDrivers));
  await execYarn(['add', pkg], verbose);
}

async function execYarn (commandArgs, verbose) {
  return await new B(async (resolve, reject) => {
    const yarnProcess = await new SubProcess('yarn', [...commandArgs, "--production"], {cwd: appiumDriversPath});
    verbose && yarnProcess.on('output', (stdout, stderr) => {
      if (stdout) {
        log.info(stdout);
      } else if (stderr) {
        log.error(stderr);
      }
    });
    yarnProcess.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Could not complete command. An error has occurred.`);
      }
    });
    await yarnProcess.start();
  });
}

function getInstallCommand (driverName, source) {
  if (_.isUndefined(source)) {
    const appiumDriver = supportedDrivers[driverName];
    if (!appiumDriver) {
      log.errorAndThrow(`Could not find supported driver: ${driverName}. Supported drivers are: [${_.keys(supportedDrivers).join(', ')}]`);
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
