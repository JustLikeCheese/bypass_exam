// ==UserScript==
// @name         bypass 普测练习
// @namespace    http://tampermonkey.net/
// @version      2025-6-6
// @description  bypass 普测练习
// @author       Cheese
// @match        https://stu.hunanpuce.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

// 登录页面地址
// https://stu.hunanpuce.com/Default.aspx
// 主页面地址
// https://stu.hunanpuce.com/main.aspx

function loadScript(url, callback) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.onload = function () {
    if (callback) {
      callback();
    }
  };
  document.head.appendChild(script);
}

function loadCSS(url, callback) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  link.onload = function () {
    if (callback) {
      callback();
    }
  };
  document.head.appendChild(link);
}

function loadLibrary(url1, url2, callback) {
  loadCSS(url1, function () {
    loadScript(url2, callback);
  });
}



// 绕过验证码
function bypassCaptcha() {
  $("#pVerifyCode").hide();
  $("#lgbtok").off("click");
  $("#lgbtok").on("click", function () {
    // 清空所有错误提示
    $("#tagVerifyCode").html("");
    $("#tagStudentNumber").html("");
    $("#tagPwd").html("");

    // 检查验证码输入是否为空
    // if ($.trim($("#txtVerifyCode").val()) == "") {
    //   $("#tagVerifyCode").html("图形验证码不能为空！"); // 显示错误提示
    //   $("#txtVerifyCode").focus(); // 聚焦输入框
    //   return; // 中断执行
    // }

    // 发送获取验证码请求
    MessageCenter.PushMsg(Message.SM_GetVerifyCode, null, null, function (data, obj, text) {
      // 原始验证码验证逻辑
      // if (obj.content[0].Text.toLowerCase() != $("#txtVerifyCode").val().toLowerCase()) {
      //   $("#tagVerifyCode").html("图形验证码不正确，请确认输入是否正确！");
      //   $("#txtVerifyCode").focus();
      //   LoginDialog.GetVerifyCode();
      //   return;
      // }
      // else {
      // 发送检查是否可以登录的请求
      MessageCenter.PushMsg(Message.SM_CanLogin, null, null, function (data, obj, text) {
        // 检查登录许可状态
        if (obj.content[0].Text.toBoolean()) {
          var strParams = ""; // 初始化参数字符串

          // 验证手机号输入
          if ($("#tbStudentNumber").val() == "") {
            $("#tagStudentNumber").html("手机号码不能为空！");
            $("#tbStudentNumber").focus();
            return;
          } else if (!String.ValidateFunc.Validate($("#tbStudentNumber").val(), String.ValidateFunc.MPhone)) {
            $("#tagStudentNumber").html("手机号码的格式有误，请确认输入是否正确！");
            $("#tbStudentNumber").focus();
            return;
          } else {
            strParams += $("#tbStudentNumber").val() + ","; // 拼接手机号参数
          }

          // 验证密码输入
          if ($.trim($("#tbPwd").val()) == "") {
            $("#tagPwd").html("密码不能为空！");
            $("#tbPwd").focus();
            return;
          } else {
            strParams += $("#tbPwd").val() + ","; // 拼接密码参数
          }

          // 处理参数字符串（去除末尾逗号）
          strParams = strParams.slice(0, strParams.length - 1);
          var aryParams = strParams.split(","); // 转换为数组格式

          // 发送获取学生信息请求
          MessageCenter.PushMsg(Message.SM_GetStuInfo, Exam.Client.getMAC(), aryParams, Exam.cb_GetStu);
        } else {
          // 显示禁止登录提示
          MessageBox.Show(Js_MsInfo("n30", "ExamBefore"), "不允许登录", 1, MessageBox.Icon.Infomation);
        }
      });
    });
  });
}

// 移除考前验证
function bypassExamBefore() {
  $("#btStartExam").off("click");
  $("#btStartExam").click(function () {
    // 发送开始考试许可检查请求
    MessageCenter.PushMsg(Message.SM_CanStartExam, Student.StudentInfoID(), [Student.SubjectCode()], function (data, obj, text) {
      // 处理服务器返回的考试许可状态
      if (parseInt(obj.EnableStartExam[0].Text) == 1 || parseInt(obj.EnableStartExam[0].Text) == 3) {
        // 清理计时器准备开始考试
        if (Exam.EnabledServerTime) {
          window.clearInterval(x_Time);
          window.clearTimeout(x_Pass);
        }
        if (Exam.SynchronousExam) {
          window.clearInterval(x_t);
        }
        // 延迟500毫秒执行开始考试操作
        // window.setTimeout("System.StartExam()", 500);

      }
      else {
        // 处理不同步考试的情况
        if (Exam.SynchronousExam) {
          // 禁用开始按钮并显示等待提示
          $("#btStartExam").attr("disabled", true);
          Status.ShowInfo("正在等待服务器允许开始考试，请稍候...");
        } else {
          // 根据状态码显示不同提示信息
          if (parseInt(obj.EnableStartExam[0].Text) == 0) {
            MessageBox.Show(Js_MsInfo("n23", "ExamBefore"), "开始考试", 1, MessageBox.Icon.Infomation);
          }
          else if (parseInt(obj.EnableStartExam[0].Text) == 2) {
            MessageBox.Show(Js_MsInfo("n24", "ExamBefore"), "开始考试", 1, MessageBox.Icon.Infomation);
          }
        }
      }
    });
  });
}



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
  if (!mobileBtn) { return; }
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
  var cardShowBtn = addButton("答题卡", function () { $("#qinfo").show(); });
  var endExam = addButton("交卷", function () { if (!Exam.ConnecState) { MessageBox.Show(Js_MsInfo("n7", "Examing"), "交卷确认", 1); return } MessageBox.Show(Js_MsInfo("n11", "Examing"), "交卷确认（已跳过答题数量计算）", 3, MessageBox.Icon.Question, function (result) { if (result == 1) { _examing.IsSubOrChange = true; _examing.suspend() } }) });
  var button = addButton("一键答题", function () {
    for (let i = 0; i < 104; i++) {
      randomAnswer();
    }
  });
  handTips.addEventListener("click", function () { randomAnswer(); })
  console.log("bypass: 注入成功!");
}

// Usage
loadLibrary('https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css', 'https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js', function () {
  // 初始化 Notyf 库
  const notyf = new Notyf({
    position: {
      x: 'right',
      y: 'top',
    }
  });
  notyf.success('普测脚本已注入!');
  // 判断是否为登录页面
  if (window.location.href === "https://stu.hunanpuce.com/Default.aspx") {
    // 绑定登录按钮点击事件（绕过图形验证码）
    notyf.success('已去除 Captcha 验证码')
    bypassCaptcha();
    return;
  } else if (window.location.href === "https://stu.hunanpuce.com/main.aspx") {
    bypassExamBefore();
    notyf.success('已优化考试加载速度')
    if (isMobile()) {
      inject_bypass();
    }
  }
});

