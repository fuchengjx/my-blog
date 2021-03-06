---
title: Hexo设置Menu
date: 2019-07-05 21:04:49
category: '杂项'
tags: hexo
---

## 设置Menu

- 默认只有两个首页和归档。



### 打开主题的配置文件`_config.yml`：

```
menu:
  home: / || home
  #about: /about/ || user
  #tags: /tags/ || tags
  #categories: /categories/ || th
  archives: /archives/ || archive
  #schedule: /schedule/ || calendar
  #sitemap: /sitemap.xml || sitemap
  #commonweal: /404/ || heartbeat
```

然后当你要设置某项菜单时，将_config.yml对应的#去除。 然后使用hexo new page xxx生成目录即可



###  生成“分类”页并添加tpye属性

打开命令行，进入博客所在文件夹。执行命令

```
$ hexo new page categories
```

成功后会提示：

```
INFO  Created: ~/Documents/blog/source/categories/index.md
```

根据上面的路径，找到`index.md`这个文件，打开后默认内容是这样的：

```
---
title: 文章分类
date: 2019-07-05 21:04:49
---
```

添加`type: "categories"`到内容中，添加后是这样的：

```
---
title: 文章分类
date: 2019-07-05 21:04:49
type: "categories"
---
```

保存并关闭文件。



###  生成“标签”页并添加tpye属性

打开命令行，进入博客所在文件夹。执行命令

```
$ hexo new page tags
```

成功后会提示：

```
INFO  Created: ~/Documents/blog/source/tags/index.md
```

根据上面的路径，找到`index.md`这个文件，打开后默认内容是这样的：

```
---
title: 标签
date: 2019-07-05 21:04:49
---
```

添加`type: "tags"`到内容中，添加后是这样的：

```
---
title: 文章分类
date: 2019-07-05 21:04:49
type: "tags"
---
```

保存并关闭文件。



### 给文章添加“tags”、“categories”属性

打开需要添加标签的文章，为其添加tags属性。

```
---
title: jQuery的Dom操作
date: 2019-07-05 21:04:49
categories: 
- web前端
tags:
- jQuery
- Dom
---
```

至此，成功给文章添加分类，点击首页的“标签”可以看到该标签下的所有文章。当然，只有添加了`tags: xxx`的文章才会被收录到首页的“标签”中。

打开需要添加分类的文章，为其添加categories属性。下方的`categories: web前端`表示添加这篇文章到“web前端”这个分类。注意：hexo一篇文章只能属于一个分类，也就是说如果在“- web前端”下方添加“-xxx”，hexo不会产生两个分类，而是把分类嵌套（即该文章属于 “- web前端”下的 “-xxx ”分类）。

