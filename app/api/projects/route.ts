import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validation";

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { lots: true } } } });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const parsed = projectSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  const organization = await prisma.organization.findFirst();
  if (!organization) return NextResponse.json({ error: "Aucune organisation configurée" }, { status: 409 });
  const project = await prisma.project.create({ data: { ...parsed.data, organizationId: organization.id } });
  return NextResponse.json(project, { status: 201 });
}
