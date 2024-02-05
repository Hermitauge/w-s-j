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
      image,
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
      "image": image,
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
    
// Selecting the .diamond-image element
const diamondImageElement = element.querySelector('.diamond-image');

// Action 1: Set background image of diamondImageElement
if (diamondImageElement && dataMapping['image']) {
  diamondImageElement.style.backgroundImage = `url('${dataMapping['image']}')`;
}

// Action 2: Add click event listener to diamondImageElement
if (diamondImageElement) {
  diamondImageElement.addEventListener('click', function() {
    this.style.display = 'none'; // Hides the .diamond-image element
    if (iframeElement && dataMapping['video']) {
      // Modifying the video URL
      const modifiedVideoUrl = dataMapping['video'].replace('500/500', '500/500/autoplay');
      iframeElement.src = modifiedVideoUrl;
    }
  });
}


 Object.keys(dataMapping).forEach(key => {
   if (key !== 'image' && key !== 'video') {
     const elements = element.querySelectorAll(`[data-element="${key}"]`);
     elements.forEach(el => {
       if (key === 'pdfUrl' && dataMapping[key]) {
         el.href = dataMapping[key];
       } else {
         el.textContent = dataMapping[key];
       }
     });
   }
 });
}