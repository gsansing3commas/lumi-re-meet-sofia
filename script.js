// ── TRUGEN AGENT ID ──
  // Replace with your real agent ID once created
  const TRUGEN_AGENT_ID = 'AGENT_ID_PLACEHOLDER';

  // ── VIDEO MAP ──
  // Treatment name → YouTube embed URL
  const TREATMENT_VIDEOS = {
    'neuromodulators': {
      url: 'https://www.youtube.com/embed/A7hGwTHhgNY?autoplay=1&mute=0&controls=0&modestbranding=1',
      label: 'How neuromodulators work'
    },
    'dermal fillers': {
      url: 'https://www.youtube.com/embed/Zf9V0sDr6Yc?autoplay=1&mute=0&controls=0&modestbranding=1',
      label: 'About dermal fillers'
    },
    'laser': {
      url: 'https://www.youtube.com/embed/9Yp1B1e0KgE?autoplay=1&mute=0&controls=0&modestbranding=1',
      label: 'Laser resurfacing explained'
    },
    'body contouring': {
      url: 'https://www.youtube.com/embed/4Fxri1BN4Kk?autoplay=1&mute=0&controls=0&modestbranding=1',
      label: 'Body contouring overview'
    }
  };

  // ── START CONVERSATION ──
  function startConversation(e) {
    if (e) e.preventDefault();
    const iframe = document.getElementById('trugen-iframe');
    const placeholder = document.getElementById('avatar-placeholder');

    if (TRUGEN_AGENT_ID !== 'AGENT_ID_PLACEHOLDER') {
      iframe.src = `https://app.trugen.ai/embed?agentId=${TRUGEN_AGENT_ID}`;
      iframe.style.opacity = '1';
      placeholder.style.opacity = '0';
      setTimeout(() => placeholder.style.display = 'none', 600);
    } else {
      placeholder.querySelector('p').innerHTML = 
        'Sofia is ready — add your TruGen agent ID to bring her to life.';
    }

    document.getElementById('sofia').scrollIntoView({ behavior: 'smooth' });
  }

  // ── VIDEO FADE IN ──
  function showVideo(treatmentKey) {
    const map = TREATMENT_VIDEOS[treatmentKey.toLowerCase()];
    if (!map) return;

    const overlay = document.getElementById('video-overlay');
    const video = document.getElementById('treatment-video');
    const label = document.getElementById('video-label');
    const iframe = document.getElementById('trugen-iframe');

    label.textContent = map.label;

    overlay.innerHTML = '';
    const yt = document.createElement('iframe');
    yt.src = map.url;
    yt.allow = 'autoplay; encrypted-media';
    yt.style.cssText = 'width:100%;height:100%;border:none;';
    overlay.appendChild(yt);

    const lbl = document.createElement('div');
    lbl.className = 'video-label';
    lbl.textContent = map.label;
    overlay.appendChild(lbl);

    const btn = document.createElement('button');
    btn.className = 'video-skip';
    btn.textContent = 'Skip ✕';
    btn.onclick = hideVideo;
    overlay.appendChild(btn);

    iframe.style.opacity = '0.1';
    overlay.classList.add('active');

    window._videoTimer = setTimeout(hideVideo, 20000);
  }

  // ── VIDEO FADE OUT ──
  function hideVideo() {
    clearTimeout(window._videoTimer);
    const overlay = document.getElementById('video-overlay');
    const iframe = document.getElementById('trugen-iframe');

    overlay.classList.remove('active');
    iframe.style.opacity = '1';

    setTimeout(() => { overlay.innerHTML = ''; }, 700);
  }

  function askSofia(topic) {
    startConversation(null);
  }

  const TRIGGERS = {
    'show you': true,
    'quick video': true,
    'let me show': true,
    'take a look': true,
  };

  function checkForVideoTrigger(text) {
    const lower = text.toLowerCase();
    const hasVideoCue = Object.keys(TRIGGERS).some(t => lower.includes(t));
    if (!hasVideoCue) return;
    if (lower.includes('neuro') || lower.includes('botox') || lower.includes('dysport')) {
      showVideo('neuromodulators');
    } else if (lower.includes('filler') || lower.includes 'volume') || lower.includes('lift')) {
      showVideo('dermal fillers');
    } else if (lower.includes('laser') || lower.includes('light') || lower.includes('ipl') || lower.includes('resurface')) {
      showVideo('laser');
    } else if (lower.includes('body') || lower.includes('sculpt') || lower.includes('contour')) {
      showVideo('body contouring');
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  window.trugenEvent = function(eventName, payload) {
    if (eventName === 'utterance_committed' && payload?.text) {
      checkForVideoTrigger(payload.text);
    }
    if (eventName === 'show_video' && payload?.treatment) {
      showVideo(payload.treatment);
    }
    if (eventName === 'hide_video') {
      hideVideo();
    }
  };

  console.log('%c✨ Lumière Demo', 'font-family:serif;font-size:18px;color:#C9A96E;');
  console.log('%cTo trigger video overlay: trugenEvent("show_video", { treatment: "laser" })', 'color:#9A9088;font-size:12px;');
  console.log('%cTreatments: neuromodulators | dermal fillers | laser | body contouring', 'color:#9A9088;font-size:12px;');