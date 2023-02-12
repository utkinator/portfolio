/* Базовые установки */
var letters_per_page = 3500; // Количество знаков на страницу
var rows_per_page = 50; // Количество строк на страницу
var quick_proc = 0.1; // Надбавка за срочность

/* Для авторов */
var page_cost_a = 200; // Стоимость одной страницы
var simbol_a = page_cost_a / letters_per_page; // Вычисляем стоимость одного символа
var row_a = page_cost_a / rows_per_page; // Вычисляем стоимость одной строки

/* Для издательств */
var page_cost_i = 400; // Стоимость одной страницы
var simbol_i = page_cost_i / letters_per_page; // Вычисляем стоимость одного символа
var row_i = page_cost_i / rows_per_page; // Вычисляем стоимость одной строки

/* Для рекламодателей */
var page_cost_r = 100; // Стоимость одной страницы
var simbol_r = page_cost_r / letters_per_page; // Вычисляем стоимость одного символа
var row_r = page_cost_r / rows_per_page; // Вычисляем стоимость одной строки

function calculate(){
    var total = 0; // Полная стоимость работы
    var total_services = 0; // Сумма за выбранные услуги
    var total_proza = 0; // Сумма за прозу
    var total_stih = 0; // Сумма за стих
    var quick = 0; // За срочность
    var services = $(".service_price:checked").length; // Количество услуг, выбранных пользователем
    for(var i=0; i<services; i++ ){
        total_services += parseInt($(".service_price").eq(i).val()); // Вычисляем сумму всех услуг
    }
    var proza_quont = $(".l-q-text").val(); // Получаем кол-во знаков
    var stih_quont = $(".l-q-stih").val(); // Получаем кол-во строк
    var payment = $(".payment_type:checked").val(); // Получаем способ оплаты и соотв. коофициент

    if($("#for_who_1").hasClass("active")){
        total_proza = proza_quont * simbol_a; // Вычисляем Сумму за прозу
        total_stih = stih_quont * row_a; // Вычисляем Сумму за стих

        if($("#srochno").hasClass("checked")){
            quick = ((total_services + total_proza + total_stih) * payment) * quick_proc;
        }
        else if($(".srochno").hasClass("unchecked")){quick = 0;}
        total = ((total_services + total_proza + total_stih) * payment) + quick; // Вычисляем полную стоимость работы
        $(".c-text").val(total); // Показываем полную стоимость работы
    }
    if($("#for_who_2").hasClass("active")){

        total_proza = proza_quont * simbol_i; // Вычисляем Сумму за прозу
        total_stih = stih_quont * row_i; // Вычисляем Сумму за стих
        if($("#srochno").hasClass("checked")){
            quick = ((total_services + total_proza + total_stih) * payment) * quick_proc;
        }
        else if($(".srochno").hasClass("unchecked")){quick = 0;}
        total = ((total_services + total_proza + total_stih) * payment) + quick; // Вычисляем полную стоимость работы
        $(".c-text").val(total); // Показываем полную стоимость работы
    }
    if($("#for_who_3").hasClass("active")){

        total_proza = proza_quont * simbol_r; // Вычисляем Сумму за прозу
        total_stih = stih_quont * row_r; // Вычисляем Сумму за стих
        if($("#srochno").hasClass("checked")){
            quick = ((total_services + total_proza + total_stih) * payment) * quick_proc;
        }
        else if($(".srochno").hasClass("unchecked")){quick = 0;}
        total = ((total_services + total_proza + total_stih) * payment) + quick; // Вычисляем полную стоимость работы
        $(".c-text").val(total); // Показываем полную стоимость работы
    }
}