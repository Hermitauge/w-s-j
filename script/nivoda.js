import { formatShape, formatPrice, formatCarats, formatLength, formatWidth, formatDepth, formatTable, formatCut, formatDiamondIcon } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@873a511bc3a68ec8a96d90ce3b9fa32fb5359102/script/formatData.js';
import { showLoadingAnimation, hideLoadingAnimation, debounce } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@6b30df73e525982e0bece6ec0701b74f216a7b00/script/loadingAnimation.js';

class DiamondCollection {
  constructor() {
    this.API_ENDPOINT = 'https://api.wsjewelers.com/diamonds';
    this.collectionList = document.querySelector('.collection-listing');
    this.wrapperElement = document.querySelector('.collection-list-wrapper');
    this.currentPage = 1;
    this.fetching = false;
    this.hasMoreItems = true;
    this.itemTemplateElement = this.initializeItemTemplate();
    this.prefetchedItems = [];
    this.scrollThreshold = 100;
    this.filters = { shape: [], lab: [], origin: [], minPrice: '', maxPrice: '', minCarats: '', maxCarats: '', minColor: '', maxColor: '', minClarity: '', maxClarity: '', minCut: '', maxCut: '', minPolish: '', maxPolish: '', minSymmetry: '', maxSymmetry: '', minFluor: '', maxFluor: '', minTable: '', maxTable: '', minDepth: '', maxDepth: '', minRatio: '', maxRatio: '' };

    this.readUrlFiltersAndUpdate();
    if (this.itemTemplateElement) {
      this.bindEvents();
      this.fetchAndRenderProducts();
    }
  }

  readUrlFiltersAndUpdate() {
    const urlParams = new URLSearchParams(window.location.search);
    Object.keys(this.filters).forEach(filterKey => {
      if (urlParams.has(filterKey)) {
        const filterValue = urlParams.get(filterKey);
        if (filterKey in this.filters && typeof this.filters[filterKey] === 'string') {
          this.filters[filterKey] = filterValue;
        } else if (Array.isArray(this.filters[filterKey])) {
          this.filters[filterKey] = filterValue.split(','); // Assuming multiple values are comma-separated
        }
      }
    });
  }
  
  bindEvents() {
    this.wrapperElement.addEventListener('scroll', () => {
      if (this.isScrollNearBottom() && !this.fetching && this.hasMoreItems) {
        this.fetchAndRenderProducts();
      }
    });







    // Bind checkbox filters
    const checkboxFilters = document.querySelectorAll('[filter-data]');
    checkboxFilters.forEach(checkbox => {
      checkbox.addEventListener('change', this.debounce(this.handleCheckboxFilterChange.bind(this), 500));
    });

    // Bind range slider filters
    const rangeSliders = document.querySelectorAll('input[x-type="range"]');
    rangeSliders.forEach(slider => {
      slider.addEventListener('input', this.debounce(this.handleSliderFilterChange.bind(this), 500));
    });
  }
  debounce(func, wait) {
    return (...args) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => func.apply(this, args), wait);
    };
  } 
  initializeItemTemplate() {
    const { children } = this.collectionList;
    if (children.length === 0) {
      console.error('Unable to find item template.');
      return null;
    }
    const template = children[0].cloneNode(true);
    children[0].remove();
    return template;
  }

  async fetchAndRenderProducts() {
    if (this.fetching || !this.hasMoreItems) return;
    this.fetching = true;
    showLoadingAnimation();
    try {
      const items = this.prefetchedItems.length > 0 ? this.prefetchedItems : await this.fetchProducts();
      this.prefetchedItems = [];

      if (items.length > 0) {
        this.renderItems(items);
        this.currentPage++;
        this.prefetchNextPage();
      } else {
        this.hasMoreItems = false;
      }
    } catch (error) {
      console.error('Fetching products failed:', error);
    } finally {
      this.fetching = false;
      hideLoadingAnimation();
    }
  }

  async prefetchNextPage() {
    if (!this.hasMoreItems) return;
    try {
      this.prefetchedItems = await this.fetchProducts();
    } catch (error) {
      console.error('Prefetching products failed:', error);
      this.prefetchedItems = [];
    }
  }


  
  async fetchProducts() {
    const queryParams = this.constructQueryParameters();
    const url = `${this.API_ENDPOINT}?page=${this.currentPage}&${queryParams}`;
    console.log(`Fetching products with URL: ${url.href}`);
    const response = await fetch(url);
    const data = await response.json();
    console.log('Filter parameters:', this.filters);
    console.log('Products array from API:', data.items);
    return data.items || [];
  }

  renderItems(items) {
    const isGridViewActive = document.querySelector('#grid-view').classList.contains('tab-button-active');
    // Determine the template to use based on the view
    const templateElement = isGridViewActive ? this.gridItemTemplateElement : this.itemTemplateElement;
  
    items.forEach(item => {
      const newItemElement = this.createItemElement(item, templateElement);
      if (newItemElement) {
        this.collectionList.appendChild(newItemElement);
      }
    });
  
    formatDiamondIcon(); // Call the function after all items are added
  }

  createItemElement(product, templateElement) {
    if (!product || !product.diamond || !product.diamond.certificate) {
      console.error('Invalid product data:', product);
      return null;
    }

    const element = templateElement.cloneNode(true);
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
    const { scrollTop, clientHeight, scrollHeight } = this.wrapperElement;
    return scrollHeight - (scrollTop + clientHeight) < this.scrollThreshold;
  }
  handleCheckboxFilterChange(event) {
    const filterType = event.target.getAttribute('filter-data');
    const value = event.target;
    this.updateFilters(filterType, value);
    this.clearAndFetchFilteredProducts();
  }

  handleSliderFilterChange(event) {
    const filterType = event.target.id; // 'minPrice', 'maxPrice', 'minColor', 'maxColor', etc.
    const value = event.target.value;
    this.updateFilters(filterType, value);
    this.clearAndFetchFilteredProducts();
  }

  updateFilters(filterType, value) {
    if (['shape', 'lab', 'origin'].includes(filterType)) {
      // Checkbox filters
      const filterValues = this.filters[filterType];
      const valueIndex = filterValues.indexOf(value.id);
      if (value.checked && valueIndex === -1) {
        filterValues.push(value.id);
      } else if (!value.checked && valueIndex !== -1) {
        filterValues.splice(valueIndex, 1);
      }
    } else {
      // Range slider filters
      this.filters[filterType] = value;
    }
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
    this.updateUrlWithCurrentFilters();
    this.clearList();
    this.currentPage = 1;
    this.prefetchedItems = [];
    this.fetchAndRenderProducts();
  }

  updateUrlWithCurrentFilters() {
    const queryParams = new URLSearchParams();
    Object.entries(this.filters).forEach(([key, value]) => {
      if (value && value.length > 0) {
        queryParams.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    });

    const newUrl = `${window.location.origin}${window.location.pathname}?${queryParams.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  }
  

  clearList() {
    this.collectionList.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DiamondCollection();
});