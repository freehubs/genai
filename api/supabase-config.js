export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400');
  const url = process.env.SUPABASE_URL || '';
  const anon = process.env.SUPABASE_ANON_KEY || '';
  res.end(`window.SUPABASE_URL=${JSON.stringify(url)};window.SUPABASE_ANON_KEY=${JSON.stringify(anon)};`);
}


