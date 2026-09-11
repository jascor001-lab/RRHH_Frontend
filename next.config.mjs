import withPWAInit from "next-pwa";

/**
 * Misma configuración PWA que Carta Fianza:
 * - next-pwa activo también en desarrollo
 * - fallback /offline solo en producción
 * - arranque HTTP en 0.0.0.0 (sin HTTPS)
 */
const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.DISABLE_PWA === "true",
  buildExcludes: [/middleware-manifest\.json$/],
  fallbacks:
    process.env.NODE_ENV === "production"
      ? { document: "/offline" }
      : undefined,
  runtimeCaching: [
    {
      urlPattern: /\/auth-api\/.*/i,
      handler: "NetworkOnly",
      options: {
        cacheName: "rrhh-auth-api",
      },
    },
    {
      urlPattern: /\/files-api\/.*/i,
      handler: "NetworkOnly",
      options: {
        cacheName: "rrhh-files-api",
      },
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "rrhh-next-static",
        expiration: {
          maxEntries: 128,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /\/icons\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "rrhh-icons",
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 60 * 60 * 24 * 60,
        },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === "document",
      handler: "NetworkFirst",
      options: {
        cacheName: "rrhh-pages",
        networkTimeoutSeconds: 8,
        expiration: {
          maxEntries: 48,
          maxAgeSeconds: 60 * 60 * 24,
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "rrhh-images",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permite el origen LAN además de localhost (dev / HMR)
  allowedDevOrigins: [
    "192.168.7.223",
    "http://192.168.7.223:3004",
    "http://192.168.7.223",
  ],
  async rewrites() {
    return [
      {
        source: "/auth-api/:path*",
        destination: "http://127.0.0.1:3007/:path*",
      },
      {
        source: "/files-api/:path*",
        destination: "http://127.0.0.1:3010/:path*",
      },
    ];
  },
};

export default withPWA(nextConfig);
