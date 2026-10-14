"use client";

// app/schedule.tsx
import { useEffect as useEffect4, useMemo, useRef as useRef4, useState as useState6 } from "file:///C:/Users/0009/Documents/ChatGPT/school_rozklad/site/.sites-runtime/editor-hooks.mjs";
import { CalendarDays as CalendarDays3, Clock3, GraduationCap as GraduationCap2, Bell, SlidersHorizontal, BookOpen, Utensils, Upload, Download, Save, X as X2, Plus as Plus2, Check as Check2, ChevronLeft, ChevronRight, ChartNoAxesColumn, ListFilter } from "lucide-react";

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
function semesterForDate(calendar2, date2) {
  return calendar2.semesters.find((p) => date2 >= p.start && date2 <= p.end);
}
function nonTeachingReason(calendar2, c, date2) {
  const day = (/* @__PURE__ */ new Date(date2 + "T12:00:00Z")).getUTCDay();
  if (day === 0 || day === 6) return "\u0412\u0438\u0445\u0456\u0434\u043D\u0438\u0439";
  if (date2 < calendar2.start || date2 > calendar2.end) return "\u041F\u043E\u0437\u0430 \u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u043C \u0440\u043E\u043A\u043E\u043C";
  const off = calendar2.daysOff.find((p) => p.date === date2 && (!p.classes.length || p.classes.includes(c)));
  if (off) return off.label;
  return calendar2.breaks.find((p) => date2 >= p.start && date2 <= p.end && (!p.classes.length || p.classes.includes(c)))?.label ?? null;
}

// lib/school.ts
var classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9-\u0410", "9-\u0411"];
var days = ["\u041F\u043E\u043D\u0435\u0434\u0456\u043B\u043E\u043A", "\u0412\u0456\u0432\u0442\u043E\u0440\u043E\u043A", "\u0421\u0435\u0440\u0435\u0434\u0430", "\u0427\u0435\u0442\u0432\u0435\u0440", "\u041F\u2019\u044F\u0442\u043D\u0438\u0446\u044F"];
var rooms = { \u0423\u041C: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u043E\u0457 \u043C\u043E\u0432\u0438", \u0413: "\u0413\u0435\u043E\u0433\u0440\u0430\u0444\u0456\u0457", \u041C: "\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0438", \u0410\u041C: "\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u043E\u0457 \u043C\u043E\u0432\u0438", \u0406\u041D: "\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0438", \u0406\u0421\u0422: "\u0406\u0441\u0442\u043E\u0440\u0456\u0457", \u041A\u0411: "\u041A\u043B\u0430\u0441 \u0431\u0435\u0437\u043F\u0435\u043A\u0438", \u041E\u041F: "\u041E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u044E\u0447\u043E\u0457 \u043F\u0440\u0430\u0446\u0456", \u0422\u041F: "\u0422\u0435\u0445\u043D\u0456\u0447\u043D\u043E\u0457 \u043F\u0440\u0430\u0446\u0456", \u0421\u0417: "\u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0438\u0439 \u0437\u0430\u043B", \u0410\u0417: "\u0410\u043A\u0442\u043E\u0432\u0438\u0439 \u0437\u0430\u043B", \u0411: "\u0411\u0456\u043E\u043B\u043E\u0433\u0456\u0457", "\u0422\u041F/\u0411": "\u0422\u0435\u0445\u043D\u0456\u0447\u043D\u043E\u0457 \u043F\u0440\u0430\u0446\u0456 / \u0431\u0456\u043E\u043B\u043E\u0433\u0456\u0457" };
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
function kyivNow(date2 = /* @__PURE__ */ new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Kyiv", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(date2);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}`, seconds: Number(p.second), minutes: Number(p.hour) * 60 + Number(p.minute) };
}
function weekday(date2) {
  return (/* @__PURE__ */ new Date(`${date2}T12:00:00Z`)).getUTCDay() - 1;
}
function editableDayLessons(s, c, date2) {
  const d = weekday(date2);
  return s.changes[date2]?.[c] ?? (d >= 0 && d <= 4 ? weeklyForDate(s, date2)[c][d] : Array(8).fill(null));
}
function dayLessons(s, c, date2) {
  const d = weekday(date2);
  return d < 0 || d > 4 || nonTeachingReason(getCalendar(s), c, date2) ? Array(8).fill(null) : editableDayLessons(s, c, date2);
}
function lessonTeacher(s, lesson2, c) {
  if (lesson2.teacherId) return s.teachers.find((t) => t.id === lesson2.teacherId);
  return s.teachers.find((t) => t.rules.some((r) => r.subjects.includes(lesson2.subject) && r.classes.includes(c)));
}
function isChanged(s, c, date2, slot) {
  const d = weekday(date2);
  return d >= 0 && d <= 4 && !!s.changes[date2]?.[c] && JSON.stringify(s.changes[date2][c][slot]) !== JSON.stringify(weeklyForDate(s, date2)[c][d][slot]);
}
var minutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
function lessonsForTarget(s, date2, target) {
  const selectedClasses = "classId" in target ? [target.classId] : classes;
  return selectedClasses.flatMap((c) => dayLessons(s, c, date2).flatMap((lesson2, slot) => lesson2 && matchesGroup(lesson2, target.group) && ("classId" in target || lessonTeacher(s, lesson2, c)?.id === target.teacherId) ? [{ date: date2, c, slot, lesson: lesson2, time: classBells(c)[slot] }] : [])).sort((a, b) => minutes(a.time[0]) - minutes(b.time[0]) || a.c.localeCompare(b.c));
}
function lessonStatistics(s, now, target) {
  const start = getCalendar(s).start, subjects = {};
  let completed = 0;
  const cursor = /* @__PURE__ */ new Date(start + "T12:00:00Z");
  while (cursor.toISOString().slice(0, 10) <= now.date && cursor.toISOString().slice(0, 10) <= getCalendar(s).end) {
    const date2 = cursor.toISOString().slice(0, 10);
    for (const row2 of lessonsForTarget(s, date2, target)) {
      if (date2 < now.date || minutes(row2.time[1]) <= now.minutes) {
        completed++;
        const subject = row2.lesson.subject + (row2.lesson.group ? ` \xB7 ${row2.lesson.group === "\u0423\u0441\u0456" ? "\u0423\u0441\u0456 \u0433\u0440\u0443\u043F\u0438" : `\u0413\u0440\u0443\u043F\u0430 ${row2.lesson.group}`}` : "");
        subjects[subject] = (subjects[subject] || 0) + 1;
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  const today = lessonsForTarget(s, now.date, target), completedToday = today.filter((row2) => minutes(row2.time[1]) <= now.minutes).length;
  const active = today.filter((row2) => now.minutes >= minutes(row2.time[0]) && now.minutes < minutes(row2.time[1]));
  return { start, completed, subjects, completedToday, totalToday: today.length, remainingToday: today.length - completedToday, active };
}
function nextScheduledLesson(s, now, target) {
  const cursor = /* @__PURE__ */ new Date(now.date + "T12:00:00Z");
  for (let i = 0; i < 370 && cursor.toISOString().slice(0, 10) <= getCalendar(s).end; i++) {
    const date2 = cursor.toISOString().slice(0, 10);
    const next = lessonsForTarget(s, date2, target).find((row2) => date2 > now.date || minutes(row2.time[0]) > now.minutes);
    if (next) return next;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return null;
}
function countdownTo(time, now) {
  const seconds = Math.max(0, minutes(time) * 60 - now.minutes * 60 - now.seconds);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
function currentStatus(s, c, date2, time, group) {
  const lessons = dayLessons(s, c, date2).map((l) => matchesGroup(l, group) ? l : null);
  const b = classBells(c);
  const now = minutes(time);
  const food = meal(c);
  const current = b.findIndex(([a, z2]) => now >= minutes(a) && now < minutes(z2));
  const next = b.findIndex(([a], i) => now < minutes(a) && lessons[i]);
  const nextText = next < 0 ? null : { slot: next, lesson: lessons[next], time: b[next][0] };
  const noSchool = nonTeachingReason(getCalendar(s), c, date2);
  if (noSchool) return { title: noSchool, kind: "off", slot: -1, next: null };
  if (!lessons.some(Boolean)) return { title: s.changes[date2]?.[c] ? "\u041D\u0430 \u0446\u044E \u0434\u0430\u0442\u0443 \u0443\u0440\u043E\u043A\u0456\u0432 \u043D\u0435\u043C\u0430\u0454" : "\u041F\u0440\u0435\u0434\u043C\u0435\u0442\u0438 \u0449\u0435 \u043D\u0435 \u0434\u043E\u0434\u0430\u043D\u0456", kind: s.changes[date2]?.[c] ? "off" : "empty", slot: -1, next: null };
  if (current >= 0 && lessons[current]) return { title: lessons[current].subject, kind: "lesson", slot: current, next: nextText };
  if (now >= minutes(food[0]) && now < minutes(food[1])) return { title: "\u0427\u0430\u0441 \u0445\u0430\u0440\u0447\u0443\u0432\u0430\u043D\u043D\u044F", kind: "meal", slot: -1, next: nextText };
  return { title: next < 0 ? "\u0423\u0440\u043E\u043A\u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E" : now < minutes(b[0][0]) ? "\u0414\u043E \u043F\u043E\u0447\u0430\u0442\u043A\u0443 \u0443\u0440\u043E\u043A\u0456\u0432" : "\u041F\u0435\u0440\u0435\u0440\u0432\u0430 / \u0432\u0456\u043B\u044C\u043D\u0438\u0439 \u0447\u0430\u0441", kind: next < 0 ? "off" : "break", slot: -1, next: nextText };
}
function lessonNumberKey(c, date2, slot) {
  return date2 + "|" + c + "|" + slot;
}
function buildLessonNumberIndex(s) {
  const result = {};
  for (const semester of getCalendar(s).semesters) {
    const counters = {};
    const cursor = /* @__PURE__ */ new Date(semester.start + "T12:00:00Z");
    while (cursor.toISOString().slice(0, 10) <= semester.end) {
      const date2 = cursor.toISOString().slice(0, 10);
      for (const c of classes) {
        dayLessons(s, c, date2).forEach((l, slot) => {
          if (!l) return;
          const key = JSON.stringify([c, l.subject, l.group || ""]);
          const number = (counters[key] || 0) + 1;
          counters[key] = number;
          result[lessonNumberKey(c, date2, slot)] = number;
        });
      }
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  }
  return result;
}
function matchesGroup(l, group) {
  return !l || !group || !l.group || l.group === "\u0423\u0441\u0456" || l.group === group;
}
function weeklyForDate(s, date2) {
  return [...s.weeklyVersions || []].filter((v) => v.effectiveFrom <= date2).sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom))[0]?.weekly ?? s.weekly;
}
function ensureWeeklyVersion(s, date2) {
  if (!s.weeklyVersions?.length) s.weeklyVersions = [{ effectiveFrom: getCalendar(s).start, label: "\u041F\u043E\u0447\u0430\u0442\u043A\u043E\u0432\u0438\u0439 \u0440\u043E\u0437\u043A\u043B\u0430\u0434", weekly: structuredClone(s.weekly) }];
  let version = s.weeklyVersions.find((v) => v.effectiveFrom === date2);
  if (!version) {
    version = { effectiveFrom: date2, label: "\u0420\u043E\u0437\u043A\u043B\u0430\u0434 \u0432\u0456\u0434 " + date2, weekly: structuredClone(weeklyForDate(s, date2)) };
    s.weeklyVersions.push(version);
    s.weeklyVersions.sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));
  }
  return version;
}
function describeLesson(l) {
  return l ? l.subject + (l.group ? " \xB7 " + (l.group === "\u0423\u0441\u0456" ? "\u0423\u0441\u0456 \u0433\u0440\u0443\u043F\u0438" : "\u0413\u0440\u0443\u043F\u0430 " + l.group) : "") + (l.room ? " \xB7 \u043A\u0430\u0431. " + l.room : "") : "\u041D\u0435\u043C\u0430\u0454 \u0443\u0440\u043E\u043A\u0443";
}
function lessonChange(s, c, date2, slot) {
  if (!isChanged(s, c, date2, slot)) return null;
  return { before: weeklyForDate(s, date2)[c][weekday(date2)][slot], after: s.changes[date2][c][slot] };
}

// app/photo-import.tsx
import { useEffect, useRef, useState } from "file:///C:/Users/0009/Documents/ChatGPT/school_rozklad/site/.sites-runtime/editor-hooks.mjs";

// lib/photo-recognition.ts
function parsePhotoDate(raw) {
  const months = ["\u0441\u0456\u0447", "\u043B\u044E\u0442", "\u0431\u0435\u0440", "\u043A\u0432\u0456\u0442", "\u0442\u0440\u0430\u0432", "\u0447\u0435\u0440\u0432", "\u043B\u0438\u043F", "\u0441\u0435\u0440\u043F", "\u0432\u0435\u0440\u0435\u0441", "\u0436\u043E\u0432\u0442", "\u043B\u0438\u0441\u0442", "\u0433\u0440\u0443\u0434"];
  const text = raw.toLocaleLowerCase("uk").replace(/[_\n]/g, " ");
  const written = text.match(/(?:^|\D)(\d{1,2})\s+([а-яіїєґ]+)\s+(20\d{2})(?:\D|$)/), numeric = text.match(/(?:^|\D)(\d{1,2})[./-](\d{1,2})[./-](20\d{2})(?:\D|$)/);
  const day = written?.[1] || numeric?.[1], year = written?.[3] || numeric?.[3], month = written ? months.findIndex((m) => written[2].startsWith(m)) + 1 : Number(numeric?.[2]);
  if (!day || !year || month < 1 || month > 12) return null;
  const date2 = `${year}-${String(month).padStart(2, "0")}-${day.padStart(2, "0")}`;
  return !Number.isNaN(Date.parse(date2)) && (/* @__PURE__ */ new Date(date2 + "T12:00:00Z")).toISOString().slice(0, 10) === date2 ? date2 : null;
}
var aliases = [
  [/^навч.*грам/, "\u041D\u0430\u0432\u0447\u0430\u043D\u043D\u044F \u0433\u0440\u0430\u043C\u043E\u0442\u0438"],
  [/^[яаa]дос/, "\u042F \u0434\u043E\u0441\u043B\u0456\u0434\u0436\u0443\u044E \u0441\u0432\u0456\u0442"],
  [/^(лі[тгд].*чит|чит)/, "\u041B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u043D\u0435 \u0447\u0438\u0442\u0430\u043D\u043D\u044F"],
  [/^диз/, "\u0414\u0438\u0437\u0430\u0439\u043D \u0456 \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0456\u0457"],
  [/^хоре/, "\u0425\u043E\u0440\u0435\u043E\u0433\u0440\u0430\u0444\u0456\u044F"],
  [/^психол/, "\u041F\u0441\u0438\u0445\u043E\u043B\u043E\u0433\u0456\u0447\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430"],
  [/^бюл/, "\u0411\u0456\u043E\u043B\u043E\u0433\u0456\u044F"],
  [/^інформ/, "\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0442\u0438\u043A\u0430"],
  [/^укр.*мов/, "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430"],
  [/^укр.*літ/, "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430"],
  [/^зар/, "\u0417\u0430\u0440\u0443\u0431\u0456\u0436\u043D\u0430 \u043B\u0456\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0430"],
  [/^піз/, "\u041F\u0456\u0437\u043D\u0430\u0454\u043C\u043E \u043F\u0440\u0438\u0440\u043E\u0434\u0443"],
  [/^анг/, "\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430"],
  [/^(фіз.*кул|фізк)/, "\u0424\u0456\u0437\u0438\u0447\u043D\u0430 \u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430"],
  [/^фіз/, "\u0424\u0456\u0437\u0438\u043A\u0430"],
  [/^мат/, "\u041C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0430"],
  [/^алг/, "\u0410\u043B\u0433\u0435\u0431\u0440\u0430"],
  [/^геометр/, "\u0413\u0435\u043E\u043C\u0435\u0442\u0440\u0456\u044F"],
  [/^географ/, "\u0413\u0435\u043E\u0433\u0440\u0430\u0444\u0456\u044F"],
  [/^хім/, "\u0425\u0456\u043C\u0456\u044F"],
  [/^біол/, "\u0411\u0456\u043E\u043B\u043E\u0433\u0456\u044F"],
  [/^мист/, "\u041C\u0438\u0441\u0442\u0435\u0446\u0442\u0432\u043E"],
  [/^всес/, "\u0412\u0441\u0435\u0441\u0432\u0456\u0442\u043D\u044F \u0456\u0441\u0442\u043E\u0440\u0456\u044F"],
  [/^іст.*укр/, "\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0423\u043A\u0440\u0430\u0457\u043D\u0438"],
  [/^іст/, "\u0406\u0441\u0442\u043E\u0440\u0456\u044F"],
  [/^зд[оа]р/, "\u0417\u0434\u043E\u0440\u043E\u0432\u2019\u044F, \u0431\u0435\u0437\u043F\u0435\u043A\u0430 \u0442\u0430 \u0434\u043E\u0431\u0440\u043E\u0431\u0443\u0442"],
  [/^під/, "\u041F\u0456\u0434\u043F\u0440\u0438\u0454\u043C\u043D\u0438\u0446\u0442\u0432\u043E \u0456 \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0430 \u0433\u0440\u0430\u043C\u043E\u0442\u043D\u0456\u0441\u0442\u044C"],
  [/^вих/, "\u0412\u0438\u0445\u043E\u0432\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430"],
  [/^(stem|стем|sтем)/i, "STEM"],
  [/^техн/, "\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0456\u0457"],
  [/^робот/, "\u0420\u043E\u0431\u043E\u0442\u043E\u0442\u0435\u0445\u043D\u0456\u043A\u0430"],
  [/^гром/, "\u0413\u0440\u043E\u043C\u0430\u0434\u044F\u043D\u0441\u044C\u043A\u0430 \u043E\u0441\u0432\u0456\u0442\u0430"],
  [/^етик/, "\u0415\u0442\u0438\u043A\u0430"],
  [/^проф/, "\u041F\u0440\u043E\u0444\u0435\u0441\u0456\u0457"],
  [/^прав/, "\u041F\u0440\u0430\u0432\u043E\u0437\u043D\u0430\u0432\u0441\u0442\u0432\u043E"]
];
function parsePhotoCell(raw) {
  let text = raw.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim().replace(/^[|\[\]{}(«!™"“”]+|[|\[\]{}]+$/g, "").trim();
  if (!text || /^[-_—\s.]+$/.test(text)) return { lesson: null, known: false };
  const note = /\(\s*заміна\s*\)/i.test(text) ? "\u0417\u0430\u043C\u0456\u043D\u0430" : "";
  text = text.replace(/\(\s*заміна\s*\)/ig, "").trim();
  const g = text.match(/\(\s*((?:[IІіil1їЇTТ][IІіil1їЇTТ!]?|2))\s*\)/);
  let group = "";
  if (g) {
    group = g[1].length === 2 || g[1] === "2" ? "II" : "I";
    text = text.replace(g[0], "").trim();
  } else if (/(?:^|\s)(?:[вb][сc][іiї]|усі)(?:\s|$)/i.test(text)) {
    group = "\u0423\u0441\u0456";
    text = text.replace(/(?:[вb][сc][іiї]|усі)/ig, "").trim();
  }
  text = text.replace(/^(STEM)([МM])$/i, "STEM $2");
  const match = text.match(/(?:^|\s)([ТT][ПP]\s*\/\s*[БB]|[ІIЇ][СCT][ТT]|[ІIЇ][НH]|[КK][БB]|[УY][МM]|[АA][МM]|[СC][З3]|[ТT][ПPІI]|[ОO][ПP]|[АA][З3]|[БB]|[ГrR]|[МM])\s*[.,:;|_—\-]*$/i);
  const room = (match?.[1] || "").toUpperCase().replace(/\s/g, "").replace(/[IЇ]/g, "\u0406").replace(/C/g, "\u0421").replace(/T/g, "\u0422").replace(/H/g, "\u041D").replace(/K/g, "\u041A").replace(/B/g, "\u0411").replace(/Y/g, "\u0423").replace(/M/g, "\u041C").replace(/A/g, "\u0410").replace(/P/g, "\u041F").replace(/O/g, "\u041E").replace(/3/g, "\u0417").replace(/R/g, "\u0413").replace(/^ТІ$/, "\u0422\u041F");
  if (match) text = text.slice(0, match.index).trim();
  const key = text.toLocaleLowerCase("uk").replace(/[^а-яєіїґa-z0-9]/gi, "").replace(/[iї]/g, "\u0456").replace(/^bux/, "\u0432\u0438\u0445").replace(/^ффіз/, "\u0444\u0456\u0437");
  const subject = aliases.find(([re]) => re.test(key))?.[1] || closestSubject(key);
  return { lesson: { subject: subject || text, room, ...group ? { group } : {}, ...note ? { note } : {} }, known: !!subject };
}
function distance(a, b) {
  const row2 = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row2[0];
    row2[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const old = row2[j];
      row2[j] = Math.min(row2[j] + 1, row2[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = old;
    }
  }
  return row2[b.length];
}
function closestSubject(key) {
  if (key.length < 5) return;
  const variants = [...new Set(aliases.map(([, subject]) => subject))].map((subject) => ({ subject, key: subject.toLocaleLowerCase("uk").replace(/[^а-яєіїґa-z0-9]/gi, "").replace(/ї/g, "\u0456") }));
  const ranked = variants.map((v) => ({ ...v, score: 1 - distance(key, v.key) / Math.max(key.length, v.key.length) })).sort((a, b) => b.score - a.score);
  if (ranked[0].score >= 0.8 && ranked[0].score - ranked[1].score >= 0.12) return ranked[0].subject;
}

// lib/photo-image.ts
function cleanPhoto(data, contrast = 14) {
  const { width: w, height: h } = data, gray = new Float32Array(w * h), sum = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, p = i * 4;
    gray[i] = data.data[p] * 0.299 + data.data[p + 1] * 0.587 + data.data[p + 2] * 0.114;
    sum[(y + 1) * (w + 1) + x + 1] = gray[i] + sum[y * (w + 1) + x + 1] + sum[(y + 1) * (w + 1) + x] - sum[y * (w + 1) + x];
  }
  const out = new Uint8ClampedArray(w * h * 4), radius = Math.max(8, Math.round(h / 12));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const l = Math.max(0, x - radius), r = Math.min(w, x + radius + 1), t = Math.max(0, y - radius), b = Math.min(h, y + radius + 1);
    const mean = (sum[b * (w + 1) + r] - sum[t * (w + 1) + r] - sum[b * (w + 1) + l] + sum[t * (w + 1) + l]) / ((r - l) * (b - t));
    const value = gray[y * w + x] < mean - contrast ? 0 : 255, i = (y * w + x) * 4;
    out[i] = out[i + 1] = out[i + 2] = value;
    out[i + 3] = 255;
  }
  return out;
}
function clusters(values) {
  const groups = [];
  for (const v of values) {
    const g = groups.at(-1);
    if (g && v - g.at(-1) <= 3) g.push(v);
    else groups.push([v]);
  }
  return groups.map((g) => g[Math.floor(g.length / 2)]);
}
function findPhotoGrid(image, columns, rows, header = true, numbers = true) {
  const { width: w, height: h } = image, pixels = cleanPhoto(image, 8), dark = (x, y) => pixels[(y * w + x) * 4] === 0;
  for (let i = 0; i < pixels.length; i += 4) if (image.data[i] > image.data[i + 1] + 60 && image.data[i] > image.data[i + 2] + 60) pixels[i] = pixels[i + 1] = pixels[i + 2] = 255;
  const candidates = [];
  function lineScore(y, slope) {
    let hits = 0;
    for (let x = 0; x < w; x++) {
      const yy = Math.round(y + slope * (x - w / 2));
      if (yy > 0 && yy < h - 1 && (dark(x, yy) || dark(x, yy - 1) || dark(x, yy + 1))) hits++;
    }
    return hits;
  }
  for (const slope of [0, ...Array.from({ length: 32 }, (_, i) => (i + 1) * 25e-4).flatMap((s) => [s, -s])]) {
    const horizontal = [];
    for (let y = 1; y < h - 1; y++) {
      let run = 0, best = 0, hits = 0;
      for (let x = 0; x < w; x++) {
        const yy = Math.round(y + slope * (x - w / 2)), hit = yy >= 3 && yy < h - 3 && (dark(x, yy) || dark(x, yy - 1) || dark(x, yy + 1) || dark(x, yy - 2) || dark(x, yy + 2) || dark(x, yy - 3) || dark(x, yy + 3));
        run = hit ? run + 1 : 0;
        if (hit) hits++;
        best = Math.max(best, run);
      }
      if (best > w * 0.55 || hits > w * 0.7) horizontal.push(y);
    }
    for (const y of clusters(horizontal)) {
      let best = y, score = 0;
      for (let yy = Math.max(1, y - 4); yy <= Math.min(h - 2, y + 4); yy++) {
        const value = lineScore(yy, slope);
        if (value > score) {
          score = value;
          best = yy;
        }
      }
      candidates.push({ y: best, slope, score });
    }
  }
  const rules = [];
  for (const candidate of candidates.sort((a, b) => b.score - a.score)) if (!rules.some((rule) => Math.abs(rule.y - candidate.y) <= 10)) rules.push(candidate);
  rules.sort((a, b) => a.y - b.y);
  const gaps = rules.slice(1).map((r, i) => r.y - rules[i].y).sort((a, b) => a - b), separation = Math.min(18, (gaps[Math.floor(gaps.length / 2)] || 16) * 0.6);
  const spaced = [];
  for (const rule of [...rules].sort((a, b) => b.score - a.score)) if (!spaced.some((r) => Math.abs(r.y - rule.y) < separation)) spaced.push(rule);
  rules.splice(0, rules.length, ...spaced.sort((a, b) => a.y - b.y));
  const lines = rules.map((rule) => rule.y), required = rows + 1 + (header ? 1 : 0);
  let bestGrid = null, bestScore = 0;
  for (let start = 0; start + required <= lines.length; start++) {
    const selected = lines.slice(start, start + required), heights = selected.slice(1).map((v, i) => v - selected[i]);
    if (Math.min(...heights) < 4 || Math.max(...heights) > Math.min(...heights) * 2.5) continue;
    const lessonHeights = header ? heights.slice(1) : heights, median = [...lessonHeights].sort((a, b) => a - b)[Math.floor(lessonHeights.length / 2)];
    if (lessonHeights.some((height) => height < median * 0.8 || height > median * 1.25)) continue;
    const top = selected[0], bottom = selected.at(-1), middle = (top + bottom) / 2, vertical = [];
    for (let x = 1; x < w - 1; x++) {
      let best = { x, slope: 0, score: 0 };
      for (let tilt = -0.12; tilt <= 0.1201; tilt += 5e-3) {
        let hits = 0, count = 0;
        for (let y = Math.ceil(top - 50); y < bottom + 50; y += 2) {
          const xx = Math.round(x + tilt * (y - middle));
          if (y < top + rules[start].slope * (xx - w / 2) + 8 || y > bottom + rules[start + required - 1].slope * (xx - w / 2) - 8 || y < 1 || y >= h - 1) continue;
          count++;
          if (xx > 1 && xx < w - 2 && (dark(xx, y) || dark(xx - 1, y) || dark(xx + 1, y))) hits++;
        }
        const score2 = hits / count;
        if (score2 > best.score) best = { x, slope: tilt, score: score2 };
      }
      if (best.score > 0.8) vertical.push(best);
    }
    const strongest = rules.slice(start, start + required).reduce((a, b) => a.score > b.score ? a : b), runs = [];
    for (let x = 0; x < w; x++) {
      const y = Math.round(strongest.y + strongest.slope * (x - w / 2));
      if (y < 1 || y >= h - 1 || !(dark(x, y) || dark(x, y - 1) || dark(x, y + 1))) continue;
      const run = runs.at(-1);
      if (run && x - run.at(-1) <= 10) run.push(x);
      else runs.push([x]);
    }
    const span = runs.sort((a, b) => b.length - a.length)[0];
    if (!span) continue;
    const edges = [];
    for (const v of vertical.sort((a, b) => b.score - a.score)) if (!edges.some((e) => Math.abs(e.x - v.x) < 10)) edges.push(v);
    edges.sort((a, b) => a.x - b.x);
    const needed = columns + 1 + (numbers ? 1 : 0), kept = edges.length === needed ? edges : edges.filter((e) => e.x >= span[0] - w * 0.08 && e.x <= span.at(-1) + w * 0.08), xs = kept.map((e) => e.x);
    if (xs.length !== needed) continue;
    const lessonWidths = xs.slice(numbers ? 2 : 1).map((x, i) => x - xs[i + (numbers ? 1 : 0)]);
    if (Math.min(...lessonWidths) < 20 || Math.max(...lessonWidths) > Math.min(...lessonWidths) * 2) continue;
    const selectedRules = rules.slice(start, start + required), score = selectedRules.reduce((sum, rule) => sum + rule.score, 0), lessonRules = header ? selectedRules.slice(1) : selectedRules;
    if (score > bestScore) {
      bestScore = score;
      bestGrid = { xs: (numbers ? xs.slice(1) : xs).map((x) => x / w * 100), ys: lessonRules.map((rule) => rule.y / h * 100), slope: lessonRules.reduce((sum, rule) => sum + rule.slope, 0) / lessonRules.length, rowSlopes: lessonRules.map((rule) => rule.slope), columnSlopes: (numbers ? kept.slice(1) : kept).map((e) => e.slope), columnCenter: middle / h * 100 };
    }
  }
  return bestGrid;
}
function weightedEdges(start, end, weights) {
  const total = weights.reduce((a, b) => a + b, 0), edges = [start];
  for (const weight of weights) edges.push(edges.at(-1) + (end - start) * weight / total);
  return edges;
}
function extractPhotoCell(image, grid, column, row2) {
  const { width: w, height: h } = image;
  function corner(c, r) {
    const a = grid.rowSlopes[r] || 0, b = grid.columnSlopes[c] || 0, x0 = grid.xs[c] * w / 100, y0 = grid.ys[r] * h / 100, yc = grid.columnCenter * h / 100;
    const y = (y0 + a * (x0 - b * yc - w / 2)) / (1 - a * b);
    return { x: x0 + b * (y - yc), y };
  }
  const tl = corner(column, row2), tr = corner(column + 1, row2), bl = corner(column, row2 + 1), br = corner(column + 1, row2 + 1);
  const cellW = (tr.x - tl.x + br.x - bl.x) / 2, cellH = (bl.y - tl.y + br.y - tr.y) / 2;
  if (cellW < 10 || cellH < 8) throw new Error("\u041A\u043E\u043C\u0456\u0440\u043A\u0438 \u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0456. \u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043C\u0435\u0436\u0456 \u0442\u0430\u0431\u043B\u0438\u0446\u0456.");
  const scale = Math.min(5, Math.max(2, 48 / cellH)), padding = 12, width = Math.round(cellW * scale) + padding * 2, height = Math.round(cellH * scale) + padding * 2, data = new Uint8ClampedArray(width * height * 4).fill(255);
  const inset = 2;
  for (let y = padding; y < height - padding; y++) for (let x = padding; x < width - padding; x++) {
    const u = (x - padding) / (width - padding * 2 - 1), v = (y - padding) / (height - padding * 2 - 1), uu = (inset + u * (cellW - 2 * inset)) / cellW, vv = (inset + v * (cellH - 2 * inset)) / cellH;
    const sx = (1 - vv) * (tl.x + (tr.x - tl.x) * uu) + vv * (bl.x + (br.x - bl.x) * uu), sy = (1 - vv) * (tl.y + (tr.y - tl.y) * uu) + vv * (bl.y + (br.y - bl.y) * uu), ix = Math.round(sx), iy = Math.round(sy);
    if (ix < 0 || iy < 0 || ix >= w || iy >= h) continue;
    const src = (iy * w + ix) * 4, dst = (y * width + x) * 4;
    for (let k = 0; k < 3; k++) data[dst + k] = image.data[src + k];
  }
  return { width, height, data };
}
function removeCellLines(image) {
  const { width: w, height: h, data } = image, rows = [], cols = [];
  for (let y = 0; y < h; y++) {
    let hits = 0;
    for (let x = 0; x < w; x++) if (data[(y * w + x) * 4] === 0) hits++;
    if (hits > w * 0.55) rows.push(y);
  }
  for (let x = 0; x < w; x++) {
    let hits = 0;
    for (let y = 0; y < h; y++) if (data[(y * w + x) * 4] === 0) hits++;
    if (hits > h * 0.65) cols.push(x);
  }
  for (const y of rows) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    data[i] = data[i + 1] = data[i + 2] = 255;
  }
  for (const x of cols) for (let y = 0; y < h; y++) {
    const i = (y * w + x) * 4;
    data[i] = data[i + 1] = data[i + 2] = 255;
  }
}
function preparePhotoCell(image) {
  const { width: w, height: h } = image, pixels = cleanPhoto(image), seen = new Uint8Array(w * h), boxes = [];
  removeCellLines({ width: w, height: h, data: pixels });
  const stack = [];
  for (let p = 0; p < w * h; p++) {
    if (seen[p] || pixels[p * 4] !== 0) continue;
    seen[p] = 1;
    stack.push(p);
    let left = w, right = 0, top = h, bottom = 0, area = 0;
    while (stack.length) {
      const i = stack.pop(), x = i % w, y = Math.floor(i / w);
      area++;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy, n = yy * w + xx;
        if (xx >= 0 && xx < w && yy >= 0 && yy < h && !seen[n] && pixels[n * 4] === 0) {
          seen[n] = 1;
          stack.push(n);
        }
      }
    }
    const bh = bottom - top + 1, bw = right - left + 1;
    if (area >= 8 && bh >= h * 0.18 && bh < h * 0.85 && bw < Math.max(h * 2, w * 0.7) && bw >= bh * 0.05 && left > 1 && right < w - 2) boxes.push({ left, right, top, bottom });
  }
  const bins = /* @__PURE__ */ new Map();
  for (const box of boxes) {
    const key = Math.round((box.top + box.bottom) / 2 / (h * 0.15));
    bins.set(key, [...bins.get(key) || [], box]);
  }
  let textBoxes = [];
  for (const [key] of bins) {
    const nearby = boxes.filter((b2) => Math.abs((b2.top + b2.bottom) / 2 - key * h * 0.15) < h * 0.2);
    if (nearby.length > textBoxes.length) textBoxes = nearby;
  }
  if (textBoxes.length < 2) {
    pixels.fill(255);
    return { pixels, blank: true };
  }
  const l = Math.max(0, Math.min(...textBoxes.map((b2) => b2.left)) - 5), r = Math.min(w - 1, Math.max(...textBoxes.map((b2) => b2.right)) + 5), t = Math.max(0, Math.min(...textBoxes.map((b2) => b2.top)) - 6), b = Math.min(h - 1, Math.max(...textBoxes.map((b2) => b2.bottom)) + 6);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x < l || x > r || y < t || y > b) {
    const i = (y * w + x) * 4;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = 255;
  }
  return { pixels, blank: false };
}

// lib/abortable.ts
function abortable(promise, signal, onLateResult) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const abort = () => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", abort);
      reject(new DOMException("\u0421\u043A\u0430\u0441\u043E\u0432\u0430\u043D\u043E", "AbortError"));
    };
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
    promise.then((value) => {
      if (settled) {
        onLateResult?.(value);
        return;
      }
      settled = true;
      signal.removeEventListener("abort", abort);
      resolve(value);
    }, (error) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", abort);
      reject(error);
    });
  });
}

