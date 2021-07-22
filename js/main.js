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

    $('.filter__main-section--type .list-flats__text').on('click', (e) => {
        e.preventDefault();
        $(e.target).closest('li').removeClass('active');
        $(e.target).closest(".filter__main-section").find(".filter__main-select-title").text($(e.target).text());
        $('#AdvertisementCategoryId').val(e.target.dataset.categoryId).trigger('change');
    })

    $('.favorites-action').off('click');
    Is2bFavorite.init('.favorites-action', {
        callback: function () {
            $(`.favorites-action[data-id=${Is2bFavorite.a.get(0).dataset.id}]`).each((index, element) => {
                let fEl = $(element);
                if (Is2bFavorite.action === 'remove') {
                    fEl.data('action', 'add');
                    fEl.removeClass('active');
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



    $('#AdvertisementMessageContactWithAgentAdvertisementForm').on('submit', event => {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: event.target.getAttribute('action'),
            data: $(event.target).serialize(),
            dataType: 'json',
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
