参考
https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises
http://es6.ruanyifeng.com/#docs/promise

# Promises #
	是一种编写异步代码的方法。
##Promise 对象##
	用于表示一个异步操作的最终状态（完成或失败），以及该异步操作的结果值。
##Promise 使用 ##
	Promise适用于这样的场景，后面的操作必须根据前面的操作的结果做出相应的反应。 那么后面的操作必须等前面的操作完成并且获得前面操作的结果。

	假设我们现在有三个操作doSomethingFirst，doSomethingSecond 和finalHandler。
	doSomethingSecond 需要根据 doSomethingFirst 的结果做出反应
	finalHandler 需要根据 doSomethingSecond 的结果做出反应
	流程如下：

	//resOfDoSomethingFirst 是 DoSomethingFirst的结果
	  doSomethingFirst
	|-----------------|
	  doSomethingSecond(resOfDoSomethingFirst)
	  |------------------|
	 finalHandler(doSomethingSecond的结果)
	 |------------------|
	实现这个场景需要解决以下两个问题：
		后面的操作 如何知道 前面的操作 完成了
		后面的操作 如何知道 前面的操作 的执行结果是什么
	
	//包装第一个操作在 doSomethingFirst 中
	const doSomethingFirst = new Promise(function(resolve, reject) {
	  // ... some code
	
	  if (/*操作成功 */){
	resolve(doSomethingFirstValue);	 //将doSomethingFirst对象的状态从“pending”变为“resolved”
	  } else {
	reject(doSomethingFirstError);
	  }
	});

	//包装第二个操作在 
	doSdoSomethingSecond(resOfDoSomethingFirst) {
	  	// ... some code
		return somePromise(); //返回一个promise 对象
	});
	
	//整个操作流程如下：
	doSomethingFirst()
		.then(doSdoSomethingSecond)
		.then(finalHandler)
		.catch(function (err) {
		  console.log(err);
		})
		.finally(() => {···});
		
	通过new Promise创建的Promise 实例doSomethingFirst 有以下方法：
		Promise.all(iterable)
		Promise.race(iterable)
		Promise.reject(reason)
		Promise.resolve(value)
		Promise.prototype.catch(onRejected)
		Promise.prototype.then(onFulfilled, onRejected)
		Promise.prototype.finally(onFinally)

	1. doSomethingSecond 如何知道 doSomethingFirst 操作完成了
		通过doSomethingFirst状态的变更通知。

		一个 Promise有以下几种状态:
			pending: 操作未完成。
			fulfilled: 操作完成，并且成功。
			rejected: 操作完成，但是失败。

		resolve()函数：
			在异步操作成功时调用
			作用是：将Promise对象的状态从 pending 变为 fulfilled，并将异步操作的结果，作为参数传递出去；
		reject()函数：
			在异步操作失败时调用
			作用是：将Promise对象的状态从 pending 变为 rejected， 并将异步操作的错误，作为参数传递出去。

		当操作完成时(Promise对象的状态变为fulfilled 或 rejected时)，doSomethingFirst 就会通过then()函数调用doSomethingSecond，doSomethingSecond就知道doSomethingFirst已经完成了。
	2. doSomethingSecond 如何知道 doSomethingFirst 的执行结果是什么
		doSomethingFirst通过给then()函数调用doSomethingSecond(resOfDoSomethingFirst)并把执行结果resOfDoSomethingFirst作为参数传递给doSomethingSecond


