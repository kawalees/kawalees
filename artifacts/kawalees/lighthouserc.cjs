module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm run preview -- --host 0.0.0.0 --port 4173",
      startServerReadyPattern: "Local:",
      startServerReadyTimeout: 30000,
      url: ["http://localhost:4173/kawalees/", "http://localhost:4173/kawalees/join"],
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.75 }],
        "categories:accessibility": ["error", { minScore: 0.85 }],
        "categories:best-practices": ["warn", { minScore: 0.85 }],
        "categories:seo": ["warn", { minScore: 0.8 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};
