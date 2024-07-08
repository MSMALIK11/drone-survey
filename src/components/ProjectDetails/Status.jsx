import React from 'react';

const getStatusColor = (status="INITIATED") => {

  switch (status) {
    case 'IN-PROGRESS':
      return 'bg-blue-500 text-white text-md'; 
    case 'ON-HOLD':
      return 'bg-yellowTag'; 
    case 'COMPLETED':
      return 'bg-green-500 text-white '; 
    case 'INITIATED':
      return 'bg-gray-200 text-background'; 
    default:
      return 'bg-gray-500'; 
  }
};

const StatusBadge = ({ status }) => {
  const colorClass = getStatusColor(status);

  return (
    <div className={`px-2 text-sm py-1 rounded-lg text-background font-bold ${colorClass}`}>
      {status}
    </div>
  );
};

export default StatusBadge;
