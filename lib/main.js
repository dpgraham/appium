#!/usr/bin/env node
// transpile:main

import { asyncify } from 'asyncbox';
import { FakeDriver } from 'appium-fake-driver';
import { AndroidDriver } from 'appium-android-driver';
import { IosDriver } from 'appium-ios-driver';
import { AndroidUiautomator2Driver } from 'appium-uiautomator2-driver';
import { SelendroidDriver } from 'appium-selendroid-driver';
import { XCUITestDriver } from 'appium-xcuitest-driver';
import { YouiEngineDriver } from 'appium-youiengine-driver';
import { WindowsDriver } from 'appium-windows-driver';
import { MacDriver } from 'appium-mac-driver';
import { EspressoDriver } from 'appium-espresso-driver';

import AppiumBuilder from 'appium-builder';

async function main (args = null) {
  return await new AppiumBuilder()
    .withAutomation('fake', FakeDriver)
    .withAutomation('xcuitest', XCUITestDriver)
    .withAutomation('android', AndroidDriver)
    .withAutomation('ios', IosDriver)
    .withAutomation('xcuitest', XCUITestDriver)
    .withAutomation('espresso', EspressoDriver)
    .withAutomation('uiautomator2', AndroidUiautomator2Driver)
    .withAutomation('selendroid', SelendroidDriver)
    .withAutomation('windows', WindowsDriver)
    .withAutomation('mac', MacDriver)
    .withAutomation('youi', YouiEngineDriver)
    .run(args);
}

if (require.main === module) {
  asyncify(main);
}

export { main };
