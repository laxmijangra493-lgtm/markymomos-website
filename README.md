# Marky Momos — Website Concept Prototype

A presentation-ready, static frontend concept built specifically around Marky Momos' public Jaipur presence.

## What is included
- Premium red + yellow restaurant visual system; no purple.
- Bento menu section with hover depth.
- Real Marky Momos imagery pulled from public Swiggy/Dineout media URLs in the prototype.
- Additional food imagery from Unsplash for visual fill.
- Clear Swiggy / Zomato / WhatsApp / Call CTAs.
- Six named Jaipur outlets surfaced from current public listings + directory link for the latest full list.
- Platform rating cards with links to public listings/reviews.
- Local review capture demo using browser `localStorage` (not a production backend).
- Scroll reveal animations, ticker motion, steam animation, playful stickers, tilt interaction and floating dumpling motion.
- Mobile-first responsive layout.
- Basic SEO metadata and Open Graph metadata.
- No bill system and no add-to-cart system.

## Run it
Open `index.html` in a browser, or for the most reliable local preview:

```bash
python3 -m http.server 5500
```

Then open `http://localhost:5500`.

## Important before sending to the restaurant
This is a **concept / sales prototype**. Replace external/demo assets with brand-approved assets before production, and confirm:
- exact outlet list and addresses;
- current menu + prices;
- final Zomato/Swiggy outlet links;
- approved Marky Momos photography/logo;
- official review/ratings data;
- domain, hosting and analytics details.

The review form is intentionally local-only. A real launch needs a backend or a connected form/review provider.

## Research used for this concept
Public listings were checked in September 2026. Current public sources include:
- Zomato Mansarovar: https://www.zomato.com/jaipur/marky-momos-mansarovar/info
- Zomato Mansarovar order: https://www.zomato.com/jaipur/marky-momos-mansarovar/order
- Zomato Jaipur directory: https://www.zomato.com/jaipur/restoran/marky-momos
- Swiggy Mansarovar: https://www.swiggy.com/city/jaipur/marky-momos-riddhi-siddhi-road-mansarovar-rest50534
- Swiggy Vaishali Nagar: https://www.swiggy.com/city/jaipur/marky-momos-vaishali-nagar-rest48726
- Swiggy Vidhyadhar Nagar: https://www.swiggy.com/city/jaipur/marky-momos-vidhyadhar-nagar-central-spine-rest1012410
- Zomato Raja Park: https://www.zomato.com/jaipur/marky-momos-raja-park/order
- Zomato Pratap Nagar: https://www.zomato.com/jaipur/marky-momos-pratap-nagar
- Instagram: https://www.instagram.com/markymomosindia/?hl=en

### Image sources used in the prototype
- Marky Momos branded bowl image: Swiggy media asset (public listing)
- Marky Momos interior image: Swiggy Dineout media asset (public listing)
- Additional food images: Unsplash public image URLs

For commercial production, ask the client for approved brand assets rather than relying on third-party CDN links.

## Franchise enquiry UX update
- Dedicated franchise page is linked from the top-right `Partner with us` CTA.
- Front-loaded copy communicates the approximate 2-minute effort and reassures users that rough estimates are acceptable.
- Five required questions are separated from one optional note; live completion progress updates as the user fills the form.
- Inline field feedback helps users correct issues before submit.
- Submission ends in an achievement-style success modal with a staged check, burst and clear next-step message.
- Google Apps Script integration remains unchanged: put the deployed web-app URL in `franchise.js` before launch.


Vibe Coded
