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
const iframeModal = element.querySelector('.iframe-modal');
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

//  const imageElement = element.querySelector('.diamond-image');
  // Action 1: Set background image of imageElement
  //if (imageElement && dataMapping['image']) {
    //imageElement.style.backgroundImage = `url('${dataMapping['image']}')`;
  
    // Action 2: Add mouseenter event listener to imageElement
    //imageElement.addEventListener('mouseenter', function() {
      // Hide the image element
      //imageElement.style.display = 'none';
      //const iframeGrid = element.querySelector('.iframe-grid');
      //if (iframeGrid && dataMapping['video'] && !iframeGrid.dataset.videoSet) {
        // const videoUrl = dataMapping['video'].replace('500/500', '500/500/autoplay');
        // iframeGrid.src = videoUrl;
        // iframeGrid.dataset.videoSet = 'true';
     // }
    // }, { once: true });
  // }
// Vanilla JS equivalent for modal behavior
// Modal behavior with vanilla JS
document.addEventListener('DOMContentLoaded', function() {

  // Set initial styles
  const dModalWrapper = document.querySelector('.d-modal-wrapper');
  if (dModalWrapper) {
    dModalWrapper.classList.add('hide');
    dModalWrapper.style.opacity = '0';
  } else {
    console.log('Class .d-modal-wrapper not found');
  }

  const viewDContainers = document.querySelectorAll('.view-d_container');
  if (viewDContainers.length === 0) {
    console.log('Class .view-d_container not found');
  }
  viewDContainers.forEach(container => {
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
  });

  // Mouse enter event for .grid-panel
  document.querySelectorAll('.grid-panel').forEach(gridPanel => {
    gridPanel.addEventListener('mouseenter', function() {
      const diamondModal = document.querySelector('.diamond-modal');
      if (diamondModal) {
        diamondModal.style.opacity = '100%';
      } else {
        console.log('Class .diamond-modal not found');
      }
    });
  });

  // Click event for .diamond-modal
  const diamondModal = document.querySelector('.diamond-modal');
  if (diamondModal) {
    diamondModal.addEventListener('click', function() {
      if (dataMapping['video']) {
        const iframeModal = document.querySelector('.iframe-modal');
        if (iframeModal) {
          iframeModal.src = dataMapping['video'];
        } else {
          console.log('Class .iframe-modal not found');
        }
      }

      if (dModalWrapper) {
        dModalWrapper.classList.remove('hide');
        setTimeout(() => {
          dModalWrapper.style.opacity = '1';
        }, 240);
      }
    });
  }

  // Close behavior for .modal-close_area and .modal-close_btn
  document.querySelectorAll('.modal-close_area, .modal-close_btn').forEach(closeElement => {
    closeElement.addEventListener('click', function() {
      viewDContainers.forEach(container => {
        container.style.transform = 'translateY(20px)';
        container.style.opacity = '0';
        container.style.transition = 'transform 0.2s ease-in, opacity 0.2s ease-in';
      });

      if (dModalWrapper) {
        dModalWrapper.style.opacity = '0';
        setTimeout(() => {
          dModalWrapper.classList.add('hide');
        }, 300);
      }
    });
  });

// When .diamond-modal is clicked
//document.querySelector('.diamond-modal').addEventListener('click', function() {
  //if (iframeModal && dataMapping['video']) {
    //const VideoUrl = dataMapping['video'].replace('500/500', '500/500/autoplay');
    //iframeModal.src = VideoUrl;
  //}


 Object.keys(dataMapping).forEach(key => {
   if (key !== 'image') {
     const elements = element.querySelectorAll(`[data-element="${key}"]`);
     elements.forEach(el => {
    if (key === 'video' && el.classList.contains('iframe-grid') && dataMapping[key]) {
            el.src = dataMapping[key];
        } else if (key === 'pdfUrl' && dataMapping[key]) {
         el.href = dataMapping[key];
       } else {
         el.textContent = dataMapping[key];
       }
     });
   }
 });
}