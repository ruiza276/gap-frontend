import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

const ContentDisplay = ({ dateLoading, selectedDate, selectedContent }) => {
  if (dateLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!selectedDate) {
    return (
      <div className="text-center py-16">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Date</h3>
        <p className="text-gray-500">Click on a date in the calendar to see what happened that day</p>
      </div>
    );
  }

  if (!selectedContent) {
    return (
      <div className="text-center py-16">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Nothing Here Yet</h3>
        <p className="text-gray-500 mb-4">
          No content available for {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        <p className="text-sm text-gray-400">Check back later - more content coming soon!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(selectedContent.date)}</span>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedContent.title}</h3>
      
      {selectedContent.type === 'image' && (
        <img 
          src={selectedContent.imageUrl} 
          alt={selectedContent.title}
          className="w-full rounded-lg mb-4"
        />
      )}
      
      <p className="text-gray-700 leading-relaxed mb-4">{selectedContent.content}</p>
      
      <div className="flex flex-wrap gap-2">
        {selectedContent.tags.map(tag => (
          <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ContentDisplay;