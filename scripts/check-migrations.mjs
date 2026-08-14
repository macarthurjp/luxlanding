import { readdir, readFile } from "node:fs/promises";

const directory = new URL("../supabase/migrations/", import.meta.url);
const files = (await readdir(directory)).filter((file) => file.endsWith(".sql")).sort();
const versions = new Set();
const migrations = new Map();

for (const file of files) {
  const match = /^(\d{12})_[a-z0-9_]+\.sql$/.exec(file);
  if (!match) throw new Error(`Invalid migration filename: ${file}`);
  if (versions.has(match[1])) throw new Error(`Duplicate migration version: ${match[1]}`);
  versions.add(match[1]);
  const sql = await readFile(new URL(file, directory), "utf8");
  if (!sql.trim()) {
    throw new Error(`Empty migration: ${file}`);
  }
  migrations.set(match[1], { file, sql });
}

// The referral audit FKs rely on canonical unique constraints established
// before the audit tables are created. Later cleanup migrations may only drop
// redundant indexes/constraints, never the canonical identities.
const criticalSequence = [
  "202608130004",
  "202608130005",
  "202608130008",
  "202608130009",
];
for (const version of criticalSequence) {
  if (!migrations.has(version)) {
    throw new Error(`Missing critical migration: ${version}`);
  }
}

const identitySql = migrations.get("202608130004").sql;
const referralSql = migrations.get("202608130005").sql;
const indexCleanupSql = migrations.get("202608130008").sql;
const constraintCleanupSql = migrations.get("202608130009").sql;

for (const constraint of ["leads_lead_id_key", "partners_partner_id_key"]) {
  if (!identitySql.includes(`add constraint ${constraint}`)) {
    throw new Error(`Canonical identity constraint is missing: ${constraint}`);
  }
  if (indexCleanupSql.includes(`drop constraint`) && indexCleanupSql.includes(constraint)) {
    throw new Error(`Index cleanup must not drop canonical constraint: ${constraint}`);
  }
  if (constraintCleanupSql.includes(`drop constraint if exists ${constraint}`)) {
    throw new Error(`Constraint cleanup must not drop canonical constraint: ${constraint}`);
  }
}

for (const reference of [
  "references public.leads(lead_id)",
  "references public.partners(partner_id)",
]) {
  if (!referralSql.includes(reference)) {
    throw new Error(`Referral audit identity reference is missing: ${reference}`);
  }
}

console.log(`Validated ${files.length} ordered migration files and critical FK identity sequence.`);
