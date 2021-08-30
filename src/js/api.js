const baseUrl = process.env.NODE_ENV ? `https://api.5stars.net` : ``

function get(url, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${baseUrl}${url}`,
            type: `GET`,
            dataType: `json`,
            data,
            beforeSend(xhr) { if (authToken) { xhr.setRequestHeader(`X-API-KEY`, authToken) } },
            success(res) { resolve(res.data) },
            error(err) { reject(err) },
        })
    })
}
function post(url, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${baseUrl}${url}`,
            type: `POST`,
            dataType: `json`,
            data,
            beforeSend(xhr) { if (authToken) { xhr.setRequestHeader(`X-API-KEY`, authToken) } },
            success(res) { resolve(res) },
            error(err) { reject(err) },
        })
    })
}

let selectedMedia = null
let authToken = null

$(document).ready(async function () {
    get(`/dictionaries/social-media`).then((res) =>
        res.map((media) => ({
            ...media,
            image: MEDIA_IMAGES[media.code].path || MEDIA_IMAGES.othersite.path
        }))
    ).then((res) => initMedia(res))
    get(`/dictionaries/services`).then((res) => initServices(res))
    get(`/dictionaries/payment-methods`).then((res) => initPaymentMethods(res))

    $(`.logout-button`).on(`click`, () => { setAuth(null); window.location.href = `/` })
    $(`.main-filter__btn`).on(`click`, postOrder)
    $(`#modal-registration__form`).on(`submit`, signUp)
    $(`#modal-restore__form`).on(`submit`, restorePassword)
    $(`#modal-login__form`).on(`submit`, login)
    $(`.submit-order`).on(`click`, submitOrder)
    $(`.submit-order-guest`).on(`click`, submitGuestOrder)

    setAuth(window.localStorage.getItem(`token`))

    if (window.location.href.includes(`/order.html`) && authToken) {
        window.location.href = `/order-detail.html`
    }
    if (window.location.href.includes(`/order-detail`) && !authToken) {
        window.location.href = `/order.html`
    }

    const order = window.localStorage.getItem(`order`)
    if (order) { setupOrderInfo(JSON.parse(order)) }
})

function initServices(services) {
    const SERVICE_ICONS_MAP = {
        'Подписчики': { class: `icon-subscribers`, path: `images/sprite.svg#icon-subscribers` },
        'Лайки': { class: `icon-likes`, path: `images/sprite.svg#icon-likes` },
        'Комментарии': { class: `icon-comments`, path: `images/sprite.svg#icon-comments` },
        'Просмотры': { class: `icon-views`, path: `images/sprite.svg#icon-views` },
        'Сохранения': { class: `icon-star`, path: `images/sprite.svg#icon-star` }
    }

    const calculatorBody = $(`.main-filter__body`)[0]

    services.forEach((service) => {
        const icon = SERVICE_ICONS_MAP[service.title] || { class: `icon-star`, path: `images/sprite.svg#icon-star` }

        const item = $(`<div class="main-filter__accs-item" data-id="${service.id}"></div>`)
        const label = $(`<label class="form__check check">
                <input class="check__input visually-hidden" type="checkbox" ${service.active ? `` : `disabled`}><span class="check__box"></span>
                <svg class="${icon.class}">
                    <use xlink:href="${icon.path}"></use>
                </svg>
                <span class="check__text">${service.title}</span>
            </label>`)

        const price = $(`<span class="main-filter__price" data-price="${service.default_price}">${service.active ? service.default_price + `₽/шт` : `Скоро`}</span>`)
        const range = $(`<div class="main-filter__range" data-max="${service.max}">
                        <div class="payment-range-slider">
                            <input class="payment-range-horizontal" type="range" min="${service.min}" max="${service.max}" step="${service.step}" value="0" data-orientation="horizontal" ${service.active ? `` : `disabled`}>
                        </div>
                    </div>`)
        const totalPrice = $(`<span class="main-filter__total-price" data-price="0">0</span>`)

        item.append(label).append(price).append(range).append(totalPrice)
        item.appendTo(calculatorBody)
    })

    setupSliders()
}

