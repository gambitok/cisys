import{u as m,j as u,a as t,H as c,L as d,__tla as p}from"./app-916a4f72.js";import{A as f,__tla as h}from"./Authenticated-e9163b2f.js";import _ from"./Form-909a9f8b.js";import"./setPrototypeOf-51e8cf87.js";import"./transition-cd097f7e.js";import"./InputError-ff429324.js";import"./TextInput-8e4ec303.js";let e,b=Promise.all([(()=>{try{return p}catch{}})(),(()=>{try{return h}catch{}})()]).then(async()=>{e=function(r){const{data:a,setData:o,errors:s,put:n}=m({name:r.role.name||"",permissions:r.defaultselectarray||[]});function i(l){l.preventDefault(),n(route("roles.update",r.role.id))}return u(f,{props:r,auth:r.auth,errors:r.errors,header:"Edit Role",children:[t(c,{title:"Edit Role"}),t("div",{className:"flex items-center justify-between mb-6 formbackbutton",children:t(d,{className:"px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none",href:route("roles.index"),children:"Back"})}),t("form",{name:"createForm",onSubmit:i,children:t(_,{data:a,errors:s,setData:o,permissions:r.permissions,rolemanage:r.rolemanage})})]})}});export{b as __tla,e as default};
