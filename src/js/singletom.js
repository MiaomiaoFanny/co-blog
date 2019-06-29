/* 设计模式 - 单例模式 Singleton pattern Fannia！*/
const {log} = console;
log('in singletom.js');
export const Singleton = () => {
  let nums = Array.from([1,2,3]);
  return nums;
}
export const _map = () => {
  const input = [1, 2]
  log(input.map(item => item + 1));
  return ((x => x * 2)(1))
}
const getJSON = (url, callback) => {
  let xhr = new XMLHttpRequest();
  xhr.onload = () => {
    callback(xhr.responseText);
  };
  xhr.open('GET', url, true);
  xhr.send();
}
export function getUsefullContents(url, callback) {
  getJSON(url, data => callback(JSON.parse(data)));
}
// module.exports = Singleton
