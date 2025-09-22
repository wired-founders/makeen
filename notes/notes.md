
Auth & session data
1. cookie
2. authorization

Request context
1. host (the domain)
2. referer (where the request came from)
3. Origin: CORS origin info.

4. user-agent (browser / device details) 
5. accept-language (user’s preferred language, useful for localization)
6. accept (what content types the client accepts)

Networking / Infra
1. IP address: usually available from req.ip, x-forwarded-for, or platform-specific headers (e.g. cf-connecting-ip on Cloudflare, x-real-ip on Nginx).
2. Connection details: TLS version, sometimes device hints if your infra passes them.

# Client side

Location
1. navigator.geolocation → Approx GPS location (only if user explicitly allows it in the browser prompt)

Network (very limited now for privacy reasons)
1. navigator.connection (a.k.a. Network Information API) → Approx. network type (wifi, 4g, etc.), downlink speed estimate

Other context
1. document.referrer → Where the user came from
2. window.location → Current page URL, pathname, query params
3. performance.timing / performance.navigation → Page load timing metrics
4. performance.getEntriesByType("navigation" | "resource") → Network & resource timing for analytics


Device & Browser
1. navigator.userAgent -> Browser + OS signature
2. navigator.platform → OS family (Win32, MacIntel, etc.)
3. navigator.language / navigator.languages → User’s preferred languages
4. navigator.deviceMemory → Approximate RAM (in GB, rounded)
5. navigator.hardwareConcurrency → Number of logical CPU cores
6. navigator.vendor → Browser vendor string (e.g. Google Inc.)
7. navigator.maxTouchPoints → Touch support (helps detect mobile/tablet)

Display
1. window.innerWidth, window.innerHeight → Viewport size
2. screen.width, screen.height → Physical screen resolution
3. window.devicePixelRatio → Zoom/Retina scaling factor