## Promise.prototype.then(onFulfilled, onRejected) ##
	用于为 Promise 实例添加状态改变时的回调函数
	返回值：一个新的 Promise，所可以采用链式写法，then()函数后面再调用then()函数
	参数：
		onFulfilled 
			是一个函数，有一个参数，用来记录变成fulfilled状态返回的结果
			当doSomethingFirst这个Promise的状态变成fulfilled 时，onFulfilled作为回调函数被调用
		onRejected
			是一个函数，有一个参数，用来记录变成rejected状态返回的原因
			当doSomethingFirst这个Promise的状态变成rejected 时，onRejected作为回调函数被调用
	
		在当前的例子里参数onFulfilled就是doSomethingSecond(resOfDoSomethingFirst)，resOfDoSomethingFirst 记录了doSomethingFirst 变成fulfilled状态返回的结果。

	注意事项：
		当给then()传入的参数不是函数时，它实际上将其解释为then（null），将使先前的Promise的结果落空
			Promise.resolve('foo').then(Promise.resolve('bar')).then(function (result) {
			  console.log(result); // foo
			});	
				等价于
		Promise.resolve('foo').then(null).then(function (result) {
				console.log(result);// foo 
		});
		
			上面的代码并没有按照我们期望的打印"bar", 而是打印"foo"
			正确的写法是：
			Promise.resolve('foo').then(function () {
			  return Promise.resolve('bar');
			}).then(function (result) {
			  console.log(result); // bar
			});


	给then()传入的参数是函数时，函数的内部我们可以做以下三件事：
		1. 返回另外一个promise
		2. 返回一个同步值
		3. 抛出一个同步错误
	
		示例：返回另外一个promise
			doSomethingFirst()
				.then(doSdoSomethingSecond)
				.then(finalHandler)
		
			//somePromise() 返回promise对象
			function doSomethingSecond(resOfDoSomethingFirst) {
				return somePromise(); //有return， finalHandler接受到的是resOfDoSomethingSecond
				//somePromise();// 没有return， finalHandler接受到的是undefined
			}
			function finalHandler(resOfDoSomethingSecond) {
				// handle resOfDoSomethingSecond
			}
	
		示例：返回同步值 && 抛出一个同步错误
		返回同步值实际上是将同步代码转换为Promisey代码的一种很棒的方法。例如，假设我们有一个用户的内存缓存。我们可以做到：
			
				//getUserByName  和 getUserAccountById 都返回promise对象
				getUserByName('nolan').then(function (user) {
				  if (user.isLoggedOut()) { //如果用户注销
				throw new Error('user logged out!'); // 抛出一个同步错误
				  }
				  if (inMemoryCache[user.id]) {
				return inMemoryCache[user.id];   //  返回一个同步值!
				  }
				  return getUserAccountById(user.id);// 返回一个promise!
				}).then(function (userAccount) {
				  // I got a user account!
				}).catch(function (err) {
				  // Boo, I got an error!
				});
				
			如果用户注销，catch()将收到一个同步错误；通过callbacks，这个错误会被忽略
			如果任何promise被拒绝，catch()将收到一个异步错误。

	通常情况下，一个promise 依赖于另一个promise ，但当我们需要两个promises的输出。我们该怎么做
		getUserByName('nolan').then(function (user) {
		  return getUserAccountById(user.id);
		}).then(function (userAccount) {
		  // 在这里我们已经获取到了用户账号userAccount，
		  // 但是我们也需要user对象时该怎么做？
		});	

		解决方案：
		function onGetUserAndUserAccount(user, userAccount) {
		  return doSomething(user, userAccount);
		}
		
		function onGetUser(user) {
		  return getUserAccountById(user.id).then(function (userAccount) {
		return onGetUserAndUserAccount(user, userAccount);
		  });
		}
		
		getUserByName('nolan')
		  .then(onGetUser)
		  .then(function () {
		  // at this point, doSomething() is done, and we are back to indentation 0
		});

