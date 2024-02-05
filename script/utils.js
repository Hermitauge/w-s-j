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
const VideoIframe = ({ src }) => {
    return React.createElement('iframe', {
      src: src,
      width: '500',
      height: '500',
      frameBorder: '0',
      allow: 'encrypted-media',
      allowFullScreen: true,
    });
  };
  
const imageElement = element.querySelector('.main-panel');
const iframeElement = element.querySelector('.iframe');
const initiateMedia = element.querySelector('.td');

// Action 1: Set background image of imageElement
if (imageElement && dataMapping['']) {
    imageElement.style.backgroundImage = `url('${dataMapping['']}')`;
  }
  
  // Action 2: Add click event listener to imageElement
  if (imageElement) {
    imageElement.addEventListener('click', function() {
      if (dataMapping['video']) {
        const videoUrl = dataMapping['video'].replace('500/500', '500/500/autoplay');
  
        // Assuming that .inner-vid is the container where the React component should be rendered
        const innerVidElement = element.querySelector('.inner-vid');
        if (innerVidElement) {
          ReactDOM.render(
            React.createElement(VideoIframe, { src: videoUrl }),
            innerVidElement
          );
        }
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