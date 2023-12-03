// loadingAnimation.js
export function showLoadingAnimation() {
    const lottieContainer = document.getElementById('lottie-loading');
    lottieContainer.style.display = 'block';
}

export function hideLoadingAnimation() {
    const lottieContainer = document.getElementById('lottie-loading');
    lottieContainer.style.display = 'none';
}
