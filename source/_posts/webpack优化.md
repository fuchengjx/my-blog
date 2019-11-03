---
title: webpack性能优化
date: 2019-11-01 09:09:21
category: "web前端"
tags: 
- webpack
- 项目优化
---

本文根据经验总结了一些对于webpack的优化方法。分别从webpack打包前的构建优化(提高代码构建速度)。打包后的线上体验优化。参考并总结了现在常见的优化方法。希望以后可以提升webpack构建的项目性能。

# 提高构建速度

## 减小编译范围

缩小编译范围，减少不必要的编译工作，即 modules、mainFields、noParse、includes、exclude、alias全部用起来

```
const resolve = dir => path.join(__dirname, '..', dir);

// ...
resolve: {
    modules: [ // 指定以下目录寻找第三方模块，避免webpack往父级目录递归搜索
        resolve('src'),
        resolve('node_modules'),
        resolve(config.common.layoutPath)
    ],
    mainFields: ['main'], // 只采用main字段作为入口文件描述字段，减少搜索步骤
    alias: {
        vue$: "vue/dist/vue.common",
        "@": resolve("src") // 缓存src目录为@符号，避免重复寻址
    }
},
module: {
    noParse: /jquery|lodash/, // 忽略未采用模块化的文件，因此jquery或lodash将不会被下面的loaders解析
    // noParse: function(content) {
    //     return /jquery|lodash/.test(content)
    // },
    rules: [
        {
            test: /\.js$/,
            include: [ // 表示只解析以下目录，减少loader处理范围
                resolve("src"),
                resolve(config.common.layoutPath)
            ],
            exclude: file => /test/.test(file), // 排除test目录文件
            loader: "happypack/loader?id=happy-babel" // 后面会介绍
        },
    ]
}
```



## 并发构建

### terser-webpack-plugin

压缩是构建中耗时占比较大的一环，我们可以启用 terser-webpack-plugin 的多线程压缩，减少压缩时间。

```
module.exports = {
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        parallel: true // 开启多线程压缩
      })
    ]
  }
}
```



### webpack-parallel-uglify-plugin 

实际上，搭载 webpack-parallel-uglify-plugin 插件，这个过程可以倍速提升。我们都知道 node 是单线程的，但node能够fork子进程，基于此，webpack-parallel-uglify-plugin 能够把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程，从而实现并发编译，进而大幅提升js压缩速度，如下是配置。**多线程压缩**

```
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

// ...
optimization: {
    minimizer: [
        new ParallelUglifyPlugin({ // 多进程压缩
            cacheDir: '.cache/',
            uglifyJS: {
                output: {
                    comments: false,
                    beautify: false
                },
                compress: {
                    wa  rnings: false,
                    drop_console: true,
                    collapse_vars: true,
                    reduce_vars: true
                }
            }
        }),
    ]
}
```



### HappyPack 

同 webpack-parallel-uglify-plugin 插件一样，HappyPack 也能实现并发编译，从而可以大幅提升 loader 的解析速度， 如下是部分配置。

```
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const createHappyPlugin = (id, loaders) => new HappyPack({
    id: id,
    loaders: loaders,
    threadPool: happyThreadPool,
    verbose: process.env.HAPPY_VERBOSE === '1' // make happy more verbose with HAPPY_VERBOSE=1
});
12345678
```

那么，对于前面 `loader: "happypack/loader?id=happy-babel"` 这句，便需要在 plugins 中创建一个 `happy-babel` 的插件实例。

```
plugins: [
    createHappyPlugin('happy-babel', [{
        loader: 'babel-loader',
        options: {
            babelrc: true,
            cacheDirectory: true // 启用缓存
        }
    }])
]
```

像 vue-loader、css-loader 都支持 happyPack 加速，如下所示。

