const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#site-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.focus()}});
const search=document.querySelector('#faq-search'),filters=[...document.querySelectorAll('[data-faq-filter]')],questions=[...document.querySelectorAll('.faq-item')];let category='All questions';
function filterFAQs(){const q=search.value.trim().toLowerCase();let count=0;questions.forEach(item=>{const show=(category==='All questions'||item.dataset.category===category)&&item.textContent.toLowerCase().includes(q);item.hidden=!show;if(show)count++});document.querySelector('#faq-count').textContent=`${count} ${count===1?'question':'questions'}`;document.querySelector('#faq-empty').hidden=count>0}
search?.addEventListener('input',filterFAQs);filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.faqFilter;filters.forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button))});filterFAQs()}));
const dialog=document.querySelector('#lightbox');let lastPhoto;
document.querySelectorAll('[data-lightbox]').forEach(button=>button.addEventListener('click',()=>{lastPhoto=button;const img=dialog.querySelector('img');img.src=button.dataset.lightbox;img.alt=button.dataset.caption;document.querySelector('#lightbox-caption').textContent=button.dataset.caption;dialog.showModal()}));
document.querySelector('.lightbox-close')?.addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});dialog?.addEventListener('close',()=>lastPhoto?.focus());
const form=document.querySelector('#inquiry-form');
if(form){const requested=new URLSearchParams(location.search).get('service');if(requested&&[...form.elements.service.options].some(o=>o.value===requested))form.elements.service.value=requested;}
if(form){const city=new URLSearchParams(location.search).get('city');if(city&&city.length<=100)form.elements.city.value=city}
const blogSearch=document.querySelector('#blog-search');
if(blogSearch){
 const blogCards=[...document.querySelectorAll('[data-blog-category]')],blogFilters=[...document.querySelectorAll('[data-blog-filter]')],more=document.querySelector('#blog-more');let blogCategory='All guides',limit=12;
 function updateBlog(){const query=blogSearch.value.trim().toLowerCase();const matches=blogCards.filter(card=>(blogCategory==='All guides'||card.dataset.blogCategory===blogCategory)&&card.textContent.toLowerCase().includes(query));const visible=new Set(matches.slice(0,limit));blogCards.forEach(card=>card.hidden=!visible.has(card));document.querySelector('#blog-count').textContent=`Showing ${Math.min(limit,matches.length)} of ${matches.length} ${matches.length===1?'guide':'guides'} · 300 words each`;document.querySelector('#blog-empty').hidden=matches.length>0;more.hidden=limit>=matches.length}
 blogSearch.addEventListener('input',()=>{limit=12;updateBlog()});blogFilters.forEach(button=>button.addEventListener('click',()=>{blogCategory=button.dataset.blogFilter;limit=12;blogFilters.forEach(other=>{other.classList.toggle('selected',other===button);other.setAttribute('aria-pressed',String(other===button))});updateBlog()}));more.addEventListener('click',()=>{limit+=12;updateBlog()});updateBlog();
}

const hero=document.querySelector('.hero');
if(hero){
 const slides=[...hero.querySelectorAll('.hero-slide')],dots=[...hero.querySelectorAll('[data-hero-slide]')],controls=hero.querySelector('.hero-controls'),pause=hero.querySelector('.hero-pause'),position=hero.querySelector('#hero-position');
 if(slides.length>1){
  let current=0,timer=null,paused=window.matchMedia('(prefers-reduced-motion: reduce)').matches,focused=false;
  function show(index){current=(index+slides.length)%slides.length;slides.forEach((slide,i)=>{slide.classList.toggle('active',i===current);slide.setAttribute('aria-hidden',String(i!==current))});dots.forEach((dot,i)=>{dot.classList.toggle('selected',i===current);dot.setAttribute('aria-pressed',String(i===current))});position.textContent=`${String(current+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;}
  function schedule(){if(timer)window.clearInterval(timer);timer=null;pause.textContent=paused?'Play':'Pause';pause.setAttribute('aria-label',paused?'Start image rotation':'Pause image rotation');if(!paused&&!focused&&!document.hidden)timer=window.setInterval(()=>show(current+1),6500);}
  controls.hidden=false;dots.forEach((dot,index)=>dot.addEventListener('click',()=>{show(index);schedule()}));pause.addEventListener('click',()=>{paused=!paused;schedule()});hero.addEventListener('focusin',()=>{focused=true;schedule()});hero.addEventListener('focusout',event=>{if(!hero.contains(event.relatedTarget)){focused=false;schedule()}});document.addEventListener('visibilitychange',schedule);schedule();
 }
}

const funnel=document.querySelector('#project-funnel');
if(funnel){
 const modal=document.querySelector('#project-finder'),openButton=document.querySelector('#funnel-open'),closeButton=document.querySelector('#funnel-close');
 if(modal&&openButton&&closeButton){
  openButton.addEventListener('click',()=>modal.showModal());
  document.querySelectorAll('.services-quick-estimate').forEach(button=>button.addEventListener('click',()=>modal.showModal()));
  closeButton.addEventListener('click',()=>modal.close());
  modal.addEventListener('click',event=>{if(event.target===modal)modal.close()});
 }
 funnel.hidden=false;
 const emailForm=document.querySelector('#funnel-email-form');
 const steps=[...funnel.querySelectorAll('.funnel-step')],result=funnel.querySelector('#funnel-result'),next=funnel.querySelector('#funnel-next'),back=funnel.querySelector('#funnel-back'),error=funnel.querySelector('#funnel-error'),progress=funnel.querySelector('#funnel-progress'),controls=funnel.querySelector('.funnel-controls');
 let step=0;
 function renderFunnel(focus=true){steps.forEach((el,i)=>el.hidden=i!==step);result.hidden=true;if(emailForm)emailForm.hidden=true;controls.hidden=false;progress.hidden=false;back.hidden=step===0;next.textContent=step===3?'Show my next steps →':'Continue →';progress.textContent=`Question ${step+1} of 4`;funnel.querySelector('.funnel-track span').style.width=`${(step+1)*25}%`;error.textContent='';if(focus)steps[step].querySelector('input').focus();}
 back.addEventListener('click',()=>{step=Math.max(0,step-1);renderFunnel()});
 funnel.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(funnel),key=['service','property','city','timing'][step],value=String(data.get(key)||'').trim();if(!value){error.textContent=step===2?'Please enter your project city.':'Please choose an option to continue.';steps[step].querySelector('input').focus();return;}if(step<3){step++;renderFunnel();return;}steps.forEach(el=>el.hidden=true);controls.hidden=true;progress.hidden=true;error.textContent='';result.hidden=false;if(emailForm){for(const key of ['service','property','city','timing'])emailForm.elements.namedItem(key).value=String(data.get(key)||'').trim();emailForm.hidden=false;}const summary=`Service: ${data.get('service')}\nProperty: ${data.get('property')}\nCity: ${String(data.get('city')).trim()}\nTiming: ${data.get('timing')}`;funnel.querySelector('#funnel-summary').textContent=summary;result.focus();});
 funnel.querySelector('#funnel-restart').addEventListener('click',()=>{step=0;renderFunnel()});renderFunnel(false);
}

/* Prevent sideways touch panning that exposes a narrow viewport edge on phones. */
if(window.matchMedia('(max-width: 900px) and (pointer: coarse)').matches){
 let startX=0,startY=0;
 document.addEventListener('touchstart',event=>{
  if(event.touches.length!==1)return;
  startX=event.touches[0].clientX;
  startY=event.touches[0].clientY;
 },{passive:true});
 document.addEventListener('touchmove',event=>{
  if(event.touches.length!==1||!event.cancelable)return;
  const dx=event.touches[0].clientX-startX;
  const dy=event.touches[0].clientY-startY;
  if(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.2)event.preventDefault();
 },{passive:false});
}
