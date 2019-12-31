---
title: webpack4从零配置react项目
date: 2019-10-07 10:16:16
tags: 
- webpack
- react
- TS
- 前端工程化
---

## 一、初始化项目文件夹

在任意目录下，新建一个文件夹作为你的项目文件夹，命名随意。随后使用命令行工具，切换到该文件夹，键入`npm init`进行初始化（遇到的问题一直回车就好了），初始化完成之后可以看到生成了一个`package.json`文件。

随后在该项目文件夹下新建两个文件夹：`/dist`和`/src`，其中`/src`用于放置开发的源码，`/dist`用于放置“编译”后的代码。

随后在`/src`目录下新建`index.html`、`index.css`和`index.js`文件

按照以下内容创建文件：

**index.html**

```
<html>
    <head>
        <meta charset="utf-8"/>
        <title>React & Webpack</title>
    </head>
    <body>
        <div id="root">
            <h1>Hello React & Webpack!</h1>
        </div>
    </body>
</html>
```

**index.css**

```
body {
    background-color: blue;
}

#root {
    color: white;
    background-color: black;
}
```

**index.js**

```
import './index.css';

console.log('Success!');
```

## 二、安装webpack工具

通过命令行使用webpack 4需要安装两个模块：webpack和webpack-cli，都安装为开发环境依赖。

```
npm install -D webpack webpack-cli
```

安装完成之后可以看到你的`package.json`文件发生了变化，在devDependencies属性下多了两个包的属性。

## 三、配置最基本的webpack

- 1.安装最基本的插件：

  ```
    npm install -D html-webpack-plugin clean-webpack-plugin webpack-dev-server css-loader webpack-merge style-loader
  ```

- 2.在项目文件夹下新建文件`webpack.base.conf.js`，表示最基本的配置文件，内容如下：

````webpack.base.conf.js`
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin')

  module.exports = {
      entry: './src/index.js',
      output: {
          filename: 'bundle.[hash].js',
          path: path.join(__dirname, '/dist')  //打包生成文件地址
      },
      module: {
          rules: [
              {
                  test: /\.css$/,
                  use: ['style-loader', 'css-loader']
              }
          ]
      },
      plugins: [
          new HtmlWebpackPlugin({
              template: './src/index.html'
          }),
         new CleanWebpackPlugin({
              cleanAfterEveryBuildPatterns: ['./dist']
         })
      ]
  };
```

其中，`/src/index.html`是你的网站入口HTML文件，`/src/index.js`是你的入口js文件。

.在项目文件夹下新建`webpack.dev.conf.js`文件，表示开发环境下的配置。内容如下：

````webpack.dev.conf.js`
  const merge = require('webpack-merge');
  const baseConfig = require('./webpack.base.conf.js');

  module.exports = merge(baseConfig, {
      mode: 'development',
      devtool: 'inline-source-map',
      devServer: {
          contentBase: './dist',
          port: 3000
      }
  });
```

在项目文件夹下新建`webpack.prod.conf.js`文件，表示生产环境的配置，内容如下：

```
  const merge = require('webpack-merge');
  const baseConfig = require('./webpack.base.conf.js');

  console.log(__dirname);
  module.exports = merge(baseConfig, {
      mode: 'production'
  });
```



## 四、配置npm scripts

配置了三个配置文件以满足两个不同环境下的代码构建，使用语义化较好的`npm scripts`来构建代码有利于简化工作。

添加新的scripts内容到`package.json`文件的`scripts`属性，记得用双引号引起来，其属性如下：

```
// package.json
{
    "scripts": {
        "start": "webpack-dev-server --open --config webpack.dev.conf.js",
        "build": "webpack --config webpack.prod.conf.js"
    }
}
```

配置完之后，可以尝试修改`/src/index.html`、`/src/index.js`或`/src/index.css`，运行npm run start命令查看效果。

做到这里，一个基本的开发环境已经搭建出来了。

## 五、配置Babel

Babel是一个优秀的JavaScript编译器（这句话源自[Babel官网](https://link.juejin.im/?target=https%3A%2F%2Fbabel.bootcss.com%2F)），通过Babel的一些插件，可以将JSX语法、ES6语法转换为ES5的语法，使得低级浏览器也可以运行我们写的代码。

安装 `babel-loader`，`@babel/core`，`@babel/preset-env`，`@babel/preset-react` 作为 dev 依赖项

```
npm i babel-loader@8 @babel/core @babel/preset-env @babel/preset-react -D
```

- [babel-loader](https://github.com/babel/babel-loader)：使用 Babel 转换 JavaScript依赖关系的 Webpack 加载器
- [@babel/core](https://babeljs.io/docs/en/babel-core)：即 babel-core，将 ES6 代码转换为 ES5
- [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)：即 babel-preset-env，根据您要支持的浏览器，决定使用哪些 transformations / plugins 和 polyfills，例如为旧浏览器提供现代浏览器的新特性
- [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)：即 babel-preset-react，针对所有 React 插件的 Babel 预设，例如将 JSX 转换为函数

**注：babel 7 使用了 `@babel` 命名空间来区分官方包，因此以前的官方包 babel-xxx 改成了 `@babel/xxx`

修改`webpack.base.conf.js` 和 创建`.babelrc` 文件，并配置 babel-loader 及 babel 选项

```webpack.base.conf.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
```

```.babelrc
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

## 六、配置react

```
npm install --save react react-dom
```



在`/src`中新建一个`App.js`文件，内容如下

```
import React from 'react';

class App extends React.Component {
    render() {
        return <div>
            <h1>Hello React & Webpack!</h1>
            <ul>
                {
                    ['a', 'b', 'c'].map(name => <li>{`I'm ${name}!`}</li> )
                }
            </ul>
        </div>
    }
}

export default App;
```

清空`index.js`之后在其中写入如下内容：

```
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(<App/>, document.getElementById('root'));
```

使用`npm run start`命令打开页面可以看到使用React写出来的效果了。

打开浏览器查看编译后的代码，找到App组件中的map函数这一段，可以发现ES6的语法已经被转换到了ES5的语法：

```
['a', 'b', 'c'].map(function (name) {
    return _react2.default.createElement(
        'li',
        null,
        'I\'m ' + name + '!'
    );
})
```

箭头函数被写成了function匿名函数。



## 七、配置TypeScript

执行以下命令安装 TypeScript compiler 和 loader：

```bash
npm install --save-dev typescript ts-loader
```

在根目录新建一个tsconfig.json文件

```tsconfig.json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "sourceMap": true,
    "noImplicitAny": true,
    "module": "commonjs",
    "target": "es6",
    "jsx": "react"
  },
  "include": [
    "./src/**/*"
  ]
}
```

然后在webpack.dev.conf.js配置

```
const path = require('path');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

这个时候就可以使用ts了。 ps: 在ts中引用都要申明类型。

```
import * as React from "react"; // 这样没有申明的react会报错、 所以应该npm install @types/react
```





## 参考

[基于Webpack搭建React开发环境](https://juejin.im/post/5afc29fa6fb9a07ab379a2ae)

[使用 Webpack 4 和 Babel 7 从头开始创建 React 应用程序](https://imweb.io/topic/5b8699a96a0f1b02454de3c0)

[TypeScript](https://webpack.docschina.org/guides/typescript/)

