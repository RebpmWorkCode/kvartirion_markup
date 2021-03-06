$(() => {
    //region sorting
    $('.sorting-list').on('change', (e) => {
        let url = new URL(location.href), value = e.target.value, values = value.split('_');
        let [sortValue, directionValue] = values.length === 3 ? [`${values[0]}_${values[1]}`, values[2]] : values;
        sortValue ? url.searchParams.set('sort', sortValue) : url.searchParams.delete('sort');
        directionValue ? url.searchParams.set('direction', directionValue) : url.searchParams.delete('direction');
        window.location.href = url.toString();
    })
    //endregion
    $('.phone-mask').mask('8 (000) 000-00-00');
    $('.price-mask').mask("000 000 000 000 000", {reverse: true});

    $(".list-flats__text").off('click').on('click', e => {
        e.preventDefault();
        let li = e.currentTarget.closest('li'), subMenu = li.querySelector('.list-flats__submenu');
        $('.list-flats > li').removeClass('active').find('.list-flats__submenu').hide();
        if (li.classList.contains('active')) {
            li.classList.remove('active');
            if(subMenu) $(subMenu).hide();
        } else {
            li.classList.add('active');
            if(subMenu) $(subMenu).show();
        }
        if(!subMenu){
            $(e.currentTarget).closest(".filter__main-section").find(".filter__main-select-title").text($(e.currentTarget).text())
            $('#AdvertisementCategoryId').val(e.currentTarget.dataset.categoryId).trigger('change');
        }
    })

    $('.favorites-action').off('click');
    $('body').on('click', '.favorites-action', function (event) {
        event.preventDefault();
        Is2bFavorite.a = $(this);
        Is2bFavorite.run({
            callback: function () {
                $(`.favorites-action[data-id=${Is2bFavorite.a.get(0).dataset.id}]`).each((index, element) => {
                    let fEl = $(element);
                    if (Is2bFavorite.action === 'remove') {
                        fEl.data('action', 'add');
                        fEl.removeClass('active');
                        if(fEl.hasClass('in-favorites-action')){
                            fEl.closest('.catalog__item').remove();
                        }
                    } else {
                        fEl.data('action', 'remove');
                        fEl.addClass('active');
                    }
                });
            }
        })
    })

    $('[href="#contact_with_agent"]').on('click', e => {
        let $contactWithAgent = $('#contact_with_agent');
        $contactWithAgent.find('#AdvertisementMessageAdvertisementId').val(e.target.dataset.id)
        $contactWithAgent.find('.cleared-value').val('');
        $('.phone-mask', $contactWithAgent).mask('8 (000) 000-00-00');
    })
    $('[href="#order_call"]').on('click', e => {
        $('#order_call').find('.cleared-value').val('');
    })
    $('[href="#order_callback"]').on('click', e => {
        $('#order_callback').find('.cleared-value').val('');
    })
    $('[href="#order_review"]').on('click', e => {
        $('#order_review').find('.cleared-value').val('');
    })
    $('[href="#create_object"]').on('click', e => {
        $.ajax({
            type: 'GET',
            url: '/agency/realty/add?ajax_twig=1',
            success: function (result) {
                $('#create_object').html(result);
                let $AdvertisementCategoryId = $('#AdvertisementCategoryId', $('#AdvertisementAddForm'));
                $AdvertisementCategoryId.on('change', e => {loadParams($(e.target).val())})
                loadParams($AdvertisementCategoryId.val());
                $('select[name="data[Advertisement][category_id]"]').select2({width: "100%"})
                Location.init('.location-select2');

                $('.JS-add-photo').on('click', function (event) {
                    event.preventDefault();
                    $('.fileinput-button input').click();
                });
                onloadRecaptchaCallback()
            }
        })
    })
    $('[href="#popup-favorites"]').on('click', e => {
        $.ajax({
            type: 'GET',
            url: '/favorites?ajax_twig=1',
            success: function (result) {
                let wrapper = $('#popup-favorites');
                $(".popup-carousel").slick('destroy');
                $('#popup-favorites').find('.popup-carousel').html(result);
                $(".cards__item-gallery", wrapper).slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: !1,
                    dots: !0,
                    fade: !1,
                    adaptiveHeight: !0,
                    infinite: !0,
                    touchThreshold: 30,
                    mobileFirst: !0,
                    rows: 0,
                    responsive: [{
                        breakpoint: 767,
                        settings: {
                            slidesToShow: 1
                        }
                    }]
                })
                $(".popup-carousel").slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: !0,
                    dots: !1,
                    fade: !1,
                    adaptiveHeight: !1,
                    infinite: !0,
                    touchThreshold: 30,
                    mobileFirst: !0,
                    rows: 0,
                    prevArrow: "<a class='slick-arrow slick-prev'><span class='icon-arrow-left'></span></a>",
                    nextArrow: "<a class='slick-arrow slick-next'><span class='icon-arrow-right'></span></a>",
                    swipe: !1,
                    draggable: !1
                });
            },
            error: function (error) {
                console.log(error);
            }
        })
    })

    $('select[name="data[Advertisement][category_id]"]').select2('destroy')
    $('select[name="data[Advertisement][category_id]"]').select2({width: "100%"})

    $('.location-select2').select2('destroy');
    Location.init('.location-select2');

    let form = '';
    $('[data-ajax-send-form]').ajaxForm({
        type: "POST",
        beforeSubmit: function (r, t, $xhr) {
            form = $(t);
            form.find('#flashMessage').remove();
        },
        success: function (result) {
            let flashContactMessage = $(result).find('#contact_with_agentMessage');
            if (flashContactMessage.length > 0) {
                let classMessage = 'success';
                if(flashContactMessage.find('a').text().trim() === '?????????????????????? ??????????'){
                    classMessage = 'error';
                }
                form.prepend(`<div id="flashMessage" class="message ${classMessage}">${flashContactMessage.get(0).childNodes[0].textContent.trim()}</div>`)
            }
            let flashMessage = $(result).find('#flashMessage');
            form.prepend(flashMessage);
            if (!$('#flashMessage', form).hasClass('error')) {
                setTimeout(() => {
                    form.find('#flashMessage').remove();
                    form.find('.cleared-value').val('');
                    $.fancybox.close();
                }, 5000)
            }
        }
    })

    let categoriesParams =  $('.params-filter');
    if(categoriesParams.length > 0){
        categoriesParams.addClass('hidden');
        let categoryId = $('#AdvertisementCategoryId', $('.search-block'));
        if(categoryId.val()) {
            $(`.params-filter.category-${categoryId.val()}`).removeClass('hidden');
        }
        categoryId.on('change', function (e) {
            categoriesParams.addClass('hidden');
            categoriesParams.find('.input-filter').val('')
            categoriesParams.find('.sorting__list [type="checkbox"]').attr('checked', false)
            $(`.params-filter.category-${categoryId.val()}`).removeClass('hidden');
        });
    }

    let loadParams = function (categoryId) {
        $.ajax({
            url : `/agency/realty/category_params/${categoryId}?ajax_twig=1`,
            statusCode: {
                404: function () {
                    alert("page /agency/realty/category_params/ not found");
                },
                403: function () {
                    alert("???????????????? ???????????? ?? ???????????????? /agency/realty/category_params/");
                }
            },
            success : function(data){
                $('#categoryParams').replaceWith(data);
                $('#categoryParams').find('select').select2({language: 'ru', width: '100%'});
            }
        });
    }
    let $AdvertisementCategoryId = $('#AdvertisementCategoryId', $('#AdvertisementAddForm'));
    $AdvertisementCategoryId.on('change', e => {loadParams($(e.target).val())})
    let categoryParams = $('[data-ajax-load]#categoryParams');
    if(categoryParams.length > 0){
        loadParams($AdvertisementCategoryId.val());
    }

    $('.JS-add-photo').on('click', function (event) {
        event.preventDefault();
        $('.fileinput-button input').click();
    });

    //hidden hotOffers
    $(`.realty-object`).addClass('element-hidden');
    $(`.realty-object[data-category='kvartiry']`).removeClass('element-hidden');

    $('.cards__tabs').on('click', '.js-link-tab', e => {
        e.preventDefault();
        $('.cards__tabs > li').removeClass('current');
        // console.log($(this).closest('li'));
        let category = e.target.dataset.category;
        $(`.realty-object`).addClass('element-hidden');
        $(`.realty-object[data-category=${category}]`).removeClass('element-hidden');
        $(e.target).closest('li').addClass("current");
    });
})
