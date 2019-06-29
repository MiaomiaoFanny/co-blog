/* index.js */
const {log, error, table} = console;
log('in index.js');
// require('babel-polyfill')
import { Singleton, getUsefullContens, _map } from './singletom';
log(Singleton());
log(getUsefullContens);
_map();
// log(_map());
// log('sin', sin, typeof sin);