## Promise.prototype.catch(onRejected) ##
	用于指定发生错误时的回调函数。catch 可以捕获
	返回值：返回一个Promise，处理状态变为rejected的情况
	参数：
		onRejected
			是一个函数，有一个参数，用来记录变成rejected状态返回的原因。
			当promise 状态变为rejected时被调用。

	注意事项：
	catch(rejectHandler) 
		等同于
	.then(null, rejectHandler)或.then(undefined, rejectHandler)

	但是 then(resolveHandler).catch(rejectHandler) 和then(resolveHandler, rejectHandler)
	不是完全相同的。
	区别在于：当使用then(resolveHandler, rejectHandler)格式时，如果resolveHandler本身抛出了错误，那么rejecthandler实际上不会捕获错误。所以更建议使用catch 而不是then的第二个参数。

	示例：
		var p1 = new Promise((resolve, reject) => {
		resolve('one');
		});
		
		// catch函数中可以捕捉到resolveHandler 中的error并打印
		p1.then(function () {
		throw new Error('oh noes');
		}).catch(function (err) {
		console.log('err=', err); // Error: oh noes
		});
		
		// reject函数不能捕捉到resolveHandler中的error
		p1.then(function () {
		throw new Error('oh noes');
		}, function (err) {
		console.log('err=', err); 
		});

## Promise.prototype.finally(onFinally) ##
	用于指定不管 Promise 对象最后状态如何，都会执行的操作
	
	finally本质上是then方法的特例
	promise
	.finally(() => {
	  // 语句
	});
	
	// 等同于
	promise
	.then(
	  result => {
	// 语句
	return result;
	  },
	  error => {
	// 语句
	throw error;
	  }
	);
	返回值：返回一个Promise，这个Promise对象设置了 finally 回调函数
	参数：Promise 结束后调用的函数，onFinally 这个函数不接收任何参数，它仅用于无论最终结果如何都要执行的情况。所以finally方法里面的操作，不应依赖于 Promise 的执行结果。
	示例：
		promise
		.then(result => {···})
		.catch(error => {···})
		.finally(() => {···});

	
## Promise.resolve(value) ##
	用于将现有对象转为 Promise 对象
		new Promise(function (resolve, reject) {
		  resolve(someSynchronousValue);
		}).then(/* ... */);
		等价于
		Promise.resolve(someSynchronousValue).then(/* ... */);

	返回值：返回一个Promise 对象，这个Promise对象是被给定的值解析过的。
	参数：
		value
			将被Promise对象解析的参数
			参数类型：
				Promise对象
				具有then方法的对象
				没有then方法的对象
				不带有任何参数
	
	示例1：参数是一个Promise对象
		Promise.resolve将不做任何修改、原封不动地返回这个Promise对象

		var p = Promise.resolve([1,2,3]);
		console.log("p=", p); //"p=" [object Promise]
		console.log('p type= ', typeof(p)); // "p type= " "object"
		p.then(function(v) {
		  console.log("v=",v); //"v=" Array [1, 2, 3]
		  console.log("v type=",typeof(v)); //"v type=" "object"
		});
		
		var p2 =  Promise.resolve(p);
		console.log("p2=", p2); //"p2=" [object Promise]
		console.log('p2 type= ', typeof(p2)); //"p2 type= " "object"
		p2.then(function(v) {
		  console.log("p2 v=",v); //"p2 v=" Array [1, 2, 3]
		  console.log("p2 v type=",typeof(v)); //"p2 v type=" "object"
		});

		p2 == p
	示例2：参数是一个具有then方法的对象
		返回的promise会采用这个thenable的对象的最终状态。

		let thenable = {
		  then: function(resolve, reject) {
		resolve(42);
		  }
		};
		
		let p = Promise.resolve(thenable);
		p.then(function(value) {
		  console.log(value);  // 42
		});

		Promise.resolve方法会将thenable对象转为 Promise 对象，然后就立即执行thenable对象的then方法,thenable对象的then方法执行后，对象p的状态就变为resolved，从而立即执行最后那个then方法指定的回调函数，输出 42

	示例3：参数是一个没有then方法的对象
		var p = Promise.resolve([1,2,3]);
		console.log("p=", p); //"p=" [object Promise]
		console.log('p type= ', typeof(p)); // "p type= " "object"
		p.then(function(v) {
		  console.log("v=",v); //"v=" Array [1, 2, 3]
		  console.log("v type=",typeof(v)); //"v type=" "object"
		});
		
		var p = Promise.resolve(123);
		console.log("p=", p); //"p=" [object Promise]
		console.log('p type= ', typeof(p)); // "p type= " "object"
		p.then(function(v) {
		  console.log("v=",v); //"v=" 123
		  console.log("v type=",typeof(v)); //"v type=" "number"
		});
		
		var p = Promise.resolve("123");
		console.log("p=", p); //"p=" [object Promise]
		console.log('p type= ', typeof(p)); // "p type= " "object"
		p.then(function(v) {
		  console.log("v=",v); //"v=" "123"
		  console.log("v type=",typeof(v)); //"v type=" "string"
		});

	示例4：不带有任何参数
		var p = Promise.resolve();
		console.log("p=", p); //"p=" [object Promise]
		console.log('p type= ', typeof(p)); // "p type= " "object"
		p.then(function(v) {
		  console.log("v=",v); //"v=" undefined
		  console.log("v type=",typeof(v)); //"v type=" "undefined"
		});

	注意事项：
		立即resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时
			//在下一轮“事件循环”开始时执行
			setTimeout(function () { 
			  console.log('three');
			}, 0);
			//在本轮“事件循环”结束时执行
			Promise.resolve().then(function () {
			  console.log('two');
			});
			//立即执行
			console.log('one');
		结果：
			"one"
			"two"
			"three"		
				
