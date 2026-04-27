
const $ = (id) => document.getElementById(id);
const esc = (s="") => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const img = (s="") => !s ? "" : (s.startsWith("/") || s.startsWith("http") ? s : "/" + s);
async function getJSON(path){ const r = await fetch(path+"?v="+Date.now()); if(!r.ok) throw new Error(path); return r.json(); }

function renderFixedStatus(site){
  if ($('fixedFieldStatus')) $('fixedFieldStatus').textContent = site.fieldStatus || 'OPEN';
  if ($('fixedAnnouncement')) $('fixedAnnouncement').textContent = site.announcement || '';
}


async function loadHome(){
  const [site, eventsData, resData] = await Promise.all([getJSON('/content/site.json'), getJSON('/content/events.json'), getJSON('/content/resources.json')]);
  renderFixedStatus(site);
  document.title = site.name;
  $('homeHero').style.backgroundImage = `linear-gradient(rgba(0,0,0,.25),rgba(0,0,0,.35)), url('${img(site.heroImage)}')`;
  $('heroTitle').textContent = site.headline;
  $('heroCta').textContent = site.heroButtonText;
  $('fieldStatus').textContent = site.fieldStatus;
  $('announcement').textContent = site.announcement;
  $('aboutTitle').textContent = site.legalName;
  $('aboutText').textContent = site.about;
  $('facebookLink').href = site.facebook;
  $('videoLink').href = site.videoStreamsUrl || '#';
  $('waiverQuick').href = site.waiverUrl;
  $('menuQuick').href = site.menuUrl;
  $('rentalQuick').href = '/private-rentals.html';
  $('eventsQuick').href = '/events.html';
  if ($('facilityHighlights')) $('facilityHighlights').innerHTML = (site.facilityHighlights || []).map(x => `<div class="info-mini-card"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div>`).join('');
  if ($('planVisit')) $('planVisit').innerHTML = (site.planVisit || []).map(x => `<div class="visit-item">${esc(x)}</div>`).join('');
  if ($('whyChoose')) $('whyChoose').innerHTML = (site.whyChoose || []).map(x => `<div class="why-card">${esc(x)}</div>`).join('');
  const slides = [...site.homeSlider, ...site.homeSlider];
  $('sliderTrack').innerHTML = slides.map(s => `<div class="slide-card"><img src="${esc(img(s))}" alt="Adventure Sports photo"></div>`).join('');
  const catImages = {
    "Baseball": "/uploads/gallery/gallery-10.jpg",
    "Softball": "/uploads/gallery/gallery-2.jpg",
    "Flag Football": "/uploads/gallery/gallery-12.jpg",
    "Camps": "/uploads/gallery/gallery-5.jpg",
    "Tournaments": img(site.heroImage),
    "Private Rentals": img(site.facilityMap)
  };
  $('categoryGrid').innerHTML = eventsData.categories.map(c => `<a class="category-card" href="/events.html?category=${encodeURIComponent(c)}"><img src="${catImages[c] || img(site.heroImage)}" alt="${esc(c)}"><span>${esc(c)}<br>Events</span></a>`).join('');
  const featured = eventsData.events.filter(e => e.featured).slice(0,4);
  $('upcomingEvents').innerHTML = featured.map(e => `<div class="feature-card"><img src="${esc(img(e.logo || e.image))}" alt="${esc(e.title)}"><div><h3>${esc(e.title)}</h3><p><b>${esc(e.date)}</b></p><p>${esc(e.location || '')}</p></div><a class="btn red" href="${esc(e.register || '/events.html')}">View Event</a></div>`).join('');
  $('locName').textContent = site.name;
  $('locAddress').innerHTML = `${esc(site.shortAddress)}<br>${esc(site.cityStateZip)}`;
  $('locHours').textContent = site.hours;
  $('locPhone').textContent = site.phone;
  $('parkingNote').textContent = site.parking;
  $('resourcesGrid').innerHTML = resData.resources.map(r => `<a href="${esc(r.url)}" target="_blank" rel="noopener" title="${esc(r.name)}"><img src="${esc(img(r.logo))}" alt="${esc(r.name)}"></a>`).join('');
  $('footerName').textContent = site.name;
  $('footerAddress').innerHTML = `${esc(site.shortAddress)}<br>${esc(site.cityStateZip)}`;
  $('footerPhone').textContent = site.phone;
  $('footerPhone').href = 'tel:' + site.phone.replace(/\D/g,'');
  $('footerEmail').textContent = site.email;
  $('footerEmail').href = 'mailto:' + site.email;
  $('footerHours').textContent = site.hours;
  $('footerLogo').src = img(site.logo);
}
async function loadEvents(){
  const [site, eventsData] = await Promise.all([getJSON('/content/site.json'), getJSON('/content/events.json')]);
  renderFixedStatus(site);
  $('pageLogo').src = img(site.logo);
  const params = new URLSearchParams(location.search);
  let selected = params.get('category') || 'All';
  const events = selected === 'All' ? eventsData.events : eventsData.events.filter(e => e.category === selected);
  $('eventFilters').innerHTML = ['All', ...eventsData.categories].map(c => `<a class="btn ${c===selected?'red':'light'}" href="/events.html${c==='All'?'':'?category='+encodeURIComponent(c)}">${esc(c)}</a>`).join('');
  $('eventsList').innerHTML = events.map(e => `<div class="feature-card"><img src="${esc(img(e.logo || e.image))}" alt="${esc(e.title)}"><div><h3>${esc(e.title)}</h3><p><b>${esc(e.category)} • ${esc(e.date)}</b></p><p>${esc(e.description || '')}</p><p>${esc(e.location || '')}</p><p><b>${esc(e.price || '')}</b></p></div><a class="btn red" href="${esc(e.register || '#')}" target="${(e.register||'').startsWith('http')?'_blank':'_self'}">Register</a></div>`).join('') || '<div class="card">No events posted for this category yet.</div>';
}
async function loadGallery(){
  const [site, galleryData] = await Promise.all([getJSON('/content/site.json'), getJSON('/content/gallery.json')]);
  renderFixedStatus(site);
  $('pageLogo').src = img(site.logo);
  $('galleryGrid').innerHTML = galleryData.gallery.map(g => `<img src="${esc(img(g.image))}" alt="${esc(g.title || 'Gallery photo')}">`).join('');
}
async function loadClubhouse(){
  const [site, club] = await Promise.all([getJSON('/content/site.json'), getJSON('/content/clubhouse.json')]);
  renderFixedStatus(site);
  $('pageLogo').src = img(site.logo);
  $('menuButton').href = club.menuUrl;
  $('clubIntro').textContent = club.intro;
  $('clubTagline').textContent = club.tagline;
  $('clubGrid').innerHTML = club.photos.map(p => `<div class="card"><img style="width:100%;height:260px;object-fit:cover;border-radius:14px" src="${esc(img(p.image))}" alt="${esc(p.caption)}"><h3>${esc(p.caption)}</h3></div>`).join('');
}
async function loadRentals(){
  const [site, rentals] = await Promise.all([getJSON('/content/site.json'), getJSON('/content/rentals.json')]);
  renderFixedStatus(site);
  $('pageLogo').src = img(site.logo);
  $('ratesList').innerHTML = rentals.rates.map(r => `<li>${esc(r)}</li>`).join('');
  if ($('typeDescriptions')) {
    $('typeDescriptions').innerHTML = (rentals.requestTypes || []).map(t => `<div class="type-help-item"><b>${esc(t.name)}</b><br>${esc(t.description)}</div>`).join('');
  }
}
async function loadSafety(){
  const [site, safety] = await Promise.all([getJSON('/content/site.json'), getJSON('/content/safety.json')]);
  renderFixedStatus(site);
  $('pageLogo').src = img(site.logo);
  $('waiverButton').href = safety.waiverUrl;
  $('safetyList').innerHTML = safety.safety.map(x=>`<p>${esc(x)}</p>`).join('');
  $('rulesList').innerHTML = safety.rules.map(x=>`<li>${esc(x)}</li>`).join('');
  if ($('rulesIntro')) $('rulesIntro').innerHTML = (safety.rulesIntro || []).map(x=>`<p>${esc(x)}</p>`).join('');
  $('insurance').textContent = safety.insurance;
  if ($('rosters')) $('rosters').textContent = safety.rosters || '';
  $('umpires').textContent = safety.umpires;
  $('equipment').textContent = safety.equipment;
  $('refundSummary').innerHTML = safety.refundSummary.map(x=>`<li>${esc(x)}</li>`).join('');
  $('refundDetails').textContent = safety.refundDetails;
}
