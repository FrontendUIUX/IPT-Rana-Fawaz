
gsap.registerPlugin(ScrollTrigger);
const masterTL = gsap.timeline({ paused: true });
const navItems = gsap.utils.toArray(".navbar-nav .nav-item");
masterTL.from(navItems, {
  x: -50,
  opacity: 0,
  stagger: 0.1,
  duration: 0.5,
  ease: "power4.out"
});

masterTL.from(".navbar-brand img", {
  scale: 1.4,
  opacity: 0,
  duration: 0.8,
  ease: "elastic.out(1, 0.5)"
}, "-=0.3");

const notificationBell = document.querySelector(".notification-bell img");
if (notificationBell) {
  masterTL.from(notificationBell, {
  y: -30,
  opacity: 0,
  duration: 0.6,
  ease: "bounce.out"
  },"-=0.2");
}

const carouselCaption = document.querySelector(".carousel-caption h4");
if (carouselCaption) {
  masterTL.from(carouselCaption, {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: "power2.out"
  }, "-=0.3");
}

masterTL.from(".banner-caption h1", {
  opacity: 0,
  y: 20,
  duration: 0.8,
  ease: "power2.out"
}, "-=0.3");

masterTL.timeScale(0.5);
masterTL.play();

ScrollTrigger.create({
  trigger: "#mainCarousel",
  start: "top bottom",
  end: "bottom top",
  onEnter: () => {
    masterTL.restart();
  },
  once: true
});

gsap.from("#news-section", {
  opacity: 0,
  y: 60,
  duration: 1.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#news-section",
    start: "top 60%",
    end: "bottom 40%",
    once: true
  }
});

gsap.from(".news-item", {
  x: -40,
  opacity: 0,
  duration: 1.2,
  stagger: 0.4,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#news-section",
    start: "top 55%",
    end: "bottom 40%",
    once: true
  }
});

gsap.from("#userCarousel", {
  opacity: 0,
  rotateY: 50,
  duration: 1.5,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#userCarousel",
    start: "top 60%",
    end: "bottom 40%",
    once: true
  }
});

gsap.from(".card-header h2, .card-header a", {
  opacity: 0,
  y: 30,
  duration: 1,
  stagger: 0.25,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".card-header",
    start: "top 65%",
    end: "bottom 20%",
    once: true
  }
});

gsap.from("#userCarousel img", {
  scale: 0.6,
  opacity: 0,
  duration: 1.2,
  stagger: 0.3,
  ease: "back.out(1.7)",
  scrollTrigger: {
    trigger: "#userCarousel",
    start: "top 60%",
    end: "bottom 40%",
    once: true
  }
});

gsap.from(".energy-title span .quote-img", {
  scale: 0,
  opacity: 0,
  duration: 0.6,
  ease: "bounce.out",
  scrollTrigger: {
    trigger: ".energy-header",
    start: "top 75%",
    once: true
  }
});

gsap.from(".energy-card", {
  y: 60,
  opacity: 0,
  duration: 0.8,
  ease: "power4.out",
  stagger: 0.2,
  scrollTrigger: {
    trigger: ".energy-gallery",
    start: "top 80%",
    once: true
  }
});

gsap.from(".energy-viewall button", {
  x: 100,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".energy-viewall",
    start: "top 90%",
    once: true
  }
});

  $(document).ready(function () {
  
    $('#userDropdownTrigger').on('click', function (e) {
      e.stopPropagation();
      $('#userDropdownMenu').toggleClass('show');
    });

   
    $(document).on('click', function () {
      $('#userDropdownMenu').removeClass('show');
    });

   
    $('#userDropdownMenu .dropdown-item').on('click', function (e) {
      e.preventDefault();

   
      const selectedName = $(this).data('name');
      const selectedImg = $(this).data('img');

     
      const currentName = $('#currentUserName').text();
      const currentImg = $('#currentUserImg').attr('src');

     
      $('#currentUserName').text(selectedName);
      $('#currentUserImg').attr('src', selectedImg);

      
      $(this).data('name', currentName);
      $(this).data('img', currentImg);
      $(this).find('span').text(currentName);
      $(this).find('img').attr('src', currentImg);

      
      $('#userDropdownMenu').removeClass('show');
    });
  });
    const toggle = document.getElementById('searchToggle');
  const box = document.getElementById('searchBox');

  toggle.addEventListener('click', () => {
    box.style.display = box.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !box.contains(e.target)) {
      box.style.display = 'none';
    }
  });
    
const carouselElement = document.getElementById('mainCarousel');

if (carouselElement) {
  const carousel = bootstrap.Carousel.getInstance(carouselElement) || new bootstrap.Carousel(carouselElement);

  carouselElement.addEventListener('click', () => {
    carousel.next();
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const slideCount = 3;
  const carousel = document.querySelector('#mainCarousel');
  const indicatorContainer = document.getElementById('slideIndicatorBar');

  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar-track';
  progressBar.innerHTML = '<div class="progress-bar-fill"></div>';

  let currentIndex = 0;
  const slideInterval = 4500;

function buildIndicators(activeIndex) {
  indicatorContainer.innerHTML = '';

  const leftNum = document.createElement('span');
  leftNum.className = 'slide-num';
  leftNum.textContent = `0${activeIndex + 1}`; 
  indicatorContainer.appendChild(leftNum);

  indicatorContainer.appendChild(progressBar);
  startProgressBar();

  const rightNum = document.createElement('span');
  rightNum.className = 'slide-num';
  const nextNum = activeIndex + 1 < slideCount ? activeIndex + 2 : activeIndex + 1;
  rightNum.textContent = `0${nextNum}`;
  indicatorContainer.appendChild(rightNum);
}
  function startProgressBar() {
    const fill = progressBar.querySelector('.progress-bar-fill');
    fill.style.transition = 'none';
    fill.style.width = '0%';

    setTimeout(() => {
      fill.style.transition = `width ${slideInterval}ms linear`;
      fill.style.width = '100%';
    }, 50);
  }

  const carousel1 = document.querySelector('#mainCarousel');
if (carousel1) {
  carousel1.addEventListener('slide.bs.carousel', function (e) {
    currentIndex = e.to;
    buildIndicators(currentIndex);
  });

  buildIndicators(currentIndex);
}
});
const offcanvasTitle = document.getElementById('offcanvasTitle');
const offcanvasContent = document.getElementById('offcanvasContent');

  const contentMap = {
directory: {
  title: 'Group Directory Search',
  content: `

  <div class="input-group" style="background-color: #fafafa; border-radius: 0;">
    <span class="input-group-text bg-transparent border-0" style="padding-left: 2rem; padding-right: 0.5rem;">
      <img src="./media/searchbar-icon.svg" alt="Search" width="30rem" height="30rem" />
    </span>
    <input
      type="search"
      class="form-control border-0 bg-transparent"
      placeholder="Search Users"
      aria-label="Search Users"
      style="box-shadow: none;font-family: 'DIN';"
    />
  </div>

    <div class="accordion" id="userAccordion">

      <div class="accordion-item border-0 mb-3">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed bg-white shadow-sm rounded" type="button" data-bs-toggle="collapse" data-bs-target="#userOne">
            <img src="./media/ellipse%2020.png" alt="Jad" class="rounded-circle me-3" width="55rem" height="55rem">
            <div class="text-start">
              <h6 class="mb-0">Jad El-Khoury</h6>
              <small class="text-muted">Chief Operations Officer (COO)</small>
            </div>
          </button>
        </h2>
        <div id="userOne" class="accordion-collapse collapse" data-bs-parent="#userAccordion">
          <div class="accordion-body bg-light rounded shadow-sm">
            <p class="d-flex align-items-center mb-1" style="gap: 2rem;"><strong>Mobile:</strong>+961 01 234 567</p>
            <p class="d-flex align-items-center mb-0" style="gap: 3rem;"><strong>Email:</strong><a href="#">JadKhoury@gmail.com</a></p>
          </div>
        </div>
      </div>

      <div class="accordion-item border-0 mb-3">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed bg-white shadow-sm rounded" type="button" data-bs-toggle="collapse" data-bs-target="#userTwo">
            <img src="./media/ellipse%2021.png" alt="Maya" class="rounded-circle me-3" width="55rem" height="55rem">
            <div class="text-start">
              <h6 class="mb-0">Maya Saad</h6>
              <small class="text-muted">Head of Marketing</small>
            </div>
          </button>
        </h2>
        <div id="userTwo" class="accordion-collapse collapse" data-bs-parent="#userAccordion">
          <div class="accordion-body bg-light rounded shadow-sm">
            <p class="d-flex align-items-center mb-1" style="gap: 2rem;"><strong>Mobile:</strong> +961 03 456 789</p>
            <p class="d-flex align-items-center mb-0" style="gap: 3rem;"><strong>Email:</strong> <a href="#">MayaSaad@gmail.com</a></p>
          </div>
        </div>
      </div>

      <div class="accordion-item border-0 mb-3">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed bg-white shadow-sm rounded" type="button" data-bs-toggle="collapse" data-bs-target="#userThree">
            <img src="./media/ellipse%2022.png" alt="Ziad" class="rounded-circle me-3" width="55rem" height="55rem">
            <div class="text-start">
              <h6 class="mb-0">Ziad Haddad</h6>
              <small class="text-muted">Senior Project Manager</small>
            </div>
          </button>
        </h2>
        <div id="userThree" class="accordion-collapse collapse" data-bs-parent="#userAccordion">
          <div class="accordion-body bg-light rounded shadow-sm">
            <p class="d-flex align-items-center mb-1" style="gap: 2rem;"><strong>Mobile:</strong>+961 70 987 654</p>
            <p class="d-flex align-items-center mb-0" style="gap: 3rem;"><strong>Email:</strong> <a href="#">ZiadHaddad@gmail.com</a></p>
          </div>
        </div>
      </div>

    </div>
  `
},
    events: {
      title: 'Upcoming Events',
      content: `
        <div class="container" >
<!-- June 11 -->
<p class="event-date text-uppercase text-secondary small mb-2" style="font-family:'DIN';">June 11, 2024</p>

<div class="events-wrapper">

  <div class="event-card">
    <div class="left-line"></div>
    <div class="p-3 flex-grow-1">
      <div class="d-flex justify-content-between align-items-center">
         <div style="display:flex; flex-direction:column">
        <strong>Annual Innovation Summit</strong>
        <span class="text-primary small" style="font-family:'DIN';">Event</span>
        </div>
        <div class="text-end small text-muted">
          <div class="fw-bold" style="color:black;font-family:'DIN';">09:30</div>
          <div style="font-family:'DIN';">10:30</div>
        </div>
      </div>
    </div>
  </div>

  <hr>

  <div class="event-card">
    <div class="left-line"></div>
    <div class="p-3 flex-grow-1">
      <div class="d-flex justify-content-between align-items-center">
       <div style="display:flex; flex-direction:column">
        <strong>Wellness and Health Fair</strong>
        <span class="text-primary small" style="font-family:'DIN';">Event</span>
        </div>
        <div class="text-end small text-muted">
          <div class="fw-bold" style="color:black;font-family:'DIN';">14:10</div>
          <div style="font-family:'DIN';">16:20</div>
        </div>
      </div>
    </div>
  </div>

  <hr>

  <div class="event-card mb-0">
    <div class="left-line"></div>
    <div class="p-3 flex-grow-1">
      <div class="d-flex justify-content-between align-items-center">
       <div style="display:flex; flex-direction:column">
        <strong>Monthly Lunch</strong>
         <span class="text-primary small" style="font-family:'DIN';">Event</span>
        </div>
        <div class="text-end small text-muted">
          <div class="fw-bold" style="color:black;font-family:'DIN';">18:00</div>
          <div style="font-family:'DIN';">19:00</div>
        </div>
      </div>
    </div>
  </div>

</div>

<!-- June 6 -->
<p class="event-date text-uppercase text-secondary small mb-2" style="font-family:'DIN';">June 6, 2024</p>
<div class="events-wrapper">

  <div class="event-card">
    <div class="left-line-red"></div>
    <div class="p-3 flex-grow-1">
      <div class="d-flex justify-content-between align-items-center">
        <div style="display:flex; flex-direction: column;">
          <strong>The Prophet’s Birthday</strong>
          <span class="label-holiday">Holiday</span>
        </div>
        <div class="text-end small fw-bold" style="font-family:'DIN';">All day</div>
      </div>
    </div>
  </div>
        </div>
`
    },
    social: {
      title: 'Social Feed',
      content: `<p>📢 Company announcements or posts here...</p>`
    },
    charts: {
      title: 'Polls',
      content: `
<p class="mb-3" style=" margin:2rem;font-family:'DIN';">How important is the company's focus on renewable energy and sustainability to you?</p>

<div id="poll-options">

  <div class="poll-option border rounded p-3 mb-3 d-flex justify-content-between align-items-center" data-percent="30">
    <div class="poll-fill rounded-start" style="background-color: rgba(136, 172, 181, 0.1);"></div>
    <span class="option-text">Extremely Important</span>
    <span class="percentage text-muted"></span>
  </div>

  <div class="poll-option border rounded p-3 mb-3 d-flex justify-content-between align-items-center" data-percent="52">
    <div class="poll-fill rounded-start" style="background-color: rgba(136, 172, 181, 0.1);"></div>
    <span class="option-text">Very Important</span>
    <span class="percentage text-muted"></span>
  </div>

  <div class="poll-option border rounded p-3 mb-3 d-flex justify-content-between align-items-center"  data-percent="10">
    <div class="poll-fill rounded-start" style="background-color: rgba(136, 172, 181, 0.1);"></div>
    <span class="option-text">Moderately Important</span>
    <span class="percentage text-muted"></span>
  </div>

  <div class="poll-option border rounded p-3 mb-3 d-flex justify-content-between align-items-center" data-percent="18">
    <div class="poll-fill rounded-start" style="background-color: rgba(136, 172, 181, 0.1);"></div>
    <span class="option-text">Not Important</span>
    <span class="percentage text-muted"></span>
  </div>

</div>`
    }
  };

  document.querySelectorAll('[data-bs-toggle="offcanvas"]').forEach(item => {
    item.addEventListener('click', (e) => {
      const section = item.getAttribute('data-section');
      if (contentMap[section]) {
        offcanvasTitle.textContent = contentMap[section].title;
        offcanvasContent.innerHTML = contentMap[section].content;
      }
    });
  });
 
      const closeBtn = document.getElementById('outsideCloseBtn');
  const sidebarPanel = document.getElementById('sidebarPanel');

if (sidebarPanel && closeBtn) {
  sidebarPanel.addEventListener('shown.bs.offcanvas', () => {
    closeBtn.classList.remove('d-none');
  });

  sidebarPanel.addEventListener('hidden.bs.offcanvas', () => {
    closeBtn.classList.add('d-none');
  });
}
const outsideBtn = document.getElementById('outsideCloseBtn');
const internalBtn = document.getElementById('internalCloseBtn');

if (outsideBtn && internalBtn) {
  outsideBtn.addEventListener('click', () => {
    internalBtn.click();
  });
}
    
const sidebarLinks = document.querySelectorAll('#sidebar .nav-link');

document.querySelectorAll('[data-bs-toggle="offcanvas"]').forEach(link => {
  link.addEventListener('click', function () {
    const section = this.getAttribute('data-section');

    sidebarLinks.forEach(l => l.classList.remove('active-section'));


    sidebarLinks.forEach(l => {
      if (l.getAttribute('data-section') === section) {
        l.classList.add('active-section');
      }
    });
  });
});
    

if (sidebarPanel) {
  sidebarPanel.addEventListener('hidden.bs.offcanvas', () => {
    sidebarLinks.forEach(l => l.classList.remove('active-section'));
  });
}
const offcanvas = document.getElementById('sidebarPanel');

if (offcanvas) {
  offcanvas.addEventListener('shown.bs.offcanvas', () => {
    const pollOptions = offcanvas.querySelectorAll('.poll-option');

    function resetPolls() {
      pollOptions.forEach(opt => {
        const fill = opt.querySelector('.poll-fill');
        const percentText = opt.querySelector('.percentage');
        const optionText = opt.querySelector('.option-text');

        if (fill) {
          fill.style.transition = 'none'; 
          fill.style.width = '0%';
          fill.style.minWidth = '0';
          fill.offsetHeight;
          fill.style.transition = '';      
        }
        if (percentText) {
          percentText.textContent = '0%';
          percentText.classList.remove('text-primary', 'fw-bold');
          percentText.classList.add('text-muted');
          percentText.style.opacity = '0'; 
        }
        if (optionText) {
          optionText.classList.remove('text-primary', 'fw-bold');
          optionText.classList.add('text-dark');
        }
        opt.style.borderColor = '';
        opt.classList.remove('selected');
      });
    }

    pollOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();

        pollOptions.forEach(opt => {
          const fill = opt.querySelector('.poll-fill');
          const percentText = opt.querySelector('.percentage');
          const optionText = opt.querySelector('.option-text');

          if (fill) {
            fill.style.transition = 'none';
            fill.style.width = '0%';
            fill.style.minWidth = '0';
            fill.offsetHeight;
            fill.style.transition = '';
          }
          if (percentText) {
            percentText.textContent = '0%';
            percentText.classList.remove('text-primary', 'fw-bold');
            percentText.classList.add('text-muted');
            percentText.style.opacity = '0';
          }
          if (optionText) {
            optionText.classList.remove('text-primary', 'fw-bold');
            optionText.classList.add('text-dark');
          }
          opt.style.borderColor = '';
          opt.classList.remove('selected');
        });

        setTimeout(() => {
          pollOptions.forEach(opt => {
            const percent = opt.dataset.percent;
            const fill = opt.querySelector('.poll-fill');
            const percentText = opt.querySelector('.percentage');
            const optionText = opt.querySelector('.option-text');

            if (fill) {
              fill.style.width = percent + '%';
              fill.style.minWidth = '20px';
            }
            if (percentText) {
              percentText.textContent = percent + '%';
              percentText.style.opacity = '1'; 
              percentText.classList.remove('text-muted');
              percentText.classList.add('text-muted'); 
            }
            if (optionText) {
              optionText.classList.remove('text-primary', 'fw-bold', 'text-dark');
              optionText.classList.add('text-dark');
            }
            opt.style.borderColor = '';
            opt.classList.remove('selected');
          });

          option.classList.add('selected');
          option.style.borderColor = 'cadetblue';

          const clickedPercentText = option.querySelector('.percentage');
          const clickedOptionText = option.querySelector('.option-text');

          if (clickedPercentText) {
            clickedPercentText.classList.remove('text-muted');
            clickedPercentText.classList.add('text-primary', 'fw-bold');
            clickedPercentText.style.opacity = '1';
          }
          if (clickedOptionText) {
            clickedOptionText.classList.remove('text-dark');
            clickedOptionText.classList.add('text-primary', 'fw-bold');
          }
        }, 50); 
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.poll-option')) {
        resetPolls();
      }
    });

    resetPolls();
  });
}

   try {
  console.log('Trying to initialize Masonry...');
  const grid = document.querySelector('#masonry-grid');
  const masonry = new Masonry(grid, {
    itemSelector: '.energy-card.alt-style',
    columnWidth: '.energy-card.alt-style',
    percentPosition: true,
    gutter: 20,
    horizontalOrder: true
  });
  console.log('Masonry initialized:', masonry);
} catch (e) {
  console.error('Masonry failed to initialize:', e);
}


    
const energyCards = document.querySelectorAll('.energy-card.alt-style');
const overlay = document.getElementById('mediaOverlay');
const closeBtn1 = document.querySelector('.media-close');
const slideWrapper = document.querySelector('.media-slide-wrapper');
const mediaTitle = document.getElementById('mediaTitle');

