// Shipping Calculator
function setupShipping() {
    const btn = document.getElementById('calcShipBtn');
    const zipInput = document.getElementById('zipCode');
    const resultDiv = document.getElementById('shippingResult');
    
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        let zip = zipInput.value.trim();
        if (zip) {
            resultDiv.innerHTML = `<i class="fas fa-truck"></i> Estimated shipping: $5.99 (Flat rate nonprofit shipping)`;
        } else {
            resultDiv.innerHTML = "Please enter a ZIP code";
        }
    });
}
