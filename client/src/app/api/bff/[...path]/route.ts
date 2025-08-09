import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001/api/v1";

type Params = { path?: string[] };

async function proxy(req: NextRequest, paramsPromise: Promise<Params>) {
  const { path } = await paramsPromise;
  const segments = (path ?? []).join("/");
  const target = new URL(`${API_BASE}/${segments}`);
  target.search = req.nextUrl.search;

  const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const access = (jwt as any)?.token as string | undefined;
  if (!access) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const hasBody = !["GET", "HEAD"].includes(req.method);
  const init: RequestInit = {
    method: req.method,
    headers: {
      ...(req.headers.get("content-type") ? { "Content-Type": req.headers.get("content-type")! } : {}),
      Authorization: `Bearer ${access}`,
    },
    cache: "no-store",
    body: hasBody ? await req.text() : undefined,
  };

  const res = await fetch(target, init);

  if (res.status === 204) return new NextResponse(null, { status: 204 });

  const text = await res.text();
  const headers = new Headers();
  const ct = res.headers.get("content-type");
  if (ct) headers.set("content-type", ct);
  return new NextResponse(text, { status: res.status, headers });
}

export async function GET(req: NextRequest, ctx: { params: Promise<Params> }) {
  return proxy(req, ctx.params);
}
export async function POST(req: NextRequest, ctx: { params: Promise<Params> }) {
  return proxy(req, ctx.params);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<Params> }) {
  return proxy(req, ctx.params);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<Params> }) {
  return proxy(req, ctx.params);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<Params> }) {
  return proxy(req, ctx.params);
}
export async function HEAD(req: NextRequest, ctx: { params: Promise<Params> }) {
  return proxy(req, ctx.params);
}
