// D1 executes this batch atomically. A stale writer cannot create a new snapshot.
export function historyStatements(data:string,revision:number,updatedAt:string,initialData:string){return [
 {sql:'INSERT OR IGNORE INTO schedule_history (revision,data,updated_at) SELECT revision,data,updated_at FROM schedules WHERE id = ? AND revision = ?',args:['school',revision]},
 ...(revision===0?[{sql:'INSERT OR IGNORE INTO schedule_history (revision,data,updated_at) SELECT 0,?,? WHERE NOT EXISTS (SELECT 1 FROM schedules WHERE id = ?)',args:[initialData,updatedAt,'school']}]:[]),
 {sql:revision===0?'INSERT OR IGNORE INTO schedules (id,data,revision,updated_at) VALUES (?,?,?,?)':'UPDATE schedules SET data = ?, revision = ?, updated_at = ? WHERE id = ? AND revision = ?',args:revision===0?['school',data,1,updatedAt]:[data,revision+1,updatedAt,'school',revision]},
 {sql:'INSERT OR IGNORE INTO schedule_history (revision,data,updated_at) SELECT revision,data,updated_at FROM schedules WHERE id = ? AND revision = ? AND data = ?',args:['school',revision+1,data]},
 {sql:'DELETE FROM schedule_history WHERE revision NOT IN (SELECT revision FROM schedule_history ORDER BY revision DESC LIMIT 50)',args:[]},
 ];}
