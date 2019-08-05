---
title: 浅谈async函数
date: 2019-05-24 09:59:59
categories: web前端
tags:
- js
---

## async

### async

ES2017标准引入了async函数，使得异步操作变得更加方便。

async的改进之处

1. async和await比起星号和yield，语义更加清楚了。async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。
2. async函数的返回值是Promise对象，这比Generator函数的返回值是Iterator对象方便了许多。可以用then方法指定下一步操作。 进一步说，async函数完全可以看做由多个异步操作包装成的一个Promise对象，而await命令就是内部then命令的语法糖。

```
function getValueA() {
    let promise = new Promise(function (resolve, reject) {
        setTimeout(()=>{
            console.log("i am a getValueA")
            resolve(2)
        },2000)
    })
    return promise
}
function getValueB() {
    let promise = new Promise(function (resolve, reject) {
        setTimeout(()=>{
            console.log("i am a getValueB")
            resolve(4)
        },4000)
    })
    return promise
}
function getValueC(a, b) {
    let promise = new Promise(function (resolve, reject) {
        setTimeout(()=>{
            console.log("i am a getValueC")
            resolve(3)
        },3000)
    })
    return promise
}

async function getABC() {
    let A = await getValueA()
    let B = await getValueB()
    let C = await getValueC(A,B) //将A,B的返回值传递给getABC()
    return A*B*C //24
  
}
```



async函数返回一个Promise对象

async函数内部return语句返回的值，会成为then方法回调函数的参数。

```
async function f() {
	return 'hello world';
}

f().then(v => {
	console.log(v) //'hello world' 
}
//上面的代码中，函数f内部return命令返回的值会被then方法回调函数接收到。

async function f() {
	throw new Error('出错了')
}

f().then(v => {
	console.log(v) //'Error： 出错了' 
}
//async函数内部抛出错误会导致放回的Promise对象变为reject状态。 抛出的错误对象会被catch方法回调函数接收到
```



### await命令

正常情况下，await命令后面是一个Promise对象。如果不是，会被转成一个立即resolve的Promise对象。

```
async function f() {
	return await 123;
}

f().then(v => console.log(v)) //123
```

上面的代码中，await命令的参数是数值的123，它被转成Promise对象并立即resolve。



如果await后面的异步操作出错，那么等同于async函数返回的Promise对象被reject

```
async function f() {
	await new Promise(function (resolve, reject) {
		throw new Error('出错了')
	})
}

f().then(v => console.log(v))
.catch( e => console.log(e)) //Error: 出错了
```



多个await命令后面的异步操作如果不存在继发关系，最好让它们同时触发。

```
let foo = await getFoo();
let bar = await getBar();
//上面的代码中，getFoo和getBar是两个独立的异步操作(及互不依赖)被写成继发关系。这样比较耗时，因为只有getFoo完成后才会执行getBar，完全可以让它们同时触发。

//写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

//写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```

上面两种写法中，getFoo和getBar都是同时触发，这样就会缩短程序的执行时间。



### async函数的实现原理

```
async function fn(args) {
	// ...
}

//等于
function fn（args) {
	return spawn(function* () {
		// ...
	})
} 
//所有的async函数都可以写成上面第二种形式，其中的spawn函数就是自动执行器。

//spawn函数的实现
function spawn(genF)  {
    return new Promise(function (resolve, reject) {
        var gen = genF();
        function step(nextF) {
            try {
                var next = nextF();
            } catch (e) {
                return reject(e);
            }
            if (next.done) {
                return resolve(next.value);
            } 
            Promise.resolve(next.value).then(function (e) {
                step(function () {
                    return gen.next(v);
                }, function (e) {
                    step(function () {
                        return gen.throw(e);
                    })
                })
            })
        }
        step(function () {
            return gen.next(undefined);
        })
    })
}
```

