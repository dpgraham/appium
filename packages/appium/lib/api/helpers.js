import { fs, logger } from 'appium-support';
import path from 'path';
import { SubProcess } from 'teen_process';
import B from 'bluebird';
import _ from 'lodash';

const helpers = {};

const yarnBinaryPath = path.resolve('node_modules', '.bin', 'yarn');

helpers.execYarn = async function (commandArgs, verbose) {
  return await new B(async (resolve, reject) => {
    const log = helpers.getLogger(verbose);
    const yarnProcess = await new SubProcess(yarnBinaryPath, [...commandArgs, "--production"], {cwd: helpers.appiumDriversPath});
    let output = [];
    let stderr = [];
    yarnProcess.on('output', (stdout, stderr) => {
      if (stdout) {
        output.push(stdout);
        verbose && log.info(stdout);
      } else if (stderr) {
        output.push(stderr);
        verbose && log.error(stderr);
      }
    });
    yarnProcess.on('exit', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(`Could not complete command. An error has occurred: ${stderr.join('')}`);
      }
    });
    await yarnProcess.start();
  });
};

helpers.execYarnJSON = async function (commandArgs) {
  const res = await helpers.execYarn([...commandArgs, '--json'], false);
  return JSON.parse(res.join(''));
};

helpers.checkDriversDirIsReady = async function () {
  if (!await fs.exists(helpers.appiumDriversPath)) {
    await fs.copyFile(helpers.appiumDriversBasePath, helpers.appiumDriversPath);
  }
};

helpers.silentLogger = {
  info: _.noop,
  error: _.noop,
  warn: _.noop,
};

helpers.getLogger = function (verbose) {
  if (verbose) {
    return logger.getLogger('Appium');
  }

  return {
    info: _.noop,
    error: _.noop,
    warn: _.noop,
  };
};

helpers.appiumDriversPath = path.resolve('appium-drivers');
helpers.appiumDriversBasePath = path.resolve('appium-drivers-base');
helpers.driversJsonPath = path.resolve(helpers.appiumDriversPath, 'drivers.json');
helpers.packageJsonPath = path.resolve(helpers.appiumDriversPath, 'package.json');

export default helpers;