```
plugins: [
    createHappyPlugin('happy-css', ['css-loader', 'vue-style-loader']),
    new HappyPack({
        loaders: [{
            path: 'vue-loader',
            query: {
                loaders: {
                    scss: 'vue-style-loader!css-loader!postcss-loader!sass-loader?indentedSyntax'
                }
            }
        }]
    })
]
```



## noParse（无需解析内部依赖的包）

对于我们引入的一些第三方包，比如`jQuery`，在这些包内部是肯定不会依赖别的包，所以根本不需要webpack去解析它内部的依赖关系，可以在`webpack`配置文件中的`module`属性下加上`noParse`属性，它的值是一个正则表达式，用来匹配无需解析的模块，这样可以节约`webpack`的打包时间，提高打包效率。

```
module：{
    noParse：/jquery/
}
```



## DllPlugin & DllReferencePlugin 提前打包公共依赖

我们都知道，webpack打包时，有一些框架代码是基本不变的，比如说 babel-polyfill、vue、vue-router、vuex、axios、element-ui、fastclick 等，这些模块也有不小的 size，每次编译都要加载一遍，比较费时费力。使用 DLLPlugin 和 DLLReferencePlugin 插件，便可以将这些模块提前打包。

当项目达到一定体量，打包速度、热加载性能优化的需求就会被提出来，毕竟谁也不愿意修改后花上十几秒甚至几分钟等待修改视图更新。接下里我会介绍一些通用的优化策略，但需要注意的是，项目本身不能去踩一些无法优化的坑，已知两坑：超多页（ html-webpack-plugin 热更新时更新所有页面）和动态加载未指明明确路径（打包目录下所有页面）。

DllPlugin 和 DllReferencePlugin 绝对是优化打包速度的最佳利器，它可以把部分公共依赖提前打包好，在之后的打包中就不再打包这些依赖而是直接取用已经打包好的代码，通常情况能降低 20% ~ 40% 打包时间，当然它也有缺点：

- 需要在初始化和相关依赖更新时，额外执行一条命令
- 通常 dll 是在 `.html` 文件中引入，滥用会导致首屏加载变慢

但总归来说是利大于弊。

为了完成 dll 过程，我们需要准备一份新的webpack配置，即 webpack.dll.config.js。

```
const webpack = require("webpack");
const path = require('path');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const dllPath = path.resolve(__dirname, "../src/assets/dll"); // dll文件存放的目录

module.exports = {
    entry: {
        // 把 vue 相关模块的放到一个单独的动态链接库
        vue: ["babel-polyfill", "fastclick", "vue", "vue-router", "vuex", "axios", "element-ui"]
    },
    output: {
        filename: "[name]-[hash].dll.js", // 生成vue.dll.js
        path: dllPath,
        library: "_dll_[name]"
    },
    plugins: [
        new CleanWebpackPlugin(["*.js"], { // 清除之前的dll文件
            root: dllPath,
        }),
        new webpack.DllPlugin({
            name: "_dll_[name]",
            // manifest.json 描述动态链接库包含了哪些内容
            path: path.join(__dirname, "./", "[name].dll.manifest.json")
        }),
    ],
};
1234567891011121314151617181920212223242526
```

接着， 需要在 package.json 中新增 dll 命令。

```
"scripts": {
    "dll": "webpack --mode production --config build/webpack.dll.config.js"
}
123
```

运行 `npm run dll` 后，会生成 `./src/assets/dll/vue.dll-[hash].js` 公共js 和 `./build/vue.dll.manifest.json` 资源说明文件，至此 dll 准备工作完成，接下来在 webpack 中引用即可。

```
externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'vuex',
    'elemenct-ui': 'ELEMENT',
    'axios': 'axios',
    'fastclick': 'FastClick'
},
plugins: [
    ...(config.common.needDll ? [
        new webpack.DllReferencePlugin({
            manifest: require("./vue.dll.manifest.json")
        })
    ] : [])
]
123456789101112131415
```

