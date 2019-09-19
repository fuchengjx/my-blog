---
title: 浅谈WebWork
date: 2019-09-16 11:02:22
category: web前端
tags: 
- WebWork
- h5
description: 使用JavaScript执行大型运算时，经常会出现假死现象，这是因为JavaScript是单线程编程语言，运算能力比较弱。HTML5新增Web Workders能够创建一个不影响前台处理的后台进程，并且在这个后台线程中可以继续创建多个子线程，以帮助JavaScript实现多线程的能力。通过WebWork, 开发者可以将耗时较长的处理交给后台线程去运行，从而解决在执行大量运算造成进程阻塞而页面无响应的情况。
---

## Web Worker的作用

Web Worker的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢。

## Web Worker 有以下几个使用注意点。

### （1）**同源限制**

分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。

### （2）**DOM 限制**

Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用`document`、`window`、`parent`这些对象。但是，Worker 线程可以`navigator`对象和`location`对象。

### （3）**通信联系**

Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。

### （4）**脚本限制**

Worker 线程不能执行`alert()`方法和`confirm()`方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求。

### （5）**文件限制**

Worker 线程无法读取本地文件，即不能打开本机的文件系统（`file://`），它所加载的脚本，必须来自网络。

小结：Web Worker中执行的脚本不能访问该页面的window对象，因此不能直接访问web页面和DOM API，虽然Web Worker不会导致浏览器的主线程停止响应，但是仍会消耗CPU周期，导致系统反应速度变慢。



## 基本用法

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>worker</title>
</head>
<body>
<button onclick="start()">Start Worker</button>
<p id="result">这是没有值</p>
<script>
  function start() {
    console.log("你有触发start")
    if (typeof (Worker) !== "undefined") {
    console.log('支持worker')
    // 创建一个Worker对象并向它传递将在新线程中执行的脚步的URL
    var worker = new Worker("worker.js")
    worker.postMessage("hello world") // 向worker发送数据
    worker.onmessage = function (res) { // 接受worker传过来的数据函数
      document.getElementById("result").innerHTML = res.data
      console.log("输出从worker发送过来的数据: ", res.data)
     }
    } else {
      alert('不支持worker')
    }
  }
</script>
</body>
</html>
```

```worker.js
onmessage = function (params) {
  let data = params.data // 获取主线程发送过来的数据
  console.log('worker收到的data ', data) 
  postMessage(data)  // 将获取到的数据发送回主线程
}
```

...这里遇到了些问题, google浏览器一直报错

![google报错](http://img.flura.cn/1568774603784.png)

stackoverflow解答： google有文件保护，导致我不能直接读取本地文件。。。(其实我有尝试过吧worker.js放在cdn上，用http方式引入，但是还是这样的报错)

```Stack Overflow
From this answer, Loading a local file, even with a relative URL, is the same as loading a file with the file: protocol. -- and it's not cool for web pages to be able to just access your file system on a whim
```

解决方法

![1568774001322](http://img.flura.cn/1568774001322.png)

我采用了这种方法，但是还是没有什么用。。。可能我什么地方搞错了吧。所以我尝试换了一个火狐浏览器，发现火狐连报错都没有，work根本就没有执行(太坑人了)。

![火狐报错](http://img.flura.cn/1568774930762.png)

最后换了edge，发现才有用(꒦_꒦) 。

![1568775124601](http://img.flura.cn/1568775141089.png)

## 基本API

`Worker()`构造函数返回一个 Worker 线程对象，用来供主线程操作 Worker。Worker 线程对象的属性和方法：

- Worker.onerror：指定 error 事件的监听函数。

- Worker.onmessage：指定 message 事件的监听函数，发送过来的数据在`Event.data`属性中。
- Worker.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
- Worker.postMessage()：向 Worker 线程发送消息。
- Worker.terminate()：立即终止 Worker 线程。

### 注意的地方

主线程与Worker之间的通信内容是拷贝内容，就是说postMessage传值，传的是深拷贝的值，也就是说work.js里对通信内容的修改不会影响到主线程。事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给 Worker，后者再将它还原。

 Worker 不能读取本地文件，所以这个脚本必须来自网络。如果下载没有成功（比如404错误），Worker 就会默默地失败。emmmm，所以应该部署到服务器上。。。不然浏览器不认，还有同源限制。所以本地调试最好用edge ie浏览器。



最后更详细的使用 最好参考阮一峰老师的[Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)

[MDN关于web workers使用](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)