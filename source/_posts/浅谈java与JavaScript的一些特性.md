---
title: 浅谈java与JavaScript的一些特性
date: 2019-04-22 16:16:06
categories: 杂项
tags: 
- java 
- js
---

## java简介

![](https://upload.wikimedia.org/wikipedia/zh/8/88/Java_logo.png)

### java的历史

Java是由Sun Microsystems公司（现已被oracle公司收购）于1995年5月推出的Java面向对象程序设计语言和Java平台的总称。由James Gosling和同事们共同研发，并在1995年正式推出，据oracle官方数据指数，目前全球已有上亿的系统是使用Java开发的。Java是一门面向对象编程语言，不仅吸收了C++语言的各种优点，还摒弃了C++里难以理解的多继承、指针等概念，因此Java语言具有功能强大和简单易用两个特征。Java语言作为静态面向对象编程语言的代表，极好地实现了面向对象理论，允许程序员以优雅的思维方式进行复杂的编程。

Java具有简单性、面向对象、分布式、健壮性、安全性、平台独立与可移植性、多线程、动态性等特点 。

Java分为三个体系：

- Java SE (java Standard Edition) 可以用来开发客户端的应用程序。应用程序可以在桌面计算机中运行
- Java EE (java Enterprise Edition) 可以用来开发服务端的应用程序
- Java ME  (java Micro Edition) 用来开发移动设备的应用程序

Java是一门面向对象编程语言，不仅吸收了C++语言的各种优点，还摒弃了C++里难以理解的多继承、指针等概念，因此Java语言具有功能强大和简单易用两个特征。Java语言作为静态面向对象编程语言的代表，极好地实现了面向对象理论，允许程序员以优雅的思维方式进行复杂的编程。

### java的特性

#### 简单性

java语言是简单的，java的语法与c语言和c++语言非常接近，使得大多数程序员非常易学习和使用。另一方面，Java丢弃了C++中很少使用的、很难理解的、令人迷惑的那些特性，如操作符重载、多继承、自动的强制类型转换。特别地，Java语言不使用指针，而是引用。并提供了自动的废料收集，使得程序员不必为内存管理而担忧。

#### 面对对象

Java语言提供类、接口和继承等原语，为了简单起见，只支持类之间的单继承，但支持接口之间的多继承，并支持类与接口之间的实现机制（关键字为implements）。Java语言全面支持动态绑定，而C++语言只对虚函数使用动态绑定。总之，Java语言是一个纯的面向对象程序设计语言。

#### 健壮性

Java的强类型机制、异常处理、垃圾的自动收集等是Java程序健壮性的重要保证。对指针的丢弃是Java的明智选择。Java的安全检查机制使得Java更具健壮性。

#### 安全性

Java通常被用在网络环境中，为此，Java提供了一个安全机制以防恶意代码的攻击。除了Java语言具有的许多安全特性以外，Java对通过网络下载的类具有一个安全防范机制（类ClassLoader），如分配不同的名字空间以防替代本地的同名类、字节代码检查，并提供安全管理机制（类SecurityManager）让Java应用设置安全哨兵。

#### 跨平台的

Java程序（后缀为.java的文件）在Java平台上被编译为体系结构中立的字节码格式（后缀为.class的文件），然后可以在实现这个Java平台的任何系统中（windows，mac，linux等）运行，真正的实现了一次编译多处运行的效果。这种途径适合于异构的网络环境和软件的分发。

#### 高性能的

与那些解释型的高级脚本语言相比，Java的确是高性能的。事实上，Java的运行速度随着JIT(Just-In-Time）编译器技术的发展越来越接近于C++。

#### 多线程

在Java语言中，线程是一种特殊的对象，它必须由Thread类或其子（孙）类来创建。通常有两种方法来创建线程：其一，使用型构为Thread(Runnable)的构造子将一个实现了Runnable接口的对象包装成一个线程，其二，从Thread类派生出子类并重写run方法，使用该子类创建的对象即为线程。值得注意的是Thread类已经实现了Runnable接口，因此，任何一个线程均有它的run方法，而run方法中包含了线程所要运行的代码。线程的活动由一组方法来控制。Java语言支持多个线程的同时执行，并提供多线程之间的同步机制（关键字为synchronized）。

#### 动态的

java的类能够动态的被载入到运行环境，也可以通过网络来载入所需要的类。这也有利于软件的升级。另外，java中的类有一个运行时刻的表示，能进行运行时刻的检查。

### java用途

1. 桌面GUI应用程序
2. 移动应用程序
3. 嵌入式系统

4. Web应用程序
5. Web服务器和应用程序服务器
6. 企业应用程序
7. 科学应用

### java关键术语

java Development Toolkit (JDK) (java开发工具包)

java Runtime Environment(JRE)(java运行环境)

java Virtual Machine(JVM) (java虚拟机)

​	   javac 把源文件（java文件）编译生成class文件

​          Java 执行java字节码

​          Javap 可以查看java编译器生成的字节码（反汇编）

​          Jshell  java的交互式命令环境

​          Jconsole  一个内置的java性能分析器，用来监控java应用程序性能和跟踪java

## JavaScript简介

![](https://www.yaoyanghui.com/Uploads/201812/shareasale%20tracking%20code%20logo.png)

### JavaScript的历史

Netscape在最初将其脚本语言命名为LiveScript，后来Netscape在与Sun合作之后将其改名为JavaScript。JavaScript最初受Java启发而开始设计的，目的之一就是“看上去像Java”，因此语法上有类似之处，一些名称和命名规范也借自Java。JavaScript与Java名称上的近似，是当时Netscape为了营销考虑与Sun微系统达成协议的结果。但是就目前来看java与js之间的区别就如同雷锋与雷峰塔的区别。

### JavaScript的特性

JavaScript 是一门跨平台、面向对象的脚本语言，它能够让网页具有交互（例如具有复杂的动画，可点击的按钮，通俗的菜单等）。另外还有高级的服务端Javascript版本，例如Node.js，它可以让你在网页上添加更多功能，不仅仅是下载文件（例如在多台电脑之间的协同合作）。在宿主环境（例如 web 浏览器）中， JavaScript 能够通过其所连接的环境提供的编程接口进行控制。

### JavaScript组成

1. ECMAScript - JavaScript的核心

   ​	ECMA 欧洲计算机制造联合会

   ​	网景：JavaScript

   ​	微软：JScript

   ​	定义了JavaScript的语法规范  

   ​	JavaScript的核心，描述了语言的基本语法和数据类型，ECMAScript是一套标准，定义了一种语言的标准与具体实现无关

2. BOM - 浏览器对象模型

   ​	一套操作浏览器功能的API

   ​	通过BOM可以操作浏览器窗口，比如：弹出框、控制浏览器跳转、获取分辨率等

3. DOM - 文档对象模型

   ​	一套操作页面元素的API

   ​	DOM可以把HTML看做是文档树，通过DOM提供的API可以对树上的节点进行操作

### JavaScript的用途

web开发

- jQuery、BootStrap、Angular、React、Vue

后端开发

- Node.js

桌面应用(Linux,  Mac OS X, Windows)

- Electorn
- NW.js

Hybird移动应用开发

- PhoneGap

Native移动引用开发

- React Native
- Weex
- NativeScript

嵌入式/物联网开发

- IoT

### JavaScript的发展

**ECMAScript6(ES6)**

**Babel**(https://babeljs.io/)，一个广泛使用的ES6编译器，可以将es6代码转为es5代码，从而在现有的环境中执行

**TypeScrip**t(https://www.typescriptlang.org/)是js的强类型版本，ts是js的超集(类似于c与c++的关系)。它为js的生态增加了静态类型检查机制，并最终将代码编译为纯粹的js代码。使用TypeScript有以下几个优点

- 静态类型检查(编一阶段即可发现类型不匹配的错误)
- IDE智能提示
- 类型信息有利于编译器优化

**FLow**(https://flow.org/)针对js弱类型问题，Facebook也推出了Flow。

## javaScript和java的对比

JavaScript 和 Java 有一些共性但是在另一些方面有着根本性区别。JavaScript语言类似 Java 但是并没有 Java 的静态类型和强类型检查特性。JavaScript 遵循了 Java 的表达式语法，命名规范以及基础流程控制，这也是 JavaScript 从 LiveScript 更名的原因。

与 Java 通过声明的方式构建类的编译时系统不同，JavaScript 采用基于少量的数据类型如数字、布尔、字符串值的运行时系统。JavaScript 拥有基于原型的对象模型提供的动态继承；也就是说，独立对象的继承是可以改变的。 JavaScript 支持匿名函数。 函数也可以作为对象的属性被当做宽松的类型方式执行。

与 Java 相比，Javascript 是一门形式自由的语言。你不必声明所有的变量，类和方法。你不必关心方法是否是 共有、私有或者受保护的，也不需要实现接口。无需显式指定变量、参数、方法返回值的数据类型。

Java 是基于类的编程语言，设计的初衷就是为了确保快速执行和类型安全。类型安全，举个例子，你不能将一个 Java 整数变量转化为一个对象引用，或者由Java字节码访问专有存储器。Java基于类的模型，意味着程序包含专有的类及其方法。Java的类继承和强类型要求紧耦合的对象层级结构。这些要求使得Java编程比JavaScript要复杂的多。

相比之下，JavaScript 传承了 HyperTalk 和 dBASE 语句精简、动态类型等精髓，这些脚本语言为更多开发者提供了一种语法简单、内置功能强大以及用最小需求创建对象的编程工具。



#### javaScript

1. 面对对象。不区分对象类型。通过原型机制继承，任何对象的属性和方法均可以被动态添加。
2. 变量类型不需要提前申明(动态类型)
3. 不懂直接自动写入硬盘

#### java

1. 基于类系统。分为类和实例，通过类层级的定义实现继承。不能动态增加对象或类的属性或方法
2. 变量类型必须提前申明(静态类型)
3. 可以直接自动写入硬盘

### 基于类、基于原型的面对对象

**基于类的**面向对象语言，比如 Java 和 C++，是构建在两个不同实体的概念之上的：即类和实例。

- 类可以定义属性，这些属性可使特定的对象集合特征化（可以将 Java 中的方法和变量以及 C++ 中的成员都视作属性）。类是抽象的，而不是其所描述的对象集合中的任何特定的个体。例如 `Employee` 类可以用来表示所有雇员的集合。
- 另一方面，一个实例是一个类的实例化；也就是其中一名成员。例如， `Victoria` 可以是 `Employee` 类的一个实例，表示一个特定的雇员个体。实例具有和其父类完全一致的属性。

**基于原型**的语言（如 JavaScript）并不存在这种区别：它只有对象。基于原型的语言具有所谓原型对象的概念。原型对象可以作为一个模板，新对象可以从中获得原始的属性。任何对象都可以指定其自身的属性，既可以是创建时也可以在运行时创建。而且，任何对象都可以作为另一个对象的原型，从而允许后者共享前者的属性。

``

#### 定义类

在基于类的语言中，需要专门的类定义符来定义类。在定义类时，允许定义特殊的方法，称为构造器，来创建该类的实例。在构造器方法中，可以指定实例的属性的初始值以及一些其他的操作。你可以通过将`new` 操作符和构造器方法结合来创建类的实例。

```java
//java定义类
public class Dog{ //类名
    int age = 5; //数据域
    String color;
    Dog() {} //构造方法
    void barking(){} //方法
    void hungry(){}
    void sleeping(){}
}
public static void main(String[] args) {
    Dog dog1 = new Dog(); //实例化对象
}

```

JavaScript 也遵循类似的模型，但却不同于基于类的语言。在 JavaScript 中你只需要定义构造函数来创建具有一组特定的初始属性和属性值的对象。任何 JavaScript 函数都可以用作构造器。 也可以使用 `new` 操作符和构造函数来创建一个新对象。

```js
//js自定义构造函数
function Person(name,age,job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayHi = function(){
  	console.log('Hello,everyBody');
  }
}
var p1 = new Person('张三', 22, 'actor'); //对象实例化
```

#### 子类和继承

基于类的语言是通过对类的定义中构建类的层级结构的。在类定义中，可以指定新的类是一个现存的类的子类。子类将继承父类的全部属性，并可以添加新的属性或者修改继承的属性。例如，假设 `Employee` 类只有 `name` 和 `dept` 属性，而 `Manager` 是 `Employee` 的子类并添加了 `reports` 属性。这时，`Manager` 类的实例将具有所有三个属性：`name`，`dept`和`reports`。

```
class Employee {
    String name = "张三";
    String dept = "学生会";
}
public class Manager extends Employee {
    String reports = "fa";
}
```

JavaScript 通过将构造器函数与原型对象相关联的方式来实现继承。这样，您可以创建完全一样的 `Employee` — `Manager` 示例，不过需要使用略微不同的术语。首先，定义Employee构造函数，在该构造函数内定义name、dept属性；接下来，定义Manager构造函数，在该构造函数内调用Employee构造函数，并定义reports属性；最后，将一个获得了Employee.prototype(Employee构造函数原型)的新对象赋予manager构造函数，以作为Manager构造函数的原型。之后当你创建新的Manager对象实例时，该实例会从Employee对象继承name、dept属性。

```js
function Employee(name, dept) {
    this.name = name
    this.dept = dept
}
function Manager(reports) {
    this.reports = reports
}
Manager.prototype = new Employee("张三", "学生会") //原型链实现继承
var m = new Manager("记者") //对象实例化

console.log(m.name) //记者
console.log(m.reports) //张三
```



#### 添加和移除属性

在基于类的语言中，通常在编译时创建类，然后在编译时或者运行时对类的实例进行实例化。一旦定义了类，无法对类的属性进行更改。然而，在 JavaScript 中，允许运行时添加或者移除任何对象的属性。如果您为一个对象中添加了一个属性，而这个对象又作为其它对象的原型，则以该对象作为原型的所有其它对象也将获得该属性。

#### 差异总结（基于java和原型js的对象系统比较）

#####    基于类的java

1. 类和实例是不同的事物
2. 通过类定义来定义类；通过构造器方法来实例化类
3. 通过new 操作符创建单个对象
4. 通过类定义来定义现存类的子类，从而构建对象的层级结构。
5. 遵循类链继承属性。
6. 类定义指定类的所有实例的**所有**属性。无法在运行时动态添加属性。

#####   基于原型的JavaScript

1. 所有对象均为实例。
2. 通过构造器函数来定义和创建一组对象。
3. 通过 `new` 操作符创建单个对象。
4. 指定一个对象作为原型并且与构造函数一起构建对象的层级结构
5. 遵循原型链继承属性。
6. 构造器函数或原型指定初始的属性集。允许动态地向单个的对象或者整个对象集中添加或移除属性。