// loadingAnimation.js
export function showLoadingAnimation() {
    const lottieContainer = document.getElementById('lottie-loading');
    lottieContainer.style.display = 'block';
}

export function hideLoadingAnimation() {
    const lottieContainer = document.getElementById('lottie-loading');
    lottieContainer.style.display = 'none';
}

// debounce.js
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
