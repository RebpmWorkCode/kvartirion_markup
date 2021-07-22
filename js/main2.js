$(() => {
$('.cards__tabs').on('click', '.js-link-tab', e => {
        $('.cards__tabs > li').removeClass('current');
         // console.log($(this).closest('li'));
        let category = e.target.dataset.category;
        $(`.realty-object`).addClass('element-hidden');
        $(`.realty-object[data-category=${category}]`).removeClass('element-hidden');
        $(e.target).closest('li').addClass("current");
    });
});
