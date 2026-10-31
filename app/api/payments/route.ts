import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const saleId = new URL(request.url).searchParams.get("saleId");
  return NextResponse.json(await prisma.payment.findMany({ where: saleId ? { saleId } : undefined, orderBy: { paidAt: "desc" } }));
}

export async function POST(request: Request) {
  const body = await request.json();
  const amount = Number(body.amount);
  if (!body.saleId || !Number.isFinite(amount) || amount <= 0) return NextResponse.json({ error: "Vente et montant valides requis" }, { status: 400 });
  const sale = await prisma.sale.findUnique({ where: { id: body.saleId }, include: { payments: true } });
  if (!sale) return NextResponse.json({ error: "Vente introuvable" }, { status: 404 });
  const paid = sale.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  if (paid + amount > Number(sale.totalAmount)) return NextResponse.json({ error: "Le paiement dépasse le solde de la vente" }, { status: 409 });
  const payment = await prisma.payment.create({ data: { saleId: sale.id, amount, reference: body.reference?.trim() || undefined, status: paid + amount >= Number(sale.totalAmount) ? "PAID" : "PARTIAL" } });
  return NextResponse.json(payment, { status: 201 });
}
