const vehicles=[
{id:1,name:'Honda City',type:'Car',rate:1499,seats:5,icon:'🚘',fuel:'Petrol'},
{id:2,name:'Toyota Glanza',type:'Car',rate:1299,seats:5,icon:'🚗',fuel:'Petrol'},
{id:3,name:'Hyundai i20',type:'Car',rate:1199,seats:5,icon:'🚙',fuel:'Petrol'},
{id:4,name:'Royal Enfield Classic',type:'Bike',rate:699,seats:2,icon:'🏍️',fuel:'Petrol'},
{id:5,name:'Yamaha R15',type:'Bike',rate:799,seats:2,icon:'🏍️',fuel:'Petrol'},
{id:6,name:'Honda Activa',type:'Bike',rate:499,seats:2,icon:'🛵',fuel:'Petrol'}];
function money(n){return '₹'+Number(n).toLocaleString('en-IN')}
function renderVehicles(){
 const grid=document.getElementById('vehicleGrid'); if(!grid)return;
 const q=(document.getElementById('vehicleSearch')?.value||'').toLowerCase(),t=document.getElementById('typeFilter')?.value||'all';
 grid.innerHTML=vehicles.filter(v=>(v.name.toLowerCase().includes(q)||v.type.toLowerCase().includes(q))&&(t==='all'||v.type===t)).map(v=>`<article class="vehicle-card"><div class="vehicle-img">${v.icon}</div><span class="eyebrow">${v.type}</span><h3>${v.name}</h3><p class="vehicle-meta">${v.seats} seats · ${v.fuel} · Available</p><div class="rate">${money(v.rate)} <small>/ day</small></div><a class="btn primary" style="margin-top:15px" href="vehicle-details.html?id=${v.id}">View Details</a></article>`).join('')||'<div class="empty">No vehicles found.</div>';
}
function details(){
 const el=document.getElementById('vehicleDetails');if(!el)return;
 const id=Number(new URLSearchParams(location.search).get('id'))||1,v=vehicles.find(x=>x.id===id)||vehicles[0];
 el.innerHTML=`<div><div class="details-img">${v.icon}</div></div><div class="details-card"><span class="eyebrow">${v.type}</span><h1 style="font:700 44px 'Space Grotesk';margin:12px 0">${v.name}</h1><p style="color:#667085;line-height:1.7">Comfortable and well-maintained ${v.type.toLowerCase()} for your next trip.</p><p><b>${v.seats}</b> seats &nbsp; · &nbsp; <b>${v.fuel}</b> &nbsp; · &nbsp; <b>Available</b></p><h2>${money(v.rate)} <small>/ day</small></h2><a class="btn primary" href="booking.html?id=${v.id}">Reserve Now</a></div>`;
}
function booking(){
 const form=document.getElementById('bookingForm');if(!form)return;
 const id=Number(new URLSearchParams(location.search).get('id'))||1,v=vehicles.find(x=>x.id===id)||vehicles[0];
 document.getElementById('bookingVehicle').textContent=`${v.name} · ${money(v.rate)} per day`;
 const update=()=>{const a=new Date(bookPickup.value),b=new Date(bookReturn.value);let days=Math.ceil((b-a)/86400000);if(!Number.isFinite(days)||days<1)days=1;estimatedTotal.textContent=money(days*v.rate+Number(addon.value||0));};
 [bookPickup,bookReturn,addon].forEach(x=>x.addEventListener('change',update));
 form.addEventListener('submit',e=>{e.preventDefault();const a=new Date(bookPickup.value),b=new Date(bookReturn.value);let days=Math.max(1,Math.ceil((b-a)/86400000));const booking={id:'DE'+Date.now().toString().slice(-6),vehicle:v.name,customer:customerName.value,email:customerEmail.value,pickup:bookPickup.value,returnDate:bookReturn.value,total:days*v.rate+Number(addon.value||0),status:'Confirmed'};const arr=JSON.parse(localStorage.getItem('driveeaseBookings')||'[]');arr.push(booking);localStorage.setItem('driveeaseBookings',JSON.stringify(arr));localStorage.setItem('driveeaseUser',customerEmail.value);location.href='confirmation.html?id='+booking.id;});
}
function dashboard(){
 const list=document.getElementById('bookingList');if(!list)return;const arr=JSON.parse(localStorage.getItem('driveeaseBookings')||'[]');const email=localStorage.getItem('driveeaseUser');if(email)welcomeUser.textContent='Signed in as '+email;
 list.innerHTML=arr.length?arr.slice().reverse().map(b=>`<div class="booking-row"><div><b>${b.vehicle}</b><p>${b.pickup} → ${b.returnDate}</p></div><div style="text-align:right"><span class="status">${b.status}</span><b style="display:block;margin-top:8px">${money(b.total)}</b><small>${b.id}</small></div></div>`).join(''):'<div class="form-card"><h3>No reservations yet</h3><p>Browse the fleet and make your first booking.</p><a class="btn primary" href="vehicles.html">Browse Vehicles</a></div>';
}
function availability(){
 const f=document.getElementById('availabilityForm');if(!f)return;f.addEventListener('submit',e=>{e.preventDefault();const t=availType.value;const found=vehicles.filter(v=>t==='Any'||v.type===t);availabilityResult.innerHTML=`<div class="price-box" style="margin-top:20px"><span>${found.length} vehicles match your selection</span><a href="vehicles.html" class="btn primary">View Fleet</a></div>`;});
}
function login(){
 const f=document.getElementById('loginForm');if(!f)return;f.addEventListener('submit',e=>{e.preventDefault();localStorage.setItem('driveeaseUser',loginEmail.value);location.href='dashboard.html'});adminLogin.addEventListener('click',()=>location.href='admin/index.html');
}
function confirmation(){const el=document.getElementById('confirmationText');if(!el)return;const id=new URLSearchParams(location.search).get('id');el.textContent='Reservation '+(id||'')+' has been saved successfully. You can view it from your customer dashboard.'}
document.addEventListener('DOMContentLoaded',()=>{renderVehicles();details();booking();dashboard();availability();login();confirmation();});
document.addEventListener('input',e=>{if(e.target.id==='vehicleSearch'||e.target.id==='typeFilter')renderVehicles()});