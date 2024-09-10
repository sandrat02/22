document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    const colorFilter = document.getElementById('color-filter');
    const simFilter = document.getElementById('sim');
    const cameraFilter = document.getElementById('camera');
    const sortBy = document.getElementById('sort-by');
    const productItems = Array.from(document.querySelectorAll('.product-item'));
    const loadMoreButton = document.getElementById('load-more');
    let visibleProductCount = 6; 

    
    displayProducts(visibleProductCount);

    
    document.querySelectorAll('.color-button').forEach(button => {
        button.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            const imageUrl = this.getAttribute('data-image');
            const productItem = this.closest('.product-item');
            const img = productItem.querySelector('img');

            
            img.src = imageUrl;

            
            const colorNameElement = document.getElementById('color-name');
            colorNameElement.textContent = color;

            
            document.querySelectorAll('.color-button').forEach(btn => btn.classList.remove('selected'));

            this.classList.add('selected');

            filterProducts();
        });
    });

    searchButton.addEventListener('click', filterProducts);
    colorFilter.addEventListener('change', filterProducts);
    simFilter.addEventListener('change', filterProducts);
    cameraFilter.addEventListener('change', filterProducts);
    sortBy.addEventListener('change', sortProducts);
    searchInput.addEventListener('input', filterProducts);

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedColor = colorFilter.value.toLowerCase();
        const selectedSim = simFilter.value.toLowerCase();
        const selectedCamera = cameraFilter.value.toLowerCase();

        productItems.forEach(product => {
            const productName = product.getAttribute('data-name').toLowerCase();
            const productColors = product.getAttribute('data-colors')?.toLowerCase().split(',') || [];
            const productSim = product.querySelector('.product-details p:nth-child(3)').textContent.toLowerCase().includes('single') ? 'single' : 'dual';
            const productCamera = product.getAttribute('data-camera')?.toLowerCase() || 'default';

            const isNameMatch = productName.includes(searchTerm);
            const isColorMatch = selectedColor === 'all' || productColors.includes(selectedColor);
            const isSimMatch = selectedSim === 'default' || selectedSim === productSim;
 const isCameraMatch = selectedCamera === 'default' || selectedCamera === productCamera;

            if (isNameMatch && isColorMatch && isSimMatch && isCameraMatch) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });

        sortProducts();
    }

    function sortProducts() {
        const sortValue = sortBy.value;
        const sortedItems = [...productItems].filter(product => product.style.display !== 'none');

        if (sortValue === 'low-price') {
            sortedItems.sort((a, b) => parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price')));
        } else if (sortValue === 'high-price') {
            sortedItems.sort((a, b) => parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price')));
        }

        const productGrid = document.querySelector('.product-grid');
        sortedItems.forEach(item => productGrid.appendChild(item));
    }

    function getCameraValue(cameraText) {
        if (cameraText.includes('More than 48MP')) return 'more-than-48mp';
        if (cameraText.includes('48MP')) return '48mp';
        if (cameraText.includes('Less than 48MP')) return 'less-than-48mp';
        return 'default';
    }

    function displayProducts(count) {
        const productsToShow = productItems.slice(0, count);
        productsToShow.forEach(product => product.style.display = '');

        productItems.slice(count).forEach(product => product.style.display = 'none');

        loadMoreButton.style.display = productItems.length > count ? 'block' : 'none';
    }

    loadMoreButton.addEventListener('click', () => {
        visibleProductCount += 2; 
        displayProducts(visibleProductCount);
        if (visibleProductCount >= productItems.length) {
            loadMoreButton.classList.add('hidden');}
    });

    searchButton.addEventListener('click', function() {
        const searchInputValue = searchInput.value;

        if (searchInputValue.trim() !== '') {
            window.location.href = '/search_results.html?query=' + encodeURIComponent(searchInputValue);
        }
        
    });
});