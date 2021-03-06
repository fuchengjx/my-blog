---
title: 浅谈http
date: 2019-04-26 17:22:48
categories: 计算机网络
tags: 
- http
---

### HTTP概述

HTTP (HyperText Transfer Protocol,超文本传输协议)。  Web是建立在HTTP协议通信的。

HTTP 是个应用层协议。HTTP 无需操心网络通信的具体细节；它把联网的细节都
交给了通用、可靠的因特网传输协议 TCP/IP。

TCP 提供了：
• 无差错的数据传输；
• 按序传输（数据总是会按照发送的顺序到达）；
• 未分段的数据流（可以在任意时刻以任意尺寸将数据发送出去）。

### HTTP资源

Web 服务器是 Web 资源（Web resource）的宿主。Web 资源是 Web 内容的源头。
最简单的 Web 资源就是 Web 服务器文件系统中的静态文件。这些文件可以包含
任意内容：文本文件、HTML 文件、微软的 Word 文件、Adobe 的 Acrobat 文件、
JPEG 图片文件、AVI 电影文件，或所有其他你能够想到的格式。

#### **MIME**

（Multipurpose Internet Mail Extension，多用途因特网邮件扩展）是为了解决在不同
的电子邮件系统之间搬移报文时存在的问题。MIME 在电子邮件系统中工作得非常
好，因此 HTTP 也采纳了它，用它来描述并标记多媒体内容

• HTML 格式的文本文档由 text/html 类型来标记。
• 普通的 ASCII 文本文档由 text/plain 类型来标记。
• JPEG 格式的图片为 image/jpeg 类型。
• GIF 格式的图片为 image/gif 类型。
• Apple 的 QuickTime 电影为 video/quicktime 类型。
• 微软的 PowerPoint 演示文件为 application/vnd.ms-powerpoint 类型

#### **URL**

服务器资源名被称为统一资源标识符（Uniform Resource Identifier，URI）。
URI 就像因特网上的邮政地址一样，在世界范围内唯一标识并定位信息资源。

大部分 URL 都遵循一种标准格式，这种格式包含三个部分。
• URL 的第一部分被称为方案（scheme），说明了访问资源所使用的协议类型。这
部分通常就是 HTTP 协议（http://）。
• 第二部分给出了服务器的因特网地址（比如，www.joes-hardware.com）。
• 其余部分指定了 Web 服务器上的某个资源（比如，/specials/saw-blade.gif）

### HTTP 报文

所有的 HTTP 报文都可以分为两类： 请求报文（request message）和响应报文
（response message）。 

**请求报文的格式**

<method> <request-URL> <version>

<headers>

<entity-body>

GET /test/hi-there.txt HTTP/1.1
Accept: text/*
Host: www.joes-hardware.com

**响应报文的格式**

<version> <status> <reason-phrase>

<headers>

<entity-body>

HTTP/1.0 200 OK
Content-type: text/plain
Content-length: 19
Hi! I’m a message!

**包括以下三个部分**。

**• 起始行**
报文的第一行就是起始行，在请求报文中用来说明要做些什么，在响应报文中说
明出现了什么情况。
**• 首部字段**
起始行后面有零个或多个首部字段。每个首部字段都包含一个名字和一个值，为
了便于解析，两者之间用冒号（:）来分隔。首部以一个空行结束。添加一个首
部字段和添加新行一样简单。
**• 主体**
空行之后就是可选的报文主体了，其中包含了所有类型的数据。请求主体中包括
了要发送给 Web 服务器的数据；响应主体中装载了要返回给客户端的数据。起
始行和首部都是文本形式且都是结构化的，而主体则不同，主体中可以包含任意
的二进制数据（比如图片、视频、音轨、软件程序）。当然，主体中也可以包含
文本

### HTTP方法

**一些常见的HTTP方法**

HTTP方法 		描　　述
GET 				从服务器向客户端发送命名资源
PUT 				将来自客户端的数据存储到一个命名的服务器资源中去
DELETE		  从服务器中删除命名资源
POST 			 将客户端数据发送到一个服务器网关应用程序
HEAD 			仅发送命名资源响应中的 HTTP 首部

### HTTP状态码

状态码则用来告诉客户端，发生了什么事情。状态码位于响应的起始行中。比如，在行 HTTP/1.0 200 OK 中，状态码就是 200。

状态码分类：

![状态码分类](http://img.flura.cn/%E7%8A%B6%E6%80%81%E7%A0%81%E5%88%86%E7%B1%BB.png)

常见状态码： 

100——客户必须继续发出请求

101——客户要求服务器根据请求转换HTTP协议版本

200——交易成功

201——提示知道新文件的URL

202——接受和处理、但处理未完成

203——返回信息不确定或不完整

204——请求收到，但返回信息为空

205——服务器完成了请求，用户代理必须复位当前已经浏览过的文件

206——服务器已经完成了部分用户的GET请求

300——请求的资源可在多处得到

301——删除请求数据

302——在其他地址发现了请求数据

303——建议客户访问其他URL或访问方式

304——客户端已经执行了GET，但文件未变化

305——请求的资源必须从服务器指定的地址得到

306——前一版本HTTP中使用的代码，现行版本中不再使用

307——申明请求的资源临时性删除

400——错误请求，如语法错误

401——请求授权失败

402——保留有效ChargeTo头响应

403——请求不允许

404——没有发现文件、查询或URl

405——用户在Request-Line字段定义的方法不允许

406——根据用户发送的Accept拖，请求资源不可访问

407——类似401，用户必须首先在代理服务器上得到授权

408——客户端没有在用户指定的时间内完成请求

409——对当前资源状态，请求不能完成

410——服务器上不再有此资源且无进一步的参考地址

411——服务器拒绝用户定义的Content-Length属性请求

412——一个或多个请求头字段在当前请求中错误

413——请求的资源大于服务器允许的大小

414——请求的资源URL长于服务器允许的长度

415——请求资源不支持请求项目格式

416——请求中包含Range请求头字段，在当前请求资源范围内没有range指示值，请求也不包含If-Range请求头字段

417——服务器不满足请求Expect头字段指定的期望值，如果是代理服务器，可能是下一级服务器不能满足请求

500——服务器产生内部错误

501——服务器不支持请求的函数

502——服务器暂时不可用，有时是为了防止发生系统过载

503——服务器过载或暂停维修

504——关口过载，服务器使用另一个关口或服务来响应用户，等待时间设定值较长

505——服务器不支持或拒绝支请求头中指定的HTTP版本

### HTTP的结构组件

在本章的概述中，我们重点介绍了两个 Web 应用程序（Web 浏览器和 Web 服务器）
是如何相互发送报文来实现基本事务处理的。在因特网上，要与很多 Web 应用程序
进行交互。在本节中，我们将列出其他一些比较重要的应用程序，如下所示。
• 代理
位于客户端和服务器之间的 HTTP 中间实体。
• 缓存
HTTP 的仓库，使常用页面的副本可以保存在离客户端更近的地方。
• 网关
连接其他应用程序的特殊 Web 服务器。
• 隧道
对 HTTP 通信报文进行盲转发的特殊代理。
• Agent 代理
发起自动 HTTP 请求的半智能 Web 客户端。

#### 代理

![代理](http://img.flura.cn/%E4%BB%A3%E7%90%86.png)

代理位于客户端和服务器之间，接收所有客户端的 HTTP 请求，并
将这些请求转发给服务器（可能会对请求进行修改之后转发）。对用户来说，这些应
用程序就是一个代理，代表用户访问服务器。



#### 缓存

![缓存](http://img.flura.cn/%E7%BC%93%E5%AD%98.png)

Web 缓存（Web cache）或代理缓存（proxy cache）是一种特殊的 HTTP 代理服务
器，可以将经过代理传送的常用文档复制保存起来。下一个请求同一文档的客户端
就可以享受缓存的私有副本所提供的服务了。 客户端从附近的缓存下载文档会比从远程 Web 服务器下载快得多。



#### 网关

![隧道](http://img.flura.cn/%E7%BD%91%E5%85%B3.png)

网关（gateway）是一种特殊的服务器，作为其他服务器的中间实体使用。通常用于
将 HTTP 流量转换成其他的协议。网关接受请求时就好像自己是资源的源端服务器
一样。客户端可能并不知道自己正在与一个网关进行通信。



#### 隧道

![隧道](http://img.flura.cn/%E9%9A%A7%E9%81%93.png)

隧道（tunnel）是建立起来之后，就会在两条连接之间对原始数据进行盲转发的
HTTP 应用程序。HTTP 隧道通常用来在一条或多条 HTTP 连接上转发非 HTTP 数
据，转发时不会窥探数据。

HTTP 隧道的一种常见用途是通过 HTTP 连接承载加密的安全套接字层（SSL，
Secure Sockets Layer）流量，这样 SSL 流量就可以穿过只允许 Web 流量通过的防
火墙了。如图 所示，HTTP/SSL 隧道收到一条 HTTP 请求，要求建立一条到目
的地址和端口的输出连接，然后在 HTTP 信道上通过隧道传输加密的 SSL 流量，这
样就可以将其盲转发到目的服务器上去了

#### Agent 代理

用户 Agent 代理（或者简称为 Agent 代理）是代表用户发起 HTTP 请求的客户端程
序。(也被叫做爬虫、网络蜘蛛、web机器人），是一种按照一定的规则，自动地抓取[万维网](https://baike.baidu.com/item/万维网/215515)信息的程序或者脚本。另外一些不常使用的名字还有[蚂蚁](https://baike.baidu.com/item/蚂蚁/9770178)、自动索引、模拟程序或者[蠕虫](https://baike.baidu.com/item/蠕虫/4454380)。

### HTTPS

HTTPS 是最常见的 HTTP 安全版本。它得到了很广泛的应用，所有主要的商业浏览
器和服务器上都提供 HTTPS。HTTPS 将 HTTP 协议与一组强大的对称、非对称和
基于证书的加密技术结合在一起，使得 HTTPS 不仅很安全，而且很灵活，很容易
在处于无序状态的、分散的全球互联网上进行管理。

![https分层](http://img.flura.cn/http%E5%88%86%E5%B1%82.png)

HTTPS = HTTP + SSL(或TLS) + 认证(证书) + 加密(加密算法)

#### HTTP和HTTPS协议的区别

1、HTTPS协议需要到证书颁发机构(Certificate Authority，简称CA)[申请证书](https://www.wosign.com/price.htm)，一般免费证书很少，需要交费。

2、HTTP是超文本传输协议，信息是明文传输，HTTPS则是具有安全性的SSL加密传输协议。

3、HTTP和HTTPS使用的是完全不同的连接方式，使用的端口也不一样,前者是80,后者是443。

4、HTTP的连接很简单,是无状态的。

5、HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，要比HTTP协议安全。

从上面可看出，HTTPS和HTTP协议相比提供了

· 数据完整性：内容传输经过完整性校验

· 数据隐私性：内容经过对称加密，每个连接生成一个唯一的加密密钥

· 身份认证：第三方无法伪造服务端(客户端)身份

其中，数据完整性和隐私性由TLS Record Protocol保证，身份认证由TLS Handshaking Protocols实现。

