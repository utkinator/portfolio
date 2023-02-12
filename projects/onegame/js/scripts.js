$(document).ready(function() {
    /* Carousel */
    function mycarousel_initCallback(carousel) {
        $('#carousel-next').bind('click', function() {
            carousel.next();
            return false;
        });

        $('#carousel-prev').bind('click', function() {
            carousel.prev();
            return false;
        });
    };
    $('#servers-list').jcarousel({
        scroll: 1,
        visible: 1,
        buttonNextHTML: null,
        buttonPrevHTML: null,
        initCallback: mycarousel_initCallback
    });

    /* Opera Hack */
    if($.browser.opera){
        $('html, body, #layout').css({'position':'absolute', 'overflowX':'auto', 'overflowY':'auto'});
    }

    /* Show Popup Window */
    $('.show').click(function(){
        $('.popup').hide(); /* Hide All Popups Windows */
        $('.popups').show(); /* Show Popups Container */
        $(".popups #"+$(this).attr('class').replace('show p-','')+"").show(); /* Get Window Id And Show It By Clicking */
    });
    /* Set Top Margin Of Popups Windows */
    $('.popup').each(function(){
        var popHeight = $(this).height(); // Get Popup Height
        var winHeight = $(window).height(); // Get Window Height
        if(((winHeight-popHeight)/2) > 0){
            $(this).css({'top':((winHeight-popHeight)/2) + 'px'});
            if ( $.browser.msie && $.browser.version == "6.0") {$(this).css({'top':10 + 'px'});}
        }
        else {$(this).css({'top':0 + 'px'});}
        $(this).hide();
    });
    $('.popups').hide();

    /* Close Popup Window */
    $('.close').click(function(){
        $(this).parent('.popup').hide();
        $('.popups').hide();
    });

    /* Show/Hide input hints */
    $('.input input, .i_block input').focus(function(){
        if($(this).val() == 'логин' || $(this).val() == 'найти'){
        this_val = $(this).val();
        $(this).attr('rel', this_val);
        $(this).val('');
    } });
    $('.input input, .i_block input').blur(function(){
        if($(this).val() == ''){
            old_val = $(this).attr('rel');
            $(this).val(old_val);
        }
    });

    /* Clear Input */
    $('.block input[type="text"], .block textarea').focus(function(){
        $(this).next('span.clean').show();
    });
    $('.block input[type="text"], .block textarea').blur(function(){
        if($(this).val() == ""){$(this).next('span.clean').hide();}
        if($(this).val() != ""){$(this).next('span.clean').show();}
    });
    $('span.clean').click(function(){
        $(this).prev().val('');
        $(this).hide();
    });

    /* Styling Search Btn On Search Field Focus/Blur */
    $('.search-block .search, .p-404 .search, .sr .search').focus(function(){
        $(this).next('.s-btn').css({'backgroundPosition':'0 -20px'});
    });
    $('.search-block .search, .p-404 .search, .sr .search').blur(function(){
        $(this).next('.s-btn').css({'backgroundPosition':'0 2px'});
        if($(this).val() != '' && $(this).val() != 'найти'){
            $(this).next('.s-btn').css({'backgroundPosition':'0 -20px'});
        }
    });

    /* Styling Even Lists In Server Order Popup Window */
    var corners = $('<div class="stl"> </div><div class="str"> </div><div class="sbl"> </div><div class="sbr"> </div>');
    $('.popups .serv-req li:even').append(corners).addClass('col');

    /* Styling Odd Table Col In Server Order Popup Window */
    $('.popups .serv-test tr').each(function(){
        $(this).find('td').eq(1).addClass('att');
    });
    $('.popups .serv-test table').each(function(){
        $(this).find('td.att:first').append('<div class="stw"><div class="stl"> </div><div class="str"> </div></div>').addClass('a-first');
        $(this).find('td.att:last').append('<div class="sbw"><div class="sbl"> </div><div class="sbr"> </div></div>').addClass('a-last');
    });

    /* Monitoring Hover */
    $('.mon').hover(
        function(){$(this).addClass('hover');},
        function(){$(this).removeClass('hover');}
    );

    /* Styling Answers & Questions */
    $('.asks-list .answ:even').addClass('a-1');
    $('.asks-list .answ:odd').addClass('a-2');

    /* Styling Images In Propositions Page */
    $('.text img').wrap('<div class="i-wrap"></div>');
    $('.i-wrap').each(function(){
        $('<div class="iw-cover"> </div>').appendTo($(this));
    });

    /* Styling Big Table On Services Page */
    $('.big-table > table > tbody > tr').each(function(){
        $(this).children('td').eq(0).addClass('bt-1');
        $(this).children('td').eq(1).addClass('bt-2');
        $(this).children('td').eq(2).addClass('bt-3');
        $(this).children('td').eq(3).addClass('bt-4');
    });
    $('.big-table > table > tbody > tr:last td').css({'borderBottom':'none'});

    /* Focus On Search Field by Clicking Search Icon In Quick Links Block */
    $('.q-search').click(function(){
        $('.search-block .search').focus();
    });

    /* Form Validation */
    $('.contact-form').each(function(){
        $(this).validate({
            rules: {
                fio: "required",
                phone:"required"
            },
            errorPlacement: function(error, element) {
                error.insertAfter(element);
            }
        });
    });

});