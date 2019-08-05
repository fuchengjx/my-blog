---
title: react-redux学习
date: 2019-07-05 11:26:36
categories: web前端
tags: 
- react
- redux
- react-redux
---

## redux学习笔记

### 学习动机

随着 JavaScript 单页应用开发日趋复杂，**JavaScript 需要管理比任何时候都要多的 state （状态）**。 这些 state 可能包括服务器响应、缓存数据、本地生成尚未持久化到服务器的数据，也包括 UI 状态，如激活的路由，被选中的标签，是否显示加载动效或者分页器等等。

#### 使用的情形

- 用户的使用方式复杂

- 不同身份的用户有不同的使用方式（比如普通用户和管理员）

- 多个用户之间可以协作

- 与服务器大量交互，或者使用了WebSocket

- View要从多个来源获取数据

- 从组件角度看，如果你的应用有以下场景，可以考虑使用 Redux。

  > - 某个组件的状态，需要共享
  > - 某个状态需要在任何地方都可以拿到
  > - 一个组件需要改变全局状态
  > - 一个组件需要改变另一个组件的状态

### 核心api

createStore  可以帮助我们创建一个store

store.dispatch  帮助我们派发action 这个action会传递给store

store.getState  获取到store里面所有的数据内容

store.subscribe  可以让我们订阅(监听) store的改变 只要store发生改变， 这个方法的回调函数就会执行。



#### Store

Store 就是保存数据的地方，你可以把它看成一个容器。整个应用只能有一个 Store。

Redux 提供`createStore`这个函数，用来生成 Store。

> ```javascript
> import { createStore } from 'redux';
> const store = createStore(fn);
> ```

上面代码中，`createStore`函数接受另一个函数作为参数，返回新生成的 Store 对象。



State

`Store`对象包含所有数据。如果想得到某个时点的数据，就要对 Store 生成快照。这种时点的数据集合，就叫做 State。

当前时刻的 State，可以通过`store.getState()`拿到。

> ```javascript
> import { createStore } from 'redux';
> const store = createStore(fn);
> 
> const state = store.getState();
> ```

Redux 规定， 一个 State 对应一个 View。只要 State 相同，View 就相同。你知道 State，就知道 View 是什么样，反之亦然。



#### Action

State 的变化，会导致 View 的变化。但是，用户接触不到 State，只能接触到 View。所以，State 的变化必须是 View 导致的。Action 就是 View 发出的通知，表示 State 应该要发生变化了。

