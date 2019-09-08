---
title: vue-bus使用遇到的坑
date: 2019-09-08 12:26:36
tags:
- vue
- vue-bus
category: web前端
description: 在使用vue-bus进行兄弟组件的数据传递过程中，遇到的问题，及解决方案 问题：vue中eventbus被多次触发，在this.$on监听事件时，内部的this发生改变导致，无法在vue实例中添加数据。
---

vue中eventbus被多次触发，在this.$on监听事件时，内部的this发生改变导致，无法在vue实例中添加数据。

## 项目场景

一开始的需求是这样的，为了实现两个组件(A.vue ,B.vue)之间的数据传递。 页面A，点击页面上的某个A上的某一个按钮之后，页面会跳转到页面B。这个时候需要将页面A上的数据携带过去给页面B。

## 业务代码

```A.vue
// 点击之后，emit自定义事件(increment) 就会跳转到/B页面。 接下来就是在B页面中on 接受这个事件(increment)。获得这个数据。
<template>
  <div>
    I am AChild
    <button @click="increment">emit</button>
  </div>
</template>

<script>
export default {
  name: 'Achild',
  methods: {
    increment() {
      console.log('A触发了 $emit')
      this.bus.$emit('increment', '我是increment')
      this.$router.push('/B')
    }
  },
</script>
```

```B.vue
<template>
  <div>
    I am BChild
    <p>{{info}}</p>
  </div>
</template>

<script>
export default {
  name: 'Bchild',
  data() {
    return {
      info: 'default info'
    }
  },
  created() {
    let _this = this
    console.log('Bchild this', this)
    this.bus.$on('increment', function(data) {
      console.log('这是Bchild收到的值: ', data)
      console.log('Bchild in _this: ', _this)
      _this.info = data
    })
  },
</script>
```



按照理论，我觉得只要在页面A触发了increment事件，页面B就会理所当然的接受了数据。然而，结果却不如人意。

![](http://img.flura.cn/vue-bus1.gif)

  从这里可以发现 页面B根本就没有接收到这个事件。



![](http://img.flura.cn/vue-bus2.gif)

然后再从页面B回退到 页面A， 再重复一遍emit increment事件。会神奇的发现B竟然收到了 A传递过来的数据。



![](http://img.flura.cn/vue-bus3.gif)

你会发现，第一次触发事件increment的时候，B并没有收到。 第二次触发的时候，就输出了一个。第三次触发的时候，就又输出了两个、、、依次增加。而且你还会发现打印出的on的回调函数打印出的this指向，并不是指向当前vue实例(B.vue)。而且明明是顺序执行，却偏偏是异步执行。on的回调函数先于 console.log('Bchild this', this)执行。

- 问题1：为什么第一次触发事件的时候，页面B on没有监听到事件。
- 问题2：为什么后面再一次依次去触发的时候会出现，每一次都会发现好像之前的on事件分发都没有被撤销一样，导致每一次的事件触发执行越来越多。
- 问题3：为什么是on里的回调函数先执行？ 输出的指向且并不指向当前vue实例？

## 解决

这些问题的出现还要从vue的生命周期讲起。[可以参考我的另一篇关于vue生命周期的博客](https://flura.cn/2019/09/05/vue%E7%BB%84%E4%BB%B6%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E8%AF%A6%E8%A7%A3/)

![](http://img.flura.cn/vue-bus4.gif)

从这里我们可以清楚的看到，当我们还在页面A触发emit事件时，页面B还没有生成，也就是说页面B中created中所监听的来自于A中的事件还没有被触发。这个时候你A中emit事件的时候，B还没有监听到。

再仔细看看，当我们从A页面跳转到B页面中的时候发生了什么？首先是B组件created 然后beforeMounted接着A组件才被销毁，A组件才仔细beforeDestory，以及destoryed。然后B组件再执行mounted。 所以我们可以把A页面组件中的emit事件放到beforeDestory里，因为这个时候，B组件的created钩子已经执行，也就可以监听到从A传过来的事件了。而且从周期来看，B的$on监听，也不能放在mounted钩子里，不然也会出现监听不到的情况。

```A.vue
<template>
  <div>
    I am AChild
    <button @click="increment">emit</button>
  </div>
</template>

<script>
export default {
  name: 'Achild',
  methods: {
    increment() {
      console.log('A触发了 $emit')
      this.$router.push('/B')
    }
  },
  beforeDestroy () {
    this.bus.$emit('increment', '我是increment')
  }
 }
</script>
```

修改过后效果图：

![](http://img.flura.cn/vue-bus5.gif)

我们可以看到修改后，B明显可以收到A传递过来的数据。但是多次点击，事件的触发还是会依次增加，控制台打印的输出每次都有增加。而且每次在$on里的回调函数会打印出以前监听到的vue实例，和本次监听的实例。

### 总结

查找各方面资料，才知道**$on事件是不会自动销毁的。需要我们手动来销毁。**

这是因为Bus是全局的，并不随着页面的切换而重新执行生命周期，所以$on能存储到以前的实例，这样看起来才比较奇怪。如果没有A组件没有将emit放在beforeDestory钩子里，通过全局的事件总线bus(没有受生命周期约束)，而B里的 $on里没有监听到最新的emit，只会收到以前的事件，所以$on的this会指向上次B.vue的vue实例。导致现在的B.vue就算看起来拿到了数据，也无法挂载到现在的B实例上。

所以在B组件添加

```B.vue
beforeDestroy () {
   this.bus.$off('increment')
}
```

## 建议

使用bus时一定要注意，组件的生命周期。对于这种会被销毁的vue实例。一定要把emit放在beforeDestory里面。并且要记得将$on销毁。

如果是要保存这种状态最好使用vuex，进行数据传递。这样这些传递的值，就不会受组件的销毁新建的影响，可以保存下来。