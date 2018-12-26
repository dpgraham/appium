#!/usr/bin/env node
// transpile:main

import { asyncify } from 'asyncbox';
// import { AndroidUiautomator2Driver } from 'appium-uiautomator2-driver';
// import { XCUITestDriver } from 'appium-xcuitest-driver';

import AppiumBuilder from 'appium-builder';

async function main (args = null) {
  return await new AppiumBuilder()
    //.withAutomation('uiautomator2', AndroidUiautomator2Driver)
    //.withAutomation('xcuitest', XCUITestDriver)
    .run(args);
}

if (require.main === module) {
  asyncify(main);
}

export { main };
