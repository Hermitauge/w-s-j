// filters.js
export function collectFilters() {
  const gemstoneRequest = {
    // Adjust field names to match your API's expected parameters
    SerialNumbers: [], // If the API expects "SerialNumber" instead of "SerialNumbers"
    Colors: [], // If the API expects "Color" instead of "Colors"
    Shapes: [], // If the API expects "Shape" instead of "Shapes"
    StoneTypes: [], // If the API expects "StoneType" instead of "StoneTypes"
    // Other specific filters as required by the API
  };

  document.querySelectorAll('[filter-by]').forEach(element => {
    if (element.checked) {
      const filterBy = element.getAttribute('filter-by');
      const filterValue = element.value; // Correctly using `value` here

      // Check if the filter category exists in the gemstoneRequest object
      if (Object.hasOwnProperty.call(gemstoneRequest, filterBy)) {
        gemstoneRequest[filterBy].push(filterValue);
      } else {
        console.warn(`Filter category '${filterBy}' is not recognized.`);
      }
    }
  });

  return gemstoneRequest;
}

export function setupFilterCheckboxes(onFilterChange) {
  document.querySelectorAll('[filter-by]').forEach(checkbox => {
    checkbox.addEventListener('change', onFilterChange);
  });
}