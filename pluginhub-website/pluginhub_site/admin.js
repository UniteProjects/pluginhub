(() => {
  'use strict';
  const STORAGE_KEY = 'plugbase_editor_draft_v1';
  const published = window.PLUGINHUB_DATA || {site:{name:'PLUGBASE'},plugins:[]};
  const clone = obj => JSON.parse(JSON.stringify(obj));
  const $ = selector => document.querySelector(selector);
  let draft;
  try {const local=localStorage.getItem(STORAGE_KEY);draft=local?JSON.parse(local):clone(published);}catch{draft=clone(published);}
  if(!draft || !Array.isArray(draft.plugins) || typeof draft.site!=='object')draft=clone(published);
  let selectedId=draft.plugins[0]?.id||null;
  const form=$('#plugin-form');
  const persist=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(draft));}catch{}}
  const note=(text)=>{$('#save-note').textContent=text;};
  const clean=(v,max=1000)=>String(v??'').slice(0,max);
  const escapeHtml=(v)=>String(v??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  const getSelected=()=>draft.plugins.find(p=>p.id===selectedId);
  const setFields = p => {
    for(const field of form.querySelectorAll('[name]')) {
      if(field.type==='checkbox') field.checked=Boolean(p?.[field.name]);
      else if(field.name==='tags') field.value=(p?.tags||[]).join(', ');
      else field.value=p?.[field.name]||'';
    }
    const enabled=Boolean(p);
    form.querySelectorAll('input,select,textarea,button').forEach(el=>el.disabled=!enabled);
    $('#delete-plugin').disabled=!enabled;
    $('#editor-heading').textContent=p?.name||'Plugin auswählen';
    $('#save-note').textContent='';
  };
  const renderList = () => {
    $('#admin-count').textContent=draft.plugins.length;
    $('#admin-plugin-list').innerHTML=draft.plugins.length ? draft.plugins.map(p=>`<button class="admin-item ${p.id===selectedId?'selected':''}" type="button" data-id="${escapeHtml(p.id)}"><span class="admin-item-icon">${escapeHtml(p.icon||'🧩')}</span><span><strong>${escapeHtml(p.name||'Unbenanntes Plugin')}</strong><small>${escapeHtml(p.category||'Sonstiges')} · v${escapeHtml(p.version||'–')}${p.demo?' · Demo':''}</small></span></button>`).join('') : '<p class="modal-details">Noch keine Plugins vorhanden.</p>';
    $('#admin-plugin-list').querySelectorAll('[data-id]').forEach(el=>el.addEventListener('click',()=>select(el.dataset.id)));
  };
  const select = id => {selectedId=id;renderList();setFields(getSelected());};
  const updateFromForm = (announce) => {
    const p=getSelected();if(!p)return;
    const values=Object.fromEntries(new FormData(form).entries());
    Object.assign(p,{
      name:clean(values.name,70).trim(),version:clean(values.version,30).trim(),description:clean(values.description,210).trim(),details:clean(values.details,1500).trim(),
      category:clean(values.category,35),platform:clean(values.platform,80).trim(),icon:clean(values.icon,8).trim()||'🧩',
      color:clean(values.color,20),download:clean(values.download,1000).trim(),
      tags:clean(values.tags,300).split(',').map(s=>s.trim()).filter(Boolean).slice(0,10),updated:clean(values.updated,10),featured:form.elements.featured.checked,demo:false
    });
    persist();renderList();$('#editor-heading').textContent=p.name||'Neues Plugin';
    if(announce)note('✓ Lokal gespeichert – für die Veröffentlichung unten exportieren.');
  };
  const add = () => {
    const id='plugin-'+Date.now().toString(36)+'-'+Math.floor(Math.random()*10000).toString(36);
    const p={id,name:'Neues Plugin',description:'',details:'',version:'1.0.0',category:'Tools',platform:'',icon:'🧩',color:'violet',download:'',updated:new Date().toISOString().slice(0,10),tags:[],featured:false,demo:false};
    draft.plugins.unshift(p);persist();select(id);
    form.elements.name.focus();form.elements.name.select();
  };
  const loadSettings = () => {
    $('#site-name').value=draft.site.name||'PLUGBASE';
    $('#site-headline').value=draft.site.headline||'Kleine Plugins. Große Möglichkeiten.';
    $('#site-description').value=draft.site.description||'';
    $('#site-author').value=draft.site.author||'';
    $('#site-contact').value=draft.site.contact||'';
  };
  const updateSettings = () => {
    draft.site.name=clean($('#site-name').value,30).trim()||'PLUGBASE';
    draft.site.headline=clean($('#site-headline').value,110).trim()||'Kleine Plugins. Große Möglichkeiten.';
    draft.site.description=clean($('#site-description').value,240).trim();
    draft.site.author=clean($('#site-author').value,60).trim();
    draft.site.contact=clean($('#site-contact').value,200).trim();
    persist();
  };
  const download = (name, text) => {
    const blob=new Blob([text],{type:'text/javascript;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),5000);
  };
  const readImport = async file => {
    const content=await file.text();
    let json=content.trim();
    if(json.includes('window.PLUGINHUB_DATA')) {
      const position=json.indexOf('window.PLUGINHUB_DATA');
      json=json.slice(position).replace(/^window\.PLUGINHUB_DATA\s*=\s*/, '').replace(/;\s*$/, '');
    }
    const parsed=JSON.parse(json);
    if(!parsed || typeof parsed.site!=='object' || !Array.isArray(parsed.plugins))throw Error('Ungültiges Katalog-Format');
    for(const p of parsed.plugins){if(!p || typeof p!=='object' || typeof p.id!=='string')throw Error('Mindestens ein Plugin hat eine ungültige ID');}
    return parsed;
  };
  document.addEventListener('DOMContentLoaded',()=>{
    select(selectedId);loadSettings();
    $('#add-plugin').addEventListener('click',add);
    form.addEventListener('submit',e=>{e.preventDefault();if(form.reportValidity())updateFromForm(true);});
    form.addEventListener('change',()=>updateFromForm(false));
    form.addEventListener('input',()=>{note('Noch nicht veröffentlicht – Entwurf wird lokal gespeichert.');updateFromForm(false);});
    $('#delete-plugin').addEventListener('click',()=>{
      const p=getSelected();if(!p)return;
      if(!window.confirm('„'+p.name+'“ wirklich aus deinem Entwurf entfernen?'))return;
      draft.plugins=draft.plugins.filter(i=>i.id!==selectedId);selectedId=draft.plugins[0]?.id||null;persist();select(selectedId);
    });
    $('#clear-demo').addEventListener('click',()=>{
      if(!draft.plugins.some(p=>p.demo))return;
      if(!window.confirm('Alle Demo-Plugins aus dem lokalen Entwurf löschen?'))return;
      draft.plugins=draft.plugins.filter(p=>!p.demo);selectedId=draft.plugins[0]?.id||null;persist();select(selectedId);
    });
    $('#file-picker').addEventListener('change',e=>{
      const file=e.target.files?.[0];if(!file)return;
      form.elements.download.value=file.name;
      updateFromForm(true);
      window.alert('Dateiname übernommen: '+file.name+'\n\nWichtig: Die Datei wurde NICHT hochgeladen. Lade sie zusätzlich in dein GitHub-Repository hoch oder verwende einen Releases-Link.');
      e.target.value='';
    });
    ['#site-name','#site-headline','#site-description','#site-author','#site-contact'].forEach(sel=>$(sel).addEventListener('input',updateSettings));
    $('#export-btn').addEventListener('click',()=>{
      updateSettings();
      const broken=draft.plugins.filter(p=>!p.name?.trim()||!p.download?.trim());
      if(broken.length){window.alert('Bitte ergänze bei allen Plugins Namen und Download-Link/Dateiname. Unvollständige Einträge: '+broken.length);return;}
      const output='/* Katalog-Datei, erzeugt mit dem PLUGBASE-Editor. */\nwindow.PLUGINHUB_DATA = '+JSON.stringify(draft,null,2)+';\n';
      download('plugins.js',output);
      $('#publish-status').textContent='✓ plugins.js heruntergeladen. Ersetze jetzt die bisherige Datei auf GitHub und lade deine Plugin-Dateien separat hoch.';
    });
    $('#import-btn').addEventListener('click',()=>$('#import-file').click());
    $('#import-file').addEventListener('change',async e=>{
      const file=e.target.files?.[0];if(!file)return;
      try{draft=await readImport(file);selectedId=draft.plugins[0]?.id||null;persist();select(selectedId);loadSettings();$('#publish-status').textContent='✓ Import erfolgreich. Änderungen können jetzt weiterbearbeitet werden.';}
      catch(error){window.alert('Import fehlgeschlagen: '+error.message+'\nBitte verwende eine plugins.js aus diesem Projekt.');}
      e.target.value='';
    });
    $('#reset-btn').addEventListener('click',()=>{
      if(!window.confirm('Deinen lokalen Entwurf verwerfen und den veröffentlichten Katalog neu laden?'))return;
      draft=clone(published);selectedId=draft.plugins[0]?.id||null;persist();select(selectedId);loadSettings();$('#publish-status').textContent='Entwurf wurde auf die momentan geladene plugins.js zurückgesetzt.';
    });
  });
})();
