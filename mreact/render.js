function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);
  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });
  return dom;
}
export function render(element, container) {
  // nextUnitOfWork设置为fiber的根
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}
// 孩子>兄弟>叔叔，到达根节点意味着完成所有渲染工作
let nextUnitOfWork = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}
// react使用的是scheduler包
requestIdleCallback(workLoop);
function performUnitOfWork(fiber) {
  //  add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }
  // create new fiber
  const elements = fiber.props.children;
  let index = 0,
    prevSibling = null;
  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };
    if(index===0){
      fiber.child=newFiber
    }else{
      prevSibling.sibling=newFiber
      index++
    }
    if(fiber.child){
      return fiber.child
    }
    let nextFiber=fiber
    while(nextFiber){
      if(nextFiber.sibling){
        return nextFiber.sibling
      }
      nextFiber=nextFiber.parent
    }
  }
  // return the unit of work
}