const MEDIA_IMAGES = {
    'facebook': { path: `images/sprite/fb.svg` },
    'maps.google': { path: `images/sprite/gmaps.svg` },
    'instagram': { path: `images/sprite/insta.svg` },
    'yelp': { path: `images/sprite/yelp.svg` },
    'twitter': { path: `images/sprite/twitter.svg` },
    'youtube': { path: `images/sprite/youtube.svg` },
    'pinterest': { path: `images/sprite/pinterest.svg` },
    'tiktok': { path: `images/sprite/tiktok.svg` },
    'manta': { path: `images/sprite/manta.svg` },
    'yext': { path: `images/sprite/yext.svg` },
    'trustpilot': { path: `images/sprite/trustpilot.svg` },
    'sitejabber': { path: `images/sprite/sitejabber.svg` },
    'othersite': { path: `images/sprite/othersite.svg` },
}
function initMedia(medias) {
    if (!selectedMedia) {
        setSelectedMedia(medias.find((m) => m.code === `instagram`) || medias[0])
    }

    const modal = $(`#select-modal .modal-select`)[0]

    medias.forEach((media) => {
        const btn = $(`<a href="#" class="modal-select__item" data-media="${media.id}">
            <div class="modal-select__img">
                <img src="${media.image}" alt="icon" />
            </div>
            <div class="modal-select__text">${media.title}</div>
        </a>`).on(`click`, (e) => {
            e.preventDefault()
            setSelectedMedia(media)
            $.fancybox.close()
        })

        btn.appendTo(modal)
    })
}

function initPaymentMethods(methods) {
    const PAYMENT_IMAGES = {
        'Payoneer': { path: `images/sprite/payoneer.svg` },
        'Transferwise': { path: `images/sprite/transferwise.svg` },
        'Wire Transfer': { path: `images/sprite/wire.svg` },
        'Кредитная карта': { path: `images/sprite/visa.svg` },
        'Bitcoin': { path: `images/sprite/bitcoin.svg` },
        'Payyer': { path: `images/sprite/payeer.svg` },
        'Qiwi': { path: `images/sprite/qiwi.svg` },
        'Webmoney': { path: `images/sprite/webmoney.svg` },
    }

    const wrapper = $(`.payment__accs`)[0]
    if (wrapper) {
        methods.forEach((method) => {
            const image = PAYMENT_IMAGES[method.title] || { path: `` }
            const item = $(`
                <div class="payment__accs-item">
                    <input id="${method.title}" type="radio" name="payment" value="${method.id}">
                    <label for="${method.title}">
                        <img src="${image.path}" alt="${method.title}">
                        <div class="payment__accs-text-container">
                            <span class="payment__accs-heading">${method.title}</span>
                            <span class="payment__accs-text">${method.commission || `Без комиссии`}</span>
                        </div>
                    </label>
                </div>`)

            $(wrapper).append(item)
        })
    }
}

function setSelectedMedia(media) {
    selectedMedia = media

    const image = $(`.main-filter__select-img img`)[0]
    if (image) {
        image.setAttribute(`src`, media.image)
        image.setAttribute(`alt`, media.code)

        $(`.main-filter__select-text`).text(media.title)
    }
}

function postOrder() {
    const url = $(`.main-filter__input[name="url"]`).val()
    if (!url) { return }

    const services = []
    $(`.main-filter__accs-item.active`).each((_, service) => {
        const type = $(service).data(`id`)
        const title = $(`.check__text`, service).text()
        const amount = Number($(`.range-input-text`, service).val())
        const price = Number($(`.main-filter__price`, service).data(`price`))
        const totalPrice = Number($(`.main-filter__total-price`, service).text())

        if (amount) {
            services.push({ type, title, amount, price, totalPrice })
        }
    })

    if (services.length === 0) { return }

    const order = {
        url,
        media: selectedMedia,
        totalPrice: services.reduce((acc, item) => acc + item.totalPrice, 0),
        items: services
    }


    window.localStorage.setItem(`order`, JSON.stringify(order))
    if (authToken) {
        window.location.href = `/order-detail.html`
    } else {
        window.location.href = `/order.html`
    }
}

function setupOrderInfo(order) {
    const totalWrapper = $(`.total`)[0]
    if (totalWrapper) {
        const image = $(`.total__link-img img`, totalWrapper)[0]

        image.setAttribute(`src`, order.media.image)
        image.setAttribute(`alt`, order.media.code)

        $(`.total__link-text`, totalWrapper).text(order.url)
        $(`.total__link-text`, totalWrapper)[0].setAttribute(`href`, `http://${order.url}`)

        const list = $(`.total__table`, totalWrapper)[0]

        order.items.forEach((item) => {
            const element = $(`
                <div class="total__table-item">
                    <div class="total__table-text">${item.title}</div>
                    <div class="total__table-text">${item.amount}</div>
                    <div class="total__table-text after-val">${item.totalPrice}</div>
                </div>`)

            $(list).append(element)
        })

        $($(`.total__price-number`, totalWrapper)[0]).text(order.totalPrice)
    }

    const filterWrapper = $(`.main-filter`)[0]
    if (filterWrapper) {
        const interval = setInterval(() => {
            const services = $(`.main-filter__accs-item`)
            if (services.length) {
                setSelectedMedia(order.media)
                $(`.main-filter__input[name="url"]`).val(order.url)

                order.items.forEach((item) => {
                    const service = $(`.main-filter__accs-item[data-id="${item.type}"]`)
                    if (service) {
                        $(`.form__check`, service)[0].click()
                        $(`.payment-range-horizontal`, service).val(item.amount).change()
                        $(`.range-input-text`, service).val(item.amount)
                    }
                })

                clearInterval(interval)
            }
        }, 100)
    }
}

function submitOrder() {
    const order = JSON.parse(window.localStorage.getItem(`order`))

    const paymentId = $(`.payment__accs-item input[type=radio]:checked`).val()

    if (!paymentId) { return }

    const body = {
        url: order.url,
        payment_method_id: Number(paymentId),
        items: order.items.map(({ type, amount }) => ({
            social_media_id: order.media.id,
            service_id: type,
            count: amount
        }))
    }

    post(`/order/fill`, body).then((res) => {
        console.log(`success`, res)
    }).catch((err) => {
        console.log(`error`, err)
    })
}

function submitGuestOrder() {
    const email = $(`.txt-input__field[name="email"]`).val()
    const password = $(`.txt-input__field[name="password"]`).val()
    const passwordConfirm = $(`.txt-input__field[name="passwordConfirm"]`).val()
    const telegram = $(`.txt-input__field[name="telegram"]`).val()
    const skype = $(`.txt-input__field[name="skype"]`).val()
    const messageField = $(`#order-form-message`)

    const paymentId = $(`.payment__accs-item input[type=radio]:checked`).val()

    post(`/user/check`, { email }).then(() => {
        $.fancybox.open({ src: `#login-modal`, type: `inline` })
    }).catch(() => {
        if (password === passwordConfirm && (telegram || skype) && paymentId) {
            const body = { email, password }
            if (telegram) {
                body.telegram = telegram
            } else {
                body.skype = skype
            }

            return post(`/auth/register`, body)
                .then(() => post(`/auth/login`, { email, password }))
                .then(({ data }) => {
                    setAuth(data.hash, true)
                })
                .then(() => submitOrder())
                .catch(({ responseJSON: err }) => {
                    const error = Object.values(err.attributes)[0]
                    messageField.text(error)
                })
        } else {
            if (password !== passwordConfirm) {
                messageField.text(`Пароли не совпадают`)
            } else if (!telegram && !skype) {
                messageField.text(`Укажите Telegram или Skype для связи`)
            } else if (!paymentId) {
                messageField.text(`Выберите способ оплаты`)
            }
        }
        return null
    })
}

function signUp(e) {
    e.preventDefault()
    e.stopPropagation()

    const email = $(`#register-email`).val()
    const password = $(`#register-password`).val()
    const social = $(`#register-social`).val()
    const type = $(`.modal-auth__check-input[name="contact"]:checked`).val()
    const isAgree = $(`.check__input[name="agreement"]:checked`).length
    const messageField = $(`#register-message`)

    if (!isAgree) {
        messageField.text(`Примите условия пользовательского соглашения и политику конфиденциальности`)
        return
    }

    post(`/auth/register`, { email, password, [type]: social }).then(() => {
        messageField.text(`На указанный email отправлено письмо для подтверждения`)
    }).catch(({ responseJSON: err }) => {
        const error = Object.values(err.attributes)[0]
        messageField.text(error)
    })
}

function login(e) {
    e.preventDefault()
    e.stopPropagation()

    const email = $(`#login-email`).val()
    const password = $(`#login-password`).val()
    const isRemember = $(`.check__input[name="remember"]:checked`).length
    const messageField = $(`#login-message`)


    post(`/auth/login`, { email, password }).then(({ data }) => {
        const hash = data.hash
        setAuth(hash, isRemember)
        $.fancybox.close()

        if (window.location.href.includes(`/order.html`)) {
            window.location.href = `/order-detail.html`
        }
    }).catch(() => {
        const error = `Пользователь не найден`
        messageField.text(error)
    })
}

function restorePassword(e) {
    e.preventDefault()
    e.stopPropagation()

    const email = $(`#modal-restore-email`).val()
    const messageField = $(`#restore-message`)

    post(`/user/reset-password`, { email }).then(() => {
        messageField.text(`Письмо отправлено на указанный email`)
    })
}

function setAuth(token, isSync) {
    if (isSync) {
        window.localStorage.setItem(`token`, token)
    }

    authToken = token

    if (token) {
        $(`.auth-button`).addClass(`visually-hidden`)
        $(`.logout-button`).removeClass(`visually-hidden`)
    } else {
        $(`.logout-button`).addClass(`visually-hidden`)
        $(`.auth-button`).removeClass(`visually-hidden`)

        window.localStorage.removeItem(`token`)
    }
}


function setupSliders() {
    $(`.payment-range-horizontal`).each(function () {
        const current = $(this).parents(`.main-filter__accs-item`)
        const price = Number(current.find(`.main-filter__price`).data(`price`))
        const maxValue = current.find(`.main-filter__range`).data(`max`)
        const totalPrice = current.find(`.main-filter__total-price`)
        $(this).rangeslider({
            polyfill: false,
            onInit() {
                $(`<span class="range-max-val" />`).insertAfter(current.find(`.payment-range-slider`)).html(abbrNum(maxValue, 2))
                current.find(`.rangeslider__handle`).append(`<input type="text" maxlength="5" minlength="1" class="range-input-text" placeholder="0" />`)
            },
            onSlide(position, value) {
                const calculate = (value * price).toFixed(0)
                totalPrice.attr(`data-price`, calculate).data(`price`, calculate).html(calculate)
                current.find(`.range-input-text`).val(value)
                $(`.js-main-filter__total`).html(calcTotal())
            }
        })
    })
}

function calcTotal() {
    let total = 0
    $(`.main-filter__total-price`).each(function () {
        const element = Number($(this).data(`price`))
        total += element
    })
    return total
}

function abbrNum(number, decPlaces) {
    decPlaces = Math.pow(10, decPlaces)
    const abbrev = [`k`, `m`, `b`, `t`]
    for (let i = abbrev.length - 1; i >= 0; i--) {
        const size = Math.pow(10, (i + 1) * 3)
        if (size <= number) {
            number = Math.round(number * decPlaces / size) / decPlaces
            if ((number === 1000) && (i < abbrev.length - 1)) {
                number = 1
                i++
            }
            number += abbrev[i]
            break
        }
    }
    return number
}

