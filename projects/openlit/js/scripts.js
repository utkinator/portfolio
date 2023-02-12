$(document).ready(function(){
    /* Show/Hide Answers For Questions */
    $(".f_question").click(function(){
        $(this).addClass("q_opened");
        if($(this).hasClass("q_closed")){
            $(this).css("fontWeight","normal");
            $(this).next().slideUp("fast");
            $(this).removeClass("q_closed").addClass("q_opened");
        }
        else if($(this).hasClass("q_opened")){
            $(this).css("fontWeight","bold");
            $(this).next().slideDown("fast");
            $(this).removeClass("q_opened").addClass("q_closed");
        }
    });

    /* Hiding Orange Horizontal Separator If Answer Has Image */
    $("img.a_img").parent().parent().css("backgroundPosition",-1000+"px");

    /* Show Popup Register Form */
    $(".reg-form-login").click(function(){
        $(".popup-reg-form").show();
    });
    /* Hide Popup Register Form */
    $(".p-f-close-link").click(function(){
        $(".popup-reg-form").hide();
    });

    $(".strok_quont").hide();

    $(".text_type option").click(function(){
        $(".l-q-text, .l-q-stih").val("");// Очищаем поля
        if($(this).hasClass("t-t-proza")){$(".strok_quont").hide(); $(".letters_quont").show();}
        else if($(this).hasClass("t-t-stih")){$(".letters_quont").hide(); $(".strok_quont").show();}
    });
    $("#srochno").click(function(){
        if($(this).hasClass("unchecked")){
            $(this).removeClass("unchecked").addClass("checked");
        }
        else if($(this).hasClass("checked")){
            $(this).removeClass("checked").addClass("unchecked");
        }
    });
});