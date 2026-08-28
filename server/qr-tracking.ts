import { pool } from "./db";

// Self-migrating table: idempotent, runs at startup, no drizzle-kit push needed.
export async function ensureQrScansTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS qr_scans (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      user_agent TEXT
    );
    CREATE INDEX IF NOT EXISTS qr_scans_slug_idx ON qr_scans (slug);
  `);
}

export async function recordScan(slug: string, userAgent?: string): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO qr_scans (slug, user_agent) VALUES ($1, $2)`,
      [slug, userAgent ? userAgent.slice(0, 500) : null],
    );
  } catch (err) {
    // Never let a tracking failure surface to the visitor or block the redirect.
    console.error("[qr-tracking] failed to record scan:", err);
  }
}

export interface QrScanCount {
  slug: string;
  scans: number;
  last_scan: string | null;
}

export async function getScanCounts(): Promise<QrScanCount[]> {
  const { rows } = await pool.query(`
    SELECT slug, count(*)::int AS scans, max(created_at) AS last_scan
    FROM qr_scans
    GROUP BY slug
    ORDER BY scans DESC, last_scan DESC
  `);
  return rows;
}
