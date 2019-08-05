---
title: DOM详解
date: 2019-03-25 16:05:11
categories: web前端
tags: 
- js
---

# DOM

### JavaScript 的组成

| 组成部分   | 说明                               |
| ---------- | ---------------------------------- |
| Ecmascript | 描述了该语言的语法和基本对象       |
| DOM        | 描述了处理网页内容的方法和接口     |
| BOM        | 描述了与浏览器进行交互的方法和接口 |

**DOM**(文档对象模型)是针对HTML和XML文档的一个API(应用程序编程接口)。DOM描绘了一个层次化的节点树，允许开发人员添加、移除和修改页面的某一部分。

DOM 以树结构表达 HTML 文档。

![DOM HTML tree](http://www.runoob.com/images/htmltree.gif)



## 获取元素

### getElementById

*根据id属性的值获取元素,返回来的是一个元素对象*。  还有注意因为js区分大小写，所以写这个元素不能写错了，否者都得不到正确的结果。

*document.getElementById("id属性的值");*

### getElementsByTagName

*根据标签名字获取元素,返回来的是一个伪数组,里面保存了多个的DOM对象*

document.getElementsByTagName("标签名字");

返回的 HTML集合是动态的, 意味着它可以自动更新自己来保持和 DOM 树的同步而不用再次调用document.getElementsByTagName("标签名字");

### getElementsByClassName

*document.getElementsByClassName("类样式的名字")
\* 根据选择器获取元素,返回来的是一个伪数组*

### getElementsByName

*document.getElementsByName("name**属性的值")*

*根据name属性的值获取元素,返回来的是一个伪数组,里面保存了多个的DOM对象*

### *querySelector*

*根据选择器获取元素,返回来的是一个元素对象*  

document.querySelector("选择器的名字");

```
document.querySelector`返回第一个匹配的元素，如果没有匹配的元素，则返回 null
```

**语法**

```
  var element = document.querySelector(selectors);
```

注意，由于返回的是第一个匹配的元素，这个api使用的深度优先搜索来获取元素。

例子：

```
<body>
  <div>
    <div>
      <span class="test">第三级的span</span>	
    </div>
  </div>
  <div class="test">			
    同级的第二个div
  </div>
  <input type="button" id="btnGet" value="获取test元素" />
</body>
<script>
  document.getElementById("btnGet").addEventListener("click",function(){
    var element = document.querySelector(".test");
    alert(element.textContent);
  })
</script>
复制代码
```

两个`class`都包含“test”的元素，一个在文档树的前面，但是它在第三级，另一个在文档树的后面，但它在第一级，通过`querySelector`获取元素时，它通过深度优先搜索，拿到文档树前面的第三级的元素。



### *querySelectorAll*

*根据选择器获取元素,返回来的是一个伪数组,里面保存了多个的DOM对象*

querySelectorAll()方法接受的参数，也是一个css选择器，返回的是所有匹配到的元素。返回的是一个NodeLIst的实例。

document.querySelectorAll("选择器的名字")



## 获取和设置属性

### getAttribute

object.getAttribute(attribute)

### setArribute

setAttribute(attribute,value)

getAttribute()和setAttribute()方法不属于document对象，所以不能通过document对象调用，它只能通过元素节点对象调用。

这里有一个细节：通过setAttribute对文档做出修改之后，在通过浏览器查看源代码时看到的仍将是改变前的属性值，也就是说setAttribute做出的修改不会反映在文档本身的源代码里，这种“表里不一”的现象源自DOM的工作模式：先加载文档的静态内容，再动态刷新，动态刷新不影响文档的静态内容。这正是DOM的真正威力：对页面的内容进行刷新却不需要再浏览器里面刷新。



## Node

### childNodes属性

```
由childNodes属性返回的数组包含所有类型的节点，而不仅是元素节点。 事实上，文档里几乎每一个东西都是一个节点，甚至连空格和换行都会被解释为节点，而他们也包含在childNodes属性返回的数组中.
```

firstChild和lastChild属性

firstChild 等价于 node.childNodes[0]



### nodeType属性

nodeType属性共有12种可取值，但只有3中具有实用价值。

**元素节点**的nodeType属性值是1 

**属性节点**的nodeType属性值是2

**文本节点**的nodeType属性值是3

### nodeName和nodeValue

nodeName 返回当前节点的节点名称   节点的名字:大写的标签--标签,小写的属性名---属性,#text---文本

nodeValue 返回或设置指定节点的节点值。  标签---null,属性--属性的值,文本--文本内容

ps: 对于元素节点nodeName 中保存的始终是元素的标签名 **大写的标签--标签**， nodeValue保存的值始终是NULL



`<p>我是p里面的value</p>`

怎获取p标签里的文本？

document.querySelector("p").childNodes(0).nodeValue



ps: 在编写DOM脚本时，你会理所当然的认为某个节点肯定是一个元素节点，这是一种相当常见的错误。如果没有100%的把握，就一定要检查nodeType属性值。有很多DOM方法只能用于元素节点，如果用在文本节点身上，就会出错。



## 元素创建

### document.write

document.write("标签的代码及内容");
document.write(‘新设置的内容<p>标签也可以生成</p>');
 document.write()创建元素缺陷:如果是在页面加载完毕后,此时通过这种方式创建元素,那么页面上存在的所有的内容全部被干掉

缺点： 违背了“行为与表现分离”的原则

```
<body>
<script>
  document.write("<p>hhh我是p标签</p>")
</script>
...
</body>
```

### innerHTML

及支持读取，也支持写入，它不仅可以用来读取HTML内容，还可以用它把HTML内容写入元素。

对象.innerHTML="标签及代码";
var box = document.getElementById('box');
box.innerHTML = '新内容<p>新标签</p>';

innerHTML 会根据指定的值创建新的DOM树，然后用这个DOM树完全替换调用元素的所有子节点。

### createElement和appendChild

document.createElement("标签的名字");

//创建元素  这个方法只能创建元素节点，这个节点是空白的。

*//document.createElement("**标签名字");  对象 //把元素追加到父级元素中*

var div = document.createElement('div');

document.body.appendChild(div);

### createTextNode

创建文本节点

document.createTextNode("Hellow world")



### insertBefore

在已有元素前插入一个新元素

parentElement.inserBefore(newElement, targetElement)

(1)新元素: 你想插入的元素 (newELement)

(2)目标元素：你想把这个新元素插入到哪个元素(targetElement)之前

(3)父元素：目标元素的父元素(parentElement)



## 运用dom设置样式

### style属性

文档中的每一个元素都是一个对象，每一个对象都有各种各样的属性。  每个元素节点都有一个style属性。 style属性包含着元素的样式，查询这个属性将返回一个对象而不是一个简单的字符串。样式都存放在这个style对象里。

element.style

element.style.fontFamily

当你需要引用一个中间带减号的css属性时，DOM要求你用驼峰命名法。 css属性font-family 用fontFamily

element.style.border = "1px solid red"

### getComputedStyle()

要确定某个元素的计算样式(包括应用给它的所有css规则)，可以用这个方法

最重要的一条是要记住所有计算的样式都只是可读的；不能修改计算后样式对象的css属性。

window.getComputedStyle():可以获取当前元素所有最终使用的CSS属性值。

   1: window.getComputedStyle("元素", "伪类");

这个方法接受两个参数：要取得计算样式的元素和一个伪元素字符串（例如“:before”） 。如果不需要伪元素信息，第二个参数可以是null。也可以通过document.defaultView.getComputedStyle(“元素”, “伪类”);来使用

   1: var ele = document.getElementById('ele');

   2: var styles = window.getComputedStyle(ele,null);

   3: styles.color;  //获取颜色

可以通过style.length来查看浏览器默认样式的个数。IE6-8不支持该方法，需要使用后面的方法。对于Firefox和Safari，会把颜色转换成rgb格式。

## 相关扩展

### innerHTML与innerText

*总结:如果使用innerText主要是设置文本的,设置标签内容,是没有标签的效果的 *

*//总结:innerHTML是可以设置文本内容 //*

*总结:innerHTML主要的作用是在标签中设置新的html标签内容,是有标签效果的*

- //总结:想要设置标签内容,使用innerHTML,想要设置文本内容,innerText或者textContent,或者innerHTML,推荐用innerHTML   
- //获取的时候: //innerText可以获取标签中间的文本内容,但是标签中如果还有标签,那么最里面的标签的文本内容也能获取.---获取不到标签的,文本可以获取 
- //innerHTML才是真正的获取标签中间的所有内容*

结论: //如果想要(获取)标签及内容,使用innerHTML //如果想要设置标签,使用innerHTML //想要设置文本,用innerText,或者innerHTML,或者textContent*



ps: innerText 成对的标签都可以用这个改变值

​	

### 获取元素的宽和高

```
,应该使用offset系列来获取

/*

*

* offset系列:获取元素的宽,高,left,top, offsetParent

* offsetWidth:元素的宽,有边框

* offsetHeight:元素的高,有边框

* offsetLeft:元素距离左边位置的值

* offsetTop:元素距离上面位置的值

*

* scroll系列:卷曲出去的值

* scrollLeft:向左卷曲出去的距离

* scrollTop:向上卷曲出去的距离

* scrollWidth:元素中内容的实际的宽(如果内容很少,没有内容,元素自身的宽),没有边框

* scrollHeight:元素中内容的实际的高(如果内容很少或者没有内容,元素自身的高),没有边框

*

* client系列:可视区域

* clientWidth:可视区域的宽(没有边框),边框内部的宽度

* clientHeight:可视区域的高(没有边框),边框内部的高度

* clientLeft:左边边框的宽度

*clientTop :上面的边框的宽度
```

 

没有脱离文档流:

- offsetLeft:父级元素margin+父级元素padding+父级元素的border+自己的margin

脱离文档流了

- ###### 主要是自己的left和自己的margin



## Jquery DOM操作

### jQuery对象与DOM对象的区别

```
1. DOM对象：使用JavaScript中的方法获取页面中的元素返回的对象就是dom对象。
2. jQuery对象：jquery对象就是使用jquery的方法获取页面中的元素返回的对象就是jQuery对象。
3. jQuery对象其实就是DOM对象的包装集（包装了DOM对象的集合（伪数组））
4. DOM``对象与jQuery对象的方法不能混用。
```

·  [jquery](http://lib.csdn.net/base/jquery)对象就是通过jQuery包装DOM对象后产生的对象。jQuery对象是jQuery独有的，其可以使用jQuery里的方法，但是不能使用DOM的方法;反过来Dom对象也不能使用jquery的方法

 

### Jquery对象与js对象的区别

1.jQuery对象属于js的数组；

2.jQuery对象是通过jQuery包装的DOM对象后产生的;

3.jQuery对象不能使用DOM对象的方法和属性

4.DOM对象不能使用jQuery对象的方法和属性

```
 
```

### DOM对象转换成jQuery对象

```
var $obj = $(domObj);
// $(document).ready(function(){});就是典型的DOM对象转jQuery对象
```

jQuery对象转换成DOM对象：

```
var $li = $(“li”);
//第一种方法（推荐使用）
$li[0]
//第二种方法
$li.get(0)
 
DOM对象转jquery对象
var $obj = $(domObj);
// $(document).ready(function(){});就是典型的DOM对象转jQuery对象
```



### 添加css样式

```


$("li").css({//对象 所以可以添加多个样式

'background-color','fff';

'color','rga(0,0,0)';

//

});

 

addClass(name);

//给所有的div添加one的样式

$("div").addClass("one");

removeClass();

//移除div中one的样式类名

$("div").removeClass("one");

$("div").hasClass("one"); 

判断div是否有one的样式

 

 

$(function(){

$("input").eq(0).click(function(){

$("li").addClass("bigger");   //在原来的基础上再给我加上名为bigger的一个类。

});

})

$("li").removeClass("bigger")   //移除一个名为bigger的css类.

         hasClass("类名")  // 判断类返回true，fasle；

         toggleClass("类名")  //切换类

 

<!--样式：在style里面写的，用css来操作-->

```

### 添加属性

```


<!--属性：在标签里面写的，用attr来操作-->    /*js原生用getAttribute("样式名")获得样式属性 setAttribute("样式名","样式属性")*/

$("img").attr("attr","xx值")  

({

    "attr":"xx";

    "attr":"xx";

    "attr":"xx";

})

也可以获得样式的值

/*对于返回布尔值的属性  用prop*/
```

 

 

### 动画

show()  //不传参数，只有显示功能，无动画

show([speed],[callback])  //speed动画持续的时间 单位毫秒

​                          //callback 回调函数  动画执行完执行该函数

hide() 隐藏

slideUp() 上滑  slideDown() 下滑     slideToggle() 切换滑入滑出

淡入：fadeIn()   淡出fadeOut()

fadeTo(duration,opacity)    duration时间  opacity 0~1 透明度

 

自定义动画

animate(css属性,[duration],[easing],[callback])

​        {width:100%,     {swing:秋千，摇摆速度                    

​         heigth:100%}     linear:匀速       }          

动画队列   .animate({left:500px}).animate({top:500px}).animate({}).

​          \\一个一个挨个执行

​                             

### 节点                                                                                                               

添加节点 

```
$("div").append($("p"));    添加到父节点里 最后面

$("p").appendTo($("div"));  把子元素添加到父元素里面（最后）  //preappend 添加到最前面

$("p").after($("p"));  兄弟元素后面   (before)

 

清空一个元素的内容

$("div").empty();     $("div").html(" ");//这个会引发内存泄漏

移除一个元素              

$("div").remove();

克隆一个元素

$("div").clone([bool]) //false:默认值 不会复制事件  true：会复制事件

$("<li></li>") 创建了一个li

```

 

 

### jQuery特殊属性操作

#### 1.1. val方法

val方法用于设置和获取表单元素的值，例如input、textarea的值

```
//设置值
$("#name").val(“张三”);
//获取值
$("#name").val();
 
```

#### 1.2. html方法与text方法

html方法相当于innerHTML text方法相当于innerText

```
//``设置内容
$(“div”).html(“<span>这是一段内容</span>”);
//``获取内容
$(“div”).html()
```

区别：html方法会识别html标签，text方法会那内容直接当成字符串，并不会识别html标签。



## vue的DOM 操作

- 救命稻草, 前端框架就是为了减少DOM操作，但是特定情况下，也给你留了后门
- 在指定的元素上，添加ref="名称A"
- 在获取的地方加入 this.$refs.名称A  
  - 如果ref放在了原生DOM元素上，获取的数据就是原生DOM对象
    - 可以直接操作
  - 如果ref放在了组件对象上，获取的就是组件对象
    - 1:获取到DOM对象,通过this.$refs.sub.$el,进行操作
  - 对应的事件
    - created 完成了数据的初始化，此时还未生成DOM，无法操作DOM
    - mounted 将数据已经装载到了DOM之上,可以操作DOM

