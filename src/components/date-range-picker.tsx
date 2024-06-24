import React, { useState } from "react";
import { DateUtils } from "../utils/date-utils";
import Calendar from "./calendar";

/** ---------------------------------------------------------------
 * Interfaces
 -----------------------------------------------------------------*/

interface DateRange {
    label: string;
    startDate: Date;
    endDate: Date;
}

interface DateRangePickerProps {
    defaultDateRanges: Array<DateRange>
    onChange: (selectedRange: Array<string>, weekends: Array<string>) => void;
}

/** ---------------------------------------------------------------
 * DateRangePicker Main Component
 -----------------------------------------------------------------*/

const DateRangePicker:React.FC<DateRangePickerProps> = ({defaultDateRanges, onChange}) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const [selectedStartYear, setSelectedStartYear] = useState<number>(currentYear);
    const [selectedStartMonth, setSelectedStartMonth] = useState<number>(currentMonth);
    const [selectedEndYear, setSelectedEndYear] = useState<number>(currentYear);
    const [selectedEndMonth, setSelectedEndMonth] = useState<number>(currentMonth + 1);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const dateRange = startDate && endDate ? [startDate, endDate] : null;

    const onStartMonthChange = (offset: number) => {
        let newMonth = selectedStartMonth + offset;
        let newYear = selectedStartYear;
        if (newMonth < 0) {
          newMonth = 11;
          newYear -= 1;
        } else if (newMonth > 11) {
          newMonth = 0;
          newYear += 1;
        }
        setSelectedStartMonth(newMonth);
        setSelectedStartYear(newYear);
        if(newMonth >= selectedEndMonth && newYear >= selectedEndYear) {
            if(newMonth+1 > 11) {
                setSelectedEndYear(newYear+1)
                setSelectedEndMonth(0)
            } else {
                setSelectedEndMonth(newMonth+1)
            }
        }
    };

    const onEndMonthChange = (offset: number) => {
        let newMonth = selectedEndMonth + offset;
        let newYear = selectedEndYear;
        if (newMonth < 0) {
          newMonth = 11;
          newYear -= 1;
        } else if (newMonth > 11) {
          newMonth = 0;
          newYear += 1;
        }
        setSelectedEndMonth(newMonth);
        setSelectedEndYear(newYear);
        if(newMonth <= selectedStartMonth && newYear <= selectedStartYear) {
            if(newMonth-1 < 0) {
                setSelectedStartYear(newYear-1)
                setSelectedStartMonth(11)
            } else {
                setSelectedStartMonth(newMonth-1)
            }
        }
    };

    const onDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
        const ids = id.split("_");
        const calendarIdentifier = ids[0];
        const monthsOrYear = ids[1];
        if(calendarIdentifier === DateUtils.CalendarType.Start) {
            if(monthsOrYear === DateUtils.DropdownType.Months) {
                setSelectedStartMonth(+e.target.value);
                if(+e.target.value >= selectedEndMonth && selectedStartYear >= selectedEndYear) {
                    if(+e.target.value === 11) {
                        setSelectedEndMonth(0);
                        setSelectedEndYear(selectedStartYear+1);
                    } else {
                        setSelectedEndMonth(+e.target.value+1);
                    }
                }
            } else {
                if(+e.target.value >= selectedEndYear) {
                    if(selectedStartMonth === 11) {
                        setSelectedEndMonth(0);
                        setSelectedEndYear(+e.target.value+1);
                    } else {
                        setSelectedEndMonth(selectedStartMonth+1);
                        setSelectedEndYear(+e.target.value);
                    }
                }
                setSelectedStartYear(+e.target.value);
            }
        } else {
            if(monthsOrYear === DateUtils.DropdownType.Months) {
                setSelectedEndMonth(+e.target.value);
                if(+e.target.value <= selectedStartMonth && selectedStartYear >= selectedEndYear) {
                    if(+e.target.value === 0) {
                        setSelectedStartMonth(11);
                        setSelectedStartYear(selectedEndYear-1);
                    } else {
                        setSelectedStartMonth(+e.target.value-1);
                    }
                }
            } else {
                setSelectedEndYear(+e.target.value);
                if(+e.target.value <= selectedStartYear) {
                    if(selectedEndMonth === 0) {
                        setSelectedStartMonth(11);
                        setSelectedStartYear(+e.target.value-1);
                    } else {
                        setSelectedStartMonth(selectedEndMonth-1);
                        setSelectedStartYear(+e.target.value);
                    }
                }
            }
        }
    }

    const onDateClick = (date: Date) => {
        if (DateUtils.IsWeekend(date)) return;
        const firstDayOfStartMonth = new Date(selectedStartYear, selectedStartMonth, 1);
        const lastDayOfEndMonth = new Date(selectedEndYear, selectedEndMonth+1, 0);
        if(date < firstDayOfStartMonth) {
            onStartMonthChange(-1);
            if(!startDate) onEndMonthChange(-1);
        }
        if(date > lastDayOfEndMonth) {
            if(!startDate) onStartMonthChange(1);
            onEndMonthChange(1);
        }
        if (!startDate || (startDate && endDate)) {
          setStartDate(date);
          setEndDate(null);
        } else if (startDate && !endDate) {
          if (date < startDate) {
            setEndDate(startDate);
            setStartDate(date);
          } else {
            setEndDate(date);
          }
        }
    };

    const getWeekendDays = () => {
        if (!startDate || !endDate) return [];
        const weekends = [];
        const date = new Date(startDate);
        while (date <= endDate) {
          if (DateUtils.IsWeekend(date)) {
            weekends.push(DateUtils.FormatDate(date));
          }
          date.setDate(date.getDate() + 1);
        }
        return weekends;
    };

    const getWeekendsClicked = () => {
        if (startDate && endDate) {
            const selectedRange: [string, string] = [DateUtils.FormatDate(startDate), DateUtils.FormatDate(endDate)];
            const weekends = getWeekendDays();
            onChange(selectedRange, weekends);
        }
    };

    const onRangeButtonClick = (range: any) => {
        setStartDate(range.startDate);
        setEndDate(range.endDate);
        const startDate = new Date(range.startDate);
        const endDate = new Date(range.endDate);
        const startMonth = startDate.getMonth();
        const endMonth = endDate.getMonth();
        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();
        if(startMonth !== endMonth) {
            setSelectedStartMonth(startMonth);
            setSelectedEndMonth(endMonth);
            setSelectedStartYear(startYear);
            setSelectedEndYear(endYear);
        }
    }

    return (
        <div className="picker">
            <div className="date-picker-wrapper">
                <div className="daterange-header">
                    <span className="date">{startDate ? DateUtils.FormatDate(startDate) : "YYYY-MM-DD"}</span>
                    <span className="character"> ~ </span>
                    <span className="date">{endDate ? DateUtils.FormatDate(endDate) : "YYYY-MM-DD"}</span>
                </div>
                <div className="calendar-group">
                    <Calendar
                        id={DateUtils.CalendarType.Start}
                        dateRange={dateRange}
                        onDateClick={onDateClick}
                        onDropdownChange={onDropdownChange}
                        onMonthChange={onStartMonthChange}
                        selectedMonth={selectedStartMonth}
                        selectedYear={selectedStartYear}
                    />
                    <Calendar
                        id={DateUtils.CalendarType.End}
                        dateRange={dateRange}
                        onDateClick={onDateClick}
                        onDropdownChange={onDropdownChange}
                        onMonthChange={onEndMonthChange}
                        selectedMonth={selectedEndMonth}
                        selectedYear={selectedEndYear}
                    />
                </div>
            </div>
            <div className="picker-toolbar">
                <div className="stack-item">
                    <div className="picker-toolbar-ranges">
                        {defaultDateRanges.map((range) => (
                            <div className="stack-item" key={range.label}>
                                <button
                                    className="range-btn"
                                    onClick={() => onRangeButtonClick(range)}
                                >
                                    {range.label}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="stack-item">
                    <div className="picker-toolbar-right">
                        <button className="weekend-btn" onClick={getWeekendsClicked}>Get Weekends</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DateRangePicker;