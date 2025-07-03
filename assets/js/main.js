// MEGA MENU FUNCTION
document.querySelectorAll('[data-menu-trigger]').forEach(trigger => {
    const menuName = trigger.getAttribute('data-menu-trigger');
    const menuContent = document.querySelector(`[data-menu-content="${menuName}"]`);

    if (!menuContent) return;

    trigger.addEventListener('mouseenter', () => {
        document.querySelectorAll('.mega-menu-content').forEach(menu => {
            menu.classList.add('opacity-0', 'invisible', 'pointer-events-none');
            menu.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
        });
        document.querySelectorAll('[data-menu-trigger]').forEach(t => {
            t.classList.remove('active');
        });

        menuContent.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
        menuContent.classList.add('opacity-100', 'visible', 'pointer-events-auto');

        trigger.classList.add('active');
    });

    trigger.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!menuContent.matches(':hover') && !trigger.matches(':hover')) {
                menuContent.classList.add('opacity-0', 'invisible', 'pointer-events-none');
                menuContent.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
                trigger.classList.remove('active');
            }
        }, 200);
    });

    menuContent.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!menuContent.matches(':hover') && !trigger.matches(':hover')) {
                menuContent.classList.add('opacity-0', 'invisible', 'pointer-events-none');
                menuContent.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
                trigger.classList.remove('active');
            }
        }, 200);
    });
});


// MODAL FUNCTION
document.addEventListener("DOMContentLoaded", () => {

    const openButtons = document.querySelectorAll("[data-modal-toggle]");
    const closeButtons = document.querySelectorAll("[data-modal-close]");
    const modals = document.querySelectorAll("[id][tabindex]");

    function openModal(modal) {
        modal.classList.remove("hidden", "pointer-events-none", "opacity-0");
        setTimeout(() => {
            modal.classList.add("opacity-100");
            const content = modal.querySelector("[data-modal-content]");
            if (content) {
                content.classList.remove("scale-95", "opacity-0");
                content.classList.add("scale-100", "opacity-100");
            }
        }, 10);
    }

    function closeModal(modal) {
        modal.classList.remove("opacity-100");
        const content = modal.querySelector("[data-modal-content]");
        if (content) {
            content.classList.remove("scale-100", "opacity-100");
            content.classList.add("scale-95", "opacity-0");
        }
        setTimeout(() => {
            modal.classList.add("hidden", "pointer-events-none", "opacity-0");
        }, 300);
    }

    openButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-modal-toggle");
            const modal = document.getElementById(targetId);
            if (modal) openModal(modal);
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest("[id][tabindex]");
            if (modal) closeModal(modal);
        });
    });

    modals.forEach(modal => {
        const backdrop = modal.querySelector("[data-modal-backdrop-layer]");
        if (backdrop) {
            backdrop.addEventListener("click", () => {
                if (modal.getAttribute("data-modal-backdrop") !== "static") {
                    closeModal(modal);
                }
            });
        }
    });
});

// DRAWER
document.addEventListener("DOMContentLoaded", () => {
    // Toggle button
    document.querySelectorAll('[data-slot="offcanvas:toggle"]').forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.dataset.target;
            const offcanvas = document.getElementById(targetId);
            const panel = offcanvas.querySelector('[data-slot="offcanvas:panel"]');

            offcanvas.classList.remove("hidden");
            requestAnimationFrame(() => {
                panel.classList.remove("-translate-x-full");
            });
        });
    });

    // Close triggers (close button and backdrop)
    document.querySelectorAll('[data-slot="offcanvas:close"], [data-slot="offcanvas:backdrop"]').forEach(closeEl => {
        closeEl.addEventListener("click", () => {
            const offcanvas = closeEl.closest('[data-slot="offcanvas:root"]');
            const panel = offcanvas.querySelector('[data-slot="offcanvas:panel"]');

            panel.classList.add("-translate-x-full");
            setTimeout(() => {
                offcanvas.classList.add("hidden");
            }, 300); // match transition duration
        });
    });
});

