import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDaysInMonth } from '../utils/dateUtils';

const CalendarView = ({ 
  currentDate, 
  navigateMonth, 
  handleDateClick, 
  selectedDate, 
  hasContentForDate,
  loading 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => navigateMonth(1)}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth(currentDate).map((date, index) => {
          const hasContent = hasContentForDate ? hasContentForDate(date) : false;
          const isSelected = selectedDate && date && selectedDate.toDateString() === date.toDateString();
          const isToday = date && new Date().toDateString() === date.toDateString();
          
          return (
            <button
              key={index}
              onClick={() => date && handleDateClick(date)}
              disabled={!date || loading}
              className={`
                h-10 rounded-lg text-sm font-medium transition-all relative
                ${!date ? 'invisible' : ''}
                ${hasContent 
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-2 border-blue-300' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
                ${isToday && !isSelected ? 'ring-1 ring-gray-400' : ''}
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {date ? date.getDate() : ''}
              {isToday && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500 space-y-1">
        <div className="flex justify-center items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 border-2 border-blue-300 rounded"></div>
          <span>Days with content</span>
        </div>
        <div className="flex justify-center items-center gap-2">
          <div className="w-3 h-3 border border-gray-400 rounded relative">
            <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-blue-600 rounded-full"></div>
          </div>
          <span>Today</span>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;