// main.js
import { VideoPlayback } from './videoController.js'; // Adjust the path as necessary
import { collectFilters, setupFilterCheckboxes } from './filters.js'; // Import filter-related functions

document.addEventListener('DOMContentLoaded', () => {
  const endpoint = 'https://api.williamandsonsjewelers.com/gemstones';
  let nextPageToken = null;
  let isLoading = false;
  let prefetchedData = [];

  async function fetchGemstones(nextPageParam, gemstoneRequest) {
    isLoading = true;
    try {
      const url = new URL(endpoint);
      if (nextPageParam) {
        url.searchParams.set('NextPage', nextPageParam);
      }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gemstoneRequest)
      };
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      const data = await response.json();
      isLoading = false;
      return data;
    } catch (error) {
      isLoading = false;
      console.error('Failed to fetch gemstones:', error);
      return null;
    }
  }

  async function prefetchGemstones() {
    const data = await fetchGemstones(nextPageToken, {limit: 50}); // Corrected to match expected request format
    if (data && data.GemStones) {
      prefetchedData = prefetchedData.concat(data.GemStones);
      nextPageToken = data.NextPage;
    }
  }

  function renderGemstones() {
    const listingContainer = document.querySelector('.collection-listing');
    if (!listingContainer.firstElementChild) return; // Ensure there is a template to clone

    const itemTemplate = listingContainer.firstElementChild.cloneNode(true); // Use the first item as a template
    listingContainer.innerHTML = ''; // Clear current listings

    prefetchedData.forEach(gemstone => {
      const newItem = itemTemplate.cloneNode(true);

      Object.entries(gemstone).forEach(([key, value]) => {
        const element = newItem.querySelector(`[data-element="${key}"]`);
        if (element) {
          switch (element.tagName) {
            case 'IMG':
              if (key === 'Images') element.src = value[0]?.FullUrl || '';
              break;
            case 'VIDEO':
              if (key === 'Videos') {
                element.src = value[0]?.Url || '';
                VideoPlayback(element);
              }
              break;
            case 'A':
              if (key === 'link') element.href = value;
              break;
            default:
              if (typeof value === 'object' && value !== null && value.Value && value.CurrencyCode) {
                let formattedValue = `$${parseInt(value.Value).toLocaleString()}`;
                element.textContent = formattedValue;
              } else {
                element.textContent = value.toString().charAt(0).toUpperCase() + value.toString().slice(1).toLowerCase();
              }
          }
        }
      });

      listingContainer.appendChild(newItem);
    });

    isLoading = false;
    if (prefetchedData.length < 50) {
      prefetchGemstones();
    }
  }

  const listWrapper = document.querySelector('.collection-list-wrapper');
  listWrapper.addEventListener('scroll', () => {
    const nearBottom = listWrapper.scrollHeight - listWrapper.scrollTop <= listWrapper.clientHeight + 100;
    if (!isLoading && nearBottom && prefetchedData.length > 0) {
      renderGemstones();
    }
  });

  function onFilterChange() {
    const activeFilters = collectFilters();
    prefetchedData = [];
    nextPageToken = null;
    fetchGemstones(null, activeFilters).then(data => {
      if (data && data.GemStones) {
        prefetchedData = prefetchedData.concat(data.GemStones);
        nextPageToken = data.NextPage;
        const listingContainer = document.querySelector('.collection-listing');
        listingContainer.innerHTML = '';
        renderGemstones();
      }
    });
  }

  setupFilterCheckboxes(onFilterChange);

  fetchGemstones().then(data => {
    if (data && data.GemStones) {
      prefetchedData = prefetchedData.concat(data.GemStones);
      nextPageToken = data.NextPage;
      renderGemstones();
    }
  });
});
