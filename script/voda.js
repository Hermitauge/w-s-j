import { formatShape, formatPrice, formatCarats, formatCut } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@d69e7721e6f404c8467d7c1c16d8b366fd108dc0/script/formatData.js';  
import { showLoadingAnimation, hideLoadingAnimation, debounce } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@6b30df73e525982e0bece6ec0701b74f216a7b00/script/loadingAnimation.js';

document.addEventListener('DOMContentLoaded', async () => {
  const API_ENDPOINT = 'https://57urluwych.execute-api.us-west-1.amazonaws.com/live/diamonds';
  const collectionList = document.querySelector('.collection-list');
  const filters = initializeFilters();
  const mappings = initializeMappings();
  let currentPage = 1;
  let items = [];
  let totalItemsCount = 0;
  let itemTemplateElement = initializeItemTemplate(collectionList);
  let hasMoreItems = true; // Flag to check if there are more items to load
  let fetching = false;
  const collectionListWrapper = document.querySelector('.collection-list-wrapper'); // Adjust the selector as per your HTML structure
  collectionListWrapper.addEventListener('scroll', () => {
    if (isScrollNearBottom(collectionListWrapper) && !fetching && hasMoreItems) {
      fetchAndDisplayProducts(filters, currentPage);
    }
  });
  function isScrollNearBottom(element, threshold = 100) {
    return element.scrollHeight - (element.scrollTop + element.clientHeight) < threshold;
  }

  if (!itemTemplateElement) return;

  document.querySelectorAll('[filter-data]').forEach(element => {
    element.addEventListener('change', event => handleFilterChange(event, filters, mappings));
  });

  fetchAndDisplayProducts(); // Initial fetch without filters

  function initializeFilters() {
    return { shape: [], lab: [], origin: [], minPrice: '', maxPrice: '', minCarats: '', maxCarats: '', minColor: '', maxColor: '', minClarity: '', maxClarity: '', minCut: '', maxCut: '', minPolish: '', maxPolish: '', minSymmetry: '', maxSymmetry: '', minFluor: '', maxFluor: '', minTable: '', maxTable: '', minDepth: '', maxDepth: '', minRatio: '', maxRatio: '' };
  }

  function initializeMappings() {
    return { cut: ['F', 'GD', 'VG', 'EX'], color: ['J', 'I', 'H', 'G', 'F', 'E', 'D'], clarity: ['SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL'], polish: ['GD', 'VG', 'EX'], symmetry: ['GD', 'VG', 'EX'], fluor: ['VST', 'STG', 'MED', 'FNT', 'NON'] };
  }

  function initializeItemTemplate(collectionList) {
    if (collectionList.children.length > 0) {
      const template = collectionList.firstElementChild.cloneNode(true);
      collectionList.firstElementChild.remove();
      return template;
    } else {
      console.error('Unable to find item template.');
      return null;
    }
  }




  function clearList() {
    collectionList.innerHTML = ''; // Clears all items from the collection list
  }
  
function fetchAndDisplayProducts(filters = {}, page = 1) {
  if (fetching || !hasMoreItems) return;
  fetching = true;
  showLoadingAnimation();

  fetchProducts(filters, page).then(newItems => {
    if (newItems && newItems.length > 0) {
      renderItems(newItems);
      items = [...items, ...newItems];
      currentPage++;
    } else {
      hasMoreItems = false; // No more items to load
    }
    fetching = false;
    hideLoadingAnimation();
  });
}

  async function fetchProducts(filters, page) {
    const url = new URL(API_ENDPOINT);
    const setUrlParam = (param, value) => {
        if (value) url.searchParams.set(param, value);
    };

    setUrlParam('page', page);

    Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, v));
        } else {
            setUrlParam(key, value);
        }
    });

    console.log(`Fetching products with URL: ${url.href}`);
    const response = await fetch(url);  
    const data = await response.json();
    console.log('Products array from API:', data.items);  
    return data.items || [];  
}

function renderItems(items) {
    items.forEach(product => {
      const newItemElement = createItem(product);
      if (newItemElement) {
        collectionList.appendChild(newItemElement);
      }
    });
  }

  function createItem(product) {
    if (!product || !product.diamond || !product.diamond.certificate) {
      console.error('Invalid product data:', product);
      return null;
    }

    const newItem = itemTemplateElement.cloneNode(true);
    applyDataToItem(newItem, product);
    return newItem;
  }

  function applyDataToItem(element, product) {
    const dataMapping = {
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

    Object.entries(dataMapping).forEach(([key, value]) => {
      const elements = element.querySelectorAll(`[data-element="${key}"]`);
      elements.forEach(el => el.textContent = value);
    });
  }

  function handleFilterChange(event, filters, mappings) {
    const filterElement = event.target;
    const filterType = filterElement.getAttribute('filter-data');
    const filterValue = filterElement.type === 'checkbox' ? filterElement.id : filterElement.value;
  
    updateFilters(filters, filterType, filterValue, filterElement);
    applyMappingToFilters(filters, mappings);
    currentPage = 1;
    items = []; // Reset items array
    clearList(); // Clear existing items before fetching new ones
    fetchAndDisplayProducts(filters, currentPage);
  }

  function updateFilters(filters, filterType, filterValue, filterElement) {
    if (filterElement.type === 'checkbox') {
      if (filterElement.checked) {
        filters[filterType].push(filterValue);
      } else {
        filters[filterType] = filters[filterType].filter(value => value !== filterValue);
      }
    } else {
      filters[filterType] = filterValue;
    }
  }

  function applyMappingToFilters(filters, mappings) {
    const mapSliderValue = (mapping, value) => {
      const index = Math.min(Math.max(parseInt(value, 10), 0), mapping.length - 1);
      return mapping[index];
    };
  
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
  }
});

