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
    Is2bFavorite.init('.favorites-action', {
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
    });

    $('[href="#contact_with_agent"]').on('click', e => {
        let $contactWithAgent = $('#contact_with_agent');
        $contactWithAgent.find('#AdvertisementMessageAdvertisementId').val(e.target.dataset.id)
        $contactWithAgent.find('.cleared-value').val('');
        $('.phone-mask', $contactWithAgent).mask('8 (000) 000-00-00');
    })
    $('[href="#order_call"]').on('click', e => {
        $('#order_call').find('.cleared-value').val('');
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
                Is2bFavorite.init('.favorites-action', {
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
                });
            },
            error: function (error) {
                console.log(error);
            }
        })
    })

    $('.location-select2').select2('destroy');
    Location.init('.location-select2');

    /*$('[href="#create_object"]').on('click', e => {

    })*/

    $('#AdvertisementMessageContactWithAgentAdvertisementForm,#FeedbackMessageSendForm').on('submit', event => {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: event.target.getAttribute('action'),
            data: $(event.target).serialize(),
            // dataType: 'json',
            success: function (result) {
                console.log(result);
            },
            error: function (error) {
                console.log(error);
            }
        })
    });

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


    $('#AdvertisementCategoryId', $('#AdvertisementAddForm')).on('change', e => {
        let categoryId = $(e.target).val();
        $.ajax({
            url : `/agency/realty/category_params/${categoryId}?ajax_twig=1`,
            statusCode: {
                404: function () {
                    alert("page /agency/realty/category_params/ not found");
                },
                403: function () {
                    alert("Запрещен доступ к странице /agency/realty/category_params/");
                }
            },
            success : function(data){
                let $categoryParams = $('#categoryParams');
                $categoryParams.replaceWith(data);
                $categoryParams.find('select').select2({language: 'ru', width: '100%'});
            }
        });
    })

    $('.JS-add-photo').on('click', function (event) {
        event.preventDefault();
        $('.fileinput-button input').click();
    });

    $('.cards__tabs').on('click', '.js-link-tab', e => {
        $('.cards__tabs > li').removeClass('current');
        // console.log($(this).closest('li'));
        let category = e.target.dataset.category;
        $(`.realty-object`).addClass('element-hidden');
        $(`.realty-object[data-category=${category}]`).removeClass('element-hidden');
        $(e.target).closest('li').addClass("current");
    });
})
