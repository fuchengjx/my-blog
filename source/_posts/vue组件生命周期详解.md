---
title: vue组件生命周期详解
date: 2019-09-05 20:21:43
category: web前端
tags: 
- vue
---

## 生命周期图示

每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做**生命周期钩子**的函数，这给了用户在不同阶段添加自己的代码的机会。

![vue生命周期实例](https://cn.vuejs.org/images/lifecycle.png)

## Vue钩子详解

Vue所有的生命周期钩子自动绑定在this上下文到实例中，因此你可以访问数据，对属性和方法进行运算。这意味着你不能使用箭头函数来定义一个生命周期方法。这是因为箭头函数绑定了父上下文，因此this与你期待的Vue实例不同。
1、beforeCreate
　　在实例初始化之后，数据观测和event/watcher时间配置之前被调用。
2、created
　　实例已经创建完成之后被调用。在这一步，实例已经完成以下的配置：数据观测，属性和方法的运算，watch/event事件回调。然而，挂载阶段还没开始，$el属性目前不可见。
3、beforeMount
　　在挂载开始之前被调用：相关的render函数首次被调用。
　　该钩子在服务器端渲染期间不被调用。
4、mounted
　　el被新创建的vm.$el替换，并挂在到实例上去之后调用该钩子函数。如果root实例挂载了一个文档内元素，当mounted被调用时vm.$el也在文档内。
　　该钩子在服务端渲染期间不被调用。
5、beforeUpdate
　　数据更新时调用，发生在虚拟DOM重新渲染和打补丁之前。
　　你可以在这个钩子中进一步第更改状态，这不会触发附加的重渲染过程。
　　该钩子在服务端渲染期间不被调用。
6、updated
　　由于数据更改导致的虚拟DOM重新渲染和打补丁，在这之后会调用该钩子。
　　当这个钩子被调用时，组件DOM已经更新，所以你现在可以执行依赖于DOM的操作。然而在大多数情况下，你应该避免在此期间更改状态，因为这可能会导致更新无限循环。
　　该钩子在服务端渲染期间不被调用。
7、activated
　　keep-alive组件激活时调用。
　　该钩子在服务器端渲染期间不被调用。
8、deactivated
　　keep-alive组件停用时调用。
　　该钩子在服务端渲染期间不被调用。
9、beforeDestroy 【类似于React生命周期的componentWillUnmount】
　　实例销毁之间调用。在这一步，实例仍然完全可用。
　　该钩子在服务端渲染期间不被调用。
10、destroyed
　　Vue实例销毁后调用。调用后，Vue实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。
　　该钩子在服务端渲染不会被调用。



## 组件周期示例

**当父组件内嵌套两个子组件A，B时，子组件实例化时生命周期钩子会如何加载？**

![1567671373868](C:\Users\32761\AppData\Roaming\Typora\typora-user-images\1567671373868.png)

```Home.vue
<template>
  <div>
    <Achild/>
    <Bchild/>
  </div>
</template>

<script>
import Achild from './Achild';
import Bchild from './Bchild';
export default {
  name: 'Home',
  components: {
    Achild,
    Bchild
  },
}
</script>

<style scoped>

</style>
```



**打印父组件实例化**

![1567682945513](C:\Users\32761\AppData\Roaming\Typora\typora-user-images\1567682945513.png)

```Home.vue
<template>
  <div>
    <Achild/>
    <Bchild/>
    <!-- <router-link to="A">to A</router-link>
    <router-link to="B">to B</router-link> -->
  </div>
</template>

<script>
import Achild from './Achild';
import Bchild from './Bchild';
export default {
  name: 'Home',
  components: {
    Achild,
    Bchild
  },
  data () {
    return {
      
    }
  },
  beforeCreate () {
    console.group('%c%s', 'color:black', 'beforeCreate 创建前状态===============组件father》')
  },
  created () {
    console.group('%c%s', 'color:black', 'created 创建完毕状态===============组件father》')
  },
  beforeMount () {
    console.group('%c%s', 'color:black', 'beforeMount 挂载前状态===============组件father》')
  },
  mounted () {
    console.group('%c%s', 'color:black', 'mounted 挂载状态===============组件father》')
  },
  beforeUpdate () {
    console.group('%c%s', 'color:black', 'beforeUpdate 更新前状态===============组件father》')
  },
  updated () {
    console.group('%c%s', 'color:black', 'updated 更新状态===============组件father》')
  },
  beforeDestroy () {
    console.group('%c%s', 'color:black', 'beforeDestroy 破前状态===============组件father》')
  },
  destroyed () {
    console.group('%c%s', 'color:black', 'destroyed 破坏状态===============组件father》')
  }
}
</script>
```



从组件A跳转到组件B。**每次进入一个组件，这个组件原来的实例都会被销毁，然后新的实例会被建立**

![1567685173570](C:\Users\32761\AppData\Roaming\Typora\typora-user-images\1567685173570.png)