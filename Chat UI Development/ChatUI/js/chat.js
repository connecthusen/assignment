
/* 1.  SPLASH ANIMATION */
(function runSplash () {

  const canvas = document.getElementById('splash-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, raf;

  function resize () {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* 90 drifting teal particles */
  const dots = Array.from({ length: 90 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.7 + 0.4,
    vx: (Math.random() - 0.5) * 0.30,
    vy: (Math.random() - 0.5) * 0.30,
    a: Math.random() * 0.45 + 0.12,
  }));

  function draw () {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,207,200,${d.a})`;
      ctx.fill();
      d.x = (d.x + d.vx + W) % W;
      d.y = (d.y + d.vy + H) % H;
    });
    raf = requestAnimationFrame(draw);
  }
  draw();

  /* Loading bar fill */
  const TOTAL = 2400;
  const bar = document.getElementById('splash-loader-bar');
  let pct = 0;
  const timer = setInterval(() => {
    pct = Math.min(pct + (100 / (TOTAL / 45)) * (0.8 + Math.random() * 0.6), 100);
    if (bar) bar.style.width = pct + '%';
    if (pct >= 100) clearInterval(timer);
  }, 45);

  /* Exit sequence */
  setTimeout(() => {
    const wrap = document.getElementById('splash-logo-wrap');
    if (wrap) wrap.classList.add('logo-fly');

    setTimeout(() => {
      const splash = document.getElementById('intro-splash');
      if (splash) splash.classList.add('splash-exit');

      setTimeout(() => {
        cancelAnimationFrame(raf);
        if (splash) splash.style.display = 'none';
        const app = document.getElementById('app');
        if (app) { app.classList.remove('app-hidden'); app.classList.add('app-visible'); }
      }, 660);
    }, 280);
  }, TOTAL);

})();


/*  2.  APP — jQuery ready */
$(function () {

  /* ── AI Response Pool ── */
  const RESPONSES = [
    "That's a great question, Husen! Let me break this down clearly.\n\nThe best approach here is to start simple, validate your assumptions, and iterate. Breaking the problem into smaller, testable pieces makes it far more manageable and helps you catch issues early.",
    "Absolutely! Here's a structured breakdown:\n\n**Step 1** — Understand the core concept deeply\n**Step 2** — Apply it with a minimal example\n**Step 3** — Build complexity gradually\n\nThis approach ensures a solid foundation before moving forward.",
    "Great point! There are a few perspectives worth considering here:\n\n- Focus on what matters most for your use case\n- Don't over-engineer the first version\n- Measure results and adjust accordingly\n\nWould you like me to elaborate on any of these?",
    "Of course! Here's the key insight:\n\n- **Clarity** beats complexity every time\n- Always test your assumptions early\n- Document decisions as you make them — your future self will thank you\n\nShall I go deeper on any of these?",
    "Interesting question! This topic has quite a bit of depth. The crucial insight is that understanding *why* something works is just as important as knowing *how* it works. Shall I walk you through the reasoning step by step?",
    "Sure thing! The approach I'd recommend depends on your specific constraints — scope, timeline, and desired outcome. Could you share a bit more context so I can give you a more tailored answer?",
    "Here's a concise, professional answer:\n\nThe best practice is to **keep things lean and iterative** — start with the minimum viable version, validate it quickly, and build from there. Over-engineering at the start is one of the most common (and costly) mistakes.",
    "You're thinking along the right lines, Husen. The key nuance is that context matters enormously — what works perfectly in one situation may not directly translate to another. Adaptability and critical thinking are your best tools here.",
  ];

  let chatStarted  = false;
  let isRecording  = false;
  let recognition  = null;

  /*Voice Support Detection  */
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const voiceSupported    = !!SpeechRecognition;

  if (!voiceSupported) {
    $('#mic-btn').attr('title', 'Voice input not supported in this browser')
                 .css('opacity', '0.35').prop('disabled', true);
  }


  /*  3.  HELPERS */

  function timestamp () {
    const n = new Date();
    let h = n.getHours(), m = n.getMinutes().toString().padStart(2,'0');
    const a = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${m} ${a}`;
  }

  function pick (arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function scrollBottom () {
    const $s = $('#messages-section');
    $s.animate({ scrollTop: $s[0].scrollHeight }, 260);
  }

  
  function fmt (txt) {
    txt = txt.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    txt = txt.replace(/`([^`]+)`/g, '<code>$1</code>');
    txt = txt.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    txt = txt.replace(/\*([^*\n]+)\*/g,   '<em>$1</em>');
    txt = txt.replace(/\n/g, '<br>');
    return txt;
  }

  function updateCharCount () {
    const len = $('#message-input').val().length;
    $('#char-count').text(len > 0 ? `${len} char${len !== 1 ? 's' : ''}` : '');
  }


  /*  4.  ADD MESSAGE */
  function addMessage (text, sender) {
    const isUser    = sender === 'user';
    const cls       = isUser ? 'user-message' : 'ai-message';
    const name      = isUser ? 'Husen' : 'Kutty.AI';
    const avatarCls = isUser ? 'user-avatar-msg' : 'ai-avatar';
    const avatarInner = isUser
      ? 'H'
      : '<img src="images/kuttyai-logo.png" alt="K" class="avatar-logo-img"/>';
    const time = timestamp();

    const $msg = $(`
      <div class="message ${cls}">
        <div class="message-avatar ${avatarCls}">${avatarInner}</div>
        <div class="message-body">
          <div class="message-header">
            <span class="message-name">${name}</span>
            <span class="message-time">${time}</span>
          </div>
          <div class="message-bubble">${fmt(text)}</div>
        </div>
      </div>
    `);

    $('#chat-messages').append($msg);
    scrollBottom();
  }


  /* 5.  SEND MESSAGE */
  function sendMessage () {
    const text = $('#message-input').val().trim();
    if (!text) return;

    if (!chatStarted) {
      $('#welcome-screen').addClass('hidden');
      chatStarted = true;
    }

    addMessage(text, 'user');
    $('#message-input').val('').trigger('input');
    $('#send-btn').prop('disabled', true);
    updateCharCount();

    showTyping();
    setTimeout(() => { hideTyping(); addMessage(pick(RESPONSES), 'ai'); },
      1000 + Math.random() * 1100);
  }


  /*  6.  TYPING INDICATOR */
  function showTyping () { $('#typing-indicator').removeClass('hidden'); scrollBottom(); }
  function hideTyping () { $('#typing-indicator').addClass('hidden'); }


  /*    7.  INPUT HANDLING */
  function autoResize () {
    const ta = document.getElementById('message-input');
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
  }

  $('#message-input').on('input', function () {
    autoResize();
    $('#send-btn').prop('disabled', $(this).val().trim().length === 0);
    updateCharCount();
  });

  $('#message-input').on('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  $('#send-btn').on('click', sendMessage);


  /* 8.  VOICE / SPEECH INPUT  */

  function startRecording () {
    if (!voiceSupported || isRecording) return;

    recognition = new SpeechRecognition();
    recognition.lang        = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous  = false;

    isRecording = true;
    $('#mic-btn').addClass('recording');
    $('#mic-icon').removeClass('fa-microphone').addClass('fa-stop');
    $('#voice-banner').removeClass('hidden');
    $('#voice-status-text').text('Listening… speak now');

    let finalTranscript = '';
    let interimTranscript = '';

    recognition.onresult = function (e) {
      finalTranscript = '';
      interimTranscript = '';

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalTranscript += t;
        } else {
          interimTranscript += t;
        }
      }

      /* Show interim in input box */
      const display = finalTranscript || interimTranscript;
      if (display) {
        $('#message-input').val(display).trigger('input');
        $('#voice-status-text').text(`"${display.slice(0, 40)}${display.length > 40 ? '…' : ''}"`);
      }
    };

    recognition.onerror = function (e) {
      const msgs = {
        'no-speech':         'No speech detected. Try again.',
        'audio-capture':     'Microphone not accessible.',
        'not-allowed':       'Microphone permission denied.',
        'network':           'Network error during recognition.',
      };
      $('#voice-status-text').text(msgs[e.error] || 'Recognition error. Try again.');
      setTimeout(stopRecording, 1600);
    };

    recognition.onend = function () {
      stopRecording();
      /* Auto-send if we captured something */
      if ($('#message-input').val().trim()) {
        setTimeout(sendMessage, 300);
      }
    };

    recognition.start();
  }

  function stopRecording () {
    if (!isRecording) return;
    isRecording = false;

    if (recognition) { try { recognition.stop(); } catch(e){} recognition = null; }

    $('#mic-btn').removeClass('recording');
    $('#mic-icon').removeClass('fa-stop').addClass('fa-microphone');
    $('#voice-banner').addClass('hidden');
    $('#voice-status-text').text('Listening…');
  }

  /* Mic button toggles recording */
  $('#mic-btn').on('click', function () {
    if (isRecording) { stopRecording(); }
    else             { startRecording(); }
  });

  /* Cancel button */
  $('#voice-cancel-btn').on('click', function () {
    stopRecording();
    $('#message-input').val('').trigger('input');
  });


  /* 9.  SUGGESTION CARDS */
  $(document).on('click', '.suggestion-card', function () {
    $('#message-input').val($(this).data('prompt')).trigger('input').focus();
    sendMessage();
  });


  /*  10.  SIDEBAR PANEL */
  function openPanel () {
    $('#sidebar-panel').addClass('open');
    $('#sidebar-overlay').addClass('active');
    $('body').css('overflow', 'hidden');
  }

  function closePanel () {
    $('#sidebar-panel').removeClass('open');
    $('#sidebar-overlay').removeClass('active');
    $('body').css('overflow', '');
  }

  // Hamburger opens panel
  $('#hamburger-btn').on('click', openPanel);

  // Overlay click closes
  $('#sidebar-overlay').on('click', closePanel);

  // Close button inside panel
  $('#sp-close-btn').on('click', closePanel);

  // New Chat button in panel
  $('#sp-new-chat-btn').on('click', function () {
    resetChat(); closePanel();
    $('.sp-history-item').removeClass('active');
    $('.sp-history-item').first().addClass('active');
  });

  // Search toggle
  let searchOpen = false;
  $('#sp-search-toggle-btn').on('click', function () {
    searchOpen = !searchOpen;
    $('#sp-search-box').toggleClass('open', searchOpen);
    if (searchOpen) { setTimeout(() => $('#sp-search-input').focus(), 280); }
    else { $('#sp-search-input').val('').trigger('input'); }
  });

  // Live search filter
  $('#sp-search-input').on('input', function () {
    const q = $(this).val().toLowerCase().trim();
    $('.sp-history-item').each(function () {
      const title = $(this).find('.sp-item-title').text().toLowerCase();
      $(this).toggleClass('hidden-item', q.length > 0 && !title.includes(q));
    });
  });

  // History item click
  $(document).on('click', '.sp-history-item', function () {
    $('.sp-history-item').removeClass('active');
    $(this).addClass('active');
    closePanel();
  });


  /* 11.  RESET CHAT */
  function resetChat () {
    $('#chat-messages').empty();
    hideTyping();
    stopRecording();
    chatStarted = false;
    $('#welcome-screen').removeClass('hidden');
    $('#message-input').val('').trigger('input');
    updateCharCount();
    const ws = document.getElementById('welcome-screen');
    ws.style.animation = 'none'; void ws.offsetWidth; ws.style.animation = '';
  }


  /* 12.  DARK MODE  */
  (function initTheme () {
    if (localStorage.getItem('kuttyai-theme') === 'dark') {
      $('body').addClass('dark-mode');
      $('#theme-icon').removeClass('fa-moon').addClass('fa-sun');
    }
  })();

  $('#theme-toggle').on('click', function () {
    const dark = $('body').toggleClass('dark-mode').hasClass('dark-mode');
    $('#theme-icon').toggleClass('fa-moon', !dark).toggleClass('fa-sun', dark);
    localStorage.setItem('kuttyai-theme', dark ? 'dark' : 'light');
  });


  /* 13.  EXPORT CHAT */
  $('#export-btn').on('click', function () {
    const $msgs = $('#chat-messages .message');
    if (!$msgs.length) { alert('No messages to export yet. Start a conversation first!'); return; }

    let out  = '╔══════════════════════════════════════╗\n';
    out     += '║       KuttyAI — Chat Export           ║\n';
    out     += '╚══════════════════════════════════════╝\n';
    out     += `User     : Husen\n`;
    out     += `Exported : ${new Date().toLocaleString()}\n`;
    out     += '────────────────────────────────────────\n\n';

    $msgs.each(function () {
      const name = $(this).hasClass('user-message') ? 'Husen' : 'KuttyAI';
      const time = $(this).find('.message-time').text();
      const text = $(this).find('.message-bubble').text().trim();
      out += `[${time}] ${name}:\n${text}\n\n`;
    });

    const blob = new Blob([out], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'KuttyAI_Husen_export.txt' });
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  });


  /* 14.  INIT */
  if (window.innerWidth > 768) {
    setTimeout(() => $('#message-input').focus(), 2700);
  }

  console.log('%c⚡ KuttyAI  |  User: Husen  |  Loaded ✓', 'color:#00cfc8;font-size:13px;font-weight:bold;');

});
