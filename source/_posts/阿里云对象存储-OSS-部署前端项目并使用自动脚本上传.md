---
title: 阿里云对象存储(OSS)部署前端项目并使用自动脚本上传
date: 2019-10-01 19:47:31
category: '杂项'
tags:
- 阿里云
- oss 
- 自动化
- 项目部署
- webpack
---

## 前言

使用阿里云OSS + CDN方案的几大好处：

- 成本低廉。OSS+CDN部署自己的网站每个月的花费远比自己买ECS服务器部署网站花费要少得多
- 大幅降低运维成本。直接使用现成的云服务了，无需花精力去维护ECS了。
- 极高的可用性。无论阿里云的OSS还是CDN，都已经做好了高可用性，几乎可以保证网站始终可访问
- 极高的访问速度。ECS带宽毕竟有限的，高带宽意味着超高的费用。但是用OSS+CDN这种天然分布式的架构部署网站很轻松的解决了带宽问题，极大地提升了用户的访问体验。
- OSS会自动帮你压缩，使得你的页面加载速度极快。

为此我写了一篇博客来帮助指导使用OSS，并且写了一个部署脚本deploy.js来实现自动上传。[**js_deploy**](https://github.com/fuchengjx/js_deploy/blob/master/deploy.js)

## 配置 阿里云对象存储(OSS)

首先登陆阿里云oss控制台，点击创建一个bucket。

![1569852346504](http://img.flura.cn/1569852346504.png)



根据自己的需求选择参数。

![配置bucket](http://img.flura.cn/1569852446019.png)



然后就创建了一个bucket。

![1569852577526](http://img.flura.cn/1569852577526.png)



为bucket配置域名，在上图中，将阿里云外网访问Bucket域名记录下来。然后在DNS控制台添加记录解析。然后回到oss控制台，在**域名管理**选项 将你刚刚DNS解析的域名 绑定上去。这样就可以通过自己设置的二级域名访问到自己的项目了。

![Bucket域名](http://img.flura.cn/1569852876717.png)

![DNS控制台解析](C:\Users\32761\AppData\Roaming\Typora\typora-user-images\1569853154407.png)

![域名管理](http://img.flura.cn/1569853473577.png)

在**基础设置**找到静态页面 设置默认首页的文件名 一般都是index.html，如果有404页面也可以配置。

![1569853929467](http://img.flura.cn/1569853929467.png)

就下来就只要将自己的打包出来的静态文件 通过deploy.js脚本上传到OSS上就行了



## 配置deploy.js

打开deploy.js将bucket,region填入。key，secret可能忘记(在刚开始使用阿里云的时候，阿里云会将这个发送给你，并提醒你保存)，可以在**用户信息管理** **安全信息管理**获取到自己的Access Key Secret(也可以在这里创建一个新的AccessKey)。 因为deploy.js中保存有你的阿里云accessKeyId与accessKeySecret 所以**记得在.gitignore文件忽略deploy.js**

![1569854391813](http://img.flura.cn/1569854391813.png)



![用户信息管理界面](http://img.flura.cn/1569854935227.png)

这样再稍微配置下要部署的项目 就可以用这个脚本了。

## 使用

将deploy.js下载到你的项目根目录下。一般是webpack打包而成的单页面应用。页面打包生成dist文件夹目录，将dist文件夹上传到阿里云oss上。

在package.json中加入这个脚本命令，用来更快的执行部署命令。也可以手动node deploy.js执行部署脚本。

```
"scripts": {
  "deploy": "node deploy.js"
},
"devDependencies": {
  "ali-oss": "^6.1.1",  // 这是阿里云的oss依赖，也可以直接手动npm install ali-oss --save-dev
}
```

### 演示

在这里 我演示一个将ant-design-pro构建的项目打包上传到oss上。

![上传成功](http://img.flura.cn/1569923829980.png)

然后就可以访问到了(记得一定要在oss控制台设置index.html为首页)

![访问成功](http://img.flura.cn/1569928381648.png)



## webpack项目自动部署到阿里云OSS

这里做一个补充：如果是一个webpack项目 我们使用一个webpack插件，可以实现自动部署到阿里oss的效果。可以极大的提升开发效率，开发完毕，打包项目就可以部署到线上环境。

### `aliyunoss-webpack-plugin`插件使用

1. 首先安装`aliyunoss-webpack-plugin`插件

```
yarn add aliyunoss-webpack-plugin -D
// 或者使用 npm i aliyunoss-webpack-plugin -D
```

1. 修改`webpack.prod.conf.js`

```
const AliyunossWebpackPlugin = require('aliyunoss-webpack-plugin')
const oss = require('../oss')
...
plugins: [
    ...
    // 插入到最后面
    new AliyunossWebpackPlugin({
      buildPath: 'dist/**',
      region: oss.region,
      accessKeyId: oss.accessKeyId,
      accessKeySecret: oss.accessKeySecret,
      bucket: oss.bucket,
      deleteAll: true,
      generateObjectPath: function(filename, file) {
        return file.replace(/dist\//, '')
      },
    })
}
```

创建一个oss.js 因为不希望 阿里云oss隐私信息被上传到git所以 **记得在.gitignore文件中忽略。**

现在只要执行npm run build就能打包并上传到oss上实现自动部署了。



## deploy.js github仓库链接

[github仓库](https://github.com/fuchengjx/js_deploy/blob/master/deploy.js)