// app/photo-import.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function PhotoImport({ date: date2, onApply }) {
  const [file, setFile] = useState(null), [url, setUrl] = useState(""), [size, setSize] = useState({ w: 0, h: 0 }), [columns, setColumns] = useState("5, 6, 7, 8, 9-\u0410, 9-\u0411"), [widths, setWidths] = useState(""), [rowCount, setRowCount] = useState(8), [crop, setCrop] = useState({ left: 4, top: 15, right: 99, bottom: 55 }), [result, setResult] = useState([]), [busy, setBusy] = useState(false), [progress, setProgress] = useState(""), [error, setError] = useState(""), [confirmed, setConfirmed] = useState(false), [importDate, setImportDate] = useState(date2);
  const worker = useRef(null), cancelled = useRef(false), run = useRef(null);
  const [gridReady, setGridReady] = useState(false);
  const [automatic, setAutomatic] = useState(true), [tables, setTables] = useState([]), [suggestedDate, setSuggestedDate] = useState(""), [dateReviewed, setDateReviewed] = useState(false), [onlyUncertain, setOnlyUncertain] = useState(false);
  const uncertain = (r) => !!r.lesson && (!r.known || !r.lesson.room && !["1", "2", "3", "4"].includes(r.classId) || r.confidence < 75);
  const [edgeSlopes, setEdgeSlopes] = useState([]);
  const [columnSlopes, setColumnSlopes] = useState([]), [columnCenter, setColumnCenter] = useState(50);
  function preset(primary) {
    setSelecting(false);
    setCorner(null);
    setAutomatic(false);
    setTables([]);
    setColumns(primary ? "1, 2, 3, 4" : "5, 6, 7, 8, 9-\u0410, 9-\u0411");
    setRowCount(primary ? 6 : 8);
    setGridReady(false);
    setWidths("");
    setHeights("");
    setEdgeSlopes([]);
    setColumnSlopes([]);
    clear();
    setProgress("\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \xAB\u0417\u043D\u0430\u0439\u0442\u0438 \u043B\u0456\u043D\u0456\u0457 \u0442\u0430\u0431\u043B\u0438\u0446\u0456\xBB \u0434\u043B\u044F \u0432\u0438\u0431\u0440\u0430\u043D\u0438\u0445 \u043A\u043B\u0430\u0441\u0456\u0432.");
  }
  const [replaceDay, setReplaceDay] = useState(false);
  const [heights, setHeights] = useState(""), [slope, setSlope] = useState(0), [hasHeader, setHasHeader] = useState(true), [hasNumbers, setHasNumbers] = useState(true), [selecting, setSelecting] = useState(false), [corner, setCorner] = useState(null);
  useEffect(() => {
    setImportDate(date2);
    setConfirmed(false);
    setDateReviewed(false);
  }, [date2]);
  useEffect(() => () => {
    cancelled.current = true;
    run.current?.abort();
    void worker.current?.terminate().catch(() => {
    });
  }, []);
  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
  }, [url]);
  const classIds = columns.split(",").map((c) => c.trim()).filter(Boolean);
  const weights = widths.trim() ? widths.split(",").map(Number) : classIds.map(() => 1);
  const rowWeights = heights.trim() ? heights.split(",").map(Number) : Array(rowCount).fill(1);
  const xEdges = weightedEdges(crop.left, crop.right, weights), yEdges = weightedEdges(crop.top, crop.bottom, rowWeights);
  function clear() {
    setReplaceDay(false);
    setResult([]);
    setConfirmed(false);
    setError("");
  }
  function choose(f) {
    clear();
    setAutomatic(true);
    setTables([]);
    setSuggestedDate("");
    setDateReviewed(false);
    if (!["image/png", "image/jpeg", "image/webp"].includes(f.type) || f.size > 15e6) {
      setError("\u041E\u0431\u0435\u0440\u0456\u0442\u044C \u0444\u043E\u0442\u043E PNG/JPEG/WebP \u0434\u043E 15 \u041C\u0411.");
      return;
    }
    setEdgeSlopes([]);
    setColumnSlopes([]);
    setGridReady(false);
    setFile(f);
    setUrl(URL.createObjectURL(f));
    setSize({ w: 0, h: 0 });
    setCorner(null);
    setSelecting(false);
    setWidths("");
    setHeights("");
    setSlope(0);
  }
  async function detect() {
    if (!file) return;
    clear();
    const controller = new AbortController();
    run.current = controller;
    setBusy(true);
    setProgress("\u0428\u0443\u043A\u0430\u0454\u043C\u043E \u043B\u0456\u043D\u0456\u0457 \u0442\u0430\u0431\u043B\u0438\u0446\u0456\u2026");
    let bitmap;
    try {
      bitmap = await abortable(createImageBitmap(file), controller.signal, (b) => b.close());
      const canvas = document.createElement("canvas"), scale = Math.min(1, 1600 / bitmap.width);
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (automatic) {
        const detected = [{ classes: ["1", "2", "3", "4"], grid: findPhotoGrid(pixels, 4, 6) }, { classes: ["5", "6", "7", "8", "9-\u0410", "9-\u0411"], grid: findPhotoGrid(pixels, 6, 8) }].filter((t) => !!t.grid);
        setTables(detected);
        setGridReady(detected.length > 0);
        if (!detected.length) {
          setError("\u0422\u0430\u0431\u043B\u0438\u0446\u0456 \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E. \u041E\u0431\u0435\u0440\u0456\u0442\u044C \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0456 \u043A\u043B\u0430\u0441\u0438 \u0439 \u0432\u0438\u0434\u0456\u043B\u0456\u0442\u044C \u0442\u0430\u0431\u043B\u0438\u0446\u044E \u0432\u0440\u0443\u0447\u043D\u0443.");
          setProgress("");
        } else setProgress("\u0417\u043D\u0430\u0439\u0434\u0435\u043D\u043E " + detected.map((t) => t.classes.join(", ")).join(" \u0442\u0430 ") + ". \u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043C\u0435\u0436\u0456 \u043D\u0430 \u0444\u043E\u0442\u043E.");
        return;
      }
      const grid = findPhotoGrid(pixels, classIds.length, rowCount, hasHeader, hasNumbers);
      if (!grid) {
        setError("\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u043D\u0430\u0439\u0442\u0438 \u0432\u0441\u0456 \u043B\u0456\u043D\u0456\u0457. \u0412\u0438\u0434\u0456\u043B\u0456\u0442\u044C \u043A\u043E\u043C\u0456\u0440\u043A\u0438 \u043A\u043D\u043E\u043F\u043A\u043E\u044E \xAB\u0412\u0438\u0434\u0456\u043B\u0438\u0442\u0438 \u0442\u0430\u0431\u043B\u0438\u0446\u044E\xBB \u0442\u0430 \u043F\u0456\u0434\u043B\u0430\u0448\u0442\u0443\u0439\u0442\u0435 \u0448\u0438\u0440\u0438\u043D\u0438 \u043A\u043E\u043B\u043E\u043D\u043E\u043A \u0456 \u0432\u0438\u0441\u043E\u0442\u0438 \u0440\u044F\u0434\u043A\u0456\u0432.");
        setProgress("");
        return;
      }
      setColumnSlopes(grid.columnSlopes);
      setColumnCenter(grid.columnCenter);
      setGridReady(true);
      setCrop({ left: grid.xs[0], right: grid.xs.at(-1), top: grid.ys[0], bottom: grid.ys.at(-1) });
      setSlope(grid.slope);
      setEdgeSlopes(grid.rowSlopes);
      setWidths(grid.xs.slice(1).map((x, i) => (x - grid.xs[i]).toFixed(3)).join(", "));
      setHeights(grid.ys.slice(1).map((y, i) => (y - grid.ys[i]).toFixed(3)).join(", "));
      setProgress("\u041C\u0435\u0436\u0456 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E. \u0417\u0432\u0456\u0440\u0442\u0435 \u043A\u043E\u0436\u043D\u0443 \u043B\u0456\u043D\u0456\u044E \u0441\u0456\u0442\u043A\u0438 \u0437 \u0444\u043E\u0442\u043E \u043F\u0435\u0440\u0435\u0434 \u0440\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u0432\u0430\u043D\u043D\u044F\u043C.");
    } catch {
      if (!controller.signal.aborted) setError("\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u0438 \u0444\u043E\u0442\u043E. \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0432\u0438\u0434\u0456\u043B\u0438\u0442\u0438 \u0442\u0430\u0431\u043B\u0438\u0446\u044E \u0432\u0440\u0443\u0447\u043D\u0443.");
    } finally {
      bitmap?.close();
      if (run.current === controller) {
        run.current = null;
        setBusy(false);
      }
    }
  }
  function pickCorner(e) {
    if (!selecting || busy) return;
    const bounds = e.currentTarget.getBoundingClientRect(), p = { x: (e.clientX - bounds.left) / bounds.width * 100, y: (e.clientY - bounds.top) / bounds.height * 100 };
    if (!corner) {
      setCorner(p);
      setProgress("\u0422\u0435\u043F\u0435\u0440 \u043D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u043D\u0438\u0436\u043D\u0456\u0439 \u043F\u0440\u0430\u0432\u0438\u0439 \u043A\u0443\u0442 \u043E\u0441\u0442\u0430\u043D\u043D\u044C\u043E\u0457 \u043A\u043E\u043C\u0456\u0440\u043A\u0438 \u0437 \u0443\u0440\u043E\u043A\u043E\u043C.");
    } else {
      const next = { left: Math.min(corner.x, p.x), right: Math.max(corner.x, p.x), top: Math.min(corner.y, p.y), bottom: Math.max(corner.y, p.y) };
      if (next.right - next.left < 2 || next.bottom - next.top < 2) return;
      setEdgeSlopes([]);
      setColumnSlopes([]);
      setGridReady(true);
      setCrop(next);
      setCorner(null);
      setSelecting(false);
      setWidths("");
      setHeights("");
      setSlope(0);
      clear();
      setProgress("\u0417\u0432\u0456\u0440\u0442\u0435 \u0432\u043D\u0443\u0442\u0440\u0456\u0448\u043D\u0456 \u043B\u0456\u043D\u0456\u0457 \u0441\u0456\u0442\u043A\u0438 \u0437 \u043C\u0435\u0436\u0430\u043C\u0438 \u043A\u043E\u043C\u0456\u0440\u043E\u043A.");
    }
  }
  async function recognize() {
    clear();
    if (!file || !size.w) return;
    if (!gridReady) {
      setError("\u0421\u043F\u043E\u0447\u0430\u0442\u043A\u0443 \u0437\u043D\u0430\u0439\u0434\u0456\u0442\u044C \u043B\u0456\u043D\u0456\u0457 \u0442\u0430\u0431\u043B\u0438\u0446\u0456 \u0430\u0431\u043E \u0432\u0438\u0434\u0456\u043B\u0456\u0442\u044C \u043A\u043E\u043C\u0456\u0440\u043A\u0438 \u043D\u0430 \u0444\u043E\u0442\u043E.");
      return;
    }
    if (!automatic && (!classIds.length || new Set(classIds).size !== classIds.length || classIds.some((c) => !classes.includes(c)))) {
      setError("\u0412\u043A\u0430\u0436\u0456\u0442\u044C \u043A\u043B\u0430\u0441\u0438 \u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443 \u0432 \u043F\u043E\u0440\u044F\u0434\u043A\u0443 \u043A\u043E\u043B\u043E\u043D\u043E\u043A, \u043D\u0430\u043F\u0440\u0438\u043A\u043B\u0430\u0434 5, 6, 7, 8, 9-\u0410, 9-\u0411.");
      return;
    }
    if (!automatic && (weights.length !== classIds.length || weights.some((w) => !Number.isFinite(w) || w <= 0))) {
      setError("\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0448\u0438\u0440\u0438\u043D \u043C\u0430\u0454 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0442\u0438 \u043A\u0456\u043B\u044C\u043A\u043E\u0441\u0442\u0456 \u043A\u043B\u0430\u0441\u0456\u0432; \u0443\u0441\u0456 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u043C\u0430\u044E\u0442\u044C \u0431\u0443\u0442\u0438 \u0431\u0456\u043B\u044C\u0448\u0456 \u043D\u0443\u043B\u044F.");
      return;
    }
    if (!automatic && (rowWeights.length !== rowCount || rowWeights.some((w) => !Number.isFinite(w) || w <= 0))) {
      setError("\u0412\u043A\u0430\u0436\u0456\u0442\u044C \u043E\u0434\u043D\u0443 \u0434\u043E\u0434\u0430\u0442\u043D\u0443 \u0432\u0438\u0441\u043E\u0442\u0443 \u0434\u043B\u044F \u043A\u043E\u0436\u043D\u043E\u0433\u043E \u0440\u044F\u0434\u043A\u0430.");
      return;
    }
    if (!automatic && (crop.left < 0 || crop.top < 0 || crop.right > 100 || crop.bottom > 100 || crop.left >= crop.right || crop.top >= crop.bottom)) {
      setError("\u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043C\u0435\u0436\u0456 \u0442\u0430\u0431\u043B\u0438\u0446\u0456.");
      return;
    }
    cancelled.current = false;
    const controller = new AbortController();
    run.current = controller;
    let activeWorker = null;
    const wait = (promise) => abortable(promise, controller.signal);
    setBusy(true);
    setProgress("\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0440\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u0432\u0430\u043D\u043D\u044F\u2026");
    try {
      const { createWorker, PSM } = await import("tesseract.js");
      const origin = window.location.origin;
      activeWorker = await abortable(createWorker("ukr+eng", 1, { workerPath: origin + "/ocr/worker.min.js", corePath: origin + "/ocr/core", langPath: origin + "/ocr/lang", workerBlobURL: false }), controller.signal, (w) => {
        void w.terminate().catch(() => {
        });
      });
      worker.current = activeWorker;
      if (cancelled.current) return;
      await wait(activeWorker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_LINE, preserve_interword_spaces: "1", user_defined_dpi: "300" }));
      const image = await abortable(createImageBitmap(file), controller.signal, (b) => b.close());
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const fullCanvas = document.createElement("canvas");
      fullCanvas.width = image.width;
      fullCanvas.height = image.height;
      const fullContext = fullCanvas.getContext("2d");
      fullContext.drawImage(image, 0, 0);
      const fullPixels = fullContext.getImageData(0, 0, image.width, image.height);
      const targets = automatic ? tables : [{ classes: classIds, grid: { xs: xEdges, ys: yEdges, rowSlopes: edgeSlopes.length ? edgeSlopes : yEdges.map(() => slope), columnSlopes, columnCenter } }];
      const jobs = targets.flatMap((t) => Array.from({ length: t.grid.ys.length - 1 }, (_, slot) => t.classes.map((classId, column) => ({ classId, column, slot, grid: t.grid }))).flat());
      const found = [];
      try {
        for (const [index, { classId, column, slot, grid }] of jobs.entries()) {
          if (cancelled.current) return;
          setProgress(`\u0420\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u0432\u0430\u043D\u043D\u044F ${index + 1} / ${jobs.length}`);
          const cell = extractPhotoCell(fullPixels, grid, column, slot), padding = 12;
          canvas.width = cell.width;
          canvas.height = cell.height;
          ctx.putImageData(new ImageData(new Uint8ClampedArray(cell.data), cell.width, cell.height), 0, 0);
          const preview = canvas.toDataURL("image/png"), original = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const content = ctx.getImageData(padding, padding, canvas.width - 2 * padding, canvas.height - 2 * padding), prepared = preparePhotoCell(content), cleaned = prepared.pixels;
          if (prepared.blank) {
            found.push({ classId, slot, raw: "", confidence: 0, lesson: null, known: false, preview, include: false });
            continue;
          }
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.putImageData(new ImageData(cleaned, content.width, content.height), padding, padding);
          await wait(activeWorker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_LINE }));
          let { data } = await wait(activeWorker.recognize(canvas)), parsed = parsePhotoCell(data.text);
          if (!parsed.known || !parsed.lesson?.room && !["1", "2", "3", "4"].includes(classId) || data.confidence < 85) {
            const rank = (p, confidence) => (p.known ? 2 : 0) + (p.lesson?.room ? 1 : 0) + confidence / 100;
            ctx.putImageData(original, 0, 0);
            const retry = (await wait(activeWorker.recognize(canvas))).data, retryParsed = parsePhotoCell(retry.text);
            if (rank(retryParsed, retry.confidence) > rank(parsed, data.confidence)) {
              data = retry;
              parsed = retryParsed;
            }
            if (!parsed.known || !parsed.lesson?.room && !["1", "2", "3", "4"].includes(classId) || data.confidence < 75) {
              ctx.putImageData(original, 0, 0);
              await wait(activeWorker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_BLOCK }));
              const block = (await wait(activeWorker.recognize(canvas))).data, blockParsed = parsePhotoCell(block.text);
              if (rank(blockParsed, block.confidence) > rank(parsed, data.confidence)) {
                data = block;
                parsed = blockParsed;
              }
            }
          }
          found.push({ classId, slot, raw: data.text.trim(), confidence: data.confidence, lesson: parsed.lesson, known: parsed.known, preview, include: parsed.known && !(!parsed.lesson?.room && !["1", "2", "3", "4"].includes(classId)) && data.confidence >= 75 && slot < classBells(classId).length });
        }
        const top = Math.max(1, Math.min(...targets.map((t) => t.grid.ys[0])) / 100 * image.height - 12);
        canvas.width = image.width;
        canvas.height = Math.round(top);
        ctx.drawImage(image, 0, 0, image.width, top, 0, 0, canvas.width, canvas.height);
        await wait(activeWorker.setParameters({ tessedit_pageseg_mode: PSM.SPARSE_TEXT }));
        const headline = (await wait(activeWorker.recognize(canvas))).data.text;
        const detectedDate = parsePhotoDate(headline);
        setSuggestedDate(detectedDate || "");
        if (detectedDate) {
          setImportDate(detectedDate);
          setDateReviewed(false);
        }
      } finally {
        image.close();
      }
      if (!cancelled.current) {
        setResult(found);
        setProgress("\u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u0438, \u043A\u0430\u0431\u0456\u043D\u0435\u0442\u0438, \u0433\u0440\u0443\u043F\u0438 \u0442\u0430 \u0434\u0430\u0442\u0443. \u041D\u0435\u043F\u0435\u0432\u043D\u0456 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0438 \u043D\u0435 \u0432\u0438\u0431\u0440\u0430\u043D\u0456.");
      }
    } catch (e) {
      if (!cancelled.current) setError("\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0440\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u0442\u0438: " + e.message);
    } finally {
      await activeWorker?.terminate().catch(() => {
      });
      if (run.current === controller) {
        run.current = null;
        worker.current = null;
        setBusy(false);
      }
    }
  }
  function update(i, fn) {
    setResult((prev) => prev.map((r, j) => {
      if (i !== j) return r;
      const copy = structuredClone(r);
      fn(copy);
      return copy;
    }));
    setConfirmed(false);
  }
  function apply() {
    const chosen = result.filter((r) => r.slot < classBells(r.classId).length && (r.include || replaceDay && r.lesson === null));
    if (!confirmed || !dateReviewed || !chosen.length) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(importDate) || Number.isNaN(Date.parse(importDate)) || (/* @__PURE__ */ new Date(importDate + "T12:00:00Z")).toISOString().slice(0, 10) !== importDate || weekday(importDate) < 0 || weekday(importDate) > 4) {
      setError("\u041E\u0431\u0435\u0440\u0456\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0443 \u0434\u0430\u0442\u0443 \u0437 \u043F\u043E\u043D\u0435\u0434\u0456\u043B\u043A\u0430 \u0434\u043E \u043F\u2019\u044F\u0442\u043D\u0438\u0446\u0456.");
      return;
    }
    if (chosen.some((r) => r.slot >= classBells(r.classId).length || r.lesson && (!r.lesson.subject.trim() || r.lesson.subject.length > 150))) {
      setError("\u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u0438 \u0439 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0456 \u043D\u043E\u043C\u0435\u0440\u0438 \u0443\u0440\u043E\u043A\u0456\u0432.");
      return;
    }
    onApply(chosen.map(({ classId, slot, lesson: lesson2 }) => ({ classId, slot, lesson: lesson2 })), importDate);
    setResult([]);
    setConfirmed(false);
    setProgress("\u0414\u043E\u0434\u0430\u043D\u043E \u0432 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443.");
  }
  return /* @__PURE__ */ jsxs("section", { className: "panel ocr-panel", children: [
    /* @__PURE__ */ jsx("h2", { children: "\u0420\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u0442\u0438 \u0437\u043C\u0456\u043D\u0438 \u0437 \u0444\u043E\u0442\u043E" }),
    /* @__PURE__ */ jsx("p", { children: "\u0424\u043E\u0442\u043E \u043E\u0431\u0440\u043E\u0431\u043B\u044F\u0454\u0442\u044C\u0441\u044F \u043D\u0430 \u0432\u0430\u0448\u043E\u043C\u0443 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u0457. \u0421\u0430\u0439\u0442 \u0437\u043D\u0430\u0445\u043E\u0434\u0438\u0442\u044C \u0456 \u0440\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u0454 \u043E\u0431\u0438\u0434\u0432\u0456 \u0442\u0430\u0431\u043B\u0438\u0446\u0456 \u043E\u0434\u043D\u0438\u043C \u0437\u0430\u043F\u0443\u0441\u043A\u043E\u043C. \u0417\u0430 \u043F\u043E\u0442\u0440\u0435\u0431\u0438 \u043E\u0431\u0435\u0440\u0456\u0442\u044C \u043B\u0438\u0448\u0435 1\u20134 \u0430\u0431\u043E 5\u20139 \u043A\u043B\u0430\u0441\u0438. \u0414\u0430\u0442\u0443 \u0437 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430 \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u043E \u043F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0438. \u0421\u0456\u0442\u043A\u0430 \u043C\u0430\u0454 \u043E\u0445\u043E\u043F\u043B\u044E\u0432\u0430\u0442\u0438 \u043B\u0438\u0448\u0435 \u0443\u0440\u043E\u043A\u0438: \u0431\u0435\u0437 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0456\u0432, \u043D\u043E\u043C\u0435\u0440\u0456\u0432 \u0437\u043B\u0456\u0432\u0430 \u0439 \u043B\u0435\u0433\u0435\u043D\u0434\u0438. \u041A\u043E\u0436\u043D\u0430 \u0447\u0435\u0440\u0432\u043E\u043D\u0430 \u043B\u0456\u043D\u0456\u044F \u043C\u0430\u0454 \u0437\u0431\u0456\u0433\u0430\u0442\u0438\u0441\u044F \u0437 \u043C\u0435\u0436\u0435\u044E \u043A\u043E\u043C\u0456\u0440\u043A\u0438." }),
    /* @__PURE__ */ jsxs("label", { className: "secondary-button", children: [
      "\u041E\u0431\u0440\u0430\u0442\u0438 \u0444\u043E\u0442\u043E",
      /* @__PURE__ */ jsx("input", { type: "file", accept: "image/png,image/jpeg,image/webp", disabled: busy, onChange: (e) => {
        const f = e.target.files?.[0];
        if (f) choose(f);
        e.target.value = "";
      } })
    ] }),
    url && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "ocr-actions", children: [
        /* @__PURE__ */ jsx("button", { className: "secondary-button", "aria-pressed": automatic, disabled: busy, onClick: () => {
          setSelecting(false);
          setCorner(null);
          setAutomatic(true);
          setGridReady(false);
          clear();
          setProgress("\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \xAB\u0417\u043D\u0430\u0439\u0442\u0438 \u043B\u0456\u043D\u0456\u0457 \u0442\u0430\u0431\u043B\u0438\u0446\u0456\xBB \u0434\u043B\u044F \u0432\u0441\u0456\u0445 \u0442\u0430\u0431\u043B\u0438\u0446\u044C.");
        }, children: "\u0423\u0441\u0456 \u0442\u0430\u0431\u043B\u0438\u0446\u0456 \u043D\u0430 \u0444\u043E\u0442\u043E" }),
        /* @__PURE__ */ jsx("button", { className: "secondary-button", "aria-pressed": !automatic && columns.startsWith("5"), disabled: busy, onClick: () => preset(false), children: "\u0422\u0430\u0431\u043B\u0438\u0446\u044F 5\u20139 \u043A\u043B\u0430\u0441\u0456\u0432" }),
        /* @__PURE__ */ jsx("button", { className: "secondary-button", "aria-pressed": !automatic && columns.startsWith("1"), disabled: busy, onClick: () => preset(true), children: "\u0422\u0430\u0431\u043B\u0438\u0446\u044F 1\u20134 \u043A\u043B\u0430\u0441\u0456\u0432" })
      ] }),
      !automatic && /* @__PURE__ */ jsxs("div", { className: "ocr-config", children: [
        /* @__PURE__ */ jsxs("label", { children: [
          "\u041A\u043B\u0430\u0441\u0438 \u0437\u043B\u0456\u0432\u0430 \u043D\u0430\u043F\u0440\u0430\u0432\u043E",
          /* @__PURE__ */ jsx("input", { value: columns, disabled: busy, onChange: (e) => {
            setColumns(e.target.value);
            setGridReady(false);
            setColumnSlopes([]);
            clear();
          } })
        ] }),
        /* @__PURE__ */ jsxs("label", { children: [
          "\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0440\u044F\u0434\u043A\u0456\u0432 \u0437 \u0443\u0440\u043E\u043A\u0430\u043C\u0438",
          /* @__PURE__ */ jsx("select", { value: rowCount, disabled: busy, onChange: (e) => {
            setRowCount(Number(e.target.value));
            setEdgeSlopes([]);
            setColumnSlopes([]);
            setGridReady(false);
            setHeights("");
            clear();
          }, children: [5, 6, 7, 8].map((n) => /* @__PURE__ */ jsx("option", { children: n }, n)) })
        ] }),
        /* @__PURE__ */ jsxs("label", { children: [
          "\u0414\u0430\u0442\u0430 \u0437\u043C\u0456\u043D",
          /* @__PURE__ */ jsx("input", { type: "date", value: importDate, disabled: busy, onChange: (e) => {
            setImportDate(e.target.value);
            setConfirmed(false);
            setDateReviewed(false);
          } })
        ] })
      ] }),
      automatic && /* @__PURE__ */ jsxs("label", { className: "ocr-date", children: [
        "\u0414\u0430\u0442\u0430 \u0437\u043C\u0456\u043D",
        /* @__PURE__ */ jsx("input", { type: "date", value: importDate, disabled: busy, onChange: (e) => {
          setImportDate(e.target.value);
          setConfirmed(false);
          setDateReviewed(false);
        } })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ocr-actions", children: [
        !automatic && /* @__PURE__ */ jsxs("label", { children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: hasHeader, disabled: busy, onChange: (e) => {
            setHasHeader(e.target.checked);
            setGridReady(false);
          } }),
          " \u0404 \u0440\u044F\u0434\u043E\u043A \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0456\u0432 \u043A\u043B\u0430\u0441\u0456\u0432"
        ] }),
        !automatic && /* @__PURE__ */ jsxs("label", { children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: hasNumbers, disabled: busy, onChange: (e) => {
            setHasNumbers(e.target.checked);
            setGridReady(false);
          } }),
          " \u0404 \u043A\u043E\u043B\u043E\u043D\u043A\u0430 \u043D\u043E\u043C\u0435\u0440\u0456\u0432 \u0443\u0440\u043E\u043A\u0456\u0432"
        ] }),
        /* @__PURE__ */ jsx("button", { className: "secondary-button", disabled: busy || !size.w, onClick: () => void detect(), children: "\u0417\u043D\u0430\u0439\u0442\u0438 \u043B\u0456\u043D\u0456\u0457 \u0442\u0430\u0431\u043B\u0438\u0446\u0456" }),
        /* @__PURE__ */ jsx("button", { className: "secondary-button", disabled: busy || !size.w || automatic, onClick: () => {
          setSelecting(!selecting);
          setCorner(null);
          setProgress(selecting ? "" : "\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u0432\u0435\u0440\u0445\u043D\u0456\u0439 \u043B\u0456\u0432\u0438\u0439 \u043A\u0443\u0442 \u043F\u0435\u0440\u0448\u043E\u0457 \u043A\u043E\u043C\u0456\u0440\u043A\u0438 \u0437 \u0443\u0440\u043E\u043A\u043E\u043C \u2014 \u043F\u0456\u0434 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u043E\u043C \u0456 \u043F\u0440\u0430\u0432\u043E\u0440\u0443\u0447 \u0432\u0456\u0434 \u043D\u043E\u043C\u0435\u0440\u0456\u0432.");
        }, children: selecting ? "\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438 \u0432\u0438\u0434\u0456\u043B\u0435\u043D\u043D\u044F" : "\u0412\u0438\u0434\u0456\u043B\u0438\u0442\u0438 \u0442\u0430\u0431\u043B\u0438\u0446\u044E" })
      ] }),
      !automatic && /* @__PURE__ */ jsxs("details", { className: "ocr-fine-tune", children: [
        /* @__PURE__ */ jsx("summary", { children: "\u0423\u0442\u043E\u0447\u043D\u0438\u0442\u0438 \u0441\u0456\u0442\u043A\u0443 \u0432\u0440\u0443\u0447\u043D\u0443" }),
        /* @__PURE__ */ jsxs("label", { children: [
          "\u041D\u0430\u0445\u0438\u043B \u0440\u044F\u0434\u043A\u0456\u0432, \xB0",
          /* @__PURE__ */ jsx("input", { type: "number", min: "-4", max: "4", step: "0.1", value: Number((Math.atan(slope) * 180 / Math.PI).toFixed(2)), disabled: busy, onChange: (e) => {
            setEdgeSlopes([]);
            setColumnSlopes([]);
            setSlope(Math.tan(Number(e.target.value) * Math.PI / 180));
            clear();
          } })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ocr-config", children: [
          /* @__PURE__ */ jsxs("label", { children: [
            "\u0428\u0438\u0440\u0438\u043D\u0438 \u043A\u043E\u043B\u043E\u043D\u043E\u043A \u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443",
            /* @__PURE__ */ jsx("input", { value: widths, placeholder: "\u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E \u2014 \u043E\u0434\u043D\u0430\u043A\u043E\u0432\u0456", disabled: busy, onChange: (e) => {
              setWidths(e.target.value);
              clear();
            } })
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            "\u0412\u0438\u0441\u043E\u0442\u0438 \u0440\u044F\u0434\u043A\u0456\u0432 \u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443",
            /* @__PURE__ */ jsx("input", { value: heights, placeholder: "\u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E \u2014 \u043E\u0434\u043D\u0430\u043A\u043E\u0432\u0456", disabled: busy, onChange: (e) => {
              setEdgeSlopes([]);
              setColumnSlopes([]);
              setHeights(e.target.value);
              clear();
            } })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "crop-fields", children: ["left", "top", "right", "bottom"].map((key, i) => /* @__PURE__ */ jsxs("label", { children: [
          ["\u041B\u0456\u0432\u0430 \u043C\u0435\u0436\u0430, %", "\u0412\u0435\u0440\u0445\u043D\u044F \u043C\u0435\u0436\u0430, %", "\u041F\u0440\u0430\u0432\u0430 \u043C\u0435\u0436\u0430, %", "\u041D\u0438\u0436\u043D\u044F \u043C\u0435\u0436\u0430, %"][i],
          /* @__PURE__ */ jsx("input", { type: "number", min: "0", max: "100", step: "0.1", value: Number(crop[key].toFixed(2)), disabled: busy, onChange: (e) => {
            setEdgeSlopes([]);
            setColumnSlopes([]);
            setGridReady(true);
            setCrop((p) => ({ ...p, [key]: Number(e.target.value) }));
            clear();
          } })
        ] }, key)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `ocr-image ${selecting ? "selecting" : ""}`, onClick: pickCorner, children: [
        /* @__PURE__ */ jsx("img", { src: url, alt: "\u0424\u043E\u0442\u043E \u0437 \u043C\u0435\u0436\u0430\u043C\u0438 \u0442\u0430\u0431\u043B\u0438\u0446\u0456 \u0434\u043B\u044F \u0440\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u0432\u0430\u043D\u043D\u044F", onLoad: (e) => {
          setSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight });
          void detect();
        }, onError: () => {
          setGridReady(false);
          setBusy(false);
          setError("\u0424\u043E\u0442\u043E \u043D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0432\u0456\u0434\u043A\u0440\u0438\u0442\u0438. \u041E\u0431\u0435\u0440\u0456\u0442\u044C \u043E\u0440\u0438\u0433\u0456\u043D\u0430\u043B\u044C\u043D\u0438\u0439 \u0444\u0430\u0439\u043B PNG \u0430\u0431\u043E JPEG \u0449\u0435 \u0440\u0430\u0437.");
        } }),
        automatic && gridReady && /* @__PURE__ */ jsx("svg", { className: "ocr-grid-overlay", viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true", children: tables.map((t, k) => /* @__PURE__ */ jsxs("g", { children: [
          t.grid.xs.map((x, i) => /* @__PURE__ */ jsx("line", { x1: x + (t.grid.columnSlopes[i] || 0) * size.h / size.w * (t.grid.ys[0] - t.grid.columnCenter), x2: x + (t.grid.columnSlopes[i] || 0) * size.h / size.w * (t.grid.ys.at(-1) - t.grid.columnCenter), y1: t.grid.ys[0] + t.grid.rowSlopes[0] * size.w / size.h * (x - 50), y2: t.grid.ys.at(-1) + t.grid.rowSlopes.at(-1) * size.w / size.h * (x - 50) }, "x" + i)),
          t.grid.ys.map((y, i) => /* @__PURE__ */ jsx("line", { x1: t.grid.xs[0], x2: t.grid.xs.at(-1), y1: y + t.grid.rowSlopes[i] * size.w / size.h * (t.grid.xs[0] - 50), y2: y + t.grid.rowSlopes[i] * size.w / size.h * (t.grid.xs.at(-1) - 50) }, "y" + i))
        ] }, k)) }),
        !automatic && gridReady && /* @__PURE__ */ jsxs("svg", { className: "ocr-grid-overlay", viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true", children: [
          xEdges.filter(Number.isFinite).map((x, i) => /* @__PURE__ */ jsx("line", { x1: x + (columnSlopes[i] || 0) * size.h / Math.max(1, size.w) * (crop.top - columnCenter), x2: x + (columnSlopes[i] || 0) * size.h / Math.max(1, size.w) * (crop.bottom - columnCenter), y1: crop.top + (edgeSlopes[0] ?? slope) * size.w / Math.max(1, size.h) * (x - 50), y2: crop.bottom + (edgeSlopes.at(-1) ?? slope) * size.w / Math.max(1, size.h) * (x - 50) }, "x" + i)),
          yEdges.filter(Number.isFinite).map((y, i) => /* @__PURE__ */ jsx("line", { x1: crop.left, x2: crop.right, y1: y + (edgeSlopes[i] ?? slope) * size.w / Math.max(1, size.h) * (crop.left - 50), y2: y + (edgeSlopes[i] ?? slope) * size.w / Math.max(1, size.h) * (crop.right - 50) }, "y" + i))
        ] }),
        corner && /* @__PURE__ */ jsx("span", { className: "ocr-corner", style: { left: corner.x + "%", top: corner.y + "%" } })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ocr-actions", children: [
        /* @__PURE__ */ jsx("button", { className: "primary-button", disabled: busy || !size.w || selecting || !gridReady, onClick: () => void recognize(), children: "\u0420\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u0442\u0438 \u0442\u0430\u0431\u043B\u0438\u0446\u044E" }),
        busy && /* @__PURE__ */ jsx("button", { className: "secondary-button", onClick: () => {
          cancelled.current = true;
          run.current?.abort();
          void worker.current?.terminate().catch(() => {
          });
          setProgress("\u0421\u043A\u0430\u0441\u043E\u0432\u0430\u043D\u043E");
        }, children: "\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438" }),
        /* @__PURE__ */ jsx("span", { role: "status", children: progress })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "alert error", role: "alert", children: error }),
    result.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "ocr-results-summary", children: [
        /* @__PURE__ */ jsxs("strong", { children: [
          result.filter((r) => r.include).length,
          " \u0432\u0438\u0431\u0440\u0430\u043D\u043E \xB7 ",
          result.filter(uncertain).length,
          " \u043F\u043E\u0442\u0440\u0435\u0431\u0443\u044E\u0442\u044C \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u043A\u0438"
        ] }),
        /* @__PURE__ */ jsxs("label", { children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: onlyUncertain, onChange: (e) => setOnlyUncertain(e.target.checked) }),
          "\u0422\u0456\u043B\u044C\u043A\u0438 \u043D\u0435\u043F\u0435\u0432\u043D\u0456"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "photo-date-check", children: [
        /* @__PURE__ */ jsx("p", { children: suggestedDate ? "\u0414\u0430\u0442\u0430 \u0437 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430: " + suggestedDate : "\u0414\u0430\u0442\u0443 \u043D\u0430 \u0444\u043E\u0442\u043E \u043D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0432\u0438\u0437\u043D\u0430\u0447\u0438\u0442\u0438. \u0412\u043A\u0430\u0436\u0456\u0442\u044C \u0457\u0457 \u0432\u0440\u0443\u0447\u043D\u0443." }),
        /* @__PURE__ */ jsxs("label", { className: "ocr-confirm", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: dateReviewed, onChange: (e) => {
            setDateReviewed(e.target.checked);
            setConfirmed(false);
          } }),
          "\u0414\u0430\u0442\u0430 ",
          importDate,
          " \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0454 \u0444\u043E\u0442\u043E"
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { children: "\u041F\u043E\u0437\u043D\u0430\u0447\u0442\u0435 \u043A\u043E\u043C\u0456\u0440\u043A\u0438, \u044F\u043A\u0456 \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u043E \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u0432\u0430\u0442\u0438. \u041F\u043E\u0440\u043E\u0436\u043D\u0456 \u043A\u043E\u043C\u0456\u0440\u043A\u0438 \u043D\u0435 \u0441\u043A\u0430\u0441\u043E\u0432\u0443\u044E\u0442\u044C \u0443\u0440\u043E\u043A \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E: \u0434\u043B\u044F \u0441\u043A\u0430\u0441\u0443\u0432\u0430\u043D\u043D\u044F \u043F\u043E\u0437\u043D\u0430\u0447\u0442\u0435 \u0440\u044F\u0434\u043E\u043A \u0456 \u043E\u0447\u0438\u0441\u0442\u0456\u0442\u044C \u043F\u0440\u0435\u0434\u043C\u0435\u0442." }),
      /* @__PURE__ */ jsxs("label", { className: "ocr-confirm", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: replaceDay, onChange: (e) => {
          setReplaceDay(e.target.checked);
          setConfirmed(false);
        } }),
        "\u0424\u043E\u0442\u043E \u043C\u0456\u0441\u0442\u0438\u0442\u044C \u043F\u043E\u0432\u043D\u0438\u0439 \u0434\u0435\u043D\u043D\u0438\u0439 \u0440\u043E\u0437\u043A\u043B\u0430\u0434: \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u0432\u0430\u0442\u0438 \u043F\u043E\u0440\u043E\u0436\u043D\u0456 \u043A\u043E\u043C\u0456\u0440\u043A\u0438 \u044F\u043A \u0441\u043A\u0430\u0441\u0443\u0432\u0430\u043D\u043D\u044F \u0443\u0440\u043E\u043A\u0456\u0432"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ocr-review", children: /* @__PURE__ */ jsxs("table", { children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { children: "\u0414\u043E\u0434\u0430\u0442\u0438" }),
          /* @__PURE__ */ jsx("th", { children: "\u041A\u043B\u0430\u0441 / \u0443\u0440\u043E\u043A" }),
          /* @__PURE__ */ jsx("th", { children: "\u041F\u0440\u0435\u0434\u043C\u0435\u0442" }),
          /* @__PURE__ */ jsx("th", { children: "\u041A\u0430\u0431\u0456\u043D\u0435\u0442" }),
          /* @__PURE__ */ jsx("th", { children: "\u0413\u0440\u0443\u043F\u0430" }),
          /* @__PURE__ */ jsx("th", { children: "\u0417 \u0444\u043E\u0442\u043E" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: result.map((r, i) => onlyUncertain && !uncertain(r) ? null : /* @__PURE__ */ jsxs("tr", { className: uncertain(r) ? "uncertain" : "", children: [
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", { "aria-label": `\u0417\u0430\u0441\u0442\u043E\u0441\u0443\u0432\u0430\u0442\u0438 ${r.classId} \u0443\u0440\u043E\u043A ${r.slot + 1}`, type: "checkbox", checked: r.include, disabled: r.slot >= classBells(r.classId).length, onChange: (e) => update(i, (c) => {
            c.include = e.target.checked;
          }) }) }),
          /* @__PURE__ */ jsxs("td", { children: [
            r.classId,
            " \xB7 ",
            r.slot + 1
          ] }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("input", { "aria-label": `\u041F\u0440\u0435\u0434\u043C\u0435\u0442 ${r.classId} \u0443\u0440\u043E\u043A ${r.slot + 1}`, value: r.lesson?.subject || "", placeholder: "\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438 \u0443\u0440\u043E\u043A", onChange: (e) => update(i, (c) => {
            c.lesson = e.target.value.trim() ? { ...c.lesson || { room: "" }, subject: e.target.value } : null;
          }) }) }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("select", { "aria-label": `\u041A\u0430\u0431\u0456\u043D\u0435\u0442 ${r.classId} \u0443\u0440\u043E\u043A ${r.slot + 1}`, value: r.lesson?.room || "", disabled: !r.lesson, onChange: (e) => update(i, (c) => {
            if (c.lesson) c.lesson.room = e.target.value;
          }), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "\u041D\u0435 \u0432\u043A\u0430\u0437\u0430\u043D\u043E" }),
            Object.keys(rooms).map((v) => /* @__PURE__ */ jsx("option", { children: v }, v))
          ] }) }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("select", { "aria-label": `\u0413\u0440\u0443\u043F\u0430 ${r.classId} \u0443\u0440\u043E\u043A ${r.slot + 1}`, value: r.lesson?.group || "", disabled: !r.lesson, onChange: (e) => update(i, (c) => {
            if (c.lesson) c.lesson.group = e.target.value;
          }), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "\u0412\u0435\u0441\u044C \u043A\u043B\u0430\u0441" }),
            /* @__PURE__ */ jsx("option", { children: "I" }),
            /* @__PURE__ */ jsx("option", { children: "II" }),
            /* @__PURE__ */ jsx("option", { children: "\u0423\u0441\u0456" })
          ] }) }),
          /* @__PURE__ */ jsxs("td", { children: [
            /* @__PURE__ */ jsx("img", { className: "ocr-cell-preview", src: r.preview, alt: `\u041A\u043E\u043C\u0456\u0440\u043A\u0430 ${r.classId}, \u0443\u0440\u043E\u043A ${r.slot + 1}` }),
            /* @__PURE__ */ jsxs("small", { children: [
              r.lesson?.note && /* @__PURE__ */ jsxs("strong", { children: [
                r.lesson.note,
                /* @__PURE__ */ jsx("br", {})
              ] }),
              r.raw || "\u041F\u043E\u0440\u043E\u0436\u043D\u044F \u043A\u043E\u043C\u0456\u0440\u043A\u0430",
              /* @__PURE__ */ jsx("br", {}),
              Math.round(r.confidence),
              "%"
            ] })
          ] })
        ] }, i)) })
      ] }) }),
      /* @__PURE__ */ jsxs("label", { className: "ocr-confirm", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: confirmed, onChange: (e) => setConfirmed(e.target.checked) }),
        "\u042F \u0437\u0432\u0456\u0440\u0438\u0432 \u0434\u0430\u0442\u0443, \u0432\u0438\u0431\u0440\u0430\u043D\u0456 \u0443\u0440\u043E\u043A\u0438, \u043A\u0430\u0431\u0456\u043D\u0435\u0442\u0438 \u0442\u0430 \u0433\u0440\u0443\u043F\u0438 \u0437 \u0444\u043E\u0442\u043E"
      ] }),
      /* @__PURE__ */ jsx("button", { className: "primary-button", disabled: !confirmed || !dateReviewed || !result.some((r) => r.include || replaceDay && r.lesson === null), onClick: apply, children: "\u0414\u043E\u0434\u0430\u0442\u0438 \u0432\u0438\u0431\u0440\u0430\u043D\u0456 \u0437\u043C\u0456\u043D\u0438 \u0432 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443" })
    ] })
  ] });
}

