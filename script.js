// AURELLE SETUP: replace these with your own contact details before launch.
const WHATSAPP_NUMBER = ""; // Egypt format, digits only, e.g. 2010XXXXXXXX
const CONTACT_EMAIL = "";   // Your customer support email

const products = [
 {id:1,name:"Golden Hour Hoops",category:"Jewelry",price:650,tag:"BESTSELLER",art:"gold",symbol:"◉",kind:""},
 {id:2,name:"Everyday Pearl Necklace",category:"Jewelry",price:890,tag:"",art:"blush",symbol:"◌",kind:"pearl"},
 {id:3,name:"The Mini Shoulder Bag",category:"Accessories",price:1250,tag:"NEW ARRIVAL",art:"sage",symbol:"▱",kind:"bag"},
 {id:4,name:"Dainty Stacking Ring",category:"Jewelry",price:480,tag:"",art:"gold",symbol:"○",kind:"ring"},
 {id:5,name:"Silky Printed Scarf",category:"Accessories",price:720,tag:"",art:"blush",symbol:"〰",kind:"scarf"},
 {id:6,name:"Pearl Drop Earrings",category:"Jewelry",price:560,tag:"GIFT PICK",art:"stone",symbol:"❍",kind:"pearl"},
 {id:7,name:"The Little Gift Set",category:"Gifts",price:1100,tag:"READY TO GIFT",art:"sage",symbol:"✧",kind:""},
 {id:8,name:"Classic Charm Bracelet",category:"Jewelry",price:780,tag:"",art:"gold",symbol:"∞",kind:""}
];
let cart = [], filter = "All";
const money = n => new Intl.NumberFormat("en-EG",{style:"currency",currency:"EGP",maximumFractionDigits:0}).format(n);
function renderProducts(){
 const el=document.getElementById("products");
 const list=products.filter(p=>filter==="All"||p.category===filter);
 el.innerHTML=list.map(p=>`<article class="product-card"><div class="product-art ${p.art}">${p.tag?`<span class="tag">${p.tag}</span>`:""}<span class="symbol ${p.kind}" aria-hidden="true">${p.symbol}</span><button class="add-btn" data-add="${p.id}">ADD TO BAG +</button></div><div class="product-info"><h3>${p.name}</h3><div class="product-meta"><strong>${money(p.price)}</strong><small>${p.category}</small></div></div></article>`).join("");
 el.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>add(Number(b.dataset.add))));
}
function add(id){let item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});renderBag();toast("Added to your bag ✦")}
function renderBag(){
 const count=cart.reduce((s,x)=>s+x.qty,0);document.getElementById("bag-count").textContent=count;document.getElementById("bag-count-title").textContent=`(${count})`;
 document.getElementById("subtotal").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
 const el=document.getElementById("bag-items");if(!cart.length){el.innerHTML='<p class="empty">Your bag is waiting for something lovely.</p>';return}
 el.innerHTML=cart.map(x=>{let p=products.find(q=>q.id===x.id);return `<div class="bag-row"><div class="bag-thumb">${p.symbol}</div><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="qty"><button data-qty="${p.id}" data-d="-1" aria-label="Decrease quantity">−</button><span>${x.qty}</span><button data-qty="${p.id}" data-d="1" aria-label="Increase quantity">+</button></div></div><button class="remove" data-remove="${p.id}">REMOVE</button></div>`}).join("");
 el.querySelectorAll("[data-qty]").forEach(b=>b.addEventListener("click",()=>{let x=cart.find(i=>i.id===+b.dataset.qty);x.qty+=+b.dataset.d;if(x.qty<1)cart=cart.filter(i=>i.id!==x.id);renderBag()}));
 el.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>{cart=cart.filter(x=>x.id!==+b.dataset.remove);renderBag()}));
}
function showBag(){document.getElementById("bag-overlay").hidden=false;document.body.style.overflow="hidden"}
function hideBag(){document.getElementById("bag-overlay").hidden=true;document.body.style.overflow=""}
let toastTimer;function toast(s){let el=document.getElementById("toast");el.textContent=s;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2100)}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts()}));
document.getElementById("open-bag").addEventListener("click",showBag);document.getElementById("close-bag").addEventListener("click",hideBag);document.getElementById("close-backdrop").addEventListener("click",hideBag);
function setContactLinks(){
 const wa=document.getElementById("whatsapp-link"),mail=document.getElementById("email-link");
 if(WHATSAPP_NUMBER) wa.href=`https://wa.me/${WHATSAPP_NUMBER}`;
 else wa.addEventListener("click",e=>{e.preventDefault();toast("Add your WhatsApp number in script.js first.")});
 if(CONTACT_EMAIL && !CONTACT_EMAIL.includes(".example")) mail.href=`mailto:${CONTACT_EMAIL}`;
 else mail.addEventListener("click",e=>{e.preventDefault();toast("Add your customer email in script.js first.")});
}
document.getElementById("checkout").addEventListener("click",()=>{
 if(!cart.length){toast("Your bag is empty.");return}
 if(!WHATSAPP_NUMBER){toast("Add your WhatsApp number in script.js first.");return}
 const lines=cart.map(x=>{const p=products.find(q=>q.id===x.id);return `${p.name} x ${x.qty} — ${money(p.price*x.qty)}`});
 const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
 const msg=`Hello Aurelle! I'd like to place an order:\n${lines.join("\n")}\nSubtotal: ${money(total)}\nPlease confirm availability, delivery fees, and payment options.`;
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
});
document.getElementById("year").textContent=new Date().getFullYear();setContactLinks();renderProducts();renderBag();
