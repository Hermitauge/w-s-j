// Assuming this is in a file named 'webflowInteractions.js'

export function reinitializeWebflowInteractions() {
    const webflowScript = document.createElement('script');
    webflowScript.src = 'https://assets-global.website-files.com/65569d42eae09515851ebb5c/js/nivoda-api.9d3fd5a41.js';
    webflowScript.onload = function() {
        Webflow.ready();
    };
    document.head.appendChild(webflowScript);
}
