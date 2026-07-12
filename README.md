# Bagpipe Lab

Interactive, animated practice-chanter learning app. See `CLAUDE.md` for full concept, curriculum, and roadmap.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## iOS (Capacitor)

```bash
npm run build
npx cap sync ios
npx cap open ios
```

## App Store checklist

- [ ] Apple Developer Program enrollment confirmed for `com.pablohoney.*` bundle namespace
- [ ] App icon set (all required sizes) and launch screen finalized
- [ ] Privacy policy URL live (required — app uses mic access for future rhythm detection, analytics via PostHog)
- [ ] App Store screenshots (6.9", 6.5", iPad if supporting) reflecting phase 1–3 free content
- [ ] App Store description, keywords, category (Music or Education) drafted
- [ ] RevenueCat product configured for one-time IAP unlock (phases 4–6), sandbox-tested
- [ ] PostHog project key set (currently a no-op CDN snippet)
- [ ] TestFlight internal build validated on-device before submission
- [ ] Codemagic build/signing profile configured (`codemagic.yaml`)
- [ ] Public-domain status confirmed for every tune in the shipped repertoire
- [ ] App Store Review Guidelines pass: no placeholder content, all IAP functional, privacy nutrition label accurate
