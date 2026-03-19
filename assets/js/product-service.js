// Product Service - Handles all product-related Supabase operations

const ProductService = {
    // Get all products
    async getAllProducts() {
        try {
            const { data, error } = await sbClient
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching products:', error);
            return { success: false, error: error.message };
        }
    },

    // Get single product by ID
    async getProductById(id) {
        try {
            const { data, error } = await sbClient
                .from('products')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching product:', error);
            return { success: false, error: error.message };
        }
    },

    // Add new product (Admin only)
    async addProduct(product) {
        try {
            const { data, error } = await sbClient
                .from('products')
                .insert([{
                    name: product.name,
                    price: parseFloat(product.price),
                    description: product.description,
                    image_url: product.image_url,
                    category: product.category || 'Furniture'
                }])
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error adding product:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete product (Admin only)
    async deleteProduct(id) {
        try {
            const { error } = await sbClient
                .from('products')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting product:', error);
            return { success: false, error: error.message };
        }
    },

    // Upload product image to Supabase Storage
    async uploadImage(file) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { data, error } = await sbClient.storage
                .from('product-images')
                .upload(filePath, file);

            if (error) throw error;

            // Get public URL
            const { data: urlData } = sbClient.storage
                .from('product-images')
                .getPublicUrl(filePath);

            return { success: true, url: urlData.publicUrl };
        } catch (error) {
            console.error('Error uploading image:', error);
            return { success: false, error: error.message };
        }
    }
};

// Generate product HTML card for shop page
function generateProductCard(product) {
    return `
        <div class="col-lg-4 col-xl-3 col-md-6 col-sm-6 col-xs-6" data-aos="fade-up" data-aos-delay="200">
            <div class="product mb-25px">
                <div class="thumb">
                    <a href="product-detail.html?id=${product.id}" class="image">
                        <img src="${product.image_url || 'assets/images/product-image/1.jpg'}" alt="${product.name}" />
                        <img class="hover-image" src="${product.image_url || 'assets/images/product-image/1.jpg'}" alt="${product.name}" />
                    </a>
                    <span class="badges">
                        <span class="new">New</span>
                    </span>
                    <div class="actions">
                        <a href="product-detail.html?id=${product.id}" class="action quickview" title="View Details">
                            <i class="icon-size-fullscreen"></i>
                        </a>
                    </div>
                    <a href="product-detail.html?id=${product.id}" class="add-to-cart" title="View & Order">View Details</a>
                </div>
                <div class="content">
                    <h5 class="title"><a href="product-detail.html?id=${product.id}">${product.name}</a></h5>
                    <span class="price">
                        <span class="new">${formatPrice(product.price)}</span>
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Load products into shop page
async function loadShopProducts() {
    const container = document.getElementById('products-container');
    const countElement = document.getElementById('product-count');
    
    if (!container) return;
    
    container.innerHTML = '<div class="col-12 text-center"><p>Loading products...</p></div>';
    
    const result = await ProductService.getAllProducts();
    
    if (result.success && result.data.length > 0) {
        container.innerHTML = result.data.map(product => generateProductCard(product)).join('');
        if (countElement) {
            countElement.textContent = `There Are ${result.data.length} Products.`;
        }
    } else if (result.success && result.data.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p>No products available yet. Check back soon!</p></div>';
        if (countElement) {
            countElement.textContent = 'There Are 0 Products.';
        }
    } else {
        container.innerHTML = '<div class="col-12 text-center"><p>Error loading products. Please try again later.</p></div>';
    }
}

// Load single product detail
async function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }
    
    const result = await ProductService.getProductById(productId);
    
    if (result.success) {
        displayProductDetail(result.data);
    } else {
        document.querySelector('.product-details-content').innerHTML = '<p>Product not found.</p>';
    }
}

// Display product detail
function displayProductDetail(product) {
    // Update image
    const mainImage = document.getElementById('product-main-image');
    if (mainImage) {
        mainImage.src = product.image_url || 'assets/images/product-image/zoom-image/1.jpg';
    }
    
    // Update product info
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = formatPrice(product.price);
    document.getElementById('product-description').textContent = product.description || 'High-quality furniture piece for your home.';
    
    // Store product data for email order
    window.currentProduct = product;
}
