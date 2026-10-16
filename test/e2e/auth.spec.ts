import { expect, test } from "@playwright/test";
const api = "http://127.0.0.1:4010";
const alerts = '[role="alert"]:not(#__next-route-announcer__)';
test.beforeEach(async ({ request }) => { await request.post(api + "/__reset"); });

test("wrong credentials stay on login without refreshing; valid login confirms the session", async ({ page, request }) => {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("utpal@example.test");
  await page.getByLabel("Password", { exact: true }).fill("WrongPass1!");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator(alerts)).toContainText("Wrong password");
  await expect(page).toHaveURL(/\/login$/);
  let calls = (await (await request.get(api + "/__requests")).json()).data;
  expect(calls.some((r: { path: string }) => r.path.includes("refresh-token"))).toBe(false);
  await page.getByLabel("Password", { exact: true }).fill("CorrectPass1!");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
  calls = (await (await request.get(api + "/__requests")).json()).data;
  expect(calls.some((r: { path: string }) => r.path === "/api/v1/auth/me")).toBe(true);
  expect(await page.evaluate(() => localStorage.getItem("accessToken"))).toBeNull();
});

test("register validates passwords, verifies OTP, and returns to login", async ({ page, request }) => {
  await page.goto("/register");
  await page.getByLabel("Name", { exact: true }).fill("Utpal");
  await page.getByLabel("Email address").fill("Utpal@Example.test");
  await page.getByLabel("Password", { exact: true }).fill("CorrectPass1!");
  await page.getByLabel("Confirm password").fill("Mismatch1!");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.locator(alerts)).toContainText("Passwords do not match");
  await page.getByLabel("Confirm password").fill("CorrectPass1!");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Check your inbox." })).toBeVisible();
  await page.getByLabel("4-digit code").fill("9999");
  await page.getByRole("button", { name: "Verify email", exact: true }).click();
  await expect(page.locator(alerts)).toContainText("Invalid OTP");
  await page.getByRole("button", { name: "Resend verification code" }).click();
  await expect(page.getByRole("status")).toContainText("verification code has been sent");
  await page.getByLabel("4-digit code").fill("1234");
  await page.getByRole("button", { name: "Verify email", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Welcome back." })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Email verified");
  const calls = (await (await request.get(api + "/__requests")).json()).data;
  expect(calls.find((r: { path: string }) => r.path.endsWith("/register")).body).toEqual({ name: "Utpal", email: "utpal@example.test", password: "CorrectPass1!" });
  expect(calls.find((r: { path: string }) => r.path.endsWith("/verify-otp")).body.otp).toBe(9999);
});

test("existing users can verify email and recover a password", async ({ page, request }) => {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("utpal@example.test");
  await page.getByRole("button", { name: "Need to verify your email?" }).click();
  await expect(page.getByLabel("Email address")).toHaveValue("utpal@example.test");
  await page.getByRole("button", { name: "Back to sign in" }).click();
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await page.getByRole("button", { name: "Send reset code" }).click();
  await page.getByLabel("4-digit code").fill("1234");
  await page.getByLabel("New password", { exact: true }).fill("NewPassword1!");
  await page.getByLabel("Confirm password").fill("NewPassword1!");
  await page.getByRole("button", { name: "Reset password", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Password updated");
  await expect(page.getByLabel("Password", { exact: true })).toHaveValue("");
  const calls = (await (await request.get(api + "/__requests")).json()).data;
  expect(calls.find((r: { path: string }) => r.path.endsWith("/reset-password")).body).toEqual({ email: "utpal@example.test", otp: 1234, password: "NewPassword1!" });
});

test("cookie session failure does not enter the dashboard", async ({ page }) => {
  await page.route("**/auth/me", route => route.fulfill({ status: 401, json: { message: "No session" } }));
  await page.route("**/auth/refresh-token", route => route.fulfill({ status: 401, json: { message: "No session" } }));
  await page.goto("/login");
  await page.getByLabel("Email address").fill("utpal@example.test");
  await page.getByLabel("Password", { exact: true }).fill("CorrectPass1!");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator(alerts)).toContainText("session could not be confirmed");
  await expect(page).toHaveURL(/\/login$/);
});

test("mobile login supports password visibility and Google sign-in", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.getByLabel("Password", { exact: true }).fill("Example1!");
  await page.getByRole("button", { name: "Show password", exact: true }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "text");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "test-results/mobile-login.png", fullPage: true });
  await page.route("**/auth/google", route => route.fulfill({ status: 200, body: "Google redirect fixture" }));
  await page.getByRole("button", { name: "Continue with Google" }).click();
  await expect(page).toHaveURL(/\/api\/v1\/auth\/google$/);
});
