// app/date-strip.tsx
import { CalendarDays } from "lucide-react";

// app/day-view.tsx
import { ArrowRight, Check, ChevronDown } from "lucide-react";

// lib/calendar.ts
var defaultCalendar = {
  start: "2026-09-01",
  end: "2027-06-30",
  // Editable working boundaries around the example winter break; not a school order.
  semesters: [{ label: "\u0406 \u0441\u0435\u043C\u0435\u0441\u0442\u0440", start: "2026-09-01", end: "2026-12-25" }, { label: "\u0406\u0406 \u0441\u0435\u043C\u0435\u0441\u0442\u0440", start: "2027-01-11", end: "2027-06-30" }],
  breaks: [{ label: "\u041E\u0441\u0456\u043D\u043D\u0456 \u043A\u0430\u043D\u0456\u043A\u0443\u043B\u0438", start: "2026-10-26", end: "2026-11-01", classes: [] }, { label: "\u0417\u0438\u043C\u043E\u0432\u0456 \u043A\u0430\u043D\u0456\u043A\u0443\u043B\u0438", start: "2026-12-28", end: "2027-01-10", classes: [] }, { label: "\u0412\u0435\u0441\u043D\u044F\u043D\u0456 \u043A\u0430\u043D\u0456\u043A\u0443\u043B\u0438", start: "2027-03-22", end: "2027-03-28", classes: [] }],
  daysOff: [],
  sourceUrl: "https://www.osvitjanyk.dp.ua/2026/08/27/kalendar-uchitelia/",
  confirmed: false
};
function getCalendar(s) {
  return s.calendar ?? defaultCalendar;
}
function nonTeachingReason(calendar, c, date) {
  const day = (/* @__PURE__ */ new Date(date + "T12:00:00Z")).getUTCDay();
  if (day === 0 || day === 6) return "\u0412\u0438\u0445\u0456\u0434\u043D\u0438\u0439";
  if (date < calendar.start || date > calendar.end) return "\u041F\u043E\u0437\u0430 \u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u043C \u0440\u043E\u043A\u043E\u043C";
  const off = calendar.daysOff.find((p) => p.date === date && (!p.classes.length || p.classes.includes(c)));
  if (off) return off.label;
  return calendar.breaks.find((p) => date >= p.start && date <= p.end && (!p.classes.length || p.classes.includes(c)))?.label ?? null;
}