// app/draft-recovery.tsx
import { useEffect as useEffect2, useState as useState2, useRef as useRef2 } from "file:///C:/Users/0009/Documents/ChatGPT/school_rozklad/site/.sites-runtime/editor-hooks.mjs";

// lib/validation.ts
import { z } from "zod";
var str = z.string().trim().max(150);
var lesson = z.object({ subject: str.min(1), room: str, group: str.optional(), teacherId: z.string().max(80).optional(), note: str.optional() }).strict().nullable();
var slots = z.array(lesson).length(8);
var calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((v) => !Number.isNaN(Date.parse(v)) && (/* @__PURE__ */ new Date(v + "T12:00:00Z")).toISOString().slice(0, 10) === v, "\u041D\u0435\u043A\u043E\u0440\u0435\u043A\u0442\u043D\u0430 \u0434\u0430\u0442\u0430 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044F");
var classScope = z.array(z.enum(classes)).max(10);
var period = z.object({ label: str.min(1), start: calendarDate, end: calendarDate }).strict();
var calendar = z.object({ start: calendarDate, end: calendarDate, semesters: z.array(period).min(1).max(4), breaks: z.array(period.extend({ classes: classScope })).max(30), daysOff: z.array(z.object({ date: calendarDate, label: str.min(1), classes: classScope }).strict()).max(200), sourceUrl: z.string().max(500).refine((v) => v === "" || /^https:\/\//.test(v), "\u0414\u0436\u0435\u0440\u0435\u043B\u043E \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 HTTPS-\u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F\u043C"), confirmed: z.boolean() }).strict().superRefine((c, ctx) => {
  const issue = (message) => ctx.addIssue({ code: "custom", message });
  if (c.end < c.start || Date.parse(c.end) - Date.parse(c.start) > 370 * 864e5) issue("\u041D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u0439 \u0440\u0456\u043A \u043C\u0430\u0454 \u0442\u0440\u0438\u0432\u0430\u0442\u0438 \u043D\u0435 \u0431\u0456\u043B\u044C\u0448\u0435 370 \u0434\u043D\u0456\u0432");
  for (const p of [...c.semesters, ...c.breaks]) if (p.end < p.start || p.start < c.start || p.end > c.end) issue("\u041F\u0435\u0440\u0456\u043E\u0434\u0438 \u043C\u0430\u044E\u0442\u044C \u0431\u0443\u0442\u0438 \u0432 \u043C\u0435\u0436\u0430\u0445 \u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0440\u043E\u043A\u0443; \u043F\u043E\u0447\u0430\u0442\u043E\u043A \u2014 \u043D\u0435 \u043F\u0456\u0437\u043D\u0456\u0448\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044F");
  for (const p of c.daysOff) if (p.date < c.start || p.date > c.end) issue("\u041D\u0435\u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u0439 \u0434\u0435\u043D\u044C \u043F\u043E\u0437\u0430 \u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u043C \u0440\u043E\u043A\u043E\u043C");
  c.semesters.forEach((p, i) => {
    if (c.semesters.some((q, j) => j < i && p.start <= q.end && p.end >= q.start)) issue("\u0421\u0435\u043C\u0435\u0441\u0442\u0440\u0438 \u043D\u0435 \u043C\u043E\u0436\u0443\u0442\u044C \u043F\u0435\u0440\u0435\u0442\u0438\u043D\u0430\u0442\u0438\u0441\u044F");
  });
});
var date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((v) => !Number.isNaN(Date.parse(v)) && (/* @__PURE__ */ new Date(v + "T12:00:00Z")).toISOString().slice(0, 10) === v && weekday(v) >= 0 && weekday(v) <= 4, "\u041E\u0431\u0435\u0440\u0456\u0442\u044C \u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u0439 \u0434\u0435\u043D\u044C");
var schoolSchema = z.object({
  version: z.literal(1),
  calendar: calendar.optional(),
  weekly: z.record(z.array(slots).length(5)),
  weeklyVersions: z.array(z.object({ effectiveFrom: calendarDate, label: str.min(1), weekly: z.record(z.array(slots).length(5)) }).strict()).max(50).optional(),
  changes: z.record(date, z.record(slots)),
  teachers: z.array(z.object({ id: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/), name: str.min(3), rules: z.array(z.object({ subjects: z.array(str.min(1)).min(1).max(50), classes: z.array(z.enum(classes)).min(1).max(10) }).strict()).max(50) }).strict()).max(100)
}).strict().superRefine((s, ctx) => {
  const issue = (message) => ctx.addIssue({ code: "custom", message });
  if (Object.keys(s.weekly).length !== classes.length || classes.some((c) => !s.weekly[c])) issue("\u041F\u043E\u0442\u0440\u0456\u0431\u043D\u0456 \u0432\u0441\u0456 \u0434\u0435\u0441\u044F\u0442\u044C \u043A\u043B\u0430\u0441\u0456\u0432");
  if (Object.keys(s.changes).length > 500) issue("\u0417\u0430\u0431\u0430\u0433\u0430\u0442\u043E \u0434\u0430\u0442 \u0437\u043C\u0456\u043D");
  const ids = s.teachers.map((t) => t.id);
  if (new Set(ids).size !== ids.length) issue("\u041F\u043E\u0432\u0442\u043E\u0440\u044E\u0454\u0442\u044C\u0441\u044F \u0456\u0434\u0435\u043D\u0442\u0438\u0444\u0456\u043A\u0430\u0442\u043E\u0440 \u0443\u0447\u0438\u0442\u0435\u043B\u044F");
  const check = (c, rows) => {
    if (!classes.includes(c)) {
      issue("\u041D\u0435\u0432\u0456\u0434\u043E\u043C\u0438\u0439 \u043A\u043B\u0430\u0441");
      return;
    }
    rows.forEach((l, i) => {
      if (l && i >= classBells(c).length) issue(`\u0414\u043B\u044F ${c} \u043A\u043B\u0430\u0441\u0443 \u043D\u0435\u043C\u0430\u0454 ${i + 1} \u0434\u0437\u0432\u0456\u043D\u043A\u0430`);
      if (l?.teacherId && !ids.includes(l.teacherId)) issue("\u041D\u0435\u0432\u0456\u0434\u043E\u043C\u0438\u0439 \u0443\u0447\u0438\u0442\u0435\u043B\u044C");
    });
  };
  Object.entries(s.weekly).forEach(([c, week]) => week.forEach((rows) => check(c, rows)));
  const dates = s.weeklyVersions?.map((v) => v.effectiveFrom) || [];
  if (new Set(dates).size !== dates.length) issue("\u0414\u043B\u044F \u0434\u0430\u0442\u0438 \u043C\u043E\u0436\u0435 \u0431\u0443\u0442\u0438 \u043B\u0438\u0448\u0435 \u043E\u0434\u043D\u0430 \u0432\u0435\u0440\u0441\u0456\u044F \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u0443");
  for (const v of s.weeklyVersions || []) {
    if (Object.keys(v.weekly).length !== classes.length || classes.some((c) => !v.weekly[c])) issue("\u0423 \u0432\u0435\u0440\u0441\u0456\u0457 \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0456 \u0432\u0441\u0456 \u043A\u043B\u0430\u0441\u0438");
    Object.entries(v.weekly).forEach(([c, week]) => week.forEach((rows) => check(c, rows)));
    if (v.effectiveFrom < getCalendar(s).start || v.effectiveFrom > getCalendar(s).end) issue("\u0414\u0430\u0442\u0430 \u0432\u0435\u0440\u0441\u0456\u0457 \u043F\u043E\u0437\u0430 \u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u043C \u0440\u043E\u043A\u043E\u043C");
  }
  Object.values(s.changes).forEach((day) => Object.entries(day).forEach(([c, rows]) => check(c, rows)));
});

