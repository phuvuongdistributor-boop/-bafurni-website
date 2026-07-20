# BAFurniture Lead Webhook V7.1

Google Apps Script receives homepage leads, appends them to Google Sheets, recalculates the lead score on the server, and sends a Telegram notification.

## Required script properties

- `SHEET_ID`: `1SDoyRrGqOz17vlyh8S2mPO70gq1Y87KmCFbh0_DzoVY`
- `SHEET_NAME`: optional tab name; defaults to `Leads`.
- `TELEGRAM_BOT_TOKEN`: Telegram bot token.
- `TELEGRAM_CHAT_ID`: Telegram destination chat ID.

## Deploy

1. Create a standalone Google Apps Script project.
2. Paste `Code.gs`.
3. Add the script properties above in Project Settings.
4. Deploy as a Web app:
   - Execute as: Me.
   - Who has access: Anyone.
5. Set the production endpoint in `website/lead-config.js`:
   `https://script.google.com/macros/s/AKfycbyLFkUYAvwWnpzJOwwLzhCak1YKAW623XPdL-mnbHSJPEfhBYPAX1QtGKNlTC5mFztWMQ/exec`
6. Keep `transport: "no-cors"` for the static homepage.

Never place the Telegram bot token or Google Sheet credentials in homepage JavaScript.

## Smoke test

From PowerShell:

```powershell
.\test-lead-flow.ps1 -Endpoint "https://script.google.com/macros/s/AKfycbyLFkUYAvwWnpzJOwwLzhCak1YKAW623XPdL-mnbHSJPEfhBYPAX1QtGKNlTC5mFztWMQ/exec"
```

The test passes only when the webhook responds successfully in under 10 seconds.
Confirm the returned `lead_id` appears in Telegram and in the `Leads` tab. The
`telegram_ms`, `sheet_ms`, and `total_ms` columns provide production latency.
