const FRANCHISE_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwUN_4BkXbgsk665fovYuul8yBOhxeEu4sFPSvHW5LnyI6lJCAwtf_lV-IHpKliN_Co/exec';
const form = document.getElementById('franchiseForm');
const statusEl = document.getElementById('franchiseNoteStatus');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressHint = document.getElementById('progressHint');
const successModal = document.getElementById('successModal');

function openSuccessModal(){
  successModal.classList.add('is-open');
  successModal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  successModal.querySelector('.success-close')?.focus();
}
function closeSuccessModal(){
  successModal.classList.remove('is-open');
  successModal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
document.querySelectorAll('[data-success-close]').forEach(el=>el.addEventListener('click',closeSuccessModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&successModal.classList.contains('is-open'))closeSuccessModal();});

const fields = [...form.querySelectorAll('input:not(.trap-field):not([type=hidden]), select, textarea')];
const requiredFields = fields.filter(el=>el.required);
const fieldCards = fields.map(el=>el.closest('[data-field-card]'));
const touched = new Set();

function looksLikePhone(value){return /^[6-9]\d{9}$/.test(value.replace(/\D/g,''));}

function validateField(el, showMessage=false){
  const card = el.closest('[data-field-card]');
  const feedback = card?.querySelector('.field-feedback');
  if(!card) return true;

  let valid = true;
  let message = '';
  const value = String(el.value || '').trim();

  if(el.required && !value){
    valid = false;
    message = 'This detail helps us start the conversation.';
  } else if(el.id === 'franchisePhone' && value && !looksLikePhone(value)){
    valid = false;
    message = 'Please enter a valid 10-digit Indian mobile number.';
  }

  card.classList.toggle('is-error', showMessage && !valid);
  card.classList.toggle('is-complete', valid && !!value);
  el.setAttribute('aria-invalid', (!valid && showMessage) ? 'true' : 'false');

  if(feedback && el.id !== 'franchiseNote'){
    feedback.textContent = showMessage && !valid ? message : (valid && value ? 'Looks good.' : '');
  }
  return valid;
}

function updateProgress(){
  const complete = requiredFields.filter(el=>String(el.value || '').trim() && (el.id !== 'franchisePhone' || looksLikePhone(el.value))).length;
  const pct = Math.round((complete/requiredFields.length)*100);
  progressBar.style.width = pct+'%';
  progressText.textContent = complete+' of '+requiredFields.length+' essentials';
  progressHint.textContent = complete===0 ? "Take your time — you're doing great." : complete===requiredFields.length ? 'You’re ready to send it.' : (requiredFields.length-complete)+' more to go.';
}

fields.forEach(el=>{
  ['input','change','blur'].forEach(evt=>el.addEventListener(evt,()=>{
    if(evt==='blur') touched.add(el);
    validateField(el,touched.has(el));
    updateProgress();
  }));
});
updateProgress();

form.addEventListener('submit',async e=>{
  e.preventDefault();

  const invalid = requiredFields.filter(el=>!validateField(el,true));
  updateProgress();
  if(invalid.length){
    statusEl.textContent='A couple of details need a quick check — we’ve pointed you to them.';
    invalid[0].focus();
    return;
  }

  const payload={
    name:document.getElementById('franchiseName').value.trim(),
    city:document.getElementById('franchiseCity').value.trim(),
    phone:document.getElementById('franchisePhone').value.trim(),
    investment:document.getElementById('franchiseInvestment').value,
    start:document.getElementById('franchiseStart').value,
    note:document.getElementById('franchiseNote').value.trim(),
    website:document.getElementById('franchiseWebsite').value.trim(),
    source:document.getElementById('franchiseSource').value
  };

  if(payload.website){
    statusEl.textContent='Thanks — your enquiry has been received.';
    return;
  }

  const btn=form.querySelector('button[type=submit]');
  const original=btn.innerHTML;
  btn.disabled=true;
  btn.innerHTML='<span>Sending…</span><span>↗</span>';
  statusEl.textContent='Sending your enquiry securely…';

  try{
    if(FRANCHISE_ENDPOINT.includes('PASTE_GOOGLE_APPS_SCRIPT')){
      statusEl.textContent='Form is ready. Add your Google Apps Script URL in franchise.js to enable live enquiries.';
      btn.disabled=false; btn.innerHTML=original;
      return;
    }

    await fetch(FRANCHISE_ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});

    form.reset();
    document.getElementById('franchiseSource').value='marky-momos-franchise-page';
    touched.clear();
    fieldCards.forEach(card=>card?.classList.remove('is-error','is-complete'));
    form.querySelectorAll('.field-feedback').forEach((el,i)=>{ if(i < 5) el.textContent=''; });
    updateProgress();
    btn.disabled=false; btn.innerHTML=original;
    statusEl.textContent='Enquiry sent. Nice work.';
    openSuccessModal();
  }catch(err){
    statusEl.innerHTML='We couldn’t send that just now. Please call <a href="tel:+919929540555">+91 99295 40555</a> and the team can help.';
    btn.disabled=false; btn.innerHTML=original;
  }
});
