(() => {
  'use strict';
  const data = window.PLUGINHUB_DATA || {site:{name:'PLUGBASE'},plugins:[]};
  const plugins = Array.isArray(data.plugins) ? data.plugins.filter(p => p && typeof p === 'object') : [];
  const site = data.site || {};
  const $ = (selector) => document.querySelector(selector);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  const cleanClass = (str) => ['violet','pink','cyan','orange','green'].includes(str) ? str : 'violet';
  const validLink = (value) => {
    try {
      if (typeof value !== 'string' || !value.trim() || /[\x00-\x1f]/.test(value)) return null;
      const url = new URL(value, window.location.href);
      if (!['https:', 'http:'].includes(url.protocol)) return null;
      return url.href;
    } catch { return null; }
  };
  const formatDate = v => {if (!v) return '–'; const d = new Date(v + 'T12:00:00'); return Number.isNaN(d.getTime()) ? '–' : d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'});};
  let activeCategory = 'Alle';
  let query = '';
  let sort = 'new';
  let toastTimer;
  const toasty = (msg) => {const t=$('#toast');t.textContent=msg;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),3200);};
  const cardHtml = p => {
    const color = cleanClass(p.color);
    const link = validLink(p.download);
    return `<article class="plugin-card color-${color}">
      <div class="plugin-card-head"><div class="plugin-icon" aria-hidden="true">${esc(p.icon || '🧩')}</div>${p.demo ? '<span class="plugin-badge demo">DEMO</span>' : p.featured ? '<span class="plugin-badge">✦ HIGHLIGHT</span>' : ''}</div>
      <h3>${esc(p.name || 'Unbenannt')}</h3><p>${esc(p.description || 'Keine Beschreibung vorhanden.')}</p>
      <div class="plugin-meta"><span class="meta-pill">${esc(p.category || 'Sonstiges')}</span><span class="meta-pill">${esc(p.platform || 'Weitere Infos ansehen')}</span></div>
      <div class="plugin-card-footer"><span class="plugin-version">Version ${esc(p.version || '–')}</span><div class="card-actions"><button type="button" class="details-btn" data-details="${esc(p.id)}">Details</button>${link ? `<a class="download-btn" href="${esc(link)}" data-download="${esc(p.id)}" rel="noopener" aria-label="${esc(p.name)} herunterladen">↓ Download</a>` : `<span class="download-btn" aria-disabled="true">Kein Download</span>`}</div></div>
    </article>`;
  };
  const categoryLabel = value => ({'Alle':'Alle Plugins','Tools':'Tools','Design':'Design','Integrationen':'Integrationen','Utilities':'Utilities','Sonstiges':'Sonstiges'}[value] || value);
  const filters = () => {
    const counts = new Map();
    plugins.forEach(p => counts.set(p.category || 'Sonstiges',(counts.get(p.category || 'Sonstiges')||0)+1));
    const categories = ['Alle',...counts.keys()];
    $('#category-filters').innerHTML=categories.map(c=>`<button type="button" class="filter-btn ${c===activeCategory?'active':''}" data-category="${esc(c)}" aria-pressed="${c===activeCategory}">${esc(categoryLabel(c))}<span class="filter-count">${c==='Alle'?plugins.length:counts.get(c)}</span></button>`).join('');
  };
  const render = () => {
    filters();
    const visible=plugins.filter(p=>{
      const text=[p.name,p.description,p.details,p.category,p.platform,...(Array.isArray(p.tags)?p.tags:[])].join(' ').toLocaleLowerCase('de-DE');
      return (activeCategory==='Alle' || (p.category||'Sonstiges')===activeCategory) && text.includes(query);
    }).sort((a,b)=> sort==='az' ? (a.name||'').localeCompare(b.name||'','de') : sort==='za' ? (b.name||'').localeCompare(a.name||'','de') : (b.updated||'').localeCompare(a.updated||''));
    $('#plugin-grid').innerHTML=visible.map(cardHtml).join('');
    $('#result-badge').textContent=visible.length+' '+(visible.length===1?'Ergebnis':'Ergebnisse');
    $('#empty-state').hidden=visible.length>0;
  };
  const showModal = id => {
    const p=plugins.find(p=>String(p.id)===String(id));if(!p)return;
    const link=validLink(p.download);
    $('#modal-content').innerHTML=`<div class="modal-heading color-${cleanClass(p.color)}"><span class="plugin-icon big" aria-hidden="true">${esc(p.icon||'🧩')}</span><div><h2 id="modal-title">${esc(p.name)}</h2><small>Version ${esc(p.version||'–')} · ${esc(p.category||'Sonstiges')}</small></div></div>
      ${p.demo?'<span class="plugin-badge demo">TESTDOWNLOAD · KEIN ECHTES PLUGIN</span>':''}
      <p class="modal-details">${esc(p.details||p.description||'Keine weiteren Informationen vorhanden.')}</p>
      <div class="modal-section-label">PLUGIN-INFORMATIONEN</div><div class="modal-facts"><div class="modal-fact"><small>Version</small><strong>${esc(p.version||'–')}</strong></div><div class="modal-fact"><small>Kategorie</small><strong>${esc(p.category||'Sonstiges')}</strong></div><div class="modal-fact"><small>Kompatibilität</small><strong>${esc(p.platform||'Nicht angegeben')}</strong></div><div class="modal-fact"><small>Letztes Update</small><strong>${formatDate(p.updated)}</strong></div></div>
      ${link ? `<a class="button button-primary modal-download" href="${esc(link)}" rel="noopener" data-download="${esc(p.id)}">↓ Jetzt herunterladen</a>` : '<p class="modal-details">Für dieses Plugin wurde noch kein Download-Link eingerichtet.</p>'}`;
    const modal=$('#plugin-modal');if(typeof modal.showModal==='function')modal.showModal();else modal.setAttribute('open','');
  };
  const init = () => {
    const brand=String(site.name||'PLUGBASE');
    document.title=brand+' – Plugin-Downloads';
    document.querySelectorAll('[data-site-name]').forEach(el=>el.textContent=brand);
    $('[data-eyebrow]').textContent=site.eyebrow||'DEIN PLUGIN-HUB';
    if(site.headline){const t=String(site.headline).split(/(?<=\.)\s+/);const h=$('#hero-title');h.textContent='';h.append(document.createTextNode(t[0]||''));if(t.length>1){h.append(document.createElement('br'));const span=document.createElement('span');span.textContent=t.slice(1).join(' ');h.append(span);}}
    $('#hero-description').textContent=site.description||'';
    $('#stat-plugins').textContent=plugins.length;
    $('#stat-categories').textContent=new Set(plugins.map(p=>p.category||'Sonstiges')).size;
    $('#year').textContent=new Date().getFullYear();
    $('#demo-banner').hidden=!plugins.some(p=>p.demo);
    if (site.contact && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.contact)) {const contact=$('#contact-link');contact.href='mailto:'+encodeURIComponent(site.contact);contact.hidden=false;}
    render();
    $('#search-input').addEventListener('input',e=>{query=e.target.value.trim().toLocaleLowerCase('de-DE');render();});
    $('#sort-select').addEventListener('change',e=>{sort=e.target.value;render();});
    $('#category-filters').addEventListener('click',e=>{const btn=e.target.closest('[data-category]');if(!btn)return;activeCategory=btn.dataset.category;render();});
    $('#plugin-grid').addEventListener('click',e=>{const details=e.target.closest('[data-details]');if(details)showModal(details.dataset.details);});
    $('#reset-filters').addEventListener('click',()=>{query='';activeCategory='Alle';$('#search-input').value='';render();});
    $('#modal-close').addEventListener('click',()=>$('#plugin-modal').close());
    $('#plugin-modal').addEventListener('click',e=>{if(e.target===$('#plugin-modal'))$('#plugin-modal').close();});
    document.addEventListener('click',e=>{const a=e.target.closest('[data-download]');if(a){const p=plugins.find(p=>String(p.id)===a.dataset.download);if(p)toasty('Download wird geöffnet: '+p.name);}});
  };
  document.addEventListener('DOMContentLoaded',init);
})();