// lib/school.ts
var classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9-\u0410", "9-\u0411"];
var bells = {
  junior: [["08:20", "08:55"], ["09:15", "09:50"], ["10:20", "10:55"], ["11:10", "11:45"], ["12:00", "12:35"]],
  primary: [["08:20", "09:00"], ["09:15", "09:55"], ["10:25", "11:05"], ["11:20", "12:00"], ["12:15", "12:55"], ["13:10", "13:50"]],
  senior: [["08:20", "09:05"], ["09:15", "10:00"], ["10:20", "11:05"], ["11:25", "12:10"], ["12:20", "13:05"], ["13:15", "14:00"], ["14:10", "14:55"], ["15:05", "15:50"]]
};
var classBells = (c) => c === "1" ? bells.junior : Number(c) <= 4 ? bells.primary : bells.senior;
var meal = (c) => c === "1" ? ["09:50", "10:20"] : Number(c) <= 4 ? ["09:55", "10:25"] : c === "5" ? ["10:00", "10:20"] : ["11:05", "11:25"];
function row(line) {
  const result = line.split("|").map((part) => {
    if (!part || part === "-") return null;
    const [subject, room = "", group] = part.split("~");
    return { subject, room, ...group ? { group } : {} };
  });
  while (result.length < 8) result.push(null);
  return result;
}
var source = {
  "5": [
    "\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D~I|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430~\u041C|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u0420\u043E\u0431\u043E\u0442\u043E\u0442\u0435\u0445\u043D\u0456\u043A\u0430~\u041C|STEM~\u0406\u0421\u0422",
    "\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u041F\u0456\u0437\u043D\u0430\u0454\u043C\u043E \u043F\u0440\u0438\u0440\u043E\u0434\u0443~\u0406\u0421\u0422|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430~\u041C|\u0417\u0434\u043E\u0440\u043E\u0432\u2019\u044F, \u0431\u0435\u0437\u043F\u0435\u043A\u0430 \u0442\u0430 \u0434\u043E\u0431\u0440\u043E\u0431\u0443\u0442~\u0411|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u0423\u041C",
    "\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D~II|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430~\u0410\u041C|\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430~\u0410\u041C|\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0456\u0457~\u0411|\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0456\u0457~\u0411",
    "\u041F\u0456\u0437\u043D\u0430\u0454\u043C\u043E \u043F\u0440\u0438\u0440\u043E\u0434\u0443~\u0406\u0421\u0422|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0406\u0441\u0442\u043E\u0440\u0456\u044F~\u0413|\u041C\u0438\u0441\u0442\u0435\u0446\u0442\u0432\u043E~\u0406\u0421\u0422|STEM~\u041C|\u0412\u0438\u0445\u043E\u0432\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430~\u041C",
    "\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430~\u041C|\u0415\u0442\u0438\u043A\u0430~\u0406\u0421\u0422|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C"
  ],
  "6": [
    "\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430~\u041C|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0413\u0435\u043E\u0433\u0440\u0430\u0444\u0456\u044F~\u0413|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0420\u043E\u0431\u043E\u0442\u043E\u0442\u0435\u0445\u043D\u0456\u043A\u0430~\u041C",
    "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u0423\u041C|\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u041F\u0456\u0437\u043D\u0430\u0454\u043C\u043E \u043F\u0440\u0438\u0440\u043E\u0434\u0443~\u0406\u0421\u0422|\u0406\u0441\u0442\u043E\u0440\u0456\u044F~\u0413|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0417\u0434\u043E\u0440\u043E\u0432\u2019\u044F, \u0431\u0435\u0437\u043F\u0435\u043A\u0430 \u0442\u0430 \u0434\u043E\u0431\u0440\u043E\u0431\u0443\u0442~\u0411|STEM~\u0406\u0421\u0422|\u0412\u0438\u0445\u043E\u0432\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430~\u0423\u041C",
    "\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430~\u041C|\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430~\u041C|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0413\u0440\u043E\u043C\u0430\u0434\u044F\u043D\u0441\u044C\u043A\u0430 \u043E\u0441\u0432\u0456\u0442\u0430~\u0413|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D~I",
    "\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u0423\u041C|\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430~\u041C|\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430~\u041C|\u0413\u0435\u043E\u0433\u0440\u0430\u0444\u0456\u044F~\u0413|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u0415\u0442\u0438\u043A\u0430~\u0410\u041C",
    "\u041F\u0456\u0437\u043D\u0430\u0454\u043C\u043E \u043F\u0440\u0438\u0440\u043E\u0434\u0443~\u0406\u0421\u0422|\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0456\u0457~\u0422\u041F|\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0456\u0457~\u0422\u041F|\u0406\u0441\u0442\u043E\u0440\u0456\u044F~\u0413|\u041C\u0438\u0441\u0442\u0435\u0446\u0442\u0432\u043E~\u0406\u0421\u0422|\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D~II"
  ],
  "7": [
    "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0410\u043B\u0433\u0435\u0431\u0440\u0430~\u0410\u041C|\u0425\u0456\u043C\u0456\u044F~\u0413|\u0424\u0456\u0437\u0438\u043A\u0430~\u041A\u0411|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0413\u0435\u043E\u0433\u0440\u0430\u0444\u0456\u044F~\u0413|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u0420\u043E\u0431\u043E\u0442\u043E\u0442\u0435\u0445\u043D\u0456\u043A\u0430~\u041C",
    "\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D~I|\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0423\u043A\u0440\u0430\u0457\u043D\u0438~\u0413|\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u0423\u041C|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0456\u044F~\u041C|\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D~II",
    "\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0406\u0421\u0422|\u0410\u043B\u0433\u0435\u0431\u0440\u0430~\u0406\u0421\u0422|\u0424\u0456\u0437\u0438\u043A\u0430~\u041A\u0411|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0411\u0456\u043E\u043B\u043E\u0433\u0456\u044F~\u0411|\u0412\u0441\u0435\u0441\u0432\u0456\u0442\u043D\u044F \u0456\u0441\u0442\u043E\u0440\u0456\u044F~\u0413|\u041C\u0438\u0441\u0442\u0435\u0446\u0442\u0432\u043E~\u0406\u0421\u0422|\u0412\u0438\u0445\u043E\u0432\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430~\u0406\u041D",
    "\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0411\u0456\u043E\u043B\u043E\u0433\u0456\u044F~\u0411|\u0413\u0435\u043E\u0433\u0440\u0430\u0444\u0456\u044F~\u0413|\u0417\u0434\u043E\u0440\u043E\u0432\u2019\u044F, \u0431\u0435\u0437\u043F\u0435\u043A\u0430 \u0442\u0430 \u0434\u043E\u0431\u0440\u043E\u0431\u0443\u0442~\u0411",
    "\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0456\u0457~\u0422\u041F/\u0411|\u0410\u043B\u0433\u0435\u0431\u0440\u0430~\u041C|\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u0423\u041C|\u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0456\u044F~\u041C|\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0423\u043A\u0440\u0430\u0457\u043D\u0438~\u0413|STEM~\u0410\u041C"
  ],
  "8": [
    "\u0413\u0435\u043E\u0433\u0440\u0430\u0444\u0456\u044F~\u0413|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0424\u0456\u0437\u0438\u043A\u0430~\u041A\u0411|\u0410\u043B\u0433\u0435\u0431\u0440\u0430~\u041C|\u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0456\u044F~\u041C|\u041C\u0438\u0441\u0442\u0435\u0446\u0442\u0432\u043E~\u0406\u0421\u0422|\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D~I|\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D~I",
    "\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0423\u043A\u0440\u0430\u0457\u043D\u0438~\u0413|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u0425\u0456\u043C\u0456\u044F~\u0413|\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u0412\u0441\u0435\u0441\u0432\u0456\u0442\u043D\u044F \u0456\u0441\u0442\u043E\u0440\u0456\u044F~\u0413|\u041F\u0456\u0434\u043F\u0440\u0438\u0454\u043C\u043D\u0438\u0446\u0442\u0432\u043E \u0456 \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0430 \u0433\u0440\u0430\u043C\u043E\u0442\u043D\u0456\u0441\u0442\u044C~\u0406\u0421\u0422|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u0423\u041C",
    "\u0413\u0435\u043E\u0433\u0440\u0430\u0444\u0456\u044F~\u0413|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u0410\u043B\u0433\u0435\u0431\u0440\u0430~\u041C|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0424\u0456\u0437\u0438\u043A\u0430~\u041A\u0411|\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u041C~II|\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D~II",
    "\u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0456\u044F~\u041C|\u0410\u043B\u0433\u0435\u0431\u0440\u0430~\u041C|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u0411\u0456\u043E\u043B\u043E\u0433\u0456\u044F~\u0411|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u041F\u0440\u043E\u0444\u0435\u0441\u0456\u0457~\u0406\u0421\u0422|\u0412\u0438\u0445\u043E\u0432\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430~\u0406\u0421\u0422",
    "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0423\u043A\u0440\u0430\u0457\u043D\u0438~\u0413|\u0425\u0456\u043C\u0456\u044F~\u0413|\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u0411\u0456\u043E\u043B\u043E\u0433\u0456\u044F~\u0411|\u0417\u0434\u043E\u0440\u043E\u0432\u2019\u044F, \u0431\u0435\u0437\u043F\u0435\u043A\u0430 \u0442\u0430 \u0434\u043E\u0431\u0440\u043E\u0431\u0443\u0442~\u0411|\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0456\u0457~\u0411|STEM~\u0410\u041C"
  ],
  "9-\u0410": [
    "\u0424\u0456\u0437\u0438\u043A\u0430~\u041A\u0411|\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0423\u043A\u0440\u0430\u0457\u043D\u0438~\u0413|\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D|\u0410\u043B\u0433\u0435\u0431\u0440\u0430~\u0406\u041D|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0406\u0421\u0422|\u0424\u0456\u0437\u0438\u043A\u0430~\u041A\u0411|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|STEM~\u0410\u041C",
    "\u041C\u0438\u0441\u0442\u0435\u0446\u0442\u0432\u043E~\u0406\u0421\u0422|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0456\u044F~\u0406\u041D|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u0425\u0456\u043C\u0456\u044F~\u0413|\u0411\u0456\u043E\u043B\u043E\u0433\u0456\u044F~\u0411|\u0412\u0438\u0445\u043E\u0432\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430~\u041A\u0411",
    "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0424\u0456\u0437\u0438\u043A\u0430~\u041A\u0411|\u0413\u0435\u043E\u0433\u0440\u0430\u0444\u0456\u044F~\u0413|\u0417\u0434\u043E\u0440\u043E\u0432\u2019\u044F, \u0431\u0435\u0437\u043F\u0435\u043A\u0430 \u0442\u0430 \u0434\u043E\u0431\u0440\u043E\u0431\u0443\u0442~\u0411|\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D|\u0410\u043B\u0433\u0435\u0431\u0440\u0430~\u0406\u041D|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|STEM~\u0406\u0421\u0422",
    "\u0412\u0441\u0435\u0441\u0432\u0456\u0442\u043D\u044F \u0456\u0441\u0442\u043E\u0440\u0456\u044F~\u0413|\u041F\u0456\u0434\u043F\u0440\u0438\u0454\u043C\u043D\u0438\u0446\u0442\u0432\u043E \u0456 \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0430 \u0433\u0440\u0430\u043C\u043E\u0442\u043D\u0456\u0441\u0442\u044C~\u0406\u0421\u0422|\u0425\u0456\u043C\u0456\u044F~\u0413|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u0411\u0456\u043E\u043B\u043E\u0433\u0456\u044F~\u0411",
    "\u0413\u0440\u043E\u043C\u0430\u0434\u044F\u043D\u0441\u044C\u043A\u0430 \u043E\u0441\u0432\u0456\u0442\u0430~\u0413|\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0456\u0457~\u0422\u041F/\u0411|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0410\u043B\u0433\u0435\u0431\u0440\u0430~\u041C|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u0423\u041C|\u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0456\u044F~\u041C|\u041F\u0440\u043E\u0444\u0435\u0441\u0456\u0457~\u0406\u0421\u0422"
  ],
  "9-\u0411": [
    "\u0410\u043B\u0433\u0435\u0431\u0440\u0430~\u041C|\u0424\u0456\u0437\u0438\u043A\u0430~\u041A\u0411|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0425\u0456\u043C\u0456\u044F~\u0413|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0423\u043A\u0440\u0430\u0457\u043D\u0438~\u0413|\u041F\u0440\u043E\u0444\u0435\u0441\u0456\u0457~\u0406\u0421\u0422",
    "\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u041C~I|\u0410\u043B\u0433\u0435\u0431\u0440\u0430~\u041C|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u041F\u0456\u0434\u043F\u0440\u0438\u0454\u043C\u043D\u0438\u0446\u0442\u0432\u043E \u0456 \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0430 \u0433\u0440\u0430\u043C\u043E\u0442\u043D\u0456\u0441\u0442\u044C~\u0406\u0421\u0422|\u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0456\u044F~\u0406\u041D|\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u041C~I|STEM~\u041C",
    "\u0410\u043B\u0433\u0435\u0431\u0440\u0430~\u041C|\u0413\u0435\u043E\u0433\u0440\u0430\u0444\u0456\u044F~\u0413|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0424\u0456\u0437\u0438\u043A\u0430~\u041A\u0411|\u0424\u0456\u0437\u0438\u043A\u0430~\u041A\u0411|\u041C\u0438\u0441\u0442\u0435\u0446\u0442\u0432\u043E~\u0406\u0421\u0422|\u0413\u0440\u043E\u043C\u0430\u0434\u044F\u043D\u0441\u044C\u043A\u0430 \u043E\u0441\u0432\u0456\u0442\u0430~\u0413|\u0412\u0438\u0445\u043E\u0432\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430~\u0422\u041F",
    "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0425\u0456\u043C\u0456\u044F~\u0413|\u0411\u0456\u043E\u043B\u043E\u0433\u0456\u044F~\u0411|\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0410\u041C|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u0423\u041C|\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430~\u0421\u0417|\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D~II|\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D~II",
    "\u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0456\u044F~\u041C|\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0456\u0457~\u0422\u041F/\u0411|\u0411\u0456\u043E\u043B\u043E\u0433\u0456\u044F~\u0411|\u0412\u0441\u0435\u0441\u0432\u0456\u0442\u043D\u044F \u0456\u0441\u0442\u043E\u0440\u0456\u044F~\u0413|\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u041F\u0440\u0430\u0432\u043E\u0437\u043D\u0430\u0432\u0441\u0442\u0432\u043E~\u0413"
  ]
};
var seed = {
  version: 1,
  calendar: defaultCalendar,
  weekly: Object.fromEntries(classes.map((c) => [c, source[c] ? source[c].map(row) : Array.from({ length: 5 }, () => Array(8).fill(null))])),
  teachers: [
    { id: "burova", name: "\u0411\u0443\u0440\u043E\u0432\u0430 \u0414\u0456\u0430\u043D\u0430 \u041E\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440\u0456\u0432\u043D\u0430", rules: [{ subjects: ["\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430"], classes: ["7", "8", "9-\u0410", "9-\u0411"] }] },
    { id: "abrosimov", name: "\u0410\u0431\u0440\u043E\u0441\u0456\u043C\u043E\u0432 \u0404\u0432\u0433\u0435\u043D\u0456\u0439 \u041E\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440\u043E\u0432\u0438\u0447", rules: [{ subjects: ["\u0424\u0456\u0437\u0438\u043A\u0430"], classes: ["5", "6", "7", "8", "9-\u0410", "9-\u0411"] }, { subjects: ["\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430"], classes: ["8"] }] },
    { id: "dmytriieva", name: "\u0414\u043C\u0438\u0442\u0440\u0456\u0454\u0432\u0430 \u041C\u0430\u0440\u0438\u043D\u0430 \u0412\u0456\u043A\u0442\u043E\u0440\u0456\u0432\u043D\u0430", rules: [
      { subjects: ["\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430"], classes: ["5", "9-\u0410"] },
      { subjects: ["\u0420\u043E\u0431\u043E\u0442\u043E\u0442\u0435\u0445\u043D\u0456\u043A\u0430"], classes: ["5", "6", "7"] },
      { subjects: ["\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430"], classes: ["6"] },
      { subjects: ["\u0410\u043B\u0433\u0435\u0431\u0440\u0430", "\u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0456\u044F"], classes: ["8"] }
    ] }
  ],
  changes: { "2026-10-06": {
    "5": row("\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u041F\u0456\u0437\u043D\u0430\u0454\u043C\u043E \u043F\u0440\u0438\u0440\u043E\u0434\u0443~\u0423\u041C|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430~\u041C|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u0423\u041C|\u0417\u0434\u043E\u0440\u043E\u0432\u2019\u044F, \u0431\u0435\u0437\u043F\u0435\u043A\u0430 \u0442\u0430 \u0434\u043E\u0431\u0440\u043E\u0431\u0443\u0442~\u0411"),
    "6": row("\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u0423\u041C|\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u041F\u0456\u0437\u043D\u0430\u0454\u043C\u043E \u043F\u0440\u0438\u0440\u043E\u0434\u0443~\u0406\u0421\u0422|\u0406\u0441\u0442\u043E\u0440\u0456\u044F~\u0413|\u0417\u0434\u043E\u0440\u043E\u0432\u2019\u044F, \u0431\u0435\u0437\u043F\u0435\u043A\u0430 \u0442\u0430 \u0434\u043E\u0431\u0440\u043E\u0431\u0443\u0442~\u0411|STEM~\u0406\u0421\u0422|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0412\u0438\u0445\u043E\u0432\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430~\u0423\u041C"),
    "7": row("\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D~I|\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0423\u043A\u0440\u0430\u0457\u043D\u0438~\u0413|\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u0423\u041C|\u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0456\u044F~\u041C|\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D~II"),
    "8": row("\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0423\u043A\u0440\u0430\u0457\u043D\u0438~\u0413|\u041F\u0456\u0434\u043F\u0440\u0438\u0454\u043C\u043D\u0438\u0446\u0442\u0432\u043E \u0456 \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0430 \u0433\u0440\u0430\u043C\u043E\u0442\u043D\u0456\u0441\u0442\u044C~\u0406\u0421\u0422|\u0425\u0456\u043C\u0456\u044F~\u0413|\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u0412\u0441\u0435\u0441\u0432\u0456\u0442\u043D\u044F \u0456\u0441\u0442\u043E\u0440\u0456\u044F~\u0413|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u0423\u041C"),
    "9-\u0410": row("\u041C\u0438\u0441\u0442\u0435\u0446\u0442\u0432\u043E~\u0406\u0421\u0422|\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430~\u0423\u041C|\u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0456\u044F~\u0406\u041D|\u0411\u0456\u043E\u043B\u043E\u0433\u0456\u044F~\u0411|\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u0425\u0456\u043C\u0456\u044F~\u0413|\u0412\u0438\u0445\u043E\u0432\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430~\u041A\u0411"),
    "9-\u0411": row("-|\u0410\u043B\u0433\u0435\u0431\u0440\u0430~\u041C|STEM~\u041C|\u041F\u0456\u0434\u043F\u0440\u0438\u0454\u043C\u043D\u0438\u0446\u0442\u0432\u043E \u0456 \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0430 \u0433\u0440\u0430\u043C\u043E\u0442\u043D\u0456\u0441\u0442\u044C~\u0406\u0421\u0422|\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430~\u0406\u041D~\u0423\u0441\u0456|\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430~\u041A\u0411|\u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0456\u044F~\u0406\u041D")
  } }
};
function weekday(date) {
  return (/* @__PURE__ */ new Date(`${date}T12:00:00Z`)).getUTCDay() - 1;
}
function editableDayLessons(s, c, date) {
  const d = weekday(date);
  return s.changes[date]?.[c] ?? (d >= 0 && d <= 4 ? weeklyForDate(s, date)[c][d] : Array(8).fill(null));
}
function dayLessons(s, c, date) {
  const d = weekday(date);
  return d < 0 || d > 4 || nonTeachingReason(getCalendar(s), c, date) ? Array(8).fill(null) : editableDayLessons(s, c, date);
}
function lessonTeacher(s, lesson, c) {
  if (lesson.teacherId) return s.teachers.find((t) => t.id === lesson.teacherId);
  return s.teachers.find((t) => t.rules.some((r) => r.subjects.includes(lesson.subject) && r.classes.includes(c)));
}
function isChanged(s, c, date, slot) {
  const d = weekday(date);
  return d >= 0 && d <= 4 && !!s.changes[date]?.[c] && JSON.stringify(s.changes[date][c][slot]) !== JSON.stringify(weeklyForDate(s, date)[c][d][slot]);
}
var minutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
function lessonsForTarget(s, date, target) {
  const selectedClasses = "classId" in target ? [target.classId] : classes;
  return selectedClasses.flatMap((c) => dayLessons(s, c, date).flatMap((lesson, slot) => lesson && matchesGroup(lesson, target.group) && ("classId" in target || lessonTeacher(s, lesson, c)?.id === target.teacherId) ? [{ date, c, slot, lesson, time: classBells(c)[slot] }] : [])).sort((a, b) => minutes(a.time[0]) - minutes(b.time[0]) || a.c.localeCompare(b.c));
}
function nextScheduledLesson(s, now, target) {
  const cursor = /* @__PURE__ */ new Date(now.date + "T12:00:00Z");
  for (let i = 0; i < 370 && cursor.toISOString().slice(0, 10) <= getCalendar(s).end; i++) {
    const date = cursor.toISOString().slice(0, 10);
    const next = lessonsForTarget(s, date, target).find((row2) => date > now.date || minutes(row2.time[0]) > now.minutes);
    if (next) return next;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return null;
}
function countdownTo(time, now) {
  const seconds = Math.max(0, minutes(time) * 60 - now.minutes * 60 - now.seconds);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
function lessonNumberKey(c, date, slot) {
  return date + "|" + c + "|" + slot;
}
function matchesGroup(l, group) {
  return !l || !group || !l.group || l.group === "\u0423\u0441\u0456" || l.group === group;
}
function weeklyForDate(s, date) {
  return [...s.weeklyVersions || []].filter((v) => v.effectiveFrom <= date).sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom))[0]?.weekly ?? s.weekly;
}
function describeLesson(l) {
  return l ? l.subject + (l.group ? " \xB7 " + (l.group === "\u0423\u0441\u0456" ? "\u0423\u0441\u0456 \u0433\u0440\u0443\u043F\u0438" : "\u0413\u0440\u0443\u043F\u0430 " + l.group) : "") + (l.room ? " \xB7 \u043A\u0430\u0431. " + l.room : "") : "\u041D\u0435\u043C\u0430\u0454 \u0443\u0440\u043E\u043A\u0443";
}
function lessonChange(s, c, date, slot) {
  if (!isChanged(s, c, date, slot)) return null;
  return { before: weeklyForDate(s, date)[c][weekday(date)][slot], after: s.changes[date][c][slot] };
}

