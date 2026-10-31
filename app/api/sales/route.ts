import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const projectId = new URL(request.url).searchParams.get("projectId");
  return NextResponse.json(await prisma.sale.findMany({ where: projectId ? { lot: { projectId } } : undefined, include: { lot: true, customer: true, payments: true }, orderBy: { soldAt: "desc" } }));
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.lotId || !body.customerId || Number(body.totalAmount) <= 0) return NextResponse.json({ error: "Lot, client et montant valides requis" }, { status: 400 });
  const lot = await prisma.lot.findUnique({ where: { id: body.lotId } });
  if (!lot || ["SOLD", "BLOCKED"].includes(lot.status)) return NextResponse.json({ error: "Ce lot ne peut pas être vendu" }, { status: 409 });
  const sale = await prisma.$transaction(async (tx) => {
    const created = await tx.sale.create({ data: { lotId: body.lotId, customerId: body.customerId, totalAmount: Number(body.totalAmount) } });
    await tx.lot.update({ where: { id: body.lotId }, data: { status: "SOLD" } });
    return created;
  });
  return NextResponse.json(sale, { status: 201 });
}