// MOBILE DROPDOWN
window.addEventListener('DOMContentLoaded', () => {
    const sidebarItems = document.querySelectorAll('[data-slot="sidebar:item"]');

    // Function to update parent heights when children expand
    function updateParentHeights(element) {
        let parent = element.parentElement;
        while (parent) {
            const parentSidebarItem = parent.closest('[data-slot="sidebar:item"]');
            if (parentSidebarItem) {
                const parentContent = parentSidebarItem.querySelector('[data-slot="sidebar:content"]');
                if (parentContent && parentContent.classList.contains('expanded')) {
                    // Temporarily remove max-height to get natural height
                    const originalMaxHeight = parentContent.style.maxHeight;
                    parentContent.style.maxHeight = 'none';
                    const newHeight = parentContent.scrollHeight;
                    parentContent.style.maxHeight = originalMaxHeight;

                    // Set new height
                    parentContent.style.maxHeight = newHeight + 'px';
                }
                parent = parentSidebarItem.parentElement;
            } else {
                break;
            }
        }
    }

    sidebarItems.forEach(item => {
        const trigger = item.querySelector('[data-slot="sidebar:trigger"]');
        const content = item.querySelector('[data-slot="sidebar:content"]');
        const icon = trigger.querySelector('i');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();

            const isOpen = content.classList.contains('expanded');

            // Close siblings at the same level
            const parent = item.parentElement;
            const siblings = parent.children;

            Array.from(siblings).forEach(sibling => {
                if (sibling !== item && sibling.hasAttribute('data-slot')) {
                    const siblingContent = sibling.querySelector('[data-slot="sidebar:content"]');
                    const siblingIcon = sibling.querySelector('[data-slot="sidebar:trigger"] i');

                    if (siblingContent) {
                        siblingContent.classList.remove('expanded');
                        siblingContent.style.maxHeight = '0px';
                    }
                    if (siblingIcon) {
                        siblingIcon.classList.remove('ri-subtract-line');
                        siblingIcon.classList.add('ri-add-line');
                    }
                }
            });

            // Toggle current item
            if (!isOpen) {
                content.classList.add('expanded');
                content.style.maxHeight = content.scrollHeight + 'px';
                icon?.classList.remove('ri-add-line');
                icon?.classList.add('ri-subtract-line');

                // Update parent heights after a short delay to allow for transitions
                setTimeout(() => {
                    updateParentHeights(item);
                }, 50);
            } else {
                content.classList.remove('expanded');
                content.style.maxHeight = '0px';
                icon?.classList.remove('ri-subtract-line');
                icon?.classList.add('ri-add-line');

                // Update parent heights
                setTimeout(() => {
                    updateParentHeights(item);
                }, 50);
            }
        });
    });
});



// ================ JQUERY ================ //

