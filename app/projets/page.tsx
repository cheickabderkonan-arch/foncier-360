"use client";

import { FormEvent, useEffect, useState } from "react";

type Project = {
  id: string;
  name: string;
  location: string | null;
  status: string;
  totalAreaM2: string | number | null;
  _count?: { lots: number };
};

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  ACTIVE: "Actif",
  COMPLETED: "Terminé",
  ARCHIVED: "Archivé",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", location: "", totalAreaM2: "" });

  async function loadProjects() {
    setLoading(true);
    try {
      const response = await fetch("/api/projects", { cache: "no-store" });
      if (!response.ok) throw new Error("Impossible de charger les projets");
      setProjects(await response.json());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadProjects(); }, []);

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          location: form.location || undefined,
          totalAreaM2: form.totalAreaM2 ? Number(form.totalAreaM2) : undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Création impossible");
      setProjects((current) => [result, ...current]);
      setForm({ name: "", location: "", totalAreaM2: "" });
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <a href="/" className="text-sm font-semibold text-teal-700">← Tableau de bord</a>
        <div className="mt-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div><p className="text-sm font-semibold uppercase tracking-widest text-teal-700">FONCIER 360</p><h1 className="mt-2 text-3xl font-bold text-slate-950">Projets fonciers</h1><p className="mt-2 text-slate-600">Créez et suivez vos opérations foncières.</p></div>
        </div>

        {error && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <form onSubmit={createProject} className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Nouveau projet</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-1 text-sm font-medium">Nom du projet<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-600" placeholder="Les Jardins de Yassa" /></label>
              <label className="grid gap-1 text-sm font-medium">Localisation<input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-600" placeholder="Douala, Cameroun" /></label>
              <label className="grid gap-1 text-sm font-medium">Superficie totale (m²)<input type="number" min="1" value={form.totalAreaM2} onChange={(event) => setForm({ ...form, totalAreaM2: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-600" placeholder="12000" /></label>
              <button disabled={saving} className="rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Création…" : "Créer le projet"}</button>
            </div>
          </form>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Tous les projets</h2><span className="text-sm text-slate-500">{projects.length} projet(s)</span></div>
            {loading ? <p className="py-12 text-center text-slate-500">Chargement…</p> : projects.length === 0 ? <p className="py-12 text-center text-slate-500">Aucun projet pour le moment.</p> : <div className="mt-5 grid gap-3">{projects.map((project) => <article key={project.id} className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center"><div><h3 className="font-semibold text-slate-950">{project.name}</h3><p className="mt-1 text-sm text-slate-500">{project.location || "Localisation non renseignée"}{project.totalAreaM2 ? ` · ${project.totalAreaM2} m²` : ""}</p></div><div className="flex items-center gap-3"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{statusLabels[project.status] ?? project.status}</span><span className="text-sm text-slate-500">{project._count?.lots ?? 0} lot(s)</span></div></article>)}</div>}
          </section>
        </div>
      </div>
    </main>
  );
}
