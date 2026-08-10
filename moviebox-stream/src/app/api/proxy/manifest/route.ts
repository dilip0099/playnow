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
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': referer,
      },
      responseType: 'text',
      timeout: 8000,
    });

    let manifestContent = response.data;
    const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);

    // Rewrite relative URLs to route through proxy
    manifestContent = manifestContent.replace(
      /^(?!#)(?!\s*$)(.+)$/gm,
      (line: string) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
          if (trimmed.includes('.m3u8')) {
            return `/api/proxy/manifest?url=${encodeURIComponent(trimmed)}&referer=${encodeURIComponent(referer)}`;
          } else {
            return `/api/proxy/segment?url=${encodeURIComponent(trimmed)}&referer=${encodeURIComponent(referer)}`;
          }
        }
        
        const absoluteUrl = new URL(trimmed, baseUrl).toString();
        if (trimmed.includes('.m3u8')) {
          return `/api/proxy/manifest?url=${encodeURIComponent(absoluteUrl)}&referer=${encodeURIComponent(referer)}`;
        } else {
          return `/api/proxy/segment?url=${encodeURIComponent(absoluteUrl)}&referer=${encodeURIComponent(referer)}`;
        }
      }
    );

    return new NextResponse(manifestContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('HLS Manifest Proxy Error:', error.message);
    return new NextResponse('Failed to proxy HLS manifest', { status: 500 });
  }
}
