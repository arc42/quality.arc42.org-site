import { test, expect, request } from "@playwright/test";

/**
 * PRODUCTION check: HTTP → HTTPS redirect.
 *
 * The Lighthouse suite audits the local dev server (http://jekyll:4045),
 * which has no TLS listener — so Lighthouse's `redirects-http` audit can
 * never pass locally and is skipped there (see lighthouse.spec.ts). The
 * redirect itself is performed by GitHub Pages ("Enforce HTTPS"), i.e. by
 * the hosting layer, not by anything in this repository. Therefore the only
 * honest place to assert it is the production origin — which is exactly
 * what this spec does. It replaces the skipped audit; it does not merely
 * compensate for it.
 *
 * Note: unlike the rest of the UI suite this needs outbound internet.
 * Set SKIP_PROD_CHECKS=1 to skip (e.g. offline development).
 */

const PROD_HOST = "quality.arc42.org";

test.describe("Production HTTPS redirect", () => {
  test.skip(
    process.env.SKIP_PROD_CHECKS === "1",
    "SKIP_PROD_CHECKS=1 — offline run",
  );

  test("http:// root 301-redirects to https://", async () => {
    const ctx = await request.newContext();
    const res = await ctx.get(`http://${PROD_HOST}/`, {
      maxRedirects: 0,
    });
    expect(res.status(), "expected a permanent redirect").toBe(301);
    expect(res.headers()["location"]).toBe(`https://${PROD_HOST}/`);
    await ctx.dispose();
  });

  test("http:// deep links redirect to https:// preserving the path", async () => {
    const ctx = await request.newContext();
    const path = "/qualities/reliability";
    const res = await ctx.get(`http://${PROD_HOST}${path}`, {
      maxRedirects: 0,
    });
    expect(res.status()).toBe(301);
    expect(res.headers()["location"]).toBe(`https://${PROD_HOST}${path}`);
    await ctx.dispose();
  });

  test("https:// root serves the site directly (no redirect loop)", async () => {
    const ctx = await request.newContext();
    const res = await ctx.get(`https://${PROD_HOST}/`, {
      maxRedirects: 0,
    });
    expect(res.status()).toBe(200);
    await ctx.dispose();
  });
});
