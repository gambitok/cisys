import{u as x,r as m,j as t,a as e,H as b,L as w}from"./app-916a4f72.js";import{G as y,B as C}from"./Guest-59135ada.js";import{C as v}from"./Checkbox-c4dfde53.js";import{V as N,I as c}from"./ValidationErrors-5d23f945.js";import{L as i}from"./Label-d4a58f4c.js";import{R as k,c as L}from"./config-09106287.js";import"./hoist-non-react-statics.cjs-585a791f.js";function A(s){const{data:r,setData:n,post:u,processing:d,errors:g,reset:h}=x({email:"",password:"",remember:"","g-recaptcha-response":""});m.useEffect(()=>()=>{h("password")},[]);const o=a=>{n(a.target.name,a.target.type==="checkbox"?a.target.checked:a.target.value)},l=m.useRef(null),p=a=>{l.current.reset(),a.preventDefault(),u(route("login"))},f=a=>{n({...r,"g-recaptcha-response":a})};return t(y,{siteLogo:s.general_settings.logo,children:[e(b,{title:"Log in"}),s.status&&e("div",{className:"mb-4 font-medium text-sm text-green-600",children:s.status}),e(N,{errors:g}),t("form",{onSubmit:p,children:[t("div",{children:[e(i,{forInput:"email",value:"Email"}),e(c,{type:"text",name:"email",value:r.email,className:"mt-1 block w-full",autoComplete:"username",isFocused:!0,handleChange:o})]}),t("div",{className:"mt-4",children:[e(i,{forInput:"password",value:"Password"}),e(c,{type:"password",name:"password",value:r.password,className:"mt-1 block w-full",autoComplete:"current-password",handleChange:o})]}),e("div",{className:"block mt-4",children:t("label",{className:"flex items-center",children:[e(v,{name:"remember",value:r.remember,handleChange:o}),e("span",{className:"ml-2 text-sm text-gray-600",children:"Remember me"})]})}),e(k,{sitekey:L.RECAPTCHA_SITEKEY,ref:l,onChange:f}),e("a",{href:route("authlogin"),className:"underline text-sm text-gray-600 hover:text-gray-900",children:e("img",{src:"/social-login-google.png",style:{width:"50%",margin:"30px auto"}})}),t("div",{className:"flex items-center justify-end mt-4",children:[s.canResetPassword&&e(w,{href:route("password.request"),className:"underline text-sm text-gray-600 hover:text-gray-900",children:"Forgot your password?"}),e(C,{className:"ml-4",processing:d,children:"Log in"})]})]})]})}export{A as default};
