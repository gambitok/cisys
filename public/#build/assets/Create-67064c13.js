import{u as c,j as l,a as r,H as m,L as u,__tla as d}from"./app-916a4f72.js";import{A as _,__tla as f}from"./Authenticated-e9163b2f.js";import h from"./Form-761b5775.js";import"./setPrototypeOf-51e8cf87.js";import"./transition-cd097f7e.js";import"./InputError-ff429324.js";import"./TextInput-8e4ec303.js";import"./react-select.esm-64f92a33.js";import"./hoist-non-react-statics.cjs-585a791f.js";let e,y=Promise.all([(()=>{try{return d}catch{}})(),(()=>{try{return f}catch{}})()]).then(async()=>{e=function(t){const{data:a,setData:o,errors:s,post:n}=c({product_id:"",usertype_id:"",name:"",qty:"",price:"",coupon_code:""});function p(i){i.preventDefault(),n(route("plans.store"))}return l(_,{props:t,auth:t.auth,errors:t.errors,header:"Create plan",children:[r(m,{title:"Create plan"}),r("div",{className:"flex items-center justify-between mb-6 formbackbutton",children:r(u,{className:"px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none",href:route("plans.index"),children:"Back"})}),r("form",{name:"createForm",onSubmit:p,children:r(h,{data:a,errors:s,setData:o,types:t.types,products:t.products})})]})}});export{y as __tla,e as default};