// lib/draft-storage.ts
var draftKey = "school-editor-draft-v1";
function readStoredDraft(raw) {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw), parsed = schoolSchema.safeParse(value.school);
    return parsed.success && Number.isSafeInteger(value.baseRevision) && value.baseRevision >= 0 && typeof value.savedAt === "string" && !Number.isNaN(Date.parse(value.savedAt)) ? { school: parsed.data, baseRevision: value.baseRevision, savedAt: value.savedAt, ...typeof value.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.date) && !Number.isNaN(Date.parse(value.date)) && (/* @__PURE__ */ new Date(value.date + "T12:00:00Z")).toISOString().slice(0, 10) === value.date ? { date: value.date } : {}, ...classes.includes(value.classId) ? { classId: value.classId } : {} } : null;
  } catch {
    return null;
  }
}

// app/draft-recovery.tsx
import { Fragment as Fragment2, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function DraftRecovery({ enabled, ready, draft, dirty, revision, date: date2, classId, onRestore }) {
  const [loaded, setLoaded] = useState2(false), [recovery, setRecovery] = useState2(null), [status, setStatus] = useState2(""), [reviewed, setReviewed] = useState2(false);
  const lastWritten = useRef2(null);
  useEffect2(() => {
    if (!enabled || !ready) return;
    try {
      setRecovery(readStoredDraft(localStorage.getItem(draftKey)));
    } catch {
      setStatus("\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u0435 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0435. \u0415\u043A\u0441\u043F\u043E\u0440\u0442\u0443\u0439\u0442\u0435 \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u0443 \u043A\u043E\u043F\u0456\u044E.");
    }
    setLoaded(true);
  }, [enabled, ready]);
  useEffect2(() => {
    if (!enabled || !ready || !loaded || recovery) return;
    if (!dirty) {
      try {
        if (lastWritten.current && localStorage.getItem(draftKey) === lastWritten.current) localStorage.removeItem(draftKey);
      } catch {
      }
      lastWritten.current = null;
      setStatus("");
      return;
    }
    if (!draft) return;
    try {
      const raw = JSON.stringify({ school: draft, baseRevision: revision, savedAt: (/* @__PURE__ */ new Date()).toISOString(), date: date2, classId });
      localStorage.setItem(draftKey, raw);
      lastWritten.current = raw;
      setStatus("\u0427\u0435\u0440\u043D\u0435\u0442\u043A\u0443 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E \u043D\u0430 \u0446\u044C\u043E\u043C\u0443 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u0457.");
    } catch {
      setStatus("\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443 \u043D\u0430 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u0457. \u0415\u043A\u0441\u043F\u043E\u0440\u0442\u0443\u0439\u0442\u0435 \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u0443 \u043A\u043E\u043F\u0456\u044E.");
    }
  }, [enabled, ready, loaded, recovery, draft, dirty, revision, date2, classId]);
  useEffect2(() => {
    if (!enabled || !dirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [enabled, dirty]);
  useEffect2(() => {
    if (!enabled) return;
    const changed = (e) => {
      if (e.key === draftKey && !dirty) setRecovery(readStoredDraft(e.newValue));
    };
    window.addEventListener("storage", changed);
    return () => window.removeEventListener("storage", changed);
  }, [enabled, dirty]);
  if (!enabled) return null;
  function clear() {
    try {
      if (readStoredDraft(localStorage.getItem(draftKey))?.savedAt === recovery?.savedAt) localStorage.removeItem(draftKey);
    } catch {
    }
    setRecovery(null);
    setReviewed(false);
  }
  return /* @__PURE__ */ jsxs2(Fragment2, { children: [
    recovery && /* @__PURE__ */ jsxs2("section", { className: "panel recovery-panel", children: [
      /* @__PURE__ */ jsx2("h2", { children: "\u0417\u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043D\u0435\u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0443 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443" }),
      /* @__PURE__ */ jsxs2("p", { children: [
        "\u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0430 ",
        new Date(recovery.savedAt).toLocaleString("uk-UA"),
        ". \u0412\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u043D\u0435 \u0437\u043C\u0456\u043D\u044E\u0454 \u043E\u043F\u0443\u0431\u043B\u0456\u043A\u043E\u0432\u0430\u043D\u0438\u0439 \u0440\u043E\u0437\u043A\u043B\u0430\u0434."
      ] }),
      dirty && /* @__PURE__ */ jsx2("p", { className: "warning-text", children: "\u0412\u0456\u0434\u043D\u043E\u0432\u0456\u0442\u044C \u0430\u0431\u043E \u0432\u0456\u0434\u043A\u0438\u043D\u044C\u0442\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u0443 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443, \u0449\u043E\u0431 \u0443\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u0435 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F \u043D\u043E\u0432\u0438\u0445 \u043F\u0440\u0430\u0432\u043E\u043A." }),
      recovery.baseRevision !== revision && /* @__PURE__ */ jsx2("p", { className: "warning-text", children: "\u0420\u043E\u0437\u043A\u043B\u0430\u0434 \u043D\u0430 \u0441\u0430\u0439\u0442\u0456 \u0432\u0436\u0435 \u0437\u043C\u0456\u043D\u0438\u0432\u0441\u044F. \u0412\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0430 \u0437\u0430\u043C\u0456\u043D\u0438\u0442\u044C \u0439\u043E\u0433\u043E \u043B\u0438\u0448\u0435 \u043F\u0456\u0441\u043B\u044F \u0432\u0430\u0448\u043E\u0433\u043E \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F." }),
      (recovery.baseRevision !== revision || dirty) && /* @__PURE__ */ jsxs2("label", { className: "ocr-confirm", children: [
        /* @__PURE__ */ jsx2("input", { type: "checkbox", checked: reviewed, onChange: (e) => setReviewed(e.target.checked) }),
        "\u042F \u0440\u043E\u0437\u0443\u043C\u0456\u044E, \u0449\u043E \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0437\u0430\u043C\u0456\u043D\u0438\u0442\u044C \u043F\u043E\u0442\u043E\u0447\u043D\u0443 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443"
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "ocr-actions", children: [
        /* @__PURE__ */ jsx2("button", { className: "primary-button", disabled: (recovery.baseRevision !== revision || dirty) && !reviewed, onClick: () => {
          onRestore(recovery.school, { date: recovery.date, classId: recovery.classId });
          clear();
        }, children: "\u0412\u0456\u0434\u043D\u043E\u0432\u0438\u0442\u0438 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443" }),
        /* @__PURE__ */ jsx2("button", { className: "secondary-button", onClick: clear, children: "\u0412\u0456\u0434\u043A\u0438\u043D\u0443\u0442\u0438 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0443 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443" })
      ] })
    ] }),
    dirty && status && /* @__PURE__ */ jsx2("p", { className: "draft-storage-status", role: "status", children: status })
  ] });
}

// app/save-history.tsx
import { useState as useState3 } from "file:///C:/Users/0009/Documents/ChatGPT/school_rozklad/site/.sites-runtime/editor-hooks.mjs";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function SaveHistory({ revision, dirty, onRestore }) {
  const [versions, setVersions] = useState3([]), [busy, setBusy] = useState3(false), [error, setError] = useState3(""), [selected, setSelected] = useState3(null), [confirmed, setConfirmed] = useState3(false), [loaded, setLoaded] = useState3(false);
  async function read(version) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/schedule/history" + (version !== void 0 ? "?revision=" + version : ""), { cache: "no-store" }), body = await r.json();
      if (!r.ok) throw new Error(body.error || "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F");
      if (version === void 0) {
        setVersions(body.versions);
        setLoaded(true);
      } else {
        const parsed = schoolSchema.safeParse(body.school);
        if (!parsed.success) throw new Error("\u0412\u0435\u0440\u0441\u0456\u044F \u043C\u0430\u0454 \u043D\u0435\u0441\u0443\u043C\u0456\u0441\u043D\u0456 \u0434\u0430\u043D\u0456.");
        setSelected({ school: parsed.data, revision: version });
        setConfirmed(false);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxs3("details", { className: "panel save-history", children: [
    /* @__PURE__ */ jsx3("summary", { children: "\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u044C \u0456 \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F" }),
    /* @__PURE__ */ jsx3("p", { children: "\u041E\u0441\u0442\u0430\u043D\u043D\u0456 50 \u0432\u0435\u0440\u0441\u0456\u0439. \u0406\u0441\u0442\u043E\u0440\u0456\u044F \u043F\u043E\u0447\u0438\u043D\u0430\u0454\u0442\u044C\u0441\u044F \u0437 \u043F\u0435\u0440\u0448\u043E\u0433\u043E \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F \u043F\u0456\u0441\u043B\u044F \u0446\u044C\u043E\u0433\u043E \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F. \u041F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456 \u0432\u0435\u0440\u0441\u0456\u0457 \u0432\u0456\u0434\u043A\u0440\u0438\u0432\u0430\u044E\u0442\u044C\u0441\u044F \u044F\u043A \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0430." }),
    /* @__PURE__ */ jsx3("button", { className: "secondary-button", disabled: busy, onClick: () => void read(), children: busy ? "\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F\u2026" : "\u041E\u043D\u043E\u0432\u0438\u0442\u0438 \u0456\u0441\u0442\u043E\u0440\u0456\u044E" }),
    error && /* @__PURE__ */ jsx3("p", { role: "alert", className: "warning-text", children: error }),
    loaded && !versions.length && /* @__PURE__ */ jsx3("p", { children: "\u0429\u0435 \u043D\u0435\u043C\u0430\u0454 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0438\u0445 \u0432\u0435\u0440\u0441\u0456\u0439." }),
    /* @__PURE__ */ jsx3("div", { className: "version-list", children: versions.map((v) => /* @__PURE__ */ jsxs3("button", { disabled: busy || v.revision === revision, onClick: () => void read(v.revision), children: [
      /* @__PURE__ */ jsxs3("strong", { children: [
        "\u0412\u0435\u0440\u0441\u0456\u044F ",
        v.revision,
        v.revision === revision ? " \xB7 \u043F\u043E\u0442\u043E\u0447\u043D\u0430" : ""
      ] }),
      /* @__PURE__ */ jsx3("span", { children: new Date(v.updated_at).toLocaleString("uk-UA") })
    ] }, v.revision)) }),
    selected && /* @__PURE__ */ jsxs3("div", { className: "restore-preview", children: [
      /* @__PURE__ */ jsxs3("h3", { children: [
        "\u0412\u0456\u0434\u043D\u043E\u0432\u0438\u0442\u0438 \u0432\u0435\u0440\u0441\u0456\u044E ",
        selected.revision
      ] }),
      /* @__PURE__ */ jsxs3("p", { children: [
        Object.keys(selected.school.changes).length,
        " \u0434\u0430\u0442 \u0437\u0456 \u0437\u043C\u0456\u043D\u0430\u043C\u0438 \xB7 ",
        selected.school.teachers.length,
        " \u0443\u0447\u0438\u0442\u0435\u043B\u0456\u0432 \xB7 ",
        (selected.school.weeklyVersions || []).length,
        " \u0432\u0435\u0440\u0441\u0456\u0439 \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0433\u043E \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u0443"
      ] }),
      /* @__PURE__ */ jsxs3("p", { children: [
        "\u0412\u0435\u0441\u044C \u0440\u043E\u0437\u043A\u043B\u0430\u0434, \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0442\u0430 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440 \u0446\u0456\u0454\u0457 \u0432\u0435\u0440\u0441\u0456\u0457 \u0437\u0430\u043C\u0456\u043D\u044F\u0442\u044C \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443. ",
        dirty && "\u0423 \u043D\u0456\u0439 \u0443\u0436\u0435 \u0454 \u043D\u0435\u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0456 \u043F\u0440\u0430\u0432\u043A\u0438."
      ] }),
      /* @__PURE__ */ jsxs3("label", { className: "ocr-confirm", children: [
        /* @__PURE__ */ jsx3("input", { type: "checkbox", checked: confirmed, onChange: (e) => setConfirmed(e.target.checked) }),
        "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u0446\u044E \u0432\u0435\u0440\u0441\u0456\u044E \u0434\u043B\u044F \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u043A\u0438 \u0437\u0430\u043C\u0456\u0441\u0442\u044C \u043F\u043E\u0442\u043E\u0447\u043D\u043E\u0457 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0438"
      ] }),
      /* @__PURE__ */ jsx3("button", { className: "primary-button", disabled: !confirmed || busy, onClick: () => {
        onRestore(selected.school);
        setSelected(null);
      }, children: "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u044F\u043A \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443" })
    ] })
  ] });
}

// app/theme-toggle.tsx
import { useEffect as useEffect3, useState as useState4 } from "file:///C:/Users/0009/Documents/ChatGPT/school_rozklad/site/.sites-runtime/editor-hooks.mjs";
import { Moon, Sun } from "lucide-react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function ThemeToggle() {
  const [theme, setTheme] = useState4("dark");
  useEffect3(() => {
    try {
      const saved = localStorage.getItem("school-theme");
      if (saved === "light") {
        setTheme("light");
        document.documentElement.dataset.theme = "light";
      }
    } catch {
    }
  }, []);
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("school-theme", next);
    } catch {
    }
  }
  return /* @__PURE__ */ jsxs4("button", { className: "theme-toggle", onClick: toggle, "aria-label": theme === "dark" ? "\u0423\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438 \u0441\u0432\u0456\u0442\u043B\u0443 \u0442\u0435\u043C\u0443" : "\u0423\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438 \u0442\u0435\u043C\u043D\u0443 \u0442\u0435\u043C\u0443", title: theme === "dark" ? "\u0421\u0432\u0456\u0442\u043B\u0430 \u0442\u0435\u043C\u0430" : "\u0422\u0435\u043C\u043D\u0430 \u0442\u0435\u043C\u0430", children: [
    theme === "dark" ? /* @__PURE__ */ jsx4(Sun, { size: 18 }) : /* @__PURE__ */ jsx4(Moon, { size: 18 }),
    /* @__PURE__ */ jsx4("span", { children: theme === "dark" ? "\u0421\u0432\u0456\u0442\u043B\u0430" : "\u0422\u0435\u043C\u043D\u0430" })
  ] });
}

// app/day-view.tsx
import { ArrowRight, Check, ChevronDown } from "lucide-react";

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
function kyivInstant(date2, time, seconds = 0) {
  const wall = Date.parse(`${date2}T${time}:00Z`) + seconds * 1e3;
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Kyiv", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  let instant = wall;
  for (let i = 0; i < 3; i++) {
    const p = Object.fromEntries(formatter.formatToParts(new Date(instant)).map((p2) => [p2.type, p2.value]));
    const local = Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}Z`);
    instant += wall - local;
  }
  return instant;
}
function secondsUntil(date2, time, now) {
  return Math.max(0, Math.round((kyivInstant(date2, time) - kyivInstant(now.date, now.time, now.seconds)) / 1e3));
}
function durationLabel(seconds) {
  const total = Math.ceil(seconds / 60), days2 = Math.floor(total / 1440), hours = Math.floor(total % 1440 / 60), mins = total % 60;
  return [days2 ? `${days2} \u0434\u043D` : null, hours ? `${hours} \u0433\u043E\u0434` : null, mins || !days2 && !hours ? `${mins} \u0445\u0432` : null].filter(Boolean).join(" ");
}

// app/day-view.tsx
import { Fragment as Fragment3, jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var fullDate = (date2) => new Intl.DateTimeFormat("uk-UA", { weekday: "long", day: "numeric", month: "long" }).format(/* @__PURE__ */ new Date(date2 + "T12:00:00Z"));
var destinationDay = (date2) => ["\u043D\u0435\u0434\u0456\u043B\u0456", "\u043F\u043E\u043D\u0435\u0434\u0456\u043B\u043A\u0430", "\u0432\u0456\u0432\u0442\u043E\u0440\u043A\u0430", "\u0441\u0435\u0440\u0435\u0434\u0438", "\u0447\u0435\u0442\u0432\u0435\u0440\u0433\u0430", "\u043F\u2019\u044F\u0442\u043D\u0438\u0446\u0456", "\u0441\u0443\u0431\u043E\u0442\u0438"][(/* @__PURE__ */ new Date(date2 + "T12:00:00Z")).getUTCDay()];
function DayView({ school, date: date2, now, target, numbers, onOpenDate }) {
  const rows = lessonsForTarget(school, date2, target), timeline = dayTimeline(rows), today = now ? lessonsForTarget(school, now.date, target) : [];
  const current = now ? today.filter((r) => minutes(r.time[0]) <= now.minutes && minutes(r.time[1]) > now.minutes) : [];
  const next = now ? nextScheduledLesson(school, now, target) : null, focus = current[0] || next, teacherMode = "teacherId" in target;
  const nextOnDate = rows.find((r) => date2 === now?.date && minutes(r.time[0]) > now.minutes);
  const first = rows[0]?.time[0], last = rows.reduce((end, r) => minutes(r.time[1]) > minutes(end) ? r.time[1] : end, "00:00");
  const nextAvailable = rows.length ? null : nextScheduledLesson(school, { date: date2, time: "00:00", minutes: -1, seconds: 0 }, target);
  const count = rows.length, word = count % 10 === 1 && count % 100 !== 11 ? "\u0443\u0440\u043E\u043A" : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? "\u0443\u0440\u043E\u043A\u0438" : "\u0443\u0440\u043E\u043A\u0456\u0432";
  const remaining = now && next ? secondsUntil(next.date, next.time[0], now) : 0;
  const tomorrow = now ? new Date((/* @__PURE__ */ new Date(now.date + "T12:00:00Z")).getTime() + 864e5).toISOString().slice(0, 10) : "";
  const focusWhen = focus ? (focus.date === now?.date ? "\u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456" : focus.date === tomorrow ? "\u0437\u0430\u0432\u0442\u0440\u0430" : fullDate(focus.date)) + `, ${focus.time[0]}` : "";
  return /* @__PURE__ */ jsxs5("div", { className: "compact-day", children: [
    /* @__PURE__ */ jsxs5("section", { className: "live-card focus-card compact-focus", "aria-label": "\u0417\u0430\u0440\u0430\u0437 \u0456 \u0434\u0430\u043B\u0456", children: [
      /* @__PURE__ */ jsxs5("div", { className: "live-card-head", children: [
        /* @__PURE__ */ jsxs5("span", { children: [
          /* @__PURE__ */ jsx5("span", { className: "live-dot" }),
          current.length ? `\u0417\u0430\u0440\u0430\u0437 \xB7 ${now?.time || "\u2014"}` : focus ? `\u0414\u0430\u043B\u0456 \xB7 ${focusWhen}` : "\u0414\u0430\u043B\u0456"
        ] }),
        focus && /* @__PURE__ */ jsx5("span", { className: "focus-countdown", children: current.length && now ? `\u0414\u043E \u043A\u0456\u043D\u0446\u044F ${durationLabel(secondsUntil(now.date, focus.time[1], now))}` : now ? `\u0427\u0435\u0440\u0435\u0437 ${durationLabel(remaining)}` : "\u2014" })
      ] }),
      /* @__PURE__ */ jsxs5("div", { className: "compact-focus-body", children: [
        /* @__PURE__ */ jsxs5("div", { children: [
          /* @__PURE__ */ jsx5("h2", { children: focus ? teacherMode ? `${focus.c} \u043A\u043B\u0430\u0441` : focus.lesson.subject : "\u041D\u0430\u0439\u0431\u043B\u0438\u0436\u0447\u0438\u0445 \u0443\u0440\u043E\u043A\u0456\u0432 \u043D\u0435\u043C\u0430\u0454" }),
          focus && /* @__PURE__ */ jsxs5("p", { children: [
            teacherMode ? focus.lesson.subject : `${focus.c} \u043A\u043B\u0430\u0441`,
            " \xB7 ",
            focus.time.join("\u2013"),
            " \xB7 \u043A\u0430\u0431\u0456\u043D\u0435\u0442 ",
            focus.lesson.room || "\u043D\u0435 \u0432\u043A\u0430\u0437\u0430\u043D\u043E"
          ] })
        ] }),
        focus && focus.date !== date2 && rows.length > 0 && /* @__PURE__ */ jsxs5("button", { className: "secondary-button", onClick: () => onOpenDate(focus.date), children: [
          "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0434\u0435\u043D\u044C",
          /* @__PURE__ */ jsx5(ArrowRight, { size: 16 })
        ] })
      ] }),
      focus && now && current.length > 0 && /* @__PURE__ */ jsx5("progress", { className: "focus-live-progress", "aria-label": "\u0427\u0430\u0441 \u043F\u043E\u0442\u043E\u0447\u043D\u043E\u0433\u043E \u0443\u0440\u043E\u043A\u0443", max: (minutes(focus.time[1]) - minutes(focus.time[0])) * 60, value: now.minutes * 60 + now.seconds - minutes(focus.time[0]) * 60 }),
      current.length > 1 && /* @__PURE__ */ jsxs5("p", { className: "conflict", children: [
        "\u041E\u0434\u043D\u043E\u0447\u0430\u0441\u043D\u043E ",
        current.length,
        " \u0443\u0440\u043E\u043A\u0438 \u2014 \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F"
      ] }),
      current.length > 0 && next && /* @__PURE__ */ jsxs5("p", { className: "compact-next", children: [
        "\u0414\u0430\u043B\u0456: ",
        teacherMode ? `${next.c} \u043A\u043B\u0430\u0441 \xB7 ` : "",
        next.lesson.subject,
        " \xB7 ",
        next.time[0],
        next.date !== now?.date && ` \xB7 ${fullDate(next.date)}`
      ] })
    ] }),
    /* @__PURE__ */ jsxs5("section", { className: "panel timeline-panel", children: [
      /* @__PURE__ */ jsxs5("div", { className: "panel-heading", children: [
        /* @__PURE__ */ jsxs5("div", { children: [
          /* @__PURE__ */ jsx5("h2", { children: teacherMode ? "\u0420\u043E\u0437\u043A\u043B\u0430\u0434 \u0443\u0447\u0438\u0442\u0435\u043B\u044F" : `${"classId" in target ? target.classId : ""} \u043A\u043B\u0430\u0441` }),
          /* @__PURE__ */ jsx5("p", { children: fullDate(date2) })
        ] }),
        /* @__PURE__ */ jsxs5("span", { className: "day-total-chip", children: [
          count,
          " ",
          word,
          first && ` \xB7 ${first}\u2013${last}`
        ] })
      ] }),
      rows.length ? /* @__PURE__ */ jsx5("ol", { className: "day-timeline", children: timeline.map((item, k) => {
        if (item.kind === "gap") return /* @__PURE__ */ jsx5("li", { className: `timeline-gap ${item.duration > 25 ? "is-window" : ""}`, children: /* @__PURE__ */ jsxs5("span", { children: [
          item.duration > 25 ? "\u0412\u0456\u043A\u043D\u043E" : "\u041F\u0435\u0440\u0435\u0440\u0432\u0430",
          " \xB7 ",
          item.duration,
          " \u0445\u0432"
        ] }) }, "gap" + k);
        const r = item.row, active = date2 === now?.date && minutes(r.time[0]) <= now.minutes && now.minutes < minutes(r.time[1]), upcoming = r === nextOnDate, completed = date2 === now?.date && now.minutes >= minutes(r.time[1]);
        const change = lessonChange(school, r.c, date2, r.slot), teacher = !teacherMode ? lessonTeacher(school, r.lesson, r.c) : null, number = numbers[lessonNumberKey(r.c, date2, r.slot)];
        return /* @__PURE__ */ jsx5("li", { className: `timeline-entry tone-${subjectTone(r.lesson.subject)} ${active ? "is-current" : upcoming ? "is-next" : ""}`, children: /* @__PURE__ */ jsxs5("details", { className: "timeline-card compact-lesson", children: [
          /* @__PURE__ */ jsxs5("summary", { "aria-label": `${r.c} \u043A\u043B\u0430\u0441, ${r.lesson.subject}, ${r.time.join("\u2013")}, ${r.slot + 1}-\u0439 \u0443\u0440\u043E\u043A. \u0414\u0435\u0442\u0430\u043B\u0456`, children: [
            /* @__PURE__ */ jsx5("span", { className: "slot-badge", children: r.slot + 1 }),
            /* @__PURE__ */ jsxs5("span", { className: "compact-lesson-time", children: [
              r.time[0],
              "\u2013",
              r.time[1],
              active ? /* @__PURE__ */ jsxs5("small", { children: [
                "\u0422\u0440\u0438\u0432\u0430\u0454 \xB7 ",
                now && countdownTo(r.time[1], now)
              ] }) : upcoming ? /* @__PURE__ */ jsx5("small", { children: "\u0414\u0430\u043B\u0456" }) : completed ? /* @__PURE__ */ jsx5(Check, { size: 15, "aria-label": "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E" }) : null
            ] }),
            /* @__PURE__ */ jsxs5("span", { className: "compact-lesson-main", children: [
              /* @__PURE__ */ jsx5("strong", { children: teacherMode ? `${r.c} \u043A\u043B\u0430\u0441` : r.lesson.subject }),
              /* @__PURE__ */ jsxs5("span", { className: "compact-lesson-meta", children: [
                teacherMode && /* @__PURE__ */ jsx5("span", { className: "subject-chip", children: r.lesson.subject }),
                /* @__PURE__ */ jsxs5("span", { children: [
                  "\u041A\u0430\u0431\u0456\u043D\u0435\u0442 ",
                  r.lesson.room || "\u043D\u0435 \u0432\u043A\u0430\u0437\u0430\u043D\u043E"
                ] }),
                r.lesson.group && /* @__PURE__ */ jsx5("span", { className: "group", children: r.lesson.group === "\u0423\u0441\u0456" ? "\u0423\u0441\u0456 \u0433\u0440\u0443\u043F\u0438" : `\u0413\u0440\u0443\u043F\u0430 ${r.lesson.group}` }),
                r.lesson.note && /* @__PURE__ */ jsx5("span", { className: "group", children: r.lesson.note }),
                change && /* @__PURE__ */ jsx5("span", { className: "pill amber", children: "\u0417\u043C\u0456\u043D\u0438" })
              ] })
            ] }),
            /* @__PURE__ */ jsx5(ChevronDown, { size: 16, className: "lesson-chevron" }),
            active && now && /* @__PURE__ */ jsx5("progress", { className: "row-live-progress", "aria-label": `\u041F\u0440\u043E\u0433\u0440\u0435\u0441 ${r.slot + 1}-\u0433\u043E \u0443\u0440\u043E\u043A\u0443`, max: minutes(r.time[1]) - minutes(r.time[0]), value: now.minutes - minutes(r.time[0]) }),
            item.conflict && teacherMode && /* @__PURE__ */ jsx5("span", { className: "conflict compact-conflict", children: "\u041E\u0434\u043D\u043E\u0447\u0430\u0441\u043D\u0456 \u0443\u0440\u043E\u043A\u0438 \u2014 \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F" })
          ] }),
          /* @__PURE__ */ jsxs5("div", { className: "compact-lesson-details", children: [
            /* @__PURE__ */ jsxs5("p", { children: [
              r.slot + 1,
              "-\u0439 \u0443\u0440\u043E\u043A",
              number && ` \xB7 \u2116${number} \u0437\u0430 \u0441\u0435\u043C\u0435\u0441\u0442\u0440`
            ] }),
            teacher && /* @__PURE__ */ jsx5("p", { children: teacher.name }),
            change && /* @__PURE__ */ jsxs5("p", { children: [
              describeLesson(change.before),
              " \u2192 ",
              describeLesson(change.after)
            ] }),
            "classId" in target && /* @__PURE__ */ jsxs5("p", { children: [
              "\u0425\u0430\u0440\u0447\u0443\u0432\u0430\u043D\u043D\u044F: ",
              meal(target.classId).join("\u2013")
            ] }),
            !teacher && teacherMode && !change && !number && /* @__PURE__ */ jsxs5("p", { children: [
              r.lesson.subject,
              " \xB7 ",
              r.c,
              " \u043A\u043B\u0430\u0441 \xB7 \u043A\u0430\u0431\u0456\u043D\u0435\u0442 ",
              r.lesson.room || "\u043D\u0435 \u0432\u043A\u0430\u0437\u0430\u043D\u043E"
            ] })
          ] })
        ] }) }, r.c + "-" + r.slot);
      }) }) : /* @__PURE__ */ jsxs5("div", { className: "empty helpful-empty", children: [
        /* @__PURE__ */ jsx5("h3", { children: "\u041E\u0431\u0435\u0440\u0456\u0442\u044C \u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u0439 \u0434\u0435\u043D\u044C" }),
        nextAvailable ? /* @__PURE__ */ jsxs5(Fragment3, { children: [
          /* @__PURE__ */ jsxs5("p", { children: [
            "\u041D\u0430\u0439\u0431\u043B\u0438\u0436\u0447\u0435 \u0437\u0430\u043D\u044F\u0442\u0442\u044F: ",
            nextAvailable.lesson.subject,
            " \xB7 ",
            nextAvailable.time[0],
            " \xB7 ",
            fullDate(nextAvailable.date)
          ] }),
          /* @__PURE__ */ jsxs5("button", { className: "primary-button", onClick: () => onOpenDate(nextAvailable.date), children: [
            "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0434\u043E ",
            destinationDay(nextAvailable.date),
            /* @__PURE__ */ jsx5(ArrowRight, { size: 17 })
          ] })
        ] }) : /* @__PURE__ */ jsx5("p", { children: "\u0414\u043B\u044F \u0446\u044C\u043E\u0433\u043E \u043A\u043B\u0430\u0441\u0443 \u0430\u0431\u043E \u0432\u0447\u0438\u0442\u0435\u043B\u044F \u0449\u0435 \u043D\u0435\u043C\u0430\u0454 \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u0438\u0445 \u0437\u0430\u043D\u044F\u0442\u044C. \u0423\u0442\u043E\u0447\u043D\u0456\u0442\u044C \u0440\u043E\u0437\u043A\u043B\u0430\u0434 \u0443 \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u0456." })
      ] })
    ] })
  ] });
}

// app/date-strip.tsx
import { CalendarDays } from "lucide-react";
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var shift = (date2, n) => {
  const d = /* @__PURE__ */ new Date(date2 + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
function DateActions({ date: date2, today, onChange }) {
  return /* @__PURE__ */ jsxs6("div", { className: "day-date-actions", children: [
    /* @__PURE__ */ jsx6("button", { className: "text-button", "aria-label": today ? `\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456, ${fullDate(today)}` : "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456", onClick: () => today && onChange(today), children: "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456" }),
    /* @__PURE__ */ jsxs6("label", { className: "date-picker calendar-icon", title: "\u041E\u0431\u0440\u0430\u0442\u0438 \u0434\u0430\u0442\u0443", children: [
      /* @__PURE__ */ jsx6(CalendarDays, { size: 19 }),
      /* @__PURE__ */ jsx6("span", { className: "sr-only", children: "\u041E\u0431\u0440\u0430\u0442\u0438 \u0434\u0430\u0442\u0443" }),
      /* @__PURE__ */ jsx6("input", { "aria-label": "\u0406\u043D\u0448\u0430 \u0434\u0430\u0442\u0430", type: "date", value: date2, onChange: (e) => e.target.value && onChange(e.target.value) })
    ] })
  ] });
}
function DateStrip({ date: date2, today, onChange, school, target }) {
  const weekday2 = (/* @__PURE__ */ new Date(date2 + "T12:00:00Z")).getUTCDay(), monday = shift(date2, -((weekday2 + 6) % 7));
  return /* @__PURE__ */ jsxs6("section", { className: "date-strip", "aria-label": "\u0414\u0430\u0442\u0438 \u0442\u0438\u0436\u043D\u044F", children: [
    /* @__PURE__ */ jsx6("div", { className: "date-strip-heading", children: /* @__PURE__ */ jsx6("span", { children: new Intl.DateTimeFormat("uk-UA", { month: "long" }).format(/* @__PURE__ */ new Date(date2 + "T12:00:00Z")) + " " + date2.slice(0, 4) }) }),
    /* @__PURE__ */ jsx6("div", { className: "date-strip-days", children: ["\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431", "\u041D\u0434"].map((day, i) => {
      const d = shift(monday, i), hasLessons = lessonsForTarget(school, d, target).length > 0;
      return /* @__PURE__ */ jsxs6("button", { className: hasLessons ? "has-lessons" : "no-lessons", "aria-label": `${fullDate(d)}${d === today ? ", \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456" : ""}${hasLessons ? ", \u0454 \u0443\u0440\u043E\u043A\u0438" : ", \u0431\u0435\u0437 \u0443\u0440\u043E\u043A\u0456\u0432"}`, title: `${hasLessons ? "\u0404 \u0443\u0440\u043E\u043A\u0438" : "\u0411\u0435\u0437 \u0443\u0440\u043E\u043A\u0456\u0432"}${d === today ? " \xB7 \u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456" : ""}`, "aria-pressed": d === date2, "aria-current": d === today ? "date" : void 0, onClick: () => onChange(d), children: [
        /* @__PURE__ */ jsx6("span", { children: day }),
        /* @__PURE__ */ jsx6("strong", { children: Number(d.slice(8)) }),
        hasLessons && /* @__PURE__ */ jsx6("i", { "aria-hidden": "true" })
      ] }, d);
    }) }),
    /* @__PURE__ */ jsxs6("p", { className: "date-legend", children: [
      /* @__PURE__ */ jsxs6("span", { children: [
        /* @__PURE__ */ jsx6("i", {}),
        "\u0404 \u0443\u0440\u043E\u043A\u0438"
      ] }),
      /* @__PURE__ */ jsxs6("span", { children: [
        /* @__PURE__ */ jsx6("b", {}),
        "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456"
      ] }),
      /* @__PURE__ */ jsxs6("span", { children: [
        /* @__PURE__ */ jsx6("em", {}),
        "\u041E\u0431\u0440\u0430\u043D\u043E"
      ] })
    ] })
  ] });
}

// app/target-picker.tsx
import { useRef as useRef3, useState as useState5 } from "file:///C:/Users/0009/Documents/ChatGPT/school_rozklad/site/.sites-runtime/editor-hooks.mjs";
import { GraduationCap, UsersRound, ChevronDown as ChevronDown2, Search } from "lucide-react";
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
function TargetPicker({ teachers, audience, classId, teacherId, onSelect }) {
  const [query, setQuery] = useState5(""), ref = useRef3(null);
  const label = audience === "class" ? `${classId} \u043A\u043B\u0430\u0441` : teachers.find((t) => t.id === teacherId)?.name || "\u041E\u0431\u0435\u0440\u0456\u0442\u044C \u043A\u043B\u0430\u0441 \u0430\u0431\u043E \u0432\u0447\u0438\u0442\u0435\u043B\u044F";
  const normalized = query.trim().toLocaleLowerCase("uk-UA");
  const foundClasses = classes.filter((c) => `${c} \u043A\u043B\u0430\u0441`.toLocaleLowerCase("uk-UA").includes(normalized)), foundTeachers = teachers.filter((t) => t.name.toLocaleLowerCase("uk-UA").includes(normalized));
  function pick(kind, id) {
    onSelect(kind, id);
    setQuery("");
    if (ref.current) ref.current.open = false;
  }
  return /* @__PURE__ */ jsx7("div", { className: "target-picker-wrap", children: /* @__PURE__ */ jsxs7("details", { className: "target-picker", ref, onKeyDown: (e) => {
    if (e.key === "Escape" && ref.current) ref.current.open = false;
  }, children: [
    /* @__PURE__ */ jsxs7("summary", { title: "\u0412\u0430\u0448 \u0432\u0438\u0431\u0456\u0440 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u0454\u0442\u044C\u0441\u044F \u043D\u0430 \u0446\u044C\u043E\u043C\u0443 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u0457", children: [
      audience === "class" ? /* @__PURE__ */ jsx7(GraduationCap, { size: 18 }) : /* @__PURE__ */ jsx7(UsersRound, { size: 18 }),
      /* @__PURE__ */ jsx7("span", { children: label }),
      /* @__PURE__ */ jsx7(ChevronDown2, { size: 16 })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "target-picker-menu", children: [
      /* @__PURE__ */ jsxs7("label", { children: [
        /* @__PURE__ */ jsx7(Search, { size: 17 }),
        /* @__PURE__ */ jsx7("input", { type: "search", "aria-label": "\u041F\u043E\u0448\u0443\u043A \u043A\u043B\u0430\u0441\u0443 \u0430\u0431\u043E \u0432\u0447\u0438\u0442\u0435\u043B\u044F", placeholder: "\u041A\u043B\u0430\u0441 \u0430\u0431\u043E \u043F\u0440\u0456\u0437\u0432\u0438\u0449\u0435\u2026", value: query, onChange: (e) => setQuery(e.target.value) })
      ] }),
      foundClasses.length > 0 && /* @__PURE__ */ jsxs7("div", { children: [
        /* @__PURE__ */ jsx7("h3", { children: "\u041A\u043B\u0430\u0441\u0438" }),
        /* @__PURE__ */ jsx7("div", { className: "picker-classes", children: foundClasses.map((c) => /* @__PURE__ */ jsx7("button", { "aria-pressed": audience === "class" && c === classId, onClick: () => pick("class", c), children: c }, c)) })
      ] }),
      foundTeachers.length > 0 && /* @__PURE__ */ jsxs7("div", { children: [
        /* @__PURE__ */ jsx7("h3", { children: "\u0423\u0447\u0438\u0442\u0435\u043B\u0456" }),
        foundTeachers.map((t) => /* @__PURE__ */ jsxs7("button", { className: "picker-teacher", "aria-pressed": audience === "teacher" && t.id === teacherId, onClick: () => pick("teacher", t.id), children: [
          /* @__PURE__ */ jsx7(UsersRound, { size: 16 }),
          t.name
        ] }, t.id))
      ] }),
      !foundClasses.length && !foundTeachers.length && /* @__PURE__ */ jsx7("p", { children: "\u041D\u0456\u0447\u043E\u0433\u043E \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E. \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0456\u043D\u0448\u0438\u0439 \u0437\u0430\u043F\u0438\u0442." })
    ] })
  ] }) });
}

// lib/room-conflicts.ts
function roomConflicts(s, dates) {
  return [...new Set(dates)].flatMap((date2) => {
    const lessons = classes.flatMap((c) => dayLessons(s, c, date2).flatMap((l, slot) => l?.room ? [{ c, slot, subject: l.subject, rooms: l.room.toUpperCase().replace(/\s/g, "").split("/"), time: classBells(c)[slot] }] : []));
    return lessons.flatMap((a, i) => lessons.slice(i + 1).flatMap((b) => {
      const shared = a.rooms.filter((r) => b.rooms.includes(r));
      return shared.length && minutes(a.time[0]) < minutes(b.time[1]) && minutes(b.time[0]) < minutes(a.time[1]) ? [{ date: date2, room: shared.join("/"), classes: [a.c, b.c], subjects: [a.subject, b.subject], time: [a.time.join("\u2013"), b.time.join("\u2013")] }] : [];
    }));
  });
}

// app/school-calendar.tsx
import { CalendarDays as CalendarDays2, Plus, X } from "lucide-react";
import { Fragment as Fragment4, jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
var formatDate = (d) => new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(/* @__PURE__ */ new Date(d + "T12:00:00Z"));
function CalendarView({ calendar: calendar2, c, onOpenDate }) {
  const months = [];
  const cursor = /* @__PURE__ */ new Date(calendar2.start.slice(0, 7) + "-01T12:00:00Z");
  while (cursor.toISOString().slice(0, 7) <= calendar2.end.slice(0, 7)) {
    months.push(cursor.toISOString().slice(0, 7));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return /* @__PURE__ */ jsxs8(Fragment4, { children: [
    /* @__PURE__ */ jsxs8("section", { className: "panel calendar-intro", children: [
      /* @__PURE__ */ jsxs8("div", { className: "calendar-title", children: [
        /* @__PURE__ */ jsxs8("h2", { children: [
          "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440 \u0443\u0447\u0438\u0442\u0435\u043B\u044F \xB7 ",
          calendar2.start.slice(0, 4),
          "/",
          calendar2.end.slice(0, 4)
        ] }),
        /* @__PURE__ */ jsx8("span", { className: calendar2.confirmed ? "pill green" : "pill amber", children: calendar2.confirmed ? "\u0417\u0432\u0456\u0440\u0435\u043D\u043E \u0437 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u0435\u043C \u0433\u0456\u043C\u043D\u0430\u0437\u0456\u0457" : "\u041E\u0440\u0456\u0454\u043D\u0442\u043E\u0432\u043D\u0456 \u0434\u0430\u0442\u0438" })
      ] }),
      /* @__PURE__ */ jsx8("p", { children: "\u041D\u0430 \u043A\u0430\u043D\u0456\u043A\u0443\u043B\u0430\u0445 \u0456 \u0432 \u043D\u0435\u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0456 \u0434\u043D\u0456 \u0443\u0440\u043E\u043A\u0438 \u043D\u0435 \u043F\u043E\u043A\u0430\u0437\u0443\u044E\u0442\u044C\u0441\u044F \u0439 \u043D\u0435 \u0437\u0431\u0456\u043B\u044C\u0448\u0443\u044E\u0442\u044C \u043D\u043E\u043C\u0435\u0440 \u0437\u0430\u043D\u044F\u0442\u0442\u044F. \u041D\u0443\u043C\u0435\u0440\u0430\u0446\u0456\u044F \u043F\u043E\u0447\u0438\u043D\u0430\u0454\u0442\u044C\u0441\u044F \u0437 \u21161 \u0443 \u043A\u043E\u0436\u043D\u043E\u043C\u0443 \u0441\u0435\u043C\u0435\u0441\u0442\u0440\u0456 \u043E\u043A\u0440\u0435\u043C\u043E \u0434\u043B\u044F \u043A\u043E\u0436\u043D\u043E\u0433\u043E \u043A\u043B\u0430\u0441\u0443, \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u0430 \u0442\u0430 \u0433\u0440\u0443\u043F\u0438." }),
      /* @__PURE__ */ jsx8("div", { className: "calendar-periods", children: calendar2.semesters.map((p, i) => /* @__PURE__ */ jsxs8("div", { children: [
        /* @__PURE__ */ jsx8("strong", { children: p.label }),
        /* @__PURE__ */ jsxs8("span", { children: [
          formatDate(p.start),
          " \u2014 ",
          formatDate(p.end)
        ] })
      ] }, i)) }),
      /* @__PURE__ */ jsx8("div", { className: "holiday-periods", children: calendar2.breaks.map((p, i) => /* @__PURE__ */ jsxs8("div", { children: [
        /* @__PURE__ */ jsx8("strong", { children: p.label }),
        /* @__PURE__ */ jsxs8("span", { children: [
          formatDate(p.start),
          " \u2014 ",
          formatDate(p.end)
        ] }),
        /* @__PURE__ */ jsx8("small", { children: p.classes.length ? `${p.classes.join(", ")} \u043A\u043B\u0430\u0441\u0438` : "\u0423\u0441\u0456 \u043A\u043B\u0430\u0441\u0438" })
      ] }, i)) }),
      calendar2.daysOff.length > 0 && /* @__PURE__ */ jsx8("div", { className: "holiday-periods", children: calendar2.daysOff.map((p, i) => /* @__PURE__ */ jsxs8("div", { children: [
        /* @__PURE__ */ jsx8("strong", { children: p.label }),
        /* @__PURE__ */ jsx8("span", { children: formatDate(p.date) }),
        /* @__PURE__ */ jsx8("small", { children: p.classes.length ? `${p.classes.join(", ")} \u043A\u043B\u0430\u0441\u0438` : "\u0423\u0441\u0456 \u043A\u043B\u0430\u0441\u0438" })
      ] }, i)) }),
      /* @__PURE__ */ jsxs8("p", { className: "calendar-source", children: [
        calendar2.sourceUrl && /* @__PURE__ */ jsx8("a", { href: calendar2.sourceUrl, target: "_blank", rel: "noreferrer", children: "\u0414\u0436\u0435\u0440\u0435\u043B\u043E: \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440 \u0443\u0447\u0438\u0442\u0435\u043B\u044F 2026\u20132027" }),
        " ",
        !calendar2.confirmed && /* @__PURE__ */ jsx8("span", { children: "\u041A\u0430\u043D\u0456\u043A\u0443\u043B\u0438 \u0432\u0437\u044F\u0442\u043E \u0437 \u043E\u0440\u0456\u0454\u043D\u0442\u043E\u0432\u043D\u043E\u0433\u043E \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044F \xAB\u041E\u0441\u0432\u0456\u0442\u044F\u043D\u0438\u043A\u0430\xBB. \u041C\u0435\u0436\u0456 \u0441\u0435\u043C\u0435\u0441\u0442\u0440\u0456\u0432 \u043D\u0430\u043B\u0430\u0448\u0442\u043E\u0432\u0430\u043D\u043E \u0437\u0430 \u0437\u0438\u043C\u043E\u0432\u043E\u044E \u043F\u0435\u0440\u0435\u0440\u0432\u043E\u044E; \u0457\u0445 \u0441\u043B\u0456\u0434 \u0443\u0442\u043E\u0447\u043D\u0438\u0442\u0438 \u0437\u0430 \u0440\u0456\u0448\u0435\u043D\u043D\u044F\u043C \u0433\u0456\u043C\u043D\u0430\u0437\u0456\u0457." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "calendar-legend", children: [
      /* @__PURE__ */ jsxs8("span", { children: [
        /* @__PURE__ */ jsx8("i", { className: "teaching-color" }),
        "\u041D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u0439 \u0434\u0435\u043D\u044C"
      ] }),
      /* @__PURE__ */ jsxs8("span", { children: [
        /* @__PURE__ */ jsx8("i", { className: "holiday-color" }),
        "\u041A\u0430\u043D\u0456\u043A\u0443\u043B\u0438 / \u043D\u0435\u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u0439 \u0434\u0435\u043D\u044C"
      ] }),
      /* @__PURE__ */ jsxs8("span", { children: [
        /* @__PURE__ */ jsx8("i", { className: "weekend-color" }),
        "\u0412\u0438\u0445\u0456\u0434\u043D\u0438\u0439"
      ] })
    ] }),
    /* @__PURE__ */ jsx8("div", { className: "calendar-months", children: months.map((month) => {
      const first = /* @__PURE__ */ new Date(month + "-01T12:00:00Z"), lead = (first.getUTCDay() + 6) % 7, total = new Date(first.getUTCFullYear(), first.getUTCMonth() + 1, 0).getDate();
      return /* @__PURE__ */ jsxs8("section", { className: "panel month-panel", children: [
        /* @__PURE__ */ jsx8("h3", { children: new Intl.DateTimeFormat("uk-UA", { month: "long", year: "numeric", timeZone: "UTC" }).format(first) }),
        /* @__PURE__ */ jsxs8("div", { className: "month-grid", children: [
          ["\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431", "\u041D\u0434"].map((d) => /* @__PURE__ */ jsx8("span", { className: "weekday-label", children: d }, d)),
          Array.from({ length: lead }, (_, i) => /* @__PURE__ */ jsx8("span", {}, `blank-${i}`)),
          Array.from({ length: total }, (_, i) => {
            const date2 = month + "-" + String(i + 1).padStart(2, "0"), reason = nonTeachingReason(calendar2, c, date2), holiday = calendar2.breaks.find((p) => date2 >= p.start && date2 <= p.end && (!p.classes.length || p.classes.includes(c))) || calendar2.daysOff.find((p) => p.date === date2 && (!p.classes.length || p.classes.includes(c)));
            return /* @__PURE__ */ jsx8("button", { disabled: date2 < calendar2.start || date2 > calendar2.end, className: holiday ? "holiday-day" : reason ? "weekend-day" : "teaching-day", title: `${formatDate(date2)} \xB7 ${holiday?.label || reason || "\u041D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u0439 \u0434\u0435\u043D\u044C"}`, "aria-label": `${formatDate(date2)} \xB7 ${holiday?.label || reason || "\u041D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u0439 \u0434\u0435\u043D\u044C"}`, onClick: () => onOpenDate(date2), children: i + 1 }, date2);
          })
        ] })
      ] }, month);
    }) })
  ] });
}
function CalendarEditor({ calendar: calendar2, onChange }) {
  function update(fn) {
    const copy = structuredClone(calendar2);
    fn(copy);
    onChange(copy);
  }
  const scope = (value) => value.split(",").map((x) => x.trim()).filter(Boolean);
  return /* @__PURE__ */ jsxs8("section", { className: "panel calendar-editor", children: [
    /* @__PURE__ */ jsxs8("h2", { children: [
      /* @__PURE__ */ jsx8(CalendarDays2, { size: 23 }),
      "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440 \u0456 \u0441\u0435\u043C\u0435\u0441\u0442\u0440\u0438"
    ] }),
    /* @__PURE__ */ jsx8("p", { className: "muted", children: "\u0417\u043C\u0456\u043D\u0438 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044F \u043F\u0435\u0440\u0435\u0440\u0430\u0445\u0443\u044E\u0442\u044C \u043D\u043E\u043C\u0435\u0440\u0438 \u0443\u0440\u043E\u043A\u0456\u0432. \u041F\u043E\u0440\u043E\u0436\u043D\u0456\u0439 \u043F\u0435\u0440\u0435\u043B\u0456\u043A \u043A\u043B\u0430\u0441\u0456\u0432 \u043E\u0437\u043D\u0430\u0447\u0430\u0454 \u0432\u0441\u0456 \u043A\u043B\u0430\u0441\u0438. \u0414\u0430\u0442\u0438 \u043A\u0430\u043D\u0456\u043A\u0443\u043B \u0456 \u043C\u0435\u0436\u0456 \u0441\u0435\u043C\u0435\u0441\u0442\u0440\u0456\u0432 \u043C\u043E\u0436\u043D\u0430 \u0443\u0442\u043E\u0447\u043D\u0438\u0442\u0438 \u0437\u0430 \u0440\u0456\u0448\u0435\u043D\u043D\u044F\u043C \u0433\u0456\u043C\u043D\u0430\u0437\u0456\u0457." }),
    /* @__PURE__ */ jsxs8("div", { className: "calendar-year-fields", children: [
      /* @__PURE__ */ jsxs8("label", { children: [
        "\u041F\u043E\u0447\u0430\u0442\u043E\u043A \u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0440\u043E\u043A\u0443",
        /* @__PURE__ */ jsx8("input", { type: "date", value: calendar2.start, onChange: (e) => e.target.value && update((c) => {
          c.start = e.target.value;
        }) })
      ] }),
      /* @__PURE__ */ jsxs8("label", { children: [
        "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044F \u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0440\u043E\u043A\u0443",
        /* @__PURE__ */ jsx8("input", { type: "date", value: calendar2.end, onChange: (e) => e.target.value && update((c) => {
          c.end = e.target.value;
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx8("h3", { children: "\u0421\u0435\u043C\u0435\u0441\u0442\u0440\u0438 \xB7 \u043D\u043E\u043C\u0435\u0440 \u0443\u0440\u043E\u043A\u0443 \u043F\u043E\u0447\u0438\u043D\u0430\u0454\u0442\u044C\u0441\u044F \u0437 \u21161" }),
    calendar2.semesters.map((p, i) => /* @__PURE__ */ jsxs8("div", { className: "calendar-edit-row", children: [
      /* @__PURE__ */ jsxs8("label", { children: [
        "\u041D\u0430\u0437\u0432\u0430",
        /* @__PURE__ */ jsx8("input", { value: p.label, onChange: (e) => update((c) => {
          c.semesters[i].label = e.target.value;
        }) })
      ] }),
      /* @__PURE__ */ jsxs8("label", { children: [
        "\u041F\u043E\u0447\u0430\u0442\u043E\u043A",
        /* @__PURE__ */ jsx8("input", { type: "date", value: p.start, onChange: (e) => e.target.value && update((c) => {
          c.semesters[i].start = e.target.value;
        }) })
      ] }),
      /* @__PURE__ */ jsxs8("label", { children: [
        "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044F",
        /* @__PURE__ */ jsx8("input", { type: "date", value: p.end, onChange: (e) => e.target.value && update((c) => {
          c.semesters[i].end = e.target.value;
        }) })
      ] })
    ] }, i)),
    /* @__PURE__ */ jsx8("h3", { children: "\u041A\u0430\u043D\u0456\u043A\u0443\u043B\u0438" }),
    calendar2.breaks.map((p, i) => /* @__PURE__ */ jsxs8("div", { className: "calendar-edit-row has-scope", children: [
      /* @__PURE__ */ jsxs8("label", { children: [
        "\u041D\u0430\u0437\u0432\u0430",
        /* @__PURE__ */ jsx8("input", { value: p.label, onChange: (e) => update((c) => {
          c.breaks[i].label = e.target.value;
        }) })
      ] }),
      /* @__PURE__ */ jsxs8("label", { children: [
        "\u041F\u043E\u0447\u0430\u0442\u043E\u043A",
        /* @__PURE__ */ jsx8("input", { type: "date", value: p.start, onChange: (e) => e.target.value && update((c) => {
          c.breaks[i].start = e.target.value;
        }) })
      ] }),
      /* @__PURE__ */ jsxs8("label", { children: [
        "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044F",
        /* @__PURE__ */ jsx8("input", { type: "date", value: p.end, onChange: (e) => e.target.value && update((c) => {
          c.breaks[i].end = e.target.value;
        }) })
      ] }),
      /* @__PURE__ */ jsxs8("label", { children: [
        "\u041A\u043B\u0430\u0441\u0438 \u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443",
        /* @__PURE__ */ jsx8("input", { value: p.classes.join(", "), placeholder: "\u0423\u0441\u0456 \u043A\u043B\u0430\u0441\u0438", onChange: (e) => update((c) => {
          c.breaks[i].classes = scope(e.target.value);
        }) })
      ] }),
      /* @__PURE__ */ jsx8("button", { "aria-label": `\u041F\u0440\u0438\u0431\u0440\u0430\u0442\u0438 ${p.label}`, onClick: () => update((c) => {
        c.breaks.splice(i, 1);
      }), children: /* @__PURE__ */ jsx8(X, { size: 18 }) })
    ] }, i)),
    /* @__PURE__ */ jsxs8("button", { className: "secondary-button", onClick: () => update((c) => {
      c.breaks.push({ label: "\u041A\u0430\u043D\u0456\u043A\u0443\u043B\u0438", start: calendar2.start, end: calendar2.start, classes: [] });
    }), children: [
      /* @__PURE__ */ jsx8(Plus, { size: 17 }),
      "\u0414\u043E\u0434\u0430\u0442\u0438 \u043A\u0430\u043D\u0456\u043A\u0443\u043B\u0438"
    ] }),
    /* @__PURE__ */ jsx8("h3", { children: "\u041E\u043A\u0440\u0435\u043C\u0456 \u043D\u0435\u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0456 \u0434\u043D\u0456" }),
    calendar2.daysOff.map((p, i) => /* @__PURE__ */ jsxs8("div", { className: "calendar-edit-row off-day-row", children: [
      /* @__PURE__ */ jsxs8("label", { children: [
        "\u041F\u0440\u0438\u0447\u0438\u043D\u0430",
        /* @__PURE__ */ jsx8("input", { value: p.label, onChange: (e) => update((c) => {
          c.daysOff[i].label = e.target.value;
        }) })
      ] }),
      /* @__PURE__ */ jsxs8("label", { children: [
        "\u0414\u0430\u0442\u0430",
        /* @__PURE__ */ jsx8("input", { type: "date", value: p.date, onChange: (e) => e.target.value && update((c) => {
          c.daysOff[i].date = e.target.value;
        }) })
      ] }),
      /* @__PURE__ */ jsxs8("label", { children: [
        "\u041A\u043B\u0430\u0441\u0438 \u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443",
        /* @__PURE__ */ jsx8("input", { value: p.classes.join(", "), placeholder: "\u0423\u0441\u0456 \u043A\u043B\u0430\u0441\u0438", onChange: (e) => update((c) => {
          c.daysOff[i].classes = scope(e.target.value);
        }) })
      ] }),
      /* @__PURE__ */ jsx8("button", { "aria-label": `\u041F\u0440\u0438\u0431\u0440\u0430\u0442\u0438 \u043D\u0435\u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u0439 \u0434\u0435\u043D\u044C ${p.date}`, onClick: () => update((c) => {
        c.daysOff.splice(i, 1);
      }), children: /* @__PURE__ */ jsx8(X, { size: 18 }) })
    ] }, i)),
    /* @__PURE__ */ jsxs8("button", { className: "secondary-button", onClick: () => update((c) => {
      c.daysOff.push({ label: "\u041D\u0435\u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u0439 \u0434\u0435\u043D\u044C", date: calendar2.start, classes: [] });
    }), children: [
      /* @__PURE__ */ jsx8(Plus, { size: 17 }),
      "\u0414\u043E\u0434\u0430\u0442\u0438 \u043D\u0435\u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u0439 \u0434\u0435\u043D\u044C"
    ] }),
    /* @__PURE__ */ jsxs8("p", { className: "muted", children: [
      "\u0414\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u0456 \u043A\u043B\u0430\u0441\u0438: ",
      classes.join(", "),
      ". \u0421\u0432\u044F\u0442\u043A\u043E\u0432\u0456 \u0434\u0430\u0442\u0438 \u043D\u0435 \u0432\u0438\u043A\u043B\u044E\u0447\u0430\u044E\u0442\u044C\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u2014 \u0434\u043E\u0434\u0430\u0439\u0442\u0435 \u0442\u0456 \u0434\u043D\u0456, \u043A\u043E\u043B\u0438 \u0433\u0456\u043C\u043D\u0430\u0437\u0456\u044F \u043D\u0435 \u043D\u0430\u0432\u0447\u0430\u0454\u0442\u044C\u0441\u044F."
    ] }),
    /* @__PURE__ */ jsxs8("label", { className: "calendar-source-field", children: [
      "\u041F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F \u043D\u0430 \u0434\u0436\u0435\u0440\u0435\u043B\u043E",
      /* @__PURE__ */ jsx8("input", { type: "url", value: calendar2.sourceUrl, onChange: (e) => update((c) => {
        c.sourceUrl = e.target.value;
      }) })
    ] }),
    /* @__PURE__ */ jsxs8("label", { className: "calendar-confirmed", children: [
      /* @__PURE__ */ jsx8("input", { type: "checkbox", checked: calendar2.confirmed, onChange: (e) => update((c) => {
        c.confirmed = e.target.checked;
      }) }),
      "\u0414\u0430\u0442\u0438 \u0437\u0432\u0456\u0440\u0435\u043D\u043E \u0437 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u0435\u043C \u041C\u0430\u0442\u0440\u043E\u0441\u044C\u043A\u043E\u0457 \u0433\u0456\u043C\u043D\u0430\u0437\u0456\u0457"
    ] }),
    /* @__PURE__ */ jsx8("p", { className: "muted", children: "\u0417\u043C\u0456\u043D\u0438 \u043D\u0430\u0431\u0443\u0434\u0443\u0442\u044C \u0447\u0438\u043D\u043D\u043E\u0441\u0442\u0456 \u043F\u0456\u0441\u043B\u044F \u043D\u0430\u0442\u0438\u0441\u043A\u0430\u043D\u043D\u044F \xAB\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438\xBB." })
  ] });
}

// app/schedule.tsx
import { Fragment as Fragment5, jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
var clone = (s) => JSON.parse(JSON.stringify(s));
var dateLabel = (d) => new Intl.DateTimeFormat("uk-UA", { weekday: "long", day: "numeric", month: "long" }).format(/* @__PURE__ */ new Date(d + "T12:00:00Z"));
function shift2(d, n) {
  const date2 = /* @__PURE__ */ new Date(d + "T12:00:00Z");
  date2.setUTCDate(date2.getUTCDate() + n);
  return date2.toISOString().slice(0, 10);
}
function download(name, text, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function Schedule({ canEdit = false }) {
  const [school, setSchool] = useState6(seed), [revision, setRevision] = useState6(0), [ready, setReady] = useState6(false), [error, setError] = useState6(""), [notice, setNotice] = useState6(""), [updated, setUpdated] = useState6(null);
  const [now, setNow] = useState6(null), [date2, setDate] = useState6(""), [view, setView] = useState6("day"), [audience, setAudience] = useState6("class"), [selected, setSelected] = useState6("8"), [teacherId, setTeacherId] = useState6("abrosimov");
  const [draft, setDraft] = useState6(null), [dirty, setDirty] = useState6(false), [saving, setSaving] = useState6(false), [editMode, setEditMode] = useState6("changes"), [editDay, setEditDay] = useState6(0), [photo, setPhoto] = useState6(""), [fileName, setFileName] = useState6("");
  const [group, setGroup] = useState6(""), [preferencesReady, setPreferencesReady] = useState6(false);
  const [teacherName, setTeacherName] = useState6(""), [ruleSubject, setRuleSubject] = useState6("\u0424\u0456\u0437\u0438\u043A\u0430"), [ruleClasses, setRuleClasses] = useState6(["8"]), [editTeacher, setEditTeacher] = useState6("abrosimov");
  useEffect4(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("school-preferences") || "null");
      if (saved) {
        if (classes.includes(saved.classId)) setSelected(saved.classId);
        if (saved.audience === "class" || saved.audience === "teacher") setAudience(saved.audience);
        if (typeof saved.teacherId === "string") setTeacherId(saved.teacherId);
        if (["", "I", "II"].includes(saved.group)) setGroup(saved.group);
      }
    } catch {
    }
    setPreferencesReady(true);
  }, []);
  useEffect4(() => {
    if (preferencesReady) try {
      localStorage.setItem("school-preferences", JSON.stringify({ classId: selected, teacherId, audience, group }));
    } catch {
    }
  }, [selected, teacherId, audience, group, preferencesReady]);
  const [filtersOpen, setFiltersOpen] = useState6(false);
  const draftGeneration = useRef4(0), saveInFlight = useRef4(false);
  const photoRef = useRef4("");
  const effectiveDate = date2 || now?.date || "2026-10-05";
  useEffect4(() => {
    const tick = () => {
      const t = kyivNow();
      setNow(t);
    };
    tick();
    const timer = setInterval(tick, 1e3);
    return () => clearInterval(timer);
  }, []);
  async function load() {
    setError("");
    try {
      const r = await fetch("/api/schedule", { cache: "no-store" });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || "\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0432\u0438\u043A\u043E\u043D\u0430\u0442\u0438 \u0437\u0430\u043F\u0438\u0442");
      setSchool(body.school);
      setRevision(body.revision);
      setUpdated(body.updatedAt);
      setReady(true);
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect4(() => {
    void load();
  }, []);
  useEffect4(() => () => {
    if (photoRef.current) URL.revokeObjectURL(photoRef.current);
  }, []);
  useEffect4(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const ctrl = new AbortController();
    try {
      Promise.resolve(context.registerTool({ name: "view_class_schedule", description: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0440\u043E\u0437\u043A\u043B\u0430\u0434 \u043A\u043B\u0430\u0441\u0443 \u043D\u0430 \u0434\u0430\u0442\u0443. \u041D\u0435 \u0437\u043C\u0456\u043D\u044E\u0454 \u0443\u0440\u043E\u043A\u0438.", inputSchema: { type: "object", properties: { class: { type: "string", enum: classes }, date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" } }, required: ["class", "date"], additionalProperties: false }, annotations: { readOnlyHint: true }, execute(input) {
        const p = input;
        if (!classes.includes(p.class) || !/^\d{4}-\d{2}-\d{2}$/.test(p.date) || (Number.isNaN(Date.parse(p.date)) || (/* @__PURE__ */ new Date(p.date + "T12:00:00Z")).toISOString().slice(0, 10) !== p.date)) throw new Error("\u041D\u0435\u043A\u043E\u0440\u0435\u043A\u0442\u043D\u0438\u0439 \u043A\u043B\u0430\u0441 \u0430\u0431\u043E \u0434\u0430\u0442\u0430");
        setAudience("class");
        setSelected(p.class);
        setDate(p.date);
        setView("day");
        return { class: p.class, date: p.date, lessons: dayLessons(school, p.class, p.date) };
      } }, { signal: ctrl.signal })).catch(() => {
      });
    } catch {
    }
    return () => ctrl.abort();
  }, [school]);
  const calendar2 = getCalendar(school), numberIndex = useMemo(() => buildLessonNumberIndex(school), [school]);
  const numberOf = (c, d, slot) => numberIndex[lessonNumberKey(c, d, slot)];
  const lessonTitle = (c, d, slot, l) => `${c} \xB7 ${l.subject}${numberOf(c, d, slot) ? ` (\u2116${numberOf(c, d, slot)})` : ""}`;
  const teacher = school.teachers.find((t) => t.id === teacherId), status = now ? currentStatus(school, selected, now.date, now.time, group) : null;
  const rawRows = dayLessons(school, selected, effectiveDate), rows = rawRows.map((l) => matchesGroup(l, group) ? l : null), times = classBells(selected), changed = !!school.changes[effectiveDate]?.[selected];
  function teacherRows(d) {
    return classes.flatMap((c) => dayLessons(school, c, d).flatMap((l, i) => l && lessonTeacher(school, l, c)?.id === teacherId ? [{ c, l, i, time: classBells(c)[i] }] : [])).sort((a, b) => minutes(a.time[0]) - minutes(b.time[0]) || a.c.localeCompare(b.c));
  }
  const tr = teacherRows(effectiveDate), liveTeacher = now ? teacherRows(now.date).filter((r) => now.minutes >= minutes(r.time[0]) && now.minutes < minutes(r.time[1])) : [];
  const target = audience === "class" ? { classId: selected, group } : { teacherId };
  const stats = useMemo(() => now ? lessonStatistics(school, now, target) : null, [school, now?.date, now?.minutes, audience, selected, teacherId, group]);
  const upcoming = useMemo(() => now ? nextScheduledLesson(school, now, target) : null, [school, now?.date, now?.minutes, audience, selected, teacherId, group]);
  const activeRows = stats?.active || [];
  const changesForDate = classes.flatMap((c) => Array.from({ length: classBells(c).length }, (_, i) => ({ c, i, change: lessonChange(school, c, effectiveDate, i) }))).filter(({ c, change }) => change && (audience === "class" ? c === selected && (matchesGroup(change.before, group) && matchesGroup(change.after, group) || matchesGroup(change.before, group) && !!change.before || matchesGroup(change.after, group) && !!change.after) : [change.before, change.after].some((l) => l && lessonTeacher(school, l, c)?.id === teacherId)));
  const hasSchedule = audience === "class" ? weeklyForDate(school, effectiveDate)[selected].some((day) => day.some(Boolean)) || Object.values(school.changes).some((day) => day[selected]?.some(Boolean)) : !!teacher?.rules.length || Object.values(weeklyForDate(school, effectiveDate)).some((week) => week.some((day) => day.some((l) => l?.teacherId === teacherId)));
  function restoreDraft(recovered, context) {
    if (context?.date) setDate(context.date);
    if (context?.classId) setSelected(context.classId);
    draftGeneration.current++;
    setDraft(clone(recovered));
    setDirty(true);
    setView("edit");
    setEditMode("changes");
    setNotice("\u0412\u0435\u0440\u0441\u0456\u044E \u0432\u0456\u0434\u043A\u0440\u0438\u0442\u043E \u044F\u043A \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443. \u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u0440\u043E\u0437\u043A\u043B\u0430\u0434 \u0456 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440 \u043F\u0435\u0440\u0435\u0434 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F\u043C.");
  }
  function go(v) {
    if (v === "edit" && !canEdit) return;
    if (v === "edit" && !ready) {
      setError("\u0414\u043E\u0447\u0435\u043A\u0430\u0439\u0442\u0435\u0441\u044F \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u0443 \u043F\u0435\u0440\u0435\u0434 \u0440\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u043D\u043D\u044F\u043C.");
      return;
    }
    setNotice("");
    if (v === "edit" && !draft) {
      setDraft(clone(school));
      setDirty(false);
    }
    setView(v);
  }
  function mutate(fn) {
    draftGeneration.current++;
    setDraft((prev) => {
      const s = clone(prev || school);
      fn(s);
      return s;
    });
    setDirty(true);
    setNotice("");
  }
  function editRows() {
    if (!draft) return Array(8).fill(null);
    return editMode === "weekly" ? weeklyForDate(draft, effectiveDate)[selected][editDay] : editableDayLessons(draft, selected, effectiveDate);
  }
  function editLesson(slot, key, value) {
    mutate((s) => {
      const current = editMode === "weekly" ? ensureWeeklyVersion(s, effectiveDate).weekly[selected][editDay] : editableDayLessons(s, selected, effectiveDate);
      const updated2 = [...current];
      const item = { ...updated2[slot] || { subject: "", room: "" }, [key]: value };
      updated2[slot] = item.subject.trim() ? item : null;
      if (editMode === "weekly") {
        ensureWeeklyVersion(s, effectiveDate).weekly[selected][editDay] = updated2;
      } else {
        (s.changes[effectiveDate] ??= {})[selected] = updated2;
      }
    });
  }
  async function save() {
    if (!draft || saveInFlight.current) return;
    const parsed = schoolSchema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    const generation = draftGeneration.current;
    saveInFlight.current = true;
    setSaving(true);
    setError("");
    try {
      const r = await fetch("/api/schedule", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ school: parsed.data, revision }) });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || "\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0432\u0438\u043A\u043E\u043D\u0430\u0442\u0438 \u0437\u0430\u043F\u0438\u0442");
      setSchool(body.school);
      setRevision(body.revision);
      setUpdated(body.updatedAt);
      if (draftGeneration.current === generation) {
        setDraft(clone(body.school));
        setDirty(false);
        setNotice("\u0417\u043C\u0456\u043D\u0438 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E. \u0420\u043E\u0437\u043A\u043B\u0430\u0434\u0438 \u043A\u043B\u0430\u0441\u0456\u0432 \u0456 \u0432\u0447\u0438\u0442\u0435\u043B\u0456\u0432 \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u043E.");
      } else {
        setNotice("\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456 \u0437\u043C\u0456\u043D\u0438 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E. \u041D\u043E\u0432\u0456 \u043F\u0440\u0430\u0432\u043A\u0438 \u0437\u0430\u043B\u0438\u0448\u0430\u044E\u0442\u044C\u0441\u044F \u0432 \u0447\u0435\u0440\u043D\u0435\u0442\u0446\u0456 \u2014 \u0437\u0431\u0435\u0440\u0435\u0436\u0456\u0442\u044C \u0457\u0445 \u043E\u043A\u0440\u0435\u043C\u043E.");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      saveInFlight.current = false;
      setSaving(false);
    }
  }
  async function importFile(file) {
    setError("");
    setNotice("");
    if (file.size > 75e4) {
      setError("\u041E\u0431\u0435\u0440\u0456\u0442\u044C \u0444\u0430\u0439\u043B \u0434\u043E 750 \u041A\u0411.");
      return;
    }
    try {
      const text = await file.text();
      let next = clone(draft || school);
      if (file.name.toLowerCase().endsWith(".json")) {
        const parsed = schoolSchema.safeParse(JSON.parse(text));
        if (!parsed.success) throw new Error(parsed.error.issues[0].message);
        next = parsed.data;
      } else {
        const lines = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
        if (!["\u0434\u0430\u0442\u0430;\u043A\u043B\u0430\u0441;\u0443\u0440\u043E\u043A;\u043F\u0440\u0435\u0434\u043C\u0435\u0442;\u043A\u0430\u0431\u0456\u043D\u0435\u0442;\u0433\u0440\u0443\u043F\u0430", "\u0434\u0430\u0442\u0430;\u043A\u043B\u0430\u0441;\u0443\u0440\u043E\u043A;\u043F\u0440\u0435\u0434\u043C\u0435\u0442;\u043A\u0430\u0431\u0456\u043D\u0435\u0442;\u0433\u0440\u0443\u043F\u0430;\u043F\u0440\u0438\u043C\u0456\u0442\u043A\u0430"].includes(lines[0])) throw new Error("\u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u0430\u0439\u0442\u0435 CSV-\u0448\u0430\u0431\u043B\u043E\u043D \u0437\u0456 \u0441\u0442\u043E\u0440\u0456\u043D\u043A\u0438.");
        for (const line of lines.slice(1)) {
          if (!line.trim()) continue;
          const [d, c, n, subject, room = "", group2 = "", note = ""] = line.split(";");
          const slot = Number(n) - 1;
          if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || !classes.includes(c) || !Number.isInteger(slot) || slot < 0 || slot >= classBells(c).length || weekday(d) < 0 || weekday(d) > 4) throw new Error("\u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u0434\u0430\u0442\u0443, \u043A\u043B\u0430\u0441 \u0456 \u043D\u043E\u043C\u0435\u0440 \u0443\u0440\u043E\u043A\u0443 \u0443 CSV.");
          const current = editableDayLessons(next, c, d).map((x) => x ? { ...x } : null);
          current[slot] = subject?.trim() ? { subject: subject.trim(), room: room.trim(), ...group2.trim() ? { group: group2.trim() } : {}, ...note.trim() ? { note: note.trim() } : {} } : null;
          (next.changes[d] ??= {})[c] = current;
        }
        const parsed = schoolSchema.safeParse(next);
        if (!parsed.success) throw new Error(parsed.error.issues[0].message);
      }
      if (!file.name.toLowerCase().endsWith(".json")) {
        const first = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/).slice(1).find((x) => x.trim());
        if (!first) throw new Error("\u0423 CSV \u043D\u0435\u043C\u0430\u0454 \u0440\u044F\u0434\u043A\u0456\u0432 \u0437\u043C\u0456\u043D.");
        const [firstDate, firstClass] = first.split(";");
        setDate(firstDate);
        setSelected(firstClass);
        setEditMode("changes");
      }
      draftGeneration.current++;
      setDraft(next);
      setDirty(true);
      setNotice("\u0424\u0430\u0439\u043B \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043E \u0432 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443. \u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u0443\u0440\u043E\u043A\u0438 \u0439 \u043D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \xAB\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438\xBB.");
    } catch (e) {
      setError("\u0406\u043C\u043F\u043E\u0440\u0442: " + e.message);
    }
  }
  function imageFile(file) {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("\u041E\u0431\u0435\u0440\u0456\u0442\u044C \u0444\u043E\u0442\u043E PNG, JPEG \u0430\u0431\u043E WebP.");
      return;
    }
    if (file.size > 15e6) {
      setError("\u041E\u0431\u0435\u0440\u0456\u0442\u044C \u0444\u043E\u0442\u043E \u0434\u043E 15 \u041C\u0411.");
      return;
    }
    if (photoRef.current) URL.revokeObjectURL(photoRef.current);
    photoRef.current = URL.createObjectURL(file);
    setPhoto(photoRef.current);
    setFileName(file.name);
  }
  function lessonCell(l, c, i, d, compact = false) {
    return /* @__PURE__ */ jsxs9(Fragment5, { children: [
      /* @__PURE__ */ jsxs9("div", { className: "lesson-subject", children: [
        l ? lessonTitle(c, d, i, l) : "\u041D\u0435\u043C\u0430\u0454 \u0443\u0440\u043E\u043A\u0443",
        l?.note && /* @__PURE__ */ jsx9("span", { className: "group", children: l.note }),
        l?.group && /* @__PURE__ */ jsx9("span", { className: "group", children: l.group === "\u0423\u0441\u0456" ? "\u0423\u0441\u0456 \u0433\u0440\u0443\u043F\u0438" : `\u0413\u0440\u0443\u043F\u0430 ${l.group}` })
      ] }),
      l && /* @__PURE__ */ jsxs9("div", { className: "lesson-meta", children: [
        /* @__PURE__ */ jsx9("span", { title: rooms[l.room], children: l.room ? `\u041A\u0430\u0431. ${l.room}` : "\u041A\u0430\u0431\u0456\u043D\u0435\u0442 \u043D\u0435 \u0432\u043A\u0430\u0437\u0430\u043D\u043E" }),
        !compact && audience === "class" && lessonTeacher(school, l, c) && /* @__PURE__ */ jsx9("span", { children: lessonTeacher(school, l, c).name })
      ] }),
      lessonChange(school, c, d, i) && /* @__PURE__ */ jsxs9("div", { className: "change-detail", children: [
        /* @__PURE__ */ jsx9("span", { className: "change-tag", children: l ? "\u0417\u0430\u043C\u0456\u043D\u0430" : "\u0421\u043A\u0430\u0441\u043E\u0432\u0430\u043D\u043E" }),
        /* @__PURE__ */ jsxs9("span", { children: [
          /* @__PURE__ */ jsx9("del", { children: describeLesson(lessonChange(school, c, d, i).before) }),
          " \u2192 ",
          describeLesson(l)
        ] })
      ] })
    ] });
  }
  const monday = shift2(effectiveDate, -((weekday(effectiveDate) + 7) % 7));
  const conflictDates = editMode === "changes" ? [effectiveDate] : Array.from({ length: 5 }, (_, i) => shift2(monday, i));
  const conflicts = useMemo(() => draft && view === "edit" ? roomConflicts(draft, conflictDates) : [], [draft, view, effectiveDate, editMode]);
  const subjects = Array.from(new Set(Object.values((draft || school).weekly).flat(2).flatMap((l) => l ? [l.subject] : []))).sort();
  return /* @__PURE__ */ jsxs9("div", { className: "app-shell", "data-view": view, children: [
    /* @__PURE__ */ jsxs9("aside", { className: "sidebar", children: [
      /* @__PURE__ */ jsxs9("a", { href: "/", className: "brand", children: [
        /* @__PURE__ */ jsx9("span", { className: "brand-icon", children: /* @__PURE__ */ jsx9(CalendarDays3, { size: 25 }) }),
        /* @__PURE__ */ jsxs9("span", { children: [
          "\u0428\u043A\u0456\u043B\u044C\u043D\u0438\u0439",
          /* @__PURE__ */ jsx9("br", {}),
          /* @__PURE__ */ jsx9("strong", { children: "\u0440\u043E\u0437\u043A\u043B\u0430\u0434" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs9("div", { className: "school-name", children: [
        "\u041C\u0410\u0422\u0420\u041E\u0421\u042C\u041A\u0410 \u0413\u0406\u041C\u041D\u0410\u0417\u0406\u042F",
        /* @__PURE__ */ jsx9("span", { children: "2026 / 2027 \xB7 \u0406 \u0441\u0435\u043C\u0435\u0441\u0442\u0440" })
      ] }),
      /* @__PURE__ */ jsxs9("nav", { "aria-label": "\u041F\u0435\u0440\u0435\u0433\u043B\u044F\u0434 \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u0443", children: [
        [["day", CalendarDays3, "\u041D\u0430 \u0434\u0435\u043D\u044C"], ["week", BookOpen, "\u041D\u0430 \u0442\u0438\u0436\u0434\u0435\u043D\u044C"], ["now", Clock3, "\u0423\u0440\u043E\u043A\u0438 \u0437\u0430\u0440\u0430\u0437"], ["summary", ChartNoAxesColumn, "\u041F\u0456\u0434\u0441\u0443\u043C\u043A\u0438"], ["bells", Bell, "\u0414\u0437\u0432\u0456\u043D\u043A\u0438"], ["calendar", CalendarDays3, "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440"], ["edit", SlidersHorizontal, "\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u043D\u043D\u044F"]].filter(([key]) => key !== "edit" || canEdit).map(([key, Icon, label]) => /* @__PURE__ */ jsxs9("button", { className: view === key ? "nav-item active" : "nav-item", onClick: () => go(key), children: [
          /* @__PURE__ */ jsx9(Icon, { size: 20 }),
          label,
          key === "edit" && dirty && /* @__PURE__ */ jsx9("span", { className: "draft-dot", title: "\u041D\u0435\u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0430 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0430" })
        ] }, key)),
        !canEdit && /* @__PURE__ */ jsx9("a", { className: "nav-item", href: "/signin-with-chatgpt?return_to=/", children: "\u0412\u0445\u0456\u0434 \u0434\u043B\u044F \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u0430" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs9("main", { children: [
      /* @__PURE__ */ jsxs9("header", { className: "topbar", children: [
        /* @__PURE__ */ jsxs9("div", { className: "breadcrumb", children: [
          "\u0413\u0456\u043C\u043D\u0430\u0437\u0456\u044F ",
          /* @__PURE__ */ jsx9("span", { children: "/" }),
          " \u0420\u043E\u0437\u043A\u043B\u0430\u0434"
        ] }),
        /* @__PURE__ */ jsxs9("div", { className: "topbar-actions", children: [
          /* @__PURE__ */ jsx9(ThemeToggle, {}),
          /* @__PURE__ */ jsxs9("div", { className: "clock", children: [
            /* @__PURE__ */ jsx9("span", { className: "live-dot" }),
            now?.time || "\u2014",
            /* @__PURE__ */ jsx9("span", { children: "\u041A\u0438\u0457\u0432" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs9("div", { className: "content", children: [
        /* @__PURE__ */ jsxs9("div", { className: "page-title", children: [
          /* @__PURE__ */ jsxs9("div", { children: [
            /* @__PURE__ */ jsx9("p", { className: "eyebrow", children: "\u041D\u0410\u0412\u0427\u0410\u041B\u042C\u041D\u0418\u0419 \u0422\u0418\u0416\u0414\u0415\u041D\u042C" }),
            /* @__PURE__ */ jsx9("h1", { children: view === "summary" ? "\u041F\u0456\u0434\u0441\u0443\u043C\u043A\u0438 \u043D\u0430\u0432\u0447\u0430\u043D\u043D\u044F" : view === "now" ? "\u0423\u0440\u043E\u043A\u0438 \u0437\u0430\u0440\u0430\u0437" : view === "bells" ? "\u0420\u043E\u0437\u043A\u043B\u0430\u0434 \u0434\u0437\u0432\u0456\u043D\u043A\u0456\u0432" : view === "calendar" ? "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440 \u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0440\u043E\u043A\u0443" : view === "edit" ? "\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u043D\u043D\u044F \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u0443" : view === "week" ? "\u0422\u0438\u0436\u0434\u0435\u043D\u044C \u0443 \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u0456" : effectiveDate === now?.date ? "\u0429\u043E \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456?" : `\u0420\u043E\u0437\u043A\u043B\u0430\u0434 \u043D\u0430 ${dateLabel(effectiveDate)}` })
          ] }),
          /* @__PURE__ */ jsxs9("span", { className: "semester", children: [
            semesterForDate(calendar2, effectiveDate)?.label || "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440",
            " ",
            /* @__PURE__ */ jsxs9("span", { children: [
              calendar2.start.slice(0, 4),
              " / ",
              calendar2.end.slice(0, 4)
            ] })
          ] })
        ] }),
        error && /* @__PURE__ */ jsxs9("div", { className: "alert error", role: "alert", children: [
          error,
          !ready && /* @__PURE__ */ jsx9("button", { onClick: load, children: "\u0421\u043F\u0440\u043E\u0431\u0443\u0432\u0430\u0442\u0438 \u0449\u0435 \u0440\u0430\u0437" })
        ] }),
        notice && /* @__PURE__ */ jsxs9("div", { className: "alert success", role: "status", children: [
          /* @__PURE__ */ jsx9(Check2, { size: 18 }),
          notice
        ] }),
        /* @__PURE__ */ jsx9(DraftRecovery, { enabled: canEdit, ready, draft, dirty, revision, date: effectiveDate, classId: selected, onRestore: restoreDraft }),
        !ready && /* @__PURE__ */ jsx9("div", { className: "loading", role: "status", children: error ? "\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u043E \u0440\u043E\u0437\u043A\u043B\u0430\u0434 \u0456\u0437 \u0444\u043E\u0442\u043E. \u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F \u0442\u0438\u043C\u0447\u0430\u0441\u043E\u0432\u043E \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0435." : "\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0443\u0454\u043C\u043E \u0430\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u0438\u0439 \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u2026" }),
        view !== "bells" && view !== "now" && !(view === "edit" && editMode === "calendar") && /* @__PURE__ */ jsxs9("div", { className: "filter-wrapper", children: [
          /* @__PURE__ */ jsxs9("button", { className: "mobile-filter-button secondary-button", "aria-expanded": filtersOpen, "aria-controls": "schedule-filters", onClick: () => setFiltersOpen((v) => !v), children: [
            /* @__PURE__ */ jsx9(ListFilter, { size: 18 }),
            "\u0424\u0456\u043B\u044C\u0442\u0440\u0438 \xB7 ",
            audience === "class" ? selected + " \u043A\u043B\u0430\u0441" : "\u0423\u0447\u0438\u0442\u0435\u043B\u044C"
          ] }),
          /* @__PURE__ */ jsxs9("div", { id: "schedule-filters", className: `controls ${filtersOpen ? "filters-open" : ""}`, children: [
            view !== "edit" && view !== "calendar" ? /* @__PURE__ */ jsx9(TargetPicker, { teachers: school.teachers, audience, classId: selected, teacherId, onSelect: (kind, id) => {
              setAudience(kind);
              if (kind === "class") setSelected(id);
              else setTeacherId(id);
            } }) : /* @__PURE__ */ jsxs9("label", { className: "select-label", children: [
              "\u041A\u043B\u0430\u0441",
              /* @__PURE__ */ jsx9("select", { value: selected, onChange: (e) => setSelected(e.target.value), children: classes.map((c) => /* @__PURE__ */ jsx9("option", { children: c }, c)) })
            ] }),
            audience === "class" && view !== "edit" && view !== "calendar" && /* @__PURE__ */ jsxs9("label", { className: "select-label", children: [
              "\u0413\u0440\u0443\u043F\u0430",
              /* @__PURE__ */ jsxs9("select", { value: group, onChange: (e) => setGroup(e.target.value), children: [
                /* @__PURE__ */ jsx9("option", { value: "", children: "\u0423\u0441\u0456 \u0433\u0440\u0443\u043F\u0438" }),
                /* @__PURE__ */ jsx9("option", { value: "I", children: "\u0413\u0440\u0443\u043F\u0430 I" }),
                /* @__PURE__ */ jsx9("option", { value: "II", children: "\u0413\u0440\u0443\u043F\u0430 II" })
              ] })
            ] }),
            view !== "day" && /* @__PURE__ */ jsxs9("div", { className: "date-controls", children: [
              /* @__PURE__ */ jsx9("button", { "aria-label": "\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456\u0439 \u0434\u0435\u043D\u044C", onClick: () => setDate(shift2(effectiveDate, -1)), children: /* @__PURE__ */ jsx9(ChevronLeft, { size: 18 }) }),
              /* @__PURE__ */ jsxs9("label", { children: [
                /* @__PURE__ */ jsx9("span", { className: "sr-only", children: "\u0414\u0430\u0442\u0430 \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u0443" }),
                /* @__PURE__ */ jsx9("input", { type: "date", value: effectiveDate, onChange: (e) => e.target.value && setDate(e.target.value) })
              ] }),
              /* @__PURE__ */ jsx9("button", { "aria-label": "\u041D\u0430\u0441\u0442\u0443\u043F\u043D\u0438\u0439 \u0434\u0435\u043D\u044C", onClick: () => setDate(shift2(effectiveDate, 1)), children: /* @__PURE__ */ jsx9(ChevronRight, { size: 18 }) }),
              /* @__PURE__ */ jsx9("button", { className: "today", onClick: () => setDate(""), children: "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456" })
            ] })
          ] }),
          view === "day" && /* @__PURE__ */ jsx9(DateActions, { date: effectiveDate, today: now?.date, onChange: setDate })
        ] }),
        view === "day" && /* @__PURE__ */ jsx9(DateStrip, { date: effectiveDate, today: now?.date, onChange: setDate, school, target }),
        view === "summary" && changesForDate.length > 0 && /* @__PURE__ */ jsxs9("section", { className: "panel changes-summary", children: [
          /* @__PURE__ */ jsxs9("h2", { children: [
            "\u0417\u043C\u0456\u043D\u0438 \u043D\u0430 ",
            dateLabel(effectiveDate)
          ] }),
          changesForDate.map(({ c, i, change }) => /* @__PURE__ */ jsxs9("div", { children: [
            /* @__PURE__ */ jsxs9("strong", { children: [
              c,
              " \xB7 ",
              i + 1,
              " \u0443\u0440\u043E\u043A"
            ] }),
            /* @__PURE__ */ jsxs9("span", { children: [
              /* @__PURE__ */ jsx9("del", { children: describeLesson(change.before) }),
              " \u2192 ",
              /* @__PURE__ */ jsx9("b", { children: describeLesson(change.after) })
            ] })
          ] }, c + i))
        ] }),
        view === "day" && /* @__PURE__ */ jsx9(DayView, { school, date: effectiveDate, now, target, numbers: numberIndex, onOpenDate: setDate }),
        view === "summary" && /* @__PURE__ */ jsx9(Fragment5, { children: /* @__PURE__ */ jsxs9("section", { className: "lesson-stats", "aria-label": "\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0443\u0440\u043E\u043A\u0456\u0432 \u0432\u0456\u0434 1 \u0432\u0435\u0440\u0435\u0441\u043D\u044F", children: [
          /* @__PURE__ */ jsxs9("div", { className: "stats-heading", children: [
            /* @__PURE__ */ jsx9("h2", { children: "\u0423\u0440\u043E\u043A\u0438 \u0432\u0456\u0434 1 \u0432\u0435\u0440\u0435\u0441\u043D\u044F" }),
            /* @__PURE__ */ jsxs9("span", { children: [
              audience === "class" ? `${selected} \u043A\u043B\u0430\u0441` : teacher?.name,
              " \xB7 \u0441\u0442\u0430\u043D\u043E\u043C \u043D\u0430 ",
              now ? dateLabel(now.date) : "\u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456"
            ] })
          ] }),
          /* @__PURE__ */ jsxs9("div", { className: "stats-grid", children: [
            /* @__PURE__ */ jsxs9("div", { children: [
              /* @__PURE__ */ jsx9("span", { children: "\u0417\u0430 \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u043E\u043C \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E" }),
              /* @__PURE__ */ jsx9("strong", { children: hasSchedule ? stats?.completed ?? "\u2014" : "\u2014" }),
              /* @__PURE__ */ jsxs9("small", { children: [
                "\u0432\u0456\u0434 ",
                stats?.start || "1 \u0432\u0435\u0440\u0435\u0441\u043D\u044F"
              ] })
            ] }),
            /* @__PURE__ */ jsxs9("div", { children: [
              /* @__PURE__ */ jsx9("span", { children: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456" }),
              /* @__PURE__ */ jsxs9("strong", { children: [
                hasSchedule ? stats?.completedToday ?? "\u2014" : "\u2014",
                /* @__PURE__ */ jsxs9("small", { children: [
                  " / ",
                  stats?.totalToday ?? 0
                ] })
              ] }),
              /* @__PURE__ */ jsx9("small", { children: "\u0443\u0440\u043E\u043A\u0456\u0432 \u0437\u0430 \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u043E\u043C" })
            ] }),
            /* @__PURE__ */ jsxs9("div", { children: [
              /* @__PURE__ */ jsx9("span", { children: "\u0429\u0435 \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456" }),
              /* @__PURE__ */ jsx9("strong", { children: hasSchedule ? stats?.remainingToday ?? "\u2014" : "\u2014" }),
              /* @__PURE__ */ jsx9("small", { children: "\u0440\u0430\u0437\u043E\u043C \u0456\u0437 \u043F\u043E\u0442\u043E\u0447\u043D\u0438\u043C \u0443\u0440\u043E\u043A\u043E\u043C" })
            ] })
          ] }),
          stats && hasSchedule && /* @__PURE__ */ jsxs9("details", { className: "subject-stats", children: [
            /* @__PURE__ */ jsx9("summary", { children: "\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0437\u0430 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u0430\u043C\u0438" }),
            /* @__PURE__ */ jsxs9("div", { children: [
              Object.entries(stats.subjects).sort(([a], [b]) => a.localeCompare(b, "uk")).map(([subject, count]) => /* @__PURE__ */ jsxs9("p", { children: [
                /* @__PURE__ */ jsx9("span", { children: subject }),
                /* @__PURE__ */ jsx9("strong", { children: count })
              ] }, subject)),
              stats.completed === 0 && /* @__PURE__ */ jsx9("p", { children: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0445 \u0443\u0440\u043E\u043A\u0456\u0432 \u0449\u0435 \u043D\u0435\u043C\u0430\u0454." })
            ] })
          ] }),
          /* @__PURE__ */ jsx9("p", { className: "stats-note", children: !hasSchedule ? "\u0420\u043E\u0437\u043A\u043B\u0430\u0434 \u0449\u0435 \u043D\u0435 \u0437\u0430\u043F\u043E\u0432\u043D\u0435\u043D\u043E. \u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0443\u0440\u043E\u043A\u0456\u0432 \u043F\u043E\u043A\u0438 \u043D\u0435\u0432\u0456\u0434\u043E\u043C\u0430." : "\u0420\u043E\u0437\u0440\u0430\u0445\u0443\u043D\u043E\u043A \u0437\u0430 \u0432\u0435\u0440\u0441\u0456\u044F\u043C\u0438 \u0442\u0438\u0436\u043D\u0435\u0432\u043E\u0433\u043E \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u0443 \u0439 \u0432\u0456\u0434\u043E\u043C\u0438\u043C\u0438 \u0437\u043C\u0456\u043D\u0430\u043C\u0438, \u0432\u0456\u0434 1 \u0432\u0435\u0440\u0435\u0441\u043D\u044F \u0434\u043E \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456. \u041A\u0430\u043D\u0456\u043A\u0443\u043B\u0438 \u0439 \u043D\u0435\u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0456 \u0434\u043D\u0456 \u0437 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044F \u0432\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0456. \u041D\u043E\u043C\u0435\u0440 \u0431\u0456\u043B\u044F \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u0430 \u0440\u0430\u0445\u0443\u0454\u0442\u044C\u0441\u044F \u043E\u043A\u0440\u0435\u043C\u043E \u0434\u043B\u044F \u043A\u043B\u0430\u0441\u0443, \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u0430 \u0439 \u0433\u0440\u0443\u043F\u0438 \u0442\u0430 \u043F\u043E\u0447\u0438\u043D\u0430\u0454\u0442\u044C\u0441\u044F \u0437 \u21161 \u0443 \u043A\u043E\u0436\u043D\u043E\u043C\u0443 \u0441\u0435\u043C\u0435\u0441\u0442\u0440\u0456. \u0413\u0440\u0443\u043F\u0438 I \u0442\u0430 II \u043C\u0430\u044E\u0442\u044C \u043D\u0435\u0437\u0430\u043B\u0435\u0436\u043D\u0443 \u043D\u0443\u043C\u0435\u0440\u0430\u0446\u0456\u044E." })
        ] }) }),
        view === "week" && /* @__PURE__ */ jsxs9("section", { className: "panel", children: [
          /* @__PURE__ */ jsxs9("div", { className: "panel-heading", children: [
            /* @__PURE__ */ jsxs9("div", { children: [
              /* @__PURE__ */ jsx9("h2", { children: audience === "class" ? `${selected} \u043A\u043B\u0430\u0441` : teacher?.name }),
              /* @__PURE__ */ jsxs9("p", { children: [
                dateLabel(monday),
                " \u2014 ",
                dateLabel(shift2(monday, 4))
              ] })
            ] }),
            /* @__PURE__ */ jsx9("span", { className: "pill", children: "\u0406\u0437 \u0449\u043E\u0434\u0435\u043D\u043D\u0438\u043C\u0438 \u0437\u043C\u0456\u043D\u0430\u043C\u0438" })
          ] }),
          /* @__PURE__ */ jsx9("div", { className: "week-scroll", children: /* @__PURE__ */ jsxs9("table", { className: "week-table", children: [
            /* @__PURE__ */ jsx9("thead", { children: /* @__PURE__ */ jsxs9("tr", { children: [
              /* @__PURE__ */ jsx9("th", { children: "\u0423\u0440\u043E\u043A" }),
              days.map((day, i) => /* @__PURE__ */ jsxs9("th", { children: [
                day,
                /* @__PURE__ */ jsxs9("small", { children: [
                  shift2(monday, i).slice(8),
                  ".",
                  shift2(monday, i).slice(5, 7)
                ] })
              ] }, day))
            ] }) }),
            /* @__PURE__ */ jsx9("tbody", { children: Array.from({ length: audience === "class" ? times.length : 8 }, (_, i) => /* @__PURE__ */ jsxs9("tr", { children: [
              /* @__PURE__ */ jsxs9("th", { children: [
                i + 1,
                /* @__PURE__ */ jsx9("small", { children: audience === "class" ? times[i].join("\u2013") : bells.senior[i].join("\u2013") })
              ] }),
              days.map((_2, j) => {
                const d = shift2(monday, j);
                return /* @__PURE__ */ jsx9("td", { className: audience === "class" && isChanged(school, selected, d, i) ? "changed-cell" : "", children: audience === "class" ? matchesGroup(dayLessons(school, selected, d)[i], group) ? lessonCell(dayLessons(school, selected, d)[i], selected, i, d, true) : /* @__PURE__ */ jsx9("span", { className: "muted", children: "\u0406\u043D\u0448\u0430 \u0433\u0440\u0443\u043F\u0430" }) : teacherRows(d).filter((r) => r.i === i).map((r) => /* @__PURE__ */ jsxs9("div", { className: "week-teacher", children: [
                  /* @__PURE__ */ jsxs9("strong", { children: [
                    r.c,
                    " \u043A\u043B\u0430\u0441"
                  ] }),
                  lessonCell(r.l, r.c, i, d, true),
                  /* @__PURE__ */ jsx9("small", { children: r.time.join("\u2013") })
                ] }, r.c)) }, d);
              })
            ] }, i)) })
          ] }) })
        ] }),
        view === "now" && /* @__PURE__ */ jsxs9(Fragment5, { children: [
          /* @__PURE__ */ jsxs9("div", { className: "now-heading", children: [
            /* @__PURE__ */ jsxs9("p", { children: [
              now ? dateLabel(now.date) : "\u2014",
              " \xB7 ",
              now?.time,
              " \xB7 \u041A\u0438\u0457\u0432"
            ] }),
            /* @__PURE__ */ jsx9("span", { className: "pill green", children: "\u041E\u043D\u043E\u0432\u043B\u044E\u0454\u0442\u044C\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E" })
          ] }),
          /* @__PURE__ */ jsx9("div", { className: "now-grid", children: classes.map((c) => {
            const st = now ? currentStatus(school, c, now.date, now.time) : null;
            return /* @__PURE__ */ jsxs9("button", { className: `now-card ${st?.kind === "lesson" ? "in-lesson" : ""}`, onClick: () => {
              setSelected(c);
              setAudience("class");
              setDate("");
              setView("day");
            }, children: [
              /* @__PURE__ */ jsxs9("div", { children: [
                /* @__PURE__ */ jsxs9("span", { className: "class-title", children: [
                  c,
                  " ",
                  /* @__PURE__ */ jsx9("small", { children: "\u043A\u043B\u0430\u0441" })
                ] }),
                /* @__PURE__ */ jsx9(GraduationCap2, { size: 22 })
              ] }),
              /* @__PURE__ */ jsx9("h2", { children: now && st && st.slot >= 0 ? lessonTitle(c, now.date, st.slot, dayLessons(school, c, now.date)[st.slot]) : st?.title || "\u2014" }),
              /* @__PURE__ */ jsx9("p", { children: st?.slot !== void 0 && st.slot >= 0 ? `${st.slot + 1} \u0443\u0440\u043E\u043A \xB7 ${classBells(c)[st.slot].join(" \u2014 ")} \xB7 \u043A\u0430\u0431. ${dayLessons(school, c, now.date)[st.slot]?.room || "\u2014"}` : st?.next ? `\u041D\u0430\u0441\u0442\u0443\u043F\u043D\u0438\u0439 \u043E ${st.next.time}` : "" }),
              st?.next && /* @__PURE__ */ jsx9("footer", { children: now ? lessonTitle(c, now.date, st.next.slot, st.next.lesson) : st.next.lesson.subject })
            ] }, c);
          }) })
        ] }),
        view === "bells" && /* @__PURE__ */ jsxs9(Fragment5, { children: [
          /* @__PURE__ */ jsx9("div", { className: "bell-grid", children: [["1 \u043A\u043B\u0430\u0441", bells.junior], ["2\u20134 \u043A\u043B\u0430\u0441\u0438", bells.primary], ["5\u20139 \u043A\u043B\u0430\u0441\u0438", bells.senior]].map(([label, b]) => /* @__PURE__ */ jsxs9("section", { className: "panel bell-panel", children: [
            /* @__PURE__ */ jsxs9("h2", { children: [
              /* @__PURE__ */ jsx9(Bell, { size: 21 }),
              label
            ] }),
            b.map(([start, end], i) => /* @__PURE__ */ jsxs9("div", { className: "bell-row", children: [
              /* @__PURE__ */ jsxs9("span", { children: [
                i + 1,
                "-\u0439 \u0443\u0440\u043E\u043A"
              ] }),
              /* @__PURE__ */ jsxs9("strong", { children: [
                start,
                " \u2014 ",
                end
              ] })
            ] }, i))
          ] }, label)) }),
          /* @__PURE__ */ jsxs9("section", { className: "panel meal-table", children: [
            /* @__PURE__ */ jsxs9("h2", { children: [
              /* @__PURE__ */ jsx9(Utensils, { size: 22 }),
              "\u0413\u0440\u0430\u0444\u0456\u043A \u0445\u0430\u0440\u0447\u0443\u0432\u0430\u043D\u043D\u044F"
            ] }),
            ["1", "2, 3, 4", "5", "6, 7, 8, 9"].map((c, i) => /* @__PURE__ */ jsxs9("div", { className: "bell-row", children: [
              /* @__PURE__ */ jsxs9("span", { children: [
                c,
                " ",
                i === 0 || i === 2 ? "\u043A\u043B\u0430\u0441" : "\u043A\u043B\u0430\u0441\u0438"
              ] }),
              /* @__PURE__ */ jsx9("strong", { children: meal(["1", "2", "5", "6"][i]).join(" \u2014 ") })
            ] }, c))
          ] }),
          /* @__PURE__ */ jsxs9("section", { className: "panel room-panel", children: [
            /* @__PURE__ */ jsx9("h2", { children: "\u041A\u0430\u0431\u0456\u043D\u0435\u0442\u0438" }),
            /* @__PURE__ */ jsx9("div", { children: Object.entries(rooms).map(([abbr, name]) => /* @__PURE__ */ jsxs9("p", { children: [
              /* @__PURE__ */ jsx9("strong", { children: abbr }),
              name
            ] }, abbr)) })
          ] })
        ] }),
        view === "calendar" && /* @__PURE__ */ jsx9(CalendarView, { calendar: calendar2, c: selected, onOpenDate: (d) => {
          setDate(d);
          setAudience("class");
          setView("day");
        } }),
        canEdit && view === "edit" && draft && /* @__PURE__ */ jsxs9(Fragment5, { children: [
          /* @__PURE__ */ jsxs9("div", { className: "edit-toolbar", children: [
            /* @__PURE__ */ jsx9("div", { className: "segmented", children: [["changes", "\u0417\u043C\u0456\u043D\u0438 \u043D\u0430 \u0434\u0430\u0442\u0443"], ["weekly", "\u041E\u0441\u043D\u043E\u0432\u043D\u0438\u0439 \u0440\u043E\u0437\u043A\u043B\u0430\u0434"], ["teachers", "\u0423\u0447\u0438\u0442\u0435\u043B\u0456"], ["calendar", "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440"]].map(([key, label]) => /* @__PURE__ */ jsx9("button", { className: editMode === key ? "selected" : "", onClick: () => setEditMode(key), children: label }, key)) }),
            /* @__PURE__ */ jsxs9("button", { className: "primary-button", onClick: save, disabled: !ready || !dirty || saving, children: [
              /* @__PURE__ */ jsx9(Save, { size: 18 }),
              saving ? "\u0417\u0431\u0435\u0440\u0456\u0433\u0430\u0454\u043C\u043E\u2026" : "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438"
            ] })
          ] }),
          /* @__PURE__ */ jsx9(SaveHistory, { revision, dirty, onRestore: restoreDraft }),
          conflicts.length > 0 && /* @__PURE__ */ jsxs9("details", { className: "panel conflicts-panel", children: [
            /* @__PURE__ */ jsxs9("summary", { children: [
              conflicts.length,
              " \u043C\u043E\u0436\u043B\u0438\u0432\u0438\u0445 \u043A\u043E\u043D\u0444\u043B\u0456\u043A\u0442\u0456\u0432 \u043A\u0430\u0431\u0456\u043D\u0435\u0442\u0456\u0432 \xB7 \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u0438\u0442\u0438"
            ] }),
            /* @__PURE__ */ jsxs9("p", { children: [
              "\u041F\u0435\u0440\u0435\u0432\u0456\u0440\u043A\u0430 ",
              editMode === "changes" ? "\u043D\u0430 " + effectiveDate : "\u043D\u0430 \u043E\u0431\u0440\u0430\u043D\u0438\u0439 \u0442\u0438\u0436\u0434\u0435\u043D\u044C",
              ". \u0421\u043F\u0456\u043B\u044C\u043D\u0456 \u0437\u0430\u043D\u044F\u0442\u0442\u044F \u0434\u043E\u0437\u0432\u043E\u043B\u0435\u043D\u0456; \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F \u043D\u0435 \u0431\u043B\u043E\u043A\u0443\u044E\u0442\u044C \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F."
            ] }),
            /* @__PURE__ */ jsx9("ul", { children: conflicts.map((c, i) => /* @__PURE__ */ jsxs9("li", { children: [
              /* @__PURE__ */ jsxs9("strong", { children: [
                c.date,
                " \xB7 \u043A\u0430\u0431. ",
                c.room,
                " \xB7 ",
                c.classes.join(" \u0456 "),
                " \u043A\u043B\u0430\u0441\u0438"
              ] }),
              /* @__PURE__ */ jsxs9("span", { children: [
                c.subjects.join(" / "),
                " \xB7 ",
                c.time.join(" / ")
              ] })
            ] }, i)) })
          ] }),
          editMode === "weekly" && /* @__PURE__ */ jsxs9("section", { className: "panel history-panel", children: [
            /* @__PURE__ */ jsx9("h2", { children: "\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0433\u043E \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u0443" }),
            /* @__PURE__ */ jsxs9("p", { children: [
              "\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u043D\u043D\u044F \u0441\u0442\u0432\u043E\u0440\u044E\u0454 \u0432\u0435\u0440\u0441\u0456\u044E \u0432\u0456\u0434 \u043E\u0431\u0440\u0430\u043D\u043E\u0457 \u0434\u0430\u0442\u0438 ",
              /* @__PURE__ */ jsx9("strong", { children: effectiveDate }),
              ". \u041F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456 \u0434\u043D\u0456 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u044E\u0442\u044C \u0441\u0432\u0456\u0439 \u0440\u043E\u0437\u043A\u043B\u0430\u0434 \u0456 \u043D\u043E\u043C\u0435\u0440\u0438. \u0417\u043C\u0456\u043D\u0430 \u043D\u0430\u044F\u0432\u043D\u043E\u0457 \u0432\u0435\u0440\u0441\u0456\u0457 \u0432\u043F\u043B\u0438\u043D\u0435 \u043D\u0430 \u0432\u0435\u0441\u044C \u043F\u0435\u0440\u0456\u043E\u0434 \u0457\u0457 \u0434\u0456\u0457."
            ] }),
            /* @__PURE__ */ jsx9("div", { className: "version-list", children: (draft.weeklyVersions?.length ? draft.weeklyVersions : [{ effectiveFrom: getCalendar(draft).start, label: "\u041F\u043E\u0447\u0430\u0442\u043A\u043E\u0432\u0438\u0439 \u0440\u043E\u0437\u043A\u043B\u0430\u0434", weekly: draft.weekly }]).map((v) => /* @__PURE__ */ jsxs9("button", { className: weeklyForDate(draft, effectiveDate) === v.weekly ? "selected" : "", onClick: () => setDate(v.effectiveFrom), children: [
              /* @__PURE__ */ jsx9("strong", { children: v.effectiveFrom }),
              /* @__PURE__ */ jsx9("span", { children: v.label })
            ] }, v.effectiveFrom)) }),
            /* @__PURE__ */ jsxs9("button", { className: "secondary-button", onClick: () => mutate((s) => {
              ensureWeeklyVersion(s, effectiveDate);
            }), children: [
              "\u0421\u0442\u0432\u043E\u0440\u0438\u0442\u0438 \u0432\u0435\u0440\u0441\u0456\u044E \u0432\u0456\u0434 ",
              effectiveDate
            ] }),
            /* @__PURE__ */ jsx9("p", { className: "muted", children: "\u0429\u043E\u0431 \u043F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u0438 \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456\u0439 \u0440\u043E\u0437\u043A\u043B\u0430\u0434 \u0437 \u043D\u043E\u0432\u043E\u0457 \u0434\u0430\u0442\u0438, \u043E\u0431\u0435\u0440\u0456\u0442\u044C \u0434\u0430\u0442\u0443 \u0432\u0433\u043E\u0440\u0456 \u0442\u0430 \u043D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \xAB\u0421\u043A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438\xBB \u0431\u0456\u043B\u044F \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u043E\u0457 \u0432\u0435\u0440\u0441\u0456\u0457." }),
            draft.weeklyVersions?.map((v) => /* @__PURE__ */ jsxs9("button", { className: "text-button", onClick: () => mutate((s) => {
              ensureWeeklyVersion(s, effectiveDate).weekly = clone({ ...s, weekly: v.weekly }).weekly;
            }), children: [
              "\u0421\u043A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438 ",
              v.effectiveFrom,
              " \u043D\u0430 ",
              effectiveDate
            ] }, v.effectiveFrom))
          ] }),
          /* @__PURE__ */ jsxs9("p", { className: "draft-info", children: [
            dirty ? "\u0404 \u043D\u0435\u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0456 \u0437\u043C\u0456\u043D\u0438. \u0427\u0435\u0440\u043D\u0435\u0442\u043A\u0430 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u0454\u0442\u044C\u0441\u044F \u043D\u0430 \u0446\u044C\u043E\u043C\u0443 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u0457; \u0434\u043B\u044F \u043F\u0443\u0431\u043B\u0456\u043A\u0430\u0446\u0456\u0457 \u043D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \xAB\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438\xBB." : "\u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0438\u0439 \u0440\u043E\u0437\u043A\u043B\u0430\u0434.",
            " ",
            !ready && /* @__PURE__ */ jsx9("a", { href: "/signin-with-chatgpt?return_to=/", target: "_top", children: "\u0423\u0432\u0456\u0439\u0442\u0438 \u0434\u043B\u044F \u0440\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u043D\u043D\u044F" })
          ] }),
          dirty && /* @__PURE__ */ jsxs9("details", { className: "discard-draft", children: [
            /* @__PURE__ */ jsx9("summary", { children: "\u0412\u0456\u0434\u043A\u0438\u043D\u0443\u0442\u0438 \u043F\u043E\u0442\u043E\u0447\u043D\u0443 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443" }),
            /* @__PURE__ */ jsx9("p", { children: "\u0423\u0441\u0456 \u043D\u0435\u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0456 \u043F\u0440\u0430\u0432\u043A\u0438 \u0431\u0443\u0434\u0435 \u0432\u0456\u0434\u043A\u0438\u043D\u0443\u0442\u043E. \u041E\u043F\u0443\u0431\u043B\u0456\u043A\u043E\u0432\u0430\u043D\u0438\u0439 \u0440\u043E\u0437\u043A\u043B\u0430\u0434 \u0437\u0430\u043B\u0438\u0448\u0438\u0442\u044C\u0441\u044F \u0431\u0435\u0437 \u0437\u043C\u0456\u043D." }),
            /* @__PURE__ */ jsx9("button", { className: "secondary-button", disabled: saving, onClick: () => {
              draftGeneration.current++;
              setDraft(clone(school));
              setDirty(false);
              setNotice("\u0427\u0435\u0440\u043D\u0435\u0442\u043A\u0443 \u0432\u0456\u0434\u043A\u0438\u043D\u0443\u0442\u043E. \u041F\u043E\u043A\u0430\u0437\u0430\u043D\u043E \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0438\u0439 \u0440\u043E\u0437\u043A\u043B\u0430\u0434.");
            }, children: "\u041F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0436\u0443\u044E: \u0432\u0456\u0434\u043A\u0438\u043D\u0443\u0442\u0438 \u043F\u0440\u0430\u0432\u043A\u0438" })
          ] }),
          editMode === "calendar" ? /* @__PURE__ */ jsx9(CalendarEditor, { calendar: getCalendar(draft), onChange: (calendar3) => mutate((s) => {
            s.calendar = calendar3;
          }) }) : editMode === "teachers" ? /* @__PURE__ */ jsxs9("section", { className: "panel teacher-editor", children: [
            /* @__PURE__ */ jsx9("h2", { children: "\u0423\u0447\u0438\u0442\u0435\u043B\u0456 \u0439 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u0438" }),
            /* @__PURE__ */ jsx9("p", { className: "muted", children: "\u0414\u043E\u0434\u0430\u0439\u0442\u0435 \u041F\u0406\u0411 \u0456 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0442\u0435 \u043F\u0440\u0435\u0434\u043C\u0435\u0442 \u0443 \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0438\u0445 \u043A\u043B\u0430\u0441\u0430\u0445. \u0420\u043E\u0437\u043A\u043B\u0430\u0434 \u0443\u0447\u0438\u0442\u0435\u043B\u044F \u0444\u043E\u0440\u043C\u0443\u0454\u0442\u044C\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E." }),
            /* @__PURE__ */ jsxs9("div", { className: "teacher-add", children: [
              /* @__PURE__ */ jsxs9("label", { children: [
                "\u041F\u0406\u0411",
                /* @__PURE__ */ jsx9("input", { value: teacherName, onChange: (e) => setTeacherName(e.target.value), placeholder: "\u041F\u0440\u0456\u0437\u0432\u0438\u0449\u0435 \u0406\u043C\u2019\u044F \u041F\u043E \u0431\u0430\u0442\u044C\u043A\u043E\u0432\u0456" })
              ] }),
              /* @__PURE__ */ jsxs9("button", { className: "secondary-button", onClick: () => {
                if (teacherName.trim().length < 3) return;
                const id = crypto.randomUUID();
                mutate((s) => s.teachers.push({ id, name: teacherName.trim(), rules: [] }));
                setEditTeacher(id);
                setTeacherName("");
              }, disabled: teacherName.trim().length < 3, children: [
                /* @__PURE__ */ jsx9(Plus2, { size: 18 }),
                "\u0414\u043E\u0434\u0430\u0442\u0438"
              ] })
            ] }),
            /* @__PURE__ */ jsxs9("label", { children: [
              "\u0423\u0447\u0438\u0442\u0435\u043B\u044C",
              /* @__PURE__ */ jsx9("select", { value: editTeacher, onChange: (e) => setEditTeacher(e.target.value), children: draft.teachers.map((t) => /* @__PURE__ */ jsx9("option", { value: t.id, children: t.name }, t.id)) })
            ] }),
            /* @__PURE__ */ jsxs9("div", { className: "rule-form", children: [
              /* @__PURE__ */ jsxs9("label", { children: [
                "\u041F\u0440\u0435\u0434\u043C\u0435\u0442",
                /* @__PURE__ */ jsx9("select", { value: ruleSubject, onChange: (e) => setRuleSubject(e.target.value), children: subjects.map((s) => /* @__PURE__ */ jsx9("option", { children: s }, s)) })
              ] }),
              /* @__PURE__ */ jsxs9("fieldset", { children: [
                /* @__PURE__ */ jsx9("legend", { children: "\u041A\u043B\u0430\u0441\u0438" }),
                /* @__PURE__ */ jsx9("div", { className: "class-checks", children: classes.map((c) => /* @__PURE__ */ jsxs9("label", { children: [
                  /* @__PURE__ */ jsx9("input", { type: "checkbox", checked: ruleClasses.includes(c), onChange: (e) => setRuleClasses((prev) => e.target.checked ? [...prev, c] : prev.filter((x) => x !== c)) }),
                  c
                ] }, c)) })
              ] }),
              /* @__PURE__ */ jsx9("button", { className: "secondary-button", disabled: !ruleClasses.length || !draft.teachers.some((t) => t.id === editTeacher), onClick: () => {
                const collision = draft.teachers.some((t) => t.id !== editTeacher && t.rules.some((r) => r.subjects.includes(ruleSubject) && r.classes.some((c) => ruleClasses.includes(c))));
                if (collision) {
                  setError("\u0426\u0435\u0439 \u043F\u0440\u0435\u0434\u043C\u0435\u0442 \u0443 \u0432\u0438\u0431\u0440\u0430\u043D\u0438\u0445 \u043A\u043B\u0430\u0441\u0430\u0445 \u0443\u0436\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043E \u0456\u043D\u0448\u043E\u043C\u0443 \u0432\u0447\u0438\u0442\u0435\u043B\u044E. \u0423\u0442\u043E\u0447\u043D\u0456\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E \u0430\u0431\u043E \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0442\u0435 \u0432\u0447\u0438\u0442\u0435\u043B\u044F \u043D\u0430 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u0438\u0439 \u0443\u0440\u043E\u043A.");
                  return;
                }
                mutate((s) => s.teachers.find((t) => t.id === editTeacher).rules.push({ subjects: [ruleSubject], classes: ruleClasses }));
              }, children: "\u041F\u0440\u0438\u0437\u043D\u0430\u0447\u0438\u0442\u0438 \u043F\u0440\u0435\u0434\u043C\u0435\u0442" })
            ] }),
            /* @__PURE__ */ jsx9("div", { className: "rule-list", children: draft.teachers.find((t) => t.id === editTeacher)?.rules.map((r, i) => /* @__PURE__ */ jsxs9("div", { children: [
              /* @__PURE__ */ jsxs9("p", { children: [
                /* @__PURE__ */ jsx9("strong", { children: r.subjects.join(", ") }),
                /* @__PURE__ */ jsxs9("span", { children: [
                  "\u041A\u043B\u0430\u0441\u0438: ",
                  r.classes.join(", ")
                ] })
              ] }),
              /* @__PURE__ */ jsx9("button", { "aria-label": "\u041F\u0440\u0438\u0431\u0440\u0430\u0442\u0438 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F", onClick: () => mutate((s) => s.teachers.find((t) => t.id === editTeacher).rules.splice(i, 1)), children: /* @__PURE__ */ jsx9(X2, { size: 18 }) })
            ] }, i)) })
          ] }) : /* @__PURE__ */ jsxs9(Fragment5, { children: [
            /* @__PURE__ */ jsxs9("section", { className: "panel import-panel", children: [
              /* @__PURE__ */ jsxs9("div", { children: [
                /* @__PURE__ */ jsx9(Upload, { size: 22 }),
                /* @__PURE__ */ jsx9("h2", { children: "\u0417\u043C\u0456\u043D\u0438 \u0437 \u0444\u0430\u0439\u043B\u0443" })
              ] }),
              /* @__PURE__ */ jsx9("p", { children: "\u0424\u043E\u0442\u043E PNG / JPEG / WebP \u043C\u043E\u0436\u043D\u0430 \u0440\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u0442\u0438 \u0439 \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u0438\u0442\u0438 \u043F\u0435\u0440\u0435\u0434 \u0434\u043E\u0434\u0430\u0432\u0430\u043D\u043D\u044F\u043C \u0437\u043C\u0456\u043D. CSV \u0437\u0430\u0441\u0442\u043E\u0441\u043E\u0432\u0443\u0454 \u0437\u043C\u0456\u043D\u0438 \u043D\u0430 \u0434\u0430\u0442\u0443, JSON \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u044E\u0454 \u043F\u043E\u0432\u043D\u0438\u0439 \u0440\u043E\u0437\u043A\u043B\u0430\u0434. \u0406\u043C\u043F\u043E\u0440\u0442 \u0441\u043F\u043E\u0447\u0430\u0442\u043A\u0443 \u0441\u0442\u0432\u043E\u0440\u044E\u0454 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443." }),
              /* @__PURE__ */ jsxs9("div", { className: "file-actions", children: [
                /* @__PURE__ */ jsxs9("label", { className: "secondary-button", children: [
                  "\u0406\u043C\u043F\u043E\u0440\u0442 CSV / JSON",
                  /* @__PURE__ */ jsx9("input", { type: "file", accept: ".csv,.json", onChange: (e) => {
                    const f = e.target.files?.[0];
                    if (f) void importFile(f);
                    e.target.value = "";
                  } })
                ] }),
                /* @__PURE__ */ jsx9("button", { className: "text-button", onClick: () => download("\u0437\u043C\u0456\u043D\u0438-\u0448\u0430\u0431\u043B\u043E\u043D.csv", "\uFEFF\u0434\u0430\u0442\u0430;\u043A\u043B\u0430\u0441;\u0443\u0440\u043E\u043A;\u043F\u0440\u0435\u0434\u043C\u0435\u0442;\u043A\u0430\u0431\u0456\u043D\u0435\u0442;\u0433\u0440\u0443\u043F\u0430\n2026-10-06;8;2;\u041F\u0456\u0434\u043F\u0440\u0438\u0454\u043C\u043D\u0438\u0446\u0442\u0432\u043E \u0456 \u0444\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0430 \u0433\u0440\u0430\u043C\u043E\u0442\u043D\u0456\u0441\u0442\u044C;\u0406\u0421\u0422;\n", "text/csv;charset=utf-8"), children: "CSV-\u0448\u0430\u0431\u043B\u043E\u043D" }),
                /* @__PURE__ */ jsxs9("button", { className: "text-button", onClick: () => download("\u0440\u043E\u0437\u043A\u043B\u0430\u0434-\u0440\u0435\u0437\u0435\u0440\u0432\u043D\u0430-\u043A\u043E\u043F\u0456\u044F.json", JSON.stringify(draft, null, 2)), children: [
                  /* @__PURE__ */ jsx9(Download, { size: 16 }),
                  "\u0420\u0435\u0437\u0435\u0440\u0432\u043D\u0430 \u043A\u043E\u043F\u0456\u044F"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx9(PhotoImport, { date: effectiveDate, onApply: (entries, d) => {
              mutate((s) => {
                for (const entry of entries) {
                  const current = editableDayLessons(s, entry.classId, d).map((l) => l ? { ...l } : null);
                  current[entry.slot] = entry.lesson;
                  (s.changes[d] ??= {})[entry.classId] = current;
                }
              });
              setDate(d);
              setEditMode("changes");
              setNotice("\u0420\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u043D\u0456 \u0437\u043C\u0456\u043D\u0438 \u0434\u043E\u0434\u0430\u043D\u043E \u0432 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443. \u0417\u0431\u0435\u0440\u0435\u0436\u0456\u0442\u044C \u043F\u0456\u0441\u043B\u044F \u0437\u0432\u0456\u0440\u043A\u0438.");
            } }),
            /* @__PURE__ */ jsxs9("div", { className: photo ? "editor-layout has-photo" : "editor-layout", children: [
              photo && /* @__PURE__ */ jsxs9("aside", { className: "photo-preview", children: [
                /* @__PURE__ */ jsxs9("div", { children: [
                  /* @__PURE__ */ jsx9("span", { children: fileName }),
                  /* @__PURE__ */ jsx9("button", { "aria-label": "\u0417\u0430\u043A\u0440\u0438\u0442\u0438 \u0444\u043E\u0442\u043E", onClick: () => {
                    URL.revokeObjectURL(photoRef.current);
                    photoRef.current = "";
                    setPhoto("");
                  }, children: /* @__PURE__ */ jsx9(X2, { size: 18 }) })
                ] }),
                /* @__PURE__ */ jsx9("img", { src: photo, alt: "\u0424\u043E\u0442\u043E \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u0443 \u0434\u043B\u044F \u0437\u0432\u0456\u0440\u043A\u0438" }),
                /* @__PURE__ */ jsx9("p", { children: "\u0424\u043E\u0442\u043E \u0432\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0454\u0442\u044C\u0441\u044F \u043B\u0438\u0448\u0435 \u0434\u043B\u044F \u0437\u0432\u0456\u0440\u043A\u0438 \u0432 \u0446\u044C\u043E\u043C\u0443 \u0432\u0456\u043A\u043D\u0456 \u0439 \u043D\u0435 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u0454\u0442\u044C\u0441\u044F \u043D\u0430 \u0441\u0430\u0439\u0442\u0456." })
              ] }),
              /* @__PURE__ */ jsxs9("section", { className: "panel edit-panel", children: [
                /* @__PURE__ */ jsxs9("div", { className: "panel-heading", children: [
                  /* @__PURE__ */ jsxs9("div", { children: [
                    /* @__PURE__ */ jsxs9("h2", { children: [
                      selected,
                      " \u043A\u043B\u0430\u0441 \xB7 ",
                      editMode === "weekly" ? "\u043E\u0441\u043D\u043E\u0432\u043D\u0438\u0439 \u0440\u043E\u0437\u043A\u043B\u0430\u0434" : "\u0437\u043C\u0456\u043D\u0438"
                    ] }),
                    /* @__PURE__ */ jsx9("p", { children: editMode === "weekly" ? days[editDay] : dateLabel(effectiveDate) })
                  ] }),
                  editMode === "weekly" ? /* @__PURE__ */ jsx9("select", { "aria-label": "\u0414\u0435\u043D\u044C \u0442\u0438\u0436\u043D\u044F", value: editDay, onChange: (e) => setEditDay(Number(e.target.value)), children: days.map((d, i) => /* @__PURE__ */ jsx9("option", { value: i, children: d }, d)) }) : draft.changes[effectiveDate]?.[selected] && /* @__PURE__ */ jsx9("button", { className: "text-button", onClick: () => mutate((s) => {
                    delete s.changes[effectiveDate][selected];
                    if (!Object.keys(s.changes[effectiveDate]).length) delete s.changes[effectiveDate];
                  }), children: "\u041F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u0438 \u043E\u0441\u043D\u043E\u0432\u043D\u0438\u0439" })
                ] }),
                editMode === "changes" && (weekday(effectiveDate) < 0 || weekday(effectiveDate) > 4) ? /* @__PURE__ */ jsxs9("div", { className: "empty", children: [
                  /* @__PURE__ */ jsx9("h3", { children: "\u041E\u0431\u0435\u0440\u0456\u0442\u044C \u043D\u0430\u0432\u0447\u0430\u043B\u044C\u043D\u0438\u0439 \u0434\u0435\u043D\u044C" }),
                  /* @__PURE__ */ jsx9("p", { children: "\u0417\u043C\u0456\u043D\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0456 \u0437 \u043F\u043E\u043D\u0435\u0434\u0456\u043B\u043A\u0430 \u0434\u043E \u043F\u2019\u044F\u0442\u043D\u0438\u0446\u0456." })
                ] }) : /* @__PURE__ */ jsxs9("div", { className: "edit-rows", children: [
                  times.map((t, i) => {
                    const l = editRows()[i];
                    return /* @__PURE__ */ jsxs9("div", { className: "edit-row", children: [
                      /* @__PURE__ */ jsxs9("div", { className: "edit-number", children: [
                        i + 1,
                        /* @__PURE__ */ jsx9("small", { children: t[0] })
                      ] }),
                      /* @__PURE__ */ jsxs9("label", { className: "subject-input", children: [
                        "\u041F\u0440\u0435\u0434\u043C\u0435\u0442",
                        /* @__PURE__ */ jsx9("input", { list: "subjects", value: l?.subject || "", placeholder: "\u041D\u0435\u043C\u0430\u0454 \u0443\u0440\u043E\u043A\u0443", onChange: (e) => editLesson(i, "subject", e.target.value) })
                      ] }),
                      /* @__PURE__ */ jsxs9("label", { children: [
                        "\u041A\u0430\u0431\u0456\u043D\u0435\u0442",
                        /* @__PURE__ */ jsxs9("select", { value: l?.room || "", disabled: !l, onChange: (e) => editLesson(i, "room", e.target.value), children: [
                          /* @__PURE__ */ jsx9("option", { value: "", children: "\u041D\u0435 \u0432\u043A\u0430\u0437\u0430\u043D\u043E" }),
                          Object.entries(rooms).map(([abbr, name]) => /* @__PURE__ */ jsxs9("option", { value: abbr, children: [
                            abbr,
                            " \xB7 ",
                            name
                          ] }, abbr))
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs9("label", { children: [
                        "\u0413\u0440\u0443\u043F\u0430",
                        /* @__PURE__ */ jsxs9("select", { disabled: !l, value: l?.group || "", onChange: (e) => editLesson(i, "group", e.target.value), children: [
                          /* @__PURE__ */ jsx9("option", { value: "", children: "\u0412\u0435\u0441\u044C \u043A\u043B\u0430\u0441" }),
                          /* @__PURE__ */ jsx9("option", { children: "I" }),
                          /* @__PURE__ */ jsx9("option", { children: "II" }),
                          /* @__PURE__ */ jsx9("option", { children: "\u0423\u0441\u0456" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs9("label", { className: "teacher-input", children: [
                        "\u0423\u0447\u0438\u0442\u0435\u043B\u044C",
                        /* @__PURE__ */ jsxs9("select", { disabled: !l, value: l?.teacherId || "", onChange: (e) => editLesson(i, "teacherId", e.target.value), children: [
                          /* @__PURE__ */ jsx9("option", { value: "", children: "\u0417\u0430 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F\u043C\u0438" }),
                          draft.teachers.map((t2) => /* @__PURE__ */ jsx9("option", { value: t2.id, children: t2.name }, t2.id))
                        ] })
                      ] }),
                      l && /* @__PURE__ */ jsx9("button", { className: "clear-lesson", "aria-label": `\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438 ${i + 1}-\u0439 \u0443\u0440\u043E\u043A`, onClick: () => editLesson(i, "subject", ""), children: /* @__PURE__ */ jsx9(X2, { size: 17 }) })
                    ] }, i);
                  }),
                  /* @__PURE__ */ jsx9("datalist", { id: "subjects", children: subjects.map((s) => /* @__PURE__ */ jsx9("option", { value: s }, s)) })
                ] })
              ] })
            ] }),
            dirty && /* @__PURE__ */ jsxs9("div", { className: "save-bottom", children: [
              /* @__PURE__ */ jsx9("span", { children: "\u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u0434\u0430\u0442\u0443, \u043A\u043B\u0430\u0441 \u0456 \u0443\u0440\u043E\u043A\u0438 \u043F\u0435\u0440\u0435\u0434 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F\u043C." }),
              /* @__PURE__ */ jsxs9("button", { className: "primary-button", disabled: !ready || saving, onClick: save, children: [
                /* @__PURE__ */ jsx9(Save, { size: 18 }),
                saving ? "\u0417\u0431\u0435\u0440\u0456\u0433\u0430\u0454\u043C\u043E\u2026" : "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u0437\u043C\u0456\u043D\u0438"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs9("footer", { className: "page-footer", children: [
          /* @__PURE__ */ jsx9("span", { children: "\u041C\u0430\u0442\u0440\u043E\u0441\u044C\u043A\u0430 \u0433\u0456\u043C\u043D\u0430\u0437\u0456\u044F \xB7 2026\u20132027" }),
          /* @__PURE__ */ jsx9("span", { children: updated ? `\u041E\u043D\u043E\u0432\u043B\u0435\u043D\u043E ${new Intl.DateTimeFormat("uk-UA", { timeZone: "Europe/Kyiv", dateStyle: "short", timeStyle: "short" }).format(new Date(updated))}` : "" })
        ] })
      ] })
    ] })
  ] });
}
export {
  Schedule as default
};
