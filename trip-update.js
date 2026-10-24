/* Tokyo Trips V9 · 25 Oct 2026. Non-destructive extension of the published V8 planner. */
(() => {
'use strict';
const legacy={activeDay,segments,dayHTML,overviewHTML,render,saveState,mapModel,drawOverlay,updateStatus,loadCurrentPaths,refit,mealCard,cafeCard,mealsHTML,cafesHTML,focusPoint};
const original=Object.fromEntries(DAYS.map(d=>[d.id,structuredClone(d)]));
const pointRows=[
 ['kamakura','鎌倉駅','Kamakura Station',35.3191,139.5503,'Kamakura Station East Exit'],
 ['jomyoji','浄明寺バス停','Jomyoji bus stop',35.3213,139.5681,'Jomyoji bus stop Kamakura'],
 ['hokokuji','報国寺','Hokokuji bamboo temple',35.3195,139.5694,'Hokokuji 2-7-4 Jomyoji Kamakura'],
 ['hachimangu','鶴岡八幡宮','Tsurugaoka Hachimangu',35.3258,139.5564,'Tsurugaoka Hachimangu Kamakura'],
 ['wakamiya','若宮大路','Wakamiya-oji approach',35.3216,139.5533,'Wakamiya Oji Kamakura'],
 ['giraffa','Giraffa 小町通り','Curry cheese bread',35.3203,139.5517,'Giraffa 2-2-21 Komachi Kamakura'],
 ['chacha','鎌倉茶々 小町通り店','Kamakura ChaCha',35.3200,139.5513,'Kamakura Chacha 1-6-14 Komachi'],
 ['yuigahama','由比ヶ浜駅','Yuigahama Station',35.3118,139.5412,'Yuigahama Station'],
 ['matsubara','鎌倉 松原庵 本店','Matsubara-an soba',35.3109,139.5425,'Kamakura Matsubara-an 4-10-3 Yuigahama'],
 ['inamurasta','稲村ヶ崎駅','Inamuragasaki Station',35.3046,139.5231,'Inamuragasaki Station'],
 ['inamura','稲村ヶ崎 海浜公園','Inamuragasaki coastal lookout',35.3016,139.5232,'Kamakura Seaside Park Inamuragasaki'],
 ['asakusasta','浅草駅 東武・メトロ側','Asakusa station area',35.7112,139.7985,'Asakusa Station Tobu'],
 ['asakusaeast','馬道通り・東側の道','Eastern approach waypoint',35.7135,139.7984,'35.7135,139.7984'],
 ['nitenmon','二天門','Nitenmon east gate',35.7151,139.7975,'Nitenmon Gate Sensoji'],
 ['sensoji','浅草寺 本堂','Senso-ji main hall',35.7148,139.7967,'Sensoji Temple main hall'],
 ['sumida','隅田公園 浅草側','Sumida riverside walk',35.7139,139.8013,'Sumida Park Taito Tokyo'],
 ['hatoya','八十八浅草','Hatoya matcha · not Coffee Hatoya',35.7173,139.8005,'八十八浅草 東京都台東区花川戸2-14-3'],
 ['suzukien','壽々喜園 浅草本店','Suzukien matcha gelato',35.7173,139.7966,'Suzukien 3-4-3 Asakusa'],
 ['ichinoya','黒毛和牛一の屋 浅草店','Ichinoya wagyu steak rice',35.7131,139.7982,'黒毛和牛一の屋 浅草1-34-6'],
 ['daimon','大門駅','Daimon Station',35.6568,139.7547,'Daimon Station Tokyo'],
 ['zojoji','増上寺','Zojo-ji · Tokyo Tower view',35.6574,139.7483,'Zojoji Temple Tokyo'],
 ['harajuku','原宿駅','Harajuku Station',35.6702,139.7027,'Harajuku Station'],
 ['moffu','moffu 竹下通り店','Samoyed café · Takeshita branch',35.6713,139.7057,'Samoyed Cafe moffu Takeshita Street 1-6-9 Jingumae 2F'],
 ['kevelos','KEVELOS 明治神宮前','Pizza lunch',35.6667,139.7068,'PIZZA KEVELOS 6-12-4 Jingumae'],
 ['harakado','東急プラザ ハラカド','Tokyu Plaza Harakado',35.6687,139.7059,'Tokyu Plaza Harajuku Harakado'],
 ['omokado','東急プラザ オモカド','Tokyu Plaza Omokado',35.6693,139.7066,'Tokyu Plaza Omotesando Omokado'],
 ['catstreet','キャットストリート','Cat Street toward Shibuya',35.6654,139.7045,'Cat Street Jingumae Tokyo']
];
for(const [id,jp,en,lat,lon,query] of pointRows)P[id]={jp,en,lat,lon,query,note:'Planning pin is approximate. Use the named place / directions link for its current entrance. Check opening and access before travel.'};
for(const id of ['giraffa','matsubara','ichinoya','kevelos'])P[id].kind='meal';
for(const id of ['moffu','chacha','hatoya','suzukien'])P[id].kind='cafe';
const sources={
 hokokuji:['Hokokuji · official visiting information','https://houkokuji.or.jp/guide/'],
 kamakura:['Kamakura tourism · Hokokuji access','https://visit.trip-kamakura.com/things-to-do/hokokuji-temple/'],
 matsubara:['Matsubara-an · main restaurant','https://matsubara-an.com/shops/kamakura.php'],
 giraffa:['Giraffa · shop locations','https://giraffacurrypan.jp/shop/'],
 chacha:['Kamakura ChaCha · branches','https://kamakura-chacha.com/store/'],
 sensoji:['Senso-ji · Nitenmon east gate','https://www.senso-ji.jp/guide/guide11.html'],
 hatoya:['Hatoya Asakusa · address listing','https://tabelog.com/tokyo/A1323/A132301/13280896/'],
 suzukien:['Suzukien · official site','https://www.suzukien.tokyo/'],
 ichinoya:['Ichinoya · wagyu steak-rice branch listing','https://s.tabelog.com/en/tokyo/A1311/A131102/13279005/'],
 kevelos:['KEVELOS · official hours & dinner bookings','https://www.kevelos.com/ja/'],
 moffu:['moffu Takeshita · official booking page','https://www.tablecheck.com/en/shops/moffu-takeshitastreet/reserve'],
 harakado:['Tokyu Plaza Harakado · official site','https://www.tokyu-plaza.com/harakado/'],
 omokado:['Tokyu Plaza Omokado · official site','https://www.tokyu-plaza.com/omokado/'],
 zojoji:['Zojo-ji · official site','https://www.zojoji.or.jp/en/']
};
const info={
 hokokuji:['Bamboo + tea, before the busy part of the day.','Officially 09:00–16:00; tea reception ends 15:30. Weather can affect access. Treat the garden as one visit, not a timed booking.',['hokokuji','kamakura']],
 matsubara:['Your soba anchor in Yuigahama.','Use the main restaurant at 4-10-3 Yuigahama, not the Koshigoe branch. The official page lists 11:00–21:30. Keep lunch flexible; this planner has not reserved a table.',['matsubara']],
 giraffa:['Curry cheese bread · optional food detour.','This is a short Komachi Street visit, not a requirement to walk the entire shopping street. Skip a queue rather than sacrificing the coast.',['giraffa']],
 chacha:['Matcha stop · choose by appetite.','The plotted branch is Komachi 1-6-14. A separate option from tea inside Hokokuji; no need to have both.',['chacha']],
 inamura:['A coast finish, only when the weather is worth it.','Aim to be by the coast around 15:45; allow for early December dusk. This is a planning target, not a live sunset or weather prediction. Fuji visibility is not promised.',[]],
 hatoya:['八十八浅草 · the matcha shop from the list.','Address: Hanakawado 2-14-3. Do not confuse it with the unrelated Coffee Hatoya. Choose one matcha stop unless you actively want both.',['hatoya']],
 suzukien:['Seven-level matcha gelato · optional.','North of the temple, at Asakusa 3-4-3. Check the current opening time before waiting for it.',['suzukien']],
 ichinoya:['Wagyu steak rice · optional lunch.','Pin / named link use the steak-rice branch at Asakusa 1-34-6, not the different sukiyaki branch at 1-32-13. This and Meiji lunch are alternatives, not two lunches.',['ichinoya']],
 moffu:['Samoyed café · wanted, but not booked.','Takeshita Street branch, Jingumae 1-6-9, 2F. Fit the route around the session actually available. The booking page opens 30 days ahead and warns of non-refundable prepaid bookings. No booking has been made.',['moffu']],
 kevelos:['Pizza is this route’s lunch, replacing 瑞兆.','Jingumae 6-12-4. Published weekday lunch 11:30–14:30; dinner 18:00–21:30. Official reservations are dinner-only. Order the café and lunch around real availability.',['kevelos']],
 harakado:['Lower priority · optional rooftop / shops.','One of two Tokyu Plaza buildings at the junction. The original post did not identify which one. Choose this OR Omokado; neither is compulsory.',['harakado']],
 omokado:['Lower priority · alternative Tokyu Plaza.','The Omotesando building across the junction. Kept separate from Harakado so the pins and route do not imply they are the same place.',['omokado']],
 zojoji:['Optional temple / Tokyo Tower view.','This adds a train hop plus a walk; it is not next door to Asakusa or Monzen-Nakacho. Use on Dec 7 OR Dec 9, not automatically both.',['zojoji']]
};
const choices={
 '05':[['plan','Shinjuku · existing plan']],
 '06':[['plan','Yokohama · revised plan'],['western','Kichijoji + Inokashira + Koenji · alternative']],
 '07':[['plan','Kiyosumi → Monzen-Nakacho · existing plan']],
 '08':[['plan','Kamakura · bamboo, soba + coast'],['short','Kamakura · temples + soba, no coast']],
 '09':[['plan','Asakusa · east approach + riverside'],['meiji','Meiji lunch + optional books · alternative'],['free','Keep the day completely free']],
 '11':[['plan','Harajuku pizza + dogs → Shibuya'],['shibuya','Original 瑞兆 + Shibuya meal day']]
};
const defaults={
 '05':{koenji:false},'06':{chinatown:false,pancakes:false,yuei:false},'07':{zojoji:false},
 '08':{giraffa:false,chacha:false},'09':{matcha:'none',ichinoya:false,zojoji:false,books:false,tamtam:false},
 '11':{dogs:true,plaza:'none',long:false}
};
const opts={
 '05':[['koenji','Koenji evening extension','Extra train hop + a short PAL shopping-street loop; about 1–2 hours set aside.']],
 '06':[['chinatown','Chinatown food detour','Sunday may be busy. Off by default; the waterfront remains the main outing.','plan'],['pancakes','Kichijoji fluffy pancakes','Only on the western-Tokyo alternative. A brunch or dessert, not a compulsory extra meal.','western'],['yuei','遊泳 lunch alternative','Use only after checking the booking arrangement. Switches to Koenji first, then Kichijoji.','western']],
 '07':[['zojoji','Zojo-ji / Tokyo Tower-view extension','Rail transfer + temple stroll; allow roughly 1½–2½ extra hours. Replaces the optional Nihombashi finish.']],
 '08':[['giraffa','Giraffa curry cheese bread','Short Komachi Street detour. Queue time is unknown; skip it to protect the coast.'],['chacha','Kamakura ChaCha matcha','Another short food stop near the station, not another full neighborhood.']],
 '09':[['matcha','Matcha choice','Pick one or neither. The route changes to the actual shop area.','plan',[['none','No matcha stop'],['hatoya','八十八浅草 / Hatoya'],['suzukien','壽々喜園 / Suzukien'],['both','Both · extra stop']]],['ichinoya','Ichinoya wagyu lunch','An optional lunch after the temple, not an additional Meiji lunch.','plan'],['zojoji','Zojo-ji / Tokyo Tower view','Requires transit across the city. Leave the afternoon free instead when tired.','plan'],['books','Jimbocho bookshop walk','Extend only around Ochanomizu / Jimbocho; no Asakusa lunch in this version.','meiji'],['tamtam','TAM TAM later dessert','After the cafeteria, not a second brunch.','meiji']],
 '11':[['dogs','Samoyed café moffu','Wanted option; this checkbox does not reserve a session. Uses the Takeshita Street branch.','plan'],['plaza','Tokyu Plaza · low priority','Optional building / rooftop stop. The post did not distinguish the two buildings.','plan',[['none','Skip both'],['harakado','Harakado'],['omokado','Omokado']]],['long','Daikanyama → Nakameguro extension','Longer walk, then train back for the Shibuya dinner. Drop this before rushing a café booking.','plan']]
};
let prefs={variants:{},extras:{},view:'selected'};
function accept(raw){if(!raw||typeof raw!=='object')return;for(const id of Object.keys(choices)){const v=raw.variants?.[id];if(choices[id].some(x=>x[0]===v))prefs.variants[id]=v;for(const def of opts[id]||[]){const k=def[0],value=raw.extras?.[id]?.[k];if((def[4]&&def[4].some(x=>x[0]===value))||(!def[4]&&typeof value==='boolean'))(prefs.extras[id]??={})[k]=value;}}if(['selected','compare','reference'].includes(raw.view))prefs.view=raw.view;}
try{accept(JSON.parse(localStorage.getItem('tokyoTripOptionsV9')||'null'));}catch{}
const incoming=new URLSearchParams(location.hash.slice(1));try{if(incoming.has('plan'))accept(JSON.parse(incoming.get('plan')));}catch{}
if(incoming.get('day')==='options'||incoming.get('day')==='overview')state.day=incoming.get('day');
else if(!incoming.has('day'))state.day='overview';
function variant(id=state.day){return prefs.variants[id]||'plan';}
function flags(id=state.day){return {...defaults[id],...prefs.extras[id]};}
const walk=(ids,title,note='')=>({mode:'walking',ids,title,note});
const train=(ids,title,note='',transport='train')=>({mode:'transit',transport,ids,title,note});
const copied=s=>s.map(x=>({...x,ids:[...x.ids]}));
function access(start,minutes,text){return Object.fromEntries(['nih','yot'].map(b=>[b,{time:minutes,text,nodes:[b,start]}]));}
const metadata={
 '06':{...original['08'],id:'06',dow:'Sun 日',jp:'横浜・海辺の散歩',en:'Yokohama · moved from Tuesday',tip:'Keep the waterfront at your pace. Chinatown is optional. The old Sunday western-Tokyo route survives as an alternative, not another obligation.'},
 '08':{id:'08',dow:'Tue 火',jp:'鎌倉・竹林と海',en:'Kamakura · bamboo, soba and a coastal finish',type:'Day trip · Kanagawa',desc:'A weekday Kamakura day, separate from Yokohama. Bus for the eastern temple area, Enoden for the coast, with walks in between.',walk:'Several short walks; no all-day walking quota',duration:'Full day · early start suggested',segments:[],access:access('kamakura','About 80–110 min · planning allowance','Use a current JR route to Kamakura. From Nihombashi, Shin-Nihombashi / Tokyo and the Yokosuka Line are useful; from Yotsuya, check a connection via Tokyo or Shinjuku. Times are not a timetable.'),return:'kamakura',returnText:'Return via Kamakura to your same Tokyo hotel. Check the next actual service.',tip:'Plan the bamboo visit first. Coast target: around 15:45, before early December dusk. Choose the shorter route for poor weather or tired legs. CREMIA is an opportunistic snack, not a scheduled detour.',sources:[]},
 '09':{id:'09',dow:'Wed 水',jp:'浅草・東側からゆっくり',en:'Asakusa · eastern approach, temple and river',type:'Flexible half-day · inner Tokyo',desc:'Enter through Nitenmon from the east rather than making Kaminarimon / Nakamise the main approach. No route guarantees an empty temple. Food and the afternoon are optional.',walk:'A short local loop, plus selected extras',duration:'Half-day by default',segments:[],access:access('asakusasta','About 25–45 min · planning allowance','Take a current transit route to the Tobu / Metro Asakusa area. Follow the eastern approach waypoints; this is not the Tsukuba Express station.'),return:'asakusasta',returnText:'Return from Asakusa, or stop whenever you have had enough. Keep the rest of the day open.',tip:'Suggested temple arrival around 08:30–09:00. Shop opening times may be later. The afternoon does not need another district.',sources:[]},
 '11':{...original['11'],jp:'原宿ピザ・犬カフェ → 渋谷',en:'Harajuku pizza + Samoyeds, then Shibuya',type:'Inner Tokyo · food-first choices',desc:'KEVELOS is the lunch anchor. Add the wanted Samoyed session when a suitable booking is available; Tokyu Plaza stays low priority. The original 瑞兆 plan is an alternative, not a second lunch.',walk:'Local walks; the Meguro-area extension is optional',duration:'Lunch + afternoon / evening',access:access('harajuku','About 35–55 min · planning allowance','Take a current rail / Metro route to Harajuku or Meiji-jingumae. Arrange the café and KEVELOS around real session availability; the map shows geographic order, not a reservation schedule.'),return:'shibuya',returnText:'Return from Shibuya to the same hotel. The optional longer walk includes a train back before the existing 華火 dinner.',tip:'Do not queue for 瑞兆 as well as planning a KEVELOS lunch. Compare the two versions instead. Keep time for the dog café and shorten shopping or the longer walk first.',sources:[],meals:[]}
};
for(const [id,m]of Object.entries(metadata))Object.assign(DAYS.find(d=>d.id===id),m);
function daySpec(id=state.day,v=variant(id),f=flags(id)){
 let d=metadata[id]?structuredClone(metadata[id]):legacy.activeDay();if(!d)return d;
 if(id==='06'&&v==='western'){d=structuredClone(original['06']);d.en='Optional replacement · not a second Sunday';d.jp='吉祥寺・井の頭・高円寺（代案）';d.tip='A replacement for Yokohama, not a squeeze-in. Keep this as a spare half/full-day idea. Nothing here is booked.';if(f.yuei){d.access=original['06'].mealAlternative.access;d.return='kichijoji';}}
 if(id==='08'&&v==='short'){d.jp='鎌倉・竹林と蕎麦（短め）';d.en='Shorter Kamakura · no coastal sunset';d.duration='Temples + lunch; return earlier';}
 if(id==='09'&&v==='meiji'){d={...structuredClone(original['09']),jp:'明治大学ランチ・神保町（代案）',en:'Alternative · Meiji cafeteria and optional books',type:'Alternative half-day',desc:'The preserved cafeteria idea replaces Asakusa in this preview. Check the university reopening and public access before travel.',walk:'Short Ochanomizu / Jimbocho walks',duration:'Lunch, with optional books / dessert',access:access('ochanomizu','About 20–35 min · planning allowance','Travel to Ochanomizu, then walk to Liberty Tower. The route stops at the building entrance, not an indoor lift or cafeteria table.'),return:f.books||f.tamtam?'jim':'ochanomizu',returnText:'Return from Jimbocho or Ochanomizu; no need to add Asakusa on top.',tip:'The original planner records a planned November 4 reopening. That is still future as of this update; confirm it happens and recheck December hours.',sources:['meiji_hours'],remembered:false};}
 if(id==='09'&&v==='free'){d={...structuredClone(original['09']),jp:'自由日・何もしない選択',en:'Free day · no route to complete',desc:'Rest, revisit a favorite place, or decide on the day. The Asakusa and Meiji alternatives remain available.',tip:'This is an alternative to the proposed Asakusa day, not an extra day added to the trip.',remembered:false};}
 if(id==='11'&&v==='shibuya')d={...structuredClone(original['11']),en:'Preserved alternative · 瑞兆 queue + 華火 later'};
 if(id==='05'&&f.koenji){d={...d,return:'koenji',returnText:'Return from Koenji using a service that stops there. Check local / rapid stopping patterns.'};}
 if((id==='07'||(id==='09'&&v==='plan'))&&f.zojoji)d={...d,return:'daimon',returnText:'Return from Daimon after Zojo-ji. This replaces the earlier return point, not an extra round trip.'};
 return d;
}
activeDay=()=>daySpec();
function buildSegments(id=state.day,v=variant(id),f=flags(id)){
 if(id==='06'){
  if(v==='western'){
   const park=['kichijoji',...(!f.yuei&&f.pancakes?['happykichi']:[]),'inokashira','nakamichi',...(f.yuei&&f.pancakes?['happykichi']:[]),'kichijoji'];
   return f.yuei?[walk(['higashikoenji','yuei','pal','koenji'],'Optional booked lunch → Koenji','Only use after confirming the restaurant arrangement. Pancakes, when selected, are later dessert.'),train(['koenji','kichijoji'],'TRAIN: Koenji → Kichijoji','Use a stopping service; do not assume a Sunday rapid stops at Koenji.'),walk(park,'Kichijoji park + shopping streets')]:[walk(park,'Kichijoji → Inokashira → local shops'),train(['kichijoji','koenji'],'TRAIN: Kichijoji → Koenji','Use a stopping local service on Sunday.'),walk(['koenji','pal','koenji'],'Optional western-Tokyo day · Koenji finish')];
  }
  return [walk(['nihonodori','boulevard','yamashita'],'Yokohama · historic avenue → waterfront'),walk(['yamashita','motomachi',...(f.chinatown?['chinatown']:[]),'motostation'],f.chinatown?'Motomachi → optional Chinatown':'Motomachi → station · Chinatown skipped','This is the Sunday day trip. Food detours are optional, not a completion checklist.')];
 }
 if(id==='08'){
  const s=[train(['kamakura','jomyoji'],'BUS: Kamakura → Jomyoji','Take a suitable local bus toward Jomyoji; this dashed line is a connection, not the bus road alignment.','bus'),walk(['jomyoji','hokokuji','jomyoji'],'Hokokuji · bamboo + optional tea','Suggested first stop. Return to the bus stop after the garden.'),train(['jomyoji','hachimangu'],'BUS: back toward the shrine area','Check the nearest suitable stop / service live. The marked temple is the destination area, not a precise bus boarding point.','bus'),walk(['hachimangu','wakamiya',...(f.giraffa?['giraffa']:[]),...(f.chacha?['chacha']:[]),'kamakura'],'Shrine → Wakamiya-oji → station','Komachi food detours appear only when selected. The temple / street walking line is not a crowd forecast.'),train(['kamakura','yuigahama'],'ENODEN: Kamakura → Yuigahama'),walk(['yuigahama','matsubara','yuigahama'],'Matsubara-an · flexible soba lunch','No reservation has been made. Shorten food queues before sacrificing the planned coast.')];
  if(v==='plan')s.push(train(['yuigahama','inamurasta'],'ENODEN: Yuigahama → Inamuragasaki'),walk(['inamurasta','inamura','inamurasta'],'Coast · early-dusk lookout','Target the coast around 15:45. Weather / visibility may make the shorter route preferable.'),train(['inamurasta','kamakura'],'ENODEN: return to Kamakura'));
  else s.push(train(['yuigahama','kamakura'],'ENODEN: return to Kamakura · no coast'));
  return s;
 }
 if(id==='09'){
  if(v==='free')return [];
  if(v==='meiji'){const s=[walk(['ochanomizu','meiji'],'Meiji cafeteria · alternative lunch','Confirm reopening and general-public access. Directions lead to the building entrance.')];if(f.books||f.tamtam)s.push(walk(['meiji','jim',...(f.tamtam?['tamtam','jim']:[])],'Optional Jimbocho books / later dessert'));else s.push(walk(['meiji','ochanomizu'],'Short version · station return'));return s;}
  const s=[walk(['asakusasta','asakusaeast','nitenmon','sensoji'],'Eastern approach → Nitenmon → Senso-ji','Avoid using Kaminarimon / Nakamise as the main approach. The temple courtyard itself can still be busy.')];
  const after=['sensoji',...(['suzukien','both'].includes(f.matcha)?['suzukien']:[]),'nitenmon',...(['hatoya','both'].includes(f.matcha)?['hatoya']:[]),'sumida',...(f.ichinoya?['ichinoya']:[]),'asakusasta'];
  s.push(walk(after,'Temple → selected food stops → riverside','Food shops may open later than the temple. Choose one matcha stop or neither; lunch remains optional.'));
  if(f.zojoji)s.push(train(['asakusasta','daimon'],'TRANSIT: Asakusa → Daimon','Use a suitable Asakusa Line connection. This is a cross-city trip, not a walk.'),walk(['daimon','zojoji','daimon'],'Optional Zojo-ji · temple and Tower view'));
  return s;
 }
 if(id==='11'&&v==='plan'){
  const h=['harajuku',...(f.dogs?['moffu']:[]),...(f.plaza!=='none'?[f.plaza]:[]),'kevelos'];
  const s=[walk(h,'Harajuku · wanted café + pizza lunch','The map is geographic order. Fit it to an available dog-café session and the pizza lunch window; it is not a timed booking.'),walk(['kevelos','catstreet','shibuya','loft',...(state.shopping.flag?['matsuflag']:[])],'Cat Street → Shibuya · browse at your pace')];
  let last=s.at(-1).ids.at(-1);
  if(f.long){s.push(walk([last,'daikan','nakameguro'],'Optional longer walk · Daikanyama → Nakameguro','Not a required extra district; drop it when the café / lunch takes longer.'),train(['nakameguro','shibuya'],'TRAIN: back to Shibuya for dinner'));last='shibuya';}
  s.push(walk([last,'hanabi','shibuya'],'Existing 華火 meal → Shibuya station','Keep this for later, when hungry. Confirm evening service; no second lunch or fixed dinner booking.'));return s;
 }
 let s=copied(legacy.segments());
 if(id==='05'&&f.koenji)s.push(train(['shinjuku','koenji'],'TRAIN: optional Koenji evening'),walk(['koenji','pal','koenji'],'Koenji · short shopping-street loop','This does not also squeeze in Kichijoji / Inokashira. Stop early when tired.'));
 if(id==='07'&&f.zojoji){s=s.filter(x=>!x.ids.includes('nihonbridge')&&!x.ids.includes('hoshinokanda')&&!x.ids.includes('nihonbashista'));s.push(train(['monzen','daimon'],'TRANSIT: Monzen-Nakacho → Daimon','This replaces the optional Nihombashi / pancake finish.'),walk(['daimon','zojoji','daimon'],'Optional Zojo-ji · temple and Tower view'));}
 return s;
}
segments=()=>buildSegments();
const reference=()=>choices[state.day]?buildSegments(state.day,'plan',{...defaults[state.day]}):segments();
const signature=s=>JSON.stringify(s.map(x=>[x.mode,x.transport||'',x.ids]));
const differs=()=>signature(segments())!==signature(reference());
function optionHTML(){const id=state.day;if(!choices[id])return '';const v=variant(),f=flags();return `<section class="card trip-options"><span class="optional-badge">YOUR ROUTE · OPTIONAL MEANS OPTIONAL</span><h3>Choose what earns its place.</h3><p class="choice-help">Changes update the path, not just the pins. Alternatives replace this day in your preview; they do not add another day or make a booking.</p>${(opts[id]||[]).filter(o=>!o[3]||o[3]===v).map(([key,title,note,condition,values])=>values?`<label class="extra-select"><b>${esc(title)}</b><select data-extra="${key}" aria-label="${esc(title)}">${values.map(([a,b])=>`<option value="${a}" ${f[key]===a?'selected':''}>${esc(b)}</option>`).join('')}</select><small>${esc(note)}</small></label>`:`<label class="extra-choice"><input type="checkbox" data-extra="${key}" ${f[key]?'checked':''}><span><b>${esc(title)}</b><small>${esc(note)}</small></span></label>`).join('')}<div class="actions"><button data-reset-day>Reset this day</button><button data-go="options">All optional outings</button></div><p class="plan-meta">Selections stay in this browser. The reference route is the revised plan, not a second trip to complete.</p></section>`;}
function refLinks(keys){return keys.map(k=>{const s=sources[k]||[DATA.sources[k]?.title,DATA.sources[k]?.url];return s[1]?`<a href="${esc(s[1])}" target="_blank" rel="noopener">${esc(s[0])} ↗</a>`:'';}).join('');}
function placeCard(id){const p=P[id],i=info[id];if(!i)return '';return `<section class="card trip-place"><span class="optional-badge">${['kevelos','matsubara','hokokuji'].includes(id)?'PLANNED CANDIDATE · NOT BOOKED':'OPTION / CHECK BEFORE VISITING'}</span><h3>${esc(p.jp)}</h3><p><strong>${esc(i[0])}</strong></p><p>${esc(i[1])}</p><div class="actions"><button class="linkbtn" data-focus="${id}">Show pin</button>${link(searchLink(id),'Named place / entrance')}</div>${i[2].length?`<details><summary>Sources / latest opening details</summary>${refLinks(i[2])}</details>`:''}</section>`;}
function chosenCards(){const f=flags(),v=variant();if(state.day==='08')return ['hokokuji','matsubara',...(f.giraffa?['giraffa']:[]),...(f.chacha?['chacha']:[]),...(v==='plan'?['inamura']:[])];if(state.day==='09'&&v==='plan')return [...(['hatoya','both'].includes(f.matcha)?['hatoya']:[]),...(['suzukien','both'].includes(f.matcha)?['suzukien']:[]),...(f.ichinoya?['ichinoya']:[]),...(f.zojoji?['zojoji']:[])];if(state.day==='11'&&v==='plan')return ['kevelos',...(f.dogs?['moffu']:[]),...(f.plaza!=='none'?[f.plaza]:[])];if(state.day==='07'&&f.zojoji)return ['zojoji'];return [];}
function customDayHTML(d){const s=segments(),a=d.access?.[state.base];let html=optionHTML()+`<section class="card"><span class="badge">${esc(d.type)}</span><h2>${esc(d.jp)}</h2><p>${esc(d.desc)}</p><div class="stats"><div><b>${esc(d.walk)}</b>Not a distance target</div><div><b>${esc(d.duration)}</b>Meals / queues are flexible</div></div><div class="callout">${esc(d.tip)}</div></section>`;
 if(state.day==='06'&&variant()==='western')html+=`<section class="card"><h3>The displaced Sunday is still here.</h3><p>This replaces Yokohama in your preview. Kichijoji / Inokashira deserves a half-day rather than being inserted after Shinjuku. Koenji alone can instead extend Dec 5.</p><div class="actions"><button class="linkbtn" data-preview="05:plan" data-enable="koenji">Compare Koenji after Shinjuku</button></div></section>`;
 if(a&&s.length)html+=`<section class="card journey"><div class="smallcaps">OUTWARD · SAME HOTEL</div><div class="estimate">${esc(a.time)}</div><p>${esc(a.text)}</p><div class="actions">${link(directions([state.base,s[0].ids[0]],'transit'),'Live outward transit','rail')}</div></section>`;
 html+=s.map(segmentHTML).join('');
 if(d.return&&s.length)html+=`<section class="card journey"><h3>${esc(P[d.return].jp)} → ${esc(B[state.base].label)}</h3><p>${esc(d.returnText)}</p><div class="actions">${link(directions([d.return,state.base],'transit'),'Live return transit','rail')}</div></section>`;
 if(state.day==='09'&&variant()==='meiji')html+=legacy.mealCard('meiji');
 if(state.day==='06'&&variant()==='western'){if(flags().yuei)html+=legacy.mealCard('yuei').replace(/data-food="(true|false)"/g,'data-unused-food="$1"');if(flags().pancakes)html+=legacy.cafeCard('happykichi');}
 html+=chosenCards().map(placeCard).join('');
 if(!s.length)html+='<section class="card"><h3>Nothing to complete today.</h3><p>Your Tokyo hotel stays the same. Use Compare to see what the Asakusa alternative would add.</p></section>';
 return html;
}
dayHTML=d=>['06','08','09'].includes(d.id)||(d.id==='11'&&variant()==='plan')?customDayHTML(d):optionHTML()+legacy.dayHTML(d)+chosenCards().map(placeCard).join('');
const catalog=[
 ['06','western','Kichijoji · Inokashira · Koenji','Replacement half/full day. The displaced Sunday plan, not an add-on after Yokohama.'],
 ['05','plan','Koenji after Shinjuku','Smaller evening add-on. Keep the Kichijoji park visit separate.','koenji'],
 ['07','plan','Zojo-ji / Tokyo Tower view','Add to the eastern-Tokyo day instead of the Nihombashi finish.','zojoji'],
 ['08','short','Shorter Kamakura','Keep bamboo + soba; remove the coast when weather or energy says no.'],
 ['09','plan','Asakusa + optional matcha / wagyu','East-side temple approach; food stops and cross-city extension stay optional.'],
 ['09','meiji','Meiji cafeteria + Jimbocho','Preserved alternative to Asakusa; check the planned reopening.'],
 ['09','free','A genuinely free day','Rest instead of adding another route.'],
 ['11','plan','Harajuku pizza + Samoyeds','Wanted additions. Tokyu Plaza and the longer walk remain switches.'],
 ['11','shibuya','瑞兆 + Shibuya · original version','Alternative lunch plan, not a second lunch after KEVELOS.'],
 ['10','plan','Akihabara on the Kashiwa-no-ha return','Existing optional Akihabara / shopping controls remain in the day tab.']
];
function catalogHTML(){return `<section class="card option-catalog"><span class="optional-badge">OPTION LIBRARY · NOT MORE OBLIGATIONS</span><h2>Keep the ideas.<br>Choose the day.</h2><p>Preview a route, then use Compare and the optional-stop switches. Different towns are not connected into a pretend walking trail.</p><div class="route-warning">The fixed working plan is Dec 6 Yokohama → Dec 7 eastern Tokyo → Dec 8 Kamakura. These are separate round trips from the same hotel, not a hotel move.</div>${catalog.map(([id,v,title,note,enable])=>`<div class="catalog-row"><span><b>${esc(title)}</b><small>${esc(note)}</small></span><button data-preview="${id}:${v}" ${enable?`data-enable="${enable}"`:''}>Preview · Dec ${+id}</button></div>`).join('')}</section><section class="card"><h3>Small snacks, not another expedition</h3><p>CREMIA, the convenience-store sandwich, extra matcha and other influencer food stops stay opportunistic. They do not each need a timetable slot or another detour.</p><p class="plan-meta">New pins are approximate planning positions. Named directions links help locate the actual branch / entrance.</p></section>`;}
overviewHTML=()=>`<section class="card"><span class="badge gold">REVISED · 25 OCTOBER 2026</span><h2>Tokyo, with room<br>for the coast.</h2><p>Keep the Nihombashi base. Yokohama moves to Sunday, Kamakura takes Tuesday, and the old western-Tokyo day becomes an alternative.</p><div class="stats"><div><b>Dec 6 · Yokohama</b>Waterfront day</div><div><b>Dec 8 · Kamakura</b>Bamboo + soba + coast</div></div><div class="callout">Dec 7 stays gentler between the out-of-town days. Asakusa is a flexible half-day; Kashiwa-no-ha remains on Dec 10.</div><div class="actions"><button class="linkbtn primary" data-go="08">Open Kamakura route</button><button class="linkbtn" data-go="options">Optional outings & comparisons</button></div></section><section class="card"><h3>Your working itinerary</h3><div class="overview-list">${DAYS.map(d=>`<button class="overview-item" data-go="${d.id}"><span class="number ${['06','08','10'].includes(d.id)?'outer':''}">${d.id}</span><span><b>${esc(d.jp)}</b><small>December ${+d.id} · ${esc(d.dow)} · ${esc(d.type)}</small></span></button>`).join('')}</div></section><section class="card"><h3>How to compare</h3><p>Open a day. Pick a route or switch on an optional stop, then choose <strong>Compare</strong>. Purple is the revised reference plan; green is your selection. Shared legs are shown once. Solid lines are street-routed walks only after routing succeeds; dotted lines are stop order, and dashed lines are transport connections.</p><p class="plan-meta">Choices are saved locally. Copy comparison link includes your route settings, but not private shopping notes.</p></section>`+shoppingOverviewCard()+foodOverviewCard()+`<section class="card"><h3>Breakfasts, cafés and the original details remain.</h3><p>Komeda before Kashiwa-no-ha, the original ramen choices, hotel comparison and shopping notes are still here. Kichijoji pancakes belong to the optional western route.</p><div class="actions"><button class="linkbtn" data-go="cafes">Breakfasts / cafés</button><button class="linkbtn" data-go="meals">Meals</button></div></section>`;
mealCard=id=>{let h=legacy.mealCard(id);if(id==='yuei')h=h.replace('data-go="06"','data-preview="06:western"').replace('See Dec 6 route','Western-Tokyo alternative');if(id==='zuicho')h=h.replace('data-go="11"','data-preview="11:shibuya"');if(id==='meiji')h=h.replace('data-go="09"','data-preview="09:meiji"');return h;};
cafeCard=id=>{let h=legacy.cafeCard(id);if(id==='happykichi')h=h.replace('data-go="06"','data-preview="06:western"').replace('Day 6 route','Western-Tokyo alternative');if(id==='tamtam')h=h.replace('data-go="09"','data-preview="09:meiji"');return h;};
mealsHTML=()=>`<section class="card"><h3>New food choices, without double lunches.</h3><p>KEVELOS and 瑞兆 are alternative Dec 11 lunches. Ichinoya and the Meiji outing are alternative Dec 9 plans. Select a day to change the actual route.</p><div class="actions"><button class="linkbtn" data-go="11">Pizza / 瑞兆 comparison</button><button class="linkbtn" data-go="08">Kamakura food options</button></div></section>`+['kevelos','matsubara','ichinoya'].map(placeCard).join('')+legacy.mealsHTML();
cafesHTML=()=>`<section class="card"><h3>New café candidates</h3><p>The Samoyed café is a reservable activity, not a breakfast stop. Matcha options live in their Asakusa / Kamakura routes; the original breakfast choices follow below.</p><div class="actions"><button class="linkbtn" data-go="11">Dogs + pizza route</button><button class="linkbtn" data-go="09">Asakusa matcha options</button></div></section>`+['moffu','hatoya','suzukien','chacha'].map(placeCard).join('')+legacy.cafesHTML();
// Day-area / hotel controls still use the original map engine. Comparison adds another layer.
function routeLines(s,group){return s.map(seg=>{const r=seg.mode==='walking'?routeData(seg.ids):null;return {mode:seg.mode,transport:seg.transport||'train',group,routed:r?.status==='ready',points:r?.status==='ready'?r.geometry:seg.ids.map(id=>[P[id].lat,P[id].lon]),ids:seg.ids};});}
mapModel=function(){
 if(state.day==='options')return {markers:['kichijoji','koenji','zojoji','kamakura','sensoji','meiji','harajuku','kashista'].map((id,i)=>({id,text:String(i+1)})),lines:[]};
 if(state.day==='overview')return {markers:[{id:state.base,text:'H',hotel:true},...['03','04','05','06','07','08','09','10','11'].map((day,i)=>({id:['ginkgo','rikugien','gyoen','boulevard','kiyosumi','kamakura','sensoji','kashista','harajuku'][i],text:day,outer:['06','08','10'].includes(day)}))],lines:[]};
 if(!choices[state.day]){const m=legacy.mapModel();if(state.day==='meals')m.markers.push(...['kevelos','matsubara','ichinoya'].map(id=>({id,text:'+'})));if(state.day==='cafes')m.markers.push(...['moffu','hatoya','suzukien','chacha'].map(id=>({id,text:'+'})));return m;}
 const selectedRoute=segments(),ref=reference(),different=signature(selectedRoute)!==signature(ref),useSelected=prefs.view!=='reference',useReference=prefs.view==='reference'||(prefs.view==='compare'&&different),markers=[],lines=[];
 const activeIds=useSelected?[...new Set(selectedRoute.flatMap(s=>s.ids))]:[];
 if(useReference){const shared=new Set(useSelected?selectedRoute.map(x=>signature([x])):[]);lines.push(...routeLines(ref.filter(x=>!shared.has(signature([x]))),'reference'));for(const id of [...new Set(ref.flatMap(s=>s.ids))])if(!activeIds.includes(id))markers.push({id,text:'R',reference:true});}
 if(useSelected){lines.push(...routeLines(selectedRoute,'selected'));markers.push(...activeIds.map((id,i)=>({id,text:String(i+1)})));}
 if(state.hotel){markers.unshift({id:state.base,text:'H',hotel:true});const ds=useSelected?daySpec():daySpec(state.day,'plan',{...defaults[state.day]});const main=useSelected?selectedRoute:ref;if(main.length){lines.unshift({mode:'transit',transport:'train',group:useSelected?'selected':'reference',points:[[P[state.base].lat,P[state.base].lon],[P[main[0].ids[0]].lat,P[main[0].ids[0]].lon]]});if(ds.return)lines.push({mode:'transit',transport:'train',group:useSelected?'selected':'reference',points:[[P[ds.return].lat,P[ds.return].lon],[P[state.base].lat,P[state.base].lon]]});}if(useReference&&useSelected&&different&&ref.length){lines.unshift({mode:'transit',transport:'train',group:'reference',points:[[P[state.base].lat,P[state.base].lon],[P[ref[0].ids[0]].lat,P[ref[0].ids[0]].lon]]});const end=daySpec(state.day,'plan',{...defaults[state.day]}).return;if(end)lines.push({mode:'transit',group:'reference',points:[[P[end].lat,P[end].lon],[P[state.base].lat,P[state.base].lon]]});}}
 if(!markers.length)markers.push({id:state.base,text:'H',hotel:true});return {markers,lines};
};
drawOverlay=function(){legacy.drawOverlay();if(!choices[state.day])return;const w=mapEl.clientWidth,h=mapEl.clientHeight;let svg='';for(const line of layerModel.lines){const pts=line.points.map(screen);if(pts.length<2)continue;const d=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' '),referenceLine=line.group==='reference',col=referenceLine?'#946b9c':'#087b67',dash=line.mode==='transit'?'10 7':line.routed?'':'2 7';svg+=`<path d="${d}" fill="none" stroke="#fff" stroke-width="8" opacity=".75"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${referenceLine?6:4}" stroke-dasharray="${dash}" stroke-linecap="round" stroke-linejoin="round" opacity="${referenceLine?.58:.95}"/>`;if(line.mode==='transit'){const a=pts[0],b=pts.at(-1),x=(a[0]+b[0])/2,y=(a[1]+b[1])/2;if(x>25&&x<w-25&&y>15&&y<h-15)svg+=`<rect x="${x-25}" y="${y-9}" width="50" height="18" rx="5" fill="#fff"/><text x="${x}" y="${y+3}" text-anchor="middle" font-size="9" font-family="sans-serif" fill="${col}">${line.transport==='bus'?'BUS':'TRANSIT'}</text>`;}}
 overlay.innerHTML=svg;for(const btn of pinsEl.children){const m=layerModel.markers.find(m=>`${P[m.id].jp} / ${P[m.id].en}`===btn.title);if(m?.reference)btn.classList.add('reference');}
};
refit=function(){if(choices[state.day]||state.day==='options'||state.day==='overview'){fit(layerModel.markers.map(m=>P[m.id]));return;}legacy.refit();};
focusPoint=function(id){if(!layerModel.markers.some(m=>m.id===id))layerModel.markers.push({id,text:'+'});legacy.focusPoint(id);};
loadCurrentPaths=function(){legacy.loadCurrentPaths();if(choices[state.day]&&prefs.view!=='selected')for(const s of reference())if(s.mode==='walking')requestWalking(s.ids);};
function metric(s){const walks=s.filter(x=>x.mode==='walking'),r=walks.map(x=>routeData(x.ids)),n=new Set(s.flatMap(x=>x.ids)).size;return `${n} stops · ${walks.length} walking blocks`+(walks.length&&r.every(x=>x?.status==='ready')?` · ${(r.reduce((a,b)=>a+b.distance,0)/1000).toFixed(1)} km routed walking`:' · walking distance pending');}
function comparePanel(){if(!choices[state.day])return '';const id=state.day,same=!differs();return `<div class="choice-top"><label for="routeVariant">Route preview · Dec ${+id}</label><select id="routeVariant" data-variant>${choices[id].map(([v,label])=>`<option value="${v}" ${variant()===v?'selected':''}>${esc(label)}</option>`).join('')}</select></div><div class="view-buttons" role="group" aria-label="Map comparison view">${[['selected','Your selection'],['compare','Compare'],['reference','Reference only']].map(([v,l])=>`<button data-view="${v}" aria-pressed="${prefs.view===v}">${l}</button>`).join('')}<button data-copy-link>Copy comparison link</button></div><div class="comparison-key"><span class="route-dot selected"></span><b>Your selection</b> &nbsp; <span class="route-dot reference"></span><b>Revised reference</b> · shared legs shown once</div><div class="compare-stats"><div class="compare-stat"><strong>Your selection</strong><small id="selectedMetric">${metric(segments())}</small></div><div class="compare-stat"><strong>Revised reference</strong><small id="referenceMetric">${metric(reference())}</small></div></div>${same?'<p class="compare-empty">These routes currently match. Add an optional stop or choose an alternative to see the difference.</p>':''}<span class="copy-status" id="copyStatus" aria-live="polite"></span>`;}
updateStatus=function(){if(state.day==='options'){$('mapstatus').textContent='Optional outings in separate areas. Preview one to compare its actual stop order; no cross-city walking line is implied.';return;}legacy.updateStatus();if(choices[state.day]){$('mapstatus').textContent+=' Green = selected route; purple = revised reference. Dotted walks are order-only until street routing loads. Bus / rail dashes are schematic. New pins are approximate; use named directions for entrances.';if($('selectedMetric'))$('selectedMetric').textContent=metric(segments());if($('referenceMetric'))$('referenceMetric').textContent=metric(reference());}};
saveState=function(){legacy.saveState();try{localStorage.setItem('tokyoTripOptionsV9',JSON.stringify(prefs));}catch{}try{const q=new URLSearchParams({day:state.day,base:state.base,plan:JSON.stringify(prefs)});history.replaceState(null,'','#'+q);}catch{}};
const panel=document.createElement('div');panel.id='routecompare';panel.className='route-choice';document.querySelector('.mapcard .tools').before(panel);
const banner=document.createElement('div');banner.className='change-summary';banner.innerHTML='<span><strong>Revised plan</strong> · Sun 6 Yokohama → Mon 7 eastern Tokyo → Tue 8 Kamakura. Western Tokyo is now optional.</span><button data-open-options>Explore optional outings ↗</button>';document.querySelector('#tabs').before(banner);banner.querySelector('button').onclick=()=>selectDay('options');
document.querySelector('.brand .sub').innerHTML='One hotel, ten nights. Yokohama, Kamakura and the Tokyo walks you wanted.<br>Compare optional stops and alternative days without turning them all into obligations.';
document.querySelector('.intro').innerHTML='<span class="badge gold">V9 · ROUTE COMPARISON</span><span><strong>Keep the choices, not the pressure.</strong> Preview optional stops, compare paths and keep the original meal-day alternatives.</span>';
document.querySelector('.brand h1').innerHTML='東京、その先へ。<br>Walk, wander. Leave room for the coast.';
const geoTable=document.querySelector('.compare tbody');if(geoTable){const row=document.createElement('tr');row.innerHTML='<td>鎌倉 Kamakura</td><td>Separate coastal / temple city in Kanagawa</td><td>Dec 8 day trip. Bus / Enoden between walking areas; shorter version available.</td><td>Return to the same Tokyo hotel.</td>';geoTable.appendChild(row);}
const mapNotes=[...document.querySelectorAll('.bottomnotes h3')].find(x=>x.textContent.includes('How to read'));if(mapNotes)mapNotes.parentElement.innerHTML='<h3>How to read the maps</h3>'+'Numbered pins show your selected stop order. On comparison days, green is your selection and purple is the revised reference. Solid lines are street-routed walks only after a route loads; dotted lines are order-only; dashed bus / rail connections are schematic. On unchanged days, the original walking / rail colors remain. Follow local signs and live directions.';
$('tilewarn').innerHTML='Street tiles could not load. The markers still show geographic positions, but this is <strong>not a street-navigation map</strong> until tiles load. Retry with internet access, or use the named directions buttons.';
document.title='Tokyo Trips · December 2026 · routes & alternatives';
document.querySelector('footer').textContent='Tokyo Trips · revised October 25, 2026. Hosted planner; no bookings are made here. The original V8 source is preserved separately. Your shopping notes and route choices are stored only in this browser; copied comparison links contain route selections, not shopping notes. No device location is requested. Green/purple identify selected/reference routes; solid walking geometry appears only when the routing service succeeds. Dotted walking lines show order only; dashed bus/rail lines are schematic, not road/track alignments. New planning pins are approximate; use named place links for entrances. Opening hours and reservations must be checked for December. Travel-time ranges are planning allowances, not live timetables. New venue references checked October 25, 2026; unchanged V8 venue and hotel details retain their earlier dates and are not newly verified. © OpenStreetMap contributors; walking routing: FOSSGIS / OSRM routed-foot.';
const oldLegend=document.querySelector('.legend');oldLegend.innerHTML='<span>■ Rust = meals · ■ Plum = shops</span><span>Solid = loaded walking path</span><span>Dotted = walking order only</span><span>Dashed = bus / rail connection, not alignment</span>';
render=function(args={}){legacy.render(args);panel.hidden=!choices[state.day];panel.innerHTML=comparePanel();const existing=$('tabs').querySelector('[data-day="options"]');if(!existing){const b=document.createElement('button');b.className='daytab option-tab'+(state.day==='options'?' active':'');b.dataset.day='options';b.innerHTML='<b>＋ Optional trips</b><span>Alternatives & add-ons</span>';$('tabs').insertBefore(b,$('tabs').children[1]);}
 for(const [id,label]of [['06','横浜 / 代案'],['08','鎌倉'],['09','浅草 / 自由日'],['11','原宿ピザ / 渋谷']]){const b=$('tabs').querySelector(`[data-day="${id}"] span`);if(b)b.textContent=label;}
 if(state.day==='options'){$('sidebar').innerHTML=catalogHTML();$('maptitle').textContent='選べる寄り道 / Optional outings';$('mapsub').textContent='Preview alternatives; do not add them all to the trip';$('mapbadge').textContent='OPTION LIBRARY';}
 updateStatus();};
function preview(value,enable){const [day,v]=value.split(':');if(choices[day]&&choices[day].some(x=>x[0]===v)){prefs.variants[day]=v;if(enable){(prefs.extras[day]??={})[enable]=true;if(enable==='zojoji')(prefs.extras[day==='07'?'09':'07']??={}).zojoji=false;}prefs.view='compare';}selectDay(day);}
async function copyLink(){saveState();const text=location.href;try{await navigator.clipboard.writeText(text);$('copyStatus').textContent='Comparison link copied.';}catch{const el=document.createElement('input');el.className='share-url';el.readOnly=true;el.value=text;$('copyStatus').replaceChildren(el);el.focus();el.select();}}
panel.addEventListener('change',e=>{if(e.target.matches('[data-variant]')){prefs.variants[state.day]=e.target.value;render();}});
panel.addEventListener('click',e=>{const v=e.target.closest('[data-view]');if(v){prefs.view=v.dataset.view;render();}if(e.target.closest('[data-copy-link]'))copyLink();});
$('sidebar').addEventListener('change',e=>{const t=e.target;const cafe=t.dataset.cafeToggle;if(cafe==='happy06'||cafe==='tam09'){const day=cafe==='happy06'?'06':'09',key=cafe==='happy06'?'pancakes':'tamtam';(prefs.extras[day]??={})[key]=t.checked;render();return;}if(!t.matches('[data-extra]'))return;const key=t.dataset.extra;(prefs.extras[state.day]??={})[key]=t.type==='checkbox'?t.checked:t.value;if(key==='zojoji'&&t.checked){const other=state.day==='07'?'09':'07';(prefs.extras[other]??={}).zojoji=false;}render();});
$('sidebar').addEventListener('click',e=>{const p=e.target.closest('[data-preview]');if(p){preview(p.dataset.preview,p.dataset.enable);return;}if(e.target.closest('[data-reset-day]')){delete prefs.variants[state.day];delete prefs.extras[state.day];render();}});
// Bus legs must not be labeled as trains in the route cards.
const originalPathStatus=pathStatus;
pathStatus=function(s){return s.transport==='bus'?'Bus connection diagram — open transit directions for the actual stops and services.':originalPathStatus(s);};
const baseSegmentHTML=segmentHTML;
segmentHTML=function(s,i){let h=baseSegmentHTML(s,i);if(s.transport==='bus')h=h.replace('TRAIN 電車','BUS バス').replace('Train connection diagram','Bus connection diagram');return h;};
window.__plannerTest={state,selectDay,directions,world,ll,routeCache,segments,activeDay,reference,choices,prefs,preview,buildSegments,daySpec,get model(){return layerModel;},get zoom(){return z;}};
render();
window.__tokyoV9Ready=true;
})();
