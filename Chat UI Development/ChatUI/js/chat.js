/**
 * AuraChat — chat.js
 * Author  : Student User
 * Stack   : JavaScript (ES6+) + jQuery 3.7
 * Purpose : All chat UI functionality — messages, typing indicator,
 *           input handling, sidebar, dark mode, export, animations
 */

$(function () {

  /* ─── CONSTANTS & STATE ───────────────────────────────────── */

  /**
   * Sample mock AI responses array.
   * The bot picks one at random and delivers it with a simulated delay.
   */
  const AI_RESPONSES = [
    "That's a great question! Let me think through this carefully.\n\nBased on what you've shared, I'd recommend starting with the fundamentals before moving on to advanced topics. Breaking the problem into smaller parts usually makes it much more manageable.",
    "Absolutely! Here's a clear breakdown:\n\n**Step 1** — Understand the core concept\n**Step 2** — Apply it in a simple example\n**Step 3** — Gradually increase complexity\n\nThis approach works well for most learning scenarios.",
    "Great point! There are a few perspectives to consider here. The most important thing is to focus on what matters most to your specific use case. Would you like me to elaborate on any particular aspect?",
    "Sure thing! In short:\n\n- Clarity beats complexity every time\n- Always test your assumptions\n- Document as you go\n\nLet me know if you'd like a deeper dive into any of these.",
    "Interesting! This is actually a topic with a lot of depth. The key insight is that understanding *why* something works is just as important as knowing *how* it works. Shall I walk you through the reasoning step by step?",
    "Of course! I can help with that. The approach I'd suggest depends on a few factors — the scope, the constraints, and the desired outcome. Could you give me a bit more context so I can tailor my answer?",
    "Here's a concise answer:\n\nThe best practice in this situation is to keep things simple and iterative. Start small, validate quickly, and build from there. Over-engineering early is one of the most common pitfalls.",
    "Great observation! You're thinking along the right lines. The nuance here is that context matters a lot. What works perfectly in one situation might not translate directly to another — which is why adaptability is such a valuable skill.",
  ];

  // Track whether chat has started (to hide welcome screen)
  let chatStarted = false;

  // Track message count for chat history label
  let msgCount = 0;


  /* ─── HELPERS ─────────────────────────────────────────────── */

  /**
   * Returns current time formatted as "HH:MM AM/PM"
   */
  function getTimestamp () {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  /**
   * Pick a random element from an array
   */
  function randomPick (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Smooth-scroll messages section to the bottom
   */
  function scrollToBottom () {
    const $section = $('#messages-section');
    $section.animate({ scrollTop: $section[0].scrollHeight }, 280);
  }

  /**
   * Format message text:
   *  - **bold** → <strong>bold</strong>
   *  - *italic* → <em>italic</em>
   *  - `code` → <code>code</code>
   *  - ```block``` → <pre><code>block</code></pre>
   *  - newlines → <br>
   */
  function formatText (text) {
    // Code blocks first (``` ... ```)
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // Newlines to <br> (but not inside pre blocks)
    text = text.replace(/(?<!<\/pre>)\n/g, '<br>');
    return text;
  }


  /* ─── ADD MESSAGE ─────────────────────────────────────────── */

  /**
   * addMessage(text, sender)
   *   text   — plain text content
   *   sender — 'user' | 'ai'
   *
   * Creates a full message bubble and appends it to #chat-messages.
   * Triggers fade-in animation and auto-scrolls.
   */
  function addMessage (text, sender) {
    const isUser   = sender === 'user';
    const cls      = isUser ? 'user-message' : 'ai-message';
    const name     = isUser ? 'You' : 'AuraChat';
    const avatarCls = isUser ? 'user-avatar-msg' : 'ai-avatar';
    const avatarLetter = isUser ? 'U' : 'A';
    const time     = getTimestamp();
    const formattedText = formatText(text);

    const $msg = $(`
      <div class="message ${cls}">
        <div class="message-avatar ${avatarCls}">${avatarLetter}</div>
        <div class="message-body">
          <div class="message-header">
            <span class="message-name">${name}</span>
            <span class="message-time">${time}</span>
          </div>
          <div class="message-bubble">${formattedText}</div>
        </div>
      </div>
    `);

    $('#chat-messages').append($msg);
    scrollToBottom();
    msgCount++;
  }


  /* ─── SEND MESSAGE ────────────────────────────────────────── */

  /**
   * sendMessage()
   * Reads the textarea, validates, displays user message,
   * shows typing indicator, then shows a mock AI response.
   */
  function sendMessage () {
    const text = $('#message-input').val().trim();
    if (!text) return;

    // Hide welcome screen on first message
    if (!chatStarted) {
      $('#welcome-screen').addClass('hidden');
      chatStarted = true;
    }

    // Display user message
    addMessage(text, 'user');

    // Clear and reset input
    $('#message-input').val('').trigger('input');
    $('#send-btn').prop('disabled', true);

    // Show typing indicator
    showTypingIndicator();

    // Simulate AI thinking delay: 1000–2000 ms
    const delay = 1000 + Math.random() * 1000;

    setTimeout(function () {
      hideTypingIndicator();
      const response = randomPick(AI_RESPONSES);
      addMessage(response, 'ai');
    }, delay);
  }


  /* ─── TYPING INDICATOR ────────────────────────────────────── */

  function showTypingIndicator () {
    $('#typing-indicator').removeClass('hidden');
    scrollToBottom();
  }

  function hideTypingIndicator () {
    $('#typing-indicator').addClass('hidden');
  }


  /* ─── INPUT HANDLING ──────────────────────────────────────── */

  /**
   * Auto-resize textarea as user types.
   * Resets height to 'auto' first so shrinking works correctly.
   */
  function autoResizeInput () {
    const ta = document.getElementById('message-input');
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
  }

  // Toggle send button disabled state based on input content
  $('#message-input').on('input', function () {
    autoResizeInput();
    const hasText = $(this).val().trim().length > 0;
    $('#send-btn').prop('disabled', !hasText);
  });

  // Enter = send, Shift+Enter = new line
  $('#message-input').on('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Send button click
  $('#send-btn').on('click', function () {
    sendMessage();
  });


  /* ─── SUGGESTION CARDS ────────────────────────────────────── */

  // Clicking a card populates the input with its prompt text and sends it
  $(document).on('click', '.suggestion-card', function () {
    const prompt = $(this).data('prompt');
    $('#message-input').val(prompt).trigger('input').focus();
    sendMessage();
  });


  /* ─── SIDEBAR (mobile) ────────────────────────────────────── */

  // Hamburger open
  $('#hamburger-btn').on('click', function () {
    $('#sidebar').addClass('open');
    $('#sidebar-overlay').addClass('active');
    $('body').css('overflow', 'hidden');
  });

  // Overlay close
  $('#sidebar-overlay').on('click', closeSidebar);

  // New chat button
  $('#new-chat-btn').on('click', function () {
    resetChat();
    closeSidebar();
  });

  // History items (demo — just closes sidebar on mobile)
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


  /* ─── NEW CHAT RESET ──────────────────────────────────────── */

  function resetChat () {
    $('#chat-messages').empty();
    hideTypingIndicator();
    $('#welcome-screen').removeClass('hidden');
    chatStarted = false;
    msgCount = 0;
    $('#message-input').val('').trigger('input');
    // Re-animate welcome screen
    $('#welcome-screen').css('animation', 'none');
    // Force reflow
    void document.getElementById('welcome-screen').offsetWidth;
    $('#welcome-screen').css('animation', '');
  }


  /* ─── DARK MODE TOGGLE ────────────────────────────────────── */

  /**
   * Reads saved preference from localStorage on load.
   * Toggles dark-mode class on body; updates icon.
   */
  (function initDarkMode () {
    if (localStorage.getItem('aurachat-theme') === 'dark') {
      $('body').addClass('dark-mode');
      $('#theme-icon').removeClass('fa-moon').addClass('fa-sun');
    }
  })();

  $('#theme-toggle').on('click', function () {
    const isDark = $('body').toggleClass('dark-mode').hasClass('dark-mode');
    const $icon  = $('#theme-icon');
    if (isDark) {
      $icon.removeClass('fa-moon').addClass('fa-sun');
      localStorage.setItem('aurachat-theme', 'dark');
    } else {
      $icon.removeClass('fa-sun').addClass('fa-moon');
      localStorage.setItem('aurachat-theme', 'light');
    }
  });


  /* ─── EXPORT CHAT ─────────────────────────────────────────── */

  /**
   * Exports all chat messages as a plain-text file using the Blob API.
   */
  $('#export-btn').on('click', function () {
    const $messages = $('#chat-messages .message');
    if ($messages.length === 0) {
      alert('No messages to export yet. Start a conversation first!');
      return;
    }

    let content = 'AuraChat — Conversation Export\n';
    content += '================================\n';
    content += 'Exported: ' + new Date().toLocaleString() + '\n\n';

    $messages.each(function () {
      const isUser   = $(this).hasClass('user-message');
      const name     = isUser ? 'You' : 'AuraChat';
      const time     = $(this).find('.message-time').text();
      // Get inner text, stripping HTML
      const text     = $(this).find('.message-bubble').text().trim();
      content += `[${time}] ${name}:\n${text}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'AuraChat_export.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });


  /* ─── INIT ────────────────────────────────────────────────── */

  // Focus input on load (desktop)
  if (window.innerWidth > 768) {
    $('#message-input').focus();
  }

  // Console welcome banner
  console.log(
    '%cAuraChat loaded ✓',
    'color:#7c6af7;font-size:14px;font-weight:bold;'
  );

});
