import React from 'react';
import { DateUtils } from "../utils/date-utils";
import Dropdown from './dropdown';

interface CalendarProps {
    dateRange: Array<Date> | null;
    id: string;
    onDateClick: (day: Date) => void;
    onDropdownChange: (e: React.ChangeEvent<HTMLSelectElement>, id: string) => void;
    onMonthChange: (offset: number) => void;
    // onYearChange: () => void;
    selectedMonth: number;
    selectedYear: number;
}

const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const isWeekend = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;
const years = DateUtils.ArrayRange(1980, 2100, 1);

const Calendar:React.FC<CalendarProps> = ({dateRange, id, onDateClick, onDropdownChange, onMonthChange, selectedMonth, selectedYear}) => {
    const startDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

    const getPreviousMonthDays = () => {
        const previousMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
        const previousYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
        const daysInPreviousMonth = getDaysInMonth(previousMonth, previousYear);
        const days = [];
        for (let i = startDayOfMonth - 1; i >= 0; i--) {
            days.push(daysInPreviousMonth - i);
        }
        return days;
    };

    const getNextMonthDays = (remainingSlots: number) => {
        const days = [];
        for (let i = 1; i <= remainingSlots; i++) {
            days.push(i);
        }
        return days;
    };

    const renderDaysInMonth = () => {
        const days = [];
        const previousMonthDays = getPreviousMonthDays();
        const nextMonthDays = getNextMonthDays(42 - (startDayOfMonth + daysInMonth));

        previousMonthDays.forEach((day, index) => {
            const date = new Date(selectedYear, selectedMonth-1, day);
            const weekendClassClassName = isWeekend(date) ? "weekend" : "";
            days.push(
                <div
                    className={`calendar-table-cell calendar-table-cell-un-same-month ${weekendClassClassName}`}
                    key={`prev-${index}`}
                    onClick={() => onDateClick(date)}
                    role="gridcell"
                >
                    <div className="calendar-table-cell-content">
                        <span className="calendar-table-cell-day">{day}</span>
                    </div>
                </div>
            );
        });

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(selectedYear, selectedMonth, day);
            const weekendClassClassName = isWeekend(date) ? "weekend" : "";
            const highlightedClassName = (dateRange &&
                (date >= dateRange[0] && date <= dateRange[1]) &&
                !isWeekend(date)) ? "highlighted" : "";
            const selectedClassName = (dateRange &&
                (date.toString() === dateRange[0].toString() || date.toString() === dateRange[1].toString())) ?
                "calendar-table-cell-selected" : "";

            days.push(
                <div
                    className={`calendar-table-cell ${weekendClassClassName} ${highlightedClassName} ${selectedClassName}`}
                    key={day}
                    onClick={() => onDateClick(date)}
                    role="gridcell"
                >
                    <div className="calendar-table-cell-content">
                        <span className="calendar-table-cell-day">{day}</span>
                    </div>
                </div>
            );
        }

        nextMonthDays.forEach((day, index) => {
            const date = new Date(selectedYear, selectedMonth+1, day);
            const weekendClassClassName = isWeekend(date) ? "weekend" : "";
            days.push(
                <div
                    className={`calendar-table-cell calendar-table-cell-un-same-month ${weekendClassClassName}`}
                    key={`next-${index}`}
                    onClick={() => onDateClick(date)}
                    role="gridcell"
                >
                    <div className="calendar-table-cell-content">
                        <span className="calendar-table-cell-day">{day}</span>
                    </div>
                </div>
            );
        });

        // Group days into weeks
        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }

        return weeks.map((week, index) => (
            <div key={index} role="row" className="calendar-table-row">
                {week}
            </div>
        ));
    };

    return (
        <div className="rs-calendar">
            <div className="calendar-header">
                <div className="calendar-header-month-toolbar">
                    <button className="calendar-header-backward btn-icon" onClick={() => onMonthChange(-1)}>
                        <svg width="1em" height="1em" viewBox="0 0 12 32" fill="currentColor" aria-hidden="true" focusable="false" className="rs-icon" aria-label="Previous" data-category="legacy">
                            <path d="M11.196 9.714a.612.612 0 01-.179.411l-7.018 7.018 7.018 7.018c.107.107.179.268.179.411s-.071.304-.179.411l-.893.893c-.107.107-.268.179-.411.179s-.304-.071-.411-.179L.981 17.555c-.107-.107-.179-.268-.179-.411s.071-.304.179-.411l8.321-8.321c.107-.107.268-.179.411-.179s.304.071.411.179l.893.893c.107.107.179.25.179.411z"></path>
                        </svg>
                    </button>
                    <Dropdown
                        dropdownItems={DateUtils.Months}
                        id={`${id}_${DateUtils.DropdownType.Months}`}
                        onChange={onDropdownChange}
                        selectedValue={selectedMonth}
                    />
                    <Dropdown
                        dropdownItems={years}
                        id={`${id}_${DateUtils.DropdownType.Years}`}
                        onChange={onDropdownChange}
                        selectedValue={selectedYear}
                    />
                    <button className="calendar-header-forward btn-icon" onClick={() => onMonthChange(1)}>
                        <svg width="1em" height="1em" viewBox="0 0 11 32" fill="currentColor" aria-hidden="true" focusable="false" className="rs-icon" aria-label="angle right" data-category="legacy">
                            <path d="M10.625 17.143a.612.612 0 01-.179.411l-8.321 8.321c-.107.107-.268.179-.411.179s-.304-.071-.411-.179l-.893-.893a.582.582 0 01-.179-.411c0-.143.071-.304.179-.411l7.018-7.018L.41 10.124c-.107-.107-.179-.268-.179-.411s.071-.304.179-.411l.893-.893c.107-.107.268-.179.411-.179s.304.071.411.179l8.321 8.321a.617.617 0 01.179.411z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="calendar-body">
                <div role="grid" className="calendar-table">
                    <div role="row" className="calendar-table-row">
                        {DateUtils.Weekdays.map((day) => (
                        <div className="calendar-table-header-cell" key={day}>
                            <span className="calendar-table-header-cell">{day}</span>
                        </div>
                        ))}
                    </div>
                    {renderDaysInMonth()}
                </div>
            </div>
        </div>
    )
}

export default Calendar;