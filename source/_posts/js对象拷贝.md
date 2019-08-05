---
title: js对象拷贝
date: 2019-07-16 15:28:47
category: web前端
tags: 
- js
---

## 对象介绍

js中包含两种不同数据类型的值: 基本类型值和引用类型值。 **基本类型值**指的是简单的数据段，而引用类型值指的是那些由可能由多个值构成的对象。

js对象都是引用类型，对象是某个特定引用类型的实例。对象是js的基本块。对象是属性的集合，属性是键值对。js中看到的大多数引用类型都是Object类型的实例，Object也是js中使用最多的一个类型。

### 按引用赋值

```
let obj1 = {
	name : 'jack',
	number: 10
}
let obj2 = obj1 // 将obj1的引用赋值给obj2 此时obj1、obj2指向同一块内存空间
obj2.name = 'tom'
console.log(obj1.name) // tom
```

但从一个变量像另一个变量复制引用类型的值时，同样也会将存储在变量对象中的值复制一份放到位新的变量分配的空间中。不同的是，这个值的副本实际是一个指针，而这个指针指向存储在堆中的一个对象。复制操作结束后，两个变量实际上将引用同一个对象。因此改变其中一个变量就会改变另一个变量。

### 对象的拷贝方式

#### 1. 复制对象的原始方法是循环遍历原始对象，然后一个接一个地复制每个属性。

```
let objCopy = {}; // objCopy 将存储 mainObj 的副本

function copy(mainObj) {
  let key;
 
  for (key in mainObj) {
    objCopy[key] = mainObj[key]; // 将每个属性复制到objCopy对象
  }
  return objCopy;
}
 
const mainObj = {
  a: 2,
  b: 5,
  c: {
    x: 7,
    y: 4,
  },
}
 
console.log(copy(mainObj));
objCopy.c.x = 10086
console.log("mainObj.c.x", mainObj.c.x)  // 10086
```

上面的代码只复制了 `mainObj` 的可枚举属性。

如果原始对象中的一个属性本身就是一个对象，那么副本和原始对象之间将共享这个对象，从而使其各自的属性指向同一个对象。



#### 2.**浅拷贝**

浅拷贝是对象共用一个内存地址，对象的变化相互影响。比如常见的赋值引用就是浅拷贝:

```
let obj1 = {
	name : 'jack',
	number: 10
}
let obj2 = obj1 // 将obj1的引用赋值给obj2 此时obj1、obj2指向同一块内存空间
obj2.name = 'tom'
console.log(obj1.name) // tom
```

##### **Object.assign()**

```
let obj = {
  a: 1,
  b: {
    c: 2,
  },
}
let newObj = Object.assign({}, obj);
console.log(newObj); // { a: 1, b: { c: 2} }
 
obj.a = 10;
console.log(obj); // { a: 10, b: { c: 2} }
console.log(newObj); // { a: 1, b: { c: 2} }
 
newObj.a = 20;
console.log(obj); // { a: 10, b: { c: 2} }
console.log(newObj); // { a: 20, b: { c: 2} }
 
newObj.b.c = 30;
console.log(obj); // { a: 10, b: { c: 30} }
console.log(newObj); // { a: 20, b: { c: 30} }
 
// 注意: newObj.b.c = 30; 为什么呢..
```

`bject.assign` 只是浅拷贝。 `newObj.b` 和 `obj.b` 都引用同一个对象，没有单独拷贝，而是复制了对该对象的引用。任何对对象属性的更改都适用于使用该对象的所有引用。

注意：原型链上的属性和不可枚举的属性不能复制。

```
let someObj = {
  a: 2,
}
 
let obj = Object.create(someObj, { 
  b: {
    value: 2,  
  },
  c: {
    value: 3,
    enumerable: true,  
  },
});
 
let objCopy = Object.assign({}, obj);
console.log(objCopy); // { c: 3 }
```

`someObj` 是在 `obj` 的原型链，所以它不会被复制。
属性 `b` 是不可枚举属性。
属性 `c` 具有 可枚举(enumerable) 属性描述符，所以它可以枚举。 这就是为什么它会被复制。

##### 使用展开操作符(…)

ES6已经有了用于数组解构赋值的 rest 元素，和实现的数组字面展开的操作符。

```
const array = [
"a", "c", "d", { four: 4 },
];
const newArray = [...array];
console.log(newArray);
// 结果 
// ["a", "c", "d", { four: 4 }]
```

只对浅拷贝有效



#### 3.**深拷贝**

简单理解深拷贝是将对象放到一个新的内存中，两个对象的改变不会相互影响。

##### JSON.parse() 和 JSON.stringify()

```
srcObj = {'name': '明', grade: {'chi': '50', 'eng': '50'} };
// copyObj2 = Object.assign({}, srcObj);
copyObj2 = JSON.parse(JSON.stringify(srcObj));
copyObj2.name = '红';
copyObj2.grade.chi = '60';
console.log('JSON srcObj', srcObj); // { name: '明', grade: { chi: '50', eng: '50' } }
```

可以看到改变copyObj2并没有改变原始对象，实现了基本的深拷贝。
但是用JSON.parse()和JSON.stringify()会有一个问题。
JSON.parse()和JSON.stringify()能正确处理的对象只有Number、String、Array等能够被json表示的数据结构，因此函数这种不能被json表示的类型将不能被正确处理。比如

```
srcObj = {'name': '明', grade: {'chi': '50', 'eng': '50'},
    'hello': function() {console.log('hello')}};
// copyObj2 = Object.assign({}, srcObj);
copyObj2 = JSON.parse(JSON.stringify(srcObj));
copyObj2.name = '红';
copyObj2.grade.chi = '60';
console.log('JSON srcObj', copyObj2); //{ name: '红', grade: { chi: '60', eng: '50' } }
```

可以看出，经过转换之后，function丢失了，因此JSON.parse()和JSON.stringify()还是需要谨慎使用。



## 数组的深拷贝和浅拷贝

最后在补充一点数组的深拷贝和浅拷贝，同对象一样数组的浅拷贝也是改变其中一个会相互影响，比如:

```
let srcArr = [1, 2, 3];
let copyArr = srcArr;
copyArr[0] = '0';
console.log('srcArr', srcArr); // ['0', 2, 3]
```

但是数组的深拷贝方法要相对简单一些可以理解为数组方法中那些会改变原数组的方法，比如

- concat
- slice
- es6 的Array.from