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
        $('.list-flats > li').removeClass('active');
        if (li.classList.contains('active')) {
            li.classList.remove('active');
            // console.log(subMenu);
        } else {
            li.classList.add('active');
            // console.log(subMenu);
        }
        $(e.currentTarget).closest(".filter__main-section").find(".filter__main-select-title").text($(e.currentTarget).text())
        $('#AdvertisementCategoryId').val(e.currentTarget.dataset.categoryId).trigger('change');

        // $(this).parent().hasClass("active") ? ($(this).parent().removeClass("active"),
        //     $(this).parent().find(".list-flats__submenu").hide()) : ($(this).parent().addClass("active"),
        //     $(this).parent().find(".list-flats__submenu").show())
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
                console.log(result)
            },
            error: function (error) {
                console.log(error);
            }
        })
    })

    // $("select").select2({
    //         width: "100%", placeholder: function () {
    //             $(this).data("placeholder")
    //         }
    //     })

    $('[href="#create_object"]').on('click', e => {

    })

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
        let categoryId = $('#AdvertisementCategoryId');
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

//
})
