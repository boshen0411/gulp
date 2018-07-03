// dataTable相关的定义--lmf
var dataTable_height;
var atsoLanguage = {
    "sProcessing": "正在加载中......",
    "sZeroRecords": "对不起，查询不到相关数据！",
    "sEmptyTable": "表中无数据存在！",
    "sLengthMenu": "每页显示 _MENU_ 条",
    "sSearch": "查询",
    "sInfo": "共 _TOTAL_ 条",
    "sInfoEmpty": "当前显示0条记录",
    "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
    "oPaginate": {
        "sFirst": "首页",
        "sPrevious": "上一页",
        "sNext": "下一页",
        "sLast": "末页"
    }
};

var dataTable_DefaultPara = {
    "bFilter": true,
    "bRegex": true,
    "bLengthChange": true,
    "bSort": false,
    "bJQueryUI": false,
    "bProcessing": true,
    "retrieveData": true,
    "fnServerData": retrieveData,
    "bPaginate": true,
    "bServerSide": true,
    "sAjaxSource": "",
    "aLengthMenu": [10, 25, 50, 100],
    "scrollY": dataTable_height,
    "scrollX": true,
    "order": [],
    "dom": '<"topTop"<".dataTableHeadTitle"><"#dataTableHeadBtnList">>rt<"bottom"ilCp><"clear">',
    colVis: {
        "buttonText": "设置显示列",
        showNone: "不显示列",
        showAll: "显示所有列",
        exclude: [0]
    },
    "aaSorting": [],
    "oLanguage": atsoLanguage,
}