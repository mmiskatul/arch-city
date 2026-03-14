import { readFile } from "node:fs/promises";
import path from "node:path";

export type UserSourceStat = {
  label: string;
  percent: number;
};

export type UserListRow = {
  id: string;
  name: string;
  heardFrom: string;
  wantsTexts: boolean;
  status: string;
  type: "Student" | "Parent" | "Tutor";
};

const dataPath = path.join(process.cwd(), "data", "admin", "users", "stats.json");
const listPath = path.join(process.cwd(), "data", "admin", "users", "list.json");

async function readJson<T>(filePath: string) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")) as T;
}

export async function getUserSources() {
  return readJson<UserSourceStat[]>(dataPath);
}

export async function getUserList() {
  return readJson<UserListRow[]>(listPath);
}