Action 是一个对象。其中的`type`属性是必须的，表示 Action 的名称。其他属性可以自由设置，社区有一个[规范](https://github.com/acdlite/flux-standard-action)可以参考。

> ```javascript
> const action = {
>   type: 'ADD_TODO',
>   payload: 'Learn Redux'
> };
> ```

上面代码中，Action 的名称是`ADD_TODO`，它携带的信息是字符串`Learn Redux`。

可以这样理解，Action 描述当前发生的事情。改变 State 的唯一办法，就是使用 Action。它会运送数据到 Store。



#### Action Creator

View 要发送多少种消息，就会有多少种 Action。如果都手写，会很麻烦。可以定义一个函数来生成 Action，这个函数就叫 Action Creator。

> ```javascript
> const ADD_TODO = '添加 TODO';
> 
> function addTodo(text) {
>   return {
>     type: ADD_TODO,
>     text
>   }
> }
> 
> const action = addTodo('Learn Redux');
> ```

上面代码中，`addTodo`函数就是一个 Action Creator。



#### store.dispatch()

`store.dispatch()`是 View 发出 Action 的唯一方法。

> ```javascript
> import { createStore } from 'redux';
> const store = createStore(fn);
> 
> store.dispatch({
>   type: 'ADD_TODO',
>   payload: 'Learn Redux'
> });
> ```

上面代码中，`store.dispatch`接受一个 Action 对象作为参数，将它发送出去。

结合 Action Creator，这段代码可以改写如下。

> ```javascript
> store.dispatch(addTodo('Learn Redux'));
> ```



#### Reducer

Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。

Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。

> ```javascript
> const reducer = function (state, action) {
>   // ...
>   return new_state;
> };
> ```

Reducer 函数最重要的特征是，它是一个纯函数。也就是说，只要是同样的输入，必定得到同样的输出。

纯函数是函数式编程的概念，必须遵守以下一些约束。

> - 不得改写参数
> - 不能调用系统 I/O 的API
> - 不能调用`Date.now()`或者`Math.random()`等不纯的方法，因为每次会得到不一样的结果

由于 Reducer 是纯函数，就可以保证同样的State，必定得到同样的 View。但也正因为这一点，Reducer 函数里面不能改变 State，必须返回一个全新的对象，请参考下面的写法。

> ```javascript
> // State 是一个对象
> function reducer(state, action) {
>   return Object.assign({}, state, { thingToChange });
>   // 或者
>   return { ...state, ...newState };
> }
> 
> // State 是一个数组
> function reducer(state, action) {
>   return [...state, newItem];
> }
> ```

最好把 State 对象设成只读。你没法改变它，要得到新的 State，唯一办法就是生成一个新对象。这样的好处是，任何时候，与某个 View 对应的 State 总是一个不变的对象。



#### store.subscribe()

Store 允许使用`store.subscribe`方法设置监听函数，一旦 State 发生变化，就自动执行这个函数。

> ```javascript
> import { createStore } from 'redux';
> const store = createStore(reducer);
> 
> store.subscribe(listener);
> ```

显然，只要把 View 的更新函数（对于 React 项目，就是组件的`render`方法或`setState`方法）放入`listen`，就会实现 View 的自动渲染。



### redux工作流程

![](http://www.ruanyifeng.com/blogimg/asset/2016/bg2016091802.jpg)

首先，用户发出 Action。

> ```javascript
> store.dispatch(action);
> ```

然后，Store 自动调用 Reducer，并且传入两个参数：当前 State 和收到的 Action。 Reducer 会返回新的 State 。

> ```javascript
> let nextState = todoApp(previousState, action);
> ```

State 一旦有变化，Store 就会调用监听函数。

> ```javascript
> // 设置监听函数
> store.subscribe(listener);
> ```

`listener`可以通过`store.getState()`得到当前状态。如果使用的是 React，这时可以触发重新渲染 View。

> ```javascript
> function listerner() {
>   let newState = store.getState();
>   component.setState(newState);   
> }
> ```





## react-redux

[Redux](https://github.com/reactjs/redux) 官方提供的 React 绑定库。 具有高效且灵活的特性。

### 安装

React Redux 依赖 **React 0.14 或更新版本。**

```
npm install --save react-redux
```

```
yarn add react-redux
```

### API

#### `<Provider store>`

`<Provider store>` 使组件层级中的 `connect()` 方法都能够获得 Redux store。正常情况下，你的根组件应该嵌套在 `<Provider>` 中才能使用 `connect()` 方法。

```
//自定义App组件  Provider组件将store全部提供给被它包裹的组件。 Provider内部的组件都可以获得store里的数据。
const App = (
  <Provider store={store}>
    <TodoList/>
  </Provider>
)
```

#### connect

connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])

```
export default connect(mapStateToProps, mapDispatchToProps)(TodoList);  // connect方法与Provider做连接  获取store里的数据
```

连接 React 组件与 Redux store。

连接操作不会改变原来的组件类。
反而**返回**一个新的已与 Redux store 连接的组件类。

#### 参数

- [`mapStateToProps(state, [ownProps]): stateProps`] (*Function*): 如果定义该参数，组件将会监听 Redux store 的变化。任何时候，只要 Redux store 发生改变，`mapStateToProps` 函数就会被调用。该回调函数必须返回一个纯对象，这个对象会与组件的 props 合并。如果你省略了这个参数，你的组件将不会监听 Redux store。如果指定了该回调函数中的第二个参数 `ownProps`，则该参数的值为传递到组件的 props，而且只要组件接收到新的 props，`mapStateToProps` 也会被调用（例如，当 props 接收到来自父组件一个小小的改动，那么你所使用的 ownProps 参数，mapStateToProps 都会被重新计算）。

`mapStateToProps` 函数的第一个参数是整个 Redux store 的 state，它返回一个要作为 props 传递的对象。

```
//把store里的数据映射到组件的props里  
const mapStateToProps = (state) => {  //state参数里的数据就是store内的数据
  return {
    inputValue: state.inputValue,
    list: state.list
  }
}
```





- [`mapDispatchToProps(dispatch, [ownProps]): dispatchProps`] (*Object* or *Function*): 如果传递的是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，对象所定义的方法名将作为属性名；每个方法将返回一个新的函数，函数中`dispatch`方法会将 action creator 的返回值作为参数执行。这些属性会被合并到组件的 props 中。

如果传递的是一个函数，该函数将接收一个 `dispatch` 函数，然后由你来决定如何返回一个对象，这个对象通过 `dispatch` 函数与 action creator 以某种方式绑定在一起

```
// store.dispatch, props 把store.dispatch方法映射到props里  通过props调用dispatch里的方法改变store的值
const mapDispatchToProps = (dispatch) => {
  return {
    changeInputValue(e) {
      const action = {
        type: 'change_input_value',
        value: e.target.value
      }
      dispatch(action)
    },
  }
```



简写语法注入 `todos` 和特定的 action 创建函数(`addTodo` and `deleteTodo`)

```js
import { addTodo, deleteTodo } from './actionCreators'

function mapStateToProps(state) {
  return { todos: state.todos }
}

const mapDispatchToProps = {
  addTodo,
  deleteTodo
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoApp)
```



附上自己写的react + redux小Demo仓库：https://github.com/fuchengjx/ReduxDemo