export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      //   react不会包装原始值或在没有children时创建空数组。
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

// const element = minireact.createElement(
//   "div",
//   { id: "foo" },
//   minireact.createElement("a", null, "bar"),
//   minireact.createElement("b")
// );
// /** @jsx minireact.createElement */
// const element=(
//     <div id='foo'>
//         <a>bar</a>
//         <b />
//     </div>
// )