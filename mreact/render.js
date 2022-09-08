export function render(element, container) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode('')
      : document.createElement(element.type);
const isProperty=key=>key!=='children'
Object.keys(element.props).filter(isProperty).forEach(name=>{
    dom[name]=element.props[name]
})
  container.appendChild(dom);
  element.props.children.forEach((child) => {
    render(child, dom);
  });
}
let nextUnitOfWork=null
function workLoop(deadline){
  let shouldYield=false
  while (nextUnitOfWork&&!shouldYield){
    nextUnitOfWork=performUnitOfWork(nextUnitOfWork)
    shouldYield=deadline.timeRemaining()<1
  }
  requestIdleCallback(workLoop)
}
// react使用的是scheduler包
requestIdleCallback(workLoop)
function performUnitOfWork(nextUnitOfWork){

}