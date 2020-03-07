---
title: vue的路由传参
date: 2020-02-29 20:04:16
tags: -vue
category: web前端
---

# vue-router传参方式

当发生组件跳转时，组件a 跳转到 组件b，数据的流动是单向的，那么可以考虑使用vue-router的方式传递参数。 vue-router的传参分为3种, 一种是query，一种是params，还有一种动态路由传参比较特殊。 下面来具体总结一下。

## query方式传参和接收参数

```PageA.vue参数传递
A组件跳转到B组件，通过query传参。
this.$router.push({
  name: "PageB",
  query: {
    id: 2,
    content: "这是id为2的content"
  }
```

```PageB.vue参数接收
B组件接收A组件传递过来的参数
this.$route.query.id  // 2
this.$route.query.content // "这是id为2的content"
```

ps: 传参是 **this.$router**, 通过VueRouter的实例， 接收参数使用的是 **this.$route**。

而且我们发现 **url（地址栏）**是可以看到 id与content参数的。有点类似于发起get请求时，参数拼接在url中。



## params方式传参和接收参数

```
A组件跳转到B组件，通过params传参。
this.$router.push({
  name: "PageB",
  params: {
    id: id,
    content: "这是params id为2的content"
  }
});
```

```
B组件接收A组件传递过来的参数
this.$route.params.id  // 2
this.$route.params.content // "这是id为2的content"
```

ps:  params传参，push里面只能是 name:'xxxx',不能是path:'/xxx',因为params只能用name来引入路由。

params方式传参是不会在url中显示的，如果为了美观 还是选择用params方法进行传参。



## 动态路由传递参数

一般有种很常见的需求就是做 列表详情页。 一个列表，点击列表中的每一项，进入一个详情页。 而详情页的路由是根据你列表页的点击确定的。每个详情页都有一个对应列表的id，路由是动态的。

```文章列表页
// 文章列表页
<li v-for="article in articles" @click="getDetail(article.id)">

getDetail(id) {
  //直接调用$router.push 实现携带参数的跳转
  this.$router.push({
    path: `/detail/${id}`,
})
```

这种方法是需要在对应的路由进行配置的。

```router.js
// router.js
   {
     path: '/detail/:id',
     name: 'Detail',
     component: Detail
   }
```

```detail.vue
// detail.vue 文章详情组件
this.$route.params.id
```



## 关于刷新问题

其实我们开发大多是单页面组件，我们的所有页面都是一个Vue根实例，所有的data，以及vuex都挂载在根实例上，  如果用户刷新页面，我们保存在页面的数据会全部回到初始值，就是保存的状态全部消失。这样的话如果发生了组件跳转，a页面跳转到b页面 a中传递了数据给b。 我们在b页面中刷新，通过常规方法保存的状态都会直接消失，vue-bus、vuex、props之类的传值方式都会获取不到a传过来的值(所以尽量不要刷新)。 

但是vue-router的两种传参方式其实是可以在刷新后获取到 之前的参数的。 我们可以发现刷新后 虽然状态全部没了，但是路由 也可以理解为url在刷新后是不变的。 而通过**query**方式 与**动态路由**方式 都会在跳转后 都会在路由中携带参数，所以通过url传参是可以在刷新后保存上一个页面传递过来的参数的。



## vue-router打开新页面

vue-router怎么点击打开新的页面，就是a标签里的target=“blank

vue本身开发的就是单页面组件，路由跳转其实在浏览器看来并没有跳转(或者说并没有打开页面，本质上还是在一个index.html上)

### router-link 标签实现新窗口打开

```
<router-link target="_blank"></router-link>
```

### 编程式导航

使用this.$router.resolve

```
seeShare(){
     let routeUrl = this.$router.resolve({
          path: "/share",
          query: {id:96}
     });
     window.open(routeUrl.href, '_blank');
}
```

如果用这种方法进行参数传递  其实是不能通过params方式进行参数传递的，只能通过query进行传递。其实想想也可以理解，因为_blank打开了一个新的页面，两个html页面之间进行数据传递，最好用的就是url进行传参。

