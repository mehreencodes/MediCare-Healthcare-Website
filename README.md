![CI](https://github.com/mehreencodes/MediCare-Healthcare-Website/actions/workflows/ci.yml/badge.svg)

# Noor Family Clinic: Dental Clinic Website

A production-style website for a dental clinic in Lahore, built with React. It focuses on what patients actually need: who treats my problem, who is in the clinic today, what will it cost, and how do I book or reach someone quickly.

**Live demo:** https://medi-care-healthcare-website.vercel.app

> This is a portfolio project. The clinic name, doctors, fees, reviews and PMDC numbers are **sample data**. Before-and-after photos must only ever be real cases shared with patient consent.

<!-- Screenshots: add images to docs/screenshots/ and uncomment this block.

| Home | Doctors (URL-driven filters) |
| --- | --- |
| ![Home](docs/screenshots/home.png) | ![Doctors](docs/screenshots/doctors.png) |

| Contact (pre-filled booking) | Mobile |
| --- | --- |
| ![Contact](docs/screenshots/contact.png) | ![Mobile](docs/screenshots/mobile.png) |

-->

## Highlights

- **URL-driven state engine.** The Doctors filters (`q`, `specialty`, `gender`, `today`) live in the query string, not in component state. A custom hook (`useDoctorFilters`) built on `useSearchParams`, `useMemo` and `useCallback` reads and writes the URL, so every filtered view is a shareable link, refresh keeps the filters, and Back/Forward work.
- **Real-time availability.** Each dentist has a weekly schedule. "In the clinic today", "Today, 4:00 PM to 9:00 PM" and the sort order are calculated from the schedule and the current time, not from a hand-edited flag.
- **Deep links between pages.** Buttons on Home, Services and Doctors open the booking form already filled in (`/contact?service=Teeth+whitening&doctor=Dr.+Hira+Baig`). All links are built in one helper so parameter names never drift.
- **Booking continuity.** The booking form saves a draft on the visitor's own device, so a refresh or a distraction does not lose it. The draft expires after 24 hours, never stores the spam-trap field, is not saved when the form is empty, and is cleared once the request is sent. After booking, an **Add to calendar** button downloads an `.ics` file in Pakistan time with a 2-hour reminder. It is marked tentative because the clinic still confirms the slot, and the patient's problem text is left out of it on purpose.
- **Honest booking flow.** Validation for Pakistani mobile numbers, no past dates, closed days blocked. The request is emailed through EmailJS when configured, otherwise WhatsApp opens with the message already written. The success screen never pretends something was sent when it was not.
- **Production habits.** Route-level code splitting with idle prefetch, an error boundary so one crashed page never blanks the site (the fallback still offers a call button), a 404 page, and GitHub Actions that run the tests, an import check and the build on Linux for every push.
- **Local SEO and sharing.** JSON-LD `Dentist` schema (hours, phone, address), per-page titles and descriptions, Open Graph link preview, `sitemap.xml` and `robots.txt`.
- **Business logic separated from UI.** Filtering, schedule maths, calendar generation and link building are plain functions in `utils/`, covered by unit tests.

## Features

**Home**
- Hero with a booking bar (treatment and day) that opens the Contact form pre-filled
- Live "Open now / Closed" status, trust strip, treatments grid
- Before/After smile slider (native range input, works with mouse, touch and arrow keys)
- Price transparency section ("starting from" prices)
- Meet-the-dentists strip, about section
- Patient reviews in three columns that float up and down, pause on hover
- Emergency triage: pick *Severe tooth pain*, *Broken tooth* or *Bleeding gums*, then call or send a pre-filled WhatsApp message
- Visit-us section with today's hours highlighted and a map

**Services:** category filters, nine treatments with "from" prices, expandable "what is included", per-treatment booking and WhatsApp buttons.

**Doctors:** search by name or treatment, specialty chips, female/male dentist filter, "in the clinic today" filter, animated list as filters change, expandable details (PMDC number, languages, treatments, clinic days).

**Contact:** booking form pre-filled from the URL (the link wins over a saved draft), draft that survives a refresh with a visible "Start over", urgent-pain checkbox that shows a call button, honeypot spam field, add-to-calendar file after booking, hours, map and quick contact cards.

**Site-wide:** navbar with a desktop info bar that slides away on scroll, footer with live status and treatment links, mobile call/WhatsApp/book bar, 404 page, error boundary.

## URL parameters

| URL | What you get |
| --- | --- |
| `/doctors?q=braces` | Dentists who treat braces |
| `/doctors?gender=female&specialty=Orthodontist` | Female orthodontists |
| `/doctors?specialty=Root%20canal&today=true` | Root canal dentists who are in today |
| `/contact?service=Teeth%20Whitening&doctor=Dr.%20Hira` | Booking form with treatment and dentist selected |
| `/contact?service=Braces%20%26%20aligners&day=Tomorrow` | Booking form for tomorrow |

`specialty` matches a specialty name (Orthodontist) or a treatment (Root canal). `today` accepts `1` or `true`. On the booking form, `service` and `doctor` match without caring about capital letters, and a partial name such as `Dr. Hira` is enough.

## Measured results

Chrome Lighthouse, mobile mode, run on the live site in October 2026:

| Category | Score |
| --- | --- |
| Performance | 58 |
| Accessibility | 94 |
| Best Practices | 100 |
| SEO | 100 |

Lighthouse results move by a few points from run to run. Performance is the weakest score, with main-thread blocking time as the main problem, and it is the next thing to work on.

Other measurements:

- Main JavaScript bundle: 478.89 kB to 433.08 kB (gzip 146.88 kB to 137.07 kB) after route-level code splitting.
- Hero image: about 260 kB PNG to about 26 kB WebP, with the transparent background kept.

## Tech stack

| Technology | Purpose |
| --- | --- |
| React 18 | UI |
| Vite | Build tool |
| React Router 6.4+ | Routing and `useSearchParams` |
| Tailwind CSS 3.4+ | Styling |
| Framer Motion | Animations (with reduced-motion support) |
| lucide-react | Icons |
| react-hot-toast | Form notifications |
| EmailJS (REST API) | Optional email delivery for booking requests |
| Vitest | Unit tests |
| GitHub Actions | Tests, import check and build on every push |

## Project structure

```
.github/workflows/ci.yml   Tests, import check and build on every push
public/                    favicon, og-image, robots.txt, sitemap.xml
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ErrorBoundary.jsx     One crashed page never blanks the whole site
│   ├── WhatsAppButton.jsx
│   └── home/              Pricing, Reviews, BeforeAfter, EmergencyTriage
├── config/clinic.js       Single source of truth: name, phone, hours, WhatsApp helpers
├── data/doctors.js        Dentists, schedules, fees, languages
├── hooks/
│   ├── useDoctorFilters.js     URL <-> filter state, filtered results
│   ├── usePersistentState.js   Draft saved on the device (expires, opt-in per field)
│   ├── useOpenStatus.js        Live open/closed text
│   ├── useNow.js               Clock that refreshes every minute
│   └── useDocumentTitle.js
├── pages/                 Home, Services, Doctors, Contact, NotFound
├── utils/
│   ├── doctorSchedule.js       getNextSlot, filterDoctors (pure functions)
│   ├── doctorSchedule.test.js
│   ├── calendar.js             .ics builder: Pakistan time, escaping, line folding
│   ├── calendar.test.js
│   ├── download.js             Saves a text file in the browser
│   └── links.js                contactLink, doctorsLink
├── assets/                Images imported by components
└── App.jsx, main.jsx, index.css
```

## Getting started

```bash
git clone https://github.com/mehreencodes/MediCare-Healthcare-Website.git
cd MediCare-Healthcare-Website
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm test           # unit tests (Vitest)
npm run build      # production build into dist/
npm run preview    # preview the production build
```

## Booking requests: EmailJS (optional)

Without any setup, the Contact form opens WhatsApp with the request already written. To email requests to the clinic instead, create a free EmailJS account, add an email service and a template, then set:

```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Put them in a local `.env` (already in `.gitignore`) and in your host's environment variables. The template can use these variables: `{{name}} {{phone}} {{email}} {{service}} {{doctor}} {{date}} {{time}} {{urgent}} {{message}}`. The EmailJS public key is designed to be visible in the browser, so use an account dedicated to this form.

## Customising for a real clinic

1. Edit `src/config/clinic.js`: name, city, address, phone, WhatsApp number, email, weekly hours, social links.
2. Edit `src/data/doctors.js`: dentists, schedules, fees, languages, PMDC numbers, photos.
3. Keep treatment names in `clinic.js` (`SERVICE_NAMES`), `Services.jsx` and the price cards in sync.
4. Replace sample reviews in `components/home/Reviews.jsx` with real ones.
5. Add real photos (hero, doctors, services). Doctor photos go in `public/images/doctors/<slug>.jpg`; the slider photos are imported from `src/assets/`.
6. Update the site address in `index.html`, `public/sitemap.xml` and `public/robots.txt`, and replace `public/og-image.png`.

## Testing

`npm test` runs 17 unit tests covering:

- availability before, during and after a dentist's session (`getNextSlot`)
- the "in the clinic today", gender and treatment filters, and soonest-first sorting (`filterDoctors`)
- deep link generation (`contactLink`, `doctorsLink`)
- calendar file generation: Pakistan-time conversion, keeping the visit inside opening hours, `.ics` text escaping and 75-byte line folding

The tests pass their own dates, so the result does not depend on the day they run. The `useDoctorFilters` hook and the draft saving are checked manually in the browser.

## Deployment and CI

Deployed on Vercel. `vercel.json` rewrites every route to `index.html` so deep links such as `/doctors?specialty=Orthodontist` and page refreshes work.

File names are **case-sensitive on Linux** (Vercel and GitHub Actions) but not on Windows. `node check-deploy.mjs` checks every import against the files Git actually tracks and reports case mismatches, files that were never committed, and packages missing from `package.json`.

GitHub Actions runs `npm test`, `node check-deploy.mjs` and `npm run build` on Linux for every push. It caught a file-name case mismatch that Windows had hidden (the red run in the Actions history), which was fixed in the next commit.

## Accessibility

Labelled form fields with inline errors, visible focus rings, keyboard-operable slider, filters and menus, `aria-live` result counts, and `prefers-reduced-motion` support for every animation.

## Author

**Mehreen Khalid**, React.js and Full Stack Developer
GitHub: [@mehreencodes](https://github.com/mehreencodes)