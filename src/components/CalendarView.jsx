import React, { useState } from 'react';

const CalendarView = ({ onDateSelect, selectedDate, timelineItems = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDateKey = (day, month, year) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const hasContent = (day) => {
    const dateKey = formatDateKey(day, currentMonth, currentYear);
    return timelineItems.some(item => item.date === dateKey);
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const dateKey = formatDateKey(day, currentMonth, currentYear);
    return selectedDate === dateKey;
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
  };

  const handleDateClick = (day) => {
    const dateKey = formatDateKey(day, currentMonth, currentYear);
    onDateSelect(dateKey);
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day-empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayClasses = [
        'calendar-day',
        hasContent(day) ? 'has-content' : '',
        isSelected(day) ? 'selected' : '',
        isToday(day) ? 'today' : ''
      ].filter(Boolean).join(' ');

      days.push(
        <button
          key={day}
          className={dayClasses}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button 
          className="calendar-nav-btn"
          onClick={() => navigateMonth('prev')}
        >
          ‹
        </button>
        <h3 className="calendar-month-year">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button 
          className="calendar-nav-btn"
          onClick={() => navigateMonth('next')}
        >
          ›
        </button>
      </div>

      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {renderCalendarDays()}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-dot today-dot"></div>
          <span>Today</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot content-dot"></div>
          <span>Has Content</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot selected-dot"></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
