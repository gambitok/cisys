import{u as i,j as d,a as r,H as l,L as c,__tla as p}from"./app-916a4f72.js";import{A as _,__tla as f}from"./Authenticated-e9163b2f.js";import b from"./Form-cb18f0cd.js";import"./setPrototypeOf-51e8cf87.js";import"./transition-cd097f7e.js";import"./InputError-ff429324.js";import"./TextInput-8e4ec303.js";import"./react-select.esm-64f92a33.js";import"./hoist-non-react-statics.cjs-585a791f.js";let e,h=Promise.all([(()=>{try{return p}catch{}})(),(()=>{try{return f}catch{}})()]).then(async()=>{e=function(t){const{data:a,setData:o,errors:u,put:n}=i({route_id:t.submenu.route_id||"",name:t.submenu.name||"",sort:t.submenu.sort||"",parent_id:t.parent_id});function s(m){m.preventDefault(),n(route("submenu.update",t.submenu.id))}return d(_,{props:t,auth:t.auth,errors:t.errors,header:"Edit menu",children:[r(l,{title:"Edit menu"}),r("div",{className:"flex items-center justify-between mb-6 formbackbutton",children:r(c,{className:"px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none",href:route("menus.index"),children:"Back"})}),r("form",{name:"createForm",onSubmit:s,children:r(b,{data:a,errors:u,setData:o,routes:t.routes})})]})}});export{h as __tla,e as default};
