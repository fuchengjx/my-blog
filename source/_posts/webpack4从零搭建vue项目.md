---
title: webpack4从零搭建vue项目
date: 2019-08-05 16:10:48
category: web前端
tags:
- webpack
- vue
- 前端工程化
description: "众所周知，直接用webpack-cli生成的vue项目目录极为臃肿，非常的不好看。所以打算自己配置webpack项目，这里我们从零开始搭建webpack4的vue项目"
---

## 主要设置

### 创建项目

新建一个项目文件夹

npm init -y 初始化package.json

![](http://img.flura.cn/npm_init-y.png)

### 安装webpack依赖包

npm install --save-dev webpack webpack-cli webpack-dev-server

```
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    host: 'localhost',  //  可以设置0.0.0.0 ,这样设置你可以通过127.0.0.1或则localhost去访问
    open: true,       //  项目启动时,会默认帮你打开浏览器
    port: 8088,
    // hot: true    //在单页面应用开发中,我们修改了代码后是整个页面都刷新,开启hot后,将只刷新对应的组件
  }
```

### 安装vue

npm install vue

```bash
npm install -D vue-loader vue-template-compiler
```

vue-loader webpack配置 [参考官方文档-手动设置](https://link.juejin.im/?target=https%3A%2F%2Fvue-loader.vuejs.org%2Fzh%2Fguide%2F%23%E6%89%8B%E5%8A%A8%E8%AE%BE%E7%BD%AE)

```
 // webpack.base.config.js
      const VueLoaderPlugin = require('vue-loader/lib/plugin')
```

```
  module.exports = {
  module: {
      rules: [
      // ... 其它规则
      {
          test: /\.vue$/,
          loader: 'vue-loader'
      }
      ]
  },
  plugins: [
      // 请确保引入这个插件！
      new VueLoaderPlugin()
  ]
 }
```



### config详细配置

新建一个src文件夹，并在src文件下新建index.js，在根目录下新建webpack.config.js

webpack.config.js的配置

- ​    webpack.config.js 配置，webpack-dev-server工具的使用。



html-webpack-plugin 可以指定template模板文件，将会在output目录下，生成html文件，并引入打包后的js.

安装依赖:

```shell
npm install --save-dev html-webpack-plugin
```

配置webpack.config.js  module中的rules

```
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    //...other code
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html')
        })
    ]

}
```

### 

```webpack.config.js
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, '/dist'),//打包生成文件地址    
    filename: 'bundle.js',
    // publicPath: '/dist/'//文件输出的公共路径
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: [
          "vue-loader"
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.js?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/react'],
              plugins: [
                [require("@babel/plugin-proposal-decorators"), { "legacy": true }]
              ]
            }
          }
        ],
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './index.html'
    }),
    new VueLoaderPlugin()  // vueLoader插件 允许你以一种名为单文件组件的格式撰写 Vue 组件
  ],
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    host: 'localhost',  //  可以设置0.0.0.0 ,这样设置你可以通过127.0.0.1或则localhost去访问
    open: true,       //  项目启动时,会默认帮你打开浏览器
    port: 8088,
    // hot: true    //在单页面应用开发中,我们修改了代码后是整个页面都刷新,开启hot后,将只刷新对应的组件
  }
}
```



### 创建项目目录文件

在根目录下创建一个index.html文件作为启动页面，一个webpack.config.js作为webpack配置文件(实际项目中这里会有webpack配置文件，分别用于开发环境和生产环境，这里简便起见就用一个配置文件) ,再创建一个App.vue文件。

```
cet-query
├─ index.html 启动页面
├─ package-lock.json
├─ package.json 包管理
├─ src
│    └─ index.js 入口文件
|	 └─ App.vue 
└─ webpack.config.js  webpack配置文件

```

index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>cet-query title</title>
</head>
<body>
  
</body>
</html>
```

index.js

```
import Vue from 'vue'
import App from './App.vue'

const root = document.createElement('div') //创建div节点
document.body.appendChild(root) //将div节点添加到body下

new Vue({
  render: (h) => h(App)  //vue在创建Vue实例时,通过调用render方法来渲染实例的DOM树,也就是这个组件渲染的是App的内容
                        //vue在调用render方法时,会传入一个createElement函数作为参数,也就是这里的h的实参是createElement函数,然后createElement会以App为参数进行调用
}).$mount(root)
```

App.vue

```
<template>
  <div id="app">
    I am App.vue
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

</style>
```



### 添加启动脚本

在package.json添加启动脚本命令

```package.json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --mode=development --progress --hide-modules",
    "dev": "webpack-dev-server --mode=development"
  },
```

这样执行npm run dev就能启动成功了， npm run build也能打包生成dist文件



## 其它扩展处理

### 引入babel-loader兼容代码

babel-preset-env 帮助我们配置 babel。我们只需要告诉它我们要兼容的情况（目标运行环境），它就会自动把代码转换为兼容对应环境的代码。ES6/ES7/JSX 转义需要 Babel 的依赖，支持装饰器。

```
npm install --save-dev @babel/core babel-loader @babel/preset-env @babel/preset-react @babel/plugin-proposal-decorators @babel/plugin-proposal-object-rest-spread
```

更改webpack.config.js文件

```
{
  test: /\.js?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/react'],
        plugins: [
          [require("@babel/plugin-proposal-decorators"), { "legacy": true }]
        ]
      }
    }
  ],
  include: path.resolve(__dirname, 'src'),
  exclude: /node_modules/
},
```

### 配置css

输入命令下载style-loader css-loader

```
npm i style-loader css-loader -D
```

配置webpack.config.js  module中的rules

```
{
  test: /\.css$/,
  exclude: /node_modules/,
  use: [
    "style-loader",
    "css-loader"
  ]
}
```

如果要打包scss或者其它，再安装对应的loader。

### 支持sass

输入命令下载sass-loader node-sass

```
npm i sass-loader node-sass -D
复制代码
```

修改webpack.config.js的css

```
{   
  test: /\.sass$/,   
  use:['vue-style-loader', 
     'css-loader', 'sass-loader' 
  ],   
  include: path.resolve(__dirname + '/src/'),    
  exclude: /node_modules/ 
},
```

### 支持图片

输入命令下载file-loader url-loader

```
npm i file-loader url-loader -D
```

配置webpack.config.js  module中的rules

```
{   
  test: /\.(jpg|png|gif|svg)$/,   
  use: 'url-loader',   
  include: path.resolve(__dirname + '/src/'),   
  exclude: /node_modules/ 
}
```

## 完整的文件参考

### webpack.config.js文件

```
const path = require('path')  //path是Nodejs中的基本包,用来处理路径
const htmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, '/dist'),  //打包生成文件地址    
    filename: 'bundle.js',
    // publicPath: '/dist/'  //文件输出的公共路径
  },
  module: {  
    rules: [     //针对不同类型的文件,我们定义不同的识别规则,最终目的都是打包成js文件
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: [
          "vue-loader"     //处理.vue文件
        ]
      },
      {
        test: /\.css$/,     //处理css
        exclude: /node_modules/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.js?$/,    //处理js
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/react'],
              plugins: [
                [require("@babel/plugin-proposal-decorators"), { "legacy": true }]
              ]
            }
          }
        ],
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg)$/,     //处理图片
        exclude: /node_modules/,
        use: [
          "url-loader"
        ]
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './index.html'
    }),
    new VueLoaderPlugin()  // vueLoader插件 允许你以一种名为单文件组件的格式撰写 Vue 组件
  ],
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    host: 'localhost',  //  可以设置0.0.0.0 ,这样设置你可以通过127.0.0.1或则localhost去访问
    open: true,       //  项目启动时,会默认帮你打开浏览器
    port: 8088,
    // hot: true         //在单页面应用开发中,我们修改了代码后是整个页面都刷新,开启hot后,将只刷新对应的组件
  }
}
```

### package.json文件

```
{
  "name": "cet-query",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --mode=development --progress --hide-modules",
    "dev": "webpack-dev-server --mode=development"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/fuchengjx/cet-query.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/fuchengjx/cet-query/issues"
  },
  "homepage": "https://github.com/fuchengjx/cet-query#readme",
  "dependencies": {
    "vue": "^2.6.10"
  },
  "devDependencies": {
    "@babel/core": "^7.5.5",
    "@babel/plugin-proposal-decorators": "^7.4.4",
    "@babel/plugin-proposal-object-rest-spread": "^7.5.5",
    "@babel/preset-env": "^7.5.5",
    "@babel/preset-react": "^7.0.0",
    "babel-core": "^6.26.3",
    "babel-loader": "^8.0.6",
    "babel-preset-env": "^1.7.0",
    "css-loader": "^3.1.0",
    "html-webpack-plugin": "^3.2.0",
    "style-loader": "^0.23.1",
    "vue-loader": "^15.7.1",
    "vue-template-compiler": "^2.6.10",
    "webpack": "^4.39.1",
    "webpack-cli": "^3.3.6",
    "webpack-dev-server": "^3.7.2"
  }
}
```





[webpack配置进阶篇](https://flura.cn/2019/08/28/webpack配置进阶)