// Invoice Generation
function generateInvoiceHTML() {
    let subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    let shipping = 5.99;
    let total = subtotal + shipping;
    
    let itemsRows = cart.map(i => `
        <tr>
            <td>${escapeHtml(i.name)}</td>
            <td>${i.quantity}</td>
            <td>$${i.price.toFixed(2)}</td>
            <td>$${(i.price * i.quantity).toFixed(2)}</td>
        </tr>
    `).join('');
    
    return `<!DOCTYPE html>
    <html>
    <head><title>HopefulHands Invoice</title>
    <style>
        body{font-family:sans-serif;padding:30px;background:#f5f0e8;}
        .invoice{max-width:600px;margin:auto;background:white;border-radius:20px;padding:30px;border-left:8px solid #d4af37;}
        .total{font-size:1.4rem;font-weight:bold;}
        table{width:100%;border-collapse:collapse;}
        th,td{border:1px solid #ddd;padding:8px;text-align:left;}
    </style>
    </head>
    <body>
    <div class='invoice'>
        <h2 style='color:#4B0082;'>HopefulHands Nonprofit</h2>
        <p>Thank you for your donation purchase!</p>
        <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead>
            <tbody>${itemsRows}</tbody>
            <tfoot>
                <tr><td colspan="3"><strong>Subtotal</strong></td><td>$${subtotal.toFixed(2)}</td></tr>
                <tr><td colspan="3">Shipping</td><td>$${shipping.toFixed(2)}</td></tr>
                <tr><td colspan="3"><strong>Total Donation</strong></td><td><strong>$${total.toFixed(2)}</strong></td></tr>
            </tfoot>
        </table>
        <p><i class='fas fa-heart'></i> 100% proceeds go to community aid.</p>
        <p>Order date: ${new Date().toLocaleString()}</p>
        <p>HopefulHands · nonprofit marketplace</p>
    </div>
    </body>
    </html>`;
}

function downloadPDFInvoice() {
    if (cart.length === 0) {
        alert("Cart is empty. Add items first.");
        return;
    }
    let invoiceHtml = generateInvoiceHTML();
    let element = document.createElement('div');
    element.innerHTML = invoiceHtml;
    let opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `HopefulHands_Invoice_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

function generateEmailInvoiceAndSend() {
    if (cart.length === 0) {
        alert("Cart is empty. Add items before invoice.");
        return;
    }
    let invoiceHtml = generateInvoiceHTML();
    let emailBody = encodeURIComponent(invoiceHtml);
    let mailtoLink = `mailto:youremail@example.com?subject=HopefulHands Donation Invoice&body=${emailBody}`;
    window.location.href = mailtoLink;
    alert("Your email client will open. Replace 'youremail@example.com' with your actual email address and send.");
    downloadPDFInvoice();
}
