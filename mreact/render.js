const isProperty = (key) => key !== "children" && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (next) => (key) => !(key in next);
// 事件监听器
const isEvent = (key) => key.startWith("on");
function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  return dom;
}
function updateDom(dom, prevProps, nextProps) {
  // remove old props
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });
  // remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => isGone(nextProps)(key) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.substring(2).toLowerCase();
      dom.removeEventListener(eventType, prevProps[name]);
    });
  // add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.substring(2).toLowerCase();
      dom.addEventListener(eventType, nextProps[name]);
    });
}
export function render(element, container) {
  // wipRoot设置为fiber的根
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  nextUnitOfWork = wipRoot;
}
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}
function commitDeletion(fiber,domParent){
  if(fiber.dom){
    domParent.removeChild(fiber.dom)
  }else{
    commitDeletion(fiber.child,domParent)
  }
}
function commitWork(fiber) {
  if (!fiber) return;
 let  domParentFiber = fiber.parent;
 while(!domParent.dom){
  domParentFiber=domParentFiber.parent
 }
 const domParent=domParentFiber.dom
  if ((fiber.effectTag = "PLACEMENT" && fiber.dom != null)) {
    domParent.appendchild(fiber.dom);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber,domParent)
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
// 孩子>兄弟>叔叔，到达根节点意味着完成所有渲染工作
let wipRoot = null,
  nextUnitOfWork = null,
  currentRoot = null,
  deletions = [];
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}
// react使用的是scheduler包
requestIdleCallback(workLoop);
function performUnitOfWork(fiber) {
  //  add dom node
  const isFunctionComponent=fiber.type instanceof Function
  if(isFunctionComponent){
    updateFunctionComponent(fiber)
  }else{
    updateHostComponent(fiber)
  }
  // return the unit of work
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
function updateFunctionComponent(fiber){
  const children=[fiber.type(fiber.props)]
  reconcileChildren(fiber,children)
}
function updateHostComponent(fiber){
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  const elements = fiber.props.children;
  // create new fiber
  reconcileChildren(fiber, elements);
}
function reconcileChildren(wipFiber, elements) {
  let index = 0,
    prevSibling = null;
  let oldFiber = wipFiber.alternate?.child;
  while (index < elements.length || oldFiber) {
    const element = elements[index];
    let newFiber = null;
    const sameType = oldFiber && element && oldFiber.type === element.type;
    if (sameType) {
      // update the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        parent: wipFiber,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }
    if (element && !sameType) {
      // add this node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }
    if (oldFiber && !sameType) {
      // delete the oldFiber's node
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
      index++;
    }
  }
}
