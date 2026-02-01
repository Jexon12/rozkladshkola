export function useCalendar() {

    const generateICS = (events: any[]) => {
        let icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Rozklad//NONSGML v1.0//EN\n";

        events.forEach(event => {
            // event.date is dd.mm.yyyy
            // event.timeStart is HH:MM
            // event.timeEnd is HH:MM (if available)

            const [d, m, y] = event.date.split('.')
            const [h1, m1] = event.timeStart.split(':')
            const [h2, m2] = event.timeEnd.split(':')

            const start = `${y}${m}${d}T${h1}${m1}00`
            const end = `${y}${m}${d}T${h2}${m2}00`

            icsMSG += "BEGIN:VEVENT\n"
            icsMSG += `DTSTART:${start}\n`
            icsMSG += `DTEND:${end}\n`
            icsMSG += `SUMMARY:${event.discipline} (${event.type})\n`
            icsMSG += `DESCRIPTION:Викладач: ${event.teacher || 'N/A'}\\nГрупа: ${event.group || 'N/A'}\n`
            icsMSG += `LOCATION:${event.cabinet || 'Online'}\n`
            icsMSG += "BEGIN:VALARM\n"
            icsMSG += "TRIGGER:-PT3M\n"
            icsMSG += "ACTION:DISPLAY\n"
            icsMSG += "DESCRIPTION:Нагадування про урок\n"
            icsMSG += "END:VALARM\n"
            icsMSG += "END:VEVENT\n"
        })

        icsMSG += "END:VCALENDAR";

        return icsMSG
    }

    const downloadICS = (filename: string, content: string) => {
        const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return {
        generateICS,
        downloadICS
    }
}
