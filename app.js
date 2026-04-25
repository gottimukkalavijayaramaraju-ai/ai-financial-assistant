/* ============================================================
   AI Financial Assistant — app.js
   Full application logic: navigation, chat, transactions filter
   ============================================================ */

'use strict';

// ─── DATA ───────────────────────────────────────────────────

const ALL_TRANSACTIONS = [
  { desc: 'Swiggy Order',         icon: '🍽', category: 'Food',          date: 'Apr 24', amount: -480,   status: 'done' },
  { desc: 'Dividend — NVDA',      icon: '📈', category: 'Income',        date: 'Apr 23', amount: +210,   status: 'done' },
  { desc: 'Rent Payment',         icon: '🏠', category: 'Housing',       date: 'Apr 22', amount: -1200,  status: 'done' },
  { desc: 'Ola Cab',              icon: '🚗', category: 'Transport',     date: 'Apr 21', amount: -85,    status: 'done' },
  { desc: 'Salary Credit',        icon: '💼', category: 'Income',        date: 'Apr 20', amount: +5000,  status: 'done' },
  { desc: 'Netflix Subscription', icon: '🎬', category: 'Entertainment', date: 'Apr 19', amount: -649,   status: 'pending' },
  { desc: 'Zepto Grocery',        icon: '🛒', category: 'Food',          date: 'Apr 18', amount: -320,   status: 'done' },
  { desc: 'Electricity Bill',     icon: '⚡', category: 'Utilities',     date: 'Apr 17', amount: -130,   status: 'done' },
  { desc: 'Freelance Payment',    icon: '💰', category: 'Income',        date: 'Apr 15', amount: +1200,  status: 'done' },
  { desc: 'Amazon Shopping',      icon: '📦', category: 'Shopping',      date: 'Apr 14', amount: -800,   status: 'done' },
  { desc: 'Zomato Order',         icon: '🍔', category: 'Food',          date: 'Apr 13', amount: -210,   status: 'done' },
  { desc: 'Metro Card Recharge',  icon: '🚇', category: 'Transport',     date: 'Apr 12', amount: -125,   status: 'done' },
  { desc: 'Dividend — VOO',       icon: '📊', category: 'Income',        date: 'Apr 10', amount: +85,    status: 'done' },
  { desc: 'Spotify Premium',      icon: '🎵', category: 'Entertainment', date: 'Apr 09', amount: -179,   status: 'done' },
  { desc: 'Restaurant — Barbeque Nation', icon: '🥩', category: 'Food',  date: 'Apr 07', amount: -580,   status: 'done' },
  { desc: 'Internet Bill',        icon: '🌐', category: 'Utilities',     date: 'Apr 06', amount: -999,   status: 'done' },
];

const CATEGORY_TAG_CLASS = {
  'Food':          'amber',
  'Income':        'green',
  'Housing':       'red',
  'Transport':     'blue',
  'Entertainment': 'purple',
  'Utilities':     'blue',
  'Shopping':      'amber',
};

const AI_RESPONSES = {
  'How is my portfolio performing?': {
    text: `Your portfolio is up <strong>+4.2%</strong> this month, outperforming the S&P 500 benchmark by <strong>1.8%</strong>. Here's a quick snapshot:`,
    insight: [
      ['Total Value',     '₹48,320'],
      ['Monthly Gain',    '+₹1,947', 'positive'],
      ['Best Performer',  'NVDA +12.3%', 'positive'],
      ['Worst Performer', 'TSLA −3.1%',  'negative'],
    ]
  },
  'Analyze my spending habits': {
    text: `Your top 3 spending categories this month are <strong>Housing (₹1,200)</strong>, <strong>Food (₹480)</strong>, and <strong>Entertainment (₹320)</strong>. Food spend is up <strong>14%</strong> vs last month — mostly dining out. Meal prepping 2–3 times a week could save ~₹80/month. Transport is well under budget — great job!`
  },
  'Should I rebalance my portfolio?': {
    text: `Your tech sector exposure is <strong>68%</strong> — slightly above your target of 60%. I'd suggest trimming NVDA by 2 shares (locking in those gains!) and moving ~₹1,400 into VOO or a bond ETF to reduce concentration risk. Want a detailed rebalancing plan?`
  },
  'Suggest investment strategies for me': {
    text: `Based on your profile, here are 3 strategies to consider:<br><br>1. <strong>Dollar-cost average</strong> into VOO monthly — removes timing risk<br>2. <strong>Add international exposure</strong> via VEA — your portfolio is 100% domestic<br>3. <strong>Tax-loss harvest</strong> TSLA losses to offset NVDA gains this tax year<br><br>Would you like me to model the impact of any of these?`
  },
  'How can I save more money?': {
    text: `You're currently saving about <strong>18%</strong> of your income — above the recommended 15%. Here are quick wins:<br><br>1. Cancel unused subscriptions (₹87/month detected)<br>2. Reduce dining out — cook 2 meals/week extra to save ₹320/month<br>3. Auto-transfer ₹500 on salary day before you spend it<br><br>These changes could boost your savings rate to <strong>24%</strong>.`
  },
  'What are my savings goals progress?': {
    text: `You have 4 active savings goals:`,
    insight: [
      ['Emergency Fund',  '₹8,200 / ₹10,000 (82%)', 'positive'],
      ['Vacation 2026',   '₹1,400 / ₹3,000 (47%)',  'neutral'],
      ['Down Payment',    '₹12,800 / ₹50,000 (26%)','neutral'],
      ['Education Fund',  '₹3,000 / ₹20,000 (15%)', 'neutral'],
    ]
  },
};

const FALLBACK_RESPONSES = [
  "That's a great question! Based on your financial profile, I'd suggest setting up a monthly auto-transfer to your savings account. Your current savings rate of 18% is healthy but there's room to grow. Want me to build a personalized savings plan?",
  "I've analyzed your recent transactions and noticed a few optimization opportunities. Your recurring subscriptions total ₹87/month — shall I list them for review so you can decide what to keep?",
  "Looking at your income vs expenses, you're on a solid financial track. Your net worth has grown <strong>+22%</strong> over the past 12 months. Would you like a full year-over-year breakdown?",
  "Great question! Based on your risk profile (moderate), your current asset allocation is reasonable, but adding a small bond allocation could improve your risk-adjusted returns. Shall I model a few scenarios?",
];
let fallbackIdx = 0;

// ─── NAVIGATION ──────────────────────────────────────────────

function navigate(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Deactivate all nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');

  // Lazy-load transactions
  if (page === 'transactions') renderTransactions('all');
}

// ─── TRANSACTIONS ────────────────────────────────────────────

function renderTransactions(filter) {
  const tbody = document.getElementById('full-txn-tbody');
  if (!tbody) return;

  const filtered = filter === 'all'
    ? ALL_TRANSACTIONS
    : ALL_TRANSACTIONS.filter(t => t.category === filter);

  tbody.innerHTML = filtered.map(t => {
    const sign   = t.amount > 0 ? '+' : '−';
    const abs    = Math.abs(t.amount).toLocaleString('en-IN');
    const cls    = t.amount > 0 ? 'positive' : 'negative';
    const tagCls = CATEGORY_TAG_CLASS[t.category] || 'blue';
    return `
      <tr>
        <td><div class="txn-desc">
          <div class="txn-icon">${t.icon}</div>${t.desc}
        </div></td>
        <td><span class="tag ${tagCls}">${t.category}</span></td>
        <td>${t.date}</td>
        <td class="amount ${cls}">${sign}₹${abs}</td>
        <td><span class="status-badge ${t.status}">${t.status === 'done' ? 'Done' : 'Pending'}</span></td>
      </tr>`;
  }).join('');
}

function filterTxns(value) {
  renderTransactions(value);
}

// ─── CHAT ────────────────────────────────────────────────────

function addMessage(text, role, insight) {
  const feed = document.getElementById('chat-messages');
  const div  = document.createElement('div');
  div.className = `chat-message ${role}`;

  let insightHtml = '';
  if (insight && insight.length) {
    insightHtml = `<div class="chat-insight">` +
      insight.map(([label, val, cls]) =>
        `<div class="chat-insight-row">
           <span class="ci-label">${label}</span>
           <span class="ci-val ${cls || ''}">${val}</span>
         </div>`
      ).join('') +
      `</div>`;
  }

  div.innerHTML = `
    <div class="msg-avatar ${role}">${role === 'ai' ? 'AI' : 'U'}</div>
    <div class="msg-bubble ${role}">${text}${insightHtml}</div>`;

  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

function addTypingIndicator() {
  const feed = document.getElementById('chat-messages');
  const div  = document.createElement('div');
  div.className = 'chat-message ai';
  div.id = 'typing-msg';
  div.innerHTML = `
    <div class="msg-avatar ai">AI</div>
    <div class="msg-bubble ai"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById('typing-msg');
  if (el) el.remove();
}

function sendChip(btn, text) {
  // Remove chips after use
  document.getElementById('chat-chips').style.display = 'none';
  addMessage(text, 'user');
  addTypingIndicator();

  const delay = 1000 + Math.random() * 600;
  setTimeout(() => {
    removeTypingIndicator();
    const resp = AI_RESPONSES[text];
    if (resp) {
      addMessage(resp.text, 'ai', resp.insight || null);
    } else {
      addMessage(FALLBACK_RESPONSES[fallbackIdx++ % FALLBACK_RESPONSES.length], 'ai');
    }
  }, delay);
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';

  addMessage(text, 'user');
  addTypingIndicator();

  const lower = text.toLowerCase();
  let response = null;

  for (const [key, val] of Object.entries(AI_RESPONSES)) {
    const keyWords = key.toLowerCase().split(' ').filter(w => w.length > 3);
    const matched  = keyWords.filter(w => lower.includes(w));
    if (matched.length >= 2) { response = val; break; }
  }

  const delay = 1200 + Math.random() * 800;
  setTimeout(() => {
    removeTypingIndicator();
    if (response) {
      addMessage(response.text, 'ai', response.insight || null);
    } else {
      addMessage(FALLBACK_RESPONSES[fallbackIdx++ % FALLBACK_RESPONSES.length], 'ai');
    }
  }, delay);
}

// ─── INIT ────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Default to dashboard
  navigate('dashboard');
});
