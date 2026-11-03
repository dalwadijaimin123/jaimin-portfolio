(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const header = $('#header');
  const progress = $('#progress');
  let scheduled = false;
  function updateScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${scrollable > 0 ? Math.min(100, window.scrollY / scrollable * 100) : 0}%`;
    scheduled = false;
  }
  window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }, {passive:true});
  window.addEventListener('resize', updateScroll); updateScroll();

  const menuButton = $('#menu-button');
  const nav = $('#nav');
  function closeMenu() { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open navigation'); }
  menuButton.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation'); });
  $$('#nav a').forEach(link => link.addEventListener('click',closeMenu));

  const themeButton = $('#theme-button');
  function setTheme(mode) { document.body.classList.toggle('light',mode === 'light'); $('#theme-symbol').textContent = mode === 'light' ? '☾' : '☼'; themeButton.setAttribute('aria-label',`Switch to ${mode === 'light' ? 'dark' : 'light'} theme`); document.querySelector('meta[name="theme-color"]').setAttribute('content',mode === 'light' ? '#f6f7f2' : '#0b0d12'); }
  let preferred = 'dark';
  try {preferred = localStorage.getItem('jaimin-theme-v2') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');} catch (_) {}
  setTheme(preferred);
  themeButton.addEventListener('click', () => { const next = document.body.classList.contains('light') ? 'dark' : 'light'; setTheme(next); try { localStorage.setItem('jaimin-theme-v2',next); } catch (_) {} });

  $$('.filter').forEach(button => button.addEventListener('click', () => {
    const value = button.dataset.filter;
    $$('.filter').forEach(item => { const active = item === button; item.classList.toggle('is-active',active); item.setAttribute('aria-pressed',String(active)); });
    $$('.work-card').forEach(card => { card.hidden = value !== 'all' && card.dataset.category !== value; });
  }));

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {if (entry.isIntersecting) {entry.target.classList.add('revealed');revealObserver.unobserve(entry.target);}}),{threshold:.07});
    $$('[data-reveal]').forEach(element => revealObserver.observe(element));
    const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {if (entry.isIntersecting) { $$('.nav a').forEach(link => link.classList.toggle('current',link.hash === '#'+entry.target.id)); }}),{rootMargin:'-25% 0px -65% 0px'});
    $$('main section[id]').forEach(section => navObserver.observe(section));
  } else { $$('[data-reveal]').forEach(element => element.classList.add('revealed')); }

  const projectData = {
    commerce: {title:'Form / Commerce',kicker:'02 / EDITORIAL STOREFRONT',description:'An exploratory direction for a minimal lifestyle-commerce experience, prioritizing generous space, tactile visual language and a clear path from discovery to product.',points:['Distinctive, product-led editorial layout','Responsive product cards and simplified navigation','Accessible buying flow and clear product information']},
    assistant: {title:'Workspace / AI',kicker:'03 / PRODUCT UI EXPLORATION',description:'An experimental interface direction for an AI-enabled workspace — balancing calm visuals, clear affordances and approachable workflows.',points:['Conversational entry point and reusable layout patterns','Focused dashboard with clear information hierarchy','Design direction for accessible, responsive interactions']}
  };
  const projectDialog = $('#project-dialog');
  $$('.project-open').forEach(button => button.addEventListener('click', () => {
    const info = projectData[button.dataset.project]; if (!info) return;
    $('#project-dialog-kicker').textContent = info.kicker; $('#project-dialog-title').textContent = info.title; $('#project-dialog-description').textContent = info.description;
    $('#project-dialog-points').replaceChildren(...info.points.map(point => { const li=document.createElement('li');li.textContent=point;return li;}));
    projectDialog.showModal();
  }));
  $('#project-close').addEventListener('click', () => projectDialog.close());
  projectDialog.addEventListener('click', event => {if (event.target === projectDialog) projectDialog.close();});

  const commandDialog = $('#command-dialog'); const commandInput = $('#command-input');
  function filterCommands() { const search = commandInput.value.trim().toLowerCase(); let count=0; $$('#command-list button').forEach(button => { const show=button.textContent.toLowerCase().includes(search);button.hidden=!show;if(show) count++; }); $('#command-empty').hidden=count>0; }
  function openCommands() { closeMenu();commandInput.value='';filterCommands();commandDialog.showModal();commandInput.focus(); }
  $('#command-trigger').addEventListener('click',openCommands);
  $('#command-close').addEventListener('click',()=>commandDialog.close());
  commandInput.addEventListener('input',filterCommands);
  commandInput.addEventListener('keydown', event => {if (event.key === 'Enter') { const first=$$('#command-list button').find(button=>!button.hidden);if(first)first.click(); }});
  $$('#command-list button').forEach(button=>button.addEventListener('click',()=>{commandDialog.close();if(button.dataset.target==='email'){location.href='mailto:jaimindalwadi5195@gmail.com';}else{$(button.dataset.target)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});history.replaceState(null,'',button.dataset.target);}}));
  commandDialog.addEventListener('click',event=>{if(event.target===commandDialog) commandDialog.close();});
  window.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(commandDialog.open)commandDialog.close();else openCommands();}if(event.key==='Escape')closeMenu();});

  let toastTimer;
  function toast(message) { const element=$('#toast');element.textContent=message;element.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>element.classList.remove('show'),2500); }
  $('#copy-email').addEventListener('click', async ()=>{try {await navigator.clipboard.writeText('jaimindalwadi5195@gmail.com');toast('Email copied to clipboard');}catch(_){toast('Copy unavailable — use the email link above');}});
  $('#contact-form').addEventListener('submit',event=>{
    event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
    const name=$('#contact-name').value.trim();const email=$('#contact-email').value.trim();const message=$('#contact-message').value.trim();
    if(!name||!email||!message){$('#form-feedback').textContent='Please fill in every field.';return;}
    const subject=encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body=encodeURIComponent(`Hello Jaimin,\n\n${message}\n\nFrom: ${name}\nReply to: ${email}`);
    $('#form-feedback').textContent='Your email app should open with a message ready to review and send.';
    location.href=`mailto:jaimindalwadi5195@gmail.com?subject=${subject}&body=${body}`;
  });
  $('#year').textContent=new Date().getFullYear();
})();
