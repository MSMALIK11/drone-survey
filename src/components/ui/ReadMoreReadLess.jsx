import React, { useState } from 'react';

const ReadMoreReadLess = ({ description }) => {
  const [showFullText, setShowFullText] = useState(false);

  // Check if description length is more than 180 characters
  const isLongText = description.length > 180;

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  // Function to display shortened or full text
  const displayText = () => {
    if (showFullText) {
      return description;
    } else {
      return description.slice(0,220) + (description.length > 200 ? '...' : '');
    }
  };

  return (
    <div className='flex gap-2'>
      <p style={{whiteSpace:'wrap'}}>{displayText()}
         {isLongText && (
        <button onClick={toggleText} className='text-softBlue ms-2 hover:underline'>
          {showFullText ? ' Show less' : 'Read more'}
        </button>
      )}</p>
      
    </div>
  );
};

export default ReadMoreReadLess;
