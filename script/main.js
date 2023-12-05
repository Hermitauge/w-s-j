import { formatShape, formatPrice, formatCarats, formatLength, formatWidth, formatDepth, formatTable, formatCut, formatDiamondIcon } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@d69e7721e6f404c8467d7c1c16d8b366fd108dc0/script/formatData.js';  
import { showLoadingAnimation, hideLoadingAnimation } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@54fed807015947b7220694ee5b5941b193470e2e/script/loadingAnimation.js';

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
        const minPolish = document.getElementById('minPolish').value;  
        const maxPolish = document.getElementById('maxPolish').value;
        const minSymmetry = document.getElementById('minSymmetry').value;  
        const maxSymmetry = document.getElementById('maxSymmetry').value;
        showLoadingAnimation();  
        allProducts = await fetchProducts('', minPrice, maxPrice, minCarats, maxCarats, minColor, maxColor, minClarity, maxClarity, minCut, maxCut, checkedLabs, minPolish, maxPolish, minSymmetry, maxSymmetry); // Including price filters
        hideLoadingAnimation();  
        updateList(allProducts, listInstance, itemTemplateElement);  
        attachEventListenersToCheckboxes(listInstance, itemTemplateElement, allProducts);  
        attachPriceRangeEventListeners(listInstance, itemTemplateElement);  
        attachCaratsRangeEventListeners(listInstance, itemTemplateElement);  
        attachColorsRangeEventListeners(listInstance, itemTemplateElement);  
        attachClarityRangeEventListeners(listInstance, itemTemplateElement);  
        attachCutRangeEventListeners(listInstance, itemTemplateElement);  
        attachPolishRangeEventListeners(listInstance, itemTemplateElement);  
        attachSymmetryRangeEventListeners(listInstance, itemTemplateElement);  
        updateItemCounters(allProducts, allProducts); // Initially, all products are displayed
    }; 
  
      window.fsAttributes = window.fsAttributes || [];  
      window.fsAttributes.push([  
        "cmsfilter",  
        async (filtersInstances) => {  
          const [filtersInstance] = filtersInstances;  
          listInstance = filtersInstance.listInstance;  
          const [firstItem] = listInstance.items;  
          itemTemplateElement = firstItem.element;  
  
          await fetchAndInitialize();  
        },  
      ]);  
  
      let checkedShapes = [];  // Tracks the currently checked shapes  
      let checkedLabs = []; // Tracks the currently checked labs


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
            // Lab Checkboxes
        const labCheckboxLabels = document.querySelectorAll(".lab-checkbox_field");
        labCheckboxLabels.forEach(label => {
            const checkbox = label.querySelector("input[type='checkbox']");
            const labLabel = label.querySelector("span");

          if (checkbox && labLabel) { 
              checkbox.addEventListener('change', async () => {
                updateCheckedLabs(labLabel.textContent, checkbox.checked);
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
      function updateCheckedLabs(lab, isChecked) {
        if (isChecked) {
            checkedLabs.push(lab);
        } else {
            checkedLabs = checkedLabs.filter(l => l !== lab);
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

      function attachPolishRangeEventListeners(listInstance, itemTemplateElement) {
        const minPolishInput = document.getElementById('minPolish');
        const maxPolishInput = document.getElementById('maxPolish');
        const handleLeft = document.querySelector('.rangeslider-handle-left');
        const handleRight = document.querySelector('.rangeslider-handle-right');
      
        // Creating a debounced version of applyAllFilters to prevent overload
        const debouncedApplyAllFilters = debounce(async () => {
          await applyAllFilters(listInstance, itemTemplateElement);
        }, 420); // 250 milliseconds, adjust as needed
      
        [minPolishInput, maxPolishInput, handleLeft, handleRight].forEach(element => {
          element.addEventListener('change', debouncedApplyAllFilters);
        });
      }

      function attachSymmetryRangeEventListeners(listInstance, itemTemplateElement) {
        const minSymmetryInput = document.getElementById('minSymmetry');
        const maxSymmetryInput = document.getElementById('maxSymmetry');
        const handleLeft = document.querySelector('.rangeslider-handle-left');
        const handleRight = document.querySelector('.rangeslider-handle-right');
      
        // Creating a debounced version of applyAllFilters to prevent overload
        const debouncedApplyAllFilters = debounce(async () => {
          await applyAllFilters(listInstance, itemTemplateElement);
        }, 420); // 250 milliseconds, adjust as needed
      
        [minSymmetryInput, maxSymmetryInput, handleLeft, handleRight].forEach(element => {
          element.addEventListener('change', debouncedApplyAllFilters);
        });
      }

      async function fetchProductsForFilters(checkedShapes, minPrice, maxPrice, minCarats, maxCarats, minColor, maxColor, minClarity, maxClarity, minCut, maxCut, checkedLabs, minPolish, maxPolish, minSymmetry, maxSymmetry) {  
        let products = [];  
      
        if (checkedShapes.length === 0) {  
            // Return all products if no shape is selected, filtered by price
            products = await fetchProducts('', minPrice, maxPrice, minCarats, maxCarats, minColor, maxColor, minClarity, maxClarity, minCut, maxCut, checkedLabs, minPolish, maxPolish, minSymmetry, maxSymmetry);
        } else {  
            const productsPromises = checkedShapes.map(shape =>  
              // Include price filters in each shape query
              fetchProducts(shape, minPrice, maxPrice, minCarats, maxCarats, minColor, maxColor, minClarity, maxClarity, minCut, maxCut, checkedLabs, minPolish, maxPolish, minSymmetry, maxSymmetry)
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
        const minPolish = document.getElementById('minPolish').value;  
        const maxPolish = document.getElementById('maxPolish').value;
        const minSymmetry = document.getElementById('minSymmetry').value;  
        const maxSymmetry = document.getElementById('maxSymmetry').value;  
        // Check that listInstance and itemTemplateElement are initialized
        if (!listInstance || !itemTemplateElement) {
            console.error('listInstance or itemTemplateElement is not initialized');
            return;
        }
        
        showLoadingAnimation();  
        
        // Fetch and interleave products based on selected shapes and price filters  
        const filteredProducts = await fetchProductsForFilters(checkedShapes, minPrice, maxPrice, minCarats, maxCarats, minColor, maxColor, minClarity, maxClarity, minCut, maxCut, checkedLabs, minPolish, maxPolish, minSymmetry, maxSymmetry);  
        
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
    function mapSliderValueToPolish(value) {
        const polishMapping = ['GD', 'VG', 'EX'];
        return polishMapping[Math.min(Math.max(parseInt(value), 0), polishMapping.length - 1)];
    }
    function mapSliderValueToSymmetry(value) {
        const symmetryMapping = ['GD', 'VG', 'EX'];
        return symmetryMapping[Math.min(Math.max(parseInt(value), 0), symmetryMapping.length - 1)];
    }
      async function fetchProducts(shapeFilter = '', minPrice = '', maxPrice = '', minCarats = '', maxCarats = '', minColor = '', maxColor = '', minClarity = '', maxClarity = '', minCut = '', maxCut = '', checkedLabs = [], minPolish = '', maxPolish = '', minSymmetry = '', maxSymmetry = '') {  
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
            // Include lab filters
            checkedLabs.forEach(lab => {
              url.searchParams.append('lab', lab);
            });

            // Map Polish slider values to color codes
            const polishCodeMin = mapSliderValueToPolish(minPolish);
            const polishCodeMax = mapSliderValueToPolish(maxPolish);

            if (polishCodeMin) {
                url.searchParams.set('minPolish', polishCodeMin);
            }
            if (polishCodeMax) {
                url.searchParams.set('maxPolish', polishCodeMax);
            }

            // Map Symmetry slider values to color codes
            const symmetryCodeMin = mapSliderValueToSymmetry(minSymmetry);
            const symmetryCodeMax = mapSliderValueToSymmetry(maxSymmetry);

            if (symmetryCodeMin) {
                url.searchParams.set('minSymmetry', symmetryCodeMin);
            }
            if (symmetryCodeMax) {
                url.searchParams.set('maxSymmetry', symmetryCodeMax);
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
        "width": product.diamond.certificate.width,  
        "length": product.diamond.certificate.length,  
        "depth": product.diamond.certificate.depth,  
        "table": product.diamond.certificate.table,  
        "girdle": product.diamond.certificate.girdle,  
        "lab": product.diamond.certificate.lab,  
        "carats": formatCarats(product.diamond.certificate.carats),  
        "color": product.diamond.certificate.color,  
        "cut": formatCut(product.diamond.certificate.cut),  
        "availability": product.diamond.availability,  
        "price": formatPrice(product.price),  
    };  
    Object.keys(mappings).forEach(key => {  
      const elements = newItem.querySelectorAll(`[data-element="${key}"]`);  
      elements.forEach(element => {
          if (key === 'video' && element.tagName === 'IFRAME' && mappings[key]) {
              // Only modify the URL if it is not null or undefined
              const modifiedVideoURL = mappings[key].replace('500/500', '500/500/');
              element.src = modifiedVideoURL;
          } else {
              // Set textContent for other elements
              element.textContent = mappings[key];
          }
      });
  }); 
    // Handle the open panel functionality
    const openPanel = newItem.querySelector('.open-panel');
    const videoElement = newItem.querySelector('[data-element="video"]');
    if (openPanel && videoElement) {
        openPanel.addEventListener('click', function () {
            const infoPanel = newItem.querySelector('.info-panel');
            if (infoPanel) {
                infoPanel.classList.toggle('hidden');

                // Create an iframe if it doesn't exist
                if (!infoPanel.classList.contains('hidden') && !infoPanel.querySelector('iframe')) {
                    const innerVideo = infoPanel.querySelector('.inner-vid');
                    const iframe = document.createElement('iframe');
                    let modifiedVideoURL = mappings[key].replace('500/500', '360/360/autoplay');
                    iframe.src = modifiedVideoURL;
                    iframe.width = '360';
                    iframe.height = '360';
                    iframe.frameBorder = '0';
                    iframe.allow = 'autoplay; encrypted-media';
                    iframe.allowFullscreen = true;
                    innerVideo.innerHTML = '';
                    innerVideo.appendChild(iframe);
                }
            }
        });
    }
    
    return newItem;
  };



    });  
  })();