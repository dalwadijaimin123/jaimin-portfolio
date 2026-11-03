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


// A real, safe GitHub showcase. Public data only; no tokens or keys needed.
(() => {
  'use strict';
  const USER = 'dalwadijaimin123';
  const $ = (id) => document.getElementById(id);
  const grid = $('repo-grid');
  if (!grid) return;
  const state = { repositories: [], query: '', language: 'all', sort: 'updated', visible: 6 };
  const FALLBACK_PROFILE = `https://github.com/${USER}?tab=repositories`;
  const languageColors = { JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#563d7c', Python: '#3572A5', Java: '#b07219', PHP: '#4F5D95', 'C++': '#f34b7d', Dart: '#00B4AB', Vue: '#41b883', Shell: '#89e051', Go: '#00ADD8' };

  function textNode(tag, content, cls) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    node.textContent = content;
    return node;
  }
  function safeWebURL(value) {
    try { const u = new URL(value); return u.protocol === 'https:' ? u.href : null; } catch (_) { return null; }
  }
  function link(label, url) {
    const a = textNode('a', label);
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    return a;
  }
  function card(repo) {
    const article = document.createElement('article');
    article.className = 'repo-card';
    const top = textNode('div', '', 'repo-card-top');
    top.append(textNode('span', '{ }', 'repo-icon'), textNode('span', 'PUBLIC REPOSITORY', 'repo-live'));
    const title = document.createElement('h3');
    const htmlURL = safeWebURL(repo.html_url) || FALLBACK_PROFILE;
    title.append(link(repo.name, htmlURL));
    article.append(top, title, textNode('p', repo.description || 'Explore this project, its source code, and development history on GitHub.'));
    const meta = textNode('div', '', 'repo-meta');
    if (repo.language) {
      const lang = textNode('span', repo.language, 'repo-lang');
      const dot = textNode('i', '', 'repo-lang-dot');
      dot.style.backgroundColor = languageColors[repo.language] || 'var(--accent)';
      lang.prepend(dot);meta.append(lang);
    }
    meta.append(textNode('span', `☆ ${repo.stargazers_count || 0}`), textNode('span', `⑂ ${repo.forks_count || 0}`));
    article.append(meta);
    const links = textNode('div', '', 'repo-links');
    links.append(link('Source code ↗', htmlURL));
    const site = safeWebURL(repo.homepage);
    if (site) links.append(link('Live demo ↗', site));
    article.append(links);
    return article;
  }
  function filtered() {
    const q = state.query.toLocaleLowerCase();
    return state.repositories.filter(r => (state.language === 'all' || r.language === state.language) && `${r.name} ${r.description || ''} ${r.language || ''} ${(r.topics || []).join(' ')}`.toLocaleLowerCase().includes(q))
      .sort((a,b) => state.sort === 'stars' ? (b.stargazers_count-a.stargazers_count || new Date(b.updated_at)-new Date(a.updated_at)) : state.sort === 'name' ? a.name.localeCompare(b.name) : new Date(b.updated_at)-new Date(a.updated_at));
  }
  function render() {
    const results = filtered();
    grid.replaceChildren(...results.slice(0,state.visible).map(card));
    $('repo-status').textContent = state.repositories.length ? `${results.length} ${results.length === 1 ? 'repository' : 'repositories'} found · GitHub public data` : 'No public repositories to display.';
    if (!results.length && state.repositories.length) grid.append(textNode('div', 'No repositories match these filters. Try a different search.', 'repo-error'));
    $('repo-more').hidden = results.length <= state.visible;
  }
  function languages() {
    const box = $('repo-languages');
    box.replaceChildren();
    const choices = ['all', ...new Set(state.repositories.map(repo => repo.language).filter(Boolean))].sort((a,b) => a==='all' ? -1 : b==='all' ? 1 : a.localeCompare(b));
    choices.forEach(lang => {
      const button = textNode('button', lang==='all' ? 'All languages' : lang, `repo-chip${lang === state.language ? ' active' : ''}`);
      button.type='button';button.dataset.language=lang;button.setAttribute('aria-pressed',String(lang===state.language));
      button.addEventListener('click', () => {state.language=lang;state.visible=6;languages();render();});
      box.append(button);
    });
  }
  async function fetchJSON(url, signal) {
    const response = await fetch(url, {headers:{Accept:'application/vnd.github+json'},signal});
    if (!response.ok) throw new Error(response.status === 403 || response.status === 429 ? 'GitHub API rate limit reached. Please try again later.' : `GitHub API returned ${response.status}.`);
    return response.json();
  }
  let controller;
  async function load() {
    if (controller) controller.abort();
    controller = new AbortController();
    const {signal} = controller;
    $('repo-refresh').disabled=true;
    $('repo-status').textContent = 'Fetching current repositories…';
    try {
      // GitHub allows up to 100 repositories per page. Fetch up to 3 pages to show more projects.
      const firstPage = await fetchJSON(`https://api.github.com/users/${USER}/repos?per_page=100&page=1&sort=updated&type=owner`,signal);
      if (!Array.isArray(firstPage)) throw new Error('Unexpected GitHub response.');
      let all = firstPage;
      // Additional pages only if the first page was full, limiting public API usage.
      if (firstPage.length === 100) {
        for (let page=2;page<=3;page++) {
          const next = await fetchJSON(`https://api.github.com/users/${USER}/repos?per_page=100&page=${page}&sort=updated&type=owner`,signal);
          all=all.concat(next);if(next.length<100)break;
        }
      }
      state.repositories = all.filter(r => r && !r.fork && !r.private && !r.archived && typeof r.name === 'string');
      state.visible=6;
      languages();render();
      try {
        const user = await fetchJSON(`https://api.github.com/users/${USER}`,signal);
        const followers = Number.isInteger(user.followers) ? `${user.followers} followers` : 'Public profile';
        $('github-summary').textContent = `${state.repositories.length} projects · ${followers}`;
        if (typeof user.avatar_url === 'string') {
          const avatarUrl = new URL(user.avatar_url);
          if (avatarUrl.protocol === 'https:' && avatarUrl.hostname === 'avatars.githubusercontent.com') {
            const img=document.createElement('img');img.src=avatarUrl.href;img.alt='';img.loading='lazy';$('github-avatar').replaceChildren(img);
          }
        }
      } catch (_) { $('github-summary').textContent = `${state.repositories.length} public projects`; }
    } catch(error) {
      if (signal.aborted) return;
      $('repo-status').textContent='GitHub projects are temporarily unavailable.';
      grid.replaceChildren();
      const msg=textNode('div', error.message || 'Unable to fetch repositories.', 'repo-error');
      msg.append(document.createTextNode(' '), link('Browse projects directly on GitHub ↗',FALLBACK_PROFILE));
      grid.append(msg);$('repo-more').hidden=true;
      $('github-summary').textContent='View GitHub profile ↗';
    } finally {if(!signal.aborted)$('repo-refresh').disabled=false;}
  }
  $('repo-search').addEventListener('input', e=>{state.query=e.target.value.trim();state.visible=6;render();});
  $('repo-sort').addEventListener('change', e=>{state.sort=e.target.value;state.visible=6;render();});
  $('repo-refresh').addEventListener('click',load);
  $('repo-more').addEventListener('click',()=>{state.visible+=6;render();});
  load();
})();
