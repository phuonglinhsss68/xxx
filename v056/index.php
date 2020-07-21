<?php 
  session_start();
  $_SESSION['TOKEN'] = isset($_GET['token']) ? $_GET['token'] : null;
  $_SESSION['USER_ID'] = isset($_GET['user_id']) ? $_GET['user_id'] : null;
  include 'auth.php';
?>

<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">

  <title>Tx79.Mobi</title>
  <meta name="viewport"
    content="width=device-width,user-scalable=no,initial-scale=1, minimum-scale=1,maximum-scale=1" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="full-screen" content="yes" />
  <meta name="screen-orientation" content="portrait" />
  <meta name="x5-fullscreen" content="true" />
  <meta name="360-fullscreen" content="true" />

  <link rel="icon" href="https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v056/res/favicon.png">
  <meta name="renderer" content="webkit" />
  <meta name="force-rendering" content="webkit" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v056/style-desktop.59467.css" />
  <script>
    localStorage.setItem("mkt_code", "<?php echo isset($_GET['mkt_code']) ? $_GET['mkt_code'] : ''; ?>");
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
    if (isAndroid) {
      var r = confirm("Tx79.Mobi đã có phiên bản App Mobile. Hãy tải bản App Tx79.Mobi để chơi mượt hơn và trải nghiệm đầy đủ tính năng");
      if (r == true) {
        window.location = window.location.origin + '/download/';
      }
    }

    var standalone = window.navigator.standalone,
      userAgent = window.navigator.userAgent.toLowerCase(),
      safari = /safari/.test(userAgent),
      ios = /iphone|ipod|ipad/.test(userAgent);
    if (ios) {
      window.location = window.location.origin + '/download/';
      // window.location =  window.location + '/web-mobile/';
    }

  </script>
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-150095483-1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'UA-150095483-1');
  </script>
  <!-- Facebook Pixel Code -->
  <script>
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ?
          n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s)
    }(window, document, 'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '645916445790150'); // 1512469202245684
    fbq('track', 'PageView');
  </script>
  <noscript>
    <img height="1" width="1" src="https://www.facebook.com/tr?id=645916445790150&ev=PageView&noscript=1" />
  </noscript>
  <!-- End Facebook Pixel Code -->
</head>

<body>
  <div id="GameDiv" style="width:1680px; height: 945px;">
    <canvas id="GameCanvas" width="1680" height="945"></canvas>
    <div id="splash">
      <div class="progress-bar stripes">
        <span style="width: 0%">
          <div class="progress-coin"></div>
        </span>
      </div>
    </div>
  </div>
  <style>
    .fb-livechat,
    .fb-widget {
      display: none
    }

    .ctrlq.fb-button,
    .ctrlq.fb-close {
      position: fixed;
      right: 24px;
      cursor: pointer
    }

    .ctrlq.fb-button {
      z-index: 999;
      background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDEyOCAxMjgiIGhlaWdodD0iMTI4cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxMjggMTI4IiB3aWR0aD0iMTI4cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxyZWN0IGZpbGw9IiMwMDg0RkYiIGhlaWdodD0iMTI4IiB3aWR0aD0iMTI4Ii8+PC9nPjxwYXRoIGQ9Ik02NCwxNy41MzFjLTI1LjQwNSwwLTQ2LDE5LjI1OS00Niw0My4wMTVjMCwxMy41MTUsNi42NjUsMjUuNTc0LDE3LjA4OSwzMy40NnYxNi40NjIgIGwxNS42OTgtOC43MDdjNC4xODYsMS4xNzEsOC42MjEsMS44LDEzLjIxMywxLjhjMjUuNDA1LDAsNDYtMTkuMjU4LDQ2LTQzLjAxNUMxMTAsMzYuNzksODkuNDA1LDE3LjUzMSw2NCwxNy41MzF6IE02OC44NDUsNzUuMjE0ICBMNTYuOTQ3LDYyLjg1NUwzNC4wMzUsNzUuNTI0bDI1LjEyLTI2LjY1N2wxMS44OTgsMTIuMzU5bDIyLjkxLTEyLjY3TDY4Ljg0NSw3NS4yMTR6IiBmaWxsPSIjRkZGRkZGIiBpZD0iQnViYmxlX1NoYXBlIi8+PC9zdmc+) center no-repeat #0084ff;
      width: 67px;
      height: 67px;
      text-align: center;
      bottom: 110px;
      /* bottom: 30px; */
      right: 37px;
      border: 0;
      outline: 0;
      border-radius: 60px;
      -webkit-border-radius: 60px;
      -moz-border-radius: 60px;
      -ms-border-radius: 60px;
      -o-border-radius: 60px;
      box-shadow: 0 1px 6px rgba(0, 0, 0, .06), 0 2px 32px rgba(0, 0, 0, .16);
      -webkit-transition: box-shadow .2s ease;
      background-size: 80%;
      transition: all .2s ease-in-out
    }

    .ctrlq.fb-button:focus,
    .ctrlq.fb-button:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, .09), 0 4px 40px rgba(0, 0, 0, .24)
    }

    .fb-widget {
      background: #fff;
      z-index: 2147483641;
      position: fixed;
      width: 360px;
      height: 435px;
      overflow: hidden;
      opacity: 0;
      bottom: 0;
      right: 24px;
      border-radius: 6px;
      -o-border-radius: 6px;
      -webkit-border-radius: 6px;
      box-shadow: 0 5px 40px rgba(0, 0, 0, .16);
      -webkit-box-shadow: 0 5px 40px rgba(0, 0, 0, .16);
      -moz-box-shadow: 0 5px 40px rgba(0, 0, 0, .16);
      -o-box-shadow: 0 5px 40px rgba(0, 0, 0, .16)
    }

    .fb-credit {
      text-align: center;
      margin-top: 8px
    }

    .fb-credit a {
      transition: none;
      color: #bec2c9;
      font-family: Helvetica, Arial, sans-serif;
      font-size: 12px;
      text-decoration: none;
      border: 0;
      font-weight: 400
    }

    .ctrlq.fb-overlay {
      z-index: 0;
      position: fixed;
      height: 100vh;
      width: 100vw;
      -webkit-transition: opacity .4s, visibility .4s;
      transition: opacity .4s, visibility .4s;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, .05);
      display: none
    }

    .ctrlq.fb-close {
      z-index: 4;
      padding: 0 6px;
      background: #365899;
      font-weight: 700;
      font-size: 11px;
      color: #fff;
      margin: 8px;
      border-radius: 3px
    }

    .ctrlq.fb-close::after {
      content: "X";
      font-family: sans-serif
    }

    .bubble {
      width: 20px;
      height: 20px;
      background: #c00;
      color: #fff;
      position: absolute;
      z-index: 999999999;
      text-align: center;
      vertical-align: middle;
      top: -2px;
      left: -5px;
      border-radius: 50%;
    }

    .bubble-msg {
      width: 80px;
      left: -100px;
      top: 5px;
      position: relative;
      background: rgba(59, 89, 152, .8);
      color: #fff;
      padding: 5px 8px;
      border-radius: 8px;
      text-align: center;
      font-size: 13px;
    }
  </style>
  <div class="fb-livechat">
    <div class="ctrlq fb-overlay"></div>
    <div class="fb-widget">
      <div class="ctrlq fb-close"></div>
      <div class="fb-page" data-href="https://www.facebook.com/tx79.fanpage/" data-tabs="messages" data-width="360"
        data-height="400" data-small-header="true" data-hide-cover="true" data-show-facepile="false"> </div>
      <div class="fb-credit">
        <a href="http://Tx79.Mobi/" target="_blank">Powered by Tx79.Mobi</a>
      </div>
      <div id="fb-root"></div>
    </div>
    <a href="https://m.me/tx79.fanpage/" title="Gửi tin nhắn cho chúng tôi qua Facebook" class="ctrlq fb-button">
      <!-- <div class="bubble">1</div> -->
      <!-- <div class="bubble-msg">Hỗ trợ?</div> -->
    </a>
  </div>
  <script>

  </script>
  <script src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
  <script>$(document).ready(function () { function detectmob() { if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) { return true; } else { return false; } } var t = { delay: 125, overlay: $(".fb-overlay"), widget: $(".fb-widget"), button: $(".fb-button") }; setTimeout(function () { $("div.fb-livechat").fadeIn() }, 8 * t.delay); if (!detectmob()) { $(".ctrlq").on("click", function (e) { e.preventDefault(), t.overlay.is(":visible") ? (t.overlay.fadeOut(t.delay), t.widget.stop().animate({ bottom: 0, opacity: 0 }, 2 * t.delay, function () { $(this).hide("slow"), t.button.show() })) : t.button.fadeOut("medium", function () { t.widget.stop().show().animate({ bottom: "30px", opacity: 1 }, 2 * t.delay), t.overlay.fadeIn(t.delay) }) }) } });</script>
  <!-- Telegram -->
  <!-- <iframe id="webroundbuttonwidget2" file="webroundbuttonwidget"
    src="https://telegrambutton.com/webroundbuttonwidget.php?chat_id=cskhkingtop&showchatid=true&showmembercount=true&showmembercount=true&color=&pulse=true&textcolor=black&shadowval=z-depth-3&textval=join channel"
    border="1" style="border:20px;height: 100px;width: 100px;z-index:998;position:fixed;bottom:80px;right:0;"></iframe> -->

  <!-- Subiz -->
  <script> (function (s, u, b, i, z) { u[i] = u[i] || function () { u[i].t = +new Date(); (u[i].q = u[i].q || []).push(arguments); }; z = s.createElement('script'); var zz = s.getElementsByTagName('script')[0]; z.async = 1; z.src = b; z.id = 'subiz-script'; zz.parentNode.insertBefore(z, zz); })(document, window, 'https://widgetv4.subiz.com/static/js/app.js', 'subiz'); subiz('setAccount', 'acqnlouyigipweqihdxt'); </script>
  <!-- End Subiz -->

  <script src="https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v056/src/settings.f7775.js" charset="utf-8"></script>
  <script src="https://cdn.jsdelivr.net/gh/phuonglinhsss68/xxx@master/v056/main.f083e.js" charset="utf-8"></script>
</body>

</html>