document.addEventListener("DOMContentLoaded", function() {
    console.log("Document loaded");

    const tabs = document.querySelectorAll('.tab');
    const productContainer = document.getElementById('product-container');
    console.log("Tabs:", tabs);
    console.log("Product container:", productContainer);

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            console.log("Tab clicked");
            const category = tab.dataset.category;
            console.log("Selected category:", category);
            fetchProducts(category);
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Fetch products based on category
    function fetchProducts(category) {
        console.log("Fetching products for category:", category);
        fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
            .then(response => response.json())
            .then(data => {
                console.log("Products data:", data);
                const categoryData = data.categories.find(cat => cat.category_name.toLowerCase() === category.toLowerCase());
                if (categoryData) {
                    renderProducts(categoryData.category_products);
                } else {
                    console.error('Category not found:', category);
                }
            })
            .catch(error => console.error('Error fetching products:', error));
    }

function renderProducts(products) {
    console.log("Rendering products:", products);
    productContainer.innerHTML = '';

    if (products && products.length > 0) {
        products.forEach(product => {
            const discount = calculateDiscount(product.price, product.compare_at_price);
            const badge = product.badge_text ? `<div class="badge">${product.badge_text}</div>` : '';
            const productCard = `
                <div class="product-card">
                    <img class="product-image" src="${product.image}" alt="${product.title}">
                    ${badge}
                    <div class="product-info">
                        <div class="title-and-vendor">
                            <div class="product-title">${product.title}</div>
                            <div class="vendor">${product.vendor}</div>
                        </div>
                        <div class="price-info">
                            <div class="price">Rs${product.price}.00</div>
                            <div class="compare-price"> ${product.compare_at_price}.00</div>
                            <div class="discount">${discount}%Off</div>
                        </div>
                    </div>
                    <button class="add-to-cart-button">Add to Cart</button>
                </div>
            `;
            productContainer.innerHTML += productCard;
        });
    } else {
        productContainer.innerHTML = '<p>No products available.</p>';
    }
}


    // Calculate discount percentage
    function calculateDiscount(price, comparePrice) {
        const savings = (1 - (price / comparePrice)) * 100;
        return Math.round(savings);
    }

    const activeTab = document.querySelector('.tab.active');
    const activeCategory = activeTab.dataset.category;
    console.log("Initial active category:", activeCategory);
    fetchProducts(activeCategory);
});
