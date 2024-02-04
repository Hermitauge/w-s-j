import { formatShape, formatPrice, formatCarats, formatLength, formatWidth, formatDepth, formatTable, formatCut, formatDiamondIcon } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@873a511bc3a68ec8a96d90ce3b9fa32fb5359102/script/formatData.js';

//  utils.js

export function handlePanelClick(event, newItem, processVideo) {
    if (!event.target.closest('.td.compare')) {
        const infoPanel = newItem.querySelector('.info-panel');
        infoPanel?.classList.toggle('hide');

        if (!infoPanel.classList.contains('hide')) {
            const videoElement = newItem.querySelector('.video-iframe');
            processVideo(videoElement);
        }
    }
}

export function processVideo(videoElement) {
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

export function bindProductDataToElement(element, product) {
    const {
      id,
      video,
      supplier_video_link,
      delivery_time: {express_timeline_applicable, min_business_days, max_business_days},
      mine_of_origin,
      certificate: {
          shape, clarity, certNumber, pdfUrl, symmetry,
          polish, floInt, width, length, depth,
          depthPercentage, table, girdle, lab,
          carats, color, cut
      },
      v360: {
        url
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
      "pdfUrl": pdfUrl,
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
      "mine_of_origin": mine_of_origin,
      "price": formatPrice(price),
      "url": url,
      "min_business_days": min_business_days,
      "max_business_days": max_business_days,
    };

    Object.keys(dataMapping).forEach(key => {
      const elements = element.querySelectorAll(`[data-element="${key}"]`);
      elements.forEach(el => {
          if (key === 'supplier_video_link' && el.tagName === 'IFRAME' && dataMapping[key]) {
              const modifiedVideoURL = dataMapping[key].replace('500/500', '500/500');
              el.src = modifiedVideoURL;
          } else if (key === 'supplier_video_link' && el.classList.contains('vid-source') && dataMapping[key]) {
              el.setAttribute('src', dataMapping[key]);
          } else if (key === 'pdfUrl' && dataMapping[key]) {
              el.href = dataMapping[key]; // Set the href attribute for pdfUrl
          } else {
              el.textContent = dataMapping[key];
          }
      });
  });
}
