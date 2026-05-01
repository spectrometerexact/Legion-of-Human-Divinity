// ============================================
// EDIT YOUR PRODUCTS HERE - Easy to update!
// ============================================

const productsData = [
    {
        id: 1,
        name: "Vintage Ceramic Lamp",
        price: 24.99,
        category: "home",
        description: "A stunning hand-painted ceramic lamp with floral motifs. Perfect for cozy evenings.",
        condition: "Excellent (minor wear on base)",
        dimensions: "12\" tall x 6\" wide",
        donor: "Donated by Maple Street Community",
        images: [
            "https://picsum.photos/id/26/400/300",
            "https://picsum.photos/id/107/400/300",
            "https://picsum.photos/id/20/400/300"
        ]
    },
    {
        id: 2,
        name: "Handcrafted Wooden Bowl",
        price: 18.50,
        category: "kitchen",
        description: "Reclaimed oak wood bowl, hand-carved by local artisans. Food-safe finish.",
        condition: "Like New",
        dimensions: "10\" diameter, 4\" depth",
        donor: "Donated by GreenWood Collective",
        images: [
            "https://picsum.photos/id/127/400/300",
            "https://picsum.photos/id/128/400/300"
        ]
    },
    {
        id: 3,
        name: "Cozy Knit Blanket",
        price: 32.00,
        category: "home",
        description: "Chunky hand-knit blanket in burgundy & cream. Ultra-soft acrylic blend.",
        condition: "Gently used, no stains",
        dimensions: "50\"x60\"",
        donor: "Donated by Warm Hearts Charity",
        images: [
            "https://picsum.photos/id/96/400/300",
            "https://picsum.photos/id/95/400/300",
            "https://picsum.photos/id/28/400/300"
        ]
    },
    {
        id: 4,
        name: "Classic Novel Set (3 books)",
        price: 12.75,
        category: "media",
        description: "Hemingway, Fitzgerald & Morrison. Vintage paperbacks with timeless stories.",
        condition: "Good (some creases)",
        dimensions: "Paperback standard",
        donor: "Donated by Book Lovers United",
        images: [
            "https://picsum.photos/id/0/400/300",
            "https://picsum.photos/id/1/400/300"
        ]
    }
];

// Helper function (don't edit this)
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}
