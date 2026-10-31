import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerSchema } from "@/lib/validation";

export async function GET() {
  return NextResponse.json(await prisma.customer.findMany({ orderBy: { createdAt: "desc" } }));
}

export async function POST(request: Request) {
  const parsed = customerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  const organization = await prisma.organization.findFirst();
  if (!organization) return NextResponse.json({ error: "Aucune organisation configurée" }, { status: 409 });
  return NextResponse.json(await prisma.customer.create({ data: { ...parsed.data, organizationId: organization.id } }), { status: 201 });
}
