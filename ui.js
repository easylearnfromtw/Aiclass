/* SIGNWELL AI CLASS — reading experience enhancements
 * Progressive enhancement only: no need for backend, no alteration to learner data.
 */
(function(){
'use strict';
var STORAGE='signwell_reader_preferences_v1';
var prefs={size:'medium',focus:false};
try{var raw=JSON.parse(localStorage.getItem(STORAGE)||'null');if(raw&&['small','medium','large'].includes(raw.size)){prefs.size=raw.size;prefs.focus=!!raw.focus}}catch(e){}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(prefs))}catch(e){}}
function readerParts(){return {layout:document.querySelector('.handout-reader-layout'),paper:document.querySelector('.handout-document'),sidebar:document.querySelector('.handout-sidebar')}}
function make(tag,cls,text){var el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el}
function applyPreferences(){
 var p=readerParts();if(!p.paper||!p.layout)return;
 p.paper.dataset.readerSize=prefs.size;
 p.layout.classList.toggle('reader-focus',prefs.focus);
 document.querySelectorAll('[data-reader-size]').forEach(function(btn){btn.setAttribute('aria-pressed',String(btn.dataset.readerSize===prefs.size))});
 var togg=document.querySelector('[data-reader-action="focus"]');if(togg){togg.textContent=prefs.focus?'退出專注閱讀':'切換專注閱讀';togg.setAttribute('aria-pressed',String(prefs.focus))}
 var back=document.querySelector('.reader-focus-actions');if(back)back.hidden=!prefs.focus;
}
function ensureProgress(){
 var bar=document.getElementById('reader-progress');if(!bar){bar=make('div','reader-progress');bar.id='reader-progress';bar.setAttribute('role','progressbar');bar.setAttribute('aria-label','講義閱讀位置');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax','100');bar.setAttribute('aria-valuenow','0');bar.appendChild(make('div','reader-progress-fill'));document.body.appendChild(bar)}
 return bar
}
function setup(){
 var p=readerParts(),bar=document.getElementById('reader-progress');
 if(!p.paper||!p.layout){if(bar)bar.hidden=true;return}
 bar=ensureProgress();bar.hidden=false;
 if(p.paper.dataset.readerEnhanced==='1'){applyPreferences();updateProgress();return}
 p.paper.dataset.readerEnhanced='1';
 var tocHeadings=Array.from(p.paper.querySelectorAll('.handout-markdown h2,.handout-markdown h3,.handout-markdown h4')).filter(function(h){return !!h.textContent.trim()});
 tocHeadings.forEach(function(h,i){h.id='reader-section-'+i});
 var first=p.sidebar&&p.sidebar.querySelector('.surface');
 if(first){
  var controls=make('div','reader-controls');
  controls.appendChild(make('span','reader-controls-title','閱讀設定 / READING'));
  var size=make('div','reader-typescale');
  [['small','A−'],['medium','A'],['large','A＋']].forEach(function(pair){
   var b=make('button','reader-control',pair[1]);b.type='button';b.dataset.readerSize=pair[0];b.setAttribute('aria-label',pair[0]==='small'?'縮小閱讀字級':pair[0]==='large'?'放大閱讀字級':'標準閱讀字級');size.appendChild(b)
  });
  controls.appendChild(size);
  var f=make('button','btn btn-wide btn-outline reader-focus-toggle','切換專注閱讀');f.type='button';f.dataset.readerAction='focus';controls.appendChild(f);
  first.appendChild(controls);
  if(tocHeadings.length){
   var toc=make('nav','reader-toc');toc.setAttribute('aria-label','講義章節導覽');toc.appendChild(make('strong','','本篇目錄 / CONTENTS'));
   tocHeadings.forEach(function(h){
    var b=make('button',h.tagName==='H2'?'':'toc-sub',h.textContent.trim());b.type='button';b.dataset.readerJump=h.id;toc.appendChild(b)
   });
   first.appendChild(toc)
  }
 }
 var actions=make('div','reader-focus-actions');
 var back=make('button','reader-focus-back','← 結束專注閱讀');back.type='button';back.dataset.readerAction='exit-focus';actions.appendChild(back);
 var meta=p.paper.querySelector('.handout-document-meta');if(meta)meta.insertAdjacentElement('afterend',actions);else p.paper.insertBefore(actions,p.paper.firstChild);
 applyPreferences();updateProgress()
}
function updateProgress(){
 var p=readerParts(),bar=document.getElementById('reader-progress');if(!p.paper||!bar||bar.hidden)return;
 var rect=p.paper.getBoundingClientRect(),screen=Math.max(1,window.innerHeight||700),total=Math.max(1,rect.height-screen*.62),completed=Math.max(0,-rect.top+screen*.28);
 var percent=Math.max(0,Math.min(100,Math.round(completed/total*100)));var fill=bar.querySelector('.reader-progress-fill');if(fill)fill.style.width=percent+'%';bar.setAttribute('aria-valuenow',String(percent))
}
function updateActive(){
 var p=readerParts();if(!p.paper)return;
 var hs=Array.from(p.paper.querySelectorAll('[id^="reader-section-"]'));if(!hs.length)return;
 var active=hs[0].id;hs.forEach(function(el){if(el.getBoundingClientRect().top<200)active=el.id});
 document.querySelectorAll('[data-reader-jump]').forEach(function(btn){btn.classList.toggle('toc-active',btn.dataset.readerJump===active)})
}
var raf=false;function onScroll(){if(raf)return;raf=true;requestAnimationFrame(function(){raf=false;updateProgress();updateActive()})}
document.addEventListener('click',function(e){
 var size=e.target.closest('[data-reader-size]');if(size){prefs.size=size.dataset.readerSize;persist();applyPreferences();return}
 var f=e.target.closest('[data-reader-action]');if(f){prefs.focus=f.dataset.readerAction==='focus'?!prefs.focus:false;persist();applyPreferences();return}
 var jump=e.target.closest('[data-reader-jump]');if(jump){var target=document.getElementById(jump.dataset.readerJump);if(target)target.scrollIntoView({behavior:window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}
});
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',onScroll,{passive:true});
var main=document.getElementById('main-content');
if(main&&typeof MutationObserver!=='undefined'){
 var observer=new MutationObserver(function(mutations){
  if(mutations.some(function(m){return m.target===main&&m.type==='childList'})){setup()}
 });
 observer.observe(main,{childList:true,subtree:false})
}
setup();
})();