dll 公共js轻易不会变化，假如在将来真的发生了更新，那么新的dll文件名便需要加上新的hash，从而避免浏览器缓存老的文件，造成执行出错。由于 hash 的不确定性，我们在 html 入口文件中没办法指定一个固定链接的 script 脚本，刚好，add-asset-html-webpack-plugin 插件可以帮我们自动引入 dll 文件。

```
const autoAddDllRes = () => {
    const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
    return new AddAssetHtmlPlugin([{ // 往html中注入dll js
        publicPath: config.common.publicPath + "dll/",  // 注入到html中的路径
        outputPath: "dll", // 最终输出的目录
        filepath: resolve("src/assets/dll/*.js"),
        includeSourcemap: false,
        typeOfAsset: "js" // options js、css; default js
    }]);
};

// ...
plugins: [
    ...(config.common.needDll ? [autoAddDllRes()] : [])
]
```

## 生成合理的 Source Map

在 webpack 4 中，是否生成 Source Map 以及生成怎样的 Source Map 是由 `devtool` 配置控制的，选择合理的 Source Map 可以有效的缩短打包时间。在选择前我们还是应该明白，不设置 Source Map 时打包是最快的，之所以需要 Source Map ，是因为打包后的代码结构、文件名和打包前完全不一致，当存在报错时我们只能直接定位到打包后的某个文件，无法定位到源文件，极大程度增加了调试难度。而 Source Map 就是为了增强打包后代码的可调试性而存在的，所以我们在开发环境总是需要它，在生产环境则有更多选择。

