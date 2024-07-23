export function formatDate(timestamp) {
    if(!timestamp) return null
    let day = timestamp.slice(0, 2);
    let month = timestamp.slice(2, 4);
    let year = timestamp.slice(4, 8);
    let hours = timestamp.slice(9, 11);
    let minutes = timestamp.slice(11, 13);
    // let seconds = timestamp.slice(13, 15);

    // Create a new Date object
    let date = new Date(`${year}-${month}-${day}T${hours}:${minutes}`);

    // Options for formatting the date
    let options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        // second: '2-digit' 
    };

    // Convert to human-readable string
    return date.toLocaleString('en-US', options);
  }
  
 