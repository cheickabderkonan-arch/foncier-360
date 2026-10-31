import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { lotSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const projectId = new URL(request.url).searchParams.get("projectId");
  const lots = await prisma.lot.findMany({ where: projectId ? { projectId } : undefined, orderBy: { code: "asc" } });
  return NextResponse.json(lots);
}

export async function POST(request: Request) {
  const parsed = lotSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  const lot = await prisma.lot.create({ data: parsed.data });
  return NextResponse.json(lot, { status: 201 });
}
