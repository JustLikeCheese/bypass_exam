// ==UserScript==
// @name         bypass 普测练习
// @namespace    http://tampermonkey.net/
// @version      2025-02-09
// @description  bypass 普测练习
// @author       Cheese
// @match        https://stu.hunanpuce.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==


// 随机题目
function randomAnswer() {
    var answers = document.getElementsByClassName("answer");
    if (answers.length > 0) {
        var answer = answers[0];
        if (answer.children && answer.children.length > 0) {
            var randomAnswer = answer.children[Math.floor(Math.random() * answer.children.length)];
            if (randomAnswer.children.length > 0) {
                randomAnswer = randomAnswer.children[0];
            }
            randomAnswer.click();
            // 模拟按下 PageDown
            var pageDownEvent = new KeyboardEvent("keydown", {
                key: "PageDown",
                code: "PageDown",
                keyCode: 34,
                which: 34,
                charCode: 34,
                shiftKey: false,
                ctrlKey: false,
                altKey: false,
                metaKey: false,
                bubbles: true,
                cancelable: true,
            });
            document.dispatchEvent(pageDownEvent);
        }
    }
}

// 判断是否为移动端
function isMobile() {
    var userAgent = navigator.userAgent;
    return /Mobile/i.test(userAgent);
}

// 监听键盘的 keypress 事件
function handleKeyPress(event) {
    if (event.key === "Enter") {
        randomAnswer();
    }
}

// 注入 bypass 普测脚本
function inject_bypass() {
    document.addEventListener("keypress", handleKeyPress);
    var mobileBtn = document.getElementsByClassName("mobileBtn mobileDispaly")[0];
    var handTips = document.getElementsByClassName("handTips")[0];
    if (!mobileBtn) {return;}
    function addButton(text, listener) {
        var btn = document.createElement("div");
        btn.style.display = "block";
        btn.style.backgroundColor = "#9bc710";
        btn.style.width = "33.3%";
        btn.style.height = "13.33vw";
        btn.style.textAlign = "center";
        btn.style.lineHeight = "13.33vw";
        btn.style.fontSize = "4.53vw";
        btn.style.color = "#333333";
        btn.style.boxSizing = "border-box";
        btn.innerHTML = text;
        btn.addEventListener("click", listener);
        mobileBtn.appendChild(btn);
    }
    // document.getElementsByClassName("endExam")[0].style.width = "33%";
    // 删除 mobileBtn mobileDispaly 中的所有元素
    mobileBtn.innerHTML = "";
    // cardShowBtn
    var cardShowBtn = addButton("答题卡", function() {$("#qinfo").show();});
    var endExam = addButton("交卷", function() {if(!Exam.ConnecState){MessageBox.Show(Js_MsInfo("n7","Examing"),"交卷确认",1);return}MessageBox.Show(Js_MsInfo("n11","Examing"),"交卷确认（已跳过答题数量计算）",3,MessageBox.Icon.Question,function(result){if(result==1){_examing.IsSubOrChange=true;_examing.suspend()}})});
    var button = addButton("一键答题", function(){
      for (let i = 0; i < 104; i++) {
        randomAnswer();
      }
    });
    handTips.addEventListener("click", function() {randomAnswer();})
    console.log("bypass: 注入成功!");
}



// 注入悬浮球
function inject_floating_ball(){
    // 创建一个新的div元素
    const div = document.createElement("div");
    // 设置新的div的id为'ballId'
    div.id = "ballId";
    // 设置新的div的内容
    div.textContent = "注入";
    // 使用.style.xxxx = "yyyy"; 设置样式
    div.style.background = 'rgb(19, 167, 19)';
    div.style.color = 'white';
    div.style.width = '50px';
    div.style.textAlign = 'center';
    div.style.height = '50px';
    div.style.lineHeight = '50px';
    div.style.borderRadius = '50%';
    div.style.boxShadow = '5px 5px 40px rgba(0, 0, 0, 0.5)';
    div.style.transition = 'all 0.08s';
    div.style.userSelect = 'none';
    div.style.webkitUserSelect = 'none'; /* Safari */
    div.style.mozUserSelect = 'none'; /* Firefox */
    div.style.msUserSelect = 'none'; /* IE10+/Edge */
    div.style.position = 'absolute'; // 需要绝对定位才能使用top和left
    div.style.top = '50%';
    div.style.left = '50%';
    div.style.position = 'absolute'
    div.style.transform = 'translate3d(-50%, -50%, 0)';
    document.body.appendChild(div);
    var startEvt, moveEvt, endEvt
    // 判断是否支持触摸事件
    if ('ontouchstart' in window) {
        startEvt = 'touchstart'
        moveEvt = 'touchmove'
        endEvt = 'touchend'
    } else {
        startEvt = 'mousedown'
        moveEvt = 'mousemove'
        endEvt = 'mouseup'
    }
    // 获取元素
    // 标记是拖曳还是点击
    var isClick = true
    var disX, disY, left, top, starX, starY
  
    div.addEventListener(startEvt, function (e) {
        // 阻止页面的滚动，缩放
        e.preventDefault()
        // 兼容IE浏览器
        var e = e || window.event
        isClick = true
        // 手指按下时的坐标
        starX = e.touches ? e.touches[0].clientX : e.clientX
        starY = e.touches ? e.touches[0].clientY : e.clientY
        // 手指相对于拖动元素左上角的位置
        disX = starX - div.offsetLeft
        disY = starY - div.offsetTop
        // 按下之后才监听后续事件
        document.addEventListener(moveEvt, moveFun)
        document.addEventListener(endEvt, endFun)
    })
  
    function moveFun(e) {
        // 兼容IE浏览器
        var e = e || window.event
        // 防止触摸不灵敏，拖动距离大于20像素就认为不是点击，小于20就认为是点击跳转
        if (
          Math.abs(starX - (e.touches ? e.touches[0].clientX : e.clientX)) > 20 ||
          Math.abs(starY - (e.touches ? e.touches[0].clientY : e.clientY)) > 20
        ) {
          isClick = false
        }
        left = (e.touches ? e.touches[0].clientX : e.clientX) - disX
        top = (e.touches ? e.touches[0].clientY : e.clientY) - disY
        // 限制拖拽的X范围，不能拖出屏幕
        if (left < 0) {
          left = 0
        } else if (left > document.documentElement.clientWidth - div.offsetWidth) {
          left = document.documentElement.clientWidth - div.offsetWidth
        }
        // 限制拖拽的Y范围，不能拖出屏幕
        if (top < 0) {
          top = 0
        } else if (top > document.documentElement.clientHeight - div.offsetHeight) {
          top = document.documentElement.clientHeight - div.offsetHeight
        }
        div.style.left = left + 'px'
        div.style.top = top + 'px'
    }
  
    function endFun(e) {
        document.removeEventListener(moveEvt, moveFun)
        document.removeEventListener(endEvt, endFun)
        if (isClick && !did) { // 点击
            inject_bypass()
            swal({
                title: "注入成功！😋",
                icon: "success",
            });
            did=true
        }
    }
}

did=false
// 创建script标签并设置属性
var script = document.createElement('script');
script.src = "https://unpkg.com/sweetalert/dist/sweetalert.min.js";
script.onload = function(){
  inject_floating_ball()
}
document.head.appendChild(script);
inject_bypass()




