// Main initialization - ties everything together
function renderProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    let filtered = [...productsData];
    let searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    if (searchTerm) {
        filtered = productsData.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:60px;">No items match</div>';
        return;
    }
    
    let html = '';
    filtered.forEach(p => {
        let mainImg = p.images[0] || "https://picsum.photos/id/13/400/300";
        let thumbnailsHtml = p.images.map((img, idx) => 
            `<img class="thumbnail" src="${img}" onclick="changeMainImage(${p.id}, ${idx})">`
        ).join('');
        
        html += `
            <div class="product-card" data-id="${p.id}">
                <div class="product-image-section">
                    <img class="main-product-img" id="mainImg-${p.id}" src="${mainImg}" alt="${p.name}">
                    <div class="thumbnail-row">${thumbnailsHtml}</div>
                </div>
                <div class="product-info">
                    <div class="product-title">${escapeHtml(p.name)}</div>
                    <div class="product-price">$${p.price.toFixed(2)}</div>
                    <div class="product-desc">${escapeHtml(p.description)}</div>
                    <div class="detail-text">
                        <i class="fas fa-clipboard-list"></i> Condition: ${escapeHtml(p.condition)}<br>
                        <i class="fas fa-ruler"></i> Dimensions: ${escapeHtml(p.dimensions)}<br>
                        <i class="fas fa-hand-holding-heart"></i> Donor: ${escapeHtml(p.donor)}
                    </div>
                    <button class="add-to-cart" data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${p.price}">
                        <i class="fas fa-cart-plus"></i> Add to cart
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            let id = parseInt(btn.dataset.id);
            let name = btn.dataset.name;
            let price = parseFloat(btn.dataset.price);
            addToCart({ id, name, price });
        });
    });
}

window.changeMainImage = function(productId, imgIndex) {
    let product = productsData.find(p => p.id === productId);
    if (product && product.images[imgIndex]) {
        let imgElem = document.getElementById(`mainImg-${productId}`);
        if (imgElem) imgElem.src = product.images[imgIndex];
    }
};

function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => renderProducts());
    }
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') renderProducts();
        });
    }
}

function setupButtons() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const pdfBtn = document.getElementById('pdfOnlyBtn');
    
    if (checkoutBtn) checkoutBtn.addEventListener('click', generateEmailInvoiceAndSend);
    if (pdfBtn) pdfBtn.addEventListener('click', downloadPDFInvoice);
}

// Start everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderProducts();
    setupShipping();
    setupSearch();
    setupButtons();
});
