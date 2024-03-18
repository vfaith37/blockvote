import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HiOutlineClock } from "react-icons/hi";

const DateTimePicker = () => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDateTime(date);
  };

  return (
    <div className="flex items-center gap-3">
      {/* <h1>From</h1> */}
      <HiOutlineClock size={20} />
      <DatePicker
        selected={selectedDateTime}
        onChange={handleDateChange}
        showTimeSelect
        placeholderText="From"
        dateFormat="MMMM d, yyyy h:mm aa"
        className="bg-transparent border-b border-white w-[150px] h-10 text-white"
      />
    </div>
  );
};

export default DateTimePicker;
