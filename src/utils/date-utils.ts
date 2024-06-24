import { dropdownItem } from "../components/dropdown";

enum calendarType {
    End = "end-date-calendar",
    Start = "start-date-calendar",
}
enum dropdownType {
    Months = "months-dropdown",
    Years = "years-dropdown",
}

const months: Array<dropdownItem> = [
    {
        label: "January",
        value: 0
    },
    {
        label: "February",
        value: 1
    },
    {
        label: "March",
        value: 2
    },
    {
        label: "April",
        value: 3
    },
    {
        label: "May",
        value: 4
    },
    {
        label: "June",
        value: 5
    },
    {
        label: "July",
        value: 6
    },
    {
        label: "August",
        value: 7
    },
    {
        label: "September",
        value: 8
    },
    {
        label: "October",
        value: 9
    },
    {
        label: "November",
        value: 10
    },
    {
        label: "December",
        value: 11
    }
];
const weekdays: Array<string> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isWeekend = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;
const formatDate = (date: Date): string => {
    return [
        date.getFullYear(),
        ('0' + (date.getMonth() + 1)).slice(-2),
        ('0' + date.getDate()).slice(-2)
    ].join('-');
};
const arrayRange = (start: number, stop: number, step: number) => {
    const years: Array<dropdownItem> = [];
    for(let i=start; i<stop; i++) {
        years.push({
            label: `${i}`,
            value: i
        })
    }
    return years;
}

export const DateUtils = {
    ArrayRange: arrayRange,
    CalendarType: calendarType,
    DropdownType: dropdownType,
    FormatDate: formatDate,
    IsWeekend: isWeekend,
    Months: months,
    Weekdays: weekdays,
}