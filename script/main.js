import { formatShape, formatPrice, formatCarats, formatLength, formatWidth, formatDepth, formatTable, formatCut, formatDiamondIcon } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@d69e7721e6f404c8467d7c1c16d8b366fd108dc0/script/formatData.js';  
import { showLoadingAnimation, hideLoadingAnimation } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@54fed807015947b7220694ee5b5941b193470e2e/script/loadingAnimation.js';

(() => {
  window.addEventListener('load', async () => {
          let listInstance, itemTemplateElement, allProducts;
          let checkedShapes = [], checkedLabs = [], checkedOrigin = [];

          const fetchAndInitialize = async () => {
            showLoadingAnimation();
            allProducts = await fetchProducts('');
            hideLoadingAnimation();
            updateList(allProducts, listInstance, itemTemplateElement);
            attachAllEventListeners(listInstance, itemTemplateElement);
            updateItemCounters(allProducts, allProducts);
          };
          window.fsAttributes = window.fsAttributes || [];
          window.fsAttributes.push([
            "cmsfilter"
            , async (filtersInstances) => {
              const [filtersInstance] = filtersInstances;
              listInstance = filtersInstance.listInstance;
              const [firstItem] = listInstance.items;
              itemTemplateElement = firstItem.element;

              // Fetch and initialize with all products
              await fetchAndInitialize();
            }
          , ]);

  
      function updateItemCounters(allProducts, displayedProducts) {
        const totalCountElement = document.querySelector('[data-element="total-count"]');
        const totalShownElement = document.querySelector('[data-element="total-shown"]');
    
        if (totalCountElement) {
            totalCountElement.textContent = allProducts.length;
        }
    
        if (totalShownElement) {
            totalShownElement.textContent = displayedProducts.length;
        }
    }
    const attachRangeEventListeners = (minInputId, maxInputId) => {
      const minInput = document.getElementById(minInputId);
      const maxInput = document.getElementById(maxInputId);
      [minInput, maxInput].forEach(element => {
          if (element) {
              element.addEventListener('change', debounce(applyAllFilters, 420));
          }
      });
  };

  const attachCheckboxEventListeners = (checkboxSelector, updateFunction) => {
      document.querySelectorAll(checkboxSelector).forEach(label => {
          const checkbox = label.querySelector("input[type='checkbox']");
          const labelText = label.querySelector("span");
          if (checkbox && labelText) {
              checkbox.addEventListener('change', async () => {
                  updateFunction(labelText.textContent, checkbox.checked);
                  await applyAllFilters();
              });
          }
      });
  };

  const updateCheckedShapes = (shape, isChecked) => {
      checkedShapes = isChecked ? [...checkedShapes, shape] : checkedShapes.filter(s => s !== shape);
  };

  const updateCheckedLabs = (lab, isChecked) => {
      checkedLabs = isChecked ? [...checkedLabs, lab] : checkedLabs.filter(l => l !== lab);
  };

  const updateCheckedOrigin = (origin, isChecked) => {
    checkedOrigin = isChecked ? [...checkedOrigin, origin] : checkedOrigin.filter(o => o !== origin);
  };

  const attachAllEventListeners = () => {
      ['priceFrom', 'priceTo', 'minCarats', 'maxCarats', 'minColor', 'maxColor', 'minClarity', 'maxClarity', 'minCut', 'maxCut', 'minPolish', 'maxPolish', 'minSymmetry', 'maxSymmetry', 'minFluor', 'maxFluor', 'minTable', 'maxTable', 'minDepth', 'maxDepth', 'minRatio', 'maxRatio'].forEach(id => {
          attachRangeEventListeners(id, id);
      });
      attachCheckboxEventListeners('.shape-checkbox_field', updateCheckedShapes);
      attachCheckboxEventListeners('.lab-checkbox_field', updateCheckedLabs);
      attachCheckboxEventListeners('.origin-checkbox_field', updateCheckedOrigin);
  };

  const debounce = (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
          clearTimeout(timeout);
          timeout = setTimeout(() => func(...args), wait);
      };
  };




async function fetchProductsForFilters(checkedShapes, minPrice, maxPrice, minCarats, maxCarats, minColor, maxColor, minClarity, maxClarity, minCut, maxCut, checkedLabs, minPolish, maxPolish, minSymmetry, maxSymmetry, minFluor, maxFluor, minTable, maxTable, minDepth, maxDepth, minRatio, maxRatio, checkedOrigin) {  
  let products = [];  

  // Check if any filter is set by the user
  const isFilterSet = value => value !== '' && value != null;

  // Determine if any filter is applied
  const isAnyFilterApplied = [minPrice, maxPrice, minCarats, maxCarats, minColor, maxColor, minClarity, maxClarity, minCut, maxCut, minPolish, maxPolish, minSymmetry, maxSymmetry, minFluor, maxFluor, minTable, maxTable, minDepth, maxDepth, minRatio, maxRatio].some(isFilterSet) || checkedShapes.length > 0 || checkedLabs.length > 0 || checkedOrigin.length > 0;

  if (!isAnyFilterApplied) {
      // Return all products if no filters are applied
      products = await fetchProducts();
  } else {
      // Fetch products based on applied filters
      const shapesToQuery = checkedShapes.length > 0 ? checkedShapes : ['']; 
      const productsPromises = shapesToQuery.map(shape => 
        fetchProducts(
            shape, 
            isFilterSet(minPrice) ? minPrice : '', 
            isFilterSet(maxPrice) ? maxPrice : '', 
            isFilterSet(minCarats) ? minCarats : '', 
            isFilterSet(maxCarats) ? maxCarats : '', 
            isFilterSet(minColor) ? minColor : '', 
            isFilterSet(maxColor) ? maxColor : '', 
            isFilterSet(minClarity) ? minClarity : '', 
            isFilterSet(maxClarity) ? maxClarity : '', 
            isFilterSet(minCut) ? minCut : '', 
            isFilterSet(maxCut) ? maxCut : '', 
            checkedLabs, // Assuming checkedLabs is an array and always defined
            isFilterSet(minPolish) ? minPolish : '', 
            isFilterSet(maxPolish) ? maxPolish : '', 
            isFilterSet(minSymmetry) ? minSymmetry : '', 
            isFilterSet(maxSymmetry) ? maxSymmetry : '', 
            isFilterSet(minFluor) ? minFluor : '', 
            isFilterSet(maxFluor) ? maxFluor : '', 
            isFilterSet(minTable) ? minTable : '', 
            isFilterSet(maxTable) ? maxTable : '', 
            isFilterSet(minDepth) ? minDepth : '', 
            isFilterSet(maxDepth) ? maxDepth : '', 
            isFilterSet(minRatio) ? minRatio : '', 
            isFilterSet(maxRatio) ? maxRatio : '',
            checkedOrigin
        )
    );
    
      const productsArrays = await Promise.all(productsPromises);
      products = interleaveProducts(productsArrays);
  }

  return products;  
}

    async function applyAllFilters() {  
        const minPrice = document.getElementById('priceFrom').value;  
        const maxPrice = document.getElementById('priceTo').value;  
        const minCarats = document.getElementById('minCarats').value;  
        const maxCarats = document.getElementById('maxCarats').value;  
        const minColor = document.getElementById('minColor').value;  
        const maxColor = document.getElementById('maxColor').value;  
        const minClarity = document.getElementById('minClarity').value;  
        const maxClarity = document.getElementById('maxClarity').value;  
        const minCut = document.getElementById('minCut').value;  
        const maxCut = document.getElementById('maxCut').value;
        const minPolish = document.getElementById('minPolish').value;  
        const maxPolish = document.getElementById('maxPolish').value;
        const minSymmetry = document.getElementById('minSymmetry').value;  
        const maxSymmetry = document.getElementById('maxSymmetry').value;  
        const minFluor = document.getElementById('minFluor').value;  
        const maxFluor = document.getElementById('maxFluor').value;
        const minTable = document.getElementById('minTable').value;  
        const maxTable = document.getElementById('maxTable').value; 
        const minDepth = document.getElementById('minDepth').value;  
        const maxDepth = document.getElementById('maxDepth').value; 
        const minRatio = document.getElementById('minRatio').value;  
        const maxRatio = document.getElementById('maxRatio').value; 
        // Check that listInstance and itemTemplateElement are initialized
        if (!listInstance || !itemTemplateElement) {
            console.error('listInstance or itemTemplateElement is not initialized');
            return;
        }
        
        showLoadingAnimation();  
        
        // Fetch and interleave products based on selected shapes and price filters  
        const filteredProducts = await fetchProductsForFilters(checkedShapes, minPrice, maxPrice, minCarats, maxCarats, minColor, maxColor, minClarity, maxClarity, minCut, maxCut, checkedLabs, minPolish, maxPolish, minSymmetry, maxSymmetry, minFluor, maxFluor, minTable, maxTable, minDepth, maxDepth, minRatio, maxRatio, checkedOrigin);  
        
        // Update the list with filtered products  
        await updateList(filteredProducts, listInstance, itemTemplateElement);  
        updateItemCounters(allProducts, filteredProducts); // Update counts after filtering
        hideLoadingAnimation();  
    }
      function interleaveProducts(productsArrays) {  
        let combined = [];  
        let longestArrayLength = Math.max(...productsArrays.map(arr => arr.length));  
    
        for (let i = 0; i < longestArrayLength; i++) {  
            productsArrays.forEach(arr => {  
                if (i < arr.length) combined.push(arr[i]);  
            });  
        }  
    
        return combined;  
    }  
    // Unified mapping function for slider values
    function mapSliderValue(mapping, value) {
      return mapping[Math.min(Math.max(parseInt(value), 0), mapping.length - 1)];
  }
  
  async function fetchProducts(shapeFilter = '', minPrice = '', maxPrice = '', minCarats = '', maxCarats = '', minColor = '', maxColor = '', minClarity = '', maxClarity = '', minCut = '', maxCut = '', checkedLabs = [], minPolish = '', maxPolish = '', minSymmetry = '', maxSymmetry = '', minFluor = '', maxFluor = '', minTable = '', maxTable = '', minDepth = '', maxDepth = '', minRatio = '', maxRatio = '', checkedOrigin = [], offset = 0, limit = 20) {  
      const url = new URL('https://57urluwych.execute-api.us-west-1.amazonaws.com/live/diamonds');  
  
      const setUrlParam = (param, value) => {
          if (value) url.searchParams.set(param, value);
      };
      
      setUrlParam('offset', offset);
      setUrlParam('limit', limit);

      setUrlParam('shape', encodeURIComponent(shapeFilter));
      setUrlParam('minPrice', minPrice);
      setUrlParam('maxPrice', maxPrice);
      setUrlParam('minCarats', minCarats);
      setUrlParam('maxCarats', maxCarats);
  
      const colorMapping = ['J', 'I', 'H', 'G', 'F', 'E', 'D'];
      setUrlParam('minColor', mapSliderValue(colorMapping, minColor));
      setUrlParam('maxColor', mapSliderValue(colorMapping, maxColor));
  
      const clarityMapping = ['SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL'];
      setUrlParam('minClarity', mapSliderValue(clarityMapping, minClarity));
      setUrlParam('maxClarity', mapSliderValue(clarityMapping, maxClarity));
  
      const cutMapping = ['F', 'GD', 'VG', 'EX', 'ID', 'EIGHTX'];
      setUrlParam('minCut', mapSliderValue(cutMapping, minCut));
      setUrlParam('maxCut', mapSliderValue(cutMapping, maxCut));
  
      checkedLabs.forEach(lab => url.searchParams.append('lab', lab));
      checkedOrigin.forEach(origin => url.searchParams.append('origin', origin));

      const polishMapping = ['GD', 'VG', 'EX'];
      setUrlParam('minPolish', mapSliderValue(polishMapping, minPolish));
      setUrlParam('maxPolish', mapSliderValue(polishMapping, maxPolish));
  
      const symmetryMapping = ['GD', 'VG', 'EX'];
      setUrlParam('minSymmetry', mapSliderValue(symmetryMapping, minSymmetry));
      setUrlParam('maxSymmetry', mapSliderValue(symmetryMapping, maxSymmetry));
  
      const fluorMapping = ['VST', 'STG', 'MED', 'FNT', 'NON'];
      setUrlParam('minFluor', mapSliderValue(fluorMapping, minFluor));
      setUrlParam('maxFluor', mapSliderValue(fluorMapping, maxFluor));
  
      setUrlParam('minTable', minTable);
      setUrlParam('maxTable', maxTable);
      setUrlParam('minDepth', minDepth);
      setUrlParam('maxDepth', maxDepth);
      setUrlParam('minRatio', minRatio);
      setUrlParam('maxRatio', maxRatio);
  
      console.log(`Fetching products with URL: ${url.href}`);
      const response = await fetch(url);  
      const data = await response.json();
      console.log('Products array from API:', data.items);  
      return data.items || [];  
  }
  
    async function updateList(products, listInstance, itemTemplateElement) {  
        console.log('listInstance:', listInstance);

        // Determine which view is currently active
        const isGridViewActive = $('#grid-view').hasClass('tab-button-active');
        
        // Select the correct template element based on the active view
        const templateElement = isGridViewActive ? listInstance.items[1].element : listInstance.items[0].element;
        
        console.log('templateElement:', templateElement);
        console.log('itemTemplateElement:', itemTemplateElement);
        listInstance.clearItems();  
        // Create new items using the selected template
        const newItems = products.map(product => createItem(product, templateElement));
        console.log('New items:', newItems);
    
        // Check if listInstance.addItems is a function
        if (typeof listInstance.addItems !== 'function') {
            console.error('listInstance.addItems is not a function');
            return;
        }
    
        try {
            await listInstance.addItems(newItems);
            formatDiamondIcon(); // Call the function to format diamond icons
          } catch (error) {
            console.error('Error adding items:', error);
          }  
    }

function createItem(product, templateElement) {  
    const newItem = templateElement.cloneNode(true);  
    const mappings = {  
        "id": product.id,  
        "image": product.diamond.image,  
        "video": product.diamond.video,
        "supplier_video_link": product.diamond.video,
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
          if (key === 'video' && element.tagName === 'IFRAME' && mappings[key]) {
              // Only modify the URL if it is not null or undefined
              const modifiedVideoURL = mappings[key].replace('500/500', '500/500/');
              element.src = modifiedVideoURL;
            } else if (key === 'supplier_video_link' && element.classList.contains('vid-source') && mappings[key]) {
              // Set the SRC attribute for <source> elements
              element.setAttribute('src', mappings[key]);
            } else {
              // Set textContent for other elements
              element.textContent = mappings[key];
          }
      });
  }); 
    // Handle the open panel functionality
// Assuming newItem is a single DOM element

// Handle the open panel functionality
const openPanel = newItem.querySelector('.main-panel');
if (openPanel) {
    openPanel.addEventListener('click', function (event) {
        if (!event.target.closest('.td.compare')) {
            const infoPanel = newItem.querySelector('.info-panel');
            infoPanel?.classList.toggle('hide');

            if (!infoPanel.classList.contains('hide')) {
                const videoElement = newItem.querySelector('.video-iframe');
                if (videoElement && videoElement.textContent) {
                  const iframe = document.createElement('iframe');
                  
                  // Extract URL and modify it if it's not null
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
        }
    });
}

return newItem;


  };



    });  
  })();