$(document).ready(function() {
    //Opera overflow hack
    if ($.browser.opera) {
        $("body, html").css({'position':'absolute', 'overflowX':'auto', 'overflowY':'auto'});
    }

    /* Show/Hide input hints */
    $('input[type="text"]').focus(function(){
        if($(this).val() == 'Поиск'){
            $(this).attr('rel', $(this).val()).val('');
            $(this).next().css({'backgroundPosition':'0 -25px'});
        }
    });
    $('input[type="text"]').blur(function(){
        if($(this).val() == ''){
            $(this).val($(this).attr('rel'));
            $(this).next().css({'backgroundPosition':'0 0'});
        }
    });

    /* Decoration of Last Elem In Phone Block */
    $('.ph').each(function(){
        $(this).find('span:last').addClass('last');
    });

    /* Decoration First New */
    $('.ln li:first').addClass('first');

    /* Decoration Additional Menu */
    $('.am li:first').addClass('dec');

    /* Hover Effect on Main Page */
    for(var i=0; i<$('.tt li').length; i++){
        $('.tt li').eq(i).addClass('t-serv-'+i+'');
        $('.tc li').eq(i).addClass('serv-'+i+'');
    }
    $('.tc li:first').show();
    $('.tt li').hover(
        function(){
            $('.tc li.'+$(this).attr('class').replace('t-','')+'').show().siblings().hide();
        },
        function(){

        }
    );

});