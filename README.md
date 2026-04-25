# FinAI — AI Financial Assistant

A production-grade, dark-themed AI Financial Dashboard built with pure HTML, CSS, and JavaScript.

## Project Structure

```
ai-financial-assistant/
├── index.html    ← Main HTML — all pages & layout
├── styles.css    ← Full dark luxury theme & responsive CSS
├── app.js        ← Navigation, chat logic, transactions filter
└── README.md     ← This file
```

## Features

### Pages
| Page           | Description |
|----------------|-------------|
| **Dashboard**  | Overview metrics, holdings, budget tracker, recent transactions |
| **AI Chat**    | Interactive AI advisor with typing animation and smart responses |
| **Portfolio**  | Full holdings table with returns and allocation |
| **Transactions** | Filterable transaction history by category |
| **Budget**     | Monthly budget breakdown with progress bars |
| **Insights**   | 6 AI-generated financial insight cards |
| **Goals**      | Savings goals with progress tracking |

### Tech Stack
- **HTML5** — Semantic, accessible markup
- **CSS3** — CSS variables, Grid, Flexbox, animations
- **Vanilla JS** — Zero dependencies, modular logic

### Design
- Dark luxury theme (`#0D0F14` base)
- Fonts: DM Serif Display (headings) + DM Sans (body)
- Responsive down to tablet (860px breakpoint)
- Smooth page transitions and fade-in animations

## How to Run

Just open `index.html` in any modern browser — no build step needed.

```bash
# Option 1: Direct
open index.html

# Option 2: Local server (recommended)
npx serve .
# or
python -m http.server 8080
```

## Extending with Real AI (Anthropic API)

To connect real Claude responses, replace the `sendChat()` function in `app.js`:

```javascript
async function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  addMessage(text, 'user');
  addTypingIndicator();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: 'You are a helpful AI financial advisor. The user has a portfolio of ₹48,320 with holdings in AAPL, NVDA, MSFT, TSLA, VOO. Monthly budget is ₹4,000 with ₹860 remaining. Be concise and actionable.',
      messages: [{ role: 'user', content: text }]
    })
  });

  const data = await response.json();
  removeTypingIndicator();
  addMessage(data.content[0].text, 'ai');
}
```

## Customization

All financial data lives in `app.js` at the top of the file:
- `ALL_TRANSACTIONS` — Edit or add transactions
- `AI_RESPONSES` — Add new canned AI responses
- CSS variables in `styles.css` — Change colors/fonts

---
Built with ❤️ using HTML, CSS, and JavaScript
