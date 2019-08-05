---
title: react学习笔记
date: 2019-07-09 10:46:41
categories: web前端
tags: 
- react
---

# React

## React 介绍



- React 是一个用于构建用户界面的渐进式 JavaScript 库
  - 本身只处理 UI
  - 不关系路由
  - 不处理 ajax
- React主要用于构建UI，很多人认为 React 是 MVC 中的 V（视图）。
  - 数据驱动视图
- React 由 Facebook 开发
- 第一个真生意义上把组件化思想待到前端开发领域

### React 特点

- 组件化
- 高效
  - 虚拟 DOM
  - Vue 2 也是虚拟 DOM
  - 虚拟 DOM 更高效
- 灵活
  - 渐进式，本身只处理 UI ，可以和你的其它技术栈组合到一起来使用
- 声明（配置）式设计
  - `data` 响应式数据
  - `mathods` 处理函数
  - 这样做的好处就是按照我们约定好的方式来开发，所有人写出来的代码就像一个人写的
  - `state`
  - 方法就是类成员
  - 也有特定的组件生命钩子
- JSX
  - 一种预编译 JavaScript 语言，允许让你的 JavaScript 和 HTML 混搭
  - 模板中就是 JavaScript 逻辑
- 单向数据流
  - 组件传值
  - 所有数据都是单向的，组件传递的数据都是单向
  - Vue 也是单向数据流
  - 没有双向数据绑定

### React 与 Vue 的对比

#### 技术层面

- Vue 生产力更高（更少的代码实现更强劲的功能）
- React 更 hack 技术占比比较重
- 两个框架的效率都采用了虚拟 DOM
  - 性能都差不多
- 组件化
  - Vue 支持
  - React 支持
- 数据绑定
  - 都支持数据驱动视图
  - Vue 支持表单控件双向数据绑定
  - React 不支持双向数据绑定
- 它们的核心库都很小，都是渐进式 JavaScript 库
- React 采用 JSX 语法来编写组件
- Vue 采用单文件组件
  - `template`
  - `script`
  - `style`

#### 开发团队

- React 由 Facebook 前端维护开发
- Vue
  - 早期只有尤雨溪一个人
  - 由于后来使用者越来越多，后来离职专职开发维护
  - 目前也有一个小团队在开发维护

#### 社区

- React 社区比 Vue 更强大
- Vue 社区也很强大

#### Native APP 开发

- React Native
  - 可以原生应用
  - React 结束之后会学习
- Weex
  - 阿里巴巴内部搞出来的一个东西，基于 Vue

### 相关资源链接

- [React 官网](https://reactjs.org/)
- [官方教程](https://reactjs.org/tutorial/tutorial.html)
  - 连字游戏
- [官方文档](https://reactjs.org/docs/)
  - 基础教程
  - 高级教程
  - API 参考文档
- [React - GitHub](https://github.com/facebook/react)
- [阮一峰 - React 技术栈系列教程](http://www.ruanyifeng.com/blog/2016/09/react-technology-stack.html)
- [阮一峰 - React 入门实例教程]（http://www.ruanyifeng.com/blog/2015/03/react.html
- [awesome react](https://github.com/enaqx/awesome-react)
- [awesome-react-components](https://github.com/brillout/awesome-react-components)



## 起步

> https://reactjs.org/docs/hello-world.html

### 初始化及安装依赖

```Shell
$ mkdir react-demos
$ cd react-demos
$ npm init --yes
$ npm install --save babel-standalone react react-dom
```

### Hello World

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>demo - Hello World</title>
  <script src="../node_modules/babel-standalone/babel.min.js"></script>
  <script src="../node_modules/react/umd/react.development.js"></script>
  <script src="../node_modules/react-dom/umd/react-dom.development.js"></script>
</head>

<body>
  <div id="root"></div>
  <script type="text/babel">
    ReactDOM.render(
      <h1>Hello, react!</h1>,
      document.getElementById('root')
    )
  </script>
</body>

</html>
```



## JSX

HTML 语言直接写在 JavaScript 语言中，不加任何引号，这就是 JSX 语法。它允许 HTML 与 JavaScript 的混写。

### 基本语法规则

- **必须只能有一个根节点**

- 遇到 HTML 标签 （以 `<` 开头） 就用 HTML 规则解析
  - 单标签不能省略结束标签。
- 遇到代码块（以 `{` 开头），就用 JavaScript 规则解析
- JSX 允许直接在模板中插入一个 JavaScript 变量
  - 如果这个变量是一个数组，则会展开这个数组的所有成员添加到模板中
- 单标签必须结束 `/>`

### 在 JSX 中嵌入 JavaScript 表达式

- 语法
- 如果 JSX 写到了多行中，则建议包装括号避免自动分号的陷阱

```jsx
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

### 在 JavaScript 表达式中嵌入 JSX

```jsx
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### JSX 中的节点属性

- 动态绑定属性值
- `class` 使用 `className`
- `tabindex` 使用 `tabIndex`
- `for` 使用 `htmlFor`

普通的属性：

```jsx
const element = <div tabIndex="0"></div>;
```

在属性中使用表达式：

```jsx
const element = <img src={user.avatarUrl}></img>;
```

### 声明子节点

如果标签是空的，可以使用 `/>` 立即关闭它。

```jsx
const element = <img src={user.avatarUrl} />;
```

JSX 子节点可以包含子节点：

```jsx
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

### JSX 自动阻止注入攻击

```jsx
const element = <div>{'<h1>this is safe</h1>'}</div>
```

### 在 JSX 中使用注释

写法一：

```jsx
{
  // 注释
  // ...
}
```

写法二（单行推荐）：

```
{/* 单行注释 */}
```

写法三（多行推荐）：

```jsx
{
  /*
   * 多行注释
   */
}
```



### JSX 原理

Babel 会把 JSX 编译为 `React.createElement()` 函数。

实际上，JSX 仅仅只是 `React.createElement(component, props, ...children)` 函数的语法糖。如下 JSX 代码：

```
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

会编译为：

```
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```



- 每个 React 元素都是一个真实的 JavaScript 对象

下面两种方式是等价的：

```jsx
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```jsx
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

```javascript
// Note: this structure is simplified
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world'
  }
};
```



## 列表循环

JSX 允许直接在模板插入 JavaScript 变量。如果这个变量是一个数组，则会展开这个数组的所有成员。

```jsx
var arr = [
  <h1>Hello world!</h1>,
  <h2>React is awesome</h2>,
];
ReactDOM.render(
  <div>{arr}</div>,
  document.getElementById('example')
);
```

综上所述，我们可以这样：

```jsx
var names = ['Alice', 'Emily', 'Kate'];

ReactDOM.render(
  <div>
  {
    names.map(function (name) {
      return <div>Hello, {name}!</div>
    })
  }
  </div>,
  document.getElementById('example')
);
```





## 条件渲染

```
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true}
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(prevState => ({
      showWarning: !prevState.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```



## 事件处理

```
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

```
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

​```
// This binding is necessary to make `this` work in the callback
this.handleClick = this.handleClick.bind(this);
​```

  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```



## 组件

React 允许将代码封装成组件（component），然后像插入普通 HTML 标签一样，在网页中插入这个组件。

### 组件规则注意事项

- **组件类的第一个首字母必须大写**
- 组件类必须有 `render` 方法
- 组件类必须有且只有一个根节点
- 组件属性可以在组件的 `props` 获取
  - 函数需要声明参数：`props`
  - 类直接通过 `this.props`

### 函数式组件（无状态）

- 名字不能用小写
  - React 在解析的时候，是以标签的首字母来区分的
  - 如果首字母是小写则当作 HTML 来解析
  - 如果首字母是大小则当作组件来解析
  - 结论：组件首字母必须大写

### 类方式组件（有状态）

```jsx
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// Example usage: <ShoppingList name="Mark" />
```

### 组件传值 Props

EcmaScript 5 构造函数：

```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

EcmaScript 6 Class：

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### `this.props.children`

> 参考文档：https://reactjs.org/docs/react-api.html#reactchildren

`this.props` 对象的属性与组件的属性一一对应，但是有一个例外，就是 `this.props.children` 属性。

它表示组件的所有子节点。

`this.props.children` 的值有三种可能：如果当前组件没有子节点，它就是 `undefined`;如果有一个子节点，数据类型是 `object` ；如果有多个子节点，数据类型就是 `array` 。所以，处理 `this.props.children` 的时候要小心。

React 提供一个工具方法 [`React.Children`](https://facebook.github.io/react/docs/top-level-api.html#react.children) 来处理 `this.props.children` 。我们可以用 `React.Children.map` 来遍历子节点，而不用担心 `this.props.children` 的数据类型是 `undefined` 还是 `object`。

### 用户定义的组件必须以大写字母开头

**以小写字母开头的元素代表一个 HTML 内置组件**，比如 `<div>` 或者 `<span>` 会生成相应的字符串 `'div'` 或者 `'span'` 传递给 `React.createElement`（作为参数）。**大写字母开头的元素则对应着在 JavaScript 引入或自定义的组件**，如 `<Foo />` 会编译为 `React.createElement(Foo)`。

我们建议使用大写字母开头命名自定义组件。如果你确实需要一个以小写字母开头的组件，则在 JSX 中使用它之前，必须将它赋值给一个大写字母开头的变量。

例如，以下的代码将无法按照预期运行：

```
import React from 'react';

// 错误！组件应该以大写字母开头：
function hello(props) {
  // 正确！这种 <div> 的使用是合法的，因为 div 是一个有效的 HTML 标签
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // 错误！React 会认为 <hello /> 是一个 HTML 标签，因为它没有以大写字母开头：
  return <hello toWhat="World" />;
}
```

要解决这个问题，我们需要重命名 `hello` 为 `Hello`，同时在 JSX 中使用 `<Hello />` ：