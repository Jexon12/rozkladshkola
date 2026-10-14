import Schedule from "./schedule";
import { getChatGPTUser } from "./chatgpt-auth";
import { isScheduleEditor } from "../lib/schedule-access";
export const dynamic="force-dynamic";
export default async function Home() { return <Schedule canEdit={isScheduleEditor(await getChatGPTUser())} />; }
