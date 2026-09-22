/*
  DELPOSH BEAUTY & FITNESS — Premium Loading Screen
  -------------------------------------------------
  Add this file immediately after <body> in index.html:
    <script src="loading-screen.js"></script>
  Keep the logo at: assets/logo-transparent.png
*/
(function () {
  'use strict';

  var START = performance.now();
  var MIN_DURATION = 2800;
  var counter = 0;
  var finished = false;
  var pageReady = document.readyState === 'complete';

  var css = `
    :root { --dp-gold:#c99a3b; --dp-gold-soft:#e7c77e; --dp-bg:#070706; }
    html.dp-loading, body.dp-loading { overflow:hidden !important; }
    #dp-loader {
      position:fixed; inset:0; z-index:2147483647; overflow:hidden;
      display:grid; place-items:center; isolation:isolate;
      background:
        radial-gradient(circle at 50% 46%, rgba(201,154,59,.105), transparent 22%),
        radial-gradient(circle at 50% 50%, rgba(255,255,255,.025), transparent 42%),
        #070706;
      color:#fff;
      font-family: "DM Sans", Arial, sans-serif;
      opacity:1; visibility:visible;
      transition:opacity .9s cubic-bezier(.77,0,.18,1), visibility .9s;
    }
    #dp-loader.dp-leaving { opacity:0; visibility:hidden; pointer-events:none; }
    #dp-loader .dp-noise {
      position:absolute; inset:-50%; opacity:.055; pointer-events:none; z-index:1;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
      animation:dpNoise .22s steps(2) infinite;
    }
    #dp-loader .dp-orb { position:absolute; border-radius:50%; pointer-events:none; filter:blur(1px); }
    #dp-loader .dp-orb.a { width:38vw; height:38vw; min-width:260px; min-height:260px; background:radial-gradient(circle,rgba(201,154,59,.13),transparent 65%); animation:dpFloat 5s ease-in-out infinite; }
    #dp-loader .dp-orb.b { width:22vw; height:22vw; min-width:180px; min-height:180px; background:radial-gradient(circle,rgba(231,199,126,.075),transparent 68%); animation:dpFloat 6s ease-in-out -1.8s infinite reverse; }
    #dp-loader .dp-orbit { position:absolute; border:1px solid rgba(201,154,59,.16); border-radius:50%; transform:rotate(-18deg); pointer-events:none; }
    #dp-loader .dp-orbit.one { width:min(62vw,760px); height:min(62vw,760px); animation:dpSpin 14s linear infinite; }
    #dp-loader .dp-orbit.two { width:min(44vw,540px); height:min(44vw,540px); border-color:rgba(231,199,126,.11); transform:rotate(48deg); animation:dpSpinReverse 11s linear infinite; }
    #dp-loader .dp-orbit.three { width:min(78vw,940px); height:min(28vw,340px); border-color:rgba(201,154,59,.07); transform:rotate(24deg); animation:dpSpin 18s linear infinite; }
    #dp-loader .dp-orbit:after { content:""; position:absolute; width:5px; height:5px; border-radius:50%; background:var(--dp-gold-soft); box-shadow:0 0 18px 4px rgba(231,199,126,.55); top:50%; left:-3px; }
    #dp-loader .dp-cross { position:absolute; width:100%; height:100%; pointer-events:none; opacity:.2; }
    #dp-loader .dp-cross:before,#dp-loader .dp-cross:after { content:""; position:absolute; background:linear-gradient(90deg,transparent,rgba(201,154,59,.25),transparent); }
    #dp-loader .dp-cross:before { width:100%; height:1px; top:50%; }
    #dp-loader .dp-cross:after { height:100%; width:1px; left:50%; background:linear-gradient(180deg,transparent,rgba(201,154,59,.2),transparent); }
    #dp-loader .dp-center { position:relative; z-index:5; width:min(86vw,620px); text-align:center; display:flex; flex-direction:column; align-items:center; }
    #dp-loader .dp-logo-wrap { position:relative; width:clamp(118px,15vw,190px); height:clamp(118px,15vw,190px); display:grid; place-items:center; }
    #dp-loader .dp-logo-ring { position:absolute; inset:0; border:1px solid rgba(201,154,59,.5); border-radius:50%; transform:scale(.65); opacity:0; animation:dpRingIn 1.15s .1s cubic-bezier(.16,1,.3,1) forwards, dpRingPulse 2.5s 1.25s ease-in-out infinite; }
    #dp-loader .dp-logo-ring:before,#dp-loader .dp-logo-ring:after { content:""; position:absolute; border-radius:50%; }
    #dp-loader .dp-logo-ring:before { inset:8px; border:1px solid rgba(231,199,126,.14); }
    #dp-loader .dp-logo-ring:after { inset:-12px; border:1px dashed rgba(201,154,59,.18); animation:dpSpin 9s linear infinite; }
    #dp-loader .dp-logo { position:relative; width:72%; height:72%; object-fit:contain; opacity:0; transform:scale(.55) rotate(-5deg); filter:drop-shadow(0 0 20px rgba(201,154,59,.18)); animation:dpLogoIn 1.35s .2s cubic-bezier(.16,1,.3,1) forwards, dpLogoFloat 3.8s 1.55s ease-in-out infinite; }
    #dp-loader .dp-brand { margin-top:clamp(18px,2.5vw,28px); letter-spacing:.5em; margin-left:.5em; font-size:clamp(15px,1.8vw,22px); font-weight:600; opacity:0; transform:translateY(14px); animation:dpTextIn .9s .75s cubic-bezier(.16,1,.3,1) forwards; }
    #dp-loader .dp-tag { margin-top:10px; color:rgba(255,255,255,.56); letter-spacing:.28em; text-transform:uppercase; font-size:clamp(8px,1vw,11px); opacity:0; transform:translateY(10px); animation:dpTextIn .8s 1s cubic-bezier(.16,1,.3,1) forwards; }
    #dp-loader .dp-loader-bottom { width:min(78vw,360px); margin-top:clamp(34px,5vw,52px); opacity:0; animation:dpTextIn .8s 1.15s cubic-bezier(.16,1,.3,1) forwards; }
    #dp-loader .dp-counter-row { display:flex; justify-content:space-between; align-items:end; margin-bottom:10px; }
    #dp-loader .dp-counter { font-size:clamp(34px,5vw,56px); line-height:.9; font-variant-numeric:tabular-nums; font-weight:500; letter-spacing:-.05em; }
    #dp-loader .dp-percent { color:var(--dp-gold-soft); font-size:11px; letter-spacing:.22em; }
    #dp-loader .dp-track { height:2px; background:rgba(255,255,255,.12); overflow:hidden; position:relative; }
    #dp-loader .dp-progress { height:100%; width:0%; background:linear-gradient(90deg,#8f6820,var(--dp-gold-soft),#fff1bd); box-shadow:0 0 18px rgba(231,199,126,.5); transition:width .16s ease-out; position:relative; }
    #dp-loader .dp-progress:after { content:""; position:absolute; right:0; top:50%; width:34px; height:20px; transform:translateY(-50%); background:radial-gradient(circle,rgba(255,240,190,.9),transparent 68%); filter:blur(3px); }
    #dp-loader .dp-status { margin-top:11px; text-transform:uppercase; letter-spacing:.25em; color:rgba(255,255,255,.4); font-size:8px; }
    #dp-loader .dp-corner { position:absolute; z-index:4; color:rgba(255,255,255,.27); font-size:8px; letter-spacing:.2em; text-transform:uppercase; }
    #dp-loader .dp-corner.tl { top:28px; left:30px; } #dp-loader .dp-corner.br { bottom:28px; right:30px; }
    #dp-loader .dp-spark { position:absolute; width:3px; height:3px; background:#f0d590; border-radius:50%; box-shadow:0 0 12px 2px rgba(240,213,144,.7); opacity:0; animation:dpSpark 3.5s ease-in-out infinite; }
    #dp-loader .s1{left:17%;top:27%;animation-delay:.2s}.s2{left:81%;top:32%;animation-delay:1.1s}.s3{left:25%;top:72%;animation-delay:2s}.s4{left:76%;top:69%;animation-delay:2.7s}.s5{left:9%;top:51%;animation-delay:1.7s}.s6{left:90%;top:54%;animation-delay:.7s}
    @keyframes dpLogoIn{to{opacity:1;transform:scale(1) rotate(0)}}
    @keyframes dpRingIn{to{opacity:1;transform:scale(1)}}
    @keyframes dpRingPulse{50%{box-shadow:0 0 45px rgba(201,154,59,.08)}}
    @keyframes dpTextIn{to{opacity:1;transform:translateY(0)}}
    @keyframes dpLogoFloat{50%{transform:translateY(-5px) scale(1.015)}}
    @keyframes dpFloat{50%{transform:translate(2vw,-2vw) scale(1.04)}}
    @keyframes dpSpin{to{transform:rotate(342deg)}}
    @keyframes dpSpinReverse{to{transform:rotate(-312deg)}}
    @keyframes dpSpark{0%,100%{opacity:0;transform:scale(.3)}35%{opacity:.9;transform:scale(1)}65%{opacity:.2;transform:scale(.5)}}
    @keyframes dpNoise{0%{transform:translate(0,0)}25%{transform:translate(2%,-1%)}50%{transform:translate(-1%,2%)}75%{transform:translate(1%,1%)}100%{transform:translate(-2%,-1%)}}
    @media (max-width:600px){
      #dp-loader .dp-orbit.one{width:108vw;height:108vw} #dp-loader .dp-orbit.two{width:78vw;height:78vw} #dp-loader .dp-orbit.three{width:135vw;height:52vw}
      #dp-loader .dp-corner.tl{top:18px;left:18px} #dp-loader .dp-corner.br{bottom:18px;right:18px}
      #dp-loader .dp-tag{letter-spacing:.2em} #dp-loader .dp-brand{letter-spacing:.38em}
    }
    @media (prefers-reduced-motion:reduce){#dp-loader *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}}
  `;

  function inject() {
    if (document.getElementById('dp-loader')) return;
    var style = document.createElement('style');
    style.id = 'dp-loader-styles';
    style.textContent = css;
    document.head.appendChild(style);

    document.documentElement.classList.add('dp-loading');
    document.body.classList.add('dp-loading');

    var loader = document.createElement('div');
    loader.id = 'dp-loader';
    loader.setAttribute('aria-label', 'Loading Delposh Beauty & Fitness');
    loader.innerHTML = `
      <div class="dp-noise"></div>
      <div class="dp-orb a"></div><div class="dp-orb b"></div>
      <div class="dp-orbit one"></div><div class="dp-orbit two"></div><div class="dp-orbit three"></div>
      <div class="dp-cross"></div>
      <span class="dp-spark s1"></span><span class="dp-spark s2"></span><span class="dp-spark s3"></span>
      <span class="dp-spark s4"></span><span class="dp-spark s5"></span><span class="dp-spark s6"></span>
      <div class="dp-corner br">Beauty · Fitness · Wellness</div>
      <div class="dp-center">
        <div class="dp-logo-wrap">
          <div class="dp-logo-ring"></div>
          <img class="dp-logo" src="assets/logo-transparent.png" alt="Delposh" />
        </div>
        <div class="dp-brand">DELPOSH</div>
        <div class="dp-tag">Beauty &amp; Fitness</div>
        <div class="dp-loader-bottom">
          <div class="dp-counter-row"><span class="dp-counter" id="dp-counter">0</span><span class="dp-percent">LOADING</span></div>
          <div class="dp-track"><div class="dp-progress" id="dp-progress"></div></div>
          <div class="dp-status" id="dp-status">Preparing your experience</div>
        </div>
      </div>
    `;
    document.body.prepend(loader);

    var counterEl = loader.querySelector('#dp-counter');
    var progressEl = loader.querySelector('#dp-progress');
    var statusEl = loader.querySelector('#dp-status');
    var statuses = ['Preparing your experience','Entering the Delposh space','Curating beauty & fitness','Almost ready','Welcome to Delposh'];
    var lastStatus = -1;

    function tick(now) {
      if (finished) return;
      var elapsed = now - START;
      var target = Math.min(94, Math.floor((elapsed / 2350) * 94));
      if (pageReady && elapsed > 2350) target = Math.min(99, 94 + Math.floor((elapsed - 2350) / 250));
      if (target > counter) counter = target;
      counterEl.textContent = counter;
      progressEl.style.width = counter + '%';
      var idx = Math.min(statuses.length - 1, Math.floor(counter / 20));
      if (idx !== lastStatus) { statusEl.textContent = statuses[idx]; lastStatus = idx; }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    function ready() { pageReady = true; finishWhenReady(); }
    window.addEventListener('load', ready, { once:true });

    function finishWhenReady() {
      if (!pageReady || finished) return;
      var wait = Math.max(0, MIN_DURATION - (performance.now() - START));
      setTimeout(function () {
        if (finished) return;
        finished = true;
        counter = 100;
        counterEl.textContent = '100';
        progressEl.style.width = '100%';
        statusEl.textContent = 'Welcome to Delposh';
        setTimeout(function () {
          loader.classList.add('dp-leaving');
          document.documentElement.classList.remove('dp-loading');
          document.body.classList.remove('dp-loading');
          setTimeout(function () { loader.remove(); var st=document.getElementById('dp-loader-styles'); if(st) st.remove(); }, 950);
        }, 220);
      }, wait);
    }

    if (document.readyState === 'complete') ready();
  }

  if (document.body) inject();
  else document.addEventListener('DOMContentLoaded', inject, { once:true });
})();
