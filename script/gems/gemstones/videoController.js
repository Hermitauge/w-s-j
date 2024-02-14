// videoController.js
export function VideoPlayback(videoElement) {
    let isPlaying = false;
  
    videoElement.addEventListener('mouseenter', () => {
      if (!isPlaying) {
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            isPlaying = true;
          }).catch(error => {
            console.error('Error attempting to play video:', error);
          });
        }
      }
    });
  
    videoElement.addEventListener('mouseleave', () => {
      if (isPlaying) {
        videoElement.pause();
        isPlaying = false;
      }
    });
  }
  