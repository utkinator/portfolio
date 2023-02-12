$(document).ready(function() {

    /* Task 1 */
    for(var j=10; j>0; j--){
        $('#task_1 strong').prepend('<span class=p'+j+'> </span>');
    }

    /* Task 3 */
    $('#task_3 li:first').addClass('first'); // Decor For First Paragraph

    // Inserting Numbers Of Each List Item
    for(var i=1; i<=$('#task_3 li').length; i++){
        $('<span>'+i+')</span>').prependTo($('#task_3 li').eq(i-1));
    }


    /* Task 4 */
    $('#scroller').scroll(function() {
        var curBlock = $('#blocks li.curent');
        var curTitle = curBlock.find('.title');
        var curBlockHeight = curBlock.height();
        var posMain = $('#blocks > li:first').position();
        var pos = curBlock.position();

        curTitle.css({'top':pos.top*-1+'px'});

        /* Scrolling Bottom */
        if(curTitle.css('top').replace('px','') >= curBlockHeight){
            curBlock.removeClass('curent').addClass('prev');
            curBlock = curBlock.next();
            curBlock.addClass('curent');
        }
        /* Scrolling Top */
        if(curTitle.css('top').replace('px','') <= 0){
            curBlock.removeClass('curent');
            curBlock.prev().removeClass('prev');
            curBlock = curBlock.prev();
            curBlock.addClass('curent');
            if(posMain.top >=0){$('#blocks > li:first').addClass('curent');}
        }
    });

});