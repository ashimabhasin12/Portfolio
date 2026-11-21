/* NEXUS / ASHIMA PORTFOLIO V3 — progressive, accessible enhancements */
(()=>{
  'use strict';
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canStore=()=>{try{return !!window.localStorage;}catch{return false;}};
  const notify=(msg)=>{const toast=$('#toast');if(!toast)return;toast.textContent=msg;toast.classList.add('visible');window.setTimeout(()=>toast.classList.remove('visible'),2600);};

  // Ambient, low-cost pointer-following light. Disabled for touch/reduced motion.
  if(!reduced && window.matchMedia('(pointer:fine)').matches){
    const orb=document.createElement('div');orb.className='ambient-orb';orb.setAttribute('aria-hidden','true');document.body.prepend(orb);
    let raf=0,x=innerWidth*.65,y=innerHeight*.35;
    document.addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;if(raf)return;raf=requestAnimationFrame(()=>{orb.style.setProperty('--mx',x+'px');orb.style.setProperty('--my',y+'px');raf=0;});},{passive:true});
  }

  // Entrance reveals become immediately visible if IntersectionObserver is absent.
  const targets=$$('.section-head,.project-card,.skill-cards article,.notes-grid article,.approach-grid > div,.case-content,.timeline article,.feature-bento > div,.resume-block,.cta-panel');
  if(!reduced&&'IntersectionObserver' in window){
    targets.forEach(el=>el.classList.add('reveal'));
    const observer=new IntersectionObserver((entries)=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}
    }),{threshold:.06,rootMargin:'0px 0px 50px 0px'});
    targets.forEach(el=>observer.observe(el));
  }

  // Client-side favorite projects; saved in local browser only.
  let favorites=[];
  if(canStore()){try{favorites=JSON.parse(localStorage.getItem('ab-saved-projects-v3')||'[]');if(!Array.isArray(favorites))favorites=[];}catch{favorites=[];}}
  const projectCards=$$('.project-card');
  const savedToggle=$('#savedOnly');const count=$('#projectCount');
  const query=$('#projectSearch');
  const persist=()=>{if(canStore())try{localStorage.setItem('ab-saved-projects-v3',JSON.stringify(favorites));}catch{}};
  const sync=()=>{
    projectCards.forEach(card=>{
      const btn=$('.project-fav',card);if(!btn)return;
      const isSaved=favorites.includes(card.getAttribute('href'));
      btn.setAttribute('aria-pressed',String(isSaved));btn.setAttribute('aria-label',isSaved?'Remove from saved projects':'Save project');btn.textContent=isSaved?'♥':'♡';
    });
    if(savedToggle?.getAttribute('aria-pressed')==='true'){
      projectCards.forEach(card=>{const show=favorites.includes(card.getAttribute('href'));card.classList.toggle('saved-hidden',!show);});
    }else projectCards.forEach(card=>card.classList.remove('saved-hidden'));
    const visible=projectCards.filter(card=>!card.hidden&&!card.classList.contains('saved-hidden')).length;
    if(count)count.textContent=`${visible} project${visible===1?'':'s'} shown · ${favorites.length} saved`;
    const empty=$('#emptyResults');if(empty)empty.hidden=visible>0;
  };
  projectCards.forEach(card=>{
    // Cards are anchors, so button is placed next to the card instead of nesting a button in a link.
    // We wrap card in a container to preserve valid interactive markup.
    const wrapper=document.createElement('div');wrapper.className='project-frame';wrapper.style.position='relative';
    card.parentNode.insertBefore(wrapper,card);wrapper.appendChild(card);
    const btn=document.createElement('button');btn.className='project-fav';btn.type='button';
    btn.addEventListener('click',()=>{const href=card.getAttribute('href');favorites=favorites.includes(href)?favorites.filter(x=>x!==href):[...favorites,href];persist();sync();notify(favorites.includes(href)?'Project saved to this browser':'Project removed from saved');});
    wrapper.appendChild(btn);
  });
  // Filter on container instead of anchor for correct grid layout.
  if(projectCards.length){
    const style=document.createElement('style');style.textContent='.project-frame{min-width:0}.project-frame .project-card{height:100%;display:block}.project-frame:has(.project-card[hidden]),.project-frame:has(.saved-hidden){display:none!important}';document.head.appendChild(style);
    // Observe existing filter implementation events after its own update.
    $$('.filter').forEach(el=>el.addEventListener('click',()=>queueMicrotask(sync)));
    query?.addEventListener('input',()=>queueMicrotask(sync));
    $('#resetFilters')?.addEventListener('click',()=>queueMicrotask(sync));
  }
  savedToggle?.addEventListener('click',()=>{const yes=savedToggle.getAttribute('aria-pressed')!=='true';savedToggle.setAttribute('aria-pressed',String(yes));savedToggle.textContent=yes?'♥ Viewing saved projects':'♡ Show saved projects';sync();});
  sync();

  // Deterministic browser-only demo: never claims to run real Rust / SQL backend.
  const out=$('#sqlLabOutput'),run=$('#sqlLabRun'),selector=$('#sqlLabQuery');
  if(out&&run&&selector){
    let created=false,rows=[];
    const show=(query,result)=>{out.textContent=`nexusdb-demo> ${query}\n\n${result}\n\n[SIMULATED OUTPUT — browser only]`;out.scrollTop=out.scrollHeight;};
    run.addEventListener('click',()=>{
      switch(selector.value){
        case 'create':created=true;rows=[];show('CREATE TABLE employees (id INT, name TEXT, salary INT);','OK · table employees created (temporary demo state)');break;
        case 'insert':if(!created){show("INSERT INTO employees VALUES (2, 'Jordan', 92000);",'ERROR · Create the employees table first.');break;}rows.push({id:rows.length+1,name:rows.length?'Alex':'Jordan',salary:rows.length?85000:92000});show('INSERT INTO employees VALUES (...);',`OK · 1 row inserted · ${rows.length} total row(s)`);break;
        case 'select':show('SELECT * FROM employees;',!created?'ERROR · Create the employees table first.':rows.length?'id | name   | salary\n'+rows.map(r=>`${String(r.id).padEnd(2)} | ${r.name.padEnd(6)} | ${r.salary}`).join('\n'):'0 rows returned. Insert a record first.');break;
        case 'where':show('SELECT * FROM employees WHERE salary > 90000;',!created?'ERROR · Create the employees table first.':(rows.filter(r=>r.salary>90000).map(r=>`${r.id} | ${r.name} | ${r.salary}`).join('\n')||'0 rows returned.'));break;
        case 'reset':created=false;rows=[];show('-- reset','Demo state cleared.');break;
      }
    });
  }
  $('#printResume')?.addEventListener('click',()=>window.print());

  // Lightweight reading time estimation for technical articles.
  const article=$('.article-content');
  if(article){
    const words=(article.textContent||'').trim().split(/\s+/).filter(Boolean).length;
    const meta=document.createElement('p');meta.className='site-stamp';meta.textContent=`ENGINEERING NOTE · ${Math.max(1,Math.ceil(words/210))} MIN READ`;
    article.prepend(meta);
  }
})();
