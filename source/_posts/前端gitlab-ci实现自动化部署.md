---
title: 前端gitlab-ci实现自动化部署
date: 2019-09-29 10:27:12
category: web前端
tags: 
- gitlab
- ci
- 自动化
---

本文是我配置一个Gitlab CI实现一个前端项目自动打包部署的踩坑体会。

## 背景

### 为什么要去配置这么一个自动化部署CI，这个需求是什么？

我所接手的这一个项目是比较老比较大的项目(vue)，它依赖了一些很麻烦的包，这些包很难在window下环境友好运行，所以导致这个项目无法打包部署。这给我们整个团队带来了很大的不便，部署只能用linux很麻烦的手动部署。(学生党不可能人人有钱买Mac吧)，所以我想配置一个gitlab-ci实现项目的自动部署，以提升效率。

## 介绍

### **Gitlab**

 一个基于git实现的在线代码仓库软件，你可以用Gitlab自己搭建一个类似于Github一样的系统，一般用于在企业、学校等内部网络搭建Git私服。

### 什么是持续集成/持续部署（CI/CD)?

阮一峰有篇文章很好的介绍了[持续集成是什么？](https://link.juejin.im?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2015%2F09%2Fcontinuous-integration.html)

> 持续集成指的是，频繁地（一天多次）将代码集成到主干。

> 持续集成的目的，就是让产品可以快速迭代，同时还能保持高质量。它的核心措施是，代码集成到主干之前，必须通过自动化测试。只要有一个测试用例失败，就不能集成。

通俗易懂的来说就是把 代码测试、打包、发布等工作交给一些工具来自动完成、这样可以提高很多效率，减少失误，开发人员只要关心把代码提交到git就行了。 

### Gitlab的CI

从 GitLab 8.0 开始，GitLab CI 就已经集成在 GitLab 中，我们只要在项目中添加一个 .gitlab-ci.yml 文件，然后添加一个 Runner，即可进行持续集成。 而且随着 GitLab 的升级，GitLab CI 变得越来越强大。

### .gitlab-ci.yml

在git项目的根目录下的一个文件，记录了一系列的阶段和执行规则。GitLab-CI在push后会解析它，根据里面的内容调用runner来运行。

简单来说就是，你利用Git版本管理Push了本地代码到你的gitlab.com上，然后Gitlab，就通知你的服务器(runner服务器)，也就是Gitlab-runner来运行构建任务。然后跑测试用例，测试用例通过了就生成Build出相应的环境的代码，自动部署上不同的环境服务器上面去。

### GitLab-Runner

这个是脚本执行的承载者，.gitlab-ci.yml的script部分的运行就是由runner来负责的。GitLab-CI浏览过项目里的.gitlab-ci.yml文件之后，根据里面的规则，分配到各个Runner来运行相应的脚本script。这些脚本有的是测试项目用的，有的是部署用的。

![1569760156912](http://img.flura.cn/1569760156912.png)

## 快速开始

简而言之，CI所需要的步骤可以归结为：

1. 添加`.gitlab-ci.yml`到项目的根目录

2. 配置一个Runner

从此刻开始，在每一次push到Git仓库的过程中，Runner会自动开启pipline，pipline将显示在项目的Pipline页面中。

------

本指南要求：

- 使用版本8.0+ 的GitLab实例或者是使用[GitLab.com](https://gitlab.com/)
- 一个想使用GitLab CI的项目

### 配置`.gitlab-ci.yml`

1. 在项目的根目录创建一个名为`.gitlab-ci.yml`的文件。注意：`.gitlab-ci.yml`是一个*&####&*_10_*&####&*文件，所以必须要格外注意锁紧。使用空格，而不是tabs。

   ```.gitlab-ci.yml
   image: node  # 选用docker镜像
   
   stages: # Stages 表示构建阶段，这里有两个阶段 install, deploy
   - install
   - deploy
   
   install-staging:dep: # Jobs 表示构建工作，表示某个 Stage 里面执行的工作。
     stage: install
     only: # 定义了只有在被merge到了master分支上 才会执行部署脚本。
     - master
     script:
     - echo "=====start install======"
     - npm install --registry=https://registry.npm.taobao.org  #安装依赖
     - echo "=====end install======"
     artifacts:  # 将这个job生成的依赖传递给下一个job。需要设置dependencies
       expire_in: 60 mins   # artifacets 的过期时间，因为这些数据都是直接保存在 Gitlab 机器上的，过于久远的资源就可以删除掉了
       paths:  # 需要被传递给下一个job的目录。
       - node_modules/
       
   deploy-staging:dep:
     stage: deploy
     only:
     - master
     script:
     - echo "=====start build======"
     - npm run build  # 将项目打包
     - echo "=====end build======"
     - echo "=====start deploy======"
     - npm run deploy # 此处执行部署脚本，将打包好的静态文件上传到阿里云的oss上，为了保护项目安全，使抽象成deploy步骤。
     - echo "=====end deploy!!!!!!======"
   ```
   

这是我的**`.gitlab-ci.yml`脚本**。(# 为`.gitlab-ci.yml`脚本注释)

#### image

  ```
   image: node  # 选用docker镜像
  ```

    我项目的 CI 任务是选的在 Docker 上运行，所以每次执行 CI 任务的时候，都会新启动一个 Docker 容器。因     为是前端项目，所以需要node环境。所以选用的是node镜像。也可以选择自己的docker镜像。



#### stages

```
stages: # Stages 表示构建阶段，这里有两个阶段 install, deploy
- install
- deploy
```

   Stages 表示构建阶段，说白了就是上面提到的流程。 我们可以在一次 Pipeline 中定义多个 Stages，每个Stage可以完成不同的任务。 Stages有下面的特点：

  - 所有 Stages 会按照顺序运行，即当一个 Stage 完成后，下一个 Stage 才会开始
  - 只有当所有 Stages 完成后，该构建任务 (Pipeline) 才会成功

   - 如果任何一个 Stage 失败，那么后面的 Stages 不会执行，该构建任务 (Pipeline) 失败



#### only

  ```
only:
- master
  ```

只有maser分支才会触发这个脚本，因为我们采用的git-flow工作流，开发人员可能把自己未完善的分支(没有经过上级code review)提交到线上仓库，那么只要有push就会触发部署到线上环境，这样的后果是不堪设想的，所以必须加一个only，只有经过了code review的代码 被merge进入了maser分支才会实现部署到线上环境。



#### Jobs

```
install-staging:dep: # Jobs 表示构建工作，表示某个 Stage 里面执行的工作。
  stage: install
```

   Jobs 表示构建工作，表示某个 Stage 里面执行的工作。 我们可以在 Stages 里面定义多个 Jobs，这些 Jobs 会有以下特点：

  - 相同 Stage 中的 Jobs 会并行执行
  - 相同 Stage 中的 Jobs 都执行成功时，该 Stage 才会成功

   - 如果任何一个 Job 失败，那么该 Stage 失败，即该构建任务 (Pipeline) 失败



#### script

  ```
        script:
         - echo "=====start install======"
         - npm install --registry=https://registry.npm.taobao.org
         - echo "=====end install======"
  ```

   **script**是一段由Runner执行的shell脚本



#### artifact

 ```
     artifacts:  # 将这个job生成的依赖传递给下一个job。需要设置dependencies
       expire_in: 60 mins   # artifacets 的过期时间，因为这些数据都是直接保存在 Gitlab 机器上的，过于久远的资源就可以删除掉了
       paths:
       - node_modules/
 ```

   artifacts 被用于在job作业成功后将制定列表里的文件或文件夹附加到job上，传递给下一个job，如果要在两个job之间传递artifacts，你必须设置[dependencies](https://docs.gitlab.com/ce/ci/yaml/README.html#dependencies)



#### 脚本总结

**总结**： 这个脚本的作用是 将merge进入master分支的代码打包并部署到阿里云的oss上。这里最值得注意的就是artifact，因为定义了两个job，其实每个job都是用的新的镜像，所以这样就会导致install阶段与deploy阶段没有任何关系，但是实际上deploy阶段是依赖install阶段安装的node_module的。所以必须将install阶段安装的 node_modules传递给下一个job(deploy)，这就需要用到artifact或者cache了(这里我用的是artifact)。ps:我还其实还把这两个job整合成一个了，但是不知道为什么明明两个分开执行就只要10min，而合在一个job就要超过1h，最后导致超时Pipeline失败。




更多详细配置可以看这篇博客[gitlab-ci配置详解](https://segmentfault.com/a/1190000011890710)

或者参考官方文档 [官方配置文档](https://docs.gitlab.com/ee/ci/yaml/README.html)



2. 推送`.gitlab-ci.yml`到GitLab

   一旦创建了`.gitlab-ci.yml`，你应该及时添加到Git仓库并推送到GitLab。

   现在到**Pipelines**页面查看，将会看到该Pipline处于等待状态。

   ![1569815810780](http://img.flura.cn/1569815810780.png)



### 配置Runner

在GitLab中，Runners将会运行你在`.gitlab-ci.yml`中定义的jobs。Runner可以是虚拟机，VPS，裸机，docker容器，甚至一堆容器。GitLab和Runners通过API通信，所以唯一的要求就是运行Runners的机器可以联网。

一个Runner可以服务GitLab中的某个特定的项目或者是多个项目。如果它服务所有的项目，则被称为共享的Runner。

在[Runners](https://docs.gitlab.com/ee/ci/runners/README.html)文档中查阅更多关于不同Runners的信息。

你可以通过**Settings->CI/CD**查找是否有Runners分配到你的项目中。创建一个Runner是简单且直接的。官方支持的Runner是用GO语言写的，它的文档在这里https://docs.gitlab.com/runner/。

为了有一个功能性的Runner，你需要遵循以下步骤：

#### [安装](https://docs.gitlab.com/runner/install/)

1. 添加Gitlab的官方源：

   ```
   # For Debian/Ubuntu
   curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-ci-multi-runner/script.deb.sh | sudo bash
   
   # For CentOS
   curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-ci-multi-runner/script.rpm.sh | sudo bash
   ```

2. 安装

   ```
   # For Debian/Ubuntu
   sudo apt-get install gitlab-ci-multi-runner
   
   # For CentOS
   sudo yum install gitlab-ci-multi-runner
   ```

3. 注册Runner
   Runner需要注册到Gitlab才可以被项目所使用，一个gitlab-ci-multi-runner服务可以注册多个Runner。

   ```
   $ sudo gitlab-ci-multi-runner register
   
   Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com )
   https://mygitlab.com/ci
   Please enter the gitlab-ci token for this runner
   xxx-xxx-xxx
   Please enter the gitlab-ci description for this runner
   my-runner
   INFO[0034] fcf5c619 Registering runner... succeeded
   Please enter the executor: shell, docker, docker-ssh, ssh?
   Please enter the Docker image (eg. ruby:2.1):
   node
   INFO[0037] Runner registered successfully. Feel free to start it, but if it's
   running already the config should be automatically reloaded!
   ```
   
ps: 这里面的gitlab-ci coordinator URL 与token
   
```
   Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com )
   https://mygitlab.com/ci
   Please enter the gitlab-ci token for this runner
   xxx-xxx-xxx
   ```
   
是在gitlab配置对应的runner里可以查看的。
   
![1569816937998](http://img.flura.cn/1569816937998.png)
   
![1569817315527](http://img.flura.cn/1569817315527.png)

#### [配置](https://docs.gitlab.com/ee/ci/runners/README.html#registering-a-specific-runner)

按照上面的连接设置你自己的Runner，我这边因为这是专用对于一个项目的runner，所以我配置的是specific runner。

一旦Runner安装好，你可以从项目的**Settings->CI/CD**找到Runner页面。

![1569816937998](http://img.flura.cn/1569816937998.png)

![1569817028804](http://img.flura.cn/1569817028804.png)

## 参考

- [GitLab CI/CD快速入门](http://www.ttlsa.com/auto/gitlab-cicd-quick-start/)

- [前端项目基于GitLab-CI的持续集成/持续部署（CI/CD）](https://juejin.im/post/5c015f4ae51d453244120d86)

- [前端的gitlab的ci初尝试](https://juejin.im/post/5b03963a51882542821ca56a)

- [[GitLab-CI 从安装到差点放弃](https://segmentfault.com/a/1190000007180257)](https://docs.gitlab.com/ee/ci/yaml/README.html)

  