

# Object property 相关API及用法
整理`Object`类关于`property`的 `API`, 总结用法
[示例代码链接](/src/js/property.js)

## Object.defineProperty

定义对象的(新)属性, 并描述其可枚举型, 可配置性, 可读写性, 默认值, getter, setter
常见于插件或库对数据进行监听绑定

对实现数据响应式非常有用. Vue源码中 就有定义getter setter来监听数据变化



### 基本语法

```Object.defineProperty(obj, prop, descriptor) ``` ==> 返回 传入的 obj

```obj``` : 传入的对象

```prop``` : 要定义的属性

```descriptor``` : 描述该属性的对象

​	数据描述符：

​		```value``` 默认```undefined``` 可以是任何有效值

​		```writable``` 默认```false```, 是否能被赋值表达式 = 改变

​	存取描述符：

​		```get(){...}```方法: getter函数 访问属性时执行 未定义set时表示 只可写 不可读

​		```set(val){...}```方法: setter 函数 修改属性时执行， 未定义get时 则表示不可读， 只可写

​	数据描述符&存取描述符：

​		```configurable``` 默认```false``` 是否能被**delete**, 是否能重新描述属性 ```defineProperty``` 

​    	```enumerable``` 默认```false``` 否是可枚举，是否能被```Object.keys``` ```for...in``` 遍历

### 注意：

  1. 数据描述符和存取描述符同时存在会报错， 默认使用数据描述符
	2. ```configurable``` 为```false``` 时除了不能```delete```, 还不能再次使用```defineProperty```定义该属性
 	3. 使用表达式定义的属性默认 ```configurable``` ```enumerable``` ```writable```均为```true```， 也可使用```defineProperty```重新定义



## Object.defineProperties ##

批量定义属性
### 基本语法
```Object.defineProperties(obj, { prop: descriptor, prop2: descriptor2.. ) ``` ==> 返回 传入的 obj



## Object.getOwnPropertyDescriptor ##

获取对象某一自身属性的描述信息对象，若属性不存在, 则返回 `undefined`

 ``` js
> Object.getOwnPropertyDescriptor(obj, 'bar')
{value: "bar", writable: true, enumerable: true, configurable: true}

> Object.getOwnPropertyDescriptor(obj, 'foo3')
{get: ƒ, set: ƒ, enumerable: true, configurable: true}
 ```



## Object.getOwnPropertyDescriptors ##

获取对象所有自身属性描述信息, 包括Symbol

 ``` js
  > Object.getOwnPropertyDescriptors(obj)
 {bar: {…}, bar1: {…}, bar2: {…}, foo1: {…}, foo2: {…}, …}
    bar: {value: "bar", writable: true, enumerable: true, configurable: true}
    bar1: {value: "bar1", writable: false, enumerable: false, configurable: false}
    bar2: {value: undefined, writable: true, enumerable: true, configurable: true}
    foo1: {get: ƒ, set: undefined, enumerable: false, configurable: false}
    foo2: {get: undefined, set: ƒ, enumerable: true, configurable: true}
    foo3: {get: ƒ, set: ƒ, enumerable: true, configurable: true}
    Symbol(a): {value: 333, writable: true, enumerable: true, configurable: true}
    Symbol(b): {value: 444, writable: true, enumerable: true, configurable: true}
 ```



 ## Object.prototype.hasOwnProperty ##

判断属性是否为自身属性
~~~js
> obj.hasOwnProperty('bar')
  true
~~~



## Object.prototype.propertyIsEnumerable

自身属性是否可枚举 是否可以被for...in枚举

```js
> obj.propertyIsEnumerable('bar')
  true
```



## Object.getOwnPropertyNames ##

获取所有自身属性(不包括Symbol值作为名称的属性)
~~~js
> Object.getOwnPropertyNames(obj)
  (6) ["bar", "bar1", "bar2", "foo1", "foo2", "foo3"]
~~~



## Object.getOwnPropertySymbols ##

获取所有Symbol属性 除了Symbol
~~~js
> Object.getOwnPropertySymbols(obj)
  (2) [Symbol(a), Symbol(b)]
~~~



## Object.keys ##

列出所有自身可枚举属性数组
~~~js
> Object.keys(obj) 
  (4) ["bar", "bar2", "foo2", "foo3"]
~~~



## Object.entries ##

列出所有自身可枚举属性的键值对数组
~~~js
> Object.entries(obj)
 (4) [Array(2), Array(2), Array(2), Array(2)]
  0: (2) ["bar", "bar"]
  1: (2) ["bar2", undefined]
  2: (2) ["foo2", undefined]
  3: (2) ["foo3", "foo3"]
  length: 4
~~~



## 示例代码 ##

封装了常用一些工具 `API` 方便快速判断及获取信息 [示例代码链接](/src/js/property.js)
~~~js
function configurable(obj, ...props) {...}
function enumerable(obj, ...props) {...}
function writable(obj, ...props) {...}
function readable(obj, ...props) {...}
function getDescriptor(obj, ...props) {...}
function forInKeys(obj) {...}
~~~


