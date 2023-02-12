$(document).ready(function() {
    //Opera overflow hack
    if ($.browser.opera) {
        $("body, html").css({'position':'absolute', 'overflowX':'auto', 'overflowY':'auto'});
    }

    /* Phones Carousel */
    function mySecondcarousel_initCallback(carousel) {
        $('#carousel-next').bind('click', function() {
            carousel.next();
            return false;
        });

        $('#carousel-prev').bind('click', function() {
            carousel.prev();
            return false;
        });
    };
    $("#pcarousel").jcarousel({
        scroll: 1,
        visible: 1,
        buttonNextHTML: null,
        buttonPrevHTML: null,
        wrap: 'circular',
        initCallback: mySecondcarousel_initCallback
    });

    /* Reset Form */
    $('.btn-reset').click(function(){
        $(this).parent().find('input, textarea').val('');       
    });
});