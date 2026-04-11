/**
 * KuttyAI — chat.js
 * Author  : Student User (Husen)
 * Stack   : JavaScript ES6+ + jQuery 3.7
 *
 * Sections:
 *   1. Splash / Intro Animation
 *   2. Constants & State
 *   3. Helpers
 *   4. addMessage()
 *   5. sendMessage()
 *   6. Typing Indicator
 *   7. Input Handling
 *   8. Suggestion Cards
 *   9. Sidebar (mobile)
 *  10. New Chat Reset
 *  11. Dark Mode
 *  12. Export Chat
 *  13. Init
 */

/* ══════════════════════════════════════════════════════════════
   1. SPLASH / INTRO ANIMATION
   ══════════════════════════════════════════════════════════════ */

(function runSplash () {

  /* ── Particle canvas ── */
  const canvas  = document.getElementById('splash-canvas');
  const ctx     = canvas.getContext('2d');
  let   W, H, particles = [], rafId;

  function resizeCanvas () {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  /* Create 80 small teal particles */
  for (let i = 0; i < 80; i++) {
    particles.push({
      x:    Math.random() * window.innerWidth,
      y:    Math.random() * window.innerHeight,
      r:    Math.random() * 1.8 + 0.4,
      vx:   (Math.random() - 0.5) * 0.35,
      vy:   (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.15,
    });
  }

  function drawParticles () {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,207,200,${p.alpha})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
    rafId = requestAnimationFrame(drawParticles);
  }

  drawParticles();

  /* ── Loading bar fill ── */
  const bar      = document.getElementById('splash-loader-bar');
  const DURATION = 2200; // total ms before exit
  let   filled   = 0;
  const fillStep = 100 / (DURATION / 50);

  const fillTimer = setInterval(() => {
    filled = Math.min(filled + fillStep + Math.random() * fillStep, 100);
    if (bar) bar.style.width = filled + '%';
    if (filled >= 100) clearInterval(fillTimer);
  }, 50);

  /* ── Exit after DURATION ms ── */
  setTimeout(() => {
    /* 1. Fly the logo toward where the sidebar brand will be */
    const logoWrap = document.getElementById('splash-logo-wrap');
    if (logoWrap) logoWrap.classList.add('logo-fly');

    /* 2. Fade out splash after logo starts flying */
    setTimeout(() => {
      const splash = document.getElementById('intro-splash');
      if (splash) splash.classList.add('splash-exit');

      /* 3. After exit, hide splash and show app */
      setTimeout(() => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resizeCanvas);

        if (splash) splash.style.display = 'none';

        const app = document.getElementById('app');
        if (app) {
          app.classList.remove('app-hidden');
          app.classList.add('app-visible');
        }
      }, 680); // match splashExit animation duration

    }, 300); // slight overlap between logo fly + fade

  }, DURATION);

})();


/* ══════════════════════════════════════════════════════════════
   2. CONSTANTS & STATE (jQuery document-ready wrapper)
   ══════════════════════════════════════════════════════════════ */

