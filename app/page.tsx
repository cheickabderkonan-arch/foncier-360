import Link from "next/link";

const cards = [
  { href: "/projets", label: "Projets", description: "Créer et suivre les opérations foncières", icon: "⌂" },
  { href: "/lots", label: "Lots", description: "Consulter les disponibilités et statuts", icon: "▦" },
  { href: "/clients", label: "Clients", description: "Gérer les acquéreurs et contacts", icon: "◎" },
  { href: "/ventes", label: "Ventes", description: "Suivre les réservations et ventes", icon: "↗" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-6 py-4"><div className="mx-auto flex max-w-7xl items-center justify-between"><div><p className="text-sm font-semibold uppercase tracking-widest text-teal-700">FONCIER 360</p><h1 className="text-xl font-bold text-slate-900">Tableau de bord directeur</h1></div><span className="rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800">Les Jardins de Yassa</span></div></header>
      <section className="mx-auto max-w-7xl px-6 py-10"><div className="mb-8"><p className="mb-2 text-sm font-medium text-teal-700">Vue d’ensemble</p><h2 className="text-3xl font-bold text-slate-950">Votre activité foncière, en un coup d’œil.</h2><p className="mt-2 text-slate-600">Suivez vos lots, vos ventes, vos encaissements et vos dépenses depuis un seul espace.</p></div>
        <div className="grid gap-4 md:grid-cols-4">{[["Projets actifs", "1", "À piloter"], ["Lots disponibles", "24", "sur 60 lots"], ["Lots vendus", "28", "46,7 % commercialisés"], ["Encaissements", "42,8 M FCFA", "sur 68,4 M FCFA attendus"]].map(([label, value, detail]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold text-slate-950">{value}</p><p className="mt-2 text-sm text-slate-500">{detail}</p></article>)}</div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="text-lg font-bold">Performance du projet</h3><p className="text-sm text-slate-500">Les Jardins de Yassa</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Actif</span></div><div className="mt-8 h-4 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[47%] rounded-full bg-teal-600" /></div><div className="mt-3 flex justify-between text-sm text-slate-500"><span>28 lots vendus</span><span>60 lots au total</span></div></section><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="text-lg font-bold">Modules métier</h3><div className="mt-4 grid gap-3">{cards.map((card) => <Link key={card.href} href={card.href} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 hover:border-teal-500 hover:text-teal-700"><span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-50 text-lg">{card.icon}</span><span><strong className="block text-sm">{card.label}</strong><small className="text-xs text-slate-500">{card.description}</small></span><span className="ml-auto">→</span></Link>)}</div></section></div><p className="mt-8 text-center text-xs text-slate-400">Les indicateurs seront reliés à PostgreSQL après configuration de la base de données.</p></section>
    </main>
  );
}
