(this.webpackJsonppart1=this.webpackJsonppart1||[]).push([[0],{42:function(t,n,e){},43:function(t,n,e){"use strict";e.r(n);var c=e(18),r=e.n(c),o=e(8),i=e(4),a=e(2),u=e(0),s=function(t){var n=t.note,e=t.toggleImportanceOf,c=n.important?"make not important":"make important";return Object(u.jsxs)("li",{children:[n.content,Object(u.jsx)("button",{onClick:e,children:c})]})},j=function(t){var n=t.message;return null===n?null:Object(u.jsx)("div",{className:"error",children:n})},f=e(3),l=e.n(f),b="/api/notes",O=function(){return l.a.get(b).then((function(t){return t.data}))},d=function(t){return l.a.post(b,t).then((function(t){return t.data}))},p=function(t,n){return l.a.put("".concat(b,"/").concat(t),n).then((function(t){return t.data}))},m=function(){return Object(u.jsxs)("div",{style:{color:"green",fontStyle:"italic",fontSize:16},children:[Object(u.jsx)("br",{}),Object(u.jsx)("em",{children:"Note app, Department of Computer Science"})]})},h=function(){var t=Object(a.useState)([]),n=Object(i.a)(t,2),e=n[0],c=n[1],r=Object(a.useState)("a new note.."),f=Object(i.a)(r,2),l=f[0],b=f[1],h=Object(a.useState)(!0),v=Object(i.a)(h,2),x=v[0],g=v[1],S=Object(a.useState)(null),k=Object(i.a)(S,2),w=k[0],y=k[1];Object(a.useEffect)((function(){O().then((function(t){c(t)}))}),[]);var C=x?e:e.filter((function(t){return!0===t.important}));return Object(u.jsxs)("div",{children:[Object(u.jsx)("h1",{children:"Notes"}),Object(u.jsx)(j,{message:w}),Object(u.jsx)("div",{children:Object(u.jsxs)("button",{onClick:function(){return g(!x)},children:["show ",x?"important":"all"]})}),Object(u.jsx)("ul",{children:C.map((function(t){return Object(u.jsx)(s,{note:t,toggleImportanceOf:function(){return function(t){var n=e.find((function(n){return n.id===t})),r=Object(o.a)(Object(o.a)({},n),{},{important:!n.important});p(t,r).then((function(n){c(e.map((function(e){return e.id!==t?e:n})))})).catch((function(r){console.error(r),y("\n        Note ".concat(n.content," was already removed from server!")),setTimeout((function(){y(null)}),5e3),c(e.filter((function(n){return n.id!==t})))}))}(t.id)}},t.id)}))}),Object(u.jsxs)("form",{onSubmit:function(t){t.preventDefault();var n={content:l,date:(new Date).toISOString(),important:Math.random()<.5};d(n).then((function(t){c(e.concat(t))})),b("")},children:[Object(u.jsx)("input",{value:l,onChange:function(t){return b(t.target.value)}}),Object(u.jsx)("input",{type:"submit",value:"Save"})]}),Object(u.jsx)(m,{})]})};e(42);r.a.render(Object(u.jsx)(h,{}),document.getElementById("root"))}},[[43,1,2]]]);
//# sourceMappingURL=main.e92a657d.chunk.js.map