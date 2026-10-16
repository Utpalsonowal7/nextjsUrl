import { expect, test } from "@playwright/test";
const api = "http://127.0.0.1:4010";
const sample = { slug: "utpal", displayName: "Utpal Sonowal", description: "Building useful things for the web.", avatarUrl: null, theme: "light", isPublished: true, domainId: 1, links: [{ title: "Portfolio", url: "https://utpx.in", isActive: true }, { title: "Private project", url: "https://private.example.test", isActive: false }] };
test.beforeEach(async ({ request }) => { await request.post(`${api}/__reset`); });

test("create a draft, reorder links, publish, and unpublish", async ({ page, request }) => {
  await page.goto("/pages");
  await expect(page.getByRole("heading", { name: "One page. All your links." })).toBeVisible();
  await page.getByRole("link", { name: "Create your first page" }).click();
  await page.getByLabel("Display name", { exact: true }).fill("Utpal Sonowal");
  await page.getByLabel("Page address").fill("utpal");
  await page.getByLabel("About you").fill("Building useful things for the web.");
  await page.getByRole("button", { name: "Add a link" }).click();
  await page.getByLabel("Link title", { exact: true }).fill("Portfolio");
  await page.getByLabel("Destination URL", { exact: true }).fill("https://utpx.in");
  await page.getByRole("button", { name: "Add a link" }).click();
  await page.getByLabel("Link title", { exact: true }).nth(1).fill("GitHub");
  await page.getByLabel("Destination URL", { exact: true }).nth(1).fill("https://github.com/utpal");
  await page.getByRole("button", { name: "Move link 2 up" }).click();
  await expect(page.getByLabel("Link title", { exact: true }).first()).toHaveValue("GitHub");
  await page.getByLabel("Custom domain", { exact: true }).selectOption("1");
  await page.getByRole("button", { name: "Create page", exact: true }).click();
  await expect(page).toHaveURL(/\/pages\/1\/edit/);
  const saved = (await (await request.get(`${api}/api/v1/bio-pages/1`)).json()).data;
  expect(saved.isPublished).toBe(false);
  expect(saved.domainId).toBe(1);
  expect(saved.links.map((link: { title: string }) => link.title)).toEqual(["GitHub", "Portfolio"]);
  expect(Object.keys(saved.links[0]).sort()).toEqual(["icon", "isActive", "title", "url"]);
  await page.getByLabel("Publish this page").check();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByText("Saved. Your page is live.")).toBeVisible();
  await page.goto("/b/utpal");
  await expect(page.getByRole("link", { name: /Portfolio/ })).toHaveAttribute("href", "https://utpx.in");
  await page.goto("/pages");
  await page.getByRole("button", { name: "Unpublish", exact: true }).click();
  await page.goto("/b/utpal");
  await expect(page.getByRole("heading", { name: "This page isn’t available." })).toBeVisible();
});

test("save failure preserves the draft and unsafe URLs are rejected", async ({ page }) => {
  await page.goto("/pages/new");
  await page.getByLabel("Display name", { exact: true }).fill("Keep my work");
  await page.getByLabel("Page address").fill("taken");
  await page.getByRole("button", { name: "Create page", exact: true }).click();
  await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toContainText("already assigned");
  await expect(page.getByLabel("Display name", { exact: true })).toHaveValue("Keep my work");
  await page.getByRole("button", { name: "Add a link" }).click();
  await page.getByLabel("Link title", { exact: true }).fill("Unsafe");
  await page.getByLabel("Destination URL", { exact: true }).fill("javascript:alert(1)");
  await page.getByRole("button", { name: "Create page", exact: true }).click();
  await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toContainText("HTTP or HTTPS");
});