// lib/day-timeline.ts
function dayTimeline(rows) {
  const sorted = [...rows].sort((a, b) => minutes(a.time[0]) - minutes(b.time[0]) || a.c.localeCompare(b.c));
  const result = [];
  let end;
  for (const row2 of sorted) {
    if (end && minutes(row2.time[0]) > minutes(end)) result.push({ kind: "gap", start: end, end: row2.time[0], duration: minutes(row2.time[0]) - minutes(end) });
    result.push({ kind: "lesson", row: row2, conflict: sorted.some((other) => other !== row2 && minutes(other.time[0]) < minutes(row2.time[1]) && minutes(other.time[1]) > minutes(row2.time[0])) });
    if (!end || minutes(row2.time[1]) > minutes(end)) end = row2.time[1];
  }
  return result;
}
function subjectTone(subject) {
  if (/фізик|хімі|природ|біолог/i.test(subject)) return "sage";
  if (/інформ|робото|технолог|stem/i.test(subject)) return "lavender";
  if (/математ|алгебр|геометр/i.test(subject)) return "sand";
  if (/мов|літ|читан|грамот/i.test(subject)) return "rose";
  return "stone";
}

// lib/lesson-countdown.ts
function kyivInstant(date, time, seconds = 0) {
  const wall = Date.parse(`${date}T${time}:00Z`) + seconds * 1e3;
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Kyiv", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  let instant = wall;
  for (let i = 0; i < 3; i++) {
    const p = Object.fromEntries(formatter.formatToParts(new Date(instant)).map((p2) => [p2.type, p2.value]));
    const local = Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}Z`);
    instant += wall - local;
  }
  return instant;
}
function secondsUntil(date, time, now) {
  return Math.max(0, Math.round((kyivInstant(date, time) - kyivInstant(now.date, now.time, now.seconds)) / 1e3));
}
function durationLabel(seconds) {
  const total = Math.ceil(seconds / 60), days = Math.floor(total / 1440), hours = Math.floor(total % 1440 / 60), mins = total % 60;
  return [days ? `${days} \u0434\u043D` : null, hours ? `${hours} \u0433\u043E\u0434` : null, mins || !days && !hours ? `${mins} \u0445\u0432` : null].filter(Boolean).join(" ");
}

// app/day-view.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var fullDate = (date) => new Intl.DateTimeFormat("uk-UA", { weekday: "long", day: "numeric", month: "long" }).format(/* @__PURE__ */ new Date(date + "T12:00:00Z"));
var destinationDay = (date) => ["\u043D\u0435\u0434\u0456\u043B\u0456", "\u043F\u043E\u043D\u0435\u0434\u0456\u043B\u043A\u0430", "\u0432\u0456\u0432\u0442\u043E\u0440\u043A\u0430", "\u0441\u0435\u0440\u0435\u0434\u0438", "\u0447\u0435\u0442\u0432\u0435\u0440\u0433\u0430", "\u043F\u2019\u044F\u0442\u043D\u0438\u0446\u0456", "\u0441\u0443\u0431\u043E\u0442\u0438"][(/* @__PURE__ */ new Date(date + "T12:00:00Z")).getUTCDay()];
function DayView({ school, date, now, target, numbers, onOpenDate }) {
  const rows = lessonsForTarget(school, date, target), timeline = dayTimeline(rows), today = now ? lessonsForTarget(school, now.date, target) : [];
  const current = now ? today.filter((r) => minutes(r.time[0]) <= now.minutes && minutes(r.time[1]) > now.minutes) : [];
  const next = now ? nextScheduledLesson(school, now, target) : null, focus = current[0] || next, teacherMode = "teacherId" in target;
  const nextOnDate = rows.find((r) => date === now?.date && minutes(r.time[0]) > now.minutes);
  const first = rows[0]?.time[0], last = rows.reduce((end, r) => minutes(r.time[1]) > minutes(end) ? r.time[1] : end, "00:00");
  const nextAvailable = rows.length ? null : nextScheduledLesson(school, { date, time: "00:00", minutes: -1, seconds: 0 }, target);
  const count = rows.length, word = count % 10 === 1 && count % 100 !== 11 ? "\u0443\u0440\u043E\u043A" : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? "\u0443\u0440\u043E\u043A\u0438" : "\u0443\u0440\u043E\u043A\u0456\u0432";
  const remaining = now && next ? secondsUntil(next.date, next.time[0], now) : 0;
  const tomorrow = now ? new Date((/* @__PURE__ */ new Date(now.date + "T12:00:00Z")).getTime() + 864e5).toISOString().slice(0, 10) : "";
  const focusWhen = focus ? (focus.date === now?.date ? "\u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456" : focus.date === tomorrow ? "\u0437\u0430\u0432\u0442\u0440\u0430" : fullDate(focus.date)) + `, ${focus.time[0]}` : "";
  return /* @__PURE__ */ jsxs("div", { className: "compact-day", children: [
    /* @__PURE__ */ jsxs("section", { className: "live-card focus-card compact-focus", "aria-label": "\u0417\u0430\u0440\u0430\u0437 \u0456 \u0434\u0430\u043B\u0456", children: [
      /* @__PURE__ */ jsxs("div", { className: "live-card-head", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("span", { className: "live-dot" }),
          current.length ? `\u0417\u0430\u0440\u0430\u0437 \xB7 ${now?.time || "\u2014"}` : focus ? `\u0414\u0430\u043B\u0456 \xB7 ${focusWhen}` : "\u0414\u0430\u043B\u0456"
        ] }),
        focus && /* @__PURE__ */ jsx("span", { className: "focus-countdown", children: current.length && now ? `\u0414\u043E \u043A\u0456\u043D\u0446\u044F ${durationLabel(secondsUntil(now.date, focus.time[1], now))}` : now ? `\u0427\u0435\u0440\u0435\u0437 ${durationLabel(remaining)}` : "\u2014" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "compact-focus-body", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { children: focus ? teacherMode ? `${focus.c} \u043A\u043B\u0430\u0441` : focus.lesson.subject : "\u041D\u0430\u0439\u0431\u043B\u0438\u0436\u0447\u0438\u0445 \u0443\u0440\u043E\u043A\u0456\u0432 \u043D\u0435\u043C\u0430\u0454" }),
          focus && /* @__PURE__ */ jsxs("p", { children: [
            teacherMode ? focus.lesson.subject : `${focus.c} \u043A\u043B\u0430\u0441`,
            " \xB7 ",
            focus.time.join("\u2013"),
            " \xB7 \u043A\u0430\u0431\u0456\u043D\u0435\u0442 ",
            focus.lesson.room || "\u043D\u0435 \u0432\u043A\u0430\u0437\u0430\u043D\u043E"
          ] })
        ] }),
        focus && focus.date !== date && rows.length > 0 && /* @__PURE__ */ jsxs("button", { className: "secondary-button", onClick: () => onOpenDate(focus.date), children: [
          "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0434\u0435\u043D\u044C",
          /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
        ] })
      ] }),
      focus && now && current.length > 0 && /* @__PURE__ */ jsx("progress", { className: "focus-live-progress", "aria-label": "\u0427\u0430\u0441 \u043F\u043E\u0442\u043E\u0447\u043D\u043E\u0433\u043E \u0443\u0440\u043E\u043A\u0443", max: (minutes(focus.time[1]) - minutes(focus.time[0])) * 60, value: now.minutes * 60 + now.seconds - minutes(focus.time[0]) * 60 }),
      current.length > 1 && /* @__PURE__ */ jsxs("p", { className: "conflict", children: [
        "\u041E\u0434\u043D\u043E\u0447\u0430\u0441\u043D\u043E ",
        current.length,
        " \u0443\u0440\u043E\u043A\u0438 \u2014 \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F"
      ] }),
      current.length > 0 && next && /* @__PURE__ */ jsxs("p", { className: "compact-next", children: [
        "\u0414\u0430\u043B\u0456: ",
        teacherMode ? `${next.c} \u043A\u043B\u0430\u0441 \xB7 ` : "",
        next.lesson.subject,
        " \xB7 ",
        next.time[0],
        next.date !== now?.date && ` \xB7 ${fullDate(next.date)}`
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "panel timeline-panel", children: [
      /* @__PURE__ */ jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { children: teacherMode ? "\u0420\u043E\u0437\u043A\u043B\u0430\u0434 \u0443\u0447\u0438\u0442\u0435\u043B\u044F" : `${"classId" in target ? target.classId : ""} \u043A\u043B\u0430\u0441` }),
          /* @__PURE__ */ jsx("p", { children: fullDate(date) })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "day-total-chip", children: [
          count,
          " ",
          word,
          first && ` \xB7 ${first}\u2013${last}`
        ] })
      ] }),
      rows.length ? /* @__PURE__ */ jsx("ol", { className: "day-timeline", children: timeline.map((item, k) => {
        if (item.kind === "gap") return /* @__PURE__ */ jsx("li", { className: `timeline-gap ${item.duration > 25 ? "is-window" : ""}`, children: /* @__PURE__ */ jsxs("span", { children: [
          item.duration > 25 ? "\u0412\u0456\u043A\u043D\u043E" : "\u041F\u0435\u0440\u0435\u0440\u0432\u0430",
          " \xB7 ",
          item.duration,
          " \u0445\u0432"
        ] }) }, "gap" + k);
        const r = item.row, active = date === now?.date && minutes(r.time[0]) <= now.minutes && now.minutes < minutes(r.time[1]), upcoming = r === nextOnDate, completed = date === now?.date && now.minutes >= minutes(r.time[1]);
        const change = lessonChange(school, r.c, date, r.slot), teacher = !teacherMode ? lessonTeacher(school, r.lesson, r.c) : null, number = numbers[lessonNumberKey(r.c, date, r.slot)];
        return /* @__PURE__ */ jsx("li", { className: `timeline-entry tone-${subjectTone(r.lesson.subject)} ${active ? "is-current" : upcoming ? "is-next" : ""}`, children: /* @__PURE__ */ jsxs("details", { className: "timeline-card compact-lesson", children: [
          /* @__PURE__ */ jsxs("summary", { "aria-label": `${r.c} \u043A\u043B\u0430\u0441, ${r.lesson.subject}, ${r.time.join("\u2013")}, ${r.slot + 1}-\u0439 \u0443\u0440\u043E\u043A. \u0414\u0435\u0442\u0430\u043B\u0456`, children: [
            /* @__PURE__ */ jsx("span", { className: "slot-badge", children: r.slot + 1 }),
            /* @__PURE__ */ jsxs("span", { className: "compact-lesson-time", children: [
              r.time[0],
              "\u2013",
              r.time[1],
              active ? /* @__PURE__ */ jsxs("small", { children: [
                "\u0422\u0440\u0438\u0432\u0430\u0454 \xB7 ",
                now && countdownTo(r.time[1], now)
              ] }) : upcoming ? /* @__PURE__ */ jsx("small", { children: "\u0414\u0430\u043B\u0456" }) : completed ? /* @__PURE__ */ jsx(Check, { size: 15, "aria-label": "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E" }) : null
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "compact-lesson-main", children: [
              /* @__PURE__ */ jsx("strong", { children: teacherMode ? `${r.c} \u043A\u043B\u0430\u0441` : r.lesson.subject }),
              /* @__PURE__ */ jsxs("span", { className: "compact-lesson-meta", children: [
                teacherMode && /* @__PURE__ */ jsx("span", { className: "subject-chip", children: r.lesson.subject }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "\u041A\u0430\u0431\u0456\u043D\u0435\u0442 ",
                  r.lesson.room || "\u043D\u0435 \u0432\u043A\u0430\u0437\u0430\u043D\u043E"
                ] }),
                r.lesson.group && /* @__PURE__ */ jsx("span", { className: "group", children: r.lesson.group === "\u0423\u0441\u0456" ? "\u0423\u0441\u0456 \u0433\u0440\u0443\u043F\u0438" : `\u0413\u0440\u0443\u043F\u0430 ${r.lesson.group}` }),
                r.lesson.note && /* @__PURE__ */ jsx("span", { className: "group", children: r.lesson.note }),
                change && /* @__PURE__ */ jsx("span", { className: "pill amber", children: "\u0417\u043C\u0456\u043D\u0438" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(ChevronDown, { size: 16, className: "lesson-chevron" }),
            active && now && /* @__PURE__ */ jsx("progress", { className: "row-live-progress", "aria-label": `\u041F\u0440\u043E\u0433\u0440\u0435\u0441 ${r.slot + 1}-\u0433\u043E \u0443\u0440\u043E\u043A\u0443`, max: minutes(r.time[1]) - minutes(r.time[0]), value: now.minutes - minutes(r.time[0]) }),
            item.conflict && teacherMode && /* @__PURE__ */ jsx("span", { className: "conflict compact-conflict", children: "\u041E\u0434\u043D\u043E\u0447\u0430\u0441\u043D\u0456 \u0443\u0440\u043E\u043A\u0438 \u2014 \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "compact-lesson-details", children: [
            /* @__PURE__ */ jsxs("p", { children: [
              r.slot + 1,
              "-\u0439 \u0443\u0440\u043E\u043A",
              number && ` \xB7 \u2116${number} \u0437\u0430 \u0441\u0435\u043C\u0435\u0441\u0442\u0440`
            ] }),
            teacher && /* @__PURE__ */ jsx("p", { children: teacher.name }),
            change && /* @__PURE__ */ jsxs("p", { children: [
              describeLesson(change.before),
              " \u2192 ",
              describeLesson(change.after)
            ] }),
            "classId" in target && /* @__PURE__ */ jsxs("p", { children: [
              "\u0425\u0430\u0440\u0447\u0443\u0432\u0430\u043D\u043D\u044F: ",
              meal(target.classId).join("\u2013")
            ] }),
            !teacher && teacherMode && !change && !number && /* @__PURE__ */ jsxs("p", { children: [
              r.lesson.subject,
              " \xB7 ",
              r.c,
              " \u043A\u043B\u0430\u0441 \xB7 \u043A\u0430\u0431\u0456\u043D\u0435\u0442 ",
              r.lesson.room || "\u043D\u0435 \u0432\u043A\u0430\u0437\u0430\u043D\u043E"
            ] })
          ] })
        ] }) }, r.c + "-" + r.slot);
      }) }) : /* @__PURE__ */ jsxs("div", { className: "empty helpful-empty", children: [
        /* @__PURE__ */ jsx("h3", { children: "\u041E\u0431\u0435\u0440\u0456\u0442\u044C \u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u0439 \u0434\u0435\u043D\u044C" }),
        nextAvailable ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("p", { children: [
            "\u041D\u0430\u0439\u0431\u043B\u0438\u0436\u0447\u0435 \u0437\u0430\u043D\u044F\u0442\u0442\u044F: ",
            nextAvailable.lesson.subject,
            " \xB7 ",
            nextAvailable.time[0],
            " \xB7 ",
            fullDate(nextAvailable.date)
          ] }),
          /* @__PURE__ */ jsxs("button", { className: "primary-button", onClick: () => onOpenDate(nextAvailable.date), children: [
            "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0434\u043E ",
            destinationDay(nextAvailable.date),
            /* @__PURE__ */ jsx(ArrowRight, { size: 17 })
          ] })
        ] }) : /* @__PURE__ */ jsx("p", { children: "\u0414\u043B\u044F \u0446\u044C\u043E\u0433\u043E \u043A\u043B\u0430\u0441\u0443 \u0430\u0431\u043E \u0432\u0447\u0438\u0442\u0435\u043B\u044F \u0449\u0435 \u043D\u0435\u043C\u0430\u0454 \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u0438\u0445 \u0437\u0430\u043D\u044F\u0442\u044C. \u0423\u0442\u043E\u0447\u043D\u0456\u0442\u044C \u0440\u043E\u0437\u043A\u043B\u0430\u0434 \u0443 \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u0456." })
      ] })
    ] })
  ] });
}

// app/date-strip.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var shift = (date, n) => {
  const d = /* @__PURE__ */ new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
function DateActions({ date, today, onChange }) {
  return /* @__PURE__ */ jsxs2("div", { className: "day-date-actions", children: [
    /* @__PURE__ */ jsx2("button", { className: "text-button", "aria-label": today ? `\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456, ${fullDate(today)}` : "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456", onClick: () => today && onChange(today), children: "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456" }),
    /* @__PURE__ */ jsxs2("label", { className: "date-picker calendar-icon", title: "\u041E\u0431\u0440\u0430\u0442\u0438 \u0434\u0430\u0442\u0443", children: [
      /* @__PURE__ */ jsx2(CalendarDays, { size: 19 }),
      /* @__PURE__ */ jsx2("span", { className: "sr-only", children: "\u041E\u0431\u0440\u0430\u0442\u0438 \u0434\u0430\u0442\u0443" }),
      /* @__PURE__ */ jsx2("input", { "aria-label": "\u0406\u043D\u0448\u0430 \u0434\u0430\u0442\u0430", type: "date", value: date, onChange: (e) => e.target.value && onChange(e.target.value) })
    ] })
  ] });
}
function DateStrip({ date, today, onChange, school, target }) {
  const weekday2 = (/* @__PURE__ */ new Date(date + "T12:00:00Z")).getUTCDay(), monday = shift(date, -((weekday2 + 6) % 7));
  return /* @__PURE__ */ jsxs2("section", { className: "date-strip", "aria-label": "\u0414\u0430\u0442\u0438 \u0442\u0438\u0436\u043D\u044F", children: [
    /* @__PURE__ */ jsx2("div", { className: "date-strip-heading", children: /* @__PURE__ */ jsx2("span", { children: new Intl.DateTimeFormat("uk-UA", { month: "long" }).format(/* @__PURE__ */ new Date(date + "T12:00:00Z")) + " " + date.slice(0, 4) }) }),
    /* @__PURE__ */ jsx2("div", { className: "date-strip-days", children: ["\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431", "\u041D\u0434"].map((day, i) => {
      const d = shift(monday, i), hasLessons = lessonsForTarget(school, d, target).length > 0;
      return /* @__PURE__ */ jsxs2("button", { className: hasLessons ? "has-lessons" : "no-lessons", "aria-label": `${fullDate(d)}${d === today ? ", \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456" : ""}${hasLessons ? ", \u0454 \u0443\u0440\u043E\u043A\u0438" : ", \u0431\u0435\u0437 \u0443\u0440\u043E\u043A\u0456\u0432"}`, title: `${hasLessons ? "\u0404 \u0443\u0440\u043E\u043A\u0438" : "\u0411\u0435\u0437 \u0443\u0440\u043E\u043A\u0456\u0432"}${d === today ? " \xB7 \u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456" : ""}`, "aria-pressed": d === date, "aria-current": d === today ? "date" : void 0, onClick: () => onChange(d), children: [
        /* @__PURE__ */ jsx2("span", { children: day }),
        /* @__PURE__ */ jsx2("strong", { children: Number(d.slice(8)) }),
        hasLessons && /* @__PURE__ */ jsx2("i", { "aria-hidden": "true" })
      ] }, d);
    }) }),
    /* @__PURE__ */ jsxs2("p", { className: "date-legend", children: [
      /* @__PURE__ */ jsxs2("span", { children: [
        /* @__PURE__ */ jsx2("i", {}),
        "\u0404 \u0443\u0440\u043E\u043A\u0438"
      ] }),
      /* @__PURE__ */ jsxs2("span", { children: [
        /* @__PURE__ */ jsx2("b", {}),
        "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456"
      ] }),
      /* @__PURE__ */ jsxs2("span", { children: [
        /* @__PURE__ */ jsx2("em", {}),
        "\u041E\u0431\u0440\u0430\u043D\u043E"
      ] })
    ] })
  ] });
}
export {
  DateActions,
  DateStrip,
  DayView,
  dayTimeline,
  durationLabel,
  kyivInstant,
  secondsUntil,
  seed,
  subjectTone
};
