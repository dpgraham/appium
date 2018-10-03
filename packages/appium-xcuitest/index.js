#!/usr/bin/env node
// transpile:main

import { asyncify } from 'asyncbox';
import { XCUITestDriver } from 'appium-xcuitest-driver';

import AppiumBuilder from 'appium-builder';

async function main (args = null) {
  return await new AppiumBuilder()
    .withAutomation('xcuitest', XCUITestDriver)
    .run(args);
}

if (require.main === module) {
  asyncify(main);
}

export { main };
