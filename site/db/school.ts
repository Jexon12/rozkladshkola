import { env } from "cloudflare:workers";
export function scheduleDb() { if(!env.DB) throw new Error("Schedule storage unavailable"); return env.DB; }
