function setupInfiniteScroll() {
    const listContainer = document.querySelector('.collection-list-wrapper');
    listContainer.addEventListener('scroll', debounce(async () => {
        if (listContainer.scrollTop + listContainer.clientHeight >= listContainer.scrollHeight - 100 && !fetching) {
            fetching = true;
            showLoadingAnimation();

            if (currentPage < maxPage && !requestedPages.includes(currentPage + 1)) {
                currentPage++;
                requestedPages.push(currentPage);
                const scrollFetched = await fetchProductsForFilters(
                    checkedShapes, 
                    '', // Replace with the current minPrice if needed
                    '', // Replace with the current maxPrice if needed
                    '', // Replace with the current minCarats if needed
                    '', // Replace with the current maxCarats if needed
                    '', // Replace with the current minColor if needed
                    '', // Replace with the current maxColor if needed
                    '', // Replace with the current minClarity if needed
                    '', // Replace with the current maxClarity if needed
                    '', // Replace with the current minCut if needed
                    '', // Replace with the current maxCut if needed
                    checkedLabs, 
                    '', // Replace with the current minPolish if needed
                    '', // Replace with the current maxPolish if needed
                    '', // Replace with the current minSymmetry if needed
                    '', // Replace with the current maxSymmetry if needed
                    '', // Replace with the current minFluor if needed
                    '', // Replace with the current maxFluor if needed
                    '', // Replace with the current minTable if needed
                    '', // Replace with the current maxTable if needed
                    '', // Replace with the current minDepth if needed
                    '', // Replace with the current maxDepth if needed
                    '', // Replace with the current minRatio if needed
                    '', // Replace with the current maxRatio if needed
                    checkedOrigin, 
                    offset, 
                    limit,
                    currentPage);
                hideLoadingAnimation();
                await updateList(scrollFetched, listInstance, itemTemplateElement, true);
                offset += limit;
            }
            fetching = false;
        }
    }, 300));
}
