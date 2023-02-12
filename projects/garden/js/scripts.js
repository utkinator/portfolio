/* Растягиваем верхние менюшки на ширину контента */
function topMenuResize(){
    if($('body').width() > 1400){
        $('.tm-inner ul li').css({'padding':'0 2%'});
    }
    if($('body').width() < 1400 && $('body').width() > 1350){
        $('.tm-inner ul li').css({'padding':'0 1.7%'});
    }
    if($('body').width() < 1350 && $('body').width() > 1300){
        $('.tm-inner ul li').css({'padding':'0 1.6%'});
    }
    if($('body').width() < 1300 && $('body').width() > 1250){
        $('.tm-inner ul li').css({'padding':'0 1.4%'});
    }
    if($('body').width() < 1250 && $('body').width() > 1200){
        $('.tm-inner ul li').css({'padding':'0 1.2%'});
    }
    if($('body').width() < 1200 && $('body').width() > 1150){
        $('.tm-inner ul li').css({'padding':'0 0.8%'});
    }
    if($('body').width() < 1150 && $('body').width() > 1100){
        $('.tm-inner ul li').css({'padding':'0 0.5%'});
    }
    if($('body').width() < 1100 && $('body').width() > 1050){
        $('.tm-inner ul li').css({'padding':'0 0.3%'});
    }
    if($('body').width() < 1050 && $('body').width() > 1000){
        $('.tm-inner ul li').css({'padding':'0'});
    }
    if($('body').width() < 1000){
        $('.tm-inner ul li').css({'padding':'0'});
    }
}


$(document).ready(function() {

    /* Вычисляем и устанавливаем верхний отступ у блока */
    if($('.pres-block')){
        var pbHeight = $('.pres-block').height();
        var pbParentHeight = $('.pres-block').parent().parent().height();
        pbTop = (pbParentHeight - pbHeight)/3;
        $('.pres-block').css({'marginTop':pbTop+'px'});
    }

    /* Очищаем поля формы */
    $('.clear').click(function(){
        $(this).parent().parent().find('input, textarea').attr('value','');
    });

    /* Fancy Box */
    $('.fancy').fancybox();

    /* Боковое меню */
    $('.sm-el ul').hide(); // Прячем все подменю
    $('.active ul').show(); // Показываем подменю у активного элемента

    // Расскрываем-Закрываем пункт меню, имеющий вложенные подменю
    $('.sm-el a.link').click(function(){
        if($(this).hasClass('closed')){
            $(this).removeClass('closed').addClass('showme').next().slideDown('fast');
        }
        else if($(this).hasClass('showme')){
            $(this).removeClass('showme').addClass('closed').next().slideUp('fast');
        }
    });

    topMenuResize();
    $(window).bind('resize', function() {
        topMenuResize();    
    });
});