async function fetchGemstones() {
    try {
      const response = await fetch('https://57urluwych.execute-api.us-west-1.amazonaws.com/live/gemstones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Add body parameters if required by the API
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      displayGemstones(data.gemStones); // Assuming the response has a 'gemStones' property
    } catch (error) {
      console.error('Fetching gemstones failed:', error);
    }
  }

  
  fetchGemstones();
  