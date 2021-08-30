import './api'

/* eslint-disable quotes,no-trailing-spaces,no-invalid-this */
window.onload = function () {
    const preload = $('#preload')
    preload.find()
    preload.fadeOut()
}
$(window).scroll(function () {
    if ($(this).scrollTop() > 20) {
        $('.header-block').addClass('fixed')
    } else {
        $('.header-block').removeClass('fixed')
    }
})
$(document).ready(function () {
    function smallStars() {
        let string = ''
        const array = [272, 30, 260.244, 36.18, 262.489, 23.09, 252.979, 13.82, 266.122, 11.91, 272, 0, 277.878, 11.91, 291.021, 13.82, 281.511, 23.09, 283.756, 36.18]
        for (let index = 0; index < array.length; index++) {
            string += (' ' + (array[index] / 2).toFixed(0))
        }
        if ($(window).width() < 960) {
            $('.star.rating').each(function () {
                $(this).attr({
                    "height": 20,
                    "width": 20,
                })
                $(this).find('polygon').attr({
                    'points': string,
                    "transform": 'translate(-126)',
                })
            })
        } else {
            $('.star.rating').each(function () {
                $(this).attr({
                    "height": 40,
                    "width": 40,
                })
                $(this).find('polygon').attr({
                    'points': array,
                    "transform": 'translate(-252)',
                })
            })
        }
    }
    smallStars() 
    $(window).resize(smallStars)

    // carousel init
    function postsCarousel() {
        const checkWidth = $(window).width()
        const owlPost = $(".main-offer__benefits")
        if (checkWidth > 960) {
            $('.header-links__auth').removeClass('animate__animated animate__slideOutRight')
            if (typeof owlPost.data('owl.carousel') !== 'undefined') {
                owlPost.data('owl.carousel').destroy()
            }
            owlPost.removeClass('owl-carousel')
        } else if (checkWidth < 959) {
            owlPost.addClass('owl-carousel')
            owlPost.owlCarousel({
                margin: 20,
                slideSpeed: 500,
                lazyLoad: true,
                touchDrag: true,
                mouseDrag: true,
                stagePadding: 15,
                dots: false,
                loop: false,
                responsive: {
                    320: {
                        items: 1,
                        stagePadding: 50,
                        margin: 10
                    },
                    500: {
                        items: 1,
                        stagePadding: 50,
                        margin: 10
                    }
                }
            })
        }
    }

    postsCarousel()
    $(window).resize(postsCarousel)

    function starsRating() {
        const starEls = document.querySelectorAll('.star.rating')
        starEls.forEach((star) => {
            star.addEventListener('click', function (e) {
                const starEl = e.currentTarget
                starEl.parentNode.setAttribute('data-stars', starEl.dataset.rating)
            })
        })
    }

    starsRating()

   
    //
    $(document).on("change input keyup paste", ".range-input-text", function () {
        if ($(this).parents('.payment-range-slider').find('.payment-range-horizontal').attr('disabled') === undefined) {
            const cur = $(this)
            const value = $(this).val()
            cur.parents('.payment-range-slider').find('.payment-range-horizontal').val(value).change()
        } else {
            return false
        }

    })
    $(document).on("click", ".range-input-text", function () {
        if ($(this).parents('.payment-range-slider').find('.payment-range-horizontal').attr('disabled') === undefined) {
            $(this).focus()
        } else {
            return false
        }
    })
    $(document).on("click", ".main-filter__accs-item .form__check", function () {
        if ($(this).find('.check__input').is(":checked")) {
            $(this).parents('.main-filter__accs-item').addClass('active')
        } else {
            $(this).parents('.main-filter__accs-item').removeClass('active')
        }
    })

    $(document).on("click", ".js-show-faq", function () {
        $(this).toggleClass('active')
        $(this).parents('.contacts__container').find('.accardeon').slideToggle(300)
        return false
    })

    $(document).on("click", ".accardeon--default .accardeon__item", function () {
        $(this).toggleClass('active')
        $(this).find('.accardeon__text, .accardeon__block').slideToggle(300).css('display', 'flex')
        return false
    })

    $(document).on("click", ".accardeon--detail .accardeon__item", function () {
        $(this).toggleClass('active')
        $(this).find('.accardeon__text, .accardeon__block').slideToggle(300)
        $(this).siblings('.accardeon__item.active').find('.accardeon__text, .accardeon__block').slideUp(300)
        $(this).siblings('.accardeon__item.active').removeClass('active')
        return false
    })

    $(document).on("click", ".js-contact-switch", function () {
        const placeholder = $(this).find('input[type="radio"]').data('placeholder')
        $('.js-contact__field').attr('placeholder', placeholder)
    })

    $(document).on("click", ".js-copy-btn", function () {
        const copyText = $(this).siblings('.js-copy-content').html()
        const hintWindow = $(this).parents('.copy-btn__container').find('.hint-window')
        if (hintWindow.length) {
            hintWindow.addClass('active')
            setTimeout(function () {
                hintWindow.removeClass('active')
            }, 3000)
        }
        window.navigator.clipboard.writeText(copyText)
        return false
    })

    // eslint-disable-next-line no-undef
    new WOW().init()

    // anchor
    $(".sliding-link").click(function () {
        const aid = $(this).attr("href")
        $('html,body').animate({ scrollTop: $(aid).offset().top - 80 }, 'slow')
        return false
    })
    // lazyload
    $(function () {
        $('.lazy').lazy({
            effect: "fadeIn",
            effectTime: 500,
            threshold: 0
        })
    })
    // eslint-disable-next-line no-undef
    svg4everybody({
        polyfill: true,
        // eslint-disable-next-line no-unused-vars
        validate(src, svg, use) {
            return true
        }
    })
    // menu header sm devices
    $('.header-sm').click(function () {
        const menu = $('.header-links__auth')
        $('.header-container').toggleClass('active')
        $('.menu').toggleClass('opened')

        if (menu.hasClass('animate__animated animate__slideInRight')) {
            menu.removeClass('animate__animated animate__slideInRight')
            menu.addClass('animate__animated animate__slideOutRight')
        } else {
            menu.removeClass('animate__animated animate__slideOutRight')
            menu.addClass('animate__animated animate__slideInRight')
        }
    })
    // escape fancy close
    $(document).keyup(function (e) {
        if (e.key === "Escape") {
            $.fancybox.close()
        }
    })
    $('[data-fancybox]').fancybox({
        closeExisting: true
    })
    $('.form_close').click(function () {
        $.fancybox.close()
        return false
    })

})
$(document).mouseup(function (e) {
    if ($(window).width() < 960) {
        const div = $(".header-sm")
        if (!div.is(e.target) &&
            div.has(e.target).length === 0) {
            const headerContainer = $('.header-container')
            const headerLinks = $('.header-links__auth')

            if (headerContainer.hasClass('active')) {
                headerLinks.removeClass('animate__animated animate__slideInRight')
                headerLinks.addClass('animate__animated animate__slideOutRight')
            }
            headerContainer.removeClass('active')
            $('.menu').removeClass('opened')
        }
    }
})
