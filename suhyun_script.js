const itemsPerPage = 25;
let currentPage = 1;
let flipTimeout;

function openNav() {
    document.getElementById("mySidebar").style.width = "300px"; // 사이드바 열기
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0"; // 사이드바 닫기
}

function openSearchOverlay() {
    document.getElementById('searchOverlay').style.display = 'flex'; // 검색 오버레이 열기
}

function closeSearchOverlay() {
    document.getElementById('searchOverlay').style.display = 'none'; // 검색 오버레이 닫기
}

function performSearch() {
    var searchInput = document.getElementById('searchInput').value.trim();

    if (searchInput === '') {
        alert('검색어를 입력하고 enter 또는 검색 버튼을 클릭해주세요.'); // 검색어가 없을 때 경고 메시지
    } else {
        window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(searchInput);
    }
}

// 드롭다운으로 정렬 기준을 선택하는 함수
function sortItems() {
    var sortOption = document.getElementById('sortOptions').value;

    if (sortOption === 'popularity') {
        alert('인기순으로 정렬됩니다.');
        // 정렬 로직 추가
    } else if (sortOption === 'lowPrice') {
        alert('낮은 가격순으로 정렬됩니다.');
        // 정렬 로직 추가
    } else if (sortOption === 'highPrice') {
        alert('높은 가격순으로 정렬됩니다.');
        // 정렬 로직 추가
    }
}

// 아코디언 메뉴 기능 (∨ 클릭 시 하위 메뉴 열기)
var acc = document.getElementsByClassName("accordion");
for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function(e) {
        if (e.target.tagName === 'SPAN') {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
                this.querySelector('.icon').textContent = "∨";  // 닫힘 상태
            } else {
                panel.style.display = "block";
                this.querySelector('.icon').textContent = "∧";  // 열림 상태
            }
        }
    });
}

function filterCategory(category) {
    const filteredDrinks = drinks.filter(drink => drink.category === category);
    renderDrinkList(filteredDrinks);
}

function renderDrinkList() {
  const container = document.getElementById('drinkListContainer');
  container.innerHTML = '';

  const drinks = Object.values(products); // products 객체를 배열로 변환하여 사용
  drinks.forEach(drink => {
      const card = document.createElement('div');
      card.classList.add('drink-card');

      card.innerHTML = `
          <div class="card-inner">
              <div class="card-front">
                  <img src="${drink.imageUrl}" alt="${drink.name}">
                  <h3>${drink.name}</h3>
                  <button class="heart-btn ${drink.liked ? 'liked' : 'unliked'}" onclick="toggleLike('${drink.name}')">
                      ${drink.liked ? '❤️' : '🤍'}
                  </button>
              </div>
              <div class="card-back">
                  <h4>알코올 도수: ${drink.abv}</h4>
                  <p>가격: ${drink.price}</p>
                  <p>평점: ${drink.rating}</p>
              </div>
          </div>
      `;

    const cardInner = card.querySelector('.card-inner');

    // 마우스를 올리면 1초 뒤에 카드가 뒤집힘
    card.addEventListener('mouseenter', () => {
      flipTimeout = setTimeout(() => {
        cardInner.style.transform = 'rotateY(180deg)';
      }, 1000); // 1초 후에 뒤집힘
    });

    // 마우스가 빠져나가면 카드가 원래대로 돌아옴
    card.addEventListener('mouseleave', () => {
      clearTimeout(flipTimeout); // 타이머를 초기화하여 카드가 뒤집히지 않음
      cardInner.style.transform = 'rotateY(0deg)';
    });

    // 카드 클릭 시 상세 페이지로 이동
    card.addEventListener('click', () => {
      navigateToDetailPage(drink.name);
    });

    container.appendChild(card);
  });

   // 로그인 여부 (실제 로그인 상태는 서버에서 가져와야 함)
   let isLoggedIn = true; // 기본값으로 로그인되지 않은 상태 설정

   const wishlistMessage = document.getElementById('wishlist-message');
   const loginMessage = document.getElementById('login-message');

   // 찜 버튼 클릭 이벤트
   document.querySelectorAll('.heart-btn').forEach(btn => {
       btn.addEventListener('click', function(event) {
           event.stopPropagation(); // 상위로의 클릭 이벤트 전파를 방지
           event.preventDefault(); // 링크로 이동하는 것을 방지 (필요한 경우)
           if (!isLoggedIn) {
               // 로그인되지 않은 경우 로그인 알림 표시
               showLoginMessage();
           } else {
               // 로그인된 경우 찜 기능 토글
               toggleWishlist(this);
           }
       });
   });

   // 찜하기 기능 토글
   function toggleWishlist(element) {
       if (element.classList.contains('unliked')) {
           element.classList.remove('unliked');
           element.classList.add('liked');
           element.innerHTML = '❤️'; // 찜한 상태로 변경
           showWishlistMessage('관심상품에 등록되었습니다.');
       } else {
           element.classList.remove('liked');
           element.classList.add('unliked');
           element.innerHTML = '🤍'; // 찜 취소 상태로 변경
           showWishlistMessage('관심상품에서 삭제되었습니다.');
       }
   }

   // 찜 목록 관련 메시지 표시
   function showWishlistMessage(message) {
       wishlistMessage.textContent = message; // 메시지 설정
       wishlistMessage.style.display = 'block'; // 메시지 표시
       wishlistMessage.classList.add('show'); // 메시지 표시 (CSS 애니메이션)
       setTimeout(() => {
           wishlistMessage.classList.remove('show'); // 3초 후 메시지 숨김 (애니메이션 제거)
           wishlistMessage.style.display = 'none'; // 메시지 숨김
       }, 3000);
   }

   // 로그인 메시지 표시
   function showLoginMessage() {
       loginMessage.style.display = 'block'; // 메시지 표시
       loginMessage.classList.add('show'); // CSS 애니메이션 적용
       setTimeout(() => {
           loginMessage.classList.remove('show'); // 3초 후 메시지 숨김 (애니메이션 제거)
           loginMessage.style.display = 'none'; // 메시지 숨김
       }, 3000);
   }

   // 카드 클릭 시 상세 페이지로 이동
   document.querySelectorAll('.drink-card').forEach(card => {
       card.addEventListener('click', function() {
           navigateToDetailPage(card.querySelector('h3').textContent);
       });
   });

   // 카드 클릭 시 상세 페이지로 이동하는 함수
    function navigateToDetailPage(drinkName) {
  // products 객체를 순회하여 name 값과 일치하는 제품의 키를 찾습니다.
  const productKey = Object.keys(products).find(key => products[key].name === drinkName);

  // 키가 발견되면 상세 페이지로 이동하며 URL에 해당 키를 포함합니다.
  if (productKey) {
      window.location.href = `detail.html?product=${productKey}`;
  } else {
      // 키를 찾지 못하면 기본값으로 product1로 이동합니다.
      window.location.href = `detail.html?product=product1`;
  }
}

  updatePagination();
}

function updatePagination() {
  const pageInfo = document.getElementById('pageInfo');
  const totalPages = Math.ceil(drinks.length / itemsPerPage);
  
  pageInfo.textContent = `${currentPage} / ${totalPages}`;
  
  document.getElementById('prevPageBtn').disabled = currentPage === 1;
  document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderDrinkList();
  }
}

function nextPage() {
  const totalPages = Math.ceil(drinks.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderDrinkList();
  }
}

  // 검색 페이지와 상호작용 (예시)
  var searchPageButtons = document.querySelectorAll('.search-page .heart');
  searchPageButtons.forEach(btn => {
      if (btn.dataset.id === element.dataset.id) {
          btn.classList.toggle('active', element.classList.contains('active'));
          btn.innerHTML = element.innerHTML;
      }
  });

// 페이지가 로드되면 리스트를 렌더링합니다.
window.onload = renderDrinkList;

