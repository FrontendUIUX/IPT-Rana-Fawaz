gsap.registerPlugin(ScrollTrigger);const masterTL=gsap.timeline({paused:!0}),navItems=gsap.utils.toArray(".navbar-nav .nav-item");masterTL.from(navItems,{x:-50,opacity:0,stagger:.1,duration:.5,ease:"power4.out"}),masterTL.from(".navbar-brand img",{scale:1.4,opacity:0,duration:.8,ease:"elastic.out(1, 0.5)"},"-=0.3");const notificationBell=document.querySelector(".notification-bell img");notificationBell&&masterTL.from(notificationBell,{y:-30,opacity:0,duration:.6,ease:"bounce.out"},"-=0.2");const carouselCaption=document.querySelector(".carousel-caption h4");carouselCaption&&masterTL.from(carouselCaption,{opacity:0,y:20,duration:.8,ease:"power2.out"},"-=0.3"),masterTL.from(".banner-caption h1",{opacity:0,y:20,duration:.8,ease:"power2.out"},"-=0.3"),masterTL.timeScale(.5),masterTL.play(),ScrollTrigger.create({trigger:"#mainCarousel",start:"top bottom",end:"bottom top",onEnter(){masterTL.restart()},once:!0}),gsap.from("#news-section",{opacity:0,y:60,duration:1.2,ease:"power2.out",scrollTrigger:{trigger:"#news-section",start:"top 60%",end:"bottom 40%",once:!0}}),gsap.from(".news-item",{x:-40,opacity:0,duration:1.2,stagger:.4,ease:"power3.out",scrollTrigger:{trigger:"#news-section",start:"top 55%",end:"bottom 40%",once:!0}}),gsap.from("#userCarousel",{opacity:0,rotateY:50,duration:1.5,ease:"power3.out",scrollTrigger:{trigger:"#userCarousel",start:"top 60%",end:"bottom 40%",once:!0}}),gsap.from(".card-header h2, .card-header a",{opacity:0,y:30,duration:1,stagger:.25,ease:"power2.out",scrollTrigger:{trigger:".card-header",start:"top 65%",end:"bottom 20%",once:!0}}),gsap.from("#userCarousel img",{scale:.6,opacity:0,duration:1.2,stagger:.3,ease:"back.out(1.7)",scrollTrigger:{trigger:"#userCarousel",start:"top 60%",end:"bottom 40%",once:!0}}),gsap.from(".energy-title span .quote-img",{scale:0,opacity:0,duration:.6,ease:"bounce.out",scrollTrigger:{trigger:".energy-header",start:"top 75%",once:!0}}),gsap.from(".energy-card",{y:60,opacity:0,duration:.8,ease:"power4.out",stagger:.2,scrollTrigger:{trigger:".energy-gallery",start:"top 80%",once:!0}}),gsap.from(".energy-viewall button",{x:100,opacity:0,duration:.8,ease:"power2.out",scrollTrigger:{trigger:".energy-viewall",start:"top 90%",once:!0}}),$(document).ready(function(){$("#userDropdownTrigger").on("click",function(e){e.stopPropagation(),$("#userDropdownMenu").toggleClass("show")}),$(document).on("click",function(){$("#userDropdownMenu").removeClass("show")}),$("#userDropdownMenu .dropdown-item").on("click",function(e){e.preventDefault();let s=$(this).data("name"),a=$(this).data("img"),o=$("#currentUserName").text(),l=$("#currentUserImg").attr("src");$("#currentUserName").text(s),$("#currentUserImg").attr("src",a),$(this).data("name",o),$(this).data("img",l),$(this).find("span").text(o),$(this).find("img").attr("src",l),$("#userDropdownMenu").removeClass("show")})});const toggle=document.getElementById("searchToggle"),box=document.getElementById("searchBox");toggle.addEventListener("click",()=>{box.style.display="block"===box.style.display?"none":"block"}),document.addEventListener("click",e=>{toggle.contains(e.target)||box.contains(e.target)||(box.style.display="none")});const carouselElement=document.getElementById("mainCarousel");if(carouselElement){let e=bootstrap.Carousel.getInstance(carouselElement)||new bootstrap.Carousel(carouselElement);carouselElement.addEventListener("click",()=>{e.next()})}document.addEventListener("DOMContentLoaded",function(){document.querySelector("#mainCarousel");let e=document.getElementById("slideIndicatorBar"),s=document.createElement("div");s.className="progress-bar-track",s.innerHTML='<div class="progress-bar-fill"></div>';let a=0;function o(a){e.innerHTML="";let o=document.createElement("span"),l;o.className="slide-num",o.textContent=`0${a+1}`,e.appendChild(o),e.appendChild(s),(l=s.querySelector(".progress-bar-fill")).style.transition="none",l.style.width="0%",setTimeout(()=>{l.style.transition="width 4500ms linear",l.style.width="100%"},50);let r=document.createElement("span");r.className="slide-num",r.textContent=`0${a+1<3?a+2:a+1}`,e.appendChild(r)}let l=document.querySelector("#mainCarousel");l&&(l.addEventListener("slide.bs.carousel",function(e){o(a=e.to)}),o(a))});const offcanvasTitle=document.getElementById("offcanvasTitle"),offcanvasContent=document.getElementById("offcanvasContent"),contentMap={directory:{title:"Group Directory Search",content:`

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

      <div class="accordion-item border-0 mb-3" style="background:transparent">
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
            <p class="d-flex align-items-center mb-0" style="gap: 3rem;"><strong>Email:</strong><a href="#" style="color: #3F7B94;">JadKhoury@gmail.com</a></p>
          </div>
        </div>
      </div>

      <div class="accordion-item border-0 mb-3" style="background:transparent">
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
            <p class="d-flex align-items-center mb-0" style="gap: 3rem;"><strong>Email:</strong> <a href="#" style="color: #3F7B94;">MayaSaad@gmail.com</a></p>
          </div>
        </div>
      </div>

      <div class="accordion-item border-0 mb-3" style="background:transparent">
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
            <p class="d-flex align-items-center mb-0" style="gap: 3rem;"><strong>Email:</strong> <a href="#" style="color: #3F7B94;">ZiadHaddad@gmail.com</a></p>
          </div>
        </div>
      </div>

    </div>
  `},events:{title:"Upcoming Events",content:`
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
`},social:{title:"Social Feed",content:`<p>📢 Company announcements or posts here...</p>`},charts:{title:"Polls",content:`
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

</div>`}};document.querySelectorAll('[data-bs-toggle="offcanvas"]').forEach(e=>{e.addEventListener("click",s=>{let a=e.getAttribute("data-section");contentMap[a]&&(offcanvasTitle.textContent=contentMap[a].title,offcanvasContent.innerHTML=contentMap[a].content)})});const closeBtn=document.getElementById("outsideCloseBtn"),sidebarPanel=document.getElementById("sidebarPanel");sidebarPanel&&closeBtn&&(sidebarPanel.addEventListener("shown.bs.offcanvas",()=>{closeBtn.classList.remove("d-none")}),sidebarPanel.addEventListener("hidden.bs.offcanvas",()=>{closeBtn.classList.add("d-none")}));const outsideBtn=document.getElementById("outsideCloseBtn"),internalBtn=document.getElementById("internalCloseBtn");outsideBtn&&internalBtn&&outsideBtn.addEventListener("click",()=>{internalBtn.click()});const sidebarLinks=document.querySelectorAll("#sidebar .nav-link");document.querySelectorAll('[data-bs-toggle="offcanvas"]').forEach(e=>{e.addEventListener("click",function(){let e=this.getAttribute("data-section");sidebarLinks.forEach(e=>e.classList.remove("active-section")),sidebarLinks.forEach(s=>{s.getAttribute("data-section")===e&&s.classList.add("active-section")})})}),sidebarPanel&&sidebarPanel.addEventListener("hidden.bs.offcanvas",()=>{sidebarLinks.forEach(e=>e.classList.remove("active-section"))});const offcanvas=document.getElementById("sidebarPanel");offcanvas&&offcanvas.addEventListener("shown.bs.offcanvas",()=>{let e=offcanvas.querySelectorAll(".poll-option");function s(){e.forEach(e=>{let s=e.querySelector(".poll-fill"),a=e.querySelector(".percentage"),o=e.querySelector(".option-text");s&&(s.style.transition="none",s.style.width="0%",s.style.minWidth="0",s.offsetHeight,s.style.transition=""),a&&(a.textContent="0%",a.classList.remove("text-primary","fw-bold"),a.classList.add("text-muted"),a.style.opacity="0"),o&&(o.classList.remove("text-primary","fw-bold"),o.classList.add("text-dark")),e.style.borderColor="",e.classList.remove("selected")})}e.forEach(s=>{s.addEventListener("click",a=>{a.stopPropagation(),e.forEach(e=>{let s=e.querySelector(".poll-fill"),a=e.querySelector(".percentage"),o=e.querySelector(".option-text");s&&(s.style.transition="none",s.style.width="0%",s.style.minWidth="0",s.offsetHeight,s.style.transition=""),a&&(a.textContent="0%",a.classList.remove("text-primary","fw-bold"),a.classList.add("text-muted"),a.style.opacity="0"),o&&(o.classList.remove("text-primary","fw-bold"),o.classList.add("text-dark")),e.style.borderColor="",e.classList.remove("selected")}),setTimeout(()=>{e.forEach(e=>{let s=e.dataset.percent,a=e.querySelector(".poll-fill"),o=e.querySelector(".percentage"),l=e.querySelector(".option-text");a&&(a.style.width=s+"%",a.style.minWidth="20px"),o&&(o.textContent=s+"%",o.style.opacity="1",o.classList.remove("text-muted"),o.classList.add("text-muted")),l&&(l.classList.remove("text-primary","fw-bold","text-dark"),l.classList.add("text-dark")),e.style.borderColor="",e.classList.remove("selected")}),s.classList.add("selected"),s.style.borderColor="cadetblue";let a=s.querySelector(".percentage"),o=s.querySelector(".option-text");a&&(a.classList.remove("text-muted"),a.classList.add("text-primary","fw-bold"),a.style.opacity="1"),o&&(o.classList.remove("text-dark"),o.classList.add("text-primary","fw-bold"))},50)})}),document.addEventListener("click",e=>{e.target.closest(".poll-option")||s()}),s()});const t=document.querySelector("#masonry-grid");t&&imagesLoaded(t,()=>{new Masonry(t,{itemSelector:".energy-card.alt-style",columnWidth:".energy-card.alt-style",percentPosition:!0,gutter:20,horizontalOrder:!0})}),document.addEventListener("DOMContentLoaded",()=>{let e=document.querySelectorAll(".energy-card.alt-style"),s=document.getElementById("mediaOverlay"),a=document.querySelector(".media-close"),o=document.querySelector(".swiper-wrapper"),l=document.getElementById("mediaTitle"),r=[...e].map(e=>({src:e.querySelector("img").src,title:e.querySelector("h2").textContent})),n=null,i=[];function d(e){i.length}e.forEach((e,a)=>{e.addEventListener("click",()=>{i=[...r.slice(a),...r.slice(0,a)],n&&(n.destroy(!0,!0),n=null),o.innerHTML="",i.forEach(({src:e,title:s},a)=>{let l=document.createElement("div");l.className="swiper-slide",l.innerHTML=`
          <div style="position:relative; width:100%; height:70vh;">
            <img src="${e}" alt="${s}" style="width:100%; height:100%; object-fit:cover;">
            <div class="play-overlay">
              <img src="./media/Assets/Vector.svg" alt="Play">
            </div>
            <div class="slide-number">${a+1<10?"0"+(a+1):a+1}</div>
          </div>
        `,o.appendChild(l)}),s.style.display="block",l.textContent=i[0].title,n=new Swiper(".mySwiper",{loop:!0,centeredSlides:!0,grabCursor:!0,slidesPerView:2,effect:"coverflow",coverflowEffect:{rotate:0,stretch:0,depth:100,modifier:2,slideShadows:!1},navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"},on:{slideChange(){let e=this.realIndex;l.textContent=i[e].title,d(e)}}}),d(0),n.slideToLoop(0,0)})}),a&&a.addEventListener("click",()=>{s.style.display="none"})});





 

