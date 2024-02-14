// filters.js
// Function to collect filters based on the checkboxes
export function collectFilters() {
  const gemstoneRequest = {
    SerialNumbers: [], // Assuming there are filters for SerialNumbers
    Colors: [],
    Shapes: [],
    StoneTypes: [],
    Filters: [], // Potentially for additional filters not specified in the image
    // ... include other filterable properties as needed ...
  };

  document.querySelectorAll('[filter-by]').forEach(element => {
    if (element.checked) {
      const filterBy = element.getAttribute('filter-by');
      const filterValue = element.id;

      // Ensure that the filter category exists in gemstoneRequest
      if (!gemstoneRequest[filterBy]) {
        gemstoneRequest[filterBy] = [];
      }
      gemstoneRequest[filterBy].push(filterValue);
    }
  });

  return gemstoneRequest;
}
// Set up filter checkboxes event listeners and callback function
export function setupFilterCheckboxes(onFilterChange) {
  document.querySelectorAll('[filter-by]').forEach(checkbox => {
    checkbox.addEventListener('change', onFilterChange);
  });
}
