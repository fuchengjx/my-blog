---
title: js判断数据类型
date: 2019-03-31 11:20:46
categories: web前端
tags: 
- js
---

# javaScript中的数据类型

 ECMAScript 变量包含两种不同的数据类型的值：基本类型值和引用类型值 。 **基本数据类型**指的是简单的数据段，而**引用数据类型**指那些可能有多个值组成的对

####  基本类型（值类型）

- Undefined    在使用var声明变量但未对其初始化时，或者使用了一个并未声明的变量时，又或者使用了一个并不存在的对象属性时，这个变量的值就是undefined。

- Null                从逻辑上看，null值表示一个空对象指针，独一无二。

- Boolean          true、false

- Number          NaN，即非数值（Not a Number）是一个特殊的数值，这个数值用于表示一个本来要返回数值的操作数未返回数值的情况（这样就不会抛出错误了）

- String              字符串可以由''  或 "" 表示。    ES中字符串是不可改变的，也就是说，字符串一旦创建，它们的值就不能改变。要改变某个变量保存的字符串，首先要销毁原来的字符串，然后再用另一个包含新值的字符串填充该变量。  

​       这五种基本数据类型是按值访问的，因为可以操作保存在变量中的实际的值。 

####  复杂类型（引用类型） 

- **Object**         对象其实就是一组数据和功能的集合。对象可以通过new操作符后跟要创建的对象类型的名称来创建。 而创建Object的实例并为其添加属性和方法，就可以自定义对象。
  1. **Object类型**
  2. **Array类型**
  3. **Date类型**
  4. **RegExp类型**
  5. **Function类型** 

​       引用类型的值是保存在内存中的对象。与其他语言不同，js不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。 操作对象时，实际上是在操作对象的引用而不是实际的对象。(这种说法不太严谨，为对象添加属性时，操作的是实际的对象)。

#### 值类型与引用类型的差别

- 基本类型在内存中占据固定大小的空间，因此被保存在栈内存中
- 从一个变量向另一个变量复制基本类型的值，复制的是值的副本
- 引用类型的值是对象，保存在堆内存
- 包含引用类型值的变量实际上包含的并不是对象本身，而是一个指向该对象的指针
- 从一个变量向另一个变量复制引用类型的值的时候，复制是引用指针，因此两个变量最终都指向同一个对象

### 

## 判断数据类型

#### 使用typeof

检测基本数据类型的最佳选择是使用typeof

```
var bool = true
var num = 1
var str = 'abc'
var und = undefined
var nul = null
var arr = [1,2,3]
var obj = {}
var fun = function(){}
var reg = new RegExp()

console.log(typeof bool); //boolean
console.log(typeof num); //number
console.log(typeof str); //string
console.log(typeof und); //undefined
console.log(typeof nul); //object
console.log(typeof arr); //object
console.log(typeof obj); //object
console.log(typeof reg); //object
console.log(typeof fun); //function

由结果可知，除了在检测null时返回 object 和检测function时放回function。对于引用类型返回均为object

```

#### **使用instanceof**

检测引用型数据类型时的最佳选择是instanceof

```
console.log(reg instanceof Object); //true
console.log(reg instanceof RegExp); //true  因为根据规定，所用引用类型的值都是Object的实例，因此都是返回true

console.log(bool instanceof Boolean);  //false 
var bool2 = new Boolean();
console.log(bool2 instanceof Boolean); //true  引用类型与基本包装类型的主要区别就是对象的生存期。使用new操作符创建的引用类型的实例，在执行流离开当前作用域之前都是一直保存在内存中。而自动创建的基本包装类型的对象，则只存在于一行代码的执行瞬间，然后立即被销毁
```

```
console.log(und instanceof Object); // false
console.log(nul instanceof Object); // false  undefined和null没有contructor属性

instanceof它不仅检测构造找个对象的构造器，还检测原型链。所以它可以检测继承而来的属性。
```



#### 使用constructor

```
console.log(bool.constructor === Boolean);// true
console.log(num.constructor === Number);// true
console.log(str.constructor === String);// true
console.log(arr.constructor === Array);// true
console.log(obj.constructor === Object);// true
console.log(fun.constructor === Function);// true

undefined和null没有contructor属性
constructor不能判断undefined和null，并且使用它是不安全的，因为contructor的指向是可以改变的 //详情请了解js对象的特性
```



#### 使用Object.prototype.toString.call

```
console.log(Object.prototype.toString.call(bool));//[object Boolean]
console.log(Object.prototype.toString.call(num));//[object Number]
console.log(Object.prototype.toString.call(str));//[object String]
console.log(Object.prototype.toString.call(und));//[object Undefined]
console.log(Object.prototype.toString.call(nul));//[object Null]
console.log(Object.prototype.toString.call(arr));//[object Array]
console.log(Object.prototype.toString.call(obj));//[object Object]
console.log(Object.prototype.toString.call(fun));//[object Function]
```