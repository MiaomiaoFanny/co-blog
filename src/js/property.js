const {log} = console
log('[*** property ***]')
const propertyFunctionArray = {
    'Object.defineProperties': '批量定义属性',
    'Object.defineProperty': '定义对象的(新)属性, 并描述其可枚举型, 可配置性, 可读写性, 默认值, getter, setter',
    'Object.getOwnPropertyDescriptor': '获取对象某一自身属性的描述信息 configurable enumerable writable value / get set',
    'Object.getOwnPropertyDescriptors': '获取对象所有自身属性描述信息, 包括Symbol',
    'Object.prototype.hasOwnProperty': '判断属性是否为自身属性',
    'Object.prototype.propertyIsEnumerable': '自身属性是否可枚举 是否可以被for...in枚举',
    'Object.getOwnPropertySymbols': '获取所有Symbol属性',
    'Object.getOwnPropertyNames': '获取所有自身属性(不包括Symbol值作为名称的属性)',
    'Object.keys(obj)': '列出所有自身可枚举属性数组',
    'Object.entries(obj)': '列出所有自身可枚举属性的键值对数组',
}

/**
 * 属性是否可配置, 是否可delete
 *
 * @param {Object} obj 要检查其属性的对象
 * @param {String} props 需要检查的属性 
 * @returns Boolean 类型的数组
 */
function configurable(obj, ...props) {
  return props.map(prop => {
    let isConfigurable = false
    if('safe') {
      let descriptor = Object.getOwnPropertyDescriptor(obj, prop)
      isConfigurable = descriptor ? descriptor.configurable : true
    } else {
      // 以下代码通过实际操作进行验证, 可能会修改属性 因此不可取
      try {
        Object.defineProperty(obj, prop, { configurable: true })
        // delete obj[prop]
        isConfigurable = true
      } catch (e) {
        // log('!!!!!! Error', e)
      }
    }
    log(`[configurable] of (${prop}) : ${isConfigurable}`)
    return isConfigurable
  })
}

/**
 * 属性是否可枚举, 是否可被 Object.keys for...in 取出
 *
 * @param {Object} obj 要检查其属性的对象
 * @param {String} props 需要检查的属性 
 * @returns Boolean 类型的数组
 */
function enumerable(obj, ...props) {
    return props.map(prop => {
      let isEnumerable = false
      let descriptor = Object.getOwnPropertyDescriptor(obj, prop)
      isEnumerable = descriptor ? descriptor.enumerable : true// 从描述符中判断
      isEnumerable = obj.propertyIsEnumerable(prop) // 使用原生API查看
      log(`[enumerable] of (${prop}) : ${isEnumerable}`)
      return isEnumerable
    })
}

/**
 * 属性是否可修改
 *
 * @param {Object} obj 要检查其属性的对象
 * @param {String} props 需要检查的属性 
 * @returns Boolean 类型的数组
 */
function writable(obj, ...props) {
  return props.map(prop => {
      if(!obj.hasOwnProperty(prop)) {
        return true
      }
      let isWritable = false
      if('safe') {
        let descriptor = Object.getOwnPropertyDescriptor(obj, prop)
        isWritable = descriptor ? !!(descriptor.writable || descriptor.set) : true
      } else {
        // 以下代码通过实际操作进行验证, 可能会修改属性 因此不可取
        try {
          obj[prop] = obj[prop]
          isWritable = true
        } catch (e) {
          //  log('!!!!!! Error', e)
        }
      }
      log(`[writable] of (${prop}) : ${isWritable}`)
      return isWritable
  })
}

/**
 * 属性是否可读
 *
 * @param {Object} obj 要检查其属性的对象
 * @param {String} props 需要检查的属性 
 * @returns Boolean 类型的数组
 */
function readable(obj, ...props) {
  return props.map(prop => {
    if (!obj.hasOwnProperty(prop)) {
      return true
    }
    let isReadable = false
    let descriptor = Object.getOwnPropertyDescriptor(obj, prop)
    if(descriptor) {
      if ( descriptor.get || descriptor.set ) {
        isReadable = !!descriptor.get
      } else {
        isReadable = true
      }
    } else {
      isReadable = true
    }
    log(`[readable] of (${prop}) : ${isReadable}`)
    return isReadable
  })
}

function getDescriptor(obj, ...props) {
  if(props.length == 0) {
    return Object.getOwnPropertyDescriptors(obj)
  }
  let desc = {}
  props.map(prop => {
    desc[prop] = Object.getOwnPropertyDescriptor(obj, prop)
  })
  return desc
}
function forInKeys(obj) {
  let keys = []
  for (let k in obj) {
    keys.push(k)
  }
  log('[forInKeys] of ', obj, ':', keys);
  return keys;
}
function myObject() {
  let fooValue = 'foo1',
    fooValue3 = 'foo3'
  this.bar = 'bar'
  Object.defineProperty(this, 'bar1', {
    value: 'bar1'
  })
  Object.defineProperty(this, 'bar2', {
    writable: true,
    configurable: true,
    enumerable: true
  })
  Object.defineProperty(this, 'foo1', {
    get() {
      log('foo1 getter', fooValue)
      return fooValue
    },
  })
  Object.defineProperty(this, 'foo2', {
    set(newV) {
      log('foo2 setter >', newV)
      fooValue = newV
    },
    configurable: true,
    enumerable: true
  })
  Object.defineProperty(this, 'foo3', {
    get() {
      log('foo3 getter', fooValue3)
      return fooValue3
    },
    set(newV) {
      log('foo3 setter >', newV)
      fooValue3 = newV
    },
    configurable: true,
    enumerable: true
  })
}

function myObject2() {
  let fooValue = 'foo1',
    fooValue3 = 'foo3'
  this.bar = 'bar'
  Object.defineProperties(this, {
    bar1: {
      value: 'bar1'
    },
    bar2: {
      writable: true,
      configurable: true,
      enumerable: true
    },
    foo1: {
      get() {
        log('foo1 getter', fooValue)
        return fooValue
      }
    },
    foo2: {
      set(newV) {
        log('foo2 setter >', newV)
        fooValue = newV
      },
      configurable: true,
      enumerable: true
    },
    foo3: {
      get() {
        log('foo3 getter', fooValue3)
        return fooValue3
      },
      set(newV) {
        log('foo3 setter >', newV)
        fooValue3 = newV
      },
      configurable: true,
      enumerable: true
    }
  })
}
window.obj = new myObject2()
log('obj:', obj)

log('[ configurable ]', configurable(obj, 'bar', 'bar1', 'bar2', 'foo1', 'foo2', 'foo3'))
log('[ enumerable ]', enumerable(obj, 'bar', 'bar1', 'bar2', 'foo1', 'foo2', 'foo3'))
log('[ writable ]', writable(obj, 'bar', 'bar1', 'bar2', 'foo1', 'foo2', 'foo3'))
log('[ readable ]', readable(obj, 'bar', 'bar1', 'bar2', 'foo1', 'foo2', 'foo3'))
log('[ getDescriptor ]', getDescriptor(obj, 'bar', 'bar1', 'bar2', 'foo1', 'foo2', 'foo3'))


let b = Symbol('b')
obj[Symbol('a')] = 333
obj[b] = 444
log('Object.getOwnPropertyNames(obj): ', Object.getOwnPropertyNames(obj))
log('Object.getOwnPropertySymbols(obj): ', Object.getOwnPropertySymbols(obj))
log('Value of Symbol(a): ', obj[Object.getOwnPropertySymbols(obj)[0]])
log('Value of Symbol(b): ', obj[b])
log('forInKeys(obj): ', forInKeys(obj))
log('Object.keys(obj): ', Object.keys(obj))
log('Object.entries(obj): ', Object.entries(obj))
log('obj:', obj)
module.exports = {}