import React from 'react';

const Each = ({ render, of }) => {
    // Check if 'render' is a function
    if (typeof render !== 'function') {
        console.error('Each component expects a function as the render prop.');
        return null;
    }

    // Check if 'of' is an array or undefined/null
    if (!Array.isArray(of)) {
        console.error('Each component expects an array, undefined, or null as the of prop.');
        return null;
    }

    // Render the items if the 'of' array is not empty
    return (
        <>
            {of.length > 0 && of.map((item, index) => render(item, index))}
        </>
    );
};

export default Each;
