import minireact from "mreact";
/** @jsx  minireact.createElement*/
const element = (
  <div>
    <h1 style="background:salmon"> hello world</h1>
    <h2 style="text-align:right">from minireact</h2>
  </div>
);
const container=document.getElementById('root')
minireact.render(element,container)
// TODO:test