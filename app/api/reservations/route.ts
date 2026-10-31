import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const projectId = new URL(request.url).searchParams.get("projectId");
  const reservations = await prisma.reservation.findMany({ where: projectId ? { lot: { projectId } } : undefined, include: { lot: true, customer: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(reservations);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.lotId || !body.customerId || Number(body.amount) <= 0) return NextResponse.json({ error: "Lot, client et montant valides requis" }, { status: 400 });
  const lot = await prisma.lot.findUnique({ where: { id: body.lotId } });
  if (!lot || lot.status !== "AVAILABLE") return NextResponse.json({ error: "Ce lot n'est pas disponible" }, { status: 409 });
  const reservation = await prisma.$transaction(async (tx) => {
    const created = await tx.reservation.create({ data: { lotId: body.lotId, customerId: body.customerId, amount: Number(body.amount), expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined } });
    await tx.lot.update({ where: { id: body.lotId }, data: { status: "RESERVED" } });
    return created;
  });
  return NextResponse.json(reservation, { status: 201 });
}
