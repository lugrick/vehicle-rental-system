const API_URL='https://vehicle-rental-backend-v2-production.up.railway.app/api';
let vehicles=[], reservations=[];
const $=id=>document.getElementById(id);
const money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
const adminSession=()=>localStorage.getItem('driveeaseAdmin')==='true';

async function api(path,options={}){
 const r=await fetch(API_URL+path,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
 const text=await r.text();let data;try{data=JSON.parse(text)}catch{data=text}
 if(!r.ok)throw new Error(typeof data==='string'?data:(data?.message||'Request failed'));
 return data;
}
function notice(msg,error=false){const n=$('adminNotice');n.textContent=msg;n.className='notice show'+(error?' error':'');clearTimeout(window.noticeTimer);window.noticeTimer=setTimeout(()=>n.className='notice',3500)}
async function refresh(){
 [vehicles,reservations]=await Promise.all([api('/vehicles'),api('/reservations')]);
}
function badge(status){const s=(status||'').toUpperCase();const cls=s==='CONFIRMED'||s==='AVAILABLE'?'available':s==='CANCELLED'?'cancelled':'booked';return '<span class="badge '+cls+'">'+s+'</span>'}
function overview(){
 const available=vehicles.filter(v=>v.available).length;
 const revenue=reservations.filter(r=>(r.status||'')!=='CANCELLED').reduce((s,r)=>s+Number(r.totalCost||0),0);
 $('adminContent').innerHTML='<div class="kpi-grid"><div class="kpi"><small>Total Vehicles</small><strong>'+vehicles.length+'</strong></div><div class="kpi"><small>Available Now</small><strong>'+available+'</strong></div><div class="kpi"><small>Reservations</small><strong>'+reservations.length+'</strong></div><div class="kpi"><small>Booking Value</small><strong>'+money(revenue)+'</strong></div></div>'+
 '<div class="grid2"><div class="panel"><h3>Recent Reservations</h3>'+reservationTable(reservations.slice().reverse().slice(0,6))+'</div><div class="panel"><h3>Fleet Status</h3>'+vehicles.map(v=>'<p style="display:flex;justify-content:space-between;gap:10px"><span>'+v.name+'</span>'+badge(v.available?'AVAILABLE':'UNAVAILABLE')+'</p>').join('')+'</div></div>';
}
function reservationTable(rows){
 if(!rows.length)return '<div class="empty">No reservations found.</div>';
 return '<div class="table-wrap"><table class="admin-table"><tr><th>ID</th><th>Vehicle</th><th>Customer</th><th>Dates</th><th>Amount</th><th>Status</th></tr>'+rows.map(r=>{const v=vehicles.find(x=>x.id===r.vehicleId);return '<tr><td>#'+r.id+'</td><td>'+(v?v.name:'Vehicle #'+r.vehicleId)+'</td><td>Customer #'+r.customerId+'</td><td>'+r.startDate+'<br>'+r.endDate+'</td><td>'+money(r.totalCost)+'</td><td>'+badge(r.status)+'</td></tr>'}).join('')+'</table></div>';
}
function vehiclesView(){
 $('adminContent').innerHTML='<div class="panel"><div class="section-actions"><h3>Fleet Management</h3><button class="admin-btn" id="addVehicle">+ Add Vehicle</button></div><div class="table-wrap"><table class="admin-table"><tr><th>ID</th><th>Vehicle</th><th>Type</th><th>Registration</th><th>Rate/day</th><th>Status</th><th>Action</th></tr>'+vehicles.map(v=>'<tr><td>#'+v.id+'</td><td><b>'+v.name+'</b></td><td>'+v.type+'</td><td>'+v.registrationNumber+'</td><td>'+money(v.pricePerDay)+'</td><td>'+badge(v.available?'AVAILABLE':'UNAVAILABLE')+'</td><td><button class="admin-btn secondary edit" data-id="'+v.id+'">Edit</button> <button class="admin-btn danger delete" data-id="'+v.id+'">Delete</button></td></tr>').join('')+'</table></div></div>';
 $('addVehicle').onclick=()=>openVehicleModal();
 document.querySelectorAll('.edit').forEach(b=>b.onclick=()=>openVehicleModal(vehicles.find(v=>v.id==b.dataset.id)));
 document.querySelectorAll('.delete').forEach(b=>b.onclick=()=>deleteVehicle(Number(b.dataset.id)));
}
function openVehicleModal(v=null){
 const existing=$('vehicleModal');if(existing)existing.remove();
 const m=document.createElement('div');m.id='vehicleModal';m.className='modal';m.innerHTML='<div class="modal-card"><span class="eyebrow">'+(v?'EDIT VEHICLE':'ADD VEHICLE')+'</span><h2 style="font-family:Space Grotesk;margin:10px 0 20px">'+(v?'Update vehicle':'Add a vehicle')+'</h2><form id="vehicleForm" class="form-grid"><label>Name<input id="vName" value="'+(v?.name||'')+'" required></label><label>Type<select id="vType"><option '+(v?.type==='Car'?'selected':'')+'>Car</option><option '+(v?.type==='Bike'?'selected':'')+'>Bike</option><option '+(v?.type==='Bicycle'?'selected':'')+'>Bicycle</option></select></label><label>Registration Number<input id="vReg" value="'+(v?.registrationNumber||'')+'" required></label><label>Price per day<input id="vPrice" type="number" min="0" value="'+(v?.pricePerDay||'')+'" required></label><label>Availability<select id="vAvailable"><option value="true" '+(v?.available!==false?'selected':'')+'>Available</option><option value="false" '+(v?.available===false?'selected':'')+'>Unavailable</option></select></label></form><div class="modal-actions"><button class="admin-btn secondary" type="button" id="closeModal">Cancel</button><button class="admin-btn" type="button" id="saveVehicle">Save</button></div></div>';
 document.body.appendChild(m);$('closeModal').onclick=()=>m.remove();$('saveVehicle').onclick=async()=>{const data={name:$('vName').value.trim(),type:$('vType').value,registrationNumber:$('vReg').value.trim(),pricePerDay:Number($('vPrice').value),available:$('vAvailable').value==='true'};try{if(v)await api('/vehicles/'+v.id,{method:'PUT',body:JSON.stringify(data)});else await api('/vehicles',{method:'POST',body:JSON.stringify(data)});m.remove();await refresh();vehiclesView();notice(v?'Vehicle updated.':'Vehicle added.')}catch(e){notice(e.message,true)}};
}
async function deleteVehicle(id){if(!confirm('Delete this vehicle?'))return;try{await api('/vehicles/'+id,{method:'DELETE'});await refresh();vehiclesView();notice('Vehicle deleted.')}catch(e){notice(e.message,true)}}
function bookingsView(){ $('adminContent').innerHTML='<div class="panel"><div class="section-actions"><h3>Reservation Management</h3><span class="badge pending">'+reservations.length+' booking(s)</span></div>'+reservationTable(reservations.slice().reverse())+'</div>'}
function customersView(){
 const ids=[...new Set(reservations.map(r=>r.customerId))];
 $('adminContent').innerHTML='<div class="panel"><h3>Customers from Reservations</h3>'+(ids.length?ids.map(id=>{const count=reservations.filter(r=>r.customerId===id).length;return '<div class="customer-card" style="padding:15px 0;border-bottom:1px solid #edf0f4"><div><b>Customer #'+id+'</b><p>Customer account linked to the reservation system</p></div><span class="badge available">'+count+' booking'+(count===1?'':'s')+'</span></div>'}).join(''):'<div class="empty">No customers have made reservations yet.</div>')+'</div>';
}
async function show(section){
 $('sectionTitle').textContent=section[0].toUpperCase()+section.slice(1);
 document.querySelectorAll('.side-link[data-section]').forEach(x=>x.classList.toggle('active',x.dataset.section===section));
 try{await refresh();({overview,vehicles:vehiclesView,bookings:bookingsView,customers:customersView}[section]||overview)()}catch(e){$('adminContent').innerHTML='<div class="panel"><p>Unable to load data from the backend.</p><button class="admin-btn" id="retry">Retry</button></div>';$('retry').onclick=()=>show(section)}
}
function startApp(){ $('adminLogin').hidden=true;$('adminApp').hidden=false;show('overview') }
$('adminLoginForm').addEventListener('submit',async e=>{e.preventDefault();const err=$('adminLoginError'),btn=e.target.querySelector('button');err.textContent='';btn.disabled=true;btn.textContent='Signing in...';try{await api('/admin/login',{method:'POST',body:JSON.stringify({username:$('adminUsername').value.trim(),password:$('adminPassword').value})});localStorage.setItem('driveeaseAdmin','true');startApp()}catch(ex){err.textContent=ex.message||'Invalid admin credentials.'}finally{btn.disabled=false;btn.textContent='Sign in'}});
document.querySelectorAll('.side-link[data-section]').forEach(x=>x.addEventListener('click',()=>show(x.dataset.section)));
$('adminLogout').addEventListener('click',()=>{localStorage.removeItem('driveeaseAdmin');location.reload()});
if(adminSession())startApp();