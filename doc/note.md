并发：递归添加节点可能阻塞主线程太久，所以把工作分解为小的工作单元。完成每个单元之后，如果有高优先级的任务会让浏览器中断渲染；

渲染和提交：浏览器可能在渲染完整个树之前中断渲染，所以跟踪fiber树的根，完成所有工作后，将整个fiber树提交给dom。

函数组件的fiber没有DOM节点，并且children来自运行函数而不是直接从props中获取.

`/** @jsx  minireact.createElement*/`的作用：
[@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)