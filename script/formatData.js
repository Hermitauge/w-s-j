export function formatShape(shape) {
    if (!shape) return 'N/A';
    return shape.split(' ')[0].charAt(0).toUpperCase() + shape.split(' ')[0].slice(1).toLowerCase();
}

export function formatPrice(priceInCents) {
    const priceInDollars = priceInCents / 100;
    return '$' + priceInDollars.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function formatCarats(carats) {
    return carats ? carats.toFixed(2) : 'N/A';
}

export function formatLength(length) {
    return length ? length.toFixed(2) : 'N/A';
}

export function formatWidth(width) {
    return width ? width.toFixed(2) : 'N/A';
}

export function formatDepth(depth) {
    return depth ? depth.toFixed(2) : 'N/A';
}

export function formatTable(table) {
    return table ? table.toFixed(2) : 'N/A';
}

export function formatCut(cut) {
    switch (cut) {
        case 'F':
            return 'Fair';
        case 'GD':
            return 'Good';
        case 'VG':
            return 'Very Good';
        case 'EX':
            return 'Excellent';
        case 'ID':
            return 'Ideal';
        case 'EIGHTX':
            return 'Super Ideal';
        default:
            return cut;
    }
}

export function formatDecimal(value) {
    if (typeof value !== 'number' || isNaN(value)) {
        return 'N/A';
    }
    return value.toFixed(2);
}

export function formatDiamondIcon() {
    // Select all elements with the class 'd-shapes'
    const dShapesElements = document.querySelectorAll('.d-shapes');

    // Iterate over each element
    dShapesElements.forEach(elem => {
        // Find the next sibling span element
        const nextSpan = elem.nextElementSibling;

        // Check if the next sibling is indeed a span and has the desired data
        if (nextSpan && nextSpan.tagName === 'SPAN' && nextSpan.classList.contains('dshape-span')) {
            // Extract text, format it, and add as a class to the .d-shapes element
            const textContent = nextSpan.textContent.trim().toLowerCase();
            elem.classList.add(textContent);
        }
    });
}

// Call this function after the page loads and after any dynamic content is added
