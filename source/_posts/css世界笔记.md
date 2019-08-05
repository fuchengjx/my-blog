---
title: css世界笔记
date: 2019-05-28 10:09:40
categories: web前端
tags: 
- css
---

这是我浅读<<css世界>>的一些体会与笔记

## css流

**流**: 就是"文档流", "流"实际上是css世界中的一种基本的定位和布局机制，与现实中的水流有着异曲同工的表现。所谓流，就是css世界中引导元素排列和定位的一条看不见的"水流"。

### 流体布局

指的是利用元素"流"的特性实现的各类布局效果。<div>是典型的具有"流"特性的元素。



## 流、元素与基本尺寸

HTML中虽然标签种类繁多，但通常我们就把它们分为两类：块级元素(block-level element)和内联元素(inline element)。

### 块级元素

常见的块级元素有div、li和table等，它们都符合块级元素的基本特征---也就是一个水平流上只能单独显示一个元素，多个块级元素则换行显示。



每个元素都有两个盒子，外在盒子和内在盒子。外在盒子负责元素是可以一行显示，还是只能换行显示；内在盒子负责宽高、内容呈现什么的。 按照display的属性值不同，值为block的元素的盒子实际由外在的"块级盒子"和内在的"块级容器盒子"组成，值为inline-block的元素则由外在的"内联盒子"和内在的"块级容器盒子"组成，值为inline的元素则是内外均为"内联盒子"。

这也就是为什么属性为inline-block的元素既能和图文一行显示，又能直接设置width/height的原因了，因为有两个盒子，外面的盒子是inline级别，里面的盒子是block级别。

### width/height

width/height也是作用在内在盒子，也就是"容器盒子中"

width的默认值是auto。非常深藏不露的家伙，'外部尺寸'的宽带最好不要设置，因为一旦设置，流动性就会丢失

#### **格式化宽度**。

仅出现在"绝对定位模型中"，也就是出现在position属性值为absolute或fixed的元素中。在默认情况下，绝对定位元素的宽度表现是"包裹性",宽度由内部尺寸决定。 但是，有一种情况是由外部尺寸决定的，对于非替换元素，当left/right或top/bottom对立方位的属性值同时存在的时候，元素的宽度表现为"格式化宽度"，其宽度大小相对于最近的定位特性(postion属性值不少 static)的祖先元素计算。

```
div { postion: absoulte; left: 20px; right: 20px}
//该div元素相对与最近的具有定位特性的祖先元素的宽度是1000px, 则这个div元素的宽度为 960px  1000-20-20
```

此外，和上面的普通流一样，"格式化宽度"具有完全的流体性，也就是margin、border、padding和content内容区域同样会自动分配水平(和垂直)空间。

#### **最大宽度**

如果内部没有块级元素或者块级元素没有设定宽度值，则"最大宽度"实际上是最大的连续内联盒子的宽度。

#### **css流体布局下的宽度分离原则**

所谓宽度分离原则，就是css中的width属性不与影响宽度的padding/border(有时候包括margin)属性共存。也就是分两层嵌套标签写。父元素写width，子元素写padding、margin。

```
<div class="father">
	<div class="son"></div>
</div>

//css样式
.father {
	width: 180px
}
.son {
	margin: 0 20px;
	padding: 20px;
	border:1px solid;
}
//width独立占用一层标签，而padding、border、margin利用流动性在内部自适应呈现。
```

#### **改变width/height作用细节的box-sizing**

box-sizing改变了width作用的盒子。**内在盒子**：他们分别是content box、padding box、border box、margin box。默认情况下width作用在content box上的， box-sizing的作用就是可以把width作用的盒子变成其他几个。

``` 
.box1 {box-sizing: content-box} /*默认值*/
.box2 {box-sizing: padding-box} /*Firefox曾经支持过*/
.box3 {box-sizing: border-box} /*全部浏览器支持 一半修改都是用这个*/
.box4 {box-sizing: margin-box} /*从未支持过*/
```

当 .box3 {box-sizing: border-box}时， contetn box从宽度值中释放，形成局部流动性，和padding一起自动分配width值。



#### 关于height：100%

height和width还有一个明显的区别就是对百分比定位的支持。对于width属性，就算父元素width为auto，其百分比也是支持的；但是，对于height属性，如果父元素height为auto，只要子元素在文档流中，其百分比值就完全被忽略。

eg：某个小白想要在页面插入一个<div>,然后满屏显示背景图。

```
div {
	width: 100%; /* 这是多余的 */
	height: 100%; /* 这是多余的 */
	background: url(bg.jpg);
}
```

这个div高度永远是0，哪怕其父级<body>塞满内容也是如此。事实上，他需要如下设置才行：

```
html, body {
	height: 100%;
}

使用绝对定位。
div {
	height: 100%;
	position: absolute;
}
此时的height: 100%就会有计算值，但是绝对定位的宽高百分比是相对padding box的，非绝对定位是相对于content box计算的。
```

浏览器渲染的基本原理。从上到下、自内而外的顺序渲染DOM内容。

#### 初始值

min-width/min-height的初始值都是auto

max-width/max-height的初始值都是none

max-width会覆盖 width !important ， min-width会覆盖max-width。



### 内联元素

**定义** “内联元素”的内联 特指 外在盒子。

#### **内联盒模型** 

1. 内容区域。内容区域指一种围绕文字看不见的盒子，其大小仅受字符本身特性控制，本质是一个字符盒子；但是有些元素，如图片这样的替换元素，其内容显然不是文字，不存在字符盒子子类的，因此，对于这些元素，内容区域可以看成元素自身。
2. 内联盒子。"内联盒子"不会让内容块显示，而是排成一行，这里的"内联盒子"实际指的就是元素的"外在盒子"，用来决定是内联还是块级。该盒子又可以细分为"内联盒子"和"匿名内联盒子"。 如果外部含内联标签(<span>、<a>和<em>)等；如果是个光秃秃的文字，则属于"匿名内联盒子" 需要值得注意的是，并不是所有光秃秃的文字都是"匿名内联盒子"，其还有可能是"匿名块级盒子"，关键看前后的标签是内联还是块级。

#### 幽灵空白节点

```
<div>
	<span></span>
</div>
此时div的高度并不是，而是18px
```

我们认为在span元素前面还有个宽度为0的空白字符。



# 盒尺寸四大家族

content、 padding、 border、 margin

## 深入理解content

#### 替换元素

根据是否具有替换内容，我们可以把元素分为替换元素和非替换元素。替换元素，顾名思义，内容可以被替换。

这种通过修改某个属性值呈现的内容就可以被替换的元素称为"替换元素"。因此img、object、video、iframe或者表单元素textarea和input都是典型的替换元素。

##### **特性**

 内容的外观不受页面上的css的影响。 有自己的尺寸， 可替换元素的baseline为元素的下边缘。

input white-space pre  当文字足够多的时候，按钮不会自动换行

button white-space normal  会自动换行

##### **尺寸**

 从内到外分为 固有尺寸、html尺寸、css尺寸。 默认全部为px单位。 

1. 固有尺寸 替换内容的原本尺寸，不加修饰的尺寸。 <input> 这样就是固有尺寸  img插入图片原来的大小 无法改变这个替换元素的固有尺寸。 

2. html尺寸 只能通过html原生属性改变。

   ```
   <img width="300" height="100">
   <input size-"30">
   <textarea cols="3">
   ```

3. css尺寸对应content box。 通过css的width和height设置。

css样式优先级最高

#### content与替换元素关系剖析

content属性生成的对象称为"匿名替换元素"，content生成的内容都是替换元素。

content生成的文本都是无法选中的、无法复制的。替换的仅仅是视觉层。

**所以重要的内容千万不能用content生成，对可访问性和seo不友好**

 

