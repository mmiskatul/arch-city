import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApplicationDetail, ApplicationRow } from "@/lib/admin/types";

const applicationsDataDir = path.join(process.cwd(), "data", "admin", "applications");
const applicationIndexPath = path.join(applicationsDataDir, "index.json");
const applicationByIdDir = path.join(applicationsDataDir, "by-id");

async function readJsonFile<T>(filePath: string): Promise<T> {
  const file = await readFile(filePath, "utf8");
  return JSON.parse(file.replace(/^\uFEFF/, "")) as T;
}

export async function getApplicationRows() {
  return readJsonFile<ApplicationRow[]>(applicationIndexPath);
}

export async function getApplicationDetail(id: string) {
  try {
    const filePath = path.join(applicationByIdDir, `${id}.json`);
    return await readJsonFile<ApplicationDetail>(filePath);
  } catch {
    return null;
  }
}
