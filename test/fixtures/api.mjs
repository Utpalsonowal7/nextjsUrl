// Deterministic API contract fixture for browser tests. Never used by the application.
import http from 'node:http';
let pages = [];
let nextId = 1;
let requests = [];
const dns = hostname => ({ ownership: { type: 'TXT', name: `_utpx-verification.${hostname}`, value: 'utpx_verify_test' }, routing: { type: 'CNAME', name: hostname, value: 'short.example.test' } });
let domains;
const reset = () => { pages = []; nextId = 1; requests = []; domains = [ { id: 1, domain: 'links.example.test', isVerified: true, dns: dns('links.example.test') }, { id: 2, domain: 'pending.example.test', isVerified: false, dns: dns('pending.example.test') } ].map(d => ({ ...d, verifiedAt: null, createdAt: new Date().toISOString() })); };
reset();
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  let data = ''; for await (const chunk of req) data += chunk;
  const body = data ? JSON.parse(data) : {};
  const path = new URL(req.url, 'http://localhost').pathname;
  const send = (value, status = 200) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(value)); };
  const ok = (value, status = 200) => send({ success: true, data: value, message: 'OK' }, status);
  if (path === '/__reset') { reset(); return ok(null); }
  if (path === '/__requests') return ok(requests);
  requests.push({ method: req.method, path, body, cookie: req.headers.cookie || '' });
  if (path === '/api/v1/auth/me') return ok({ user: { id: 7, name: 'Utpal Sonowal', email: 'utpal@example.test' } });
  if (path === '/api/v1/auth/login') return body.password === 'WrongPass1!' ? send({ message: 'Wrong password' }, 401) : ok({ user: { id: 7, name: 'Utpal Sonowal', email: body.email }, accessToken: 'fixture-token', refreshToken: 'fixture-refresh' });
  if (path === '/api/v1/auth/register') return body.email === 'taken@example.test' ? send({ message: 'User already exists' }, 409) : ok({ newUser: { email: body.email } });
  if (path === '/api/v1/auth/verify-otp' || path === '/api/v1/auth/reset-password') return body.otp === 1234 ? ok(null) : send({ message: 'Invalid OTP' }, 400);
  if (path === '/api/v1/auth/resend-otp' || path === '/api/v1/auth/forgot-password') return ok(null);
  if (path === '/api/v1/auth/logout') return ok(null);
  if (path === '/api/v1/domain' && req.method === 'GET') return ok({ domains: { domainFormat: domains } });
  if (path === '/api/v1/domain' && req.method === 'POST') { const domain = { id: 3, domain: body.domain, isVerified: false, dns: dns(body.domain), createdAt: new Date().toISOString() }; domains.push(domain); return ok(domain, 201); }
  if (/\/domain\/\d+\/verify$/.test(path)) { const domain = domains.find(d => d.id === Number(path.split('/')[4])); return ok({ ...domain, isVerified: false, checks: { ownership: true, routing: false } }); }
  if (/\/domain\/\d+$/.test(path) && req.method === 'DELETE') return send({ message: 'Remove this domain from its links and bio page before deleting it' }, 409);
  if (path === '/api/v1/links' && req.method === 'POST') return ok({ longUrl: body.longUrl, shortLink: `${body.domainId ? 'https://links.example.test/' : 'https://short.example.test/'}hello` }, 201);
  if (path === '/api/v1/links/verify') return body.password === 'correct' ? ok('https://destination.example.test') : send({ message: 'Wrong password' }, 400);
  if (path.startsWith('/api/v1/public/bio-pages/')) {
    const tail = decodeURIComponent(path.slice('/api/v1/public/bio-pages/'.length));
    const page = tail.startsWith('domain/') ? pages.find(p => p.domainId === domains.find(d => d.domain === tail.slice(7) && d.isVerified)?.id && p.isPublished) : pages.find(p => p.slug === tail && p.isPublished);
    if (!page) return send({ message: 'Bio page not found' }, 404);
    const { slug, displayName, description, avatarUrl, theme, design, links } = page;
    return ok({ slug, displayName, description, avatarUrl, theme, design, links: links.filter(l => l.isActive).map(({ title, url, icon }, position) => ({ title, url, icon, position })) });
  }
  if (path === '/api/v1/bio-pages' && req.method === 'GET') return ok(pages);
  if (path === '/api/v1/bio-pages' && req.method === 'POST') {
    if (body.slug === 'taken') return send({ message: 'This slug or domain is already assigned to a bio page' }, 409);
    const page = { ...body, id: nextId++, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; pages.push(page); return ok(page, 201);
  }
  if (/\/bio-pages\/\d+$/.test(path)) {
    const page = pages.find(p => p.id === Number(path.split('/').at(-1)));
    if (!page) return send({ message: 'Bio page not found' }, 404);
    if (req.method === 'PATCH') Object.assign(page, body);
    if (req.method === 'DELETE') pages = pages.filter(p => p.id !== page.id);
    return ok(page);
  }
  return send({ message: 'Unexpected fixture endpoint: ' + path }, 404);
});
server.listen(4010, '127.0.0.1');
