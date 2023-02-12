$(document).ready(function() {

    /* Добавляем маркер лишке активной ссылки */
    $('.h_menu a.active').parent().addClass('act');

    /* Корректируем оступ у последней li в блоке селекторов */
    $('.s_wrap ul li:last').css({'marginRight':15+'px'});

    /* Clear Input */
    $('.block input[type="text"]').focus(function(){
        $(this).next('span.clean').show();
    });
    $('.block input[type="text"]').blur(function(){
        if($(this).val() == ""){$(this).next('span.clean').hide();}
        if($(this).val() != ""){$(this).next('span.clean').show();}
    });
    $('.i_block .clean').click(function(){
        $(this).prev().val('');
    });

    /* Меняем висюльку в главном меню на оранжевую, если находимся в разделе "Квартет" */
    if($('#content').hasClass('c_qw')){$('.h_menu li.act').css({'background':'url("img/hm-marker-o.png") no-repeat center bottom'});}

    /* SubMenu Actions */
    for(var i=0; i<$('.img li').length; i++){
        $('.img li').eq(i).addClass('t_'+i);
        $('.menu li').eq(i).attr('id','t_'+i);
    }
    $('.img li.'+$('.menu li a.active').parent().attr('id')+'').show();
    $('.menu li').hover(
            function(){
                $('.img li.'+$(this).attr('id')+'').show().siblings('li').hide();
            },
            function(){
                $('.img li.'+$('.menu li a.active').parent().attr('id')+'').show().siblings('li').hide();   
            }
    );

    /* Стилизируем ModX таблицу */
    $('table').each(function(){
        $(this).find('tr:first').addClass('title');
        $(this).find('tr').eq(1).children('td:odd').addClass('middle');
    });
    $('table tbody tr').each(function(){
        $(this).children('td:last').addClass('last');
    });

    /* Tabs Actions */
    for(var j=0; j<$('.tabs .tt li').length; j++){
        $('.tabs .tt li').eq(j).addClass('tab_'+j);
        $('.tabs-content .tc li').eq(j).attr('id','tab_'+j);
    }
    if($('.tabs-content ul').hasClass('tc')){
        var sdf = $('.tabs .tt li.active').attr('class').replace('active ','');
        $('.tabs-content li#'+sdf+'').show().siblings('li').hide();
    }
    $('.tabs .tt li').click(function(){
        $(this).addClass('active').siblings('li').removeClass('active').children('div:eq(1)').css({'background':'none'});
        var sdf2 = $(this).attr('class').replace(' active','');
        $('.tabs-content li#'+sdf2+'').show().siblings('li').hide();
    });

    /* Второстепенные табы */
    for(var k=0; k<$('.third_menu .tm_tabs > li').length; k++){
        $('.third_menu .tm_tabs > li').eq(k).addClass('tab2_'+k);
        $('.tm_tabs_content > li').eq(k).attr('id','tab2_'+k);
    }
    if($('.big ul').hasClass('tm_tabs_content')){
        $('.tm_tabs_content li#'+$('.tm_tabs li a.active').parent().attr('class')+'').show().siblings('li').hide();
    }
    $('.tm_tabs li').click(function(){
        $(this).find('a').addClass('active').parent().siblings('li').find('a').removeClass('active');
        $('.tm_tabs_content li#'+$('.tm_tabs li a.active').parent().attr('class')+'').show().siblings('li').hide();
        return false;
    });

    /* Меняем вид картинки в мини-навигации */
    if($('.v_menu a').hasClass('active')){
        $('.v_menu a.active img').attr('src', $('.v_menu a.active img').attr('src').replace('-g',''));
    }

    /* Убираем иконки, которые IE 6 не хочер убирать при Unhover ссылки */
    $('.link').hover(
            function(){$(this).find('.ct-l, .ct-r, .cb-l, .cb-r').show();},
            function(){$(this).find('.ct-l, .ct-r, .cb-l, .cb-r').hide();}
    );

    /* Show/Hide Label Text on Focus & Blur */
    $('.search_wrap .s_inp').focus(function(){
        $(this).css({'color':'#398103'});
        $(this).next().css({'backgroundPosition':'0 -29px'});
        if($(this).val() == 'Поиск'){
            this_val = $(this).val();
            $(this).attr('rel', this_val);
            $(this).val('');
        }
        else{return false;}
    });
    $('.search_wrap .s_inp').blur(function(){
        $(this).next().css({'backgroundPosition':'0 0'});
        if($(this).val() == ''){
            old_val = $(this).attr('rel');
            $(this).val(old_val);
        }
        else{return false;}
    });

    /* Меняем размеры контейнера игры в зависимости от разрешения окна */
    if($('#wrapper').width() < 1200){$('.game').css({'marginLeft':-37+'%'});}
    $(window).resize(function(){
        if($('#wrapper').width() < 1200){$('.game').css({'marginLeft':-37+'%'});}
        else if($('#wrapper').width() > 1200){$('.game').css({'marginLeft':-20+'%'});}    
    });


    /* Тетрис
    ---------------------------------------------------------*/

    /* Создаем массив идентификаторов элементов и их конечных координат (класс элемента, верт. точка назначения, гориз. точка назначения, исходная точка)*/
    var target = new Array([01,442,274,-98], [11,380,193,-130], [10,318,139,-132], [09,270,85,-150], [03,368,301,-142], [08,274,193,-146], [06,258,166,-132], [13,164,58,-166], [12,308,301,-142], [05,216,247,-144], [04,140,220,-130], [02,94,193,-146], [07,108,139,-132], [14,136,85,-164]);

    /* Вертикально опускаем элемент */
    function moveIt(el){
        /* Запускаем таймер для текущего элемента */
        el.everyTime(300, function() {
            var topEl = parseInt($(this).css('top').replace('px',''));  /* Получаем текущую верт. координату */
            var leftEl = parseInt($(this).css('left').replace('px',''));    /* Получаем текущую гориз. координату */
            var classEl = $(this).attr('class').replace('k',''); /* Получаем идентификатор элемента */
            $('.place_container img.k'+classEl+'').show(); /* Показываем соотв. идентификатору подсказку */
            /* Пробегаемся по нашему массиву */
            for(var hd=0; hd<target.length; hd++){
                if(classEl == target[hd][0] && topEl == target[hd][1] && leftEl == target[hd][2]){stopIt(el); el.attr('id','').next().attr('id','active'); $('.kir_container img.k'+classEl+'').fadeIn(500); $('ul.bubles li.b-'+$("#active").attr('class')+'').show().siblings().hide(); moveIt($('#active')); autoBuild();} /* Если текущий элемент оказался в нужном месте, останавливаем для него таймер, передаем токен следующему в DOM элементу и запускаем для того анимацию падения. Если дошли до последнего элемента, вызываем авто-достройку дома, показываем следующий бабл*/
                if(classEl == target[hd][0] && topEl >= target[hd][1] && leftEl != target[hd][2]){stopIt(el); el.animate({'top':target[hd][3]+'px'}, 1000); moveIt($('#active'));} /* Если не попали элементом в нужное место, поднимаем его к исходному положению и опять пускаем вниз */
                $(this).css({'top':topEl+30+'px'}); /* С шагом в 30 px опускаем элемент */
            }
        });
    }

    /* Останавливаем игру */
    function stopIt(el){
        el.stopTime();
    }

    /* Анимируем следующий элемент */
    function go(elem){
        elem.removeClass('xxx').next().addClass('xxx').fadeIn(300, function(){go($('.xxx'));});
    }

    /* При окончании строительства достраиваем дом автоматически */
    function autoBuild(){
        if($('#active').hasClass('finish')){
            $('.place_container').css({'opacity':0});
            go($('.kir_container img').eq(13).addClass('xxx'));
        }
    }

    /* Ускоренно опускаем элемент */
    function turbo(element){
        var leftEl2 = parseInt(element.css('left').replace('px',''));    /* Получаем текущую гориз. координату */
        var classEl2 = element.attr('class').replace('k','');
        for(var hc=0; hc<target.length; hc++){
            if(classEl2 == target[hc][0]){
                element.css({'top':target[hc][1]});
                if(leftEl2 != target[hc][2]){
                    stopIt(element); element.stop().animate({'top':target[hc][3]+'px'}, 1000); moveIt($('#active'));
                }
            }
        }
    }


    /* Двигаем элемент влево */
    function moveLeft(element){
        var lPos = parseInt(element.css('left').replace('px',''));
        element.css({'left':lPos-10+'px'});
    }

    /* Двигаем элемент вправо */
    function moveRight(element){
        var rPos = parseInt(element.css('left').replace('px',''));
        element.css({'left':rPos+10+'px'});
    }

    /* Навешиваем обработчики нажатий */
    $(document).bind('keydown', 'left', function(){moveLeft($('#active'));});
    $(document).bind('keydown', 'right', function(){moveRight($('#active'));});
    $(document).bind('keydown', 'd', function(){turbo($('#active'));});


    $('.btn_start').click(function(){
        $('.by_notes').animate({'top':-500+'px', display:'none'}, 300, function(){
            $('.start_game').animate({'top':-800+'px'}, 300);
            $('.game').animate({marginTop:0, top:0});
        });
        $(this).oneTime(3000, function(){
            $('ul.bubles li.b-'+$("#active").attr('class')+'').show();
            moveIt($('#active'));
        });
    });
    $('.btn_stop').click(function(){
        stopIt($('#active'));
    });
});