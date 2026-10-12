/* SIGNWELL AI CLASS · Learner Workspace V1.3
   All data comes from this browser. No invented scores, paid orders or credentials. */
(function(){
'use strict';
var PREF_KEY='signwell_dashboard_prefs_v1',ctx=null,rendered=false;
function prefs(){try{var o=JSON.parse(localStorage.getItem(PREF_KEY));return o&&typeof o==='object'?o:{target:5}}catch(e){return {target:5}}}
var config=prefs();
if(![3,5,7,10,14].includes(config.target))config.target=5;
function store(){try{localStorage.setItem(PREF_KEY,JSON.stringify(config))}catch(e){if(ctx&&ctx.notify)ctx.notify('無法儲存本機目標設定')}}
function e(s){return String(s==null?'':s).replace(/[&<>"']/g,function(t){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[t]})}
function n(x){var v=Number(x);return isFinite(v)?v:0}
function pct(a,b){return b>0?Math.max(0,Math.min(100,Math.round(a/b*100))):0}
function dateKey(value){var d=new Date(value);if(isNaN(d.getTime()))return null;return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function dayStart(value){var d=new Date(value);d.setHours(0,0,0,0);return d}
function addDays(d,days){var c=new Date(d);c.setDate(c.getDate()+days);return c}
function checkins(state){return Array.isArray(state.studyCheckins)?state.studyCheckins:[]}
function currentWeek(){var today=dayStart(new Date());var weekday=(today.getDay()+6)%7;return addDays(today,-weekday)}
function collectEvents(state,readAt){
 var items=[];
 (Array.isArray(state.attempts)?state.attempts:[]).forEach(function(a){if(a&&dateKey(a.date))items.push({day:dateKey(a.date),date:a.date,type:'quiz',label:'完成 AI 快速檢測'})});
 (Array.isArray(state.submissions)?state.submissions:[]).forEach(function(s){if(s&&dateKey(s.date))items.push({day:dateKey(s.date),date:s.date,type:'draft',label:'儲存實作任務草稿'})});
 var lessons=state.lessonReadAt&&typeof state.lessonReadAt==='object'?state.lessonReadAt:{};
 Object.keys(lessons).forEach(function(key){var v=lessons[key];if(dateKey(v)&&Array.isArray(state.completed)&&state.completed.includes(key))items.push({day:dateKey(v),date:v,type:'lesson',label:'完成課程章節'})});
 var handouts=readAt&&typeof readAt==='object'?readAt:{};
 Object.keys(handouts).forEach(function(key){var v=handouts[key];if(dateKey(v))items.push({day:dateKey(v),date:v,type:'handout',label:'完成講義閱讀'})});
 checkins(state).forEach(function(s){if(/^\d{4}-\d{2}-\d{2}$/.test(s))items.push({day:s,date:s+'T12:00:00',type:'checkin',label:'自主學習打卡'})});
 return items.filter(function(x){return x.day}).sort(function(a,b){return new Date(b.date)-new Date(a.date)})
}
function icon(type){return ({lesson:'▤',handout:'◫',quiz:'◎',draft:'✎',checkin:'✦'})[type]||'∙'}
function weeklyEvents(all){var start=dateKey(currentWeek()),end=dateKey(addDays(currentWeek(),7));return all.filter(function(x){return x.day>=start&&x.day<end})}
function daysChart(all){
 var start=currentWeek(),today=dateKey(new Date()),labels=['一','二','三','四','五','六','日'];
 return '<div class="sw-days" role="img" aria-label="本週每日學習活動">'+labels.map(function(label,i){
  var key=dateKey(addDays(start,i)),count=all.filter(function(x){return x.day===key}).length,cap=Math.max(1,Math.max.apply(null,labels.map(function(_,j){return all.filter(function(x){return x.day===dateKey(addDays(start,j))}).length}))),height=count?Math.max(15,Math.round(count/cap*100)):4;
  return '<div class="sw-day '+(key===today?'today':'')+'"><span class="sw-day-num">'+(count||'')+'</span><div class="sw-day-track"><div class="sw-day-bar '+(count?'active':'')+'" style="height:'+height+'%"></div></div><span class="sw-day-name">'+label+'</span></div>'
 }).join('')+'</div>'
}
function quizGraph(attempts){
 var list=attempts.slice(-6);
 if(!list.length)return '<div class="sw-empty sw-graph-empty"><span class="sw-empty-glyph">◌</span><strong>還沒有測驗歷史</strong><p>完成一份 AI Literacy 快速檢測後，這裡就會開始顯示你的實際答題成績。</p><a class="btn btn-sm btn-outline" href="#/exams">開始檢測 ↗</a></div>';
 var scores=list.map(function(a){return Math.max(0,Math.min(100,n(a.score)))});
 var latest=scores[scores.length-1];
 return '<div class="sw-graph-head"><span>最近 '+list.length+' 次結果</span><strong>'+latest+'<small> / 100</small></strong></div><div class="sw-quiz-chart" aria-label="最近測驗成績圖表">'+list.map(function(a,i){
 var score=scores[i],label=new Date(a.date).toLocaleDateString('zh-TW',{month:'numeric',day:'numeric'});
 return '<div class="sw-quiz-col" title="'+e(label)+'：'+score+' 分"><span>'+score+'</span><div class="sw-quiz-bar-wrap"><div class="sw-quiz-bar" style="height:'+Math.max(3,score)+'%"></div></div><small>#'+(attempts.length-list.length+i+1)+'</small></div>'
 }).join('')+'</div><p class="sw-mini-caption">每次均為 5 題示範測驗答對率，題目隨機抽選；分數不可當成正式能力認證或跨卷等值比較。</p>'
}
function coursePanel(courses,states){
 var chosen=courses.filter(function(c){return states.enrolled.includes(c.id)});
 if(!chosen.length){
 return '<div class="sw-empty"><span class="sw-empty-glyph">↗</span><strong>你的學習旅程尚未開始</strong><p>從 AI 素養或 Prompt 設計出發，加入一門課程，這裡就會顯示真實的章節完成進度。</p><div class="row flex-wrap"><a class="btn btn-dark btn-sm" href="#/course/ai-core">AI Literacy →</a><a class="btn btn-outline btn-sm" href="#/courses">探索所有課程</a></div></div>'}
 return '<div class="sw-course-list">'+chosen.map(function(c,i){var nDone=c.lessons.filter(function(_,j){return states.completed.includes(c.id+'_'+j)}).length,percent=pct(nDone,c.lessons.length);
 return '<a class="sw-course-row" href="#/course/'+e(c.id)+'"><span class="sw-course-initial" style="background:'+e(c.color||'#edf5db')+'">'+e(c.symbol||'AI')+'</span><span class="sw-course-info"><strong>'+e(c.title)+'</strong><small>'+nDone+' / '+c.lessons.length+' 個章節已完成</small><span class="sw-progress-track"><span style="width:'+percent+'%"></span></span></span><span class="sw-course-pct">'+percent+'% <span aria-hidden="true">↗</span></span></a>'
 }).join('')+'</div>'
}
function handoutPanel(summary){
 var total=n(summary.total),completed=n(summary.completed),fav=n(summary.favorites);
 return '<div class="sw-handout-stats"><div class="sw-handout-ring" style="--ring-progress:'+pct(completed,total)+'"><div><strong>'+pct(completed,total)+'%</strong><span>已讀比例</span></div></div><div class="sw-handout-detail"><div><span>已閱讀</span><strong>'+completed+' <small>/ '+total+' 份</small></strong></div><div><span>收藏講義</span><strong>'+fav+' <small>份</small></strong></div></div></div><p class="sw-mini-caption">以你在講義閱讀頁手動標記的已讀狀態計算。</p><a class="sw-text-link" href="#/handouts">開啟講義資料庫 <span>↗</span></a>'
}
function recommend(chosen,courses,handouts,attempts,drafts){
 if(!chosen.length)return {over:'從一門課開始',title:'AI Literacy：理解、練習、應用',desc:'建立生成式 AI 的基礎概念，再延伸到 Prompt 與工作流程。',href:'course/ai-core',cta:'加入第一門課'};
 var unfinished=chosen.find(function(c){return c.lessons.some(function(_,i){return !ctx.state.completed.includes(c.id+'_'+i)})});
 if(unfinished)return {over:'繼續你的課程',title:unfinished.title,desc:'接著完成下一個章節，把學習進度推進一步。',href:'course/'+unfinished.id,cta:'接續上課'};
 if(handouts.total>handouts.completed)return {over:'閱讀與整理',title:'從講義加深理解',desc:'已經完成課程章節，可以閱讀與回顧配套講義。',href:'handouts',cta:'查看講義'};
 if(!attempts.length)return {over:'知識檢測',title:'挑戰你的第一份快速測驗',desc:'透過示範題庫檢查基本概念，取得可回顧的練習結果。',href:'exams',cta:'開始測驗'};
 return {over:'邁向實作',title:'挑戰一個 AI 專題任務',desc:'以具體工作情境，把學到的知識整理成解決方案草稿。',href:'exams',cta:'探索實作挑戰'}
}
function dashboard(){
 var state=ctx.state,courses=ctx.courses,hand=ctx.handouts&&ctx.handouts.summary?ctx.handouts.summary():{total:0,completed:0,favorites:0,readAt:{}};
 var chosen=courses.filter(function(c){return state.enrolled.includes(c.id)}),lessonTotal=chosen.reduce(function(v,c){return v+c.lessons.length},0);
 var lessonDone=chosen.reduce(function(v,c){return v+c.lessons.filter(function(_,i){return state.completed.includes(c.id+'_'+i)}).length},0);
 var attempts=Array.isArray(state.attempts)?state.attempts:[],drafts=Array.isArray(state.submissions)?state.submissions:[];
 var last=attempts.length?attempts[attempts.length-1]:null,events=collectEvents(state,hand.readAt),thisWeek=weeklyEvents(events);
 var doneGoal=thisWeek.length,goal=config.target,goalPct=pct(doneGoal,goal),checked=checkins(state).includes(dateKey(new Date()));
 var next=recommend(chosen,courses,hand,attempts,drafts);
 var now=new Date(),dateLabel=now.toLocaleDateString('zh-TW',{year:'numeric',month:'long',day:'numeric',weekday:'long'});
 var weekStart=currentWeek(),dateRange=weekStart.toLocaleDateString('zh-TW',{month:'numeric',day:'numeric'})+' — '+addDays(weekStart,6).toLocaleDateString('zh-TW',{month:'numeric',day:'numeric'});
 var html='<section class="sw-dash-page"><div class="container">'+
 '<div class="sw-dash-intro"><div><span class="eyebrow">SIGNWELL / MY LEARNING</span><h1>把每一次學習，<br><em>變成看得見的成長。</em></h1><p>你的個人 AI 學習空間：課程、講義、測驗與實作，集中在同一個地方。</p></div><div class="sw-dash-date"><span class="sw-live-dot"></span> LOCAL LEARNING SPACE<small>'+e(dateLabel)+'</small></div></div>'+
 '<div class="sw-dash-disclaimer"><span>ℹ</span><div><strong>目前為可操作的學習原型</strong><p>資料僅儲存在這台裝置；無真實帳號、影片授課、正式能力認證或跨裝置同步。所有顯示的數據都來自本機實際操作，未使用假成長成績。</p></div></div>'+
 '<div class="sw-overview">'+
 '<div class="sw-metric"><span class="sw-metric-icon">▤</span><span class="sw-metric-label">正在學習的課程</span><strong>'+chosen.length+'<small> / '+courses.length+' 門示範</small></strong><p>已加入個人學習清單</p></div>'+
 '<div class="sw-metric"><span class="sw-metric-icon">◧</span><span class="sw-metric-label">課程章節完成度</span><strong>'+pct(lessonDone,lessonTotal)+'<small>%</small></strong><p>'+lessonDone+' / '+lessonTotal+' 個章節已完成</p></div>'+
 '<div class="sw-metric"><span class="sw-metric-icon">◫</span><span class="sw-metric-label">已讀講義</span><strong>'+n(hand.completed)+'<small> / '+n(hand.total)+' 份</small></strong><p>依手動已讀紀錄計算</p></div>'+
 '<div class="sw-metric"><span class="sw-metric-icon">◎</span><span class="sw-metric-label">最近一次快速檢測</span><strong>'+(last?Math.max(0,Math.min(100,n(last.score)))+'<small> 分</small>':'—')+'</strong><p>'+(last?'示範題庫 · 共 '+attempts.length+' 次':'尚未開始測驗')+'</p></div>'+
 '</div>'+
 '<div class="sw-dash-grid"><div class="sw-dash-main">'+
 '<section class="sw-panel sw-progress-panel" id="dashboard-journey"><div class="sw-panel-head"><div><span class="sw-section-kicker">01 / YOUR LEARNING PATH</span><h2>我的課程進度</h2></div><a class="sw-text-link" href="#/courses">探索課程 ↗</a></div>'+coursePanel(courses,state)+'</section>'+
 '<section class="sw-panel sw-activity-panel" id="dashboard-activity"><div class="sw-panel-head"><div><span class="sw-section-kicker">02 / LEARNING RHYTHM</span><h2>這週的學習節奏</h2></div><span class="sw-week-pill">'+e(dateRange)+'</span></div>'+
 '<div class="sw-week-count"><strong>'+doneGoal+'</strong><span>次已紀錄的學習活動</span></div>'+
 daysChart(thisWeek)+
 '<div class="sw-goal-meta"><div><strong>本週活動目標</strong><p>每完成章節、讀完講義、提交練習草稿、完成快測或自主打卡，記錄一次活動。</p></div><div class="sw-goal-control"><label for="sw-week-goal">每週目標</label><select id="sw-week-goal" class="form-select">'+[3,5,7,10,14].map(function(v){return '<option value="'+v+'" '+(goal===v?'selected':'')+'>'+v+' 次</option>'}).join('')+'</select></div></div>'+
 '<div class="sw-goal-track"><span style="width:'+goalPct+'%"></span></div><div class="sw-goal-bottom"><span>本週累計 '+doneGoal+' 次</span><span>'+Math.min(doneGoal,goal)+' / '+goal+'（'+goalPct+'%）</span></div>'+
 '<div class="sw-checkin-row"><div><strong>自主學習打卡</strong><p>'+(checked?'今天已紀錄自主學習':'如果今天有額外自主練習，可手動記錄一次。')+'</p></div><button class="btn '+(checked?'btn-outline':'btn-dark')+' btn-sm" data-dashboard-action="checkin" '+(checked?'disabled':'')+'>'+(checked?'✓ 今天已打卡':'＋ 今日學習打卡')+'</button></div>'+
 '<p class="sw-mini-caption">從本版開始記錄時間的章節及講義會計入週活動；較早建立、沒有日期的完成紀錄仍計入總進度，不會臆測所屬日期。打卡不是學習時間的證明。</p></section>'+
 '<section class="sw-panel" id="dashboard-assessment"><div class="sw-panel-head"><div><span class="sw-section-kicker">03 / ASSESSMENT TRACK</span><h2>我的測驗趨勢</h2></div><a class="sw-text-link" href="#/exams">開始測驗 ↗</a></div>'+quizGraph(attempts)+'</section>'+
 '<section class="sw-panel" id="dashboard-practice"><div class="sw-panel-head"><div><span class="sw-section-kicker">04 / HANDS-ON PRACTICE</span><h2>我的實作任務</h2></div><span class="sw-mini-tag">目前皆為本機草稿</span></div>'+
 (drafts.length?'<div class="sw-task-list">'+drafts.slice().reverse().slice(0,4).map(function(item){var ch=ctx.challenges.find(function(c){return c.id===item.id}),title=ch?ch.title:'實作任務';return '<div class="sw-task-item"><span class="sw-task-symbol">✎</span><div><strong>'+e(title)+'</strong><p>已在本機儲存草稿 · '+e(new Date(item.date).toLocaleDateString('zh-TW'))+' · 尚未正式評分</p></div><a href="#/challenge/'+e(item.id)+'" class="sw-task-arrow" aria-label="查看挑戰">↗</a></div>'}).join('')+'</div>':'<div class="sw-empty sw-task-empty"><span class="sw-empty-glyph">✎</span><strong>尚未開始實作挑戰</strong><p>你可以先建立第一份 AI 工作流程或設計任務的文字方案。</p><a class="btn btn-sm btn-outline" href="#/exams">探索實作任務 ↗</a></div>')+'</section>'+
 '</div><aside class="sw-dash-side">'+
 '<section class="sw-next-panel"><span class="sw-section-kicker">YOUR NEXT MOVE / 接下來</span><div class="sw-next-glyph">↗</div><span class="sw-next-overline">'+e(next.over)+'</span><h2>'+e(next.title)+'</h2><p>'+e(next.desc)+'</p><a class="btn btn-lime" href="#/'+e(next.href)+'">'+e(next.cta)+' →</a></section>'+
 '<section class="sw-panel sw-materials-panel"><div class="sw-panel-head"><div><span class="sw-section-kicker">STUDY MATERIALS</span><h2>講義閱讀</h2></div></div>'+handoutPanel(hand)+'</section>'+
 '<section class="sw-panel"><div class="sw-panel-head"><div><span class="sw-section-kicker">SHORTCUTS</span><h2>快捷工具</h2></div></div><div class="sw-shortcuts"><a href="#/handouts"><span>◫</span> 講義庫 <b>↗</b></a><a href="#/exams"><span>◎</span> 能力檢測 <b>↗</b></a><a href="#/mentors"><span>♧</span> 導師計畫 <b>↗</b></a><a href="#/certificates"><span>◇</span> 證書預覽 <b>↗</b></a></div></section>'+
 '<section class="sw-panel sw-events-panel"><div class="sw-panel-head"><div><span class="sw-section-kicker">RECENT RECORDS</span><h2>最新學習紀錄</h2></div></div>'+
 (events.length?'<div class="sw-event-list">'+events.slice(0,5).map(function(evt){return '<div class="sw-event"><span>'+icon(evt.type)+'</span><div><strong>'+e(evt.label)+'</strong><small>'+e(evt.day)+'</small></div></div>'}).join('')+'</div>':'<div class="sw-empty sw-events-empty"><p>目前尚無可依日期排列的學習事件。開始完成測驗或章節後，紀錄會出現在這裡。</p></div>')+'</section>'+
 '<section class="sw-data-settings"><span>DATA / PRIVACY</span><p>所有學習資料僅存在此瀏覽器。清除資料後無法復原。</p><button class="sw-reset-btn" data-action="reset">清除本機課程與測驗紀錄 ↗</button><p class="sw-mini-caption">講義筆記和已讀資料另存於講義系統，不受上述按鈕影響。</p></section>'+
 '</aside></div></div></section>';
 ctx.main(html);
}
document.addEventListener('change',function(evt){var select=evt.target.closest('#sw-week-goal');if(!select)return;var value=Number(select.value);if(![3,5,7,10,14].includes(value))return;config.target=value;store();if(ctx){dashboard();ctx.notify('已更新每週目標為 '+value+' 次')}});
document.addEventListener('click',function(evt){var b=evt.target.closest('[data-dashboard-action]');if(!b)return;if(b.dataset.dashboardAction==='checkin'){if(!ctx)return;var today=dateKey(new Date()),state=ctx.state;if(!Array.isArray(state.studyCheckins))state.studyCheckins=[];if(state.studyCheckins.includes(today))return;state.studyCheckins.push(today);ctx.save();dashboard();ctx.notify('今天的自主學習打卡已記錄在本機')}});
window.SWDashboard={render:function(c){ctx=c;dashboard()},resetPrefs:function(){config={target:5};store()}};
})();