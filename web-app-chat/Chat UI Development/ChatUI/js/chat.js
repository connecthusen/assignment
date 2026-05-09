/**
 * KuttyAI — chat.js  (Professional Edition)
 * Author  : Husen
 * Stack   : JavaScript ES6+ · jQuery 3.7
 *
 * Features:
 *   • Splash intro animation with canvas particles
 *   • Voice / Speech-to-Text input (Web Speech API)
 *   • Smart message rendering with markdown formatting
 *   • Typing indicator with realistic delay
 *   • Dark mode with localStorage persistence
 *   • Export chat as .txt via Blob API
 *   • Character counter
 *   • Mobile sidebar
 */

/* ══════════════════════════════════════════════════════
   1.  SPLASH ANIMATION
   ══════════════════════════════════════════════════════ */
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


/* ══════════════════════════════════════════════════════
   2.  APP — jQuery ready
   ══════════════════════════════════════════════════════ */
$(function () {

  let currentConversationId = null;
  let chatStarted  = false;
  let isRecording  = false;
  let recognition  = null;

  /* ── Voice Support Detection ── */
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const voiceSupported    = !!SpeechRecognition;

  if (!voiceSupported) {
    $('#mic-btn').attr('title', 'Voice input not supported in this browser')
                 .css('opacity', '0.35').prop('disabled', true);
  }


  /* ════════════════════════════════════════════════════
     3.  HELPERS
  ════════════════════════════════════════════════════ */

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

  // Configure marked to use highlight.js
  if (window.marked && window.hljs) {
    marked.setOptions({
      highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
      breaks: true
    });
  }

  function fmt (txt) {
    if (!window.marked || !window.DOMPurify) return txt.replace(/\n/g, '<br>');
    let html = marked.parse(txt);
    html = DOMPurify.sanitize(html);
    
    // Inject Copy Code button
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    doc.querySelectorAll('pre code').forEach((block) => {
      const pre = block.parentElement;
      const langClass = Array.from(block.classList).find(c => c.startsWith('language-'));
      const lang = langClass ? langClass.replace('language-', '') : 'Code';
      
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      
      const header = document.createElement('div');
      header.className = 'code-block-header';
      header.innerHTML = `
        <span>${lang}</span>
        <button class="copy-code-btn" title="Copy code">
          <i class="fa-regular fa-copy"></i> Copy
        </button>
      `;
      
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
    
    return doc.body.innerHTML;
  }
  
  // Copy Code Logic
  $(document).on('click', '.copy-code-btn', function() {
    const $btn = $(this);
    const code = $btn.closest('.code-block-wrapper').find('code').text();
    navigator.clipboard.writeText(code).then(() => {
      $btn.html('<i class="fa-solid fa-check"></i> Copied!');
      setTimeout(() => {
        $btn.html('<i class="fa-regular fa-copy"></i> Copy');
      }, 2000);
    });
  });

  function updateCharCount () {
    const len = $('#message-input').val().length;
    $('#char-count').text(len > 0 ? `${len} char${len !== 1 ? 's' : ''}` : '');
  }


  /* ════════════════════════════════════════════════════
     4.  ADD MESSAGE
  ════════════════════════════════════════════════════ */
  function addMessage (text, sender) {
    const isUser    = sender === 'user';
    const cls       = isUser ? 'user-message' : 'ai-message';
    const name      = isUser ? 'Husen' : 'KuttyAI';
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


  /* ════════════════════════════════════════════════════
     5.  SEND MESSAGE
  ════════════════════════════════════════════════════ */
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
    
    // Clear attachment after sending
    clearAttachment();

    showTyping();
    
    // Call backend API
    fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: text,
            conversation_id: currentConversationId,
            model: $('#model-label').text()
        })
    })
    .then(response => response.json())
    .then(data => {
        hideTyping();
        if (data.success) {
            currentConversationId = data.data.conversation_id;
            addMessage(data.data.response, 'ai');
            loadConversations(); // refresh the sidebar
        } else {
            addMessage("Sorry, I encountered an error: " + data.error, 'ai');
        }
    })
    .catch(error => {
        hideTyping();
        addMessage("Sorry, I couldn't reach the server. Is the API running?", 'ai');
        console.error('Error:', error);
    });
  }


  /* ════════════════════════════════════════════════════
     6.  TYPING INDICATOR
  ════════════════════════════════════════════════════ */
  function showTyping () { $('#typing-indicator').removeClass('hidden'); scrollBottom(); }
  function hideTyping () { $('#typing-indicator').addClass('hidden'); }


  /* ════════════════════════════════════════════════════
     7.  INPUT HANDLING
  ════════════════════════════════════════════════════ */
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
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      sendMessage(); 
    }
    // Shift+Enter natively creates a new line in textarea, so no extra code needed for it.
  });

  $('#send-btn').on('click', sendMessage);

  /* ════════════════════════════════════════════════════
     7.5 FILE ATTACHMENTS & DRAG & DROP
  ════════════════════════════════════════════════════ */
  let currentFile = null;

  function clearAttachment() {
    currentFile = null;
    $('#file-upload-input').val('');
    $('#attachment-preview').addClass('hidden');
    $('#attachment-img').attr('src', '');
  }

  function handleFile(file) {
    if (!file) return;
    currentFile = file;
    
    // Image preview (frontend only for now)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        $('#attachment-img').attr('src', e.target.result);
        $('#attachment-preview').removeClass('hidden');
      }
      reader.readAsDataURL(file);
    } 
    // Document Upload for RAG (PDF, TXT)
    else if (file.type === 'application/pdf' || file.type === 'text/plain') {
      const formData = new FormData();
      formData.append('file', file);
      
      // Show uploading indicator
      addMessage(`Uploading ${file.name} to KuttyAI Knowledge Base...`, 'ai');
      
      fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          addMessage(`✅ **Success**: ${data.message}`, 'ai');
        } else {
          addMessage(`❌ **Error**: ${data.error}`, 'ai');
        }
      })
      .catch(error => {
        console.error('Upload Error:', error);
        addMessage(`❌ **Upload failed**: Could not reach the server.`, 'ai');
      })
      .finally(() => {
        clearAttachment();
      });
    } else {
      alert(`Attached file: ${file.name}\n(Only Images, PDFs, and TXT files are fully supported currently)`);
      clearAttachment();
    }
  }

  $('#attach-btn').on('click', function(e) {
    e.preventDefault();
    $('#file-upload-input').click();
  });

  $('#file-upload-input').on('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  $('#attachment-remove').on('click', function(e) {
    e.preventDefault();
    clearAttachment();
  });

  // Drag and drop events
  const $inputContainer = $('#input-container');

  $inputContainer.on('dragover dragenter', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $inputContainer.addClass('drag-over');
  });

  $inputContainer.on('dragleave dragend drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $inputContainer.removeClass('drag-over');
  });

  $inputContainer.on('drop', function(e) {
    const files = e.originalEvent.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  });


  /* ════════════════════════════════════════════════════
     8.  VOICE / SPEECH INPUT
  ════════════════════════════════════════════════════ */

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


  /* ════════════════════════════════════════════════════
     9.  SUGGESTION CARDS
  ════════════════════════════════════════════════════ */
  $(document).on('click', '.suggestion-card', function () {
    $('#message-input').val($(this).data('prompt')).trigger('input').focus();
    sendMessage();
  });


  /* ════════════════════════════════════════════════════
    10.  SIDEBAR PANEL
  ════════════════════════════════════════════════════ */
  function openPanel () {
    $('#sidebar-panel').addClass('open');
    $('body').addClass('sidebar-open');
    $('#sidebar-overlay').addClass('active');
    if (window.innerWidth <= 768) {
      $('body').css('overflow', 'hidden');
    }
  }

  function closePanel () {
    $('#sidebar-panel').removeClass('open');
    $('body').removeClass('sidebar-open');
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
    
    const convId = $(this).data('chat');
    loadConversationHistory(convId);
    
    closePanel();
  });


  /* ════════════════════════════════════════════════════
    11.  RESET CHAT
  ════════════════════════════════════════════════════ */
  function resetChat () {
    $('#chat-messages').empty();
    hideTyping();
    stopRecording();
    chatStarted = false;
    $('#welcome-screen').removeClass('hidden');
    currentConversationId = null;
    $('#message-input').val('').trigger('input');
    updateCharCount();
    const ws = document.getElementById('welcome-screen');
    if(ws) { ws.style.animation = 'none'; void ws.offsetWidth; ws.style.animation = ''; }
  }


  /* ════════════════════════════════════════════════════
    12.  DARK MODE
  ════════════════════════════════════════════════════ */
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


  /* ════════════════════════════════════════════════════
    13.  EXPORT CHAT
  ════════════════════════════════════════════════════ */
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


  /* ════════════════════════════════════════════════════
     15.  API INTEGRATION
  ════════════════════════════════════════════════════ */
  
  function formatDateShort(isoStr) {
      if (!isoStr) return "";
      const d = new Date(isoStr);
      return `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  function loadConversations() {
      fetch('http://localhost:5000/api/conversations')
        .then(res => res.json())
        .then(data => {
            if(data.success && data.data) {
                const list = $('#sp-history-list');
                list.empty();
                data.data.forEach(conv => {
                    const activeClass = (conv.id === currentConversationId) ? 'active' : '';
                    const title = conv.title || "New Chat";
                    const time = formatDateShort(conv.updated_at || conv.created_at);
                    
                    list.append(`
                        <li class="sp-history-item ${activeClass}" data-chat="${conv.id}">
                          <i class="fa-regular fa-message"></i>
                          <div class="sp-item-info">
                            <span class="sp-item-title">${title}</span>
                            <span class="sp-item-time">${time}</span>
                          </div>
                          <button class="sp-item-delete" title="Delete chat" aria-label="Delete chat"><i class="fa-solid fa-trash-can"></i></button>
                        </li>
                    `);
                });
            }
        }).catch(err => console.error("Error loading conversations", err));
  }
  
  function loadConversationHistory(convId) {
      fetch(`http://localhost:5000/api/conversations/${convId}`)
        .then(res => res.json())
        .then(data => {
            if(data.success && data.data) {
                $('#chat-messages').empty();
                chatStarted = true;
                $('#welcome-screen').addClass('hidden');
                currentConversationId = convId;
                
                data.data.messages.forEach(msg => {
                    addMessage(msg.content, msg.role === 'user' ? 'user' : 'ai');
                });
            }
        }).catch(err => console.error("Error loading conversation history", err));
  }

  /* ════════════════════════════════════════════════════
    16.  INIT
  ════════════════════════════════════════════════════ */
  if (window.innerWidth > 768) {
    openPanel(); // Open by default on desktop
    setTimeout(() => $('#message-input').focus(), 2700);
  }
  
  loadConversations();

  console.log('%c⚡ KuttyAI  |  User: Husen  |  Loaded ✓', 'color:#00cfc8;font-size:13px;font-weight:bold;');

});

  /* ════════════════════════════════════════════════════
     MODEL DROPDOWN
  ════════════════════════════════════════════════════ */
  (function initModelDropdown () {

    const $btn      = $('#model-selector-btn');
    const $dropdown = $('#model-dropdown');
    const $label    = $('#model-label');
    const $arrow    = $('#model-arrow');

    // Toggle open/close
    $btn.on('click', function (e) {
      e.stopPropagation();
      const isOpen = $dropdown.hasClass('open');
      $dropdown.toggleClass('open', !isOpen);
      $btn.toggleClass('open', !isOpen);
    });

    // Select a model
    $(document).on('click', '.model-item', function () {
      const model = $(this).data('model');
      $('.model-item').removeClass('active');
      $(this).addClass('active');
      $label.text(model);
      $dropdown.removeClass('open');
      $btn.removeClass('open');
    });

    // Close on outside click
    $(document).on('click', function (e) {
      if (!$(e.target).closest('#model-dropdown-wrap').length) {
        $dropdown.removeClass('open');
        $btn.removeClass('open');
      }
    });

    // Close on Escape
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        $dropdown.removeClass('open');
        $btn.removeClass('open');
      }
    });

  })();


  /* ════════════════════════════════════════════════════
     DELETE HISTORY ITEM (sidebar bin)
  ════════════════════════════════════════════════════ */
  $(document).on('click', '.sp-item-delete', function (e) {
    e.stopPropagation(); // don't trigger the history item click
    const $item = $(this).closest('.sp-history-item');
    const convId = $item.data('chat');
    
    fetch(`http://localhost:5000/api/conversations/${convId}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
          if(data.success) {
            $item.css({ transition: 'opacity 0.25s, transform 0.25s', opacity: 0, transform: 'translateX(-12px)' });
            setTimeout(() => {
                $item.remove();
                if(currentConversationId === convId) {
                    resetChat();
                }
            }, 260);
          }
      });
  });

  /* ════════════════════════════════════════════════════
     CLEAR CHAT (top-right trash icon)
  ════════════════════════════════════════════════════ */
  $('#clear-chat-btn').on('click', function () {
    if (!$('#chat-messages').children().length) return;
    if (!confirm('Clear this conversation? This cannot be undone.')) return;
    
    if (currentConversationId) {
        fetch(`http://localhost:5000/api/conversations/${currentConversationId}`, { method: 'DELETE' })
            .then(() => {
                resetChat();
                loadConversations();
            });
    } else {
        resetChat();
    }
  });

