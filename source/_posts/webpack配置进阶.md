---
title: webpack配置进阶
date: 2019-08-28 13:09:11
category: web前端
tags: 
- webpack
- vue
- 前端工程化
description: "这里介绍了清除上次打包后的dist文件夹，CopyWebpackPlugin的作用，减小打包出来的bundle.js文件的大小，从bundle里抽离出css，可视化分析打包文件的webpack插件，还有webpack sourceMap定位压缩前代码错误，与配置本地代理实现开发环境跨域。"
---

## 清除上次打包的东西clean-webpack-plugin

### 为什么要清理/dist文件夹？

如果在多次打包后，   我们的 `/dist` 文件夹显得相当杂乱。webpack 将生成文件并放置在 `/dist` 文件夹中，但是它不会追踪哪些文件是实际在项目中用到的。

通常比较推荐的做法是，在每次构建前清理 `/dist` 文件夹，这样只会生成用到的文件。让我们实现这个需求。

[`clean-webpack-plugin`](https://www.npmjs.com/package/clean-webpack-plugin) 是一个流行的清理插件，安装和配置它。

```
npm install clean-webpack-plugin -D
```

**webpack.config.js**

```
const { CleanWebpackPlugin } = require('clean-webpack-plugin')


module.exports = {
    //...other code
    plugins: [
        new CleanWebpackPlugin({
  			cleanAfterEveryBuildPatterns: ['./dist']
	    })
    ]
}

new CleanWebpackPlugin({
  cleanAfterEveryBuildPatterns: ['./dist']
})
```

现在，执行 `npm run build`，检查 `/dist` 文件夹。如果一切顺利，现在只会看到构建后生成的文件，而没有旧文件！



## CopyWebpackPlugin

 [it is to copy files that already exist in the source tree, as part of the build process.](https://github.com/webpack-contrib/copy-webpack-plugin)

将开发环境下的目录复制到生产环境下。因为如果你需要在代码中引入静态资源文件。如果你对url的引入是相对地址

```home.vue
<img class="logoIcon"  src="../../assets/logo.png"/>
```

![1566905575202](http://img.flura.cn/1566905575202.png)

在打包后部署到线上环境(npm run build) 或者在开发环境(npm run dev)下 会找不到资源的路径。因为打包后的目录与开发时的目录将会发生很大的变化。所以不能找到资源路径。

![1566898744609](http://img.flura.cn/1566898744609.png)

![1566896245883](http://img.flura.cn/1566896245883.png)

**webpack.config.js**

```
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = {
    //...other code
    plugins: [
        new CopyWebpackPlugin([{
      	   from: './src/assets',  // 将开发环境的目录
      	   to: './assets'		 // 复制到生产环境
       }], {
           ignore: [],
           copyUnmodified: true
       }),
    ]
}
```

现在所有静态资源只要通过/assets/xx就能访问

```home.vue
<img class="logoIcon"  src="/assets/logo.png"/>
```



## vue打包抽离css

如果嫌弃打包的bundle太大了，想要把css从里面抽离出来。就要用[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)了

```
npm install mini-css-extract-plugin -D
```

**webpack.config.js**

```
const MiniCssExtractPlugin = require('mini-css-extract-plugin')


module.exports = {
  module: {
    rules: [{
      test: /\.css$/,     //处理css
      exclude: /node_modules/,
      use: [
        "style-loader",  //将css写入到html中去
        MiniCssExtractPlugin.loader,  // 这个必须放在两个loader之间。
        "css-loader" // 处理css后 抛到上一层进行处理
      ]
    }
  ]
},
plugins: [
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
  })
]
}
```

打包生成的文件 会发现.vue文件里的css被单独抽离出来了

![1566957203176](http://img.flura.cn/1566957203176.png)





## 可视化分析bundle.js资源的webpack插件

[webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)，可以清晰的看到项目中一共有多少个包，包的体积是多少，里面加载了哪些东西，大小是多少。

作用 ： 将bundle.js中捆绑的资源大小及关系，用交互式可缩放树形图直观的表示出来，从而有助于知道各资源的大小及关系，并进行优化。

效果图如下：

![1566957441342](http://img.flura.cn/1566957441342.png)

**webpack-bundle-analyzer安装和使用**

```
npm install webpack-bundle-analyzer -D
```

**webpack.config.js**

```
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin


module.exports = {
    plugins: [
 	   new BundleAnalyzerPlugin(),
	]
}
```

BundleAnalyzerPlugin构造函数中可配置的对象：

```
new BundleAnalyzerPlugin({
  //  可以是`server`，`static`或`disabled`。
  //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
  //  在“静态”模式下，会生成带有报告的单个HTML文件。
  //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
  analyzerMode: 'server',
  //  将在“服务器”模式下使用的主机启动HTTP服务器。
  analyzerHost: '127.0.0.1',
  //  将在“服务器”模式下使用的端口启动HTTP服务器。
  analyzerPort: 8888, 
  //  路径捆绑，将在`static`模式下生成的报告文件。
  //  相对于捆绑输出目录。
  reportFilename: 'report.html',
  //  模块大小默认显示在报告中。
  //  应该是`stat`，`parsed`或者`gzip`中的一个。
  //  有关更多信息，请参见“定义”一节。
  defaultSizes: 'parsed',
  //  在默认浏览器中自动打开报告
  openAnalyzer: true,
  //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
  generateStatsFile: false, 
  //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
  //  相对于捆绑输出目录。
  statsFilename: 'stats.json',
  //  stats.toJson（）方法的选项。
  //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
  //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
  statsOptions: null,
  logLevel: 'info' 日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
```



## sourceMap

[Source map](https://webpack.docschina.org/configuration/devtool/)就是一个信息文件，里面储存着位置信息。也就是说，转换后的代码的每一个位置，所对应的转换前的位置。

在实际开发过程中，我们在使用webpack打包的时候，打包完成的bundle.js报错信息是很难Debug的，这时候就需要`Source Map`来还原真实的出错位置。

有了**sourceMap**，出错的时候，除错工具将直接显示原始代码，而不是转换后的代码。这无疑给开发者带来了很大方便。

不然浏览器会定位到压缩过后的代码。无法准确的定位到错误位置

webpack.config.js

```
module.exports = {
	devtool: 'cheap-module-eval-source-map'  
}
```

![1566964434765](http://img.flura.cn/1566964434765.png)

**注意**

以上选项通常用于开发环境中：

在生产环境中最好关闭devtool，因为这样可以极大的减小打包的体积。

生产环境下： `(none)`（省略 `devtool` 选项） - 不生成 source map。这是一个不错的选择。



## proxy

**webpack开发配置API代理解决跨域问题-devServer**

设置代理的前提条件： 
1、需要使用本地开发插件：[webpack-dev-server](https://github.com/webpack/webpack-dev-server)。 
2、webpack-dev-server使用的是[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)来实现跨域代理的。 

## 1.一个webpack配置信息：

```
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://www.baidu.com/',
        pathRewrite: {'^/api' : ''},
        changeOrigin: true,     // target是域名的话，需要这个参数，
        secure: false,          // 设置支持https协议的代理
      },
    }
  }
};
```

## 2. 配置中主要的参数说明

### 2.1 '/api'

捕获API的标志，如果API中有这个字符串，那么就开始匹配代理， 
比如API请求`/api/users`, 会被代理到请求 http://www.baidu.com/api/users 。

### 2.2 target

```
代理的API地址，就是需要跨域的API地址。 
地址可以是域名,如：`http://www.baidu.com`
也可以是IP地址：`http://127.0.0.1:3000`
如果是域名需要额外添加一个参数`changeOrigin: true`，否则会代理失败。
```

### 2.3 pathRewrite

路径重写，也就是说会修改最终请求的API路径。 
比如访问的API路径：`/api/users`, 
设置`pathRewrite: {'^/api' : ''},`后，
最终代理访问的路径：`http://www.baidu.com/users`， 
这个参数的目的是给代理命名后，在访问时把命名删除掉。

### 2.4 changeOrigin

这个参数可以让target参数是域名。

### 2.5 secure

`secure: false`,不检查安全问题。
设置后，可以接受运行在 HTTPS 上，可以使用无效证书的后端服务器

[参考博客](https://segmentfault.com/a/1190000016199721)



## 附完整的webpack.config.js

```
const path = require('path')  //path是Nodejs中的基本包,用来处理路径
const htmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, './dist'),  //打包生成文件地址    
    filename: 'bundle.js',
    // publicPath: '/dist/'  //文件输出的公共路径
  },
  devtool: 'cheap-module-eval-source-map',  // 在线上环境时最好关闭 可以极大程度减小体积
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
          MiniCssExtractPlugin.loader,
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
        loader: "url-loader",
        options: {
          limit: 10000
        }
      }, 
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
      },
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './index.html'
    }),
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new VueLoaderPlugin(),  // vueLoader插件 允许你以一种名为单文件组件的格式撰写 Vue 组件
    new CopyWebpackPlugin([{
      from: './src/assets',
      to: './assets'
    }], {
        ignore: [],
        copyUnmodified: true
    }),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['./dist']
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    host: '0.0.0.0',  //  可以设置0.0.0.0 ,这样设置你可以通过127.0.0.1或则localhost去访问
    // open: true,       //  项目启动时,会默认帮你打开浏览器
    port: 8087,
    // hot: true,        //在单页面应用开发中,我们修改了代码后是整个页面都刷新,开启hot后,将只刷新对应的组件
    proxy: {
      '/api': {
        target: 'http://xxxx.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
}
```

