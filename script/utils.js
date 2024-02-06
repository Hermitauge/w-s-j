import { formatShape, formatPrice, formatCarats, formatLength, formatWidth, formatDepth, formatTable, formatCut, formatDiamondIcon } from 'https://cdn.jsdelivr.net/gh/Hermitauge/W-S@873a511bc3a68ec8a96d90ce3b9fa32fb5359102/script/formatData.js';

//  utils.js

export function handlePanelClick(event, newItem, processVideo) {
    const allInfoPanels = document.querySelectorAll('.information-panel');
    const allOpenPanels = document.querySelectorAll('.open-panel');
    const currentInfoPanel = newItem.querySelector('.information-panel');
    const currentOpenPanel = newItem.querySelector('.open-panel');

    if (!event.target.closest('.td.compare')) {
        allInfoPanels.forEach(panel => {
            if (panel !== currentInfoPanel) {
                panel.style.transition = 'height 0.4s ease';
                panel.style.height = '0';
            }
        });

        allOpenPanels.forEach(openPanel => {
            if (openPanel !== currentOpenPanel) {
                openPanel.style.transition = 'transform 0.4s ease';
                openPanel.style.transform = 'rotateZ(0deg)';
            }
        });

        if (currentInfoPanel.classList.contains('active')) {
            currentInfoPanel.style.transition = 'height 0.4s ease';
            currentInfoPanel.style.height = '0';
            currentInfoPanel.classList.remove('active');

            currentOpenPanel.style.transition = 'transform 0.4s ease';
            currentOpenPanel.style.transform = 'rotateZ(0deg)';
        } else {
            currentInfoPanel.style.height = `${currentInfoPanel.scrollHeight}px`; // Set to scrollHeight for dynamic height
            currentInfoPanel.style.transition = 'height 0.4s ease';
            currentInfoPanel.classList.add('active');

            currentOpenPanel.style.transition = 'transform 0.4s ease';
            currentOpenPanel.style.transform = 'rotateZ(90deg)';
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
      image,
      delivery_time: {min_business_days, max_business_days},
      certificate: {
          shape, clarity, certNumber, pdfUrl, symmetry,
          polish, floInt, width, length, depth,
          depthPercentage, table, girdle, lab,
          carats, color, cut
      },
    price
    } = product;
    
    const dataMapping = {
      "id": id,
      "video": video,
      "supplier_video_link": supplier_video_link,
      "image": image,
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
      "price": formatPrice(price),
      "min_business_days": min_business_days,
      "max_business_days": max_business_days,
    };
    
// Selecting the .diamond-image element
const mediaElement = element.querySelector('.main-panel');
const iframeElement = element.querySelector('.iframe');
const initiateMedia = element.querySelector('.td');


  
  // Action 2: Add click event listener to imageElement
  if (mediaElement) {
    mediaElement.addEventListener('click', function() {
      if (iframeElement && dataMapping['video']) {
        const VideoUrl = dataMapping['video'].replace('500/500', '500/500/autoplay');
        iframeElement.src = VideoUrl;
      }
    });
  }

  const imageElement = element.querySelector('.diamond-image');
  // Action 1: Set background image of imageElement
  if (imageElement && dataMapping['supplier_video_link']) {
    imageElement.style.backgroundImage = `url('${dataMapping['supplier_video_link']}')`;
  
    // Action 2: Add mouseenter event listener to imageElement
    imageElement.addEventListener('mouseenter', function() {
      // Hide the image element
      imageElement.style.display = 'none';
      const iframeGrid = element.querySelector('.iframe-grid');
      if (iframeGrid && dataMapping['video'] && !iframeGrid.dataset.videoSet) {
        const videoUrl = dataMapping['video'].replace('500/500', '500/500/autoplay');
        iframeGrid.src = videoUrl;
        iframeGrid.dataset.videoSet = 'true';
      }
    }, { once: true });
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