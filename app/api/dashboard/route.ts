import { NextResponse } from "next/server";
import { getProjectDashboard } from "@/lib/dashboard";

export async function GET(request: Request) {
  const projectId = new URL(request.url).searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "projectId requis" }, { status: 400 });
  return NextResponse.json(await getProjectDashboard(projectId));
}
