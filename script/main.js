import { formatShape, formatPrice, formatCarats, formatCut, formatDecimal, formatDiamondIcon } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@c9530f03f9da402fbf051040a26d449a0e2794fa/script/formatData.js';  
import { showLoadingAnimation, hideLoadingAnimation } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@4b33f6b1c81d1b9eef3f151a075f87d4f7c40284/script/loadingAnimation.js';

(() => {  
    window.addEventListener('load', async () => {  
      var listInstance, itemTemplateElement;  
      var allProducts;  
  
      const fetchAndInitialize = async () => {  
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
        showLoadingAnimation();  
        allProducts = await fetchProducts('', minPrice, maxPrice, minCarats, maxCarats, minColor, maxColor, minClarity, maxClarity, minCut, maxCut); // Including price filters
        hideLoadingAnimation();  
        updateList(allProducts, listInstance, itemTemplateElement);  
        attachEventListenersToCheckboxes(listInstance, itemTemplateElement, allProducts);  
        attachPriceRangeEventListeners(listInstance, itemTemplateElement);  
        attachCaratsRangeEventListeners(listInstance, itemTemplateElement);  
        attachColorsRangeEventListeners(listInstance, itemTemplateElement);  
        attachClarityRangeEventListeners(listInstance, itemTemplateElement);  
        attachCutRangeEventListeners(listInstance, itemTemplateElement);  
        updateItemCounters(allProducts, allProducts); // Initially, all products are displayed
    }; 
  
      window.fsAttributes = window.fsAttributes || [];  
      window.fsAttributes.push([  
        "cmsfilter",  
        async (filtersInstances) => {  
          const [filtersInstance] = filtersInstances;  
          listInstance = listInstance;  
          const [firstItem] = listInstance.items;  
          itemTemplateElement = firstItem.element;  
  
          await fetchAndInitialize();  
        },  
      ]);  
  
      let checkedShapes = [];  // Tracks the currently checked shapes  
      
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
      function attachEventListenersToCheckboxes(listInstance, itemTemplateElement, allProducts) {  
        const checkboxLabels = document.querySelectorAll(".shape-checkbox_field");  
        checkboxLabels.forEach(label => {  
          const checkbox = label.querySelector("input[type='checkbox']");  
          const shapeLabel = label.querySelector("span");  
  
          if (checkbox && shapeLabel) {  
            checkbox.addEventListener('change', async () => {  
              updateCheckedShapes(shapeLabel.textContent, checkbox.checked);  
              await applyAllFilters();  
            });  
          }  
        });  
      }  
  
      function updateCheckedShapes(shape, isChecked) {  
        if (isChecked) {  
          checkedShapes.push(shape);  
        } else {  
          checkedShapes = checkedShapes.filter(s => s !== shape);  
        }  
      }  
  
      function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      }
      
      function attachPriceRangeEventListeners(listInstance, itemTemplateElement) {
        const minPriceInput = document.getElementById('priceFrom');
        const maxPriceInput = document.getElementById('priceTo');
        const handleLeft = document.querySelector('.rangeslider-handle-left');
        const handleRight = document.querySelector('.rangeslider-handle-right');
      
        // Creating a debounced version of applyAllFilters to prevent overload
        const debouncedApplyAllFilters = debounce(async () => {
          await applyAllFilters(listInstance, itemTemplateElement);
        }, 420); // 250 milliseconds, adjust as needed
      
        [minPriceInput, maxPriceInput, handleLeft, handleRight].forEach(element => {
          element.addEventListener('change', debouncedApplyAllFilters);
        });
      } 
      function attachCaratsRangeEventListeners(listInstance, itemTemplateElement) {
        const minCaratsInput = document.getElementById('minCarats');
        const maxCaratsInput = document.getElementById('maxCarats');
        const handleLeft = document.querySelector('.rangeslider-handle-left');
        const handleRight = document.querySelector('.rangeslider-handle-right');
      
        // Creating a debounced version of applyAllFilters to prevent overload
        const debouncedApplyAllFilters = debounce(async () => {
          await applyAllFilters(listInstance, itemTemplateElement);
        }, 420); // 250 milliseconds, adjust as needed
      
        [minCaratsInput, maxCaratsInput, handleLeft, handleRight].forEach(element => {
          element.addEventListener('change', debouncedApplyAllFilters);
        });
      }
      function attachColorsRangeEventListeners(listInstance, itemTemplateElement) {
        const minColorInput = document.getElementById('minColor');
        const maxColorInput = document.getElementById('maxColor');
        const handleLeft = document.querySelector('.rangeslider-handle-left');
        const handleRight = document.querySelector('.rangeslider-handle-right');
      
        // Creating a debounced version of applyAllFilters to prevent overload
        const debouncedApplyAllFilters = debounce(async () => {
          await applyAllFilters(listInstance, itemTemplateElement);
        }, 420); // 250 milliseconds, adjust as needed
      
        [minColorInput, maxColorInput, handleLeft, handleRight].forEach(element => {
          element.addEventListener('change', debouncedApplyAllFilters);
        });
      }
      function attachClarityRangeEventListeners(listInstance, itemTemplateElement) {
        const minClarityInput = document.getElementById('minClarity');
        const maxClarityInput = document.getElementById('maxClarity');
        const handleLeft = document.querySelector('.rangeslider-handle-left');
        const handleRight = document.querySelector('.rangeslider-handle-right');
      
        // Creating a debounced version of applyAllFilters to prevent overload
        const debouncedApplyAllFilters = debounce(async () => {
          await applyAllFilters(listInstance, itemTemplateElement);
        }, 420); // 250 milliseconds, adjust as needed
      
        [minClarityInput, maxClarityInput, handleLeft, handleRight].forEach(element => {
          element.addEventListener('change', debouncedApplyAllFilters);
        });
      }
      function attachCutRangeEventListeners(listInstance, itemTemplateElement) {
        const minCutInput = document.getElementById('minCut');
        const maxCutInput = document.getElementById('maxCut');
        const handleLeft = document.querySelector('.rangeslider-handle-left');
        const handleRight = document.querySelector('.rangeslider-handle-right');
      
        // Creating a debounced version of applyAllFilters to prevent overload
        const debouncedApplyAllFilters = debounce(async () => {
          await applyAllFilters(listInstance, itemTemplateElement);
        }, 420); // 250 milliseconds, adjust as needed
      
        [minCutInput, maxCutInput, handleLeft, handleRight].forEach(element => {
          element.addEventListener('change', debouncedApplyAllFilters);
        });
      }
      async function fetchProductsForFilters(checkedShapes, minPrice, maxPrice, minCarats, maxCarats, minColor, maxColor, minClarity, maxClarity, minCut, maxCut) {  
        let products = [];  
      
        if (checkedShapes.length === 0) {  
            // Return all products if no shape is selected, filtered by price
            products = await fetchProducts('', minPrice, maxPrice, minCarats, maxCarats, minColor, maxColor, minClarity, maxClarity, minCut, maxCut);
        } else {  
            const productsPromises = checkedShapes.map(shape =>  
              // Include price filters in each shape query
              fetchProducts(shape, minPrice, maxPrice, minCarats, maxCarats, minColor, maxColor, minClarity, maxClarity, minCut, maxCut)
            );  
            const productsArrays = await Promise.all(productsPromises);  
            products = interleaveProducts(productsArrays);  
        }  
      
        console.log('Fetched products:', products);
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
        // Check that listInstance and itemTemplateElement are initialized
        if (!listInstance || !itemTemplateElement) {
            console.error('listInstance or itemTemplateElement is not initialized');
            return;
        }
        
        showLoadingAnimation();  
        
        // Fetch and interleave products based on selected shapes and price filters  
        const filteredProducts = await fetchProductsForFilters(checkedShapes, minPrice, maxPrice, minCarats, maxCarats, minColor, maxColor, minClarity, maxClarity, minCut, maxCut);  
        
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
    function mapSliderValueToColor(value) {
        const colorMapping = ['J', 'I', 'H', 'G', 'F', 'E', 'D'];
        return colorMapping[Math.min(Math.max(parseInt(value), 0), colorMapping.length - 1)];
    }
    function mapSliderValueToClarity(value) {
        const clarityMapping = ['SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL'];
        return clarityMapping[Math.min(Math.max(parseInt(value), 0), clarityMapping.length - 1)];
    }
    function mapSliderValueToCut(value) {
        const cutMapping = ['F', 'GD', 'VG', 'EX', 'ID', 'EIGHTX'];
        return cutMapping[Math.min(Math.max(parseInt(value), 0), cutMapping.length - 1)];
    }
      async function fetchProducts(shapeFilter = '', minPrice = '', maxPrice = '', minCarats = '', maxCarats = '', minColor = '', maxColor = '', minClarity = '', maxClarity = '', minCut = '', maxCut = '') {  
        const url = new URL('https://57urluwych.execute-api.us-west-1.amazonaws.com/live/diamonds');  
        if (shapeFilter) {  
          url.searchParams.set('shape', encodeURIComponent(shapeFilter));  
        }  
        if (minPrice) {  
          url.searchParams.set('minPrice', minPrice);  
        }  
        if (maxPrice) {  
          url.searchParams.set('maxPrice', maxPrice);  
        }  
        if (minCarats) {  
            url.searchParams.set('minCarats', minCarats);  
        }  
        if (maxCarats) {  
            url.searchParams.set('maxCarats', maxCarats);  
        } 
            // Map color slider values to color codes
            const colorCodeMin = mapSliderValueToColor(minColor);
            const colorCodeMax = mapSliderValueToColor(maxColor);

            if (colorCodeMin) {
                url.searchParams.set('minColor', colorCodeMin);
            }
            if (colorCodeMax) {
                url.searchParams.set('maxColor', colorCodeMax);
            }
            // Map clarity slider values to color codes
            const clarityCodeMin = mapSliderValueToClarity(minClarity);
            const clarityCodeMax = mapSliderValueToClarity(maxClarity);

            if (clarityCodeMin) {
                url.searchParams.set('minClarity', clarityCodeMin);
            }
            if (clarityCodeMax) {
                url.searchParams.set('maxClarity', clarityCodeMax);
            }
            // Map cut slider values to color codes
            const cutCodeMin = mapSliderValueToCut(minCut);
            const cutCodeMax = mapSliderValueToCut(maxCut);

            if (cutCodeMin) {
                url.searchParams.set('minCut', cutCodeMin);
            }
            if (cutCodeMax) {
                url.searchParams.set('maxCut', cutCodeMax);
            }
  // Log the API URL parameters  
  console.log(`Fetching products with URL: ${url.href}`);

    const response = await fetch(url);  
    const data = await response.json();

  // Log the array found from the API  
  console.log('Products array from API:', data.items);  
  
    return data.items || [];  
    }  
    async function updateList(products, listInstance, itemTemplateElement) {  
        console.log('listInstance:', listInstance);
        console.log('itemTemplateElement:', itemTemplateElement);
        listInstance.clearItems();  
        const newItems = products.map(product => createItem(product, itemTemplateElement));  
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
        "shape": formatShape(product.diamond.certificate.shape),  
        "clarity": product.diamond.certificate.clarity,  
        "certNumber": product.diamond.certificate.certNumber,  
        "symmetry": product.diamond.certificate.symmetry,  
        "polish": product.diamond.certificate.polish,  
        "width": formatDecimal(product.diamond.certificate.width),  
        "length": formatDecimal(product.diamond.certificate.length),  
        "depth": formatDecimal(product.diamond.certificate.depth),  
        "table": formatDecimal(product.diamond.certificate.table),  
        "girdle": product.diamond.certificate.girdle,  
        "lab": product.diamond.certificate.lab,  
        "carats": formatCarats(product.diamond.certificate.carats),  
        "color": product.diamond.certificate.color,  
        "cut": formatCut(product.diamond.certificate.cut),  
        "availability": product.diamond.availability,  
        "price": formatPrice(product.price),  
    };  
    Object.keys(mappings).forEach(key => {  
        const element = newItem.querySelector(`[data-element="${key}"]`);  
        if (element) {  
            if (key === 'video' && element.tagName === 'IFRAME' && mappings[key]) {
                // Only modify the URL if it is not null or undefined
                const modifiedVideoURL = mappings[key].replace('500/500', '250/250/');
                element.src = modifiedVideoURL;
            } else {
                // Set textContent for other elements
                element.textContent = mappings[key];
            }
        }  
    }); 
    return newItem;  
  }



    });  
  })();