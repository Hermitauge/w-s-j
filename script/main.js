import { formatShape, formatPrice, formatCarats, formatLength, formatWidth, formatDepth, formatTable, formatCut, formatDiamondIcon } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@d69e7721e6f404c8467d7c1c16d8b366fd108dc0/script/formatData.js';  
import { showLoadingAnimation, hideLoadingAnimation, debounce } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@6b30df73e525982e0bece6ec0701b74f216a7b00/script/loadingAnimation.js';

(() => {
    // Define all your functions first
    async function fetchProductsForFilters(filters, mappings, currentPage, limit) {
        console.log(`Page Number in fetchProductsForFilters: ${currentPage}`);
        const mapSliderValue = (mapping, value) => {return mapping[Math.min(Math.max(parseInt(value), 0), mapping.length - 1)];};
        const mappingConfig = {minCut: mappings.cut, maxCut: mappings.cut, minColor: mappings.color, maxColor: mappings.color, minClarity: mappings.clarity, maxClarity: mappings.clarity, minPolish: mappings.polish, maxPolish: mappings.polish, minSymmetry: mappings.symmetry, maxSymmetry: mappings.symmetry, minFluor: mappings.fluor, maxFluor: mappings.fluor};
        Object.entries(mappingConfig).forEach(([filterKey, mapping]) => {if (filters.hasOwnProperty(filterKey)) {filters[filterKey] = mapSliderValue(mapping, filters[filterKey]);}});
        const isFilterSet = value => value !== '' && value != null;
        const isAnyFilterApplied = Object.values(filters).some(isFilterSet) || 
            filters.checkedShapes.length > 0 || 
            filters.checkedLabs.length > 0 || 
            filters.checkedOrigin.length > 0;

            let products = [];
            try {
                let productsPromises = [];
                if (!isAnyFilterApplied) {
                    productsPromises.push(fetchProducts({}, currentPage, limit));
                } else {
                    const preparedFilters = {};
                    Object.entries(filters).forEach(([key, value]) => {
                        preparedFilters[key] = Array.isArray(value) ? value.join(',') : (isFilterSet(value) ? value : '');
                    });
        
                    productsPromises.push(fetchProducts(preparedFilters, currentPage, limit));
                }
        
                const productsArrays = await Promise.all(productsPromises);
                products = interleaveProducts(productsArrays.map(productArray => [productArray]));
            } catch (error) {
                console.error('Error fetching products:', error); // Log any errors
            }
        
            return products;
        }
        


        function interleaveProducts(productsArrays) {
            if (!Array.isArray(productsArrays) || productsArrays.length === 0) {
                console.error('interleaveProducts was given an empty or invalid array');
                return [];
            }
        
            // If it's already a single array, just return it
            console.log('First array in productsArrays:', productsArrays[0]);
            if (productsArrays.length === 1) {
                return productsArrays[0];
}
        
            let combined = [];
            let longestArrayLength = Math.max(...productsArrays.map(arr => arr.length));
        
            for (let i = 0; i < longestArrayLength; i++) {
                productsArrays.forEach(arr => {
                    if (i < arr.length) combined.push(arr[i]);
                });
            }
        
            return combined;
        }

        // API Fetch Products 
        async function fetchProducts(filters, page = 1, limit = 20) {
            const url = new URL('https://57urluwych.execute-api.us-west-1.amazonaws.com/live/diamonds');
            console.log(`Page Number: ${page}`);
        
            const setUrlParam = (param, value) => {
                if (value) url.searchParams.set(param, value);
            };
        
            setUrlParam('page', page);
            setUrlParam('limit', limit);
        
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

        async function updateList(products, listInstance, itemTemplateElement, shouldAppend = false) {
            console.log('listInstance:', listInstance);
            console.log('itemTemplateElement:', itemTemplateElement);
            console.log('Products before mapping:', products); // Log the products array before mapping
        
            if (!shouldAppend) {
                listInstance.clearItems();
            }
        
            // Create new items using the selected template
            const newItems = products.map(product => {
                try {
                    return createItem(product, itemTemplateElement); // Use itemTemplateElement here
                } catch (error) {
                    console.error('Error creating item:', error); // Log any errors during item creation
                    return null; // Return null or some error indicator if an item fails to create
                }
            }).filter(item => item !== null); // Filter out any nulls or error indicators
        
            console.log('New items:', newItems); // Log the new items array after mapping
        
            try {
                await listInstance.addItems(newItems);
                formatDiamondIcon();
            } catch (error) {
                console.error('Error adding items:', error);
            }
        }

        function createItem(product, templateElement) {  
            if (!product.diamond) {
                console.error('Product does not have a diamond property:', product);
                return null;
            }
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
                  if (key === 'supplier_video_linkk' && element.tagName === 'IFRAME' && mappings[key]) {
                      // Only modify the URL if it is not null or undefined
                      const modifiedVideoURL = mappings[key].replace('500/500', '500/500/');
                      element.src = modifiedVideoURL;
                    } else if (key === 'supplier_video_linkk' && element.classList.contains('vid-sourcee') && mappings[key]) {
                      // Set the SRC attribute for <source> elements
                      element.setAttribute('src', mappings[key]);
                    } else {
                      // Set textContent for other elements
                      element.textContent = mappings[key];
                  }
              });
          }); 
        
        // Handle the open panel functionality
        const openPanel = newItem.querySelector('.main-panel');
        if (openPanel) {
            openPanel.addEventListener('click', function (event) {
                if (!event.target.closest('.td.compare')) {
                    const infoPanel = newItem.querySelector('.info-panel');
                    infoPanel?.classList.toggle('hide');
        
                    if (!infoPanel.classList.contains('hide')) {
                        const videoElement = newItem.querySelector('.video-iframee');
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

        function setupInfiniteScroll() {
            const listContainer = document.querySelector('.collection-list-wrapper');
            listContainer.addEventListener('scroll', debounce(async () => {
                if (listContainer.scrollTop + listContainer.clientHeight >= listContainer.scrollHeight - preloadingThreshold && !fetching) {
                    fetching = true;
                    showLoadingAnimation();
        
                    if (currentPage < maxPage && !requestedPages.includes(currentPage)) {
                        console.log(`Current Page in setupInfiniteScroll: ${currentPage}`);
                        requestedPages.push(currentPage);
        
                        const scrollFetched = await fetchProductsForFilters(filters, mappings, currentPage, limit);
        
                        // Only update the list and increment the page if new products were fetched
                        if (scrollFetched.length > 0) {
                            await updateList(scrollFetched, listInstance, itemTemplateElement, true);
                            currentPage++;
                            console.log(`New current page after update: ${currentPage}`);
                        } else {
                            // Handle the case where no new products are returned (e.g., end of list)
                            console.log('No more products to fetch');
                        }
                        hideLoadingAnimation();
                        fetching = false;
                    }
                }
            }, 300));
        }

    // Now define the functions that use the above functions
    const fetchAndInitialize = async () => {
        showLoadingAnimation();
        try {
            // Fetch products with filters
            allProducts = await fetchProductsForFilters(filters, mappings, currentPage, limit);
            console.log('Products after fetching:', allProducts);
            console.log('Products after fetching and before interleaving:', allProducts);
    
            // Interleave products if necessary
            const interleavedProducts = interleaveProducts(allProducts);
            console.log('Products after interleaving:', interleavedProducts);
    
            // Update the list with the fetched (and potentially interleaved) products
            await updateList(interleavedProducts, listInstance, itemTemplateElement);
    
            // Setup infinite scroll after list is updated
            setupInfiniteScroll();
        } catch (error) {
            console.error('Error during fetch and initialize:', error);
        } finally {
            hideLoadingAnimation();
        }
    };

    const handleFilterChange = async (event) => {
        const filterElement = event.target;
        const filterType = filterElement.getAttribute('data-filter');
    
        if (filterType) {
            if (filterElement.type === 'checkbox') {
                const checkboxLabel = filterElement.closest('label').querySelector("span");
                const filterValue = checkboxLabel ? checkboxLabel.textContent : null;
    
                if (filterElement.checked) {
                    filters[filterType] = filters[filterType] || [];
                    if (filterValue && !filters[filterType].includes(filterValue)) {
                        filters[filterType].push(filterValue);
                    }
                } else {
                    filters[filterType] = filters[filterType].filter(val => val !== filterValue);
                }
            } else {
                filters[filterType] = filterElement.value;
            }
    
            await applyAllFilters();
        }
    };

    const applyAllFilters = async () => {
        if (!listInstance || !itemTemplateElement) {
            console.error('listInstance or itemTemplateElement is not initialized');
            return;
        }
    
        showLoadingAnimation();
        const filteredProducts = await fetchProductsForFilters(filters, mappings, currentPage, limit);
        await updateList(filteredProducts, listInstance, itemTemplateElement);  
        hideLoadingAnimation();
        
    };

    // Define your variables and event listeners
    let listInstance, itemTemplateElement, allProducts;
    let limit = 20, fetching = false;
    let currentPage = 1;
    let maxPage = 20;
    let requestedPages = [];
    let preloadingThreshold = 30;

    // Define the filters Object & Mappings
    let filters = {shape: [], lab: [], origin: [], minPrice: '', maxPrice: '', minCarats: '', maxCarats: '', minColor: '', maxColor: '', minClarity: '', maxClarity: '', minCut: '', maxCut: '', minPolish: '', maxPolish: '', minSymmetry: '', maxSymmetry: '', minFluor: '', maxFluor: '', minTable: '', maxTable: '', minDepth: '', maxDepth: '', minRatio: '', maxRatio: ''};
    const mappings = {
        cut: ['F', 'GD', 'VG', 'EX', 'ID', 'EIGHTX'],
        color: ['J', 'I', 'H', 'G', 'F', 'E', 'D'],
        clarity: ['SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL'],
        polish: ['GD', 'VG', 'EX'],
        symmetry: ['GD', 'VG', 'EX'],
        fluor: ['VST', 'STG', 'MED', 'FNT', 'NON']
    };

    window.addEventListener('load', async () => {
        document.querySelectorAll('.filters-object').forEach(container => {
            container.querySelectorAll('[data-filter]').forEach(element => {
                element.addEventListener('change', debounce(handleFilterChange, 420));
            });
        });

        window.fsAttributes = window.fsAttributes || [];
        window.fsAttributes.push([
            "cmsfilter", async (filtersInstances) => {
                const [filtersInstance] = filtersInstances;
                listInstance = filtersInstance.listInstance;
                const [firstItem] = listInstance.items;
                itemTemplateElement = firstItem.element;
                
                await fetchAndInitialize();
            },
        ]);
    });
})(); // End of IIFE