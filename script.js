const line = document.getElementById('scrollLine');
const updateScroll = () => {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  line.style.width = `${Math.max(0, Math.min(100, window.scrollY / h * 100))}%`;
};
window.addEventListener('scroll', updateScroll, {passive:true});
updateScroll();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('is-in'); });
}, {threshold: .12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-3px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

/* Franchise lead delivery: deploy apps-script.gs, then paste the /exec URL here. */
const FRANCHISE_ENDPOINT = 'PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
const franchiseForm = document.getElementById('franchiseForm');
const franchiseStatus = document.getElementById('franchiseNoteStatus');
const successModal = document.getElementById('successModal');

function openSuccessModal(){
  successModal.classList.add('is-open');
  successModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeSuccessModal(){
  successModal.classList.remove('is-open');
  successModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-success-close]').forEach(el => el.addEventListener('click', closeSuccessModal));
document.addEventListener('keydown', e => { if(e.key === 'Escape' && successModal.classList.contains('is-open')) closeSuccessModal(); });

function looksLikePhone(value){
  const digits = value.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(digits);
}

franchiseForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  franchiseStatus.textContent = 'Sending your enquiry…';

  const payload = {
    name: document.getElementById('franchiseName').value.trim(),
    city: document.getElementById('franchiseCity').value.trim(),
    phone: document.getElementById('franchisePhone').value.trim(),
    investment: document.getElementById('franchiseInvestment').value,
    start: document.getElementById('franchiseStart').value,
    note: document.getElementById('franchiseNote').value.trim(),
    website: document.getElementById('franchiseWebsite').value.trim(),
    source: document.getElementById('franchiseSource').value
  };

  if(!payload.name || !payload.city || !payload.phone || !payload.investment || !payload.start){
    franchiseStatus.textContent = 'A couple of details are still missing — please check the highlighted fields.';
    return;
  }
  if(!looksLikePhone(payload.phone)){
    franchiseStatus.textContent = 'Please enter a valid 10-digit Indian mobile number.';
    document.getElementById('franchisePhone').focus();
    return;
  }
  if(payload.website){
    franchiseStatus.textContent = 'Thanks — your enquiry has been received.';
    return;
  }

  try {
    if(FRANCHISE_ENDPOINT.includes('PASTE_GOOGLE_APPS_SCRIPT')){
      // Keep the UX functional in an unconfigured preview while clearly avoiding a fake “sent” claim.
      franchiseStatus.textContent = 'Form is ready. Add the Google Apps Script URL in script.js to send live enquiries.';
      franchiseForm.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }

    await fetch(FRANCHISE_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify(payload)
    });

    franchiseForm.reset();
    document.getElementById('franchiseSource').value = 'marky-momos-website';
    franchiseStatus.textContent = 'Sent.';
    openSuccessModal();
  } catch(err){
    franchiseStatus.innerHTML = 'We couldn’t send that just now. Please call <a href="tel:+919929540555">+91 99295 40555</a> and the team can help.';
  }
});

/* Existing review demo — intentionally local-only. */
const starButtons = [...document.querySelectorAll('.rating-input button')];
let selectedRating = 0;
starButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedRating = Number(btn.dataset.star);
    starButtons.forEach(b => b.classList.toggle('active', Number(b.dataset.star) <= selectedRating));
  });
});

const reviewForm = document.getElementById('reviewForm');
const wall = document.getElementById('reviewWall');
const note = document.getElementById('reviewNote');
const storageKey = 'markyDemoReviews';
function getReviews(){
  try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); }
  catch { return []; }
}
function escapeHTML(str){
  return str.replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
function renderReviews(){
  const reviews = getReviews();
  wall.innerHTML = reviews.slice(-3).reverse().map(r => `
    <article class="user-review">
      <div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
      <b>${escapeHTML(r.name)}</b>
      <p>${escapeHTML(r.text)}</p>
    </article>`).join('');
}
reviewForm.addEventListener('submit', e => {
  e.preventDefault();
  if(!selectedRating){ note.textContent = 'Pick a rating first — then hit send.'; return; }
  const name = document.getElementById('reviewName').value.trim();
  const text = document.getElementById('reviewText').value.trim();
  const reviews = getReviews();
  reviews.push({name, text, rating:selectedRating, created:new Date().toISOString()});
  localStorage.setItem(storageKey, JSON.stringify(reviews));
  reviewForm.reset(); selectedRating = 0; starButtons.forEach(b => b.classList.remove('active'));
  note.textContent = 'Saved on this browser. Connect this form to a backend before launch.';
  renderReviews();
});
renderReviews();
