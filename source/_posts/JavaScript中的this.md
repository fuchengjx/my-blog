---
title: JavaScript中的this
date: 2019-09-19 21:21:54
category: web前端
tags:
- js
---

JavaScript中的this指向有很多琢磨不透的地方，很多时候有种莫名其妙的感觉。这次想系统的理解一下js中的this。

## this指向举例

**this的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定this到底指向谁**，**实际上this的最终指向的是那个调用它的对象**

以下我将举出非常多的示例来理解this指向。

```
function a() {
  let user = 'flura'
  console.log(this.use) // undefined
  console.log(this)  // Window
}
a()
// 根据这个例子，我们按照上面说的this最终指向的是调用它的对象，这里的函数a实际是Window对象所点出来的。

以上代码等价于
function a() {
  let user = 'flura'
  console.log(this.use) // undefined
  console.log(this)  // Window
}
window.a()
```



```
let obj = {
  user: 'flura',
  method: function() {
    console.log(this.user)  // flura
    console.log(this)  // {user: "flura", method: ƒ}  这里this指向的是obj
  }
}
obj.method()
```

这里的this是指向对象obj的，调用这个method是通过obj.method()执行的，所以自然指向的就是对象obj。**this的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定this到底指向谁**，**实际上this的最终指向的是那个调用它的对象**



在来一个更加明确的例子

```
let obj = {
  user: 'flura',
  method: function () {
    console.log(this.user) // undefined
    console.log(this) // window
  }
}
let method2 = obj.method //在这里发现这个和上面的例子不等价。验证了谁调用指向谁。 这里函数method虽然被对象obj引用，但是在将method赋值给method2的时候并没有执行，所以最终指向的window。这和上面的例子不一样，上面的例子是直接执行了method。
method2() // window调用了method


// 插一点箭头函数的知识
let obj = {
  user: 'flura',
  method: () => {
    console.log(this.user) // undefined
    console.log(this) // window
  }
}
obj.method() // 在这里可以发现this的指向被往上抛了一层，指向了obj的上一层 window。 这就是箭头函数的特殊之处。所以定义对象上的方法上时，不要使用箭头函数。
```



以下引用了追梦子的博客 [彻底理解js中的thsi指向](https://www.cnblogs.com/pssp/p/5216085.html)

```
var o = {
    user:"追梦子",
    fn:function(){
        console.log(this.user); //追梦子
    }
}
window.o.fn();
```

　　这段代码和上面的那段代码几乎是一样的，但是这里的this为什么不是指向window，如果按照上面的理论，最终this指向的是调用它的对象，这里先说个而外话，window是js中的全局对象，我们创建的变量实际上是给window添加属性，所以这里可以用window点o对象。

　　这里先不解释为什么上面的那段代码this为什么没有指向window，我们再来看一段代码。

```
var o = {
    a:10,
    b:{
        a:12,
        fn:function(){
            console.log(this.a); //12
        }
    }
}
o.b.fn();
```

　这里同样也是对象o点出来的，但是同样this并没有执行它，那你肯定会说我一开始说的那些不就都是错误的吗？其实也不是，只是一开始说的不准确，接下来我将补充一句话，我相信你就可以彻底的理解this的指向的问题。

- 情况1：如果一个函数中有this，但是它没有被上一级的对象所调用，那么this指向的就是window。

- 情况2：如果一个函数中有this，这个函数有被上一级的对象所调用，那么this指向的就是上一级的对象。

- 情况3：如果一个函数中有this，**这个函数中包含多个对象，尽管这个函数是被最外层的对象所调用，this指向的也只是它上一级的对象**



构造函数的this：

```
function Fn(){
    this.user = "追梦子";
}
var a = new Fn();
console.log(a.user); //追梦子
```

　这里之所以对象a可以点出函数Fn里面的user是因为new关键字可以改变this的指向，将这个this指向对象a，为什么我说a是对象，因为用了new关键字就是创建一个对象实例，理解这句话可以想想我们的例子3，我们这里用变量a创建了一个Fn的实例（相当于复制了一份Fn到对象a里面），此时仅仅只是创建，并没有执行，而调用这个函数Fn的是对象a，那么this指向的自然是对象a，那么为什么对象a中会有user，因为你已经复制了一份Fn函数到对象a中，用了new关键字就等同于复制了一份。



**更新一个小问题当this碰到return时**

```
function fn()  
{  
    this.user = '追梦子';  
    return {};  
}
var a = new fn;  
console.log(a.user); //undefined
```

再看一个

```
function fn()  
{  
    this.user = '追梦子';  
    return function(){};
}
var a = new fn;  
console.log(a.user); //undefined
```

再来

```
function fn()  
{  
    this.user = '追梦子';  
    return 1;
}
var a = new fn;  
console.log(a.user); //追梦子
function fn()  
{  
    this.user = '追梦子';  
    return undefined;
}
var a = new fn;  
console.log(a.user); //追梦子
```

什么意思呢？

　　**如果返回值是一个对象，那么this指向的就是那个返回的对象，如果返回值不是一个对象那么this还是指向函数的实例。**

```
function fn()  
{  
    this.user = '追梦子';  
    return undefined;
}
var a = new fn;  
console.log(a); //fn {user: "追梦子"}
```

　　还有一点就是虽然null也是对象，但是在这里this还是指向那个函数的实例，因为null比较特殊。

```
function fn()  
{  
    this.user = '追梦子';  
    return null;
}
var a = new fn;  
console.log(a.user); //追梦子
```



## this绑定规则

### 默认绑定

默认绑定是函数针对的独立调用的时候，不带任何修饰的函数引用进行调用，非严格模式下 this 指向全局对象(浏览器下指向 Window，Node.js 环境是 Global ）。

```
var a = 2
function foo() {
  var a = 5
  console.log(this.a)  // 2
  console.log(this)  // window
}
foo()
```

 这是最常用的函数调用类型：独立函数调用。可以把这条规则看作是无法应用其他规则时的默认规则。

怎么看出foo()是默认绑定？ 在代码中，foo()是直接使用不带任何修饰的函数引用进行调用的，因此只能使用默认绑定。

#### 默认绑定的另一种情况

在函数中以函数作为参数传递，例如`setTimeOut`和`setInterval`等，这些函数中传递的函数中的`this`指向，在非严格模式指向的是全局对象。

例子：

```
var name = 'JavaScript';
var person = {
    name: '程序员',
    sayHi: sayHi
}
function sayHi(){
    setTimeout(function(){
        console.log('Hello,', this.name);
    })
}
person.sayHi();
setTimeout(function(){
    person.sayHi();
},200);
// 输出结果 Hello, JavaScript
// 输出结果 Hello, JavaScript
```



### 隐式绑定

判断 this 隐式绑定的基本标准:函数调用的时候是否在上下文中调用，或者说是否某个对象调用函数。

```
function foo() {
  console.log(this.a)
}

var obj = {
  a: 2,
  foo: foo
}
obj.foo()  // 2
```

foo 方法是作为对象的属性调用的，那么此时 foo 方法执行时，this 指向 obj 对象。使用上下文来调用函数，所以最后this绑定在这个上下文对象obj上。

**隐式绑定的另一种情况**

```
function foo() {
  console.log(this.a)
}

var obj2 = {
  a: 22,
  foo: foo
}

var obj1 = {
  a: 11,
  obj2: obj2
}
obj1.obj2.foo()  // 22
```

对象属性引用链只有上一层或者说最后一层在调用位置中起作用。 如果一个函数中有this，**这个函数中包含多个对象，尽管这个函数是被最外层的对象所调用，this指向的也只是它上一级的对象**



### 显式绑定

显式绑定，通过函数call apply bind 可以修改函数this的指向。call 与 apply 方法都是挂载在 Function 原型下的方法，所有的函数都能使用。

它们的第一个参数都是一个对象，是给this准备的，接着在调用函数时将其绑定到this。因为可以直接指定this的绑定对象，因此我们称之为显式绑定。

```
function foo() {
  console.log(this.a)
}
var obj = {
  a : 2
}
foo.call(obj)  // 2
```



#### call 和 apply 的区别

1. call和apply的第一个参数会绑定到函数体的this上，如果`不传参数`，例如`fun.call()`，非严格模式，this默认还是绑定到全局对象
2. call函数接收的是一个参数列表，apply函数接收的是一个参数数组。

```
unc.call(thisArg, arg1, arg2, ...)        // call 用法
func.apply(thisArg, [arg1, arg2, ...])     // apply 用法
```

#### call和apply的注意点

这两个方法在调用的时候，如果我们传入数字、布尔类型或者字符串来当做this的绑定对象，这两个方法会把传入的参数转成它的对象类型(也就是new Number(...)、 new Boolean(...)、new String(...) )。这通常被称为"装箱"。



#### bind函数

> bind 方法 会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。(定义内容来自于 MDN )

```
func.bind(thisArg[, arg1[, arg2[, ...]]])    // bind 用法
```

### new 绑定

使用new调用函数的时候，或者说发生构造函数调用时，会自动执行下面几个操作：

1. 创建一个全新的空对象
2. 将空对象的 *proto* 指向原对象的 prototype
3. 这个新对象会绑定到函数调用的this
4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。

 注意:如果创建新的对象，构造函数不传值的话，新对象中的属性不会有值，但是新的对象中会有这个属性。

#### 手动实现一个new创建对象代码

```
function New(func) {
    var res = {};
    if (func.prototype !== null) {
        res.__proto__ = func.prototype;
    }
    var ret = func.apply(res, Array.prototype.slice.call(arguments, 1));
    if ((typeof ret === "object" || typeof ret === "function") && ret !== null) {
        return ret;
    }
    return res;
}
var obj = New(A, 1, 2);
// equals to
var obj = new A(1, 2);
```

## this绑定优先级

上面介绍了 this 的四种绑定规则，但是一段代码有时候会同时应用多种规则，这时候 this 应该如何指向呢？其实它们也是有一个先后顺序的，具体规则如下:

**new绑定 > 显式绑定 > 隐式绑定 > 默认绑定**

## 判断this

我们可以根据优先级来判断函数在某个调用位置引用的是哪条规则。可以按照下面的顺序来进行判断：

1. 函数是否在new中调用(new绑定)？ 如果是的话this绑定的是新建的对象。

   var bar = new foo()

2. 函数是否通过call、apply(显示绑定)调用？如果是的话，this绑定的是指定的对象.

   var bar = foo(obj2)

3. 函数是否在某个上下文对象中调用(隐式绑定)？如果是的话，this绑定的是那个上下文对象。

   var bar = obj1.foo()

4. 如果不是的话，使用默认绑定。

   var bar = foo()

## 参考文章

[彻底理解js中this的指向](https://www.cnblogs.com/pssp/p/5216085.html)

[重学 this 关键字](https://juejin.im/post/5d6e5f77f265da03e05b2fd9?utm_source=gold_browser_extension#heading-6)

参考书目： 你不知道的JavaScript