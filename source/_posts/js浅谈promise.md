---
title: js浅谈promise
date: 2019-05-03 19:19:20
categories: web前端
tags: 
- js
---

## Promise的含义

所谓Promise， 简单来说是一个容器， 里面保存这未来才会结束的事件(通常是一个异步操作)的结果。

**Promise对象有以下两个特点**

1. 对象的状态不受外界影响。 Promise对象代表一个异步操作，有3种状态： Pending(进行中)、Fulfilled(已成功)和Rejected(已失败)。 只有异步操作的结果可以决定当前是哪一种状态，其他任何操作都不会改变这个状态。
2. 一旦状态改变就不会改变，任何时候都可以得到这个结果。Promise对象的状态改变只能有两种可能：从Pending变化为Fulfilled和从Pending变为Rejected。 

**有了Promise对象，就可以将异步操作以同步操作的流程表达出来，以避免了层层嵌套的回调函数。**



### 语法

```js
new Promise( function(resolve, reject) {...} /* executor */  );
```

Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。

**resolve函数的作用**是将Promise对象从"未完成"变为"成功"(即从Pending变为Resolved)，在异步操作成功时调用，并将异步操作的结果作为参数传递出去；

reject函数的作用也类似， 不过是(从Pending变为Rejected)，在异步操作失败时调用，并将异步操作的错误作为参数传递出去。

Promise实例生成后，可以用then方法分别指定Resolved和Rejected状态的回调函数。

```
let promise = new Promise(function (resolve, reject) {
    console.time('st')
    console.log('start')
    setTimeout(() => {
        console.log('Promise')
        resolve('par'); //resolve将参数传给回调函数
        console.timeEnd('st') //2500ms左右
    },2500)
})
promise.then(function (res) {
    console.time('then')
    setTimeout(() => {
        console.log("Resolved")
        console.log(res) //par 打印接受到的参数
        console.timeEnd('then') //1000ms
    },1000)
})
console.log('hi') 

以上分别输出
start
hi
Promise //2.5s后输出
st: 2500ms
Resolved //1s之后再输出
par
then: 1000ms
```

上面代码中执行： Promise新建后就会立即执行，所以首先输出start、 然后setTimeout异步执行，然后then方法指定的回调函数将在当前脚本所有同步任务执行完成后才会执行 ，所以Resolved最后输出。



```
var p1 = new Promise(function (resolve, reject) {
    setTimeout( () => reject(new Error('fail')), 3000)
})
console.log(p1) //Promise { <pending> } 直接打印输出p1实例可以输出当前Promise所处状态
var p2 = new Promise(function (resolve, reject) {
    resolve(p1)
})

p2.then( () => {
    console.log("i am p2 callback")
}, (err) => {
 	console.log(err) //Promise { <rejected> }
    console.log(err) //Error: fail 因为p1是Rejected，所以p2直接执行rejected函数
})

```

上面代码中p1，p2都是Promise的实例，此时p1的状态会传给p2。也就是说，p1的状态决定了p2的状态。



**promise.all()**

```
var r1 = new Promise(function (resolve, reject) {
    console.time('start')
    setTimeout(() => {
        console.log('this is a request1')
        console.timeEnd('start')
    },3000)
})
var r2 = new Promise(function (resolve, reject) {
    setTimeout(() => {
        console.log('this is a request2')
    },3000)
})
Promise.all([
    r1,
    r2
])

// this is a request1
// start: 3000ms
// this is a request2 
```

上面代码中r1，r2都是同时输出。 

这个方法返回一个新的promise对象，该promise对象在数组参数里所有的promise对象都成功的时候才会触发成功，一旦数组里面有任何一个的promise对象失败则立即触发该promise对象的失败。