test("DNS mismatch stays unverified and deletion conflict is shown", async ({ page }) => {
  await page.goto("/domain");
  const card = page.locator("article").filter({ hasText: "pending.example.test" });
  await card.getByRole("button", { name: "DNS settings" }).click();
  await expect(card.getByText("_utpx-verification.pending.example.test")).toBeVisible();
  await expect(card.getByText("utpx_verify_test")).toBeVisible();
  await card.getByRole("button", { name: "Verify DNS records" }).click();
  await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toContainText("Routing check failed");
  await expect(card.getByText("Waiting for verification")).toBeVisible();
  page.on("dialog", dialog => dialog.accept());
  await card.getByRole("button", { name: "Remove domain" }).click();
  await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toContainText("Remove this domain from its links");
  await expect(card).toBeVisible();
});

test("short links send only a verified domain selection", async ({ page, request }) => {
  await page.goto("/links/create");
  await expect(page.locator("#domain option[value='2']")).toHaveCount(0);
  await page.locator("#domain").selectOption("1");
  await page.locator("#url").fill("https://example.com/long-link");
  await page.getByRole("button", { name: "Create your link" }).click();
  await expect(page.getByText("https://links.example.test/hello", { exact: true }).first()).toBeVisible();
  const requests = (await (await request.get(`${api}/__requests`)).json()).data;
  expect(requests.find((r: { method: string; path: string }) => r.method === "POST" && r.path === "/api/v1/links").body.domainId).toBe(1);
});

test("public pages exclude inactive links and do not request authentication", async ({ page, request }) => {
  await request.post(`${api}/api/v1/bio-pages`, { data: sample });
  const authRequests: string[] = [];
  page.on("request", req => { if (req.url().includes("/auth/")) authRequests.push(req.url()); });
  await page.goto("/b/utpal");
  await expect(page.getByRole("heading", { name: "Utpal Sonowal" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Portfolio/ })).toHaveAttribute("rel", /noopener/);
  await expect(page.getByText("Private project")).toHaveCount(0);
  expect(authRequests).toEqual([]);
  await page.screenshot({ path: "test-results/public-bio.png", fullPage: true });
});

test("custom-domain roots resolve via Host and unknown domains return unavailable", async ({ request }) => {
  await request.post(`${api}/api/v1/bio-pages`, { data: sample });
  const result = await request.get("http://localhost:3000/", { headers: { host: "links.example.test" } });
  expect(await result.text()).toContain("Utpal Sonowal");
  const unknown = await request.get("http://localhost:3000/", { headers: { host: "unknown.example.test", "x-forwarded-host": "links.example.test" } });
  expect(await unknown.text()).toContain("This page isn’t available");
});

test("mobile navigation, dark mode, and editor have no horizontal overflow", async ({ page, request }) => {
  await request.post(`${api}/api/v1/bio-pages`, { data: sample });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pages");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Navigation" })).not.toBeVisible();
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.screenshot({ path: "test-results/mobile-pages-dark.png", fullPage: true });
  await page.getByRole("link", { name: "Edit page" }).click();
  await expect(page.getByLabel("Display name", { exact: true })).toHaveValue(sample.displayName);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: "test-results/mobile-editor.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await page.screenshot({ path: "test-results/desktop-editor.png", fullPage: true });
});

test("protected links show password errors without entering the signed-in workspace", async ({ page }) => {
  await page.goto("/protectedlink?q=secret");
  await page.getByLabel("Password", { exact: true }).fill("wrong");
  await page.getByRole("button", { name: "Unlock link" }).click();
  await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toContainText("Wrong password");
  await expect(page).toHaveURL(/protectedlink/);
});

test("saved custom links retain their hostname and domain guidance permits proxies", async ({ page }) => {
  await page.goto("/links");
  const link = page.getByRole("link", { name: "links.example.test/branded", exact: true });
  await expect(link).toHaveAttribute("href", "https://links.example.test/branded");
  await expect(page.getByText("Custom domain", { exact: true })).toBeVisible();
  await page.goto("/domain");
  const card = page.locator("article").filter({ hasText: "links.example.test" });
  await card.getByRole("button", { name: "DNS settings" }).click();
  await expect(card.getByText(/Proxying is supported/)).toBeVisible();
});
