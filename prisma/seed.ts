import { PrismaClient, LotStatus, ProjectStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { id: "demo-organization" },
    update: {},
    create: { id: "demo-organization", name: "FONCIER 360 Demo" },
  });

  await prisma.user.upsert({
    where: { email: "directeur@foncier360.test" },
    update: {},
    create: { email: "directeur@foncier360.test", name: "Directeur Démo", role: UserRole.DIRECTOR, organizationId: organization.id },
  });

  const project = await prisma.project.upsert({
    where: { id: "demo-project" },
    update: {},
    create: { id: "demo-project", name: "Les Jardins de Yassa", location: "Douala, Cameroun", status: ProjectStatus.ACTIVE, totalAreaM2: 12000, organizationId: organization.id },
  });

  const customer = await prisma.customer.upsert({
    where: { id: "demo-customer" },
    update: {},
    create: { id: "demo-customer", fullName: "Client Démonstration", phone: "+237 600 000 000", organizationId: organization.id },
  });

  for (let index = 1; index <= 10; index += 1) {
    await prisma.lot.upsert({
      where: { id: `demo-lot-${index}` },
      update: {},
      create: { id: `demo-lot-${index}`, code: `Y-${String(index).padStart(3, "0")}`, areaM2: 300, price: 2500000, status: index <= 4 ? LotStatus.SOLD : index <= 6 ? LotStatus.RESERVED : LotStatus.AVAILABLE, projectId: project.id },
    });
  }

  const soldLot = await prisma.lot.findUnique({ where: { id: "demo-lot-1" } });
  if (soldLot) {
    const sale = await prisma.sale.upsert({ where: { lotId: soldLot.id }, update: {}, create: { lotId: soldLot.id, customerId: customer.id, totalAmount: 2500000 } });
    await prisma.payment.deleteMany({ where: { saleId: sale.id } });
    await prisma.payment.create({ data: { saleId: sale.id, amount: 1000000, reference: "DEMO-001" } });
  }
}

main().finally(() => prisma.$disconnect());
