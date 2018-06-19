const request = require('request-promise');
const { logger } = require('appium-support');
const path = require('path');
const fs = require('fs');

let log = logger.getLogger('Bintray');

(async function () {

  // Bintray info
  // TODO: These should be environment variables
  const BINTRAY_USERNAME = process.env.BINTRAY_USERNAME || "dpgraham";
  const BINTRAY_API_KEY = process.env.BINTRAY_API_KEY;
  const BINTRAY_SUBJECT = process.env.BINTRAY_SUBJECT || 'appium-bintray';
  const BINTRAY_REPO = process.env.BINTRAY_REPO || 'AppiumBuilds';
  const BINTRAY_PACKAGE = process.env.BINTRAY_PACKAGE || 'AppiumBuild';
  const BINTRAY_URL = `https://bintray.com/api/v1`;

  // Version info
  const BUILD_NAME = process.env.TRAVIS_TAG || process.env.TRAVIS_COMMIT || (Math.random() + "");
  const COMMIT_MESSAGE = process.env.TRAVIS_COMMIT_MESSAGE || 'Some message';

  // 1. Create a new 'version' that uses the commit SHA as the name
  log.info(`Creating a new Bintray version: ${BUILD_NAME}`);
  const postVersionUrl = `${BINTRAY_URL}/packages/${BINTRAY_SUBJECT}/${BINTRAY_REPO}/${BINTRAY_PACKAGE}/versions`;
  log.info(`Using Bintray REST API endpoint ${postVersionUrl}`);
  try {
    await request.post(postVersionUrl, {
      body: {
        name: BUILD_NAME,
        desc: COMMIT_MESSAGE,
      },
      json: true,
      auth: {
        user: BINTRAY_USERNAME,
        pass: BINTRAY_API_KEY,
      }
    });
  } catch (e) {
    // 409 means it was created already
    if (e.statusCode !== 409) {
      log.error(`Failed to create new version ${BUILD_NAME}. Reason: ${e.error.message}`);
      process.exit(-1);
    } else {
      log.info(`Version ${BUILD_NAME} was already created. Continuing.`);
    }
  }

  // 2. Upload and publish Appium.zip to Bintray
  log.info(`Uploading 'appium.zip' to bintray at version ${BUILD_NAME}`);
  const uploadZipUrl = `${BINTRAY_URL}/content/${BINTRAY_SUBJECT}/${BINTRAY_REPO}/${BINTRAY_PACKAGE}/${BUILD_NAME}/appium-${BUILD_NAME}.zip?publish=1&override=1`;
  log.info(`Using Bintray REST API upload endpoint ${uploadZipUrl}`);
  try {
    await request.put(uploadZipUrl, {
      formData: {
        file: {
          value: fs.createReadStream(path.resolve(__dirname, '..', 'appium.zip')),
          options: {
            filename: 'appium.zip',
            contentType: 'application/octet-stream',
          },
        },
      },
      auth: {
        user: BINTRAY_USERNAME,
        pass: BINTRAY_API_KEY,
      }
    });
  } catch (e) {
    if (e.statusCode !== 409) {
      log.error(`Skipped upload. Upload is already available`);
    } else {
      log.error(`Failed to publish 'appium.zip' to ${BUILD_NAME}. Reason: ${JSON.stringify(e)}`);
      process.exit(-1);
    }
  }
  log.info(`Done publishing 'appium.zip' to ${BUILD_NAME}`);

})();