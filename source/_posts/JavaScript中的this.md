---
title: JavaScript中的this
date: 2019-09-19 21:21:54
category: web前端
tags:
- js
---

JavaScript中的this指向有很多琢磨不透的地方，很多时候有种莫名其妙的感觉。这次想系统的理解一下js中的this。

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



[参考博客](https://www.cnblogs.com/pssp/p/5216085.html)