`devtool` 可选配置有 `none` 、 `eval` 、 `cheap-eval-source-map` 等 13 种，各自功能和性能比较在 [文档](https://webpack.docschina.org/configuration/devtool/) 中有详细介绍。

配置项由一个或多个单词和连字符组成，每个单词都有其含义和性能损耗，每个配置项最终意义就由这些单词决定：

- `none` 不生成 Source Map ，性能 +++
- `eavl` 每个模块由 `eval` 执行，不能正确显示行数，不能用生产模式，性能 +++
- `module` 报错显示原始代码，性能 -
- `source` 报错显示行列信息，显示 babel 转译后代码，性能 --
- `cheap` 低开销模式，不映射列，性能 +
- `inline` 不生成单独的 Source Map 文件，性能 o

#### 开发环境

由于开发模式建议显示报错源码和行信息，所以 `module` 和 `source` 都是需要的，为了性能我们又需要 `eval` 和 `cheap` ，所以参照配置项能找到最适合开发环境的配置是 `devtool: cheap-module-eval-source-map` 。

#### 生产环境

生产环境由于几乎不存在调试需求（ JS 相关调试），所以建议大家设置 `devtool: none` ，在需要调试的时候再更改设置为 `devtool: cheap-module-source-map` 。

分别配置 mode属性，设置为 `development` 将获得最好的开发体验，设置为 `production` 将专注项目编译部署，比如说开启 Scope hoisting 和 Tree-shaking 功能。



# 线上环境用户体验优化



## 路由懒加载

Vue  是单页面应用，可能会有很多的路由引入 ，这样使用 webpcak 打包后的文件很大，当进入首页时，加载的资源过多，页面会出现白屏的情况，不利于用户体验。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应的组件，这样就更加高效了。这样会大大提高首屏显示的速度，但是可能其他的页面的速度就会降下来。

**路由懒加载：**

```
const Foo = () => import('./Foo.vue')
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```



## 组件异步加载

如果组件在页面加载时不需要，只在调用时用到，这时可以使用异步组件的写法。仅仅是引入和组件注册写法不同

```
// template
<test v-if="showTest"></test>

// script
  components: {
    test: () => import('./test') // 将组件异步引入，告诉webpack，将该部分代码分割打包
  },
  methods:{
      clickTest () {
          this.showTest = !this.showTest
    }
  }
```



## 魔法注释

在懒加载的同时可以使用魔法注释：`Prefetching`，可以在首页资源加载完毕后，**空闲时间时，将动态导入的资源加载进来**，这样即可以提高页面加载速度又保证了用户体验。(感觉有点类似于h2的主动推送)

```
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
```



## 代码优化 压缩

vue-cli已经使用UglifyJsPlugin 插件来压缩代码，可以设置成如下配置：

```
new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
    drop_console: true,
    pure_funcs: ['console.log']
  },
  sourceMap: false
})
```



## 代码分离(SplitChunksPlugin)

代码分离有两个优点：

- 剥离公共代码和依赖，避免重复打包

- 避免单个文件体积过大

  总加载体积一致，浏览器加载多个文件通常快于单个文件

为了解决公共资源被重复打包问题，我们就需要 [SplitChunksPlugin](https://webpack.docschina.org/plugins/split-chunks-plugin/) 的帮助，它可以把代码分离成不同的 bundle ，在页面需要时被加载。另外 SplitChunksPlugin 是 webpack 4 的内置插件，所以我们不需要去独立安装它。



使用方法：只需在主配置文件中添加如下配置即可

```
Optimization: {
    splitChunks: {
        Chunks: 'all'
    }
}
```



## tree shaking

上面我们分离代码，解决了项目中部分代码被重复打包到多个生成物中的问题，有效地缩小了生成物体积，但其实我们还可以在此基础上进一步缩小体积，这就涉及本小节的概念 tree shaking 。

> tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块语法的 静态结构 特性，例如 import 和 export。

> 你可以将应用程序想象成一棵树。绿色表示实际用到的 source code(源码) 和 library(库)，是树上活的树叶。灰色表示未引用代码，是秋天树上枯萎的树叶。为了除去死去的树叶，你必须摇动这棵树，使它们落下。

我们回头看在使用 SplitChunksPlugin 时生成的文件，可以发现 `say` 函数没有使用但是却被打包进来了，它实际上是无用的代码，也就是文档中说的 dead-code 。要删除这些代码，只需要把 `mode` 修改为 `production` （让 tree shaking 生效），再次打包~

不过需要注意的是， tree shaking 能移除无用代码的同时，也有一定的副作用（错误识别无用代码）。比如你可能会遇到 **UI 组件库没有样式**的问题，这个问题原因在于 tree shaking 不仅对 JS 生效，也对 CSS 生效 。我们通常在导入 CSS 时使用 `import 'xxx.min.css'` ， ES6 的静态导入 + 生产环境满足了 tree shaking 的生效条件，并且 Webpack 无法判断 CSS 有效，所以它被当做了 dead-code 然后被删除。为了解决这个问题，你可以在 `package.json` 中添加一个 `sideEffects` 选项，告知 Webpack 那些文件是可以直接引入而不用 tree shaking 检查的，使用如下：

```
package.json
{
  "sideEffects": [
    "*.css",
    "*.styl(us)?"
  ]
}
```



## cdn加速

浏览器从服务器上下载 CSS、js 和图片等文件时都要和服务器连接，而大部分服务器的带宽有限，如果超过限制，网页就半天反应不过来。而 CDN 可以通过不同的域名来加载文件，从而使下载文件的并发连接数大大增加，且CDN 具有更好的可用性，更低的网络延迟和丢包率 。

或者直接开启**全站加速**服务。对你部署的域名或者ip进行加速，无需对服务器源站上的资源进行改造，全站加速会智能区分动静态内容并分别加速。整个网站的资源访问速度都会大大加快。



# 参考博客

[webpack优化的一些基本方法](https://juejin.im/post/5d68d6b0e51d4561a60d9e1c?utm_source=gold_browser_extension)

[使用webpack4提升180%编译速度](http://louiszhai.github.io/2019/01/04/webpack4/)

[三十分钟掌握Webpack性能优化](https://juejin.im/post/5b652b036fb9a04fa01d616b)