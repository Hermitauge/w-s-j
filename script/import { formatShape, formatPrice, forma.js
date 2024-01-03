import { formatShape, formatPrice, formatCarats, formatCut, formatDiamondIcon } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@873a511bc3a68ec8a96d90ce3b9fa32fb5359102/script/formatData.js';
import { showLoadingAnimation, hideLoadingAnimation, debounce } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@6b30df73e525982e0bece6ec0701b74f216a7b00/script/loadingAnimation.js';

class DiamondCollection {
  constructor() {
    this.API_ENDPOINT = 'https://57urluwych.execute-api.us-west-1.amazonaws.com/live/diamonds';
    this.collectionList = document.querySelector('.collection-list');
    this.currentPage = 1;
    this.hasMoreItems = true;
    this.scrollThreshold = 100;
    this.filters = { shape: [], lab: [], origin: [], minPrice: '', maxPrice: '', minCarats: '', maxCarats: '', minColor: '', maxColor: '', minClarity: '', maxClarity: '', minCut: '', maxCut: '', minPolish: '', maxPolish: '', minSymmetry: '', maxSymmetry: '', minFluor: '', maxFluor: '', minTable: '', maxTable: '', minDepth: '', maxDepth: '', minRatio: '', maxRatio: '' };
    this.itemTemplateElement = this.initializeItemTemplate();
    this.init();
  }

  init() {
    this.bindUIEvents();
    this.fetchAndRenderProducts();
  }

  initializeItemTemplate() {
    const children = this.collectionList.children;
    if (children.length === 0) {
      console.error('Unable to find item template.');
      return null;
    }
    // Clone the first child (template element) and then remove it from the DOM
    const template = children[0].cloneNode(true);
    this.collectionList.removeChild(children[0]);
    return template;
  }

  bindUIEvents() {
    document.querySelector('.collection-list-wrapper').addEventListener('scroll', debounce(() => {
      if (this.isScrollNearBottom() && this.hasMoreItems && !this.fetching) {
        this.fetching = true;
        this.renderItems(this.prefetchedItems);
        this.prefetchedItems = [];
        this.prefetchNextPage();
      }
    }, 300));

    document.querySelectorAll('[filter-data]').forEach(checkbox => {
      checkbox.addEventListener('change', debounce(this.handleFilterChange.bind(this), 500));
    });

    document.querySelectorAll('input[x-type="range"]').forEach(slider => {
      slider.addEventListener('input', debounce(this.handleFilterChange.bind(this), 500));
    });
  }

  async fetchAndRenderProducts() {
    if (!this.hasMoreItems) return;
    showLoadingAnimation();
    await this.prefetchNextPage();
    this.renderItems(this.prefetchedItems);
    this.prefetchedItems = [];
    hideLoadingAnimation();
  }

  async prefetchNextPage() {
    try {
      const items = await this.fetchProducts(this.currentPage);
      this.prefetchedItems = items;
      this.hasMoreItems = items.length > 0;
      if (this.hasMoreItems) {
        this.currentPage++;
      }
    } catch (error) {
      console.error('Error prefetching products:', error);
      this.hasMoreItems = false;
    }
  }

  async fetchProducts() {
    const url = `${this.API_ENDPOINT}?page=${this.currentPage}&${this.constructQueryParameters()}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items || [];
  }

  renderItems(items) {
    items.forEach(item => {
      const element = this.createItemElement(item);
      if (element) {
        this.collectionList.appendChild(element);
      }
    });
    formatDiamondIcon();
  }


  createItemElement(product) {
    if (!this.itemTemplateElement) {
      console.error('No valid item template element available for cloning.');
      return null;
    }
    if (!product || !product.diamond || !product.diamond.certificate) {
      console.error('Invalid product data:', product);
      return null;
    }


    // Here we use 'this.itemTemplateElement' directly instead of expecting it as an argument
    const element = this.itemTemplateElement.cloneNode(true);
    this.bindProductDataToElement(element, product);

    // Event listener integration
    const openPanel = element.querySelector('.main-panel');
    if (openPanel) {
        openPanel.addEventListener('click', (event) => this.handlePanelClick(event, element));
    }

    return element;
}

handlePanelClick(event, newItem) {
    if (!event.target.closest('.td.compare')) {
        const infoPanel = newItem.querySelector('.info-panel');
        infoPanel?.classList.toggle('hide');

        if (!infoPanel.classList.contains('hide')) {
            // Video processing logic
            const videoElement = newItem.querySelector('.video-iframe');
            this.processVideo(videoElement);
        }
    }
}

processVideo(videoElement) {
    if (videoElement && videoElement.textContent) {
        const iframe = document.createElement('iframe');
        let videoURL = videoElement.textContent.trim();
        let modifiedVideoURL = videoURL ? videoURL.replace('500/500', '420/420/autoplay') : '';

        if (modifiedVideoURL) {
            iframe.src = modifiedVideoURL;
            iframe.width = '420';
            iframe.height = '420';
            iframe.frameBorder = '0';
            iframe.allow = 'autoplay; encrypted-media';
            iframe.allowFullscreen = true;

            videoElement.replaceWith(iframe);
        }
    }
  }

  bindProductDataToElement(element, product) {
    const {
      id, diamond: {
      video,
      supplier_video_link,
      certificate: {
          shape, clarity, certNumber, symmetry,
          polish, floInt, width, length, depth,
          depthPercentage, table, girdle, lab,
          carats, color, cut
      },
      availability, mine_of_origin
      },
      price
    } = product;
    
    const dataMapping = {
      "id": id,
      "video": video,
      "supplier_video_link": supplier_video_link,
      "shape": formatShape(shape),
      "clarity": clarity,
      "certNumber": certNumber,
      "symmetry": symmetry,
      "polish": polish,
      "floInt": floInt,
      "width": width,
      "length": length,
      "depth": depth,
      "depthPercentage": depthPercentage,
      "table": table,
      "girdle": girdle,
      "lab": lab,
      "carats": formatCarats(carats),
      "color": color,
      "cut": formatCut(cut),
      "availability": availability,
      "mine_of_origin": mine_of_origin,
      "price": formatPrice(price),
    };

    Object.keys(dataMapping).forEach(key => {
      const elements = element.querySelectorAll(`[data-element="${key}"]`);
      elements.forEach(el => {
          if (key === 'video' && el.tagName === 'IFRAME' && dataMapping[key]) {
              const modifiedVideoURL = dataMapping[key].replace('500/500', '500/500/');
              el.src = modifiedVideoURL;
          } else if (key === 'video' && el.classList.contains('vid-source') && dataMapping[key]) {
              el.setAttribute('src', dataMapping[key]);
          } else {
              el.textContent = dataMapping[key];
          }
      });
  });
}

isScrollNearBottom() {
  const { scrollTop, clientHeight, scrollHeight } = document.querySelector('.collection-list-wrapper');
  return scrollHeight - (scrollTop + clientHeight) < this.scrollThreshold;
}

handleFilterChange(event) {
  const filterType = event.target.getAttribute('data-filter');
  const filterValue = event.target.value;
  let filterValues;

  switch (event.target.type) {
    case 'checkbox':
      filterValues = this.filters[filterType] || [];
      if (event.target.checked) {
        filterValues.push(filterValue);
      } else {
        const index = filterValues.indexOf(filterValue);
        if (index > -1) {
          filterValues.splice(index, 1);
        }
      }
      this.filters[filterType] = filterValues;
      break;
    case 'range':
      // Assuming the range filter modifies a single value, not a pair
      this.filters[filterType] = filterValue;
      break;
    // You can include additional case handlers for other types of inputs as needed
  }

updateCheckboxFilter(filterType, checkbox) {
  const filterValues = this.filters[filterType];
  const valueIndex = filterValues.indexOf(checkbox.value);
  if (checkbox.checked && valueIndex === -1) {
    filterValues.push(checkbox.value);
  } else if (!checkbox.checked && valueIndex !== -1) {
    filterValues.splice(valueIndex, 1);
  }
}
this.clearAndFetchFilteredProducts();
}
constructQueryParameters() {
  const mappings = {
    cut: ['F', 'GD', 'VG', 'EX', 'ID', 'EIGHTX'],
    color: ['J', 'I', 'H', 'G', 'F', 'E', 'D'],
    clarity: ['SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL'],
    polish: ['GD', 'VG', 'EX'],
    symmetry: ['GD', 'VG', 'EX'],
    fluor: ['VST', 'STG', 'MED', 'FNT', 'NON']
  };

  const queryParams = new URLSearchParams();

  Object.entries(this.filters).forEach(([key, value]) => {
    if (value === '' || value.length === 0) return;

    if (mappings.hasOwnProperty(key.replace('min', '').replace('max', '').toLowerCase())) {
      // Mapping for selectors that have corresponding mapping values
      const isMin = key.startsWith('min');
      const baseKey = key.replace('min', '').replace('max', '').toLowerCase();
      const mappedValue = mappings[baseKey][parseInt(value)];
      if (mappedValue) queryParams.append(key, mappedValue);
    } else if (Array.isArray(value)) {
      // Checkbox filters
      value.forEach(val => queryParams.append(key, val));
    } else {
      // Range slider filters that don't require mapping (direct value)
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  console.log(`${this.API_ENDPOINT}?${queryString}`); // Log the full API URL with query parameters

  return queryString;
}

clearAndFetchFilteredProducts() {
  this.collectionList.innerHTML = ''; // Clear the current items
  this.currentPage = 1; // Reset page count to fetch from the first page
  this.prefetchedItems = [];
  this.fetchAndRenderProducts();
}
}

document.addEventListener('DOMContentLoaded', () => new DiamondCollection());