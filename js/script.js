const API_URL='https://vehicle-rental-backend-v2-production.up.railway.app/api';
let vehicles=[];

const money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
const customer=()=>{try{return JSON.parse(localStorage.getItem('driveeaseCustomer')||'null')}catch{return null}};
const normalizePhone=v=>{let p=(v||'').replace(/\D/g,'');if(p.startsWith('91')&&p.length===12)p=p.slice(2);return p};
const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const imageMap={
 'Toyota Innova':'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=85',
 'Hyundai i20':'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=85',
 'Honda City':'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=85',
 'Maruti Swift':'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1000&q=85',
 'Kia Seltos':'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c7?auto=format&fit=crop&w=1000&q=85',
 'Mahindra Thar':'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1000&q=85',
 'Toyota Glanza':'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=85',
 'Royal Enfield Classic 350':'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=85',
 'Yamaha R15':'https://images.unsplash.com/photo-1558980394-0c5c8b7f6f91?auto=format&fit=crop&w=1000&q=85',
 'Honda Activa':'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=85',
 'KTM Duke 390':'https://images.unsplash.com/photo-1558980664-10ea1a1c4f96?auto=format&fit=crop&w=1000&q=85',
 'Yamaha MT-15':'https://images.unsplash.com/photo-1558981033-0f0309284409?auto=format&fit=crop&w=1000&q=85',
 'BTwin Riverside':'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=85',
 'Firefox Road Runner':'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1000&q=85',
 'Hero Sprint':'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&w=1000&q=85',
 'Montra Downtown':'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1000&q=85'
};
const fallbackImages={
 Car:'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=85',
 Bike:'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=85',
 Bicycle:'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=85'
};
function imageUrl(v){return imageMap[v.name]||fallbackImages[v.type]||fallbackImages.Car}
function icon(v){return v.type==='Bicycle'?'🚲':v.type==='Bike'?'🏍️':'🚘'}
function helmetText(v){return v.type==='Bike'||v.type==='Bicycle'?'🪖 Helmet included':'Safety kit available'}
function vehicleSpecs(v){return v.type==='Car'?['5 passengers','Petrol','AC']:v.type==='Bike'?['2 wheels','Petrol','Helmet included']:['2 wheels','Human powered','Helmet included']}

async function api(path,options={}){const r=await fetch(API_URL+path,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});const text=await r.text();let data;try{data=JSON.parse(text)}catch{data=text}if(!r.ok)throw new Error(typeof data==='string'?data:(data?.message||'Request failed'));return data}

function vehicleCard(v){
 const s=vehicleSpecs(v);
 return '<article class="vehicle-card"><div class="vehicle-img"><img src="'+imageUrl(v)+'" alt="'+escapeHtml(v.name)+'"></div><div class="vehicle-card-body"><span class="eyebrow">'+escapeHtml(v.type)+'</span><span class="availability-badge">'+(v.available?'Available':'Unavailable')+'</span><h3>'+escapeHtml(v.name)+'</h3><p class="vehicle-meta">'+s[0]+' · '+s[1]+' · '+s[2]+'</p>'+(v.type!=='Car'?'<div class="helmet">'+helmetText(v)+'</div>':'')+'<div class="rate">'+money(v.pricePerDay)+' <small>/ day</small></div><div class="vehicle-actions"><a class="btn primary" href="vehicle-details.html?id='+v.id+'">View Details</a></div></div></article>';
}
function renderVehicles(){
 const grid=document.getElementById('vehicleGrid');if(!grid)return;
 const q=(document.getElementById('vehicleSearch')?.value||'').toLowerCase(),t=document.getElementById('typeFilter')?.value||'all';
 const list=vehicles.filter(v=>(v.name.toLowerCase().includes(q)||v.type.toLowerCase().includes(q))&&(t==='all'||v.type===t));
 grid.innerHTML=list.map(vehicleCard).join('')||'<div class="empty">No vehicles found for this selection.</div>';
}
function renderHome(){
 const grid=document.getElementById('homeVehicleGrid');if(!grid)return;
 grid.innerHTML=vehicles.slice(0,4).map(vehicleCard).join('');
}
function details(){
 const el=document.getElementById('vehicleDetails');if(!el)return;
 const id=Number(new URLSearchParams(location.search).get('id'));const v=vehicles.find(x=>x.id===id)||vehicles[0];if(!v)return;
 const s=vehicleSpecs(v);
 el.innerHTML='<div><div class="details-img"><img src="'+imageUrl(v)+'" alt="'+escapeHtml(v.name)+'"></div></div><div class="details-card"><span class="eyebrow">'+escapeHtml(v.type)+'</span><h1>'+escapeHtml(v.name)+'</h1><div class="details-price">'+money(v.pricePerDay)+' <small>/ day</small></div><span class="status">'+(v.available?'● Available':'● Currently unavailable')+'</span><div class="spec-grid"><div class="spec"><small>TYPE</small><b>'+escapeHtml(v.type)+'</b></div><div class="spec"><small>REGISTRATION</small><b>'+escapeHtml(v.registrationNumber)+'</b></div><div class="spec"><small>CAPACITY</small><b>'+s[0]+'</b></div><div class="spec"><small>FUEL / DRIVE</small><b>'+s[1]+'</b></div></div><div class="detail-section"><h3>Safety & support</h3><div class="check">✓ Vehicle maintained</div><div class="check">✓ Availability checked before booking</div><div class="check">✓ Rental support</div>'+(v.type!=='Car'?'<div class="check">✓ Helmet included with this rental</div>':'')+'</div><div style="margin-top:25px">'+(v.available?'<a class="btn primary" style="width:100%;text-align:center" href="booking.html?id='+v.id+'">Reserve this vehicle</a>':'<span class="btn ghost" style="display:block;text-align:center">Currently unavailable</span>')+'</div></div>';
}
function showRegistrationPrompt(){
 const form=document.getElementById('bookingForm');if(!form)return;
 const id=new URLSearchParams(location.search).get('id');if(id)localStorage.setItem('pendingBookingVehicleId',id);
 form.innerHTML='<div class="price-box" style="display:block;text-align:center;padding:28px"><span class="eyebrow">LOGIN REQUIRED TO RESERVE</span><h3 style="margin:10px 0 8px;font-family:Space Grotesk">Ready to book?</h3><p>Browse the fleet without signing in. Login or create an account only when you want to make a reservation.</p><div class="actions" style="justify-content:center"><a class="btn primary" href="register.html">Create Account</a><a class="btn ghost" href="login.html">Login</a></div></div>';
}
function booking(){
 const form=document.getElementById('bookingForm');if(!form)return;
 const v=vehicles.find(x=>x.id===Number(new URLSearchParams(location.search).get('id')))||vehicles[0];if(!v)return;
 const c=customer();if(!c){showRegistrationPrompt();return}
 const specs=vehicleSpecs(v);
 document.getElementById('bookingVehicle').textContent=v.name+' · '+money(v.pricePerDay)+' per day';
 form.innerHTML='<div class="booking-layout"><div class="booking-vehicle"><img src="'+imageUrl(v)+'" alt="'+escapeHtml(v.name)+'"><div class="booking-vehicle-body"><span class="eyebrow">'+escapeHtml(v.type)+'</span><h2>'+escapeHtml(v.name)+'</h2><p class="vehicle-meta">'+specs.join(' · ')+'</p>'+(v.type!=='Car'?'<div class="helmet">'+helmetText(v)+'</div>':'')+'</div></div><div class="booking-side"><form id="reservationFields"><label>Pickup date<input id="bookPickup" type="date" required></label><label>Return date<input id="bookReturn" type="date" required></label><label>Safety & add-ons<select id="addon"><option value="0">No extra add-on</option><option value="100">Extra helmet — ₹100</option><option value="500">Extra insurance — ₹500</option></select></label><p id="bookingError" class="error-text"></p><div class="price-box"><span>Estimated total</span><strong id="estimatedTotal">₹0</strong></div><button class="btn primary" style="width:100%;margin-top:15px" type="submit">Confirm Reservation</button></form></div></div>';
 const rf=document.getElementById('reservationFields'),pickup=document.getElementById('bookPickup'),ret=document.getElementById('bookReturn'),addon=document.getElementById('addon'),total=document.getElementById('estimatedTotal'),error=document.getElementById('bookingError');
 const today=new Date().toISOString().split('T')[0];pickup.min=today;ret.min=today;
 const update=()=>{if(!pickup.value||!ret.value){total.textContent=money(0);return}const days=Math.max(1,Math.ceil((new Date(ret.value)-new Date(pickup.value))/86400000));total.textContent=money(days*v.pricePerDay+Number(addon.value||0))};
 [pickup,ret,addon].forEach(x=>x.addEventListener('change',update));
 rf.addEventListener('submit',async e=>{e.preventDefault();error.style.display='none';if(!pickup.value||!ret.value||new Date(ret.value)<new Date(pickup.value)){error.textContent='Please select valid rental dates.';return}const button=rf.querySelector('button[type=submit]');button.disabled=true;button.textContent='Checking availability...';try{const ok=await api('/reservations/availability/'+v.id+'?startDate='+pickup.value+'&endDate='+ret.value);if(!ok)throw new Error('This vehicle is not available for the selected dates.');const r=await api('/reservations',{method:'POST',body:JSON.stringify({customerId:c.id,vehicleId:v.id,startDate:pickup.value,endDate:ret.value})});location.href='confirmation.html?id='+r.id}catch(err){error.textContent=err.message;error.style.display='block'}finally{button.disabled=false;button.textContent='Confirm Reservation'}});
}
async function availability(){
 const f=document.getElementById('availabilityForm');if(!f)return;
 const result=document.getElementById('availabilityResult');
 f.addEventListener('submit',async e=>{e.preventDefault();const start=document.getElementById('pickup').value,end=document.getElementById('return').value,type=document.getElementById('availType').value;if(!start||!end||new Date(end)<new Date(start)){result.innerHTML='<p class="error-text">Please select valid dates.</p>';return}result.innerHTML='<p>Checking availability...</p>';try{const checks=await Promise.all(vehicles.filter(v=>type==='Any'||v.type===type).map(async v=>({v,ok:v.available&&await api('/reservations/availability/'+v.id+'?startDate='+start+'&endDate='+end)})));const found=checks.filter(x=>x.ok);result.innerHTML=found.length?'<div class="vehicle-grid" style="width:100%;padding:25px 0 0">'+found.map(x=>vehicleCard(x.v)).join('')+'</div>':'<p class="error-text">No vehicles are available for those dates.</p>'}catch(err){result.innerHTML='<p class="error-text">'+escapeHtml(err.message)+'</p>'}});
}
async function dashboard(){
 const list=document.getElementById('bookingList');if(!list)return;const c=customer();
 if(!c){list.innerHTML='<div class="form-card" style="text-align:center"><span class="eyebrow">CUSTOMER AREA</span><h3 style="font-family:Space Grotesk">Login to view your reservations</h3><p>You can browse the website freely. Sign in only when you want to manage bookings.</p><div class="actions" style="justify-content:center"><a class="btn primary" href="login.html">Login</a><a class="btn ghost" href="register.html">Create Account</a></div></div>';return}
 const welcome=document.getElementById('welcomeUser');if(welcome)welcome.textContent='Signed in as '+c.name+' · '+c.phoneNumber;
 try{const [arr,all]=await Promise.all([api('/reservations/customer/'+c.id),api('/vehicles')]);list.innerHTML=arr.length?arr.slice().reverse().map(b=>{const v=all.find(x=>x.id===b.vehicleId);return '<div class="booking-row"><div style="display:flex;gap:16px;align-items:center"><img src="'+(v?imageUrl(v):fallbackImages.Car)+'" alt="" style="width:110px;height:75px;object-fit:cover;border-radius:10px"><div><b>'+escapeHtml(v?v.name:'Vehicle')+'</b><p class="vehicle-meta">'+b.startDate+' → '+b.endDate+'</p></div></div><div style="text-align:right"><span class="status">'+escapeHtml(b.status)+'</span><b style="display:block;margin-top:8px">'+money(b.totalCost)+'</b><small>Booking #'+b.id+'</small></div></div>'}).join(''):'<div class="form-card"><h3 style="font-family:Space Grotesk">No reservations yet</h3><p>Browse the fleet and make your first booking.</p><a class="btn primary" href="vehicles.html">Browse Vehicles</a></div>'}catch(e){list.innerHTML='<div class="form-card"><p>Unable to load reservations.</p></div>'}
}
async function login(){
 const f=document.getElementById('loginForm');if(!f)return;
 f.addEventListener('submit',async e=>{e.preventDefault();const phone=normalizePhone(document.getElementById('loginPhone').value),password=document.getElementById('loginPassword').value,error=document.getElementById('loginError'),button=f.querySelector('button[type=submit]');error.style.display='none';if(phone.length!==10){error.textContent='Enter a valid 10-digit phone number.';error.style.display='block';return}button.disabled=true;button.textContent='Logging in...';try{const data=await api('/customers/login',{method:'POST',body:JSON.stringify({phoneNumber:phone,password})});localStorage.setItem('driveeaseCustomer',JSON.stringify(data));const pending=localStorage.getItem('pendingBookingVehicleId');if(pending){localStorage.removeItem('pendingBookingVehicleId');location.href='booking.html?id='+pending}else location.href='dashboard.html'}catch(err){error.textContent=err.message;error.style.display='block'}finally{button.disabled=false;button.textContent='Login'}});
 const a=document.getElementById('adminLogin');if(a)a.onclick=()=>location.href='admin/index.html';
}
async function register(){
 const f=document.getElementById('registerForm');if(!f)return;
 f.addEventListener('submit',async e=>{e.preventDefault();const name=document.getElementById('registerName').value.trim(),phone=normalizePhone(document.getElementById('registerPhone').value),password=document.getElementById('registerPassword').value,confirm=document.getElementById('registerConfirm').value,error=document.getElementById('registerError'),button=f.querySelector('button[type=submit]');error.style.display='none';if(phone.length!==10){error.textContent='Enter a valid 10-digit phone number.';error.style.display='block';return}if(password!==confirm){error.textContent='Passwords do not match.';error.style.display='block';return}button.disabled=true;button.textContent='Creating account...';try{const data=await api('/customers/register',{method:'POST',body:JSON.stringify({name,phoneNumber:phone,password})});localStorage.setItem('driveeaseCustomer',JSON.stringify(data));const pending=localStorage.getItem('pendingBookingVehicleId');if(pending){localStorage.removeItem('pendingBookingVehicleId');location.href='booking.html?id='+pending}else location.href='dashboard.html'}catch(err){error.textContent=err.message;error.style.display='block'}finally{button.disabled=false;button.textContent='Register'}});
}
function confirmation(){const el=document.getElementById('confirmationText');if(el){const id=new URLSearchParams(location.search).get('id');el.textContent='Reservation #'+(id||'')+' has been confirmed and saved to your account.'}}
function logout(){localStorage.removeItem('driveeaseCustomer');location.href='login.html'}
document.addEventListener('DOMContentLoaded',async()=>{await loadVehicles();login();register();dashboard();confirmation();const out=document.getElementById('logoutButton');if(out)out.onclick=logout});
async function loadVehicles(){try{vehicles=await api('/vehicles');renderVehicles();renderHome();details();booking();availability()}catch(e){console.error(e);const g=document.getElementById('vehicleGrid');if(g)g.innerHTML='<div class="empty">Unable to connect to the vehicle service.</div>'}}
document.addEventListener('input',e=>{if(e.target.id==='vehicleSearch'||e.target.id==='typeFilter')renderVehicles()});
