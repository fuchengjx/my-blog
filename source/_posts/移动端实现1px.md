---
title: 移动端实现1px
date: 2019-08-25 11:02:27
category: web前后端
tags: 
- 移动端
- css		
---

### **1px实现的难点**

我们知道，像素可以分为物理像素（CSS像素）和设备像素。由于现在手机大部分是Retina高清屏幕，所以在PC端和移动端存在设备像素比的概念。简单说就是你在pc端看到的1px和在移动端看到的1px是不一样的。

在PC端上，像素可以称为CSS像素，PC端上dpr为1。也就说你书写css样式是是多少在pc上就显示多少。而在移动端上，像素通常使用设备像素。往往PC端和移动端上在不做处理的情况下1px显示是不同的。

一个物理像素等于多少个设备像素取决于移动设备的屏幕特性(是否是Retina)和用户缩放比例。

如果是Retina高清屏幕，那么dpr的值可能为2或者3，那么当你在pc端上看到的1px时，在移动端上看到的就会是2px或者3px。

由于业务需求，我们需要一些方法来实现移动端上的1px。

### **scale**

如果在一个元素上使用`scale`时会导致整个元素同时缩放，所以应该在该元素的伪元素下设置`scale`属性。

```css
.scale::after {
    display: block;
    content: '';
    border-bottom: 1px solid #000;
    transform: scaleY(.5);
}
```

### **linear-gradient**

通过线性渐变，也可以实现移动端1px的线。原理大致是使用渐变色，上部分为白色，下部分为黑色。这样就可以将线从视觉上看只有1px。

由于是通过背景颜色渐变实现的，所以这里要使用伪元素并且设置伪元素的高度。 当然，也可以不使用伪元素，但是就会增加一个没有任何意义的空标签了。

```css
div.linear::after {
    display: block;
    content: '';
    height: 1px;
    background: linear-gradient(0, #fff, #000);
}
```

### **box-shadow**

通过`box-shaodow`来实现1px也可以，实现原理是将纵坐标的shadow设置为0.5px即可。`box-shadow`属性在Chrome和Firefox下支持小数设置，但是在Safari下不支持。所以使用该方法设置移动端1px时应该慎重使用。

```css
div.shadow {
    box-shadow: 0 0.5px 0 0 #000;
}
```

### **svg**

另外，可以使用可缩放矢量图形(svg)来实现。由于是矢量图形，因此在不同设备屏幕特性下具有伸缩性。

```css
.svg::after {
    display: block;
    content: '';
    height: 1px;
    background-image: url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="1px"><line x1="0" y1="0" x2="100%" y2="0" stroke="#000"></line></svg>');
}
```

在Chrome下可以显示移动端的1px，但是由于Firefox的background-image如果是svg的话，颜色的命名形式只支持英文书写方式，如'black, red'等，所以在Fire下没有1px的线。

解决Firefox下`background-image`的svg颜色命名问题很简单。可以使用`black`这种命名方式或者将其转换成base64.

```css
方法一：颜色不采用十六进制，而是用英文方式
.svg::after {
    display: block;
    content: '';
    height: 1px;
    background-image: url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="1px"><line x1="0" y1="0" x2="100%" y2="0" stroke="black"></line></svg>');
}

方法二：将svg改为base64
.svg::after {
    display: block;
    content: '';
    height: 1px;
    background-image: url('data:image/svg+xml;utf-8,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjFweCI+PGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMTAwJSIgeTI9IjAiIHN0cm9rZT0iYmxhY2siPjwvbGluZT48L3N2Zz4=');
}
```





当然，以上的所有方案都是基于`dpr=2`的情况下实现的，此外还需要考虑`dpr=3`的情况。因此，可以根据`media query`来判断屏幕特性，根据不同的屏幕特性进行适当的设置。如下是根据不同的dpr设置`scale`属性。

```css
@media all and (-webkit-min-device-pixel-ratio: 2) {
    .scale::after {
        display: block;
        content: '';
        border-bottom: 1px solid #000;
        transform: scaleY(.5);
    }
}

@media all and (-webkit-min-device-pixel-ratio: 3) {
    .scale::after {
        display: block;
        content: '';
        border-bottom: 1px solid #000;
        transform: scaleY(.333);
    }
}
```



### 适用于各种设备

接下来看看各种设备下的场景。首先使用JavaScript计算出`scale`的值：

```
var scale = 1 / window.devicePixelRation;
```

在`head`中的`meta`标签设备：

```
<meta name="viewport" content="initial-scale=scale,maximum-scale=scale,minimum-scale=scale,user-scalable=no">
```



### border0.5px

```
.custom-border{
    width:200px;
    margin:10px auto;
    height:100px;
    border:1px solid #333;
    background-color:#eee;
    padding:10px;
}
.scale-border{
    margin:10px auto;
    height:100px;
    position:relative;
    padding:10px;
    width: 200px;
}
.border{
    -webkit-transform:scale(0.5);
    transform:scale(0.5);
    position:absolute;
    border:1px solid #333;
    top:-50%;
    right:-50%;
    bottom:-50%;
    left:-50%;
    border-radius: 10px;
    background-color:#eee;
}
.content{
    position:relative;
    z-index:2;
}

<div class="custom-border border-color">边框宽度1px</div>
<div class="scale-border">
    <div class="content">边框宽度0.5px</div>
    <div class="border border-color"></div>
</div>
```

