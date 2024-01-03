import { formatShape, formatPrice, formatCarats, formatLength, formatWidth, formatDepth, formatTable, formatCut, formatDiamondIcon } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@d69e7721e6f404c8467d7c1c16d8b366fd108dc0/script/formatData.js';  
import { showLoadingAnimation, hideLoadingAnimation, debounce } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@6b30df73e525982e0bece6ec0701b74f216a7b00/script/loadingAnimation.js';

document.addEventListener('DOMContentLoaded', async () => {
  const API_ENDPOINT = 'https://57urluwych.execute-api.us-west-1.amazonaws.com/live/diamonds';
  const collectionList = document.querySelector('.collection-list');
  const collectionListWrapper = document.querySelector('.collection-list-wrapper');
  let currentPage = 1;
  let items = [];
  let isLoading = false;
  let totalItemsCount = 0;
  let isInteractionStarted = false;
  let isPageLoaded = false;

  let itemTemplateElement;
  if (collectionList.children.length > 0) {
    itemTemplateElement = collectionList.firstElementChild.cloneNode(true);
    collectionList.firstElementChild.remove();
  } else {
    console.error('Unable to find item template. The .collection-list element is missing or empty.');
    return;
  }
  
    // Initialize your filters object with the 'shape', 'lab', etc...
    let filters = { shape: [], lab: [], origin: [], minPrice: '', maxPrice: '', minCarats: '', maxCarats: '', minColor: '', maxColor: '', minClarity: '', maxClarity: '', minCut: '', maxCut: '', minPolish: '', maxPolish: '', minSymmetry: '', maxSymmetry: '', minFluor: '', maxFluor: '', minTable: '', maxTable: '', minDepth: '', maxDepth: '', minRatio: '', maxRatio: ''};
  
  
    const mappings = {
      cut: ['F', 'GD', 'VG', 'EX', 'ID', 'EIGHTX'],
      color: ['J', 'I', 'H', 'G', 'F', 'E', 'D'],
      clarity: ['SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL'],
      polish: ['GD', 'VG', 'EX'],
      symmetry: ['GD', 'VG', 'EX'],
      fluor: ['VST', 'STG', 'MED', 'FNT', 'NON']
  };
    // Function to create and append a new item using the template
    function createItem(product) {
      if (!product || !product.diamond || !product.diamond.certificate) {
        console.error('Product does not have the required properties:', product);
        return null;
      }
    
      const newItem = itemTemplateElement.cloneNode(true);
      const mappings = {
        "id": product.id,
        "video": product.diamond.video,
        "supplier_video_link": product.diamond.supplier_video_link,
        "shape": formatShape(product.diamond.certificate.shape),
        "clarity": product.diamond.certificate.clarity,
        "certNumber": product.diamond.certificate.certNumber,
        "symmetry": product.diamond.certificate.symmetry, 
        "polish": product.diamond.certificate.polish,
        "floInt": product.diamond.certificate.floInt,
        "width": product.diamond.certificate.width,
        "length": product.diamond.certificate.length,
        "depth": product.diamond.certificate.depth,
        "depthPercentage": product.diamond.certificate.depthPercentage, 
        "table": product.diamond.certificate.table,
        "girdle": product.diamond.certificate.girdle,
        "lab": product.diamond.certificate.lab,
        "carats": formatCarats(product.diamond.certificate.carats),
        "color": product.diamond.certificate.color,
        "cut": formatCut(product.diamond.certificate.cut),
        "availability": product.diamond.availability,
        "mine_of_origin": product.diamond.mine_of_origin,
        "price": formatPrice(product.price),
      };
    
      Object.keys(mappings).forEach(key => {
        const elements = newItem.querySelectorAll(`[data-element="${key}"]`);
        elements.forEach(element => {
          if (key === 'vvideo' && element.tagName === 'VIDEO') {
            element.src = mappings[key];
          } else if (key === 'vvideo' && element.tagName === 'VIDEO') {
            const source = element.querySelector('source');
            if (source) {
              source.src = mappings[key];
            }
          } else if (key === 'ssupplier_video_link' && element.tagName === 'IFRAME') {
            element.src = mappings[key];
          } else if (element.tagName === 'A') {
            element.href = mappings[key]; // Assuming that 'id' can be a link
            element.textContent = mappings[key];
          } else {
            element.textContent = mappings[key];
          }
        });
      });
      
      return newItem;
    }
  
  
    // Function to render items fetched from the API
// Function to render items fetched from the API
function renderItems(items) {
    items.forEach((product) => {
      const newItemElement = createItem(product);
      if (newItemElement) {
        collectionList.appendChild(newItemElement);
      }
    });
  }
  
  
    // Function to fetch products from the API with applied filters
    let isRequestInProgress = false;

    async function fetchProducts(filters, page = 1) {
      if (isRequestInProgress || !isInteractionStarted) {
        return [];
      }
    
      isRequestInProgress = true;
      const url = new URL(API_ENDPOINT);
    
      Object.keys(filters).forEach((key) => {
        if (Array.isArray(filters[key]) && filters[key].length > 0) {
          url.searchParams.append(key, filters[key].join(','));
        } else if (filters[key] !== null && filters[key] !== '' && filters[key] !== undefined) {
          url.searchParams.append(key, filters[key]);
        }
      });
    
      url.searchParams.append('page', page.toString());
    
      try {
        console.log(`Fetching products with URL: ${url.href}`);
        const response = await fetch(url);
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
    
        totalItemsCount = data.total_count || totalItemsCount;
        console.log('Filter parameters:', filters);
        console.log('Products array from API:', data.items);
    
        console.log('Products array from API:', data.items); 
        return data.items || [];
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      } finally {
        isRequestInProgress = false;
      }
    }
    
    
    

    // Function to handle the fetching and displaying of products
    function fetchAndDisplayProducts() {
      if (isInteractionStarted) {
          currentPage = 1;
          collectionList.innerHTML = '';
          isLoading = true;
          fetchProducts(filters, currentPage).then(newItems => {
            renderItems(newItems);
            isLoading = false; 
            items = newItems;
          });
      }
    }
    // Infinite scrolling logic
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    
    const loadMoreItems = debounce(() => {
        const prefetchOffset = 300; // Distance from the bottom at which to prefetch
        const contentHeight = collectionListWrapper.scrollHeight;
        const yOffset = collectionListWrapper.scrollTop; // Distance from the top
        const yLimit = collectionListWrapper.clientHeight + yOffset + prefetchOffset;
    
        if (yLimit >= contentHeight && !isLoading && items.length < totalItemsCount) {
            isLoading = true;
            fetchProducts(filters, currentPage + 1).then(newItems => {
                if (newItems.length > 0) {
                    currentPage += 1;
                    renderItems(newItems);
                    items = items.concat(newItems); // Append new items for future scroll calculations
                }
                isLoading = false; // Ready for the next loading
            });
        }
    }, 100); // 100 milliseconds debounce period
    
    
    collectionListWrapper.addEventListener('scroll', loadMoreItems);

  
    // Function to map slider values

    
// Mapping application to filters
const applyMappingToFilters = () => {
    const mapSliderValue = (mapping, value) => {return mapping[Math.min(Math.max(parseInt(value), 0), mapping.length - 1)];};
    
    const mappingConfig = {
      minCut: mappings.cut, 
      maxCut: mappings.cut, 
      minColor: mappings.color, 
      maxColor: mappings.color, 
      minClarity: mappings.clarity, 
      maxClarity: mappings.clarity, 
      minPolish: mappings.polish, 
      maxPolish: mappings.polish, 
      minSymmetry: mappings.symmetry, 
      maxSymmetry: mappings.symmetry, 
      minFluor: mappings.fluor, 
      maxFluor: mappings.fluor
    };
   
    Object.entries(mappingConfig).forEach(([filterKey, mapping]) => {
      let minKey = `min${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}`;
      let maxKey = `max${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}`;
  
      if (filters[minKey] !== undefined && filters[minKey] !== '') {
        filters[minKey] = mapSliderValue(mapping, filters[minKey]);
      }
      if (filters[maxKey] !== undefined && filters[maxKey] !== '') {
        filters[maxKey] = mapSliderValue(mapping, filters[maxKey]);
      }
    });
  };
  





  // The event handler for filters
  function handleFilterChange(event) {
    const filterElement = event.target;
    let filterType = filterElement.getAttribute('filter-data');
    filterType = filterType.charAt(0).toLowerCase() + filterType.slice(1);
    const filterValue = filterElement.id;
  
    if (isPageLoaded || isInteractionStarted) {
      isInteractionStarted = true;
  
      if (filterType && filters[filterType] !== undefined) {
        if (filterElement.type === 'checkbox') {
          if (filterElement.checked) {
            filters[filterType].push(filterValue);
          } else {
            const index = filters[filterType].indexOf(filterValue);
            if (index > -1) {
              filters[filterType].splice(index, 1);
            }
          }
        } else if (filterElement.nodeName === 'INPUT' && filterElement.value !== '') {
          if (filterElement.type === 'range') {
            filters[filterType] = parseInt(filterElement.value, 10);
          } else {
            filters[filterType] = filterElement.value;
          }
  
          applyMappingToFilters(); // Apply the mappings immediately after a change is detected.
        } 
        currentPage = 1;
        fetchAndDisplayProducts();
      } else {
        console.warn(`Changed filter of type "${filterType}" is not supported`)
      }
    }
  }
  
  
  

  document.querySelectorAll('[filter-data]').forEach((element) => {
    element.addEventListener('change', handleFilterChange);
  });

  fetchAndDisplayProducts();

  // Set isPageLoaded to true after initialization code
  isPageLoaded = true;
});