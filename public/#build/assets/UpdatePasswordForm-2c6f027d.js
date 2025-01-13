import{l as q,t as Q,B as X,r as h,h as Y,j as F,a as v}from"./app-916a4f72.js";import{I as _,a as D}from"./InputError-ff429324.js";import{P as Z}from"./PrimaryButton-36d7840b.js";import{T as $}from"./TextInput-8e4ec303.js";import{t as ee}from"./transition-cd097f7e.js";function te(e,t){let r;return function(...o){clearTimeout(r),r=setTimeout(()=>e.apply(this,o),t)}}function I(e,t){return document.dispatchEvent(new CustomEvent(`inertia:${e}`,t))}var re=e=>I("before",{cancelable:!0,detail:{visit:e}}),se=e=>I("error",{detail:{errors:e}}),oe=e=>I("exception",{cancelable:!0,detail:{exception:e}}),H=e=>I("finish",{detail:{visit:e}}),ne=e=>I("invalid",{cancelable:!0,detail:{response:e}}),B=e=>I("navigate",{detail:{page:e}}),ie=e=>I("progress",{detail:{progress:e}}),ae=e=>I("start",{detail:{visit:e}}),le=e=>I("success",{detail:{page:e}});function W(e){return e instanceof File||e instanceof Blob||e instanceof FileList&&e.length>0||e instanceof FormData&&Array.from(e.values()).some(t=>W(t))||typeof e=="object"&&e!==null&&Object.values(e).some(t=>W(t))}function J(e,t=new FormData,r=null){e=e||{};for(let o in e)Object.prototype.hasOwnProperty.call(e,o)&&z(t,K(r,o),e[o]);return t}function K(e,t){return e?e+"["+t+"]":t}function z(e,t,r){if(Array.isArray(r))return Array.from(r.keys()).forEach(o=>z(e,K(t,o.toString()),r[o]));if(r instanceof Date)return e.append(t,r.toISOString());if(r instanceof File)return e.append(t,r,r.name);if(r instanceof Blob)return e.append(t,r);if(typeof r=="boolean")return e.append(t,r?"1":"0");if(typeof r=="string")return e.append(t,r);if(typeof r=="number")return e.append(t,`${r}`);if(r==null)return e.append(t,"");J(r,e,t)}var ce={modal:null,listener:null,show(e){typeof e=="object"&&(e=`All Inertia requests must receive a valid Inertia response, however a plain JSON response was received.<hr>${JSON.stringify(e)}`);let t=document.createElement("html");t.innerHTML=e,t.querySelectorAll("a").forEach(o=>o.setAttribute("target","_top")),this.modal=document.createElement("div"),this.modal.style.position="fixed",this.modal.style.width="100vw",this.modal.style.height="100vh",this.modal.style.padding="50px",this.modal.style.boxSizing="border-box",this.modal.style.backgroundColor="rgba(0, 0, 0, .6)",this.modal.style.zIndex=2e5,this.modal.addEventListener("click",()=>this.hide());let r=document.createElement("iframe");if(r.style.backgroundColor="white",r.style.borderRadius="5px",r.style.width="100%",r.style.height="100%",this.modal.appendChild(r),document.body.prepend(this.modal),document.body.style.overflow="hidden",!r.contentWindow)throw new Error("iframe not yet ready.");r.contentWindow.document.open(),r.contentWindow.document.write(t.outerHTML),r.contentWindow.document.close(),this.listener=this.hideOnEscape.bind(this),document.addEventListener("keydown",this.listener)},hide(){this.modal.outerHTML="",this.modal=null,document.body.style.overflow="visible",document.removeEventListener("keydown",this.listener)},hideOnEscape(e){e.keyCode===27&&this.hide()}};function N(e){return new URL(e.toString(),window.location.toString())}function G(e,t,r,o="brackets"){let n=/^https?:\/\//.test(t.toString()),u=n||t.toString().startsWith("/"),g=!u&&!t.toString().startsWith("#")&&!t.toString().startsWith("?"),w=t.toString().includes("?")||e==="get"&&Object.keys(r).length,d=t.toString().includes("#"),p=new URL(t.toString(),"http://localhost");return e==="get"&&Object.keys(r).length&&(p.search=q.stringify(Q(q.parse(p.search,{ignoreQueryPrefix:!0}),r),{encodeValuesOnly:!0,arrayFormat:o}),r={}),[[n?`${p.protocol}//${p.host}`:"",u?p.pathname:"",g?p.pathname.substring(1):"",w?p.search:"",d?p.hash:""].join(""),r]}function j(e){return e=new URL(e.href),e.hash="",e}var M=typeof window>"u",de=class{constructor(){this.visitId=null}init({initialPage:e,resolveComponent:t,swapComponent:r}){this.page=e,this.resolveComponent=t,this.swapComponent=r,this.setNavigationType(),this.clearRememberedStateOnReload(),this.isBackForwardVisit()?this.handleBackForwardVisit(this.page):this.isLocationVisit()?this.handleLocationVisit(this.page):this.handleInitialPageVisit(this.page),this.setupEventListeners()}setNavigationType(){this.navigationType=window.performance&&window.performance.getEntriesByType("navigation").length>0?window.performance.getEntriesByType("navigation")[0].type:"navigate"}clearRememberedStateOnReload(){this.navigationType==="reload"&&window.history.state?.rememberedState&&delete window.history.state.rememberedState}handleInitialPageVisit(e){this.page.url+=window.location.hash,this.setPage(e,{preserveState:!0}).then(()=>B(e))}setupEventListeners(){window.addEventListener("popstate",this.handlePopstateEvent.bind(this)),document.addEventListener("scroll",te(this.handleScrollEvent.bind(this),100),!0)}scrollRegions(){return document.querySelectorAll("[scroll-region]")}handleScrollEvent(e){typeof e.target.hasAttribute=="function"&&e.target.hasAttribute("scroll-region")&&this.saveScrollPositions()}saveScrollPositions(){this.replaceState({...this.page,scrollRegions:Array.from(this.scrollRegions()).map(e=>({top:e.scrollTop,left:e.scrollLeft}))})}resetScrollPositions(){window.scrollTo(0,0),this.scrollRegions().forEach(e=>{typeof e.scrollTo=="function"?e.scrollTo(0,0):(e.scrollTop=0,e.scrollLeft=0)}),this.saveScrollPositions(),window.location.hash&&setTimeout(()=>document.getElementById(window.location.hash.slice(1))?.scrollIntoView())}restoreScrollPositions(){this.page.scrollRegions&&this.scrollRegions().forEach((e,t)=>{let r=this.page.scrollRegions[t];if(r)typeof e.scrollTo=="function"?e.scrollTo(r.left,r.top):(e.scrollTop=r.top,e.scrollLeft=r.left);else return})}isBackForwardVisit(){return window.history.state&&this.navigationType==="back_forward"}handleBackForwardVisit(e){window.history.state.version=e.version,this.setPage(window.history.state,{preserveScroll:!0,preserveState:!0}).then(()=>{this.restoreScrollPositions(),B(e)})}locationVisit(e,t){try{let r={preserveScroll:t};window.sessionStorage.setItem("inertiaLocationVisit",JSON.stringify(r)),window.location.href=e.href,j(window.location).href===j(e).href&&window.location.reload()}catch{return!1}}isLocationVisit(){try{return window.sessionStorage.getItem("inertiaLocationVisit")!==null}catch{return!1}}handleLocationVisit(e){let t=JSON.parse(window.sessionStorage.getItem("inertiaLocationVisit")||"");window.sessionStorage.removeItem("inertiaLocationVisit"),e.url+=window.location.hash,e.rememberedState=window.history.state?.rememberedState??{},e.scrollRegions=window.history.state?.scrollRegions??[],this.setPage(e,{preserveScroll:t.preserveScroll,preserveState:!0}).then(()=>{t.preserveScroll&&this.restoreScrollPositions(),B(e)})}isLocationVisitResponse(e){return!!(e&&e.status===409&&e.headers["x-inertia-location"])}isInertiaResponse(e){return!!e?.headers["x-inertia"]}createVisitId(){return this.visitId={},this.visitId}cancelVisit(e,{cancelled:t=!1,interrupted:r=!1}){e&&!e.completed&&!e.cancelled&&!e.interrupted&&(e.cancelToken.abort(),e.onCancel(),e.completed=!1,e.cancelled=t,e.interrupted=r,H(e),e.onFinish(e))}finishVisit(e){!e.cancelled&&!e.interrupted&&(e.completed=!0,e.cancelled=!1,e.interrupted=!1,H(e),e.onFinish(e))}resolvePreserveOption(e,t){return typeof e=="function"?e(t):e==="errors"?Object.keys(t.props.errors||{}).length>0:e}cancel(){this.activeVisit&&this.cancelVisit(this.activeVisit,{cancelled:!0})}visit(e,{method:t="get",data:r={},replace:o=!1,preserveScroll:n=!1,preserveState:u=!1,only:g=[],headers:w={},errorBag:d="",forceFormData:p=!1,onCancelToken:L=()=>{},onBefore:m=()=>{},onStart:b=()=>{},onProgress:P=()=>{},onFinish:O=()=>{},onCancel:C=()=>{},onSuccess:R=()=>{},onError:S=()=>{},queryStringArrayFormat:V="brackets"}={}){let y=typeof e=="string"?N(e):e;if((W(r)||p)&&!(r instanceof FormData)&&(r=J(r)),!(r instanceof FormData)){let[i,l]=G(t,y,r,V);y=N(i),r=l}let E={url:y,method:t,data:r,replace:o,preserveScroll:n,preserveState:u,only:g,headers:w,errorBag:d,forceFormData:p,queryStringArrayFormat:V,cancelled:!1,completed:!1,interrupted:!1};if(m(E)===!1||!re(E))return;this.activeVisit&&this.cancelVisit(this.activeVisit,{interrupted:!0}),this.saveScrollPositions();let T=this.createVisitId();this.activeVisit={...E,onCancelToken:L,onBefore:m,onStart:b,onProgress:P,onFinish:O,onCancel:C,onSuccess:R,onError:S,queryStringArrayFormat:V,cancelToken:new AbortController},L({cancel:()=>{this.activeVisit&&this.cancelVisit(this.activeVisit,{cancelled:!0})}}),ae(E),b(E),X({method:t,url:j(y).href,data:t==="get"?{}:r,params:t==="get"?r:{},signal:this.activeVisit.cancelToken.signal,headers:{...w,Accept:"text/html, application/xhtml+xml","X-Requested-With":"XMLHttpRequest","X-Inertia":!0,...g.length?{"X-Inertia-Partial-Component":this.page.component,"X-Inertia-Partial-Data":g.join(",")}:{},...d&&d.length?{"X-Inertia-Error-Bag":d}:{},...this.page.version?{"X-Inertia-Version":this.page.version}:{}},onUploadProgress:i=>{r instanceof FormData&&(i.percentage=i.progress?Math.round(i.progress*100):0,ie(i),P(i))}}).then(i=>{if(!this.isInertiaResponse(i))return Promise.reject({response:i});let l=i.data;g.length&&l.component===this.page.component&&(l.props={...this.page.props,...l.props}),n=this.resolvePreserveOption(n,l),u=this.resolvePreserveOption(u,l),u&&window.history.state?.rememberedState&&l.component===this.page.component&&(l.rememberedState=window.history.state.rememberedState);let s=y,a=N(l.url);return s.hash&&!a.hash&&j(s).href===a.href&&(a.hash=s.hash,l.url=a.href),this.setPage(l,{visitId:T,replace:o,preserveScroll:n,preserveState:u})}).then(()=>{let i=this.page.props.errors||{};if(Object.keys(i).length>0){let l=d?i[d]?i[d]:{}:i;return se(l),S(l)}return le(this.page),R(this.page)}).catch(i=>{if(this.isInertiaResponse(i.response))return this.setPage(i.response.data,{visitId:T});if(this.isLocationVisitResponse(i.response)){let l=N(i.response.headers["x-inertia-location"]),s=y;s.hash&&!l.hash&&j(s).href===l.href&&(l.hash=s.hash),this.locationVisit(l,n===!0)}else if(i.response)ne(i.response)&&ce.show(i.response.data);else return Promise.reject(i)}).then(()=>{this.activeVisit&&this.finishVisit(this.activeVisit)}).catch(i=>{if(!X.isCancel(i)){let l=oe(i);if(this.activeVisit&&this.finishVisit(this.activeVisit),l)return Promise.reject(i)}})}setPage(e,{visitId:t=this.createVisitId(),replace:r=!1,preserveScroll:o=!1,preserveState:n=!1}={}){return Promise.resolve(this.resolveComponent(e.component)).then(u=>{t===this.visitId&&(e.scrollRegions=e.scrollRegions||[],e.rememberedState=e.rememberedState||{},r=r||N(e.url).href===window.location.href,r?this.replaceState(e):this.pushState(e),this.swapComponent({component:u,page:e,preserveState:n}).then(()=>{o||this.resetScrollPositions(),r||B(e)}))})}pushState(e){this.page=e,window.history.pushState(e,"",e.url)}replaceState(e){this.page=e,window.history.replaceState(e,"",e.url)}handlePopstateEvent(e){if(e.state!==null){let t=e.state,r=this.createVisitId();Promise.resolve(this.resolveComponent(t.component)).then(o=>{r===this.visitId&&(this.page=t,this.swapComponent({component:o,page:t,preserveState:!1}).then(()=>{this.restoreScrollPositions(),B(t)}))})}else{let t=N(this.page.url);t.hash=window.location.hash,this.replaceState({...this.page,url:t.href}),this.resetScrollPositions()}}get(e,t={},r={}){return this.visit(e,{...r,method:"get",data:t})}reload(e={}){return this.visit(window.location.href,{...e,preserveScroll:!0,preserveState:!0})}replace(e,t={}){return console.warn(`Inertia.replace() has been deprecated and will be removed in a future release. Please use Inertia.${t.method??"get"}() instead.`),this.visit(e,{preserveState:!0,...t,replace:!0})}post(e,t={},r={}){return this.visit(e,{preserveState:!0,...r,method:"post",data:t})}put(e,t={},r={}){return this.visit(e,{preserveState:!0,...r,method:"put",data:t})}patch(e,t={},r={}){return this.visit(e,{preserveState:!0,...r,method:"patch",data:t})}delete(e,t={}){return this.visit(e,{preserveState:!0,...t,method:"delete"})}remember(e,t="default"){M||this.replaceState({...this.page,rememberedState:{...this.page?.rememberedState,[t]:e}})}restore(e="default"){if(!M)return window.history.state?.rememberedState?.[e]}on(e,t){let r=o=>{let n=t(o);o.cancelable&&!o.defaultPrevented&&n===!1&&o.preventDefault()};return document.addEventListener(`inertia:${e}`,r),()=>document.removeEventListener(`inertia:${e}`,r)}};function he(e){let t=e.currentTarget.tagName.toLowerCase()==="a";return!(e.target&&(e?.target).isContentEditable||e.defaultPrevented||t&&e.which>1||t&&e.altKey||t&&e.ctrlKey||t&&e.metaKey||t&&e.shiftKey)}var A=new de,pe=h.createContext(void 0);pe.displayName="InertiaHeadContext";var ue=h.createContext(void 0);ue.displayName="InertiaPageContext";var k=()=>{},me=h.forwardRef(({children:e,as:t="a",data:r={},href:o,method:n="get",preserveScroll:u=!1,preserveState:g=null,replace:w=!1,only:d=[],headers:p={},queryStringArrayFormat:L="brackets",onClick:m=k,onCancelToken:b=k,onBefore:P=k,onStart:O=k,onProgress:C=k,onFinish:R=k,onCancel:S=k,onSuccess:V=k,onError:y=k,...E},T)=>{let i=h.useCallback(a=>{m(a),he(a)&&(a.preventDefault(),A.visit(o,{data:r,method:n,preserveScroll:u,preserveState:g??n!=="get",replace:w,only:d,headers:p,onCancelToken:b,onBefore:P,onStart:O,onProgress:C,onFinish:R,onCancel:S,onSuccess:V,onError:y}))},[r,o,n,u,g,w,d,p,m,b,P,O,C,R,S,V,y]);t=t.toLowerCase(),n=n.toLowerCase();let[l,s]=G(n,o||"",r,L);return o=l,r=s,t==="a"&&n!=="get"&&console.warn(`Creating POST/PUT/PATCH/DELETE <a> links is discouraged as it causes "Open Link in New Tab/Window" accessibility issues.

Please specify a more appropriate element using the "as" attribute. For example:

<Link href="${o}" method="${n}" as="button">...</Link>`),h.createElement(t,{...E,...t==="a"?{href:o}:{},ref:T,onClick:i},e)});me.displayName="InertiaLink";function U(e,t){let[r,o]=h.useState(()=>{let n=A.restore(t);return n!==void 0?n:e});return h.useEffect(()=>{A.remember(r,t)},[r,t]),[r,o]}function fe(e,t){let r=h.useRef(null),o=typeof e=="string"?e:null,[n,u]=h.useState((typeof e=="string"?t:e)||{}),g=h.useRef(null),w=h.useRef(null),[d,p]=o?U(n,`${o}:data`):h.useState(n),[L,m]=o?U({},`${o}:errors`):h.useState({}),[b,P]=h.useState(!1),[O,C]=h.useState(!1),[R,S]=h.useState(null),[V,y]=h.useState(!1),[E,T]=h.useState(!1),i=s=>s;h.useEffect(()=>(r.current=!0,()=>{r.current=!1}),[]);let l=h.useCallback((s,a,c={})=>{let x={...c,onCancelToken:f=>{if(g.current=f,c.onCancelToken)return c.onCancelToken(f)},onBefore:f=>{if(y(!1),T(!1),clearTimeout(w.current),c.onBefore)return c.onBefore(f)},onStart:f=>{if(C(!0),c.onStart)return c.onStart(f)},onProgress:f=>{if(S(f),c.onProgress)return c.onProgress(f)},onSuccess:f=>{if(r.current&&(C(!1),S(null),m({}),P(!1),y(!0),T(!0),w.current=setTimeout(()=>{r.current&&T(!1)},2e3)),c.onSuccess)return c.onSuccess(f)},onError:f=>{if(r.current&&(C(!1),S(null),m(f),P(!0)),c.onError)return c.onError(f)},onCancel:()=>{if(r.current&&(C(!1),S(null)),c.onCancel)return c.onCancel()},onFinish:()=>{if(r.current&&(C(!1),S(null)),g.current=null,c.onFinish)return c.onFinish()}};s==="delete"?A.delete(a,{...x,data:i(d)}):A[s](a,i(d),x)},[d,m]);return{data:d,setData(s,a){p(typeof s=="string"?{...d,[s]:a}:typeof s=="function"?c=>s(c):s)},isDirty:!Y(d,n),errors:L,hasErrors:b,processing:O,progress:R,wasSuccessful:V,recentlySuccessful:E,transform(s){i=s},setDefaults(s,a){u(typeof s>"u"?()=>d:c=>({...c,...typeof s=="string"?{[s]:a}:s}))},reset(...s){s.length===0?p(n):p(Object.keys(n).filter(a=>s.includes(a)).reduce((a,c)=>(a[c]=n[c],a),{...d}))},setError(s,a){m(c=>{let x={...c,...typeof s=="string"?{[s]:a}:s};return P(Object.keys(x).length>0),x})},clearErrors(...s){m(a=>{let c=Object.keys(a).reduce((x,f)=>({...x,...s.length>0&&!s.includes(f)?{[f]:a[f]}:{}}),{});return P(Object.keys(c).length>0),c})},submit:l,get(s,a){l("get",s,a)},post(s,a){l("post",s,a)},put(s,a){l("put",s,a)},patch(s,a){l("patch",s,a)},delete(s,a){l("delete",s,a)},cancel(){g.current&&g.current.cancel()}}}function be({className:e=""}){const t=h.useRef(),r=h.useRef(),{data:o,setData:n,errors:u,put:g,reset:w,processing:d,recentlySuccessful:p}=fe({current_password:"",password:"",password_confirmation:""});return F("section",{className:e,children:[F("header",{children:[v("h2",{className:"text-lg font-medium text-gray-900",children:"Update Password"}),v("p",{className:"mt-1 text-sm text-gray-600",children:"Ensure your account is using a long, random password to stay secure."})]}),F("form",{onSubmit:m=>{m.preventDefault(),g(route("password.update"),{preserveScroll:!0,onSuccess:()=>w(),onError:b=>{b.password&&(w("password","password_confirmation"),t.current.focus()),b.current_password&&(w("current_password"),r.current.focus())}})},className:"mt-6 space-y-6",children:[F("div",{children:[v(_,{htmlFor:"current_password",value:"Current Password"}),v($,{id:"current_password",ref:r,value:o.current_password,onChange:m=>n("current_password",m.target.value),type:"password",className:"mt-1 block w-full",autoComplete:"current-password"}),v(D,{message:u.current_password,className:"mt-2"})]}),F("div",{children:[v(_,{htmlFor:"password",value:"New Password"}),v($,{id:"password",ref:t,value:o.password,onChange:m=>n("password",m.target.value),type:"password",className:"mt-1 block w-full",autoComplete:"new-password"}),v(D,{message:u.password,className:"mt-2"})]}),F("div",{children:[v(_,{htmlFor:"password_confirmation",value:"Confirm Password"}),v($,{id:"password_confirmation",value:o.password_confirmation,onChange:m=>n("password_confirmation",m.target.value),type:"password",className:"mt-1 block w-full",autoComplete:"new-password"}),v(D,{message:u.password_confirmation,className:"mt-2"})]}),F("div",{className:"flex items-center gap-4",children:[v(Z,{disabled:d,children:"Save"}),v(ee,{show:p,enter:"transition ease-in-out",enterFrom:"opacity-0",leave:"transition ease-in-out",leaveTo:"opacity-0",children:v("p",{className:"text-sm text-gray-600",children:"Saved."})})]})]})]})}export{be as default};
