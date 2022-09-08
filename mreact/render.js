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
  // wipRoot设置为fiber的根
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };
  nextUnitOfWork=wipRoot
}
function commitRoot(){
  commitWork(wipRoot.child)
  wipRoot=null
}
function commitWork(fiber){
  if(!fiber) return
  const domParent=fiber.parent.dom
  domParent.appendchild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
// 孩子>兄弟>叔叔，到达根节点意味着完成所有渲染工作
let wipRoot = null,nextUnitOfWork=null;
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if(!nextUnitOfWork&&wipRoot){
    commitRoot()
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
   // return the unit of work
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
}
