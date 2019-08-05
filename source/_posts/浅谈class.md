---
title: 浅谈class
date: 2019-06-30 09:17:53
categories: web前端
tags: 
- js
---

### 定义类

类实质是个"特殊的函数"，就像你能够定义的函数表达式和函数声明一样， 类语法有两个组成部分： 类表达式和类声明。

class的本质是function。它可以看作一个语法糖，让对象原型的写法更加清晰、更像面向对象编程语言的语法。

```
class Ponit { // 类声明 按照书写习惯 类名要大写 就像构造函数一样。
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	toString() {
		return this.x + this.y
	}
}
typeof Ponit // "function"
Point === Point.prototype.constructor // true

let p = new Ponit() //类的实例化 p为实例对象
```

上面的代码表明，类的数据类型就是函数，类本身就指向构造函数。 使用的时候也是直接对类使用new命令，和构造函数的用法一样。



构造函数的prototype属性在ES6的"类"上继续存在。事实上，类的所有方法都定义在prototype属性上。

```
class B {
	constructor() {
		//...
	}
	toString() {
		//...
	}
	toValue() {
		//...
	}
}

// 等同于
B.prototype = {
	constructor() {},
	toString() {},
	toValue() {}
}

let b = new B()
b.constructor === B.prototype.constructor // true	在类的实例上调用方法，其实就是调用原型上的方法。
```

由于类的方法(除constructor以外)都定义在prototype对象上，所以类的新方法可以添加在prototype对象上。  另外，类的内部定义的所有方法都是不可枚举的。

#### 提升

函数声明和类声明宅男有一个重要区别是函数声明会提升，类声明不会。你首先需要声明你的类，然后访问它，否则代码会抛出一个ReferenceError。 所以在继承中也**必须**保证之类在父类后定义



### constructor方法

constructor方法是类的默认方法，通过new命令生成对象实例时自动调用该方法。一个类必须有constructor方法，如果显示定义，JavaScript引擎会自动为它添加一个空的constructor方法。

constructor方法默认返回实例对象(即this)，不过完全可以定返回另外一个对象。

```
class Foo {
	constructor() {
		return Object.create(null)
	}
}

new Foo() instanceof Foo // false 
```

一个类只能拥有一个名为 “constructor”的特殊方法。如果类包含多个`constructor`的方法，则将抛出 一个[`SyntaxError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) 。

一个构造函数可以使用 `super` 关键字来调用一个父类的构造函数。



### 类的实例对象

生成实例对象的写法和ES5完全一样，也是使用new命令。如果忘记加上new, 像函数那样调用Class将会报错。

```
class Point {
	// ...
}

// 报错
let point = Point()

// 正确
let point = new Point()
```



```
class P {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	toString() {
		// ...
	}
}

let p =  new P(2, 3)
p.hasOwnProperty('x') // true
p.hasOwnProperty('toString') // false 
```

上面代码中，x和y都是实例对象p自身的属性(因为定义在this变量上)，所以hasOwnProperty方法返回true。而toString是原型对象的属性(因为定义在P类上)，所以hasOwnProperty方法返回false。



与ES5一样，类的所有实例共享一个原型对象。 

```
let p1 = new P(2, 3)
let p2 = new P(4, 5)

p1.__proto__ === p2.__proto__  // true
```

上面的代码中，p1和p2都是P的实例，它们的原型都是P.prototype,所以 `__proto__`属性是相等的。这也意味着，可以通过实例的 `__proto__`属性为类添加方法。



### 静态方法

类相对于实例的原型，所有在类中定义的方法都会被实例继承。如果在一个方法前加上static关键字，就表示该方法不会被实例继承，而是直接通过类调用，成为"静态方法"。

`static` 关键字用来定义一个类的一个静态方法。调用静态方法不需要[实例化](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#The_object_(class_instance))该类，但不能通过一个类实例调用静态方法。静态方法通常用于为一个应用程序创建工具函数。

```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.hypot(dx, dy);
    }
}

const p1 = new Point(5, 5);
const p2 = new Point(10, 10);

console.log(Point.distance(p1, p2));
```

#### 静态属性

```
class Foo {
	
}
Foo.prop = 1
console.log(Foo.prop) // 1
```

上面的写法可读/写Foo类的静态属性prop。  目前，只有这种学法可行，因为ES6明确规定，Class内部只有静态方法，没有静态属性。