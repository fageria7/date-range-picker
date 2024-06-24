import { useState } from 'react';
import DateRangePicker from './components/date-range-picker';
import "./App.css";

function App() {
  const [selectedRange, setSelectedRange] = useState<Array<string> | null>(null);
  const [weekendDates, setWeekendDates] = useState<Array<string>>([]);

  const handleDateRangeChange = (range: Array<string>, weekends: Array<string>) => {
    setSelectedRange(range);
    setWeekendDates(weekends);
  };

  const predefinedRanges = [
    {
      label: 'Last 7 Days',
      startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
      endDate: new Date(),
    },
    {
      label: 'Last 30 Days',
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: new Date(),
    },
  ];

  return (
    <div className="app">
        <DateRangePicker
          defaultDateRanges={predefinedRanges}
          onChange={handleDateRangeChange}
        />
        <div className="selected-range-list">
          {selectedRange && (
            <>
              <h2>Selected Range</h2>
              <p>Start Date: {selectedRange[0]}</p>
              <p>End Date: {selectedRange[1]}</p>
              <h2>Weekend Dates within Range</h2>
              <ul>
                {weekendDates.map((date) => (
                  <li key={date}>{date}</li>
                ))}
              </ul>
            </>
          )}
      </div>
    </div>
  );
}

export default App;
