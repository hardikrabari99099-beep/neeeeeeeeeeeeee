import { drizzle } from "drizzle-orm/netlify-db";
import * as schema from "./schema";

// Netlify-only database. Created lazily so that importing this module on Render
// (where NETLIFY_DB_URL does not exist) never throws at server start-up.
type NetlifyDb = ReturnType<typeof drizzle<typeof schema>>;
let _db: NetlifyDb | undefined;

export const db = new Proxy({} as NetlifyDb, {
  get(_target, prop) {
    if (!_db) _db = drizzle({ schema });
    const value = Reflect.get(_db as object, prop);
    return typeof value === "function" ? value.bind(_db) : value;
  },
});
