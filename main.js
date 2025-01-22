// ==UserScript==
// @name         bypass 普测练习
// @namespace    http://tampermonkey.net/
// @version      2025-01-22
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

// 判断是否为手机, 为手机则添加第三个按钮
// if (isMobile()) {
// 尝试获取手机界面控件
var mobileBtn = document.getElementsByClassName("mobileBtn mobileDispaly")[0];
if (mobileBtn) {
    // 根据 class 获取控件
    document.getElementsByClassName("cardShowBtn")[0].style.width = "33%";
    document.getElementsByClassName("endExam")[0].style.width = "33%";
    // 删除 mobileBtn mobileDispaly 中的所有元素
    mobileBtn.innerHTML = "";
    // cardShowBtn
    var cardShowBtn = document.createElement("div");
    cardShowBtn.style.display = "block";
    cardShowBtn.style.backgroundColor = "#9bc710";
    cardShowBtn.style.width = "33%";
    cardShowBtn.style.height = "13.33vw";
    cardShowBtn.style.textAlign = "center";
    cardShowBtn.style.lineHeight = "13.33vw";
    cardShowBtn.style.fontSize = "4.53vw";
    cardShowBtn.style.color = "#333333";
    cardShowBtn.style.boxSizing = "border-box";
    cardShowBtn.innerHTML = "答题卡";
    cardShowBtn.addEventListener("click", function () {
        $("#qinfo").show();
    });
    mobileBtn.appendChild(cardShowBtn);
    // endExam
    var endExam = document.createElement("div");
    endExam.style.display = "block";
    endExam.style.backgroundColor = "#9bc710";
    endExam.style.width = "33%";
    endExam.style.height = "13.33vw";
    endExam.style.textAlign = "center";
    endExam.style.lineHeight = "13.33vw";
    endExam.style.fontSize = "4.53vw";
    endExam.style.color = "#333333";
    endExam.style.boxSizing = "border-box";
    endExam.innerHTML = "交卷";
    endExam.addEventListener("click", function () {
        if (!Exam.ConnecState) {
            MessageBox.Show(Js_MsInfo("n7", "Examing"), "交卷确认", 1);
            return;
        }
        Question.FlushAnswer();
        //待查的题目
        var dolaters = $("Question[DoLater=1]", Exam.AnswerInfo);
        var uqlist = [];
        $("Question", Exam.PaperInfo.PaperContent).each(function (index, el) {
            var strStuAnswer = Question.getAnswer($(el));
            if (strStuAnswer.trim() == "") {
                uqlist.push($(el));
            }
        });
        var uts = $("QuestionType", Exam.PaperInfo.PaperContent);
        var str = "目前还有：\r\n";
        if (dolaters.length) {
            str += String.format("{0}题标记为待查状态\r\n", dolaters.length);
        }
        if (Exam.ShowResultByKen) {
            uts.each(function (index, el) {
                var count = 0;
                for (var m = 0; m < uqlist.length; m++) {
                    var uq = uqlist[m];
                    if (uq.attr("Tid") == $(el).attr("ID")) {
                        count++;
                    }
                }
                if (count) {
                    str += String.format("[{0}]，{1}题未做\r\n", $(el).attr("Title"), count);
                }
            });
        } else {
            var count = 0;
            uts.each(function (index, el) {
                for (var m = 0; m < uqlist.length; m++) {
                    var uq = uqlist[m];
                    if (uq.attr("Tid") == $(el).attr("ID")) {
                        count++;
                    }
                }
            });
            if (count) {
                str += String.format("{0}题未做\r\n", count);
            }
        }
        if (str.length > 10) {
            var newstr = "";
            if (str.indexOf("德育") > 0) newstr = "[德育]";
            if (str.indexOf("语文") > 0) {
                if (newstr.length > 0) {
                    newstr += "、[语文]";
                } else {
                    newstr += "[语文]";
                }
            }
            if (str.indexOf("数学") > 0) {
                if (newstr.length > 0) {
                    newstr += "、[数学]";
                } else {
                    newstr += "[数学]";
                }
            }
            if (str.indexOf("英语") > 0) {
                if (newstr.length > 0) {
                    newstr += "、[英语]";
                } else {
                    newstr += "[英语]";
                }
            }
            if (str.indexOf("计算机应用基础") > 0) {
                if (newstr.length > 0) {
                    newstr += "、[计算机应用基础]";
                } else {
                    newstr += "[计算机应用基础]";
                }
            }

            if (str.indexOf("标记为待查状态") > 0) {
                if (newstr.length > 0) {
                    newstr += "有题未答，";
                    newstr += String.format("{0}道题目标记为待确认", dolaters.length);
                } else {
                    newstr += String.format("{0}道题目标记为待确认", dolaters.length);
                }
                newstr += "，是否确定交卷？";
            } else {
                newstr += "有题未答，是否确定交卷？";
            }

            //MessageBox.Show(String.format(Js_MsInfo("n10", "Examing"), str), "待查确认", 3, MessageBox.Icon.Question, function(result) {
            MessageBox.Show(newstr, "待查确认(写都没写完, 配交卷吗母狗？😋)", 3, MessageBox.Icon.Question, function (result) {
                if (result == 1) {
                    MessageBox.Show(Js_MsInfo("n11", "Examing"), "交卷确认", 3, MessageBox.Icon.Question, function (result) {
                        if (result == 1) {
                            _examing.IsSubOrChange = true;
                            _examing.suspend();
                        }
                    });
                }
            });
        } else {
            MessageBox.Show(Js_MsInfo("n11", "Examing"), "交卷确认(终于写完了捏😋)", 3, MessageBox.Icon.Question, function (result) {
                if (result == 1) {
                    _examing.IsSubOrChange = true;
                    _examing.suspend();
                }
            });
        }
    });
    mobileBtn.appendChild(endExam);
    // 创建个跟上述 CSS 一样的控件
    var button = document.createElement("div");
    button.style.display = "block";
    button.style.backgroundColor = "#9bc710";
    button.style.width = "33%";
    button.style.height = "13.33vw";
    button.style.textAlign = "center";
    button.style.lineHeight = "13.33vw";
    button.style.fontSize = "4.53vw";
    button.style.color = "#333333";
    button.style.boxSizing = "border-box";
    button.innerHTML = "随机答题";
    button.addEventListener("click", function () {
        randomAnswer();
    });
    mobileBtn.appendChild(button);
}
// }
function inject_bypass() {
    document.addEventListener("keypress", handleKeyPress);
    console.log("bypass: 注入成功!");
}
