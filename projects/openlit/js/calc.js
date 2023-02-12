/* ������� ��������� */
var letters_per_page = 3500; // ���������� ������ �� ��������
var rows_per_page = 50; // ���������� ����� �� ��������
var quick_proc = 0.1; // �������� �� ���������

/* ��� ������� */
var page_cost_a = 200; // ��������� ����� ��������
var simbol_a = page_cost_a / letters_per_page; // ��������� ��������� ������ �������
var row_a = page_cost_a / rows_per_page; // ��������� ��������� ����� ������

/* ��� ����������� */
var page_cost_i = 400; // ��������� ����� ��������
var simbol_i = page_cost_i / letters_per_page; // ��������� ��������� ������ �������
var row_i = page_cost_i / rows_per_page; // ��������� ��������� ����� ������

/* ��� �������������� */
var page_cost_r = 100; // ��������� ����� ��������
var simbol_r = page_cost_r / letters_per_page; // ��������� ��������� ������ �������
var row_r = page_cost_r / rows_per_page; // ��������� ��������� ����� ������

function calculate(){
    var total = 0; // ������ ��������� ������
    var total_services = 0; // ����� �� ��������� ������
    var total_proza = 0; // ����� �� �����
    var total_stih = 0; // ����� �� ����
    var quick = 0; // �� ���������
    var services = $(".service_price:checked").length; // ���������� �����, ��������� �������������
    for(var i=0; i<services; i++ ){
        total_services += parseInt($(".service_price").eq(i).val()); // ��������� ����� ���� �����
    }
    var proza_quont = $(".l-q-text").val(); // �������� ���-�� ������
    var stih_quont = $(".l-q-stih").val(); // �������� ���-�� �����
    var payment = $(".payment_type:checked").val(); // �������� ������ ������ � �����. ����������

    if($("#for_who_1").hasClass("active")){
        total_proza = proza_quont * simbol_a; // ��������� ����� �� �����
        total_stih = stih_quont * row_a; // ��������� ����� �� ����

        if($("#srochno").hasClass("checked")){
            quick = ((total_services + total_proza + total_stih) * payment) * quick_proc;
        }
        else if($(".srochno").hasClass("unchecked")){quick = 0;}
        total = ((total_services + total_proza + total_stih) * payment) + quick; // ��������� ������ ��������� ������
        $(".c-text").val(total); // ���������� ������ ��������� ������
    }
    if($("#for_who_2").hasClass("active")){

        total_proza = proza_quont * simbol_i; // ��������� ����� �� �����
        total_stih = stih_quont * row_i; // ��������� ����� �� ����
        if($("#srochno").hasClass("checked")){
            quick = ((total_services + total_proza + total_stih) * payment) * quick_proc;
        }
        else if($(".srochno").hasClass("unchecked")){quick = 0;}
        total = ((total_services + total_proza + total_stih) * payment) + quick; // ��������� ������ ��������� ������
        $(".c-text").val(total); // ���������� ������ ��������� ������
    }
    if($("#for_who_3").hasClass("active")){

        total_proza = proza_quont * simbol_r; // ��������� ����� �� �����
        total_stih = stih_quont * row_r; // ��������� ����� �� ����
        if($("#srochno").hasClass("checked")){
            quick = ((total_services + total_proza + total_stih) * payment) * quick_proc;
        }
        else if($(".srochno").hasClass("unchecked")){quick = 0;}
        total = ((total_services + total_proza + total_stih) * payment) + quick; // ��������� ������ ��������� ������
        $(".c-text").val(total); // ���������� ������ ��������� ������
    }
}