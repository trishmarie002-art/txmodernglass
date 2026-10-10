# Modern Glass — Seguin

A custom, responsive, static website for Modern Glass LLC, centered on service in Seguin, TX. Designed around the supplied cyan-and-charcoal logo, warm ivory backgrounds, editorial typography, and the business’s real project photography.

## Build and deploy

Requires Node 22 or later. No npm dependencies.

```sh
npm run build
npm test
```

Import this repository into Vercel. `vercel.json` sets the build command and `dist` output. Set `SITE_URL` to the **new** website’s HTTPS origin when the domain is known. The build also recognizes `VERCEL_PROJECT_PRODUCTION_URL`. Canonical URLs and the XML sitemap are generated only when an origin is available; the original business domain is deliberately not used as the canonical origin.

Pages: Home, About, FAQ, Reviews, Gallery, Contact, a service-area directory, six city pages, a searchable Central Texas blog with 50 articles, and a custom 404. All content and SEO metadata render to HTML at build time. The site does not require JavaScript to display its page content.

## Business content

The original `https://txmodernglass.com` website supplied contact details, existing service areas, project photographs, and the Elfsight review widget identifier. The business remains based in Converse; the website does not claim a Seguin office. Original project locations are unspecified. No reviews or ratings were invented.

- `content/business.json`: business information, service areas, widget, and hours.
- `content/gallery.json`: original project image URLs and descriptions.
- `content/faqs.json`: searchable questions and answers, also rendered as FAQ structured data.
- `public/logo.webp`: supplied original logo, displayed without cropping.
- `build.mjs`: page content, unique titles/descriptions, shared components, structured data, and sitemap generation.
- `public/style.css`: responsive custom design.
- `public/app.js`: mobile menu, FAQ search/filter, gallery lightbox, and email inquiry preparation.

## Contact behavior

The inquiry form explicitly prepares a `mailto:` message. Visitors must send it from their email app. It does not claim that a server has received a submission. Phone and email links also work independently. A direct submission backend can replace this behavior when a provider and credentials are chosen. City-page estimate links prefill the inquiry city.

The contact page embeds a service-area map centered on Seguin, with a separate link to the actual Converse business address. It does not label Seguin as the office.

## External services

Project photographs currently use the original GoDaddy image CDN with resized URLs. Typography uses Google Fonts with local font fallbacks. Reviews reuse the existing Elfsight widget; display on the new domain depends on that account’s domain and plan settings. There is a visible link to the existing reviews page if the widget does not load. The map uses Google Maps’ public embed. No fabricated review text or aggregate-rating schema is included.

## Service-area pages and Central Texas articles

The site contains six service-area pages for New Braunfels, Cibolo, Schertz, San Marcos, La Vernia, and San Antonio, plus 50 distinct Central Texas blog articles. The homepage and core service pages retain Seguin as the primary focus. Each article contains exactly 300 body words, excluding the H1, metadata, sources, related cards, and shared call to action. Blog pages use regional calls to action rather than Seguin-focused copy.

Add area records to `content/area-pages.json`:

```json
{"slug":"new-braunfels-glass-installation","h1":"Custom Glass Installation in New Braunfels, TX","metaTitle":"Custom Glass Installation in New Braunfels | Modern Glass","metaDescription":"An original description of the actual services and useful local details.","city":"New Braunfels","intro":"Original local introduction.","sections":[{"heading":"A useful local service heading","text":"Original local service content."}],"relatedCategories":["Shower planning"]}
```

Add blog records to `content/posts.json`:

```json
{"slug":"planning-frameless-shower-glass-seguin","h1":"Planning Frameless Shower Glass in Seguin","metaTitle":"Planning Frameless Shower Glass in Seguin | Modern Glass","metaDescription":"An original description that accurately summarizes the article.","category":"Shower planning","paragraphs":["Exactly 300 body words across the article paragraphs."]}
```

Each record generates `/blog/{slug}` with its own H1, title, description, canonical URL (when configured), and sitemap entry. The blog index includes search, category filters, and progressive loading; all articles remain available without JavaScript. Related articles, service-area links, BlogPosting schema, and breadcrumb schema connect the new content. The verification script requires exactly 300 whitespace-delimited body words per article and unique slugs. Titles, descriptions, and the CTA are excluded from the body word count. Use 50 distinct topics with natural alignment among search intent, slug, H1, and metadata; avoid interchangeable city-name articles.

## Verification limits

Automated checks validate generated pages, unique metadata, one H1 per page, JSON-LD parsing, internal links, FAQ count, logo presence, and article word counts. Live third-party widget behavior, email app handoff, and visual browser behavior still require checking on the deployed origin.
