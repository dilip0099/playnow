import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const referer = searchParams.get('referer') || 'https://vidsrc.to/';

  if (!targetUrl) {
    return new NextResponse('Missing url query parameter', { status: 400 });
  }

  try {
    const rangeHeader = request.headers.get('range');

    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': referer,
        ...(rangeHeader ? { Range: rangeHeader } : {}),
      },
      responseType: 'arraybuffer',
      timeout: 12000,
    });

    const responseHeaders: Record<string, string> = {
      'Content-Type': String(response.headers['content-type'] || 'video/MP2T'),
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    };

    if (response.headers['content-length']) {
      responseHeaders['Content-Length'] = String(response.headers['content-length']);
    }
    if (response.headers['content-range']) {
      responseHeaders['Content-Range'] = String(response.headers['content-range']);
    }

    return new NextResponse(response.data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('HLS Segment Proxy Error:', error.message);
    return new NextResponse('Failed to fetch segment', { status: 500 });
  }
}
