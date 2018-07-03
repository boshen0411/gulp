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
    "bFilter": true, //开启搜索功能
    "bRegex": true, //当为true的时候搜索字符串会被当作正则表达式，当为false（默认）的时候，会被直接当作一个字符串
    "bLengthChange": true, //允许改变每页显示的数据条数
    "bSort": false, //是否启用Datatables排序
    "bJQueryUI": false, //使用jqueryui样式（需要引入jqueryui的css，默认不引用）
    "bProcessing": true, //显示加载信息
    "retrieveData": true,
    "fnServerData": retrieveData, //从 Ajax 源加载数据的表的内容,ajax 作为function用法，与后台交互处理的数据
    "bPaginate": true, //允许表格分页
    "bServerSide": true, //开启服务器模式,为false则为客户端处理数据，一次性展示，为true服务器进行处理
    "sAjaxSource": "", //从 Ajax 源加载数据的表的内容
    "aLengthMenu": [10, 25, 50, 100],//改变每页显示条数列表的选项
    "scrollY": dataTable_height, //垂直滚动条
    "scrollX": true, //超出允许水平横向滚动条
    "order": [],
    "dom": '<"topTop"<".dataTableHeadTitle"><"#dataTableHeadBtnList">>rt<"bottom"ilCp><"clear">',//定义DataTables的组件元素的显示和显示顺序
    colVis: {
        "buttonText": "设置显示列",
        showNone: "不显示列",
        showAll: "显示所有列",
        exclude: [0]
    },
    "aaSorting": [],//表格初始化排序
    "oLanguage": atsoLanguage, //设置语言
    "fnServerParams": function(aoData) {  //发送给服务器的参数
        aoData.push({
            "name": "ACCESS_SESSION_TOKEN",
            "value": $("#ACCESS_SESSION_TOKEN").val()
        });
    },
    "fnDrawCallback": function(oSettings) { //表格重绘的时候回调函数
        setDataTableHeight(oSettings);
    },
    "initComplete": function(settings, json) {  //初始化结束后的回调函数
        //表头按钮 
        $(".dataTable_headBtn").appendTo("#dataTableHeadBtnList").show();
    }
}