var globalPath = "http://ats.kingdee.com";
// var globalPath = "http://172.21.21.41:8080";
var u = navigator.userAgent;
console.log(u)
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var isPc = function IsPC() { //是否是PC
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"
    ];
    var isPC = true;
    for (var v = 0; v < Agents.length; v++) {
        if (u.indexOf(Agents[v]) > 0) {
            isPC = false;
            break;
        }
    }
    return isPC;
};

function jumpPage(url) {
    if (isPc()) {
        window.location.href = "../" + url;
    } else {
        if (isiOS) {
            window.webkit.messageHandlers.jumpToPage.postMessage('/auto/EASH5/test/dist/' + url); //function for jump page!!!
        } else if (isAndroid) {
            var url = ('/auto/EASH5/test/dist/' + url).toString();
            AndroidProvider.jumpToPage(url);
        }
    }
}

function pageBack(boolean) {
    if (isPc()) {
        window.history.go(-1)
    } else {
        if (isiOS) {
            window.webkit.messageHandlers.pageBack.postMessage(boolean);
        } else if (isAndroid) {
            if (boolean) {
                AndroidProvider.pageBack(1);
            } else {
                AndroidProvider.pageBack(0);
            }
        }
    }
}

function modalFunc(code, msg, fn) {
    if (code == 998) {} else {
        $$('.modalBox').fadeIn('fast', function () {
            flag = false;
            $$('.modalBox').fadeOut(2000, function () {
                flag = true;
                if (fn) {
                    fn();
                }
            })
        })
    }
}

function loadStatus() {
    var temp = '<div class="loadingWrap">' +
        '<div class="loadingPos">' +
        '<div class="loadingBox">' +
        '<i class="loadingImg"></i>' +
        '<div class="loadText">数据处理中</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    if (!$$('.loadingWrap').length) {
        $$('body').append(temp);
    } else {
        $$('.loadingWrap').show();
    }
    setTimeout(function () {
        closeLoadStatus();
    }, 10000)
}

function closeLoadStatus() {
    $$('.loadingWrap').hide();
}
//获取url的参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function pickerPop(obj, data, fn1, fn2) {
    weui.picker(
        data, {
            onConfirm: function (result) {
                $$(obj).text(result[0].label);
                $$(obj).closest('.repSelect').find('input:eq(0)').val(result[0].value);
                if (fn1) {
                    fn1(result[0].label, result[0].value);
                }

            },
            onClose: function () {
                if (fn2) {
                    fn2();
                }
            },
        }
    );
}


// ajax请求返回成功但数据错误，进行提示
function showAjaxFailInf(data) {
    if (data.RESULTCOD != '200' && data.RESULTDESC) {
        $$('.modalBox').html(data.RESULTDESC);
    } else {
        $$('.modalBox').html("网络错误");
    }
    modalFunc();
}
// 深复制对象数组;
function cloneObjectArr(objArr) {
    var temp = [];
    for (var i in objArr) {
        var tempObj = {};
        for (var j in objArr[i]) {
            tempObj[j] = objArr[i][j]
        }
        temp.push(tempObj);
    }
    return temp
}
//保留小数点两位数字并且四舍五入
function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

function PrefixInteger(num) {
    return (Array(2).join(0) + num).slice(-2);
}


//对象类型
function typeOf(obj) {
    var toString = Object.prototype.toString;
    var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    return map[toString.call(obj)];
}


//深度拷贝
function deepCopy(data) {
    var t = typeOf(data);
    var o;
    if (t === 'array') {
        o = [];
    } else if (t === 'object') {
        o = {};
    } else {
        return data;
    }

    if (t === 'array') {
        for (var i = 0; i < data.length; i++) {
            o.push(deepCopy(data[i]));
        }
    } else if (t === 'object') {
        for (var i in data) {
            o[i] = deepCopy(data[i]);
        }
    }
    return o;
}

