"use server";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ApplicationStatus, ApplicationRow } from "@/lib/admin/types";

const dataDir = path.join(process.cwd(), "data", "admin", "applications");
const indexPath = path.join(dataDir, "index.json");
const byIdDir = path.join(dataDir, "by-id");

async function readJson<T>(filePath: string) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")) as T;
}

async function writeJson<T>(filePath: string, payload: T) {
  await writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}

type OperateBody = {
  id: string;
  status: ApplicationStatus;
};

export async function PUT(request: Request) {
  const body: OperateBody = await request.json();
  if (!body.id || !body.status) {
    return new Response("Missing id/status", { status: 400 });
  }

  const rows = await readJson<ApplicationRow[]>(indexPath);
  const rowIndex = rows.findIndex((row) => row.id === body.id);
  if (rowIndex === -1) {
    return new Response("Application not found", { status: 404 });
  }

  rows[rowIndex] = { ...rows[rowIndex], status: body.status };
  await writeJson(indexPath, rows);

  const detailPath = path.join(byIdDir, `${body.id}.json`);
  try {
    const detail = await readJson<{ status: ApplicationStatus }>(detailPath);
    detail.status = body.status;
    await writeJson(detailPath, detail);
  } catch {
    // ignore missing detail file
  }

  return new Response(JSON.stringify({ ok: true, status: body.status }), {
    headers: { "Content-Type": "application/json" },
  });
}
