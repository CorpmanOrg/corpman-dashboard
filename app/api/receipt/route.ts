import { NextRequest, NextResponse } from 'next/server';

// Use a separate env for asset base if available
const RAW_ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE || process.env.NEXT_PUBLIC_API_TEST_URL || '';

// Normalize base (remove trailing /api if present, since static assets often live at root)
function deriveAssetBase(base: string) {
  if (!base) return '';
  // If base ends with /api, strip it for assets
  return base.replace(/\/?api\/?$/i, '').replace(/\/$/, '');
}

const ASSET_BASE = deriveAssetBase(RAW_ASSET_BASE);

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path');
  if (!path) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
  }

  // Do not allow protocol-relative or absolute external domains (basic safety)
  if (/^https?:\/\//i.test(path)) {
    // You could optionally whitelist domains here.
    // For simplicity, we allow full URLs but still fetch them server-side.
  }

  const target = /^https?:\/\//i.test(path)
    ? path
    : `${ASSET_BASE}/${path.replace(/^\//, '')}`;

  try {
    const upstream = await fetch(target, { method: 'GET' });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Upstream fetch failed', status: upstream.status, target },
        { status: upstream.status === 404 ? 404 : 502 }
      );
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    const arrayBuffer = await upstream.arrayBuffer();
    const fileName = target.split('/').pop() || 'file';

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=60',
        'X-Proxy-Target': target,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Proxy error', target },
      { status: 500 }
    );
  }
}
