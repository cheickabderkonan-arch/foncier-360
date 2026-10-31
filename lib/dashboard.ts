import { prisma } from "@/lib/prisma";

export async function getProjectDashboard(projectId: string) {
  const [lots, sales, payments, expenses] = await Promise.all([
    prisma.lot.findMany({ where: { projectId }, select: { status: true, price: true } }),
    prisma.sale.findMany({ where: { lot: { projectId } }, select: { totalAmount: true } }),
    prisma.payment.findMany({ where: { sale: { lot: { projectId } } }, select: { amount: true } }),
    prisma.expense.findMany({ where: { projectId }, select: { amount: true, status: true } }),
  ]);

  const totalLots = lots.length;
  const soldLots = lots.filter((lot) => lot.status === "SOLD").length;
  const reservedLots = lots.filter((lot) => lot.status === "RESERVED").length;
  const availableLots = lots.filter((lot) => lot.status === "AVAILABLE").length;
  const expectedRevenue = sales.reduce((total, sale) => total + Number(sale.totalAmount), 0) + lots.filter((lot) => lot.status !== "SOLD").reduce((total, lot) => total + Number(lot.price), 0);
  const collectedAmount = payments.reduce((total, payment) => total + Number(payment.amount), 0);
  const committedExpenses = expenses.reduce((total, expense) => total + Number(expense.amount), 0);

  return {
    totalLots,
    soldLots,
    reservedLots,
    availableLots,
    expectedRevenue,
    collectedAmount,
    remainingAmount: Math.max(expectedRevenue - collectedAmount, 0),
    committedExpenses,
    estimatedMargin: expectedRevenue - committedExpenses,
    commercializationRate: totalLots ? Math.round((soldLots / totalLots) * 100) : 0,
  };
}
