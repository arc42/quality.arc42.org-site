# CDN Approach — Addons and Practical References

Candidate material to extend the [Content Delivery Network (CDN)](../../_approaches/C/content-delivery-network.md) approach page. Collected as neutral, vendor-independent references — not as product endorsements.

---

## Major CDN Providers (Representative, Non-Exhaustive)

A small number of providers carry the majority of global CDN traffic. Market-share figures vary widely by measurement method (customer count vs. traffic volume vs. enterprise revenue), so the list below is ordered alphabetically.

| Provider | Typical Positioning | Notes |
|----------|---------------------|-------|
| **Akamai** | Enterprise-scale, oldest large CDN | Often cited as handling a large share of global internet traffic; strong in media, finance, public sector. |
| **Amazon CloudFront** | AWS-native stacks | Tight integration with S3, Lambda@Edge, and AWS WAF. |
| **Cloudflare** | Broad free tier, integrated security | Large customer base; combines CDN with WAF, DDoS protection, and edge compute (Workers). |
| **Fastly** | Developer control, real-time edge logic | Instant purge, VCL and Compute@Edge for programmable edges. |
| **Google Cloud CDN** | GCP-native stacks | Integrated with Cloud Load Balancing and Cloud Armor. |

Other notable providers include **Bunny.net** (price/performance focus), **Microsoft Azure Front Door**, **jsDelivr** (open-source asset CDN), and regional specialists such as **ArvanCloud**, **CDNetworks**, and **ChinaCache**.

**Market size (context only):** the CDN market is estimated at roughly USD 22 billion in 2024 with projections toward USD 45 billion by 2030.

---

## Practical Example: CDN Absorbs Large-Scale DDoS Attacks

CDNs are increasingly used not only for latency reduction but as the first line of defence against volumetric attacks. Recent public incident reports illustrate what "edge absorbs the surge" looks like at internet scale:

- **May 2025 — 7.3 Tbps attack blocked**: Cloudflare's automated systems mitigated a 7.3 Tbps attack against a hosting provider using Magic Transit. At the time, this was the largest publicly reported attack.
- **September 2025 — 11.5 Tbps UDP flood**: A short (~35 s) hyper-volumetric attack was absorbed autonomously at the edge.
- **Q4 2025 — 31.4 Tbps attack**: Another 35-second peak representing a > 700% growth in peak attack size compared to late 2024.
- **Overall volume**: 27.8 million DDoS attacks mitigated in the first half of 2025 — more than the total for all of 2024.

These cases are useful in the approach page because they demonstrate three CDN properties at once: (a) fan-out capacity at the edge, (b) automated detection and mitigation without origin involvement, and (c) origin shielding — the attacked customer's origin remained reachable throughout.

---

## Candidate "Case Study" Links

Suitable for a short "Practical Examples" subsection on the CDN approach page:

- [Defending the Internet: how Cloudflare blocked a monumental 7.3 Tbps DDoS attack](https://blog.cloudflare.com/defending-the-internet-how-cloudflare-blocked-a-monumental-7-3-tbps-ddos/)
- [Cloudflare Q4 2025 DDoS threat report — 31.4 Tbps peak](https://blog.cloudflare.com/ddos-threat-report-2025-q4/)
- [Cloudflare: Famous DDoS attacks (learning article)](https://www.cloudflare.com/learning/ddos/famous-ddos-attacks/)
- [Cloudflare Radar — live DDoS dashboards](https://radar.cloudflare.com/)

## Candidate Neutral / Cross-Provider References

- [Web Almanac 2022 — CDN chapter](https://almanac.httparchive.org/en/2022/cdn) — cross-provider measurement data.
- [RFC 9111 — HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html) — the protocol basis every CDN implements.
- [MDN — HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [RFC 5861 — `stale-while-revalidate` / `stale-if-error`](https://www.rfc-editor.org/rfc/rfc5861) — cache freshness semantics used by edge networks.

---

## Suggested Wording for the Approach Page

A short, neutral paragraph could be added under "Variants and Related Tactics" or as a new "Practical Examples" section:

> **In practice.** Major CDN providers include Akamai, Amazon CloudFront, Cloudflare, Fastly, and Google Cloud CDN; regional and specialised providers (Bunny.net, Azure Front Door, jsDelivr, ArvanCloud) serve specific niches. Public incident reports illustrate the edge-absorption effect at scale — for example, Cloudflare's autonomous mitigation of an 11.5 Tbps UDP flood in September 2025 and a 31.4 Tbps peak in Q4 2025, where the attacked origin remained reachable throughout.

Phrasing keeps provider mentions factual (who they are, what niche) rather than comparative, and ties the case study to a specific approach property (origin shielding under load) rather than to a product advertisement.

---

## Open Questions

- Should the approach page link to a live dashboard (e.g. Cloudflare Radar, Akamai State of the Internet) or only to static references? Live dashboards keep the page current but add a soft dependency on one vendor's framing.
- Include a small "Self-Operated vs. Commercial CDN" note? (Relevant for sovereignty-constrained domains — public sector, healthcare, defence.)
- Is a separate approach page for **Edge Compute** warranted, or keep it as a variant under CDN?

---

**Sources**

- [Best CDN Software in 2026 — 6sense](https://6sense.com/tech/content-delivery-network-cdn)
- [Top 25+ CDNs by market share — WMTips](https://www.wmtips.com/technologies/cdn/)
- [Best CDN Providers 2026 — Atlantic.net](https://www.atlantic.net/cloud-platform/best-cdn-providers-for-performance-security/)
- [Cloudflare blog — 7.3 Tbps DDoS blocked](https://blog.cloudflare.com/defending-the-internet-how-cloudflare-blocked-a-monumental-7-3-tbps-ddos/)
- [Cloudflare blog — Q4 2025 DDoS threat report (31.4 Tbps)](https://blog.cloudflare.com/ddos-threat-report-2025-q4/)
- [SecurityWeek — 11.5 Tbps DDoS blocked](https://www.securityweek.com/cloudflare-blocks-record-11-5-tbps-ddos-attack/)
