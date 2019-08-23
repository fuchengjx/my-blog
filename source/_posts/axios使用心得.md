---
title: axios使用心得
date: 2019-08-22 22:08:38
category: 'web前后端'
tags: 
- axios
- vue
- http		
---

## 特性

- 从浏览器中创建 [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- 从 node.js 创建 [http](http://nodejs.org/api/http.html) 请求
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 [XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery)



## 使用

### 安装

使用 npm:

```
$ npm install axios
```

使用 cdn:

```
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

#### 在vue项目中使用axios

1. 挂载在vue的原型上 全局使用

   首先在主入口文件main.js中引用，之后挂在vue的原型链上

   ```
   import axios from 'axios'
   Vue.prototype.$axios = axios
   ```

   在vue组件中使用：

   ```
   this.$axios.get('/api/getList').then((res) => {
   	this.newList = res.data.data
   }).catch(err => {
   	console.log(err)
   })
   ```

2. 结合 vue-axios使用

   在main.js中引用

   ```
   import axios from 'axios'
   import VueAxios from 'vue-axios'
   
   Vue.use(VueAxios,axios);
   ```



## axios API

axios.get(url[, config])

axios.delete(url[, config])

axios.post(url[, data[, config]])

axios.put(url[, data[, config]])

axios.patch(url[, data[, config]])

```
this.axios.get('/api/demo', {
  params: {
    id: 124, 
    name: 'jerry'
  }
})
其实一般axios添加参数是
this.axios.get('/api/demo?id=124&&name='jerry)

this.axios.delete('/api/demo', {
  data: {
    id: 123,
    name: 'Henry',
    sex: 1,
    phone: 13333333
}

this.axios.post('/api/demo', {
  name: 'jack',
  sex: 'man'
})

this.axios.put('/api/demo', {
  name: 'jack',
  sex: 'man'
})

在使用axios时，注意到配置选项中包含params和data两者，以为他们是相同的，实则不然。 
 
因为params是添加到url的请求字符串中的，用于get请求。  参数是以id=124&name=jerry的形式附到url的后面
 
而data是添加到请求体（body）中的， 用于post请求。

POST请求提交时，使用的Content-Type是application/x-www-form-urlencoded，而使用原生AJAX的POST请求如果不指定请求头RequestHeader，默认使用的Content-Type是text/plain;charset=UTF-8。
```



#### 执行多个并发请求

```
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()]).then(
	axios.spread(function (acct, perms) {
    // 两个请求现在都执行完成
}));
```



#### 可以通过向 `axios` 传递相关配置来创建请求

axios(config)

```
// 发送 POST 请求
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
//等同于以下写法
axios.post('/user/12345', {
  firstName: 'Fred',
  lastName: 'Flintstone'
})

// 获取远端图片
axios({
  method:'get',
  url:'http://bit.ly/2mTM3nY',
  responseType:'stream'
}).then(function(response) {
  response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
});
```

### 简单的请求配置(config)

```
{
   // `url` 是用于请求的服务器 URL
  url: '/user',

  // `method` 是创建请求时使用的方法
  method: 'get', // default

  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: 'https://some-domain.com/api/',
  
  // `headers` 是即将被发送的自定义请求头
  headers: { Authorization: token }
  
  // `params` 是即将与请求一起发送的 URL 参数  用于get请求
  // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
  params: {
    ID: 12345
  },

  // `data` 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  data: {
    firstName: 'Fred'
  },
  
  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
  // 如果请求话费了超过 `timeout` 的时间，请求将被中断
  timeout: 1000,
  
 }
```

### 响应结构

某个请求的响应包含以下信息

```
{
  // `data` 由服务器提供的响应
  data: {},

  // `status` 来自服务器响应的 HTTP 状态码
  status: 200,

  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',

  // `headers` 服务器响应的头
  headers: {},

   // `config` 是为请求提供的配置信息
  config: {},
 // 'request'
  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance the browser
  request: {}
}
```

### 接收响应

```
axios支持Promise对象，所以获取响应值 用then
axios.get('/user/12345')
  .then(function(res) {
    console.log(rese.data);
    console.log(res.status);
    console.log(res.statusText);
    console.log(res.headers);
    console.log(res.config);
  });
```

可以用catch做错误处理



## 全局配置axios默认值

```
axios.defaults.baseURL = "https://api.example.com";
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
axios.defaults.headers.common['Authorization'] = ''; // 设置请求头为 Authorization
axios.defaults.timeout = 200;  在超时前，所有请求都会等待 2.5 秒
```

## 错误处理

```javascript
axios.get("/user/12345")
  .catch(function (error) {
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
```

可以使用 `validateStatus` 配置选项定义一个自定义 HTTP 状态码的错误范围。

```javascript
axios.get("/user/12345", {
  validateStatus: function (status) {
    return status < 500; // 状态码在大于或等于500时才会 reject
  }
})
```

## 拦截器

可以自定义拦截器，在在请求或响应被 `then` 或 `catch` 处理前拦截它们。

```
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
 });
```

```
//配置发送请求前的拦截器 可以设置token信息 
axios.interceptors.request.use(config => {
  //loading开始  //加载进度条
  loadingInstance.start();
  let token = localStorage.getItem("x-auth-token");  // 给所有请求带上token
  if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.token = `${token}`;
  }
  return config;
}, error => {
  //出错，也要loading结束
  loadingInstance.close();
  return Promise.reject(error);
});


// 配置响应拦截器 
axios.interceptors.response.use(res => {
  //loading结束
  loadingInstance.close();
  //这里面写所需要的代码
  if (res.data.code == '401') {
    //全局登陆过滤，当判读token失效或者没有登录时 返回登陆页面
    return false;
  };
  return Promise.resolve(res);
}, error => {
  loadingInstance.close();
  return Promise.reject(error);
})
```



## 注意事项

axios会默认序列化 JavaScript 对象为 JSON  

axios中POST的默认请求体类型为Content-Type:application/json（JSON规范流行）这也是最常见的请求体类型，也就是说使用的是序列化后的`json`格式字符串来传递参数，如：`{ "name" : "mike", "sex" : "male" }`；同时，后台必须要以支持`@RequestBody`的形式接收参数，否则会出现前台传参正确，后台接收不到的情况。
如果想要设置类型为`Content-Type:application/x-www-form-urlencoded`（浏览器原生支持），`axios`提供了两种方式，如下：

1. URLSearchParams

   ```
   const params = new URLSearchParams();
   params.append('param1', 'value1');
   params.append('param2', 'value2');
   axios.post('/user', params);
   ```

2. qs

   默认情况下在安装完axios后就可以使用`qs`库 选择使用qs库编码数据：

   ```
   const qs = require('qs');0
   axios.post('/foo', qs.stringify({ 'bar': 123 }));
   ```



[官方文档](http://axios-js.com/zh-cn/docs/index.html)