const API_URL='https://vehicle-rental-backend-v2-production.up.railway.app/api';
let vehicles=[];

const money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
const customer=()=>{try{return JSON.parse(localStorage.getItem('driveeaseCustomer')||'null')}catch{return null}};
const normalizePhone=v=>{let p=(v||'').replace(/\D/g,'');if(p.startsWith('91')&&p.length===12)p=p.slice(2);return p};

async function api(path,options={}){const r=await fetch(API_URL+path,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});const text=await r.text();let data;try{data=JSON.parse(text)}catch{data=text}if(!r.ok)throw new Error(typeof data==='string'?data:'Request failed');return data}

async function loadVehicles(){
 try{vehicles=await api('/vehicles');renderVehicles();details();booking();availability()}
 catch(e){console.error(e);const g=document.getElementById('vehicleGrid');if(g)g.innerHTML='<div class="empty">Unable to connect to the vehicle service.</div>'}
}
function icon(v){return v.type==='Bike'?'🏍️':'🚘'}
function renderVehicles(){
 const grid=document.getElementById('vehicleGrid');if(!grid)return;
 const q=(document.getElementById('vehicleSearch')?.value||'').toLowerCase(),t=document.getElementById('typeFilter')?.value||'all';
 const list=vehicles.filter(v=>(v.name.toLowerCase().includes(q)||v.type.toLowerCase().includes(q))&&(t==='all'||v.type===t));
 grid.innerHTML=list.map(v=>\`<article class="vehicle-card"><div class="vehicle-img">\${icon(v)}</div><span class="eyebrow">\${v.type}</span><h3>\${v.name}</h3><p class="vehicle-meta">\${v.type==='Bike'?2:5} seats · Petrol · \${v.available?'Available':'Unavailable'}</p><div class="rate">\${money(v.pricePerDay)} <small>/ day</small></div><a class="btn primary" style="margin-top:15px" href="vehicle-details.html?id=\${v.id}">View Details</a></article>\`).join('')||'<div class="empty">No vehicles found.</div>';
}
function details(){
 const el=document.getElementById('vehicleDetails');if(!el)return;
 const id=Number(new URLSearchParams(location.search).get('id'));const v=vehicles.find(x=>x.id===id)||vehicles[0];if(!v)return;
 el.innerHTML=\`<div><div class="details-img">\${icon(v)}</div></div><div class="details-card"><span class="eyebrow">\${v.type}</span><h1 style="font:700 44px 'Space Grotesk';margin:12px 0">\${v.name}</h1><p style="color:#667085;line-height:1.7">Comfortable and well-maintained vehicle for your next trip.</p><p><b>\${v.type==='Bike'?2:5}</b> seats · <b>Petrol</b> · <b>\${v.available?'Available':'Unavailable'}</b></p><h2>\${money(v.pricePerDay)} <small>/ day</small></h2>\${v.available?'<a class="btn primary" href="booking.html?id='+v.id+'">Reserve Now</a>':'<span class="btn ghost">Currently Unavailable</span>'}</div>\`;
}
function booking(){
 const form=document.getElementById('bookingForm');if(!form)return;
 const v=vehicles.find(x=>x.id===Number(new URLSearchParams(location.search).get('id')))||vehicles[0];if(!v)return;
 const c=customer();if(!c){location.href='login.html';return}
 document.getElementById('bookingVehicle').textContent=v.name+' · '+money(v.pricePerDay)+' per day';
 const pickup=document.getElementById('bookPickup'),ret=document.getElementById('bookReturn'),total=document.getElementById('estimatedTotal'),error=document.getElementById('bookingError')||document.createElement('p');
 const today=new Date().toISOString().split('T')[0];pickup.min=today;ret.min=today;
 const update=()=>{if(!pickup||!ret||!total)return;if(!pickup.value||!ret.value){total.textContent=money(0);return}const days=Math.max(1,Math.ceil((new Date(ret.value)-new Date(pickup.value))/86400000));total.textContent=money(days*v.pricePerDay)};
 [pickup,ret].filter(Boolean).forEach(x=>x.addEventListener('change',update));
 form.addEventListener('submit',async e=>{e.preventDefault();error.style.display='none';if(new Date(ret.value)<new Date(pickup.value)){error.textContent='Return date cannot be before pickup date.';error.style.display='block';return}
 const button=form.querySelector('button[type=submit]');button.disabled=true;button.textContent='Checking...';
 try{const r=await api('/reservations',{method:'POST',body:JSON.stringify({customerId:c.id,vehicleId:v.id,startDate:pickup.value,endDate:ret.value})});location.href='confirmation.html?id='+r.id}catch(err){error.textContent=err.message;error.style.display='block'}finally{button.disabled=false;button.textContent='Confirm Reservation'}});
}
async function availability(){
 const f=document.getElementById('availabilityForm');if(!f)return;
 const result=document.getElementById('availabilityResult');
 f.addEventListener('submit',async e=>{e.preventDefault();const start=document.getElementById('pickup').value,end=document.getElementById('return').value,type=document.getElementById('availType').value;if(!start||!end||new Date(end)<new Date(start)){result.innerHTML='<p class="error-text">Please select valid dates.</p>';return}
 result.innerHTML='<p>Checking availability...</p>';try{const checks=await Promise.all(vehicles.filter(v=>type==='Any'||v.type===type).map(async v=>({v,ok:v.available&&await api('/reservations/availability/'+v.id+'?startDate='+start+'&endDate='+end)})));const found=checks.filter(x=>x.ok);result.innerHTML=found.length?'<div class="availability-list">'+found.map(x=>'<div class="price-box"><span><b>'+x.v.name+'</b><br>'+money(x.v.pricePerDay)+' / day</span><a class="btn primary" href="booking.html?id='+x.v.id+'">Book</a></div>').join('')+'</div>':'<p class="error-text">No vehicles are available for those dates.</p>'}catch(err){result.innerHTML='<p class="error-text">'+err.message+'</p>'}});
}
async function dashboard(){
 const list=document.getElementById('bookingList');if(!list)return;const c=customer();if(!c)return;
 const welcome=document.getElementById('welcomeUser');if(welcome)welcome.textContent='Signed in as '+c.name+' · '+c.phoneNumber;
 try{const [arr,all]=await Promise.all([api('/reservations/customer/'+c.id),api('/vehicles')]);list.innerHTML=arr.length?arr.map(b=>{const v=all.find(x=>x.id===b.vehicleId);return '<div class="booking-row"><div><b>'+(v?v.name:'Vehicle')+'</b><p>'+b.startDate+' → '+b.endDate+'</p></div><div style="text-align:right"><span class="status">'+b.status+'</span><b style="display:block;margin-top:8px">'+money(b.totalCost)+'</b><small>Booking #'+b.id+'</small></div></div>'}).join(''):'<div class="form-card"><h3>No reservations yet</h3><p>Browse the fleet and make your first booking.</p><a class="btn primary" href="vehicles.html">Browse Vehicles</a></div>'}catch(e){list.innerHTML='<div class="form-card"><p>Unable to load reservations.</p></div>'}
}
async function login(){
 const f=document.getElementById('loginForm');if(!f)return;
 f.addEventListener('submit',async e=>{e.preventDefault();const phone=normalizePhone(document.getElementById('loginPhone').value),password=document.getElementById('loginPassword').value,error=document.getElementById('loginError'),button=f.querySelector('button[type=submit]');error.style.display='none';if(phone.length!==10){error.textContent='Enter a valid 10-digit phone number.';error.style.display='block';return}button.disabled=true;button.textContent='Logging in...';try{const data=await api('/customers/login',{method:'POST',body:JSON.stringify({phoneNumber:phone,password})});localStorage.setItem('driveeaseCustomer',JSON.stringify(data));location.href='home.html'}catch(err){error.textContent=err.message;error.style.display='block'}finally{button.disabled=false;button.textContent='Login'}});
 const a=document.getElementById('adminLogin');if(a)a.onclick=()=>location.href='admin/index.html';
}
async function register(){
 const f=document.getElementById('registerForm');if(!f)return;
 f.addEventListener('submit',async e=>{e.preventDefault();const name=document.getElementById('registerName').value.trim(),phone=normalizePhone(document.getElementById('registerPhone').value),password=document.getElementById('registerPassword').value,confirm=document.getElementById('registerConfirm').value,error=document.getElementById('registerError'),button=f.querySelector('button[type=submit]');error.style.display='none';if(phone.length!==10){error.textContent='Enter a valid 10-digit phone number.';error.style.display='block';return}if(password!==confirm){error.textContent='Passwords do not match.';error.style.display='block';return}button.disabled=true;button.textContent='Creating account...';try{const data=await api('/customers/register',{method:'POST',body:JSON.stringify({name,phoneNumber:phone,password})});localStorage.setItem('driveeaseCustomer',JSON.stringify(data));location.href='home.html'}catch(err){error.textContent=err.message;error.style.display='block'}finally{button.disabled=false;button.textContent='Register'}});
}
function confirmation(){const el=document.getElementById('confirmationText');if(el){const id=new URLSearchParams(location.search).get('id');el.textContent='Reservation #'+(id||'')+' was confirmed and saved to the database.'}}
function protectPage(){const p=location.pathname.split('/').pop()||'index.html';if(!['index.html','login.html','register.html'].includes(p)&&!customer()){location.replace('login.html');return false}return true}
function logout(){localStorage.removeItem('driveeaseCustomer');location.href='login.html'}
document.addEventListener('DOMContentLoaded',async()=>{if(!protectPage())return;await loadVehicles();login();register();dashboard();confirmation();const out=document.getElementById('logoutButton');if(out)out.onclick=logout});
document.addEventListener('input',e=>{if(e.target.id==='vehicleSearch'||e.target.id==='typeFilter')renderVehicles()});