document.addEventListener('DOMContentLoaded', function() {
    // 페이지 로드 시 실행될 코드

    // URL에서 제품 파라미터를 가져와 해당 제품을 표시
    const urlParams = new URLSearchParams(window.location.search);
    const productKey = urlParams.get('product') || 'product1';

    if (productKey && products[productKey]) {
        const product = products[productKey];

        // 브레드크럼 업데이트
        document.getElementById('category-link').textContent = "술 검색";
        document.getElementById('category-link').href = `index.html`;

        document.getElementById('main-category-link').textContent = product.mainCategory;
        document.getElementById('main-category-link').href = `/category/${product.mainCategory}`;

        document.getElementById('sub-category-link').textContent = product.subCategory;
        document.getElementById('sub-category-link').href = `/category/${product.mainCategory}/${product.subCategory}`;

        document.getElementById('product-name-link').textContent = product.name;

        // 상품 정보 업데이트
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-origin').textContent = product.origin;
        document.getElementById('product-abv').textContent = product.abv;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-flavor').textContent = product.flavor;
        document.getElementById('product-price').textContent = product.price;

        // 이미지 업데이트
        const productImage = document.querySelector('.image-placeholder');
        productImage.innerHTML = `<img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: auto;">`;

        // 평점 표시
        document.getElementById('product-rating').textContent = product.rating.toFixed(1);

        // 추천 상품 업데이트
        updateRecommendedProducts(product);
    }

    function updateRecommendedProducts(currentProduct) {
        const recommendationsContainer = document.querySelector('.recommendations');
        recommendationsContainer.innerHTML = ''; // 기존 추천 항목 초기화
    
        // 현재 제품의 mainCategory 및 subCategory 가져오기
        const { mainCategory, subCategory } = currentProduct;
    
        // 추천할 상품 필터링
        const recommendedProducts = Object.values(products).filter(product =>
            (product.mainCategory === mainCategory || product.subCategory === subCategory) &&
            product.name !== currentProduct.name // 현재 보고 있는 상품은 제외
        );
    
        // 추천 상품 DOM 요소 생성 및 추가
        recommendedProducts.forEach(product => {
            const recommendationLink = document.createElement('a');
            recommendationLink.href = `detail.html?product=${Object.keys(products).find(key => products[key] === product)}`;
            recommendationLink.classList.add('recommendation');
    
            recommendationLink.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}" class="recommendation-img">
                <p>${product.name}</p>
            `;
    
            recommendationsContainer.appendChild(recommendationLink);
        });
    }

    let isLoggedIn = true;

    // 관심상품 등록 버튼 클릭 이벤트
    const wishlistBtn = document.getElementById('wishlist-btn');
    const wishlistMessage = document.getElementById('wishlist-message');
    const loginMessage = document.getElementById('login-message');

    wishlistBtn.addEventListener('click', function() {
        if (!isLoggedIn) {
            showLoginMessage();
        } else {
            toggleWishlist();
        }
    });

     // 관심상품 등록/삭제 기능
    function toggleWishlist() {
        const isLiked = wishlistBtn.textContent === '❤️';
        wishlistBtn.textContent = isLiked ? '🤍' : '❤️';
        showWishlistMessage(isLiked ? '관심상품에서 삭제되었습니다.' : '관심상품에 등록되었습니다.');
    }

    // 관심상품 등록 메시지 표시
    function showWishlistMessage(message) {
        wishlistMessage.textContent = message;
        wishlistMessage.style.display = 'block';
        wishlistMessage.classList.add('show');
        setTimeout(() => {
            wishlistMessage.classList.remove('show');
            wishlistMessage.style.display = 'none';
        }, 3000);
    }

    // 로그인 필요 메시지 표시
    function showLoginMessage() {
        loginMessage.style.display = 'block';
        loginMessage.classList.add('show');
        setTimeout(() => {
            loginMessage.classList.remove('show');
            loginMessage.style.display = 'none';
        }, 3000);
    }
});
