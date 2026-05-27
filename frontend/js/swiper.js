/* currently hardcoded list of Facebook post links */

const fbPosts = [
    "https://www.facebook.com/UPVprojectPAWradise/posts/pfbid0t8AYza7BGaQjfUBb2eUxdW8SV3X3aNUDzs8BgGSNQbtcQGhAVx66NhHjqX8eyim8l",
    "https://www.facebook.com/UPVprojectPAWradise/posts/pfbid02efrjPHdJdmrA5SDDzr9yE2YZgGi2Lu9gXUENfPVEwskbKawDV1SpcgAjW82NL9Kql",
    "https://www.facebook.com/UPVprojectPAWradise/posts/pfbid02W3nzDyVJRZBmoVm1MPreyFyH5qAinBupCyRRQadB4nLnhxaX2iEXdk8KqDgvCVWrl",
    "https://www.facebook.com/UPVprojectPAWradise/posts/pfbid0LDwEnSYMnJHt4QPAzEhjizDGzNLtafdFVLiziRVfFwr6ifSbVSw7mY631F1QJJXol",
    "https://www.facebook.com/UPVprojectPAWradise/posts/pfbid026AFC1xoi32b5MCD8upPR42ixJAwErcpVG2Z1NXydhVAKhrNRsRY8kHLaemdPNFxKl"
];

const wrapper = document.getElementById("swiperWrapper");

/* create slides synamically */

fbPosts.forEach(postUrl => {
    const encodedUrl = encodeURIComponent(postUrl);

    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

    slide.innerHTML = `
    <iframe
        src="https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true"
        width="500"
        height="600"
        scrolling="no"
        frameborder="0"
        allowfullscreen="true"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
    </iframe>
    `;

    wrapper.appendChild(slide);
});

/* initialize swiper */

const swiper = new Swiper(".mySwiper", {
    loop: true,
    spaceBetween: 30,
    centeredSlides: true,

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});