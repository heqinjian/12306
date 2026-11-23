/* ==========================================================================
   中国铁路12306网站 - 首页交互
   ========================================================================== */
(function () {
  "use strict";

  var D = window.DATA || {};
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var DAY = 86400000;
  var PRESALE_DAYS = 15;          // 预售期（含当日）
  var HISTORY_KEY = "k12306_search_history";
  var today = startOfDay(new Date());
  var maxDate = new Date(today.getTime() + (PRESALE_DAYS - 1) * DAY);

  function startOfDay(d) { var x = new Date(d.getTime()); x.setHours(0, 0, 0, 0); return x; }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function fmtDate(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function inRange(d) { return d >= today && d <= maxDate; }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------- 轻提示 ---------- */
  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 1800);
  }

  /* ==========================================================================
     渲染：头部菜单 / 主导航
     ========================================================================== */
  function renderHeaderMenu() {
    var ul = $("#topMenu");
    if (!ul) return;
    ul.innerHTML = (D.headerMenu || []).map(function (m) {
      if (m.line) return '<li class="menu-item menu-line">|</li>';
      if (m.list) {
        var lis = m.list.map(function (t) {
          if (t === "-") return '<li class="nav-line"></li>';
          var txt = typeof t === "object" ? t.text : t;
          var href = typeof t === "object" && t.href ? t.href : "javascript:;";
          return '<li><a href="' + href + '">' + esc(txt) + "</a></li>";
        }).join("");
        return '<li class="menu-item menu-nav"><a href="javascript:;" class="menu-nav-hd">' + esc(m.text) +
          (m.caret ? '<i class="caret"></i>' : "") + '</a><ul class="menu-nav-bd">' + lis + "</ul></li>";
      }
      return '<li class="menu-item"><a href="' + (m.href || "javascript:;") + '" class="menu-nav-hd">' + esc(m.text) + "</a></li>";
    }).join("");
  }

  function columnWidth(items) {
    var w = 190;
    items.forEach(function (t) {
      var need = t.length <= 4 ? 190 : (t.length <= 8 ? 230 : 330);
      if (need > w) w = need;
    });
    return w + 10;
  }

  function renderNav() {
    var nav = $("#mainNav");
    if (!nav) return;
    nav.innerHTML = (D.nav || []).map(function (item) {
      var cls = "nav-item" + (item.active ? " active" : "");
      var hd = '<a href="' + (item.href || "javascript:;") + '" class="nav-hd">' + esc(item.name) +
        (item.cols ? '<i class="icon-down"></i>' : "") + "</a>";
      if (!item.cols) return '<li class="' + cls + '">' + hd + "</li>";

      var cols = [];
      item.cols.forEach(function (col) {
        var groups = [col.items];
        if (col.items.length > 6) {
          var half = Math.ceil(col.items.length / 2);
          groups = [col.items.slice(0, half), col.items.slice(half)];
        }
        groups.forEach(function (list, gi) {
          var tit = gi === 0 ? col.tit : "";
          var lis = list.map(function (t) {
            var lighter = col.lighter && col.lighter.indexOf(t) >= 0;
            return '<li' + (lighter ? ' class="txt-lighter"' : "") + '><a href="javascript:;">' + esc(t) + "</a></li>";
          }).join("");
          cols.push('<div class="nav-bd-item" style="width:' + columnWidth(list) + 'px">' +
            (tit ? '<h3 class="nav-tit">' + esc(tit) + "</h3>" : '<h3 class="nav-tit border-none">&nbsp;</h3>') +
            '<ul class="nav-con">' + lis + "</ul></div>");
        });
      });
      return '<li class="' + cls + '">' + hd + '<div class="nav-bd">' + cols.join("") + "</div></li>";
    }).join("");
  }

  /* ==========================================================================
     渲染：轮播 / 便捷服务 / 公告 / 页脚
     ========================================================================== */
  function renderSlides() {
    var map = $("#sowingMap"), dots = $("#slideDots");
    if (!map) return;
    map.innerHTML = (D.slides || []).map(function (s, i) {
      return '<li class="slide' + (i === 0 ? " on" : "") + '" style="background:url(\'' +
        esc(s.img) + '\') center center no-repeat;background-size:cover;" title="' + esc(s.alt) + '"></li>';
    }).join("");
    if (dots) {
      dots.innerHTML = (D.slides || []).map(function (s, i) {
        return '<li class="' + (i === 0 ? "on" : "") + '">' + (i + 1) + "</li>";
      }).join("");
    }
  }

  function renderServices() {
    var ul = $("#serviceList");
    if (!ul) return;
    ul.innerHTML = (D.services || []).map(function (s) {
      return '<li><a href="javascript:;"><i class="service-icon"><svg class="icon"><use href="#' + s.icon +
        '"></use></svg></i><div>' + esc(s.name) + "</div></a></li>";
    }).join("");
  }

  function renderNews() {
    var list = $("#newsList");
    if (list) {
      list.innerHTML = (D.news || []).map(function (n) {
        var t = n.title || n, d = n.date || "";
        return '<li><a href="javascript:;" title="' + esc(t) + '">' + esc(t) + "</a>" +
          (d ? '<span class="news-time">' + esc(d) + "</span>" : "") + "</li>";
      }).join("");
    }
    var faq = $("#faqList");
    if (faq) {
      faq.innerHTML = (D.faq || []).map(function (t) {
        return '<li><a href="javascript:;" class="news-tit" title="' + esc(t) + '">' + esc(t) + "</a></li>";
      }).join("");
    }
    var len = $("#discreditLeft"), rin = $("#discreditRight");
    if (len) len.innerHTML = (D.discredit.left || []).map(function (t) { return '<a href="javascript:;">' + esc(t) + "</a>"; }).join("");
    if (rin) rin.innerHTML = (D.discredit.right || []).map(function (t) { return '<a href="javascript:;">' + esc(t) + "</a>"; }).join("");
  }

  function renderTravel() {
    var ul = $("#travelList");
    if (!ul) return;
    ul.innerHTML = (D.travels || []).map(function (v) {
      return '<li><a href="javascript:;" title="' + esc(v.title) + '">' +
        '<img src="' + esc(v.img) + '" alt="' + esc(v.title) + '">' +
        "</a></li>";
    }).join("");
  }

  /* ---------- 伪二维码（用于页脚与 APP 下载示意） ---------- */
  function hashSeed(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rngFactory(seed) {
    var s = seed || 1;
    return function () {
      s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }
  function qrMarkup(name) {
    var n = 29, rnd = rngFactory(hashSeed(name)), out = [];
    function inFinder(x, y) { return (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7); }
    function finderDark(x, y) {
      var ox, oy;
      if (x < 7 && y < 7) { ox = x; oy = y; }
      else if (x >= n - 7 && y < 7) { ox = x - (n - 7); oy = y; }
      else if (x < 7 && y >= n - 7) { ox = x; oy = y - (n - 7); }
      else return false;
      var d = Math.max(Math.abs(ox - 3), Math.abs(oy - 3));
      return d === 3 || d <= 1;
    }
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        var dark;
        if (inFinder(x, y)) dark = finderDark(x, y);
        else if (x === 6 || y === 6) dark = (x + y) % 2 === 0;
        else dark = rnd() > 0.48;
        if (dark) out.push('<rect x="' + x + '" y="' + y + '" width="1" height="1"/>');
      }
    }
    return '<rect width="' + n + '" height="' + n + '" fill="#fff"/><g fill="#2f2f2f">' + out.join("") + "</g>";
  }
  function mountQr() {
    $$(".qr").forEach(function (svg) {
      svg.innerHTML = qrMarkup(svg.getAttribute("data-qr") || "12306");
    });
  }

  function renderFooter() {
    var links = $("#footLinks");
    if (links) {
      links.innerHTML = (D.footLinks || []).map(function (t) {
        return '<li><a href="javascript:;"><span class="link-logo">' + t + "</span></a></li>";
      }).join("");
    }
    var code = $("#footCode");
    if (code) {
      code.innerHTML = (D.footCode || []).map(function (c) {
        return '<li style="width:' + c.width + 'px"><h2 class="foot-con-tit">' + esc(c.tit) + "</h2>" +
          '<div class="code-pic"><svg class="qr" data-qr="' + c.qr + '" viewBox="0 0 29 29"></svg>' +
          (c.brand ? '<svg class="code-brand"><use href="#' + c.brand + '"></use></svg>' : "") +
          (c.tips ? '<div class="code-tips">' + esc(c.tips) + "</div>" : "") +
          "</div></li>";
      }).join("");
    }
  }

  /* ==========================================================================
     日期选择器
     ========================================================================== */
  var picker = null, pickerInput = null, pickerMonth = null;

  function monthKey(d) { return d.getFullYear() * 100 + d.getMonth(); }

  function ensurePicker() {
    if (picker) return picker;
    picker = document.createElement("div");
    picker.className = "date-picker";
    picker.innerHTML =
      '<div class="dp-hd"><span class="dp-nav dp-prev">&lsaquo;</span><span class="dp-title"></span><span class="dp-nav dp-next">&rsaquo;</span></div>' +
      '<div class="dp-week"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>' +
      '<div class="dp-days"></div>';
    document.body.appendChild(picker);
    picker.addEventListener("mousedown", function (e) { e.preventDefault(); });
    picker.addEventListener("click", onPickerClick);
    return picker;
  }

  function renderPicker() {
    var y = pickerMonth.getFullYear(), m = pickerMonth.getMonth();
    var firstWeekday = new Date(y, m, 1).getDay();
    var dayCount = new Date(y, m + 1, 0).getDate();
    picker.querySelector(".dp-title").textContent = y + "年" + (m + 1) + "月";
    picker.querySelector(".dp-prev").classList.toggle("disabled", monthKey(pickerMonth) <= monthKey(today));
    picker.querySelector(".dp-next").classList.toggle("disabled", monthKey(pickerMonth) >= monthKey(maxDate));

    var cur = pickerInput ? parseDate(pickerInput.value) : null;
    var html = "";
    for (var i = 0; i < firstWeekday; i++) html += '<span class="dp-day empty"></span>';
    for (var d = 1; d <= dayCount; d++) {
      var date = new Date(y, m, d);
      var cls = "dp-day";
      if (!inRange(date)) cls += " disabled";
      if (date.getTime() === today.getTime()) cls += " today";
      if (cur && date.getTime() === cur.getTime()) cls += " on";
      html += '<span class="' + cls + '" data-date="' + fmtDate(date) + '">' + d + "</span>";
    }
    picker.querySelector(".dp-days").innerHTML = html;
  }

  function onPickerClick(e) {
    var prev = e.target.closest(".dp-prev");
    var next = e.target.closest(".dp-next");
    if (prev || next) {
      var btn = prev || next;
      if (btn.classList.contains("disabled")) return;
      pickerMonth = new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() + (next ? 1 : -1), 1);
      renderPicker();
      return;
    }
    var day = e.target.closest(".dp-day");
    if (!day || day.classList.contains("disabled") || day.classList.contains("empty")) return;
    var val = day.getAttribute("data-date");
    if (!pickerInput) return;
    var target = pickerInput;
    target.value = val;
    target.setAttribute("data-value", val);
    hidePicker();
    syncRangeDates(target);
  }

  function syncRangeDates(changed) {
    if (changed.id !== "range_start" && changed.id !== "range_end") return;
    var s = $("#range_start"), en = $("#range_end");
    if (!s || !en) return;
    var ds = parseDate(s.value), de = parseDate(en.value);
    if (ds && de && de < ds) {
      if (changed.id === "range_start") { en.value = ""; }
      else { s.value = ""; }
    }
  }

  function showPicker(input) {
    ensurePicker();
    pickerInput = input;
    var base = parseDate(input.value) || today;
    pickerMonth = new Date(base.getFullYear(), base.getMonth(), 1);
    renderPicker();
    picker.style.display = "block";

    var r = input.getBoundingClientRect();
    var viewportW = document.documentElement.clientWidth;
    var left = r.left + window.pageXOffset;
    var pw = picker.offsetWidth;
    if (left - window.pageXOffset + pw > viewportW - 8) left = r.right + window.pageXOffset - pw;
    picker.style.left = Math.max(4, left) + "px";
    picker.style.top = (r.bottom + window.pageYOffset + 4) + "px";
  }

  function hidePicker() {
    if (picker) picker.style.display = "none";
    pickerInput = null;
  }

  function bindDateInput(input) {
    input.addEventListener("click", function () { showPicker(input); });
    input.addEventListener("focus", function () { showPicker(input); });
    input.addEventListener("keydown", function (e) { if (e.key === "Escape") hidePicker(); });
  }

  /* ==========================================================================
     车站联想输入
     ========================================================================== */
  function bindStation(input) {
    var wrap = input.parentNode;
    var drop = document.createElement("div");
    drop.className = "station-drop";
    wrap.appendChild(drop);
    var list = [], active = -1;

    function close() { drop.style.display = "none"; active = -1; }
    function select(st) {
      input.value = st[0];
      input.setAttribute("data-station", st[0]);
      close();
    }
    function render() {
      drop.innerHTML = list.map(function (s, i) {
        return '<li class="' + (i === active ? "on" : "") + '" data-i="' + i + '"><span>' + esc(s[0]) +
          '</span><span class="py">' + esc(s[1]) + "</span></li>";
      }).join("");
    }
    function search() {
      var q = input.value.trim().toLowerCase();
      input.removeAttribute("data-station");
      if (!q) { close(); return; }
      list = (D.stations || []).filter(function (s) {
        return s[0].indexOf(q) >= 0 || s[1].indexOf(q) === 0 || s[2].indexOf(q) === 0;
      }).slice(0, 12);
      if (!list.length) { close(); return; }
      active = -1; render(); drop.style.display = "block";
    }

    input.addEventListener("input", search);
    input.addEventListener("focus", function () { if (input.value.trim()) search(); });
    input.addEventListener("keydown", function (e) {
      if (drop.style.display !== "block") return;
      if (e.key === "ArrowDown") { e.preventDefault(); active = (active + 1) % list.length; render(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); active = (active - 1 + list.length) % list.length; render(); }
      else if (e.key === "Enter") { e.preventDefault(); select(active >= 0 ? list[active] : list[0]); }
      else if (e.key === "Escape") { close(); }
    });
    drop.addEventListener("mousedown", function (e) {
      var li = e.target.closest("li");
      if (!li) return;
      e.preventDefault();
      select(list[+li.getAttribute("data-i")]);
    });
    input.addEventListener("blur", function () { setTimeout(close, 150); });
  }

  /* ==========================================================================
     通用交互：标签切换 / 侧栏 / 复选框 / 交换
     ========================================================================== */
  function bindTabs(tabsRoot, panelsRoot) {
    if (!tabsRoot || !panelsRoot) return;
    var tabs = $$("li", tabsRoot);
    var panels = $$(".search-tab-item", panelsRoot);
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t, j) { t.classList.toggle("active", j === i); });
        panels.forEach(function (p, j) { p.classList.toggle("active", j === i); });
        hidePicker();
      });
    });
  }

  function bindSideMenu() {
    var side = $("#searchSide");
    if (!side) return;
    var main = $(".search-main");
    var panels = $$(".search-main-item", main);
    $$("li", side).forEach(function (li, i) {
      li.addEventListener("click", function () {
        $$("li", side).forEach(function (x, j) { x.classList.toggle("active", j === i); });
        panels.forEach(function (p, j) { p.classList.toggle("active", j === i); });
        hidePicker();
      });
    });
  }

  function bindSwap(btnSel, aId, bId) {
    var btn = $(btnSel), a = $(aId), b = $(bId);
    if (!btn || !a || !b) return;
    btn.addEventListener("click", function () {
      var t = a.value; a.value = b.value; b.value = t;
      var sa = a.getAttribute("data-station") || "";
      var sb = b.getAttribute("data-station") || "";
      a.setAttribute("data-station", sb);
      b.setAttribute("data-station", sa);
    });
  }

  /* ==========================================================================
     搜索历史
     ========================================================================== */
  var historyOffset = 0;

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch (e) { return []; }
  }
  function setHistory(arr) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0, 12))); } catch (e) { /* 忽略隐私模式下的写入失败 */ }
  }
  function addHistory(from, to) {
    if (!from || !to) return;
    var key = from + "-" + to;
    var list = getHistory().filter(function (x) { return x !== key; });
    list.unshift(key);
    setHistory(list);
    renderHistory();
  }
  function renderHistory() {
    var ul = $("#history_ul");
    if (!ul) return;
    var list = getHistory();
    historyOffset = 0;
    ul.style.transform = "translateX(0)";
    if (!list.length) {
      ul.innerHTML = '<li><span class="history-empty">暂无搜索历史</span></li>';
      return;
    }
    ul.innerHTML = list.map(function (x) {
      var p = x.split("-");
      return '<li><a href="javascript:;" data-from="' + esc(p[0]) + '" data-to="' + esc(p[1]) + '">' +
        esc(p[0]) + " - " + esc(p[1]) + "</a></li>";
    }).join("");
    $$("a", ul).forEach(function (a) {
      a.addEventListener("click", function () {
        $("#fromStationText").value = a.getAttribute("data-from");
        $("#toStationText").value = a.getAttribute("data-to");
        toast("已填入历史行程，请选择出发日期");
      });
    });
  }
  function initHistory() {
    var prev = $("#iconLeftHos"), next = $("#iconRightHos"), clear = $("#clearHistory"), ul = $("#history_ul");
    if (prev) prev.addEventListener("click", function () { slideHistory(120); });
    if (next) next.addEventListener("click", function () { slideHistory(-120); });
    if (clear) clear.addEventListener("click", function () {
      setHistory([]);
      renderHistory();
      toast("已删除搜索历史");
    });
    if (ul) {
      var wrap = ul.parentNode;
      wrap.addEventListener("mousewheel", function (e) { slideHistory(e.deltaY > 0 ? -120 : 120); });
    }
  }
  function slideHistory(step) {
    var ul = $("#history_ul");
    if (!ul) return;
    var wrapW = ul.parentNode.clientWidth;
    var maxOffset = Math.min(0, wrapW - ul.scrollWidth);
    historyOffset = Math.max(maxOffset, Math.min(0, historyOffset + step));
    ul.style.transform = "translateX(" + historyOffset + "px)";
  }

  /* ==========================================================================
     查询动作
     ========================================================================== */
  function requireValue(input, msg) {
    if (input && input.value.trim()) return true;
    toast(msg);
    if (input) input.focus();
    return false;
  }
  function stationValue(input) {
    if (!input) return "";
    return (input.getAttribute("data-station") || input.value).trim();
  }

  function initTicketSearch() {
    var panels = $$("#ticketPanels > .search-tab-item");
    var kinds = ["single", "round", "transfer", "refund"];
    panels.forEach(function (panel, i) {
      var btn = panel.querySelector("[data-search]");
      if (!btn) return;
      btn.addEventListener("click", function () { runTicketSearch(kinds[i], panel); });
    });
  }

  function runTicketSearch(kind, panel) {
    var stations = $$("input[data-role=station]", panel);
    var dates = $$("input[data-role=date]", panel);
    var from = stations[0], to = stations[1];

    if (kind === "refund") {
      if (!requireValue(dates[0], "请选择开始日期")) return;
      if (!requireValue(dates[1], "请选择结束日期")) return;
      var kw = $("#keyword");
      toast("正在查询 " + dates[0].value + " 至 " + dates[1].value + " 的订单" + (kw && kw.value.trim() ? "（关键字：" + kw.value.trim() + "）" : ""));
      return;
    }

    if (!requireValue(from, "请输入出发地")) return;
    if (!requireValue(to, "请输入到达地")) return;
    if (stationValue(from) === stationValue(to)) { toast("出发地与到达地不能相同"); return; }
    if (!requireValue(dates[0], "请选择乘车日期")) return;

    if (kind === "round") {
      if (!requireValue(dates[1], "请选择返程日期")) return;
      if (dates[1].value < dates[0].value) { toast("返程日期不能早于出发日期"); return; }
      addHistory(stationValue(from), stationValue(to));
      toast("正在查询 " + stationValue(from) + " ⇄ " + stationValue(to) + " " + dates[0].value + " / " + dates[1].value + " 的往返车次");
      return;
    }

    addHistory(stationValue(from), stationValue(to));
    var tip = kind === "transfer" ? " 的中转换乘方案" : " 的车次";
    toast("正在查询 " + stationValue(from) + " → " + stationValue(to) + " " + dates[0].value + tip);
  }

  function initCommonSearch() {
    var panels = $$("#commonPanels > .search-tab-item");
    var kinds = ["zwd", "jpk", "sale", "weather"];
    panels.forEach(function (panel, i) {
      var btn = panel.querySelector("[data-search]");
      if (!btn) return;
      btn.addEventListener("click", function () { runCommonSearch(kinds[i], panel); });
    });
  }

  function runCommonSearch(kind, panel) {
    if (kind === "zwd") {
      var station = panel.querySelector("#zwdStation");
      if (!requireValue(station, "请输入车站")) return;
      var train = panel.querySelector("#zwdTrain");
      toast("正在查询 " + stationValue(station) + (train.value.trim() ? " " + train.value.trim().toUpperCase() : "") + " 的正晚点信息");
    } else if (kind === "jpk") {
      var date = panel.querySelector("#jpkDate");
      var t = panel.querySelector("#jpkTrain");
      var st = panel.querySelector("#jpkStation");
      if (!requireValue(date, "请选择乘车日期")) return;
      if (!requireValue(t, "请输入车次")) return;
      if (!st.value || st.value === "请选择车站") { toast("请选择乘车站"); return; }
      toast("正在查询 " + date.value + " " + t.value.trim().toUpperCase() + " 在 " + st.value + " 的检票口");
    } else if (kind === "sale") {
      var sd = panel.querySelector("#saleDate");
      var ss = panel.querySelector("#saleStation");
      if (!requireValue(sd, "请选择起售日期")) return;
      if (!requireValue(ss, "请输入起售车站")) return;
      toast("正在查询 " + stationValue(ss) + " " + sd.value + " 的起售时间");
    } else {
      var city = panel.querySelector("#weatherCity");
      if (!requireValue(city, "请输入目的地")) return;
      toast("正在查询 " + stationValue(city) + " 的天气");
    }
  }

  function initDinnerSearch() {
    var panel = $("#dinner_sub_mun");
    if (!panel) return;
    var btn = $$("[data-search]").filter(function (b) { return b.closest(".search-main-item") && b.closest(".search-main-item").contains(panel); })[0];
    if (!btn) return;
    btn.addEventListener("click", function () {
      var date = $("#dinner_date");
      if (!requireValue(date, "请选择出发日期")) return;
      var train = panel.value.trim().toUpperCase();
      if (!train) { toast("请输入出发车次"); panel.focus(); return; }
      if (!/^[GD]/.test(train)) { toast("仅支持G、D字头的动车组列车"); panel.focus(); return; }
      toast("正在查询 " + date.value + " " + train + " 的餐饮•特产");
    });
  }

  /* ==========================================================================
     头部搜索 / 轮播 / 滚动 / 悬浮菜单
     ========================================================================== */
  function initHeaderSearch() {
    var input = $("#search-input"), down = $("#searchDown"), list = $("#searchDownList");
    if (!input || !down || !list) return;
    function render(q) {
      var tips = (D.searchTips || []).filter(function (t) { return !q || t.text.indexOf(q) >= 0; });
      if (!tips.length) { down.style.display = "none"; return; }
      list.innerHTML = tips.map(function (t) {
        return '<li data-text="' + esc(t.text) + '"><svg class="icon"><use href="#' + t.icon +
          '"></use></svg><span class="list-txt">' + esc(t.text) + "</span></li>";
      }).join("");
      down.style.display = "block";
      $$("li", list).forEach(function (li) {
        li.addEventListener("mousedown", function (e) {
          e.preventDefault();
          input.value = li.getAttribute("data-text");
          down.style.display = "none";
        });
      });
    }
    input.addEventListener("focus", function () { input.classList.add("focus"); render(input.value.trim()); });
    input.addEventListener("input", function () { render(input.value.trim()); });
    input.addEventListener("blur", function () {
      input.classList.remove("focus");
      setTimeout(function () { down.style.display = "none"; }, 160);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); $("#searchBtn").click(); }
    });
    var close = $("#searchDownClose");
    if (close) close.addEventListener("mousedown", function (e) { e.preventDefault(); down.style.display = "none"; });
    $("#searchBtn").addEventListener("click", function () {
      var q = input.value.trim();
      toast(q ? "搜索：" + q : "请输入搜索内容");
    });
  }

  var slideIndex = 0, slideTimer = null;
  function goSlide(i) {
    var slides = $$("#sowingMap > li"), dots = $$("#slideDots > li");
    if (!slides.length) return;
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach(function (s, j) { s.classList.toggle("on", j === slideIndex); });
    dots.forEach(function (d, j) { d.classList.toggle("on", j === slideIndex); });
  }
  function initCarousel() {
    $$("#slideDots > li").forEach(function (d, j) {
      d.addEventListener("click", function () { goSlide(j); restartSlide(); });
    });
    restartSlide();
  }
  function restartSlide() {
    clearInterval(slideTimer);
    slideTimer = setInterval(function () { goSlide(slideIndex + 1); }, 5000);
  }

  function initScroll() {
    var top = $("#goTop");
    if (!top) return;
    function onScroll() {
      top.classList.toggle("show", (window.pageYOffset || document.documentElement.scrollTop) > 400);
    }
    window.addEventListener("scroll", onScroll);
    onScroll();
    top.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initFixedRight() {
    var box = $("#fixedRight");
    if (!box) return;
    var close = $("#closeRight");
    if (close) close.addEventListener("click", function (e) { e.preventDefault(); box.classList.add("hidden"); });
    var first = box.querySelector(".menu-item");
    if (first) first.addEventListener("click", function () {
      var news = $("#newsTab");
      if (news) window.scrollTo({ top: news.offsetTop - 80, behavior: "smooth" });
    });
  }

  function initNewsTabs() {
    var root = $("#newsTabs");
    if (!root) return;
    var tabs = $$("li", root);
    var panels = $$(".news-tab .tab-bd > .tab-item");
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t, j) { t.classList.toggle("active", j === i); });
        panels.forEach(function (p, j) { p.classList.toggle("active", j === i); });
      });
    });
  }

  /* ==========================================================================
     初始化
     ========================================================================== */
  function bindCheckboxes() {
    $$(".check-item").forEach(function (li) {
      li.addEventListener("click", function () { li.classList.toggle("checked"); });
    });
  }

  function bindStationInputs() {
    $$("input[data-role=station]").forEach(function (input) {
      var item = input.closest(".form-item") || input.closest(".form-item-group");
      var label = item ? item.querySelector(".form-label") : null;
      input.placeholder = "请输入或选择" + (label ? label.textContent.trim() : "车站");
      bindStation(input);
    });
  }

  function bindDatePickers() {
    $$("input[data-role=date]").forEach(function (input) {
      input.placeholder = "请选择日期";
      bindDateInput(input);
    });
    var sel = $("#jpkStation");
    if (sel) {
      var names = ["北京南", "上海虹桥", "广州南", "深圳北", "杭州东", "南京南", "成都东", "西安北", "武汉", "长沙南"];
      sel.innerHTML = '<option value="">请选择车站</option>' + names.map(function (n) {
        return '<option value="' + n + '">' + n + "</option>";
      }).join("");
    }
  }

  function init() {
    renderHeaderMenu();
    renderNav();
    renderSlides();
    renderServices();
    renderTravel();
    renderNews();
    renderFooter();
    mountQr();

    bindSideMenu();
    bindTabs($("#ticketTabs"), $("#ticketPanels"));
    bindTabs($("#commonTabs"), $("#commonPanels"));
    bindCheckboxes();
    bindStationInputs();
    bindDatePickers();
    bindSwap("#danChange", "#fromStationText", "#toStationText");
    bindSwap("#fanChange", "#fromStationFanText", "#toStationFanText");
    bindSwap("#zhChange", "#fromStationZhText", "#toStationZhText");

    initTicketSearch();
    initCommonSearch();
    initDinnerSearch();
    renderHistory();
    initHistory();
    initCarousel();
    initHeaderSearch();
    initScroll();
    initFixedRight();
    initNewsTabs();

    $$(".icon-place, .icon-date").forEach(function (ic) {
      ic.addEventListener("click", function () {
        var el = document.getElementById(ic.getAttribute("data-click"));
        if (!el) return;
        if (el.hasAttribute("data-role") && el.getAttribute("data-role") === "date") { showPicker(el); }
        else { el.focus(); }
      });
    });

    document.addEventListener("click", function (e) {
      if (picker && picker.style.display === "block" && !picker.contains(e.target) && e.target !== pickerInput) hidePicker();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
