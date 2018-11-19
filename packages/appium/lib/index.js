#!/usr/bin/env node
// transpile:main

module.exports = require('@oclif/command');

import { asyncify } from 'asyncbox';
import path from 'path';
import AppiumBuilder from './server';
import _ from 'lodash';

async function main (args = null) {
  const drivers = require(path.resolve('appium-drivers', 'drivers.json'));
  const builder = new AppiumBuilder();
  for (let [name, packageInfo] of _.toPairs(drivers)) {
    const packageName = packageInfo.package;
    const driver = require(path.resolve('appium-drivers', 'node_modules', packageName)).default;
    builder.withAutomation(name, driver);
  }
  return await builder.run(args);
}

if (require.main === module) {
  asyncify(main);
}

export { main };