// 获取项目折扣(项目项, 用户数据)
function getProItemRate(item, custInfoData, successCallback) {
    var postData = {
        REP_SESSION_TOKEN: token,
        REPAIRITEMID: item.ITEMID, // 项目
        BRANDID: custInfoData.BRANDID, // 品牌
        // SERVICEORGID 服务组织
        COMETIME: custInfoData.COMETIME, // 来店时间
        SETTLEMENTOBJECT: custInfoData.SETTLEMENTOBJECT || '1', // 结算对象类型(默认取1)

        // 以下两个参数用来取会员折扣
        REPAIRCLASSIFYID: item.REPAIRCLASSIFYID || "", // 维修种类ID
        PAYMENTCLASSIFYID: item.PAYMENTCLASSIFYID || custInfoData.PAYMENTCLASSIFYID || "" // 付费类别ID

    };
    if (postData.SETTLEMENTOBJECT == '3') { // 结算类型为3(保险)时,结算对象id取保险公司id      
        postData.SETTLEMENTOBJECTID = custInfoData.INSURANCOMPANYID; // 结算对象
    } else { // 结算类型非保险时，结算对象取车辆 id
        postData.SETTLEMENTOBJECTID = custInfoData.VEHICLEID;
    }
    $$.ajax({
        url: globalPath + "/auto/easassistant/sys/sale/repairwo/getItemDiscountRate",
        data: postData,
        type: "get",
        dataType: "json",
        success: function (data) {
            // 因为是引用方式，直接对对象属性赋值，不需要返回
            if (data && data.RATE) {
                item.DISCOUNTRATE = data.RATE;
            } else {
                item.DISCOUNTRATE = 0; // 折扣率为0
            }
            if (typeof successCallback == "function") {
                successCallback(item);
            }
        },
        error: function (xhr, type, errorThrown) {
            $$('.modalBox').html("项目折扣获取错误");
            modalFunc();
        }
    });
}

// 批量获取物料价格(物料项,套餐下的物料数据对象, 提交参数)，
//  materialData参数只在套餐选择页获取物料价格时
function getMaterialItemPrice(postData, materialData, callback) {
    if (!postData) {
        console.error("getMaterialItemPrice function 参数传入错误");
        return;
    }
    $$.ajax({
        url: globalPath + "/auto/easassistant/sys/sale/repairwo/getMaterialPrice",
        data: postData,
        type: "post",
        dataType: "json",
        success: function (data) {
            if (typeof callback == 'function') {
                callback(data, materialData);
            }
        },
        error: function (xhr, type, errorThrown) {
            $$('.modalBox').html(type);
            modalFunc();
        }
    });
}

// 项目带出的物料去重，返回新的物料数组
function removeDuplicatedMaterial(materialData) {
    for (var i = 0; i < materialData.length; i++) {
        // 物料去重
        var currData = materialData[i];
        materialData[i].TAG = "projectMaterial"; // 标记为项目带出的物料
        for (var j = i + 1; j < materialData.length; j++) {
            if (materialData[j].MATERIALID == currData.MATERIALID) {
                materialData.splice(i, 1);
                i--
                break;
            }
        }
    }
    return materialData
}

// 物料合并， materialData合并到tempMaterialData中，返回合并后的tempMaterialData
function combineMaterial(tempMaterialData, materialData) {
    for (var j in materialData) { // 遍历获取到的相关物料
        var currMaterialDataItem = materialData[j]
        var currIsNew = true;

        for (var i in tempMaterialData) { // 遍历已选的物料数据
            // 如果在已选物料中存在项目携带物料
            if (currMaterialDataItem.MATERIALID == tempMaterialData[i].MATERIALID) {
                var currIsNew = false; // 标记当前物料存在                                  
            }
        }
        if (currIsNew) { // 如果本条物料是已保存的物料中不存在的
            tempMaterialData.push(currMaterialDataItem);
        }
    }
    return tempMaterialData;
}

//安卓打电话 接口
function contact(phoneNum) {
    var phoneNumStr = phoneNum.toString();
    AndroidProvider.getContactsService().call(phoneNumStr);
}