import { formatShape, formatPrice, formatCarats, formatCut } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@d69e7721e6f404c8467d7c1c16d8b366fd108dc0/script/formatData.js';
import { showLoadingAnimation, hideLoadingAnimation } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@6b30df73e525982e0bece6ec0701b74f216a7b00/script/loadingAnimation.js';

class DiamondCollection {
  constructor() {
    this.API_ENDPOINT = 'https://57urluwych.execute-api.us-west-1.amazonaws.com/live/diamonds';
    this.collectionList = document.querySelector('.collection-list');
    this.wrapperElement = document.querySelector('.collection-list-wrapper');
    this.currentPage = 1;
    this.fetching = false;
    this.hasMoreItems = true;
    this.itemTemplateElement = this.initializeItemTemplate();
    this.prefetchedItems = [];
    this.scrollThreshold = 100;

    if (this.itemTemplateElement) {
      this.bindEvents();
      this.fetchAndRenderProducts();
    }
  }

  bindEvents() {
    this.wrapperElement.addEventListener('scroll', () => {
      if (this.isScrollNearBottom() && !this.fetching && this.hasMoreItems) {
        this.fetchAndRenderProducts();
      }
    });
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
    const response = await fetch(`${this.API_ENDPOINT}?page=${this.currentPage}`);
    const data = await response.json();
    return data.items || [];
  }

  renderItems(items) {
    items.forEach(item => {
      const newItemElement = this.createItemElement(item);
      if (newItemElement) {
        this.collectionList.appendChild(newItemElement);
      }
    });
  }

  createItemElement(product) {
    if (!product || !product.diamond || !product.diamond.certificate) {
      console.error('Invalid product data:', product);
      return null;
    }

    const element = this.itemTemplateElement.cloneNode(true);
    this.bindProductDataToElement(element, product);
    return element;
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

    Object.entries(dataMapping).forEach(([key, value]) => {
      const elements = element.querySelectorAll(`[data-element="${key}"]`);
      elements.forEach(el => el.textContent = value);
    });
  }

  isScrollNearBottom() {
    const { scrollTop, clientHeight, scrollHeight } = this.wrapperElement;
    return scrollHeight - (scrollTop + clientHeight) < this.scrollThreshold;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DiamondCollection();
});
