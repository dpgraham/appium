import log from '../logger';

let commands = {}, helpers = {}, extensions = {};

commands.getAttribute = async function (attribute, elementId) {
  return await this.uiautomator2.jwproxy.command(`/element/${elementId}/attribute/${attribute}`, 'GET', {});
};

commands.elementDisplayed = async function (elementId) {
  return await this.getAttribute("displayed", elementId);
};

commands.elementEnabled = async function (elementId) {
  return await this.getAttribute("enabled", elementId);
};

commands.elementSelected = async function (elementId) {
  return await this.getAttribute("selected", elementId);
};

commands.getLocation = async function (elementId) {
  log.info(`calling get location: ${elementId}`);
  return await this.uiautomator2.jwproxy.command(`/element/${elementId}/location`, 'GET', {});
};

commands.getSize = async function (elementId) {
  return await this.uiautomator2.jwproxy.command(`/element/${elementId}/size`, 'GET', {});
};

commands.touchLongClick = async function (elementId, x, y, duration) {
  let params = {elementId, x, y, duration}; 
  return await this.uiautomator2.jwproxy.command(`/touch/longclick`, 'POST', {params});
};

commands.touchDown = async function (elementId, x, y) {
  let params = {elementId, x, y}; 
  return await this.uiautomator2.jwproxy.command(`/touch/down`, 'POST', {params});
};

commands.touchUp = async function (elementId, x, y) {
  let params = {elementId, x, y};  
  return await this.uiautomator2.jwproxy.command(`/touch/up`, 'POST', {params});
};

commands.touchMove = async function (elementId, x, y) {
  let params = {elementId, x, y};  
  return await this.uiautomator2.jwproxy.command(`/touch/move`, 'POST', {params});
};

helpers.doSetElementValue = async function(params){
  return await this.uiautomator2.jwproxy.command(`/element/${params.elementId}/value`, 'POST', params);
};

commands.getText = async function (elementId) {
  return await this.uiautomator2.jwproxy.command(`/element/${elementId}/text`, 'GET', {});
};

commands.click = async function (elementId) {
  return await this.uiautomator2.jwproxy.command(`/element/${elementId}/click`, 'POST', {elementId});
};

commands.tap = async function (elementId, x = 0, y = 0, count = 1) {
  for (let i = 0; i < count; i++) {
    if (elementId) {
      // we are either tapping on the default location of the element
      // or an offset from the top left corner
      let params = {elementId};
      if (x !== 0 || y !== 0) {
        params[x] = x;
        params[y] = y;
      }
      await this.uiautomator2.jwproxy.command(`/element/${elementId}/click`, 'POST', params);
    } else {
      await this.uiautomator2.jwproxy.command(`/appium/tap`, 'POST', {x, y});
    }
  }
};

Object.assign(extensions, commands, helpers);
export { commands, helpers };
export default extensions;
