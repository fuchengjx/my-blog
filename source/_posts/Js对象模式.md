---
title: Js对象模式
date: 2019-11-19 15:39:25
tags: 
- js
- ES6
- 面对对象
category: 'web前端'
description: '这篇文章主要总结了js中对象的创建方法 字面量创建、工厂模式、构造函数模式、原型模式、以及组合模式，以及js中继承的实现 原型链、经典继承、组合继承、拷贝继承、原型式继承、组合继承、ES6的extends继承等'
---

# 创建对象

## 字面量创建对象

```
var dog = {}
dog.name = "benji";   //属性
dog.getName = function() {   //方法
    return this.name;
}  
```

或者

首先定义一个"空对象"，然后添加属性和方法

```
var person = {};
person.name = 'beijin';
person.age = 70;
person.say = function(){
    return "hello";
}
```

为什么是"空对象"？ js中并不存在真正的空对象，最简单的{}对象也会从Object.prototype继承方法和属性，我们提到的空对象只是没有只有属性。

### **对象字面量vs构造函数创建对象对比**

字面量的优势：

> 1. 它的代码量更少，更易读；
> 2. 它可以强调对象就是一个简单的可变的散列表，而不必一定派生自某个类；
> 3. 对象字面量运行速度更快，因为它们可以在解析的时候被优化：它们不需要作用域解析；因为存在我们创建了一个同名的构造函数Object()的可能，当我们调用Object()的时候，解析器需要顺着作用域链从当前作用域开始查找，如果在当前作用域找到了名为Object()的函数就执行，如果没找到，就继续顺着作用域链往上照，直到找到全局Object()构造函数为止
> 4. Object()构造函数可以接收参数，通过这个参数可以把对象实例的创建过程委托给另一个内置构造函数，并返回另外一个对象实例，而这往往不是你想要的。



## 工厂模式创建对象

```
function createPerson(name, age){
 var o = new Object();
 o.name = name;
 o.age = age
 o.sayName = function() {
 	alert(this.name)
 }
 return o; 
}
var person1 = createPerson('张三', 20);
var person2 = createPerson('李四', 21);
```

createPerson()能够根据接受的参数来构建一个包含所有必要信息的Person对象、可以无数次调用这个对象，而它都会返回一个包含2个属性1个方法的对象。工厂模式很好的解决了创建多个相似对象的问题(字面量方法)，但是却没有解决对象识别对象的问题(即怎样知道对象的类型)



## 构造函数创建对象

```
function Person(name){ // 按照惯例构造函数始终以一个大写字母开头
 this.name = name;
 this.sayName = function() {
 	alert(this.name)
 }
}
var person3 = new Person('张三');
```

**构造函数与工厂模式的区别**：

- 没有显式的创建对象
- 直接将属性和方法赋给了this对象
- 没有return语句

在这最后构造函数是可以识别对象类型的问题的: 因为person3保存着Person的一个不同实例、它有一个constructor(构造函数)属性，改属性指向Person，而person1的constructor里却是 Object()

```
person1.constructor == createPerson // false
person3.constructor == Person  //true
```

**构造函数与普通函数的区别**： 任何函数，只要通过new操作符来调用，那么他就可以作为构造函数；而任何函数，如果不通过new操作符来调用，那么它和普通函数也不会有什么两样。

**构造函数的问题：**使用构造函数的主要问题，就是每个方法都要在每个实例上重新创建一遍。  举个例子：每次新建一个实例 var   p1 = new Person("xx");   var p2 = new Person("xx")  都会重复创建一个sayName方法，如果反复创建了非常多个实例，就会发现浪费了极大的内存。我们可以想办法栏sayName方法公用，让所有实例都共享这个方法(原型模式)。



## 原型模式

```
function Animal (name) {
  // 属性
  this.name = name || 'Animal';
  // 实例方法
  this.sleep = function(){
    console.log(this.name + '正在睡觉！');
  }
}
// 原型方法
Animal.prototype.eat = function(food) {
  console.log(this.name + '正在吃：' + food);
};

var dog = new Animal('dog')
var cat = new Animal('cat')
```

我们创建的每个函数都有一个prototype(原型)属性，这个属性是一个指针，指向一个对象，而这个对象的用途是可以给所有实例共享的方法和属性。(所以如果有要所有实例共享的方法或属性，为了避免重复创建，一定要放在prototype上)。

(感觉这种方式又不太像纯粹的原型模式，是组合使用的构造函数模式与原型模式) 构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的属性。结果，每个实例都会有自己的一份实例属性的副本，但又同时共享着对方法的引用，最大程度节省了内存。另外，这种混合模式还支持像构造函数传递参数。



# 继承

许多面向对象语言都支持两种继承的方式；**接口继承**和**实现继承**。接口继承只继承方法签名，而实现继承则继承实际的方法。因为js的函数的函数没有签名，在ES(ECMAScipt)中无法实现接口继承。ES只支持实现继承，而且其实现继承主要是依靠原型链来实现的。

## **Prototype**与 `__proto__`

```
function Parent {}
var parent = new Parent()
```

第一行代码发生了什么？

- 创建了一个构造函数 `Parent`
- 创建了一个原型对象 `prototype`