## Promise.reject(reason) ##
	返回值：返回一个Promise 对象，这个Promise 对象 带有状态是rejected的原因
	参数：
		reason
			表示Promise被拒绝的原因
		new Promise(function (resolve, reject) {
		  reject(someSynchronousReson);
		}).then(null,function(reason){
		   //...
		});

	等价于
		Promise.reject(someSynchronousReson)
		.then(null, function(reason) {
		  //...
		});

		
	示例:
		new Promise(function (resolve, reject) {
		  reject("reject reason");
		}).then(null,function(reason){
		console.log(reason);//"reject reason"
		});
		
		Promise.reject("reject reason").then(null, function(reason) {
		  console.log(reason); // "reject reason"
		});
		
		Promise.reject(new Error("reject reason")).then(null, function(error) {
		  console.log(error); // Error: reject reason
		});

	注意事项：与Promise.resolve不同的是Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。
		const thenable = {
		  then(resolve, reject) {
		reject('出错了');
		  }
		};
		
		Promise.reject(thenable)
		.catch(e => { //e不是reject抛出的“出错了”这个字符串，而是thenable对象。
		  console.log(e === thenable) // true
		})

## Promise.all(iterable) ##
	用于将多个 Promise 实例，包装成一个新的 Promise 实例
	返回值：返回一个新的promise对象，iterable中所有的promise都变成resolved状态时返回的 promise才会变为resolved状态； iterable中有一个promise变成rejected状态，promise就会变为rejected状态。
	参数：
		iterable
		一个可迭代对象，eg Array 或 String

	示例： iterable中所有的promise都变成resolved状态时返回的 promise才会变为resolved状态
		var p1 = new Promise((resolve, reject) => { 
		  setTimeout(resolve, 1000, 'one'); 
		}); 
		var p2 = new Promise((resolve, reject) => { 
		  setTimeout(resolve, 2000, 'two'); 
		});
		var p3 = new Promise((resolve, reject) => {
		  setTimeout(resolve, 3000, 'three');
		});
		const p = Promise.all([p1, p2, p3]).then(values => { 
		  console.log(values); //["one", "two", "three"]
		}).catch(reason => {
		  console.log(reason); //没执行
		});

		流程：p创建时为pending状态，当p1, p2, p3的状态都变成resolved时触发p变成resolved状态。
		p11s
		|----------|resolved  
		p22s 
		|--------------------|resolved
		p33s 
		|------------------------------|resolved
									   p resolved
									   
	
	示例：iterable中有一个promise变成rejected状态，promise就会变为rejected状态
		var p1 = new Promise((resolve, reject) => { 
		  setTimeout(resolve, 1000, 'one'); 
		}); 
		var p2 = new Promise((resolve, reject) => { 
		  setTimeout(resolve, 2000, 'two'); 
		});
		var p3 = new Promise((resolve, reject) => {
		  reject('reject');
		});
		const p = Promise.all([p1, p2, p3]).then(values => { 
		  console.log(values); //没执行
		}).catch(reason => {
		  console.log(reason); //"reject"
		});	

		流程：p创建时为pending状态，p3先执行完,p3的状态变成rejected时触发p变成rejected状态。
		p11s
		|----------|resolved  
		p22s 
		|--------------------|resolved
		p3
		|-|rejected
		  p rejected
		  

	示例：如果作为参数的 Promise 实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法
		var p1 = new Promise((resolve, reject) => { 
			  setTimeout(resolve, 1000, 'one'); 
			}); 
			var p2 = new Promise((resolve, reject) => { 
			  setTimeout(resolve, 2000, 'two'); 
			});
			var p3 = new Promise((resolve, reject) => {
			  reject('reject');
			}).catch(reason => {
			  console.log(reason); //reject
			});
			const p = Promise.all([p1, p2, p3]).then(values => { 
			  console.log(values); // ["one", "two", undefined]
			}).catch(reason => {
			  console.log(reason); //没执行
			});	


		流程：p创建时为pending状态，p3先执行完,p3的状态变成rejected时，调用自己定义的catch函数抛出错误，不会触发p变成rejected状态。当p1 和 p2 也执行完时，触发p变成resolved状态
		p11s
		|----------|resolved  
		p22s 
		|--------------------|resolved
		p3
		|-|rejected
		  					 |p resolved

	示例：如果传入的参数是一个空的可迭代对象，则返回一个resolved状态的 Promise 
		const p = Promise.all([]).then(values => { //p创建时状态就为resolved
		  console.log(values); // []
		});

## Promise.race(iterable) ##
	同样是将多个 Promise 实例，包装成一个新的 Promise 实例
	返回值：返回一个新的promise对象，一旦iterable中的某个promise变为resolved或rejected状态，返回的 promise就会变为resolved或rejected状态。谁最先执行完就返回谁的状态
	参数：
		iterable
		一个可迭代对象，eg Array 或 String

	示例： 一旦iterable中的某个promise变为resolved状态，返回的 promise就会变为resolved状态。
		var p1 = new Promise((resolve, reject) => { 
		  setTimeout(resolve, 1000, 'one'); 
		}); 
		var p2 = new Promise((resolve, reject) => { 
		  setTimeout(resolve, 2000, 'two'); 
		});
		var p3 = new Promise((resolve, reject) => {
		  setTimeout(resolve, 3000, 'three');
		});
		const p = Promise.race([p1, p2, p3]).then(values => { 
		  console.log(values); //["one", "two", "three"]
		}).catch(reason => {
		  console.log(reason); //没执行
		});

	流程：p创建时为pending状态，p1先执行完，p1的状态都变成resolved时触发p变成resolved状态。
	p11s
	|----------|resolved
			   p resolved  
	p22s 
	|--------------------|resolved
	p33s 
	|------------------------------|resolved
								   
									   
	示例：一旦iterable中的某个promise变为rejected状态，返回的 promise就会变为rejected状态。
	var p1 = new Promise((resolve, reject) => { 
	  setTimeout(resolve, 1000, 'one'); 
	}); 
	var p2 = new Promise((resolve, reject) => { 
	  setTimeout(resolve, 2000, 'two'); 
	});
	var p3 = new Promise((resolve, reject) => {
	  reject('reject');
	});
	const p = Promise.all([p1, p2, p3]).then(values => { 
	  console.log(values); //没执行
	}).catch(reason => {
	  console.log(reason); //"reject"
	});	

	流程：p创建时为pending状态，p3先执行完,p3的状态变成rejected时触发p变成rejected状态。
	p11s
	|----------|resolved  
	p22s 
	|--------------------|resolved
	p3
	|-|rejected
	  p rejected
