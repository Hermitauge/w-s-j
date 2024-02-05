import { formatShape, formatPrice, formatCarats, formatLength, formatWidth, formatDepth, formatTable, formatCut, formatDiamondIcon } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@873a511bc3a68ec8a96d90ce3b9fa32fb5359102/script/formatData.js';
import { showLoadingAnimation, hideLoadingAnimation, debounce } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@6b30df73e525982e0bece6ec0701b74f216a7b00/script/loadingAnimation.js';
import { handlePanelClick, processVideo, bindProductDataToElement } from 'https://cdn.jsdelivr.net/gh/Hermitauge/w-s-j@1a535a8641e87e435ae5e42142e91dd48ce89860/script/utils.js';


class DiamondCollection {
  constructor() {
    console.log('DiamondCollection constructor called');
    this.API_ENDPOINT = 'https://api.wsjewelers.com/diamonds';
    this.listInstance = document.querySelector('.collection-listing');
    this.wrapperElement = document.querySelector('.collection-list-wrapper');
    this.currentPage = 1;
    this.fetching = false;
    this.hasMoreItems = true;
    this.itemTemplateElement = this.listInstance.firstElementChild.cloneNode(true);
    this.bindTabButtons();
    this.scrollThreshold = 100;
    this.filters = {
      shape: [], lab: [], origin: [], minPrice: '', maxPrice: '',
      minCarats: '', maxCarats: '', minColor: '', maxColor: '',
      minClarity: '', maxClarity: '', minCut: '', maxCut: '',
      minPolish: '', maxPolish: '', minSymmetry: '', maxSymmetry: '',
      minFluor: '', maxFluor: '', minTable: '', maxTable: '',
      minDepth: '', maxDepth: '', minRatio: '', maxRatio: ''
    };
    this.readUrlFiltersAndUpdate();
    if (this.itemTemplateElement) {
      this.bindEvents();
      this.clearAndFetchFilteredProducts(false); // Prevent URL update on initial load
    }
    this.reinitializeWebflowInteractions();
    this.initializeStripePayment();
  }
  bindTabButtons() {
    document.querySelectorAll('.tab-buttons').forEach(button => {
        button.addEventListener('click', () => {
            // Update the template when a tab button is clicked
            this.itemTemplateElement = this.listInstance.firstElementChild.cloneNode(true);
        });
    });
}
  readUrlFiltersAndUpdate() {
    console.log('readUrlFiltersAndUpdate called');
    const urlParams = new URLSearchParams(window.location.search);
    console.log('URL Parameters:', urlParams.toString()); // Debug log

    if (urlParams.toString() === '') {
        return; // If no parameters, skip updating filters
    }

    Object.keys(this.filters).forEach(filterKey => {
        if (urlParams.has(filterKey)) {
            const filterValue = urlParams.get(filterKey);
            if (filterKey in this.filters && typeof this.filters[filterKey] === 'string') {
                this.filters[filterKey] = filterValue;
            } else if (Array.isArray(this.filters[filterKey])) {
                this.filters[filterKey] = filterValue.split(','); // Assuming multiple values are comma-separated
            }

            // Update UI for checkbox filters
            if (Array.isArray(this.filters[filterKey])) {
                this.filters[filterKey].forEach(value => {
                    const checkboxInput = document.querySelector(`input[filter-data="${filterKey}"][id="${value}"]`);
                    const visualCheckboxDiv = checkboxInput?.previousElementSibling;
                    if (checkboxInput && visualCheckboxDiv) {
                        checkboxInput.checked = true;
                        visualCheckboxDiv.classList.add('w--redirected-checked');
                    }
                });
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

    // Bind both checkbox and range slider filters
    document.querySelectorAll('[filter-data], input[x-type="range"]').forEach(element => {
        const isRangeSlider = element.getAttribute('x-type') === 'range';
        const eventType = isRangeSlider ? 'input' : 'change';
        const handler = isRangeSlider ? this.handleSliderFilterChange : this.handleCheckboxFilterChange;
        element.addEventListener(eventType, debounce(handler.bind(this), 500));
    });
}
  debounce(func, wait) {
    return (...args) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => func.apply(this, args), wait);
    };
  } 
  initializeItemTemplate() {
    const { children } = this.listInstance;
    if (children.length === 0) {
      console.error('Unable to find item template.');
      return null;
    }
    const template = children[0].cloneNode(true);
    children[0].remove();
    return template;
  }
  async fetchAndRenderProducts() {
    console.log('fetchAndRenderProducts called');
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
    // Use the current itemTemplateElement as the template
    items.forEach(item => {
        const newItemElement = this.createItemElement(item, this.itemTemplateElement);
        if (newItemElement) {
            this.listInstance.appendChild(newItemElement);
        }
    });
    formatDiamondIcon();
    this.reinitializeWebflowInteractions();
  }
  reinitializeWebflowInteractions() {
    Webflow.destroy();
    Webflow.ready();
    Webflow.require('ix2').init();
  }

  createItemElement(product, templateElement) {
    if (!product || !product || !product.v360 || !product.certificate) {
        console.error('Invalid product data:', product);
        return null;
    }

    const element = templateElement.cloneNode(true);
    bindProductDataToElement(element, product); // Using the imported function



    // Store the raw price in the purchase button's data attribute
    const purchaseButton = element.querySelector('[data-element="buy"]');
    if (purchaseButton) {
        purchaseButton.setAttribute('data-price', product.price); // Assuming 'product.price' is the raw price
    }



        return element;
    }



    // Initialize Stripe payment handling
    initializeStripePayment() {
      document.addEventListener('click', (event) => {
          if (event.target.matches('[data-element="buy"], [data-element="buy"] *')) {
              const purchaseButton = event.target.closest('[data-element="buy"]');
              const orderflowElement = purchaseButton.closest('.orderflow');
              const productName = orderflowElement.querySelector('[data-element="name"]').innerText;
              const productCertNumber = orderflowElement.querySelector('[data-element="certNumber"]').innerText;
              const productPrice = orderflowElement.querySelector('[data-element="price"]').innerText.replace('$', '').replace(/,/g, '');
  
              fetch('https://mwjw6060jh.execute-api.us-west-1.amazonaws.com/live/Stripe', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      productName: productName,
                      productCertNumber: productCertNumber,
                      productPrice: productPrice,
                  }),
              })
              .then(response => response.json())
              .then(data => {
                  window.location.href = data.url; // Redirect to Stripe Checkout
              })
              .catch(error => console.error('Error:', error));
          }
      });
  }
  

  isScrollNearBottom() {
    const { scrollTop, clientHeight, scrollHeight } = this.wrapperElement;
    return scrollHeight - (scrollTop + clientHeight) < this.scrollThreshold;
  }
  handleCheckboxFilterChange(event) {
    console.log('Checkbox filter changed', event.target);
    const filterType = event.target.getAttribute('filter-data');
    const value = event.target;
    this.updateFilters(filterType, value);
    this.clearAndFetchFilteredProducts();
  }
  handleSliderFilterChange(event) {
    console.log('Slider filter changed', event.target);
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
  clearAndFetchFilteredProducts(updateUrl = true) {
    if (updateUrl) {
      this.updateUrlWithCurrentFilters();
    }
    this.clearList();
    this.currentPage = 1;
    this.prefetchedItems = [];
    this.fetchAndRenderProducts();
  }
  updateUrlWithCurrentFilters() {
    console.log('updateUrlWithCurrentFilters called');
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
    this.listInstance.innerHTML = '';
  }
}
window.onload = () => {
  console.log('Page fully loaded, including all resources');
  console.log('DOMContentLoaded - creating DiamondCollection instance');
  new DiamondCollection();
};