$(function () {

  /* Mock AI responses */
  const AI_RESPONSES = [
    "That's a great question, Husen! Let me think through this carefully.\n\nBased on what you've shared, I'd recommend starting with the fundamentals before moving on to advanced topics. Breaking the problem into smaller parts usually makes it much more manageable.",
    "Absolutely! Here's a clear breakdown:\n\n**Step 1** — Understand the core concept\n**Step 2** — Apply it in a simple example\n**Step 3** — Gradually increase complexity\n\nThis step-by-step approach works well for most learning scenarios.",
    "Great point! There are a few perspectives to consider here. The most important thing is to focus on what matters most to your specific use case. Would you like me to elaborate on any particular aspect?",
    "Sure thing! In summary:\n\n- Clarity beats complexity every time\n- Always test your assumptions early\n- Document as you go — your future self will thank you\n\nLet me know if you'd like a deeper dive into any of these.",
    "Interesting! This topic has a lot of depth. The key insight is that understanding *why* something works is just as important as knowing *how* it works. Shall I walk you through the reasoning step by step?",
    "Of course! I can help with that. The best approach depends on a few factors — the scope, the constraints, and the desired outcome. Could you give me a bit more context so I can tailor my answer?",
    "Here's a concise answer:\n\nThe best practice in this situation is to keep things simple and iterative. Start small, validate quickly, and build from there. Over-engineering early is one of the most common pitfalls.",
    "Great observation! You're thinking along the right lines. The nuance here is that context matters enormously. What works perfectly in one situation might not translate directly to another — which is why adaptability is such a valuable skill.",
  ];

  let chatStarted = false;


  /* ══════════════════════════════════════════════════════════════
     3. HELPERS
  ══════════════════════════════════════════════════════════════ */

  /** Returns "H:MM AM/PM" */
  function getTimestamp () {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  /** Random pick from array */
  function randomPick (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /** Smooth-scroll messages area to bottom */
  function scrollToBottom () {
    const $s = $('#messages-section');
    $s.animate({ scrollTop: $s[0].scrollHeight }, 260);
  }

  /**
   * Basic markdown-like formatting:
   *  ```block``` → <pre><code>...</code></pre>
   *  `inline`    → <code>...</code>
   *  **bold**    → <strong>...</strong>
   *  *italic*    → <em>...</em>
   *  \n          → <br>
   */
  function formatText (text) {
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/\n/g, '<br>');
    return text;
  }


  /* ══════════════════════════════════════════════════════════════
     4. ADD MESSAGE
  ══════════════════════════════════════════════════════════════ */

  /**
   * addMessage(text, sender)
   *   Creates and appends a message bubble to #chat-messages.
   *   sender: 'user' | 'ai'
   */
  function addMessage (text, sender) {
    const isUser    = sender === 'user';
    const cls       = isUser ? 'user-message' : 'ai-message';
    const name      = isUser ? 'Husen' : 'KuttyAI';
    const avatarCls = isUser ? 'user-avatar-msg' : 'ai-avatar';
    const avatarLtr = isUser ? 'H' : 'K';
    const time      = getTimestamp();
    const html      = formatText(text);

    const $msg = $(`
      <div class="message ${cls}">
        <div class="message-avatar ${avatarCls}">${avatarLtr}</div>
        <div class="message-body">
          <div class="message-header">
            <span class="message-name">${name}</span>
            <span class="message-time">${time}</span>
          </div>
          <div class="message-bubble">${html}</div>
        </div>
      </div>
    `);

    $('#chat-messages').append($msg);
    scrollToBottom();
  }


  /* ══════════════════════════════════════════════════════════════
     5. SEND MESSAGE
  ══════════════════════════════════════════════════════════════ */

  function sendMessage () {
    const text = $('#message-input').val().trim();
    if (!text) return;

    /* Hide welcome screen on first send */
    if (!chatStarted) {
      $('#welcome-screen').addClass('hidden');
      chatStarted = true;
    }

    addMessage(text, 'user');
    $('#message-input').val('').trigger('input');
    $('#send-btn').prop('disabled', true);

    showTypingIndicator();

    /* Simulate AI delay: 1.0 – 2.0 s */
    const delay = 1000 + Math.random() * 1000;
    setTimeout(function () {
      hideTypingIndicator();
      addMessage(randomPick(AI_RESPONSES), 'ai');
    }, delay);
  }


  /* ══════════════════════════════════════════════════════════════
     6. TYPING INDICATOR
  ══════════════════════════════════════════════════════════════ */

  function showTypingIndicator () {
    $('#typing-indicator').removeClass('hidden');
    scrollToBottom();
  }

  function hideTypingIndicator () {
    $('#typing-indicator').addClass('hidden');
  }


  /* ══════════════════════════════════════════════════════════════
     7. INPUT HANDLING
  ══════════════════════════════════════════════════════════════ */

  /** Auto-resize textarea */
  function autoResize () {
    const ta = document.getElementById('message-input');
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
  }

  /* Enable / disable send button */
  $('#message-input').on('input', function () {
    autoResize();
    $('#send-btn').prop('disabled', $(this).val().trim().length === 0);
  });

  /* Enter = send, Shift+Enter = new line */
  $('#message-input').on('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  /* Send button click */
  $('#send-btn').on('click', sendMessage);


  /* ══════════════════════════════════════════════════════════════
     8. SUGGESTION CARDS
  ══════════════════════════════════════════════════════════════ */

  $(document).on('click', '.suggestion-card', function () {
    const prompt = $(this).data('prompt');
    $('#message-input').val(prompt).trigger('input').focus();
    sendMessage();
  });


  /* ══════════════════════════════════════════════════════════════
     9. SIDEBAR — MOBILE
  ══════════════════════════════════════════════════════════════ */

  $('#hamburger-btn').on('click', function () {
    $('#sidebar').addClass('open');
    $('#sidebar-overlay').addClass('active');
    $('body').css('overflow', 'hidden');
  });

  $('#sidebar-overlay').on('click', closeSidebar);

  $('#new-chat-btn').on('click', function () {
    resetChat();
    closeSidebar();
  });

  $(document).on('click', '.history-item', function () {
    $('.history-item').removeClass('active');
    $(this).addClass('active');
    closeSidebar();
  });

  function closeSidebar () {
    $('#sidebar').removeClass('open');
    $('#sidebar-overlay').removeClass('active');
    $('body').css('overflow', '');
  }


  /* ══════════════════════════════════════════════════════════════
     10. NEW CHAT RESET
  ══════════════════════════════════════════════════════════════ */

  function resetChat () {
    $('#chat-messages').empty();
    hideTypingIndicator();
    chatStarted = false;
    $('#welcome-screen').removeClass('hidden');
    $('#message-input').val('').trigger('input');
    /* Re-trigger welcome animation */
    const ws = document.getElementById('welcome-screen');
    ws.style.animation = 'none';
    void ws.offsetWidth;
    ws.style.animation = '';
  }


  /* ══════════════════════════════════════════════════════════════
     11. DARK MODE
  ══════════════════════════════════════════════════════════════ */

  /* Restore saved preference */
  (function initTheme () {
    if (localStorage.getItem('kuttyai-theme') === 'dark') {
      $('body').addClass('dark-mode');
      $('#theme-icon').removeClass('fa-moon').addClass('fa-sun');
    }
  })();

  $('#theme-toggle').on('click', function () {
    const dark = $('body').toggleClass('dark-mode').hasClass('dark-mode');
    const $ic  = $('#theme-icon');
    if (dark) {
      $ic.removeClass('fa-moon').addClass('fa-sun');
      localStorage.setItem('kuttyai-theme', 'dark');
    } else {
      $ic.removeClass('fa-sun').addClass('fa-moon');
      localStorage.setItem('kuttyai-theme', 'light');
    }
  });


  /* ══════════════════════════════════════════════════════════════
     12. EXPORT CHAT (Blob API)
  ══════════════════════════════════════════════════════════════ */

  $('#export-btn').on('click', function () {
    const $msgs = $('#chat-messages .message');
    if (!$msgs.length) {
      alert('No messages to export yet. Start a conversation first!');
      return;
    }

    let content  = 'KuttyAI — Conversation Export\n';
    content     += '================================\n';
    content     += 'User     : Husen\n';
    content     += 'Exported : ' + new Date().toLocaleString() + '\n\n';

    $msgs.each(function () {
      const isUser = $(this).hasClass('user-message');
      const name   = isUser ? 'Husen' : 'KuttyAI';
      const time   = $(this).find('.message-time').text();
      const text   = $(this).find('.message-bubble').text().trim();
      content += `[${time}] ${name}:\n${text}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'KuttyAI_export_Husen.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });


  /* ══════════════════════════════════════════════════════════════
     13. INIT
  ══════════════════════════════════════════════════════════════ */

  if (window.innerWidth > 768) {
    /* Focus input slightly after app reveals (after splash) */
    setTimeout(() => $('#message-input').focus(), 2600);
  }

  console.log('%cKuttyAI — Loaded ✓  |  User: Husen', 'color:#00cfc8;font-size:14px;font-weight:bold;');

});