let isFirstOpen = true;
let slideImages = [];
let currentIndex = 0;

const originalImages = [...energyCards].map(card => ({
  src: card.querySelector('img').src,
  title: card.querySelector('h3').textContent
}));

energyCards.forEach((card, index) => {
  card.addEventListener('click', () => {
    const before = originalImages.slice(index);
    const after = originalImages.slice(0, index);
    slideImages = [...before, ...after]; 

    currentIndex = 0;
    updateSlide();
    overlay.style.display = 'block';
  });
});

closeBtn1.addEventListener('click', () => {
  overlay.style.display = 'none';
  isFirstOpen = true;
});

document.querySelector('.prev').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slideImages.length) % slideImages.length;
  updateSlide('prev');
});

document.querySelector('.next').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slideImages.length;
  updateSlide('next');
});

function updateSlide(direction = 'next') {
  const { src, title } = slideImages[currentIndex];
  const prevIndex = (currentIndex - 1 + slideImages.length) % slideImages.length;
  const nextIndex = (currentIndex + 1) % slideImages.length;

  if (isFirstOpen) {
    // No animation on first open
    slideWrapper.innerHTML = `
      <img src="${src}" alt="${title}" style="width: 100%; height: 70vh; object-fit: cover; display: block;">
      <div class="play-overlay">
        <img src="./media/Assets/Vector.svg" alt="Play">
      </div>
      <div class="slide-number">0${currentIndex + 1}</div>
    `;
    mediaTitle.textContent = title;
    document.querySelector('.prev-preview').style.backgroundImage = `url(${slideImages[prevIndex].src})`;
    document.querySelector('.next-preview').style.backgroundImage = `url(${slideImages[nextIndex].src})`;
    
    isFirstOpen = false; 
    return;
  }

  slideWrapper.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
  slideWrapper.style.transform = direction === 'next'
    ? 'translateX(-100%) scale(0.8)'
    : 'translateX(100%) scale(0.8)';
  slideWrapper.style.opacity = 0;

  setTimeout(() => {
    slideWrapper.style.transition = 'none';
    slideWrapper.style.transform = direction === 'next'
      ? 'translateX(100%) scale(0.8)'
      : 'translateX(-100%) scale(0.8)';

    slideWrapper.innerHTML = `
      <img src="${src}" alt="${title}" style="width: 100%; height: 70vh; object-fit: cover; display: block;">
      <div class="play-overlay">
        <img src="./media/Assets/Vector.svg" alt="Play">
      </div>
      <div class="slide-number">0${currentIndex + 1}</div>
    `;
    mediaTitle.textContent = title;
    document.querySelector('.prev-preview').style.backgroundImage = `url(${slideImages[prevIndex].src})`;
    document.querySelector('.next-preview').style.backgroundImage = `url(${slideImages[nextIndex].src})`;

    void slideWrapper.offsetWidth;

    slideWrapper.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    slideWrapper.style.transform = 'translateX(0) scale(1)';
    slideWrapper.style.opacity = 1;
  }, 500);
}