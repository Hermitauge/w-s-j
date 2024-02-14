// main.js
import { VideoPlayback } from './videoController.js'; // Adjust the path as necessary
import { collectFilters, setupFilterCheckboxes } from './filters.js'; // Import filter-related functions

document.addEventListener('DOMContentLoaded', () => {
  const endpoint = 'https://api.williamandsonsjewelers.com/gemstones';
  let nextPageToken = null;
  let isLoading = false;
  let prefetchedData = [];

  // Fetch gemstones from the API with limit
  async function fetchGemstones(nextPageParam, gemstoneRequest) {
    isLoading = true;
    try {
      // Construct the URL with any query parameters (e.g., nextPageToken)
      const url = new URL(endpoint);
      if (nextPageParam) {
        url.searchParams.set('NextPage', nextPageParam);
      }

      // Construct the POST request options with the appropriate headers and body
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gemstoneRequest)
      };

      // Fetch data from the API
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      const data = await response.json();
      isLoading = false;
      return data;
    } catch (error) {
      // Handle any errors that occurred during the fetch
      isLoading = false;
      console.error('Failed to fetch gemstones:', error);
      // Optionally, return null or an empty object here so that the calling code can handle the error
      return null;
    }
  }

  // Pre-fetch gemstones
  async function prefetchGemstones() {
    const data = await fetchGemstones(nextPageToken, 50);
    if (data && data.GemStones) {
      prefetchedData = prefetchedData.concat(data.GemStones);
      nextPageToken = data.NextPage;
    }
  }

  // Renders gemstones on the page
  function renderGemstones() {
    const listingContainer = document.querySelector('.collection-listing');

    prefetchedData.splice(0, 50).forEach(gemstone => {
      const itemTemplate = document.querySelector('.collection-items').cloneNode(true);

      Object.entries(gemstone).forEach(([key, value]) => {
        const element = itemTemplate.querySelector(`[data-element="${key}"]`);
        if (element) {
          switch(element.tagName) {
            case 'IMG':
              if (key === 'Images') element.src = value[0]?.FullUrl || ''; // Assuming you want to display the first image
              break;
            case 'VIDEO':
              if (key === 'Videos') {
                element.src = value[0]?.Url || ''; // Assuming you want the first video URL
                VideoPlayback(element); // Set up play and pause on hover
              }
              break;
            case 'A':
              if (key === 'link') element.href = value;
              break;
            default:
                // Check if the value is an object and not null
                if (typeof value === 'object' && value !== null && value.Value && value.CurrencyCode) {
                  // Format the currency
                  let formattedValue = `$${parseInt(value.Value).toLocaleString()}`;
                  element.textContent = formattedValue;
                } else {
                  element.textContent = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                }
            }
          }
        });

      listingContainer.appendChild(itemTemplate);
    });

    isLoading = false;
    // Prefetch next batch if we've rendered some items and more are needed
    if (prefetchedData.length < 50) {
      prefetchGemstones();
    }
  }

  // Add scroll listener for infinite scrolling within .collection-list-wrapper
  const listWrapper = document.querySelector('.collection-list-wrapper');
  listWrapper.addEventListener('scroll', () => {
    const nearBottom = listWrapper.scrollHeight - listWrapper.scrollTop <= listWrapper.clientHeight + 100;
    if (!isLoading && nearBottom && prefetchedData.length > 0) {
      renderGemstones();
    }
  });

  // Function to handle filter changes
  function onFilterChange() {
    // Collect active filters
    const activeFilters = collectFilters();
    // Clear current data and prefetch again with new filters
    prefetchedData = [];
    nextPageToken = null;
    // Fetch and render gemstones with filters
    fetchGemstones(null, activeFilters).then(data => {
      if (data && data.GemStones) {
        prefetchedData = prefetchedData.concat(data.GemStones);
        nextPageToken = data.NextPage;
        const listingContainer = document.querySelector('.collection-listing');
        listingContainer.innerHTML = ''; // Clear current listings
        renderGemstones(); // Render with filters applied
      }
    });
  }

  // Set up event listeners for filter checkboxes
  setupFilterCheckboxes(onFilterChange);

  // Initial call to fetch and render gemstones after DOMContentLoaded event
  fetchGemstones().then(data => {
    if (data && data.GemStones) {
      prefetchedData = prefetchedData.concat(data.GemStones);
      nextPageToken = data.NextPage;
      renderGemstones();
    }
  });
});
