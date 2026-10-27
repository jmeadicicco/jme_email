# www.jme.email — Project Plan

Landing page for people who type the email domain into a browser by mistake.

## Experience
1. Dark backdrop, `crt.png` centered. The desktop is overlaid exactly on the monitor's glass area.
2. Inside the glass: an **original CSS/SVG sky-and-clouds wallpaper** (not a copy of Microsoft's), plus CRT effects: scanlines, slight barrel curvature and vignette, soft glow, subtle flicker.
3. A **single Win95-style window** (beveled gray chrome, navy gradient title bar with _ □ ×) holds:
   - the logo (cropped to remove the white margins and resized)
   - an animated envelope button with a "1 new message" label
4. **Clicking the envelope** plays `youvegotmail.mp3`, the flap opens, and a retro mail-reader view appears:
   - From: John Michael <hello@jme.email>
   - To: You
   - Subject: Whoops!
   - Date: the visitor's current date and time, in 90s format
   - Body: from `emailbody.txt`. "click here" becomes a `mailto:hello@jme.email` link and www.jmeadicicco.com becomes a link.
   - Closing the message returns to the envelope.
5. No taskbar, icons or power-on effect. Keep it minimal.

## Responsive
- Desktop and tablet: the full monitor is shown, scaled to fit the viewport.
- Phone portrait: zoom into the screen. The bezel is hidden, and the desktop and window fill the viewport while the CRT effects stay on.

## Tech
- Static `index.html` with hand-written CSS and plain JS. No framework and no build step.
- The envelope is a real `<button>`, so it works with the keyboard. Respect `prefers-reduced-motion`. Add alt text.
- Retro pixel-style web font, self-hosted or from Google Fonts.
- Asset prep: crop and resize the logo (about 800px, WebP with PNG fallback), compress the CRT to WebP, keep the mp3 as is (127 KB).
- Favicon, `<title>`, meta description, Open Graph image.

## Hosting & DNS (Cloudflare Pages via GitHub)
- `git init`, push to a GitHub repo, and connect it to Cloudflare Pages so every push deploys.
- Add jme.email to Cloudflare. **Before switching nameservers at the registrar**, check that every iCloud Mail record was imported, all set to **DNS only (grey cloud)**:
  - MX `mx01.mail.icloud.com` and `mx02.mail.icloud.com` (priority 10)
  - TXT SPF `v=spf1 include:icloud.com ~all`
  - TXT `apple-domain=…` verification
  - CNAME `sig1._domainkey` → `sig1.dkim.jme.email.at.icloudmailadmin.com`
  - any DMARC record (`_dmarc`)
  - Compare against the current registrar's zone and copy values exactly.
- Make www.jme.email a custom domain on the Pages project.
- Apex jme.email: a redirect rule sends it to `https://www.jme.email` (needs a proxied apex record). This does not affect the MX records.
- After the nameserver switch, send a test email both ways to confirm mail still flows.
