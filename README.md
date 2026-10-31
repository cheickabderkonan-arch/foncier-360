# FONCIER 360

Application SaaS de gestion de projets fonciers, lots, clients, ventes, paiements et travaux.

## Démarrage local

```bash
npm install
cp .env.example .env
# renseigner DATABASE_URL
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Ouvrir http://localhost:3000.

## API disponible

- `GET/POST /api/projects`
- `GET/POST /api/lots`
- `GET/POST /api/customers`

## État du MVP

La branche `feature/mvp-foundation` contient le socle Next.js, le schéma Prisma, les modèles projets/lots/clients/réservations/ventes/paiements/travaux/dépenses/documents, les validations Zod, les données de démonstration et les premiers endpoints.

La base PostgreSQL et l'authentification doivent être configurées avant un déploiement de production. Ne jamais committer `.env` ni de secret réel.