$(document).ready(function () {

    // PRODUCTS COLOR SWITCH
    $(".product-card").each(function () {
        const $card = $(this);
        const $mainImage = $card.find(".product-image");
        const $thumbs = $card.find(".thumb-image");
        const $swatches = $card.find(".color-swatch");

        const $firstSwatch = $swatches.first();
        updateSwatchStyle($firstSwatch);

        const defaultSrc = $thumbs.first().data("src") || $thumbs.first().attr("src");
        $mainImage.attr("src", defaultSrc);
        $thumbs.removeClass("border border-primary");
        $thumbs.first().addClass("border border-primary");

        $thumbs.on("click", function () {
            const $clicked = $(this);
            const newSrc = $clicked.data("src") || $clicked.attr("src");

            $mainImage.attr("src", newSrc);
            $thumbs.removeClass("border border-primary");
            $clicked.addClass("border border-primary");

            const matchSwatch = $swatches.filter(function () {
                return $(this).data("image") === newSrc;
            });
            if (matchSwatch.length) {
                updateSwatchStyle(matchSwatch);
            }
        });

        const trigger = $card.data("trigger") || "hover";
        const swatchEvent = trigger === "click" ? "click" : "mouseenter";

        $swatches.on(swatchEvent, function () {
            const $swatch = $(this);
            const newSrc = $swatch.data("image");

            if (newSrc) {
                $mainImage.attr("src", newSrc);

                const $matchingThumb = $thumbs.filter(function () {
                    return $(this).data("src") === newSrc || $(this).attr("src") === newSrc;
                });
                $thumbs.removeClass("border border-primary");
                $matchingThumb.addClass("border border-primary");

                updateSwatchStyle($swatch);

                const $targetImage = $card.find(`img[data-image="${newSrc}"]`);
                if ($targetImage.length) {
                    $("html, body").animate({
                        scrollTop: $targetImage.offset().top - 100
                    }, 400);
                }

                const color = $swatch.data("color");
                if (color) {
                    const $targetGrid = $(`.grid[data-color="${color}"]`);
                    if ($targetGrid.length) {
                        $("html, body").animate({
                            scrollTop: $targetGrid.offset().top - 100
                        }, 400);
                    }
                }

            }
        });

        function updateSwatchStyle($selected) {

            $swatches.removeClass(function (_, className) {
                return (className.match(/ring\S*/g) || []).join(" ");
            });

            const color = $selected.data("color") || "primary";
            $selected.addClass(`ring ring-offset-2 ring-${color}`);

            $swatches.each(function () {
                const activeClasses = $(this).data("active-classes");
                if (activeClasses) {
                    $(this).removeClass(activeClasses);
                }
            });

            const selectedActiveClasses = $selected.data("active-classes");
            if (selectedActiveClasses) {
                $selected.addClass(selectedActiveClasses);
            }
        }


    });

    // DROPDOWN
    $(".dropdown-toggle").on("click", function (e) {
        e.stopPropagation();

        var $dropdown = $(this).closest(".dropdown");

        $(".dropdown-menu").not($dropdown.find(".dropdown-menu")).hide();

        $dropdown.find(".dropdown-menu").toggle();
    });

    $(".dropdown-option").on("click", function (e) {
        e.preventDefault();

        var $this = $(this);
        var $dropdown = $this.closest(".dropdown");

        var selectedName = $this.find("span").text().trim();

        if (!selectedName) {
            selectedName = $this.text().trim();
        }

        var $colorDiv = $this.find("div");
        if ($colorDiv.length > 0) {
            var selectedColor = $colorDiv.css("background-color");
            $dropdown.find(".dropdown-toggle .rounded-full").css("background-color", selectedColor);
        }

        $dropdown.find(".dropdown-label").text(selectedName);

        $dropdown.find(".dropdown-menu").hide();
    });


    $(document).on("click", function (e) {
        if (!$(e.target).closest('.dropdown').length) {
            $(".dropdown-menu").hide();
        }
    });


    // OFFER BOX
    $('.offer-box').on('click', function () {
        $('.offer-box input[type="checkbox"]').prop('checked', false);
        $('.offer-box').removeClass('border border-primary');
        $(this).find('input[type="checkbox"]').prop('checked', true);
        $(this).addClass('border border-primary');
    });

    function setupToggle(slotName) {
        const container = $(`[data-slot="${slotName}"]`);
        container.on("click", "button", function () {
            // Remove active class from siblings
            container.find("button").removeClass("bg-primary text-white");
            // Add active class to clicked
            $(this).addClass("bg-primary text-white");

            // Update the displayed value (optional)
            container
                .closest(".flex-col")
                .find(".active-value")
                .text($(this).data("value"));
        });
    }

    // Initialize for each group
    setupToggle("deliver");
    setupToggle("size");


    // CATEGORIES
    if ($(".tf-sw-categories").length > 0) {
        var tfSwCategories = $(".tf-sw-categories");
        var preview = tfSwCategories.data("preview");
        var tablet = tfSwCategories.data("tablet");
        var mobile = tfSwCategories.data("mobile");
        var mobileSm = tfSwCategories.data("mobile-sm") !== undefined ? tfSwCategories.data("mobile-sm") : mobile;
        var spacingLg = tfSwCategories.data("space-lg");
        var spacingMd = tfSwCategories.data("space-md");
        var spacing = tfSwCategories.data("space");
        var perGroup = tfSwCategories.data("pagination") || 1;
        var perGroupMd = tfSwCategories.data("pagination-md") || 1;
        var perGroupLg = tfSwCategories.data("pagination-lg") || 1;
        var loop = tfSwCategories.data("loop") !== undefined ? tfSwCategories.data("loop") : false;
        var centered = tfSwCategories.data("centered") !== undefined ? tfSwCategories.data("centered") : false;
        var swiper = new Swiper(".tf-sw-categories", {
            slidesPerView: mobile,
            spaceBetween: spacing,
            speed: 1000,
            pagination: {
                el: ".sw-pagination-categories",
                clickable: true,
            },
            slidesPerGroup: perGroup,
            observer: true,
            centeredSlides: centered,
            observeParents: true,
            navigation: {
                clickable: true,
                nextEl: ".nav-next-categories",
                prevEl: ".nav-prev-categories",
            },
            loop: loop,
            breakpoints: {
                575: {
                    slidesPerView: mobileSm,
                    spaceBetween: spacing,
                    slidesPerGroup: perGroup,
                },
                768: {
                    slidesPerView: tablet,
                    spaceBetween: spacingMd,
                    slidesPerGroup: perGroupMd,
                },
                1200: {
                    slidesPerView: preview,
                    spaceBetween: spacingLg,
                    slidesPerGroup: perGroupLg,
                },
            },
        });
    }

    // ACCORDION
    $('.accordion-toggle').on('click', function () {
        const $accordion = $(this).closest('.accordion');
        const $content = $(this).next('.accordion-content');
        const $icon = $(this).find('i');

        $accordion.find('.accordion-content').not($content).slideUp();
        $accordion.find('.accordion-toggle i').not($icon).removeClass('rotate-180');

        $content.slideToggle();
        $icon.toggleClass('rotate-180');
    });

    // TAB
    $('.tab-wrapper').each(function () {
        const $wrapper = $(this);

        $wrapper.find('.tab-btn').on('click', function () {
            const tabId = $(this).data('tab');

            // Reset all buttons to inactive style
            $wrapper.find('.tab-btn')
                .removeClass('border-primary text-primary')
                .addClass('border-transparent text-gray-600');

            // Add active styles to the clicked button
            $(this)
                .removeClass('border-transparent text-gray-600')
                .addClass('border-primary text-primary');

            // Toggle tab content visibility
            $wrapper.find('.tab-content').addClass('hidden');
            $wrapper.find(`.tab-content[data-tab="${tabId}"]`).removeClass('hidden');
        });
    });

    // ELECTRONICS PAGE DROPDOWN
    $('#toggleCategories').click(function () {
        $('#categoryList').slideToggle(300);
        $('#dropdownIcon').toggleClass('rotate-180');
    });

    // COMING SOON TIMING
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 20);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        const dayStr = days.toString().padStart(2, "0");
        const hourStr = hours.toString().padStart(2, "0");
        const minStr = minutes.toString().padStart(2, "0");

        $("#days-1").text(dayStr[0]);
        $("#days-2").text(dayStr[1]);

        $("#hours-1").text(hourStr[0]);
        $("#hours-2").text(hourStr[1]);

        $("#minutes-1").text(minStr[0]);
        $("#minutes-2").text(minStr[1]);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000 * 30);

    // CATEGORIES
    if ($(".tf-sw-categories_a").length > 0) {
        var tfSwCategories = $(".tf-sw-categories_a");
        var preview = tfSwCategories.data("preview");
        var tablet = tfSwCategories.data("tablet");
        var mobile = tfSwCategories.data("mobile");
        var mobileSm = tfSwCategories.data("mobile-sm") !== undefined ? tfSwCategories.data("mobile-sm") : mobile;
        var spacingLg = tfSwCategories.data("space-lg");
        var spacingMd = tfSwCategories.data("space-md");
        var spacing = tfSwCategories.data("space");
        var perGroup = tfSwCategories.data("pagination") || 1;
        var perGroupMd = tfSwCategories.data("pagination-md") || 1;
        var perGroupLg = tfSwCategories.data("pagination-lg") || 1;
        var loop = tfSwCategories.data("loop") !== undefined ? tfSwCategories.data("loop") : false;
        var centered = tfSwCategories.data("centered") !== undefined ? tfSwCategories.data("centered") : false;
        var play = tfSwCategories.data("auto-play");
        var swiper = new Swiper(".tf-sw-categories_a", {
            slidesPerView: mobile,
            spaceBetween: spacing,
            speed: 1000,
            autoplay: play,
            pagination: {
                el: ".sw-pagination-categories_a",
                clickable: true,
            },
            slidesPerGroup: perGroup,
            observer: true,
            centeredSlides: centered,
            observeParents: true,
            navigation: {
                clickable: true,
                nextEl: ".nav-next-categories",
                prevEl: ".nav-prev-categories",
            },
            loop: loop,
            breakpoints: {
                575: {
                    slidesPerView: mobileSm,
                    spaceBetween: spacing,
                    slidesPerGroup: perGroup,
                },
                768: {
                    slidesPerView: tablet,
                    spaceBetween: spacingMd,
                    slidesPerGroup: perGroupMd,
                },
                1200: {
                    slidesPerView: preview,
                    spaceBetween: spacingLg,
                    slidesPerGroup: perGroupLg,
                },
            },
        });
    }

    // TESTIMONAIL
    if ($(".tf-sw-testimonial").length > 0) {
        var preview = $(".tf-sw-testimonial").data("preview");
        var tablet = $(".tf-sw-testimonial").data("tablet");
        var mobile = $(".tf-sw-testimonial").data("mobile");
        var spacingLg = $(".tf-sw-testimonial").data("space-lg");
        var spacingMd = $(".tf-sw-testimonial").data("space-md");
        var spacing = $(".tf-sw-testimonial").data("space");
        var perGroup = $(".tf-sw-testimonial").data("pagination");
        var perGroupMd = $(".tf-sw-testimonial").data("pagination-md");
        var perGroupLg = $(".tf-sw-testimonial").data("pagination-lg");
        var swiper = new Swiper(".tf-sw-testimonial", {
            slidesPerView: mobile,
            spaceBetween: spacing,
            speed: 800,
            autoplay: true,
            pagination: {
                el: ".sw-pagination-testimonial",
                clickable: true,
            },
            observeParents: true,
            navigation: {
                clickable: true,
                nextEl: ".nav-next-testimonial",
                prevEl: ".nav-prev-testimonial",
            },
            breakpoints: {
                768: {
                    slidesPerView: tablet,
                    spaceBetween: spacingMd,
                    slidesPerGroup: perGroupMd,
                },
                1200: {
                    slidesPerView: preview,
                    spaceBetween: spacingLg,
                    slidesPerGroup: perGroupLg,
                },
            },
        });
    }

    if ($(".tf-sw-slideshow").length > 0) {
        var tfSwSlideshow = $(".tf-sw-slideshow");
        var preview = tfSwSlideshow.data("preview");
        var tablet = tfSwSlideshow.data("tablet");
        var mobile = tfSwSlideshow.data("mobile");
        var spacing = tfSwSlideshow.data("space");
        var spacingMb = tfSwSlideshow.data("space-mb");
        var loop = tfSwSlideshow.data("loop");
        var play = tfSwSlideshow.data("auto-play");
        var centered = tfSwSlideshow.data("centered");
        var effect = tfSwSlideshow.data("effect");
        var speed = tfSwSlideshow.data("speed") !== undefined ? tfSwSlideshow.data("speed") : 1000;
        var swiperSlider = {
            autoplay: play,
            slidesPerView: mobile,
            loop: loop,
            spaceBetween: spacingMb,
            speed: speed,
            observer: true,
            observeParents: true,
            pagination: {
                el: ".sw-pagination-slider",
                clickable: true,
            },
            navigation: {
                clickable: true,
                nextEl: ".navigation-next-slider",
                prevEl: ".navigation-prev-slider",
            },
            centeredSlides: false,
            breakpoints: {
                768: {
                    slidesPerView: tablet,
                    spaceBetween: spacing,
                    centeredSlides: false,

                },
                1200: {
                    slidesPerView: preview,
                    spaceBetween: spacing,
                    centeredSlides: centered,
                },
            },
        };
        if (effect === 'fade') {
            swiperSlider.effect = 'fade';
            swiperSlider.fadeEffect = {
                crossFade: true,
            };
        }

        var swiper = new Swiper(".tf-sw-slideshow", swiperSlider);
    }

    // HOMEPAGE FLASH SALES
    const targetDate_1 = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);

    function flashUpdateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate_1 - now;

        if (distance < 0) {
            $('#days, #hours, #minutes, #seconds').text('00');
            clearInterval(timer);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        $('#days').text(String(days).padStart(2, '0'));
        $('#hours').text(String(hours).padStart(2, '0'));
        $('#minutes').text(String(minutes).padStart(2, '0'));
        $('#seconds').text(String(seconds).padStart(2, '0'));
    }

    flashUpdateCountdown();

    const timer = setInterval(flashUpdateCountdown, 1000);

});


// HERO BANNER SLIDER
const swiper = new Swiper(".banner_swipper", {
    speed: 2000,
    autoplay: true,
    pagination: {
        el: ".banner_pagination",
        clickable: true,
    },
    navigation: {
        clickable: true,
        nextEl: ".nav-next-categories",
        prevEl: ".nav-prev-categories",
    },
})