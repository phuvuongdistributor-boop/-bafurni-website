# BAFurniture V7.1 — Production Deployment

This runbook deploys the lead path:

`bafurni.com → Telegram → Google Sheet`

Production Google Sheet:
[BAFurniture Leads V7.1 Production](https://docs.google.com/spreadsheets/d/1SDoyRrGqOz17vlyh8S2mPO70gq1Y87KmCFbh0_DzoVY/edit)

## 1. Telegram preparation

1. Create or select a Telegram bot using BotFather.
2. Add the bot to the destination group, then send one message in that group.
3. Obtain the destination `chat_id`.
4. Keep both values private. Never commit them to this repository or put them in
   homepage JavaScript.

Required secrets:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## 2. Google Apps Script webhook

1. Open [Google Apps Script](https://script.google.com/) with the Google account
   that can edit the production Sheet.
2. Create a new project named `BAFurniture Lead Webhook V7.1`.
3. Replace the default code with
   `website/integrations/google-apps-script/Code.gs`.
4. In **Project Settings → Script properties**, add:

   - `SHEET_ID` = `1SDoyRrGqOz17vlyh8S2mPO70gq1Y87KmCFbh0_DzoVY`
   - `SHEET_NAME` = `Leads`
   - `TELEGRAM_BOT_TOKEN` = private bot token
   - `TELEGRAM_CHAT_ID` = private destination chat ID

5. Select **Deploy → New deployment → Web app**:

   - Execute as: **Me**
   - Who has access: **Anyone**

6. Authorize access and use the production URL:
   `https://script.google.com/macros/s/AKfycbyLFkUYAvwWnpzJOwwLzhCak1YKAW623XPdL-mnbHSJPEfhBYPAX1QtGKNlTC5mFztWMQ/exec`

After code changes, create a new deployment version. Do not use the `/dev` URL
for production.

## 3. Website configuration

Set the production `/exec` URL in `website/lead-config.js`:

```js
window.BA_LEAD_CONFIG = Object.freeze({
  endpoint: "https://script.google.com/macros/s/AKfycbyLFkUYAvwWnpzJOwwLzhCak1YKAW623XPdL-mnbHSJPEfhBYPAX1QtGKNlTC5mFztWMQ/exec",
  transport: "no-cors",
  timeoutMs: 10000,
  site: "bafurni.com",
  demoMode: ["localhost", "127.0.0.1"].includes(window.location.hostname)
});
```

Deploy the `website` directory through the actual bafurni.com Vercel project.
This workspace does not contain the production Vercel project link, so confirm
the deployment target before publishing.

## 4. Production smoke test

Run:

```powershell
cd website\integrations\google-apps-script
.\test-lead-flow.ps1 -Endpoint "https://script.google.com/macros/s/AKfycbyLFkUYAvwWnpzJOwwLzhCak1YKAW623XPdL-mnbHSJPEfhBYPAX1QtGKNlTC5mFztWMQ/exec"
```

Then verify the same `lead_id`:

1. Appears in Telegram.
2. Appears in the Sheet tab `Leads`.
3. Has `telegram_status = SENT`.
4. Has `total_ms < 10000`.

Use a new test phone number or wait at least 60 seconds between tests because the
webhook rate-limits repeated phone numbers.

## 5. Website acceptance test

1. Open bafurni.com in an incognito window.
2. Click a quote CTA.
3. Submit a valid name and phone through the quick flow.
4. Confirm success feedback on the page.
5. Confirm Telegram and Sheet delivery using the same phone number.
6. Confirm `total_ms < 10000` in column `AB`.

Test desktop and mobile widths. Also test one invalid phone and one repeated
submission to confirm validation and rate limiting.

## 6. Operations

- `Dashboard` reads directly from `Leads`.
- Update `status`, `owner`, and `follow_up_at` in `Leads`.
- Call HOT leads within 5 minutes; all new leads within 15 minutes.
- Review `telegram_ms`, `sheet_ms`, and `total_ms` weekly.
- If delivery fails, check Apps Script **Executions** first.

## 7. Rollback

1. In Apps Script, select the last working deployment version.
2. If the webhook is unavailable, remove the endpoint from `lead-config.js` only
   as an emergency rollback; this disables production lead delivery.
3. Redeploy the last known-good website build.

The Google Sheet contains customer personal data. Restrict edit access, enable
Google account MFA, and never expose bot tokens in logs, commits, screenshots,
or client-side code.