![](http://img.flura.cn/ParentPrototype.png)

构造函数 `Parent` 中 有一个 `prototype` 的属性指向 `Parent` 的 原型对象 `prototype`
原型对象 `prototype` 则有一个 `constructor` 的属性 指向回 构造函数 `Parent`



第二行代码发生了什么？

![](http://img.flura.cn/instancePrototype.png)

图中的 `Parent` 的实例 `parent` 里，有一个`[[prototype]]`，为什么这里不是 `__proto__`呢？

其实，这里的 `[[prototype]]` 表示一种标准规范内置属性，被一些浏览器自己通过`__proto__`实现了。



## 原型链

```
function Parent() {}
function Child() {}

var parent = new Parent()
Child.prototype = parent

var child = new Child()
```

![](http://img.flura.cn/prototypeChain.png)

**优缺点** 简单易于实现,无法实现多继承。 

而且原型的属性最好不能是引用类型，因为原型链上的所有实例会共享引用，这样每个实例都可以修改这个原型上的引用。

而且原型继承，在创建子类型的时候，不能向父类型传参。



## 借用构造函数继承(经典继承)

实质是利用call来改变Cat中的this指向   这种技术的基本思想非常简单，即在子类型构造函数的内部调用父类型构造函数。(函数不过是在特定环境中执行代码的对象，因此通过使用apply()和call()方法也可以在(将来)新创建的对象上执行构造函数)

```
function Animal(nation) {
  this.nation = nation
}

function Cat(name, nation){
  Animal.call(this, nation); // 传递参数
  this.name = name || 'Tom';
}
let cat1 = new Cat('白猫', '白猫科')
let cat2 = new Cat('黑猫', '黑猫科')
cat1.nation //白猫科
cat2.nation //黑猫科
```

以上代码，我们实际上是在(未来将要) 新创建的Cat实例的环境下调用了Animal构造函数。这样一来，就会在新的Cat对象上执行Animal()函数中定义的所有对象初始化代码，结果Cat的每个实例上都会有一个自己的nation属性副本了。

**优缺点** 可以实现多继承，子类也可以向父类传参, 不能继承原型属性/方法(如果方法都只能在构造函数中定义，那么函数的复用就无从谈起了)



## 组合继承

上述两种继承方式有机结合，通过将方法定义在 `prototype` 中，属性通过借用构造函数继承的方式实现继承。这样，即通过在原型上定义方法实现了函数复用，又能保证每个实例都有它自己的属性。

```
function Amimal() {}
function Cat(name){
  Animal.call(this);
  this.name = name || 'Tom';
}
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
```

组合继承避免了原型链和借用构造函数的缺陷，融合了它们的缺点，成为JavaScript中最常用的继承模式。



## 拷贝继承

将父类的属性和方法拷贝一份到子类中 子类:

```
function Cat(name){
  var animal = new Animal();
  for(var p in animal){
    Cat.prototype[p] = animal[p];
  }
  Cat.prototype.name = name || 'Tom';
}
```

**优缺点** 支持多继承,但是效率低占用内存



## 原型式继承

```
function createObject(o) {
    function F() {}
    F.prototype = o
    return new F()
}

function Parent() {}

var parent = new Parent()

var child = object(parent)
```

- 引用类型的属性为所有实例共享
- 无法向父类构造函数传值

ES5中通过新增的Object.create()方法规范化了原型继承。**Object.create()**方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。



## 寄生组合式继承

我们在 `组合继承` 中发现，这种方式最大的缺点是会调用两次父构造函数，

一次是设置子类型实例的原型的时候：

```
var parent = new Parent('parent')
Child.prototype = parent
```

一次在创建子类型实例的时候：

```
var child = new Child('child') 
```

回想下 new 的模拟实现，其实在这句中，我们会执行：

```
Parent.call(this, name)  // 间接调用
```

所以我们在例图中可以发现，`parent` 和 `child` 中都有一份 `name` 属性。

因此，通过 在 `寄生组合式继承` 中的 `createObject` 方法，间接的让 `Child.prototype` 访问到 `Parent.prototype`，从而减少调用父构造函数的次数。

```
function createObject(o) {
    function F() {}
    F.prototype = o
    return new F()
}

function Parent(name) {
    this.name = name
}

function Child(name) {
    Parent.call(this, name)
}

Child.prototype = createObject(Parent.prototype)
Child.prototype.constructor = Child

var child = new Child('child')
```

所谓寄生组合式继承，即通过调用构造函数来继承属性，通过原型链的混成形式来继承方法

这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。



## ES6的extends继承

ES6 的继承机制是先创造父类的实例对象this（所以必须先调用super方法），然后再用子类的构造函数修改this

```
//父类
class Person {
    //constructor是构造方法
    constructor(skin, language) {
        this.skin = skin;
        this.language = language;
    }
    say() {
        console.log('我是父类')
    }
}

//子类
class Chinese extends Person {
    constructor(skin, language, positon) {
        //console.log(this);//报错
        super(skin, language);
        //super();相当于父类的构造函数
        //console.log(this);调用super后得到了this，不报错，this指向子类，相当于调用了父     类.prototype.constructor.call(this)
        this.positon = positon;
    }
    aboutMe() {
        console.log(`${this.skin} ${this.language}  ${this.positon}`);
    }
}


//调用只能通过new的方法得到实例,再调用里面的方法
let obj = new Chinese('红色', '中文', '香港');
obj.aboutMe();
obj.say();
```



**参考**

[从 Prototype 开始说起（上）—— 图解 ES5 继承相关](https://juejin.im/post/5dcfe3715188254ef850fe45)