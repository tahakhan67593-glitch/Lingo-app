# Lingo — standalone project

## 🚀 Easiest path to Play Store (no Android Studio needed)

This project includes `.github/workflows/build-android.yml`, which builds
your Android app **automatically in the cloud** using GitHub's free servers.
You skip installing Android Studio entirely. Steps:

1. Create a free account at [github.com](https://github.com) if you don't
   have one.
2. Create a new repository (button says "New" on your GitHub homepage),
   then upload this entire `lingo-app` folder into it — easiest way is
   dragging the folder onto the "uploading an existing file" page on
   github.com (no command line needed).
3. Click the **Actions** tab at the top of your repository. A build should
   start automatically — wait for the green checkmark (a few minutes).
4. Click into that run, scroll to **Artifacts**, and download
   `app-release-unsigned` — unzip it to get your `.aab` file.
5. Before uploading to Play Console, that file needs to be **signed** —
   this is a one-time thing Google requires so only you can ever update
   your app. You still need to do this one step on a computer (see the
   workflow file's comments, or ask for help with this specific step when
   you get there — it's much smaller than the full Android Studio setup).
6. Upload the signed `.aab` to [Google Play Console](https://play.google.com/console)
   (requires the one-time $25 developer fee) and fill in your store listing.

Everything below this is the fuller, from-scratch explanation in case you'd
rather do it all locally instead.

---

This is a standalone, buildable version of your Lingo app, converted from
the Claude.ai artifact into a normal React (Vite) project so you can run it
on your own computer, install it as a PWA, and wrap it for Play Store /
App Store with Capacitor.

## What changed vs. the artifact version

The artifact version relied on two things that only exist inside Claude.ai:

1. **`window.storage`** (automatic per-user save/load) — replaced here with
   `src/storageShim.js`, a localStorage-based drop-in replacement. This means
   progress now lives **on this one device/browser only**. See the
   "Real backend / sync" section below if you want cross-device sync and a
   real shared leaderboard.
2. **The AI tutor's direct call to Anthropic's API** — a browser app can
   never safely hold a secret API key, so this now calls whatever URL you
   set in `VITE_CHAT_API_URL`. Until you set that up, the chat tab shows a
   friendly explanation instead of crashing. See "AI tutor chat" below.

Everything else — all the lessons, hearts, XP, streaks, quizzes, speech
recognition, sound effects, multi-language UI — works exactly as it did in
the artifact, since those only ever used standard browser APIs.

## 1. Run it locally

```bash
npm install
npm run dev
```

Open the printed `http://localhost:5173` URL. Test it like a normal web app
first — get everything working before moving to the app-store steps.

## 2. AI tutor chat (optional but recommended)

Anthropic's API requires a secret key on a server — never in client code.
The simplest fix is a tiny serverless function that holds the key and
forwards requests. Example using a Cloudflare Worker (free tier is enough):

```js
// worker.js — deploy with `npx wrangler deploy`
export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("Not found", { status: 404 });
    const body = await request.json();
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY, // set via `wrangler secret put ANTHROPIC_API_KEY`
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, ...body }),
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  },
};
```

Then create a `.env` file in this project:

```
VITE_CHAT_API_URL=https://your-worker.your-subdomain.workers.dev
```

Any small backend works the same way (Express + Node, a Vercel/Netlify
function, etc.) — it just needs to accept `{system, messages}` and return
whatever `api.anthropic.com/v1/messages` returns.

## 3. Real backend / cross-device sync (optional)

Right now progress and the leaderboard are local to one device. If you want
real sync, build a tiny key-value API (4 routes: GET/PUT/DELETE a key, and
list keys by prefix) and set:

```
VITE_SYNC_API_URL=https://your-backend.example.com
```

`src/storageShim.js` already knows how to call it — see the `remoteGet` /
`remoteSet` / `remoteDelete` / `remoteList` functions for the exact request
shape it expects. A few options that make this fast to build:
Cloudflare Workers + KV, Supabase, or Firebase.

## 4. Install as a PWA (fastest path, no store needed)

```bash
npm run build
npm run preview
```

Open the preview URL on a phone (same network) or deploy `dist/` to any
static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages — all have free
tiers). Once deployed over HTTPS, visitors can tap "Add to Home Screen" and
it behaves like an installed app. No developer account, no review process.

## 5. Wrap for Google Play (Android)

```bash
npm run build
npx cap init   # if not already configured — appId/name are in capacitor.config.json
npm run cap:add:android
npm run cap:sync
npm run cap:open:android
```

That last command opens the project in Android Studio. From there:

1. Build → Generate Signed Bundle / APK → choose **Android App Bundle**.
2. Create a keystore the first time (keep it safe — you need the same one
   for every future update).
3. Create a [Google Play Console](https://play.google.com/console) account
   ($25 one-time fee), create a new app, and upload the `.aab` file under
   Production (or Internal testing first, which is recommended).
4. Fill in the store listing (screenshots, description, privacy policy URL
   — required even for free apps), content rating questionnaire, and data
   safety form (mention what `window.storage`/your backend actually stores).
5. Submit for review. First review is typically a few hours to a few days.

## 6. Wrap for the App Store (iOS)

Same idea, but requires a Mac with Xcode installed:

```bash
npx cap add ios
npm run cap:sync
npx cap open ios
```

You'll need an active [Apple Developer Program](https://developer.apple.com/programs/)
membership ($99/year) to submit. Archive the app in Xcode, upload via
Xcode Organizer or Transporter, then fill in App Store Connect's listing
and submit for review.

## Before you publish — a checklist

- [ ] Replace `public/icon-192.png` and `public/icon-512.png` with real
      artwork (the current ones are placeholders).
- [ ] Update `appId` in `capacitor.config.json` to something unique to you
      (reverse-domain style, e.g. `com.yourname.lingo`).
- [ ] Write a privacy policy (required by both stores) describing what data
      is stored — even "stored locally on your device" counts and must be
      disclosed if you use analytics or the shared leaderboard.
- [ ] Decide whether to ship the AI tutor chat (needs a backend, see above)
      or hide that tab until it's ready.
- [ ] Test on a real low-end Android device — emulators are often more
      forgiving than real hardware.
- [ ] Double check speech recognition/synthesis permissions prompts show
      sensible text (Android/iOS both ask for microphone permission).

## Payments (Premium subscription)

The "Start free trial" button is currently a local toggle only — it doesn't
charge anyone. Real subscriptions on mobile must go through each store's
in-app purchase system (Google Play Billing / Apple StoreKit) — Capacitor
has plugins for both (`@capacitor-community/in-app-purchases` or similar).
That's a separate integration project on top of this one.
