/**
 * @fileOverview Javascript for net02
 * @author werner@bussedesign.com
 * @requires jQuery 1.11.0
 */

// the jQuery wrapper to prevent conflicts with other libraries
(function ($) {

	"use strict";
	function polyfill(){
		// IE don't support Array.includes() natively
		if (!Array.prototype.includes) {
			Array.prototype.includes = function(searchElement, fromIndex){
					if (this == null)
						throw new TypeError('"this" is null or not defined');
					var o = Object(this);
					var len = o.length >>> 0;
					if (len === 0)
						return false;
					var n = fromIndex | 0;
					var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
					while (k < len) {
						if (o[k] === searchElement)
							return true;
						k++
					}
					return false;
			};
		}
		// IE8 don't support Array.map() natively
		if (!Array.prototype.map) {
			Array.prototype.map = function(callback/*, thisArg*/) {
				var T, A, k;
				if (this == null) {
					throw new TypeError('this is null or not defined');
				}
				var O = Object(this);
				var len = O.length >>> 0;

				if (typeof callback !== 'function') {
					throw new TypeError(callback + ' is not a function');
				}
				if (arguments.length > 1) {
					T = arguments[1];
				}
				A = new Array(len);
				k = 0;
				while (k < len) {
					var kValue, mappedValue;
					if (k in O) {
						kValue = O[k];
						mappedValue = callback.call(T, kValue, k, O);
						A[k] = mappedValue;
					}
					k++;
				}
				return A;
			};
		}
	}
	polyfill();

	/*global $, jQuery, window, document, console*/
	/*jslint plusplus: true, vars: true, indent: 2, bitwise: true*/

	$.isPhone  = false;
	var hasTouch = false,
	isTablet = false,
	eventType =""; 
			
	// regular expression
	$.REG_NUM = /^[0-9]*$/;
	//$.REG_EMAIL = /^[\x21-\x7e]+@[\x21-\x7e]+(\.[\x21-\x7e]+)+/;
	$.REG_EMAIL = /^[\x21-\x7e]{1,255}$/;
	$.REG_PASSWORD = /^[\x20-\x7f]{6,32}$/;
	$.REG_PASSWORD2 = /^[\x20-\x7f]{1,32}$/;
	$.REG_KEY_64 = /^([\x20-\x7f]{5}|[0-9a-fA-F]{10})$/;
	$.REG_KEY_128 = /^([\x20-\x7f]{13}|[0-9a-fA-F]{26})$/;
	$.REG_WPA_PWD = /^([\x20-\x7f]{8,63}|[0-9a-fA-F]{64})$/;
	$.REG_SSID = /^[\x20-\x7f]{1,32}$/;
	$.REG_DEVNAME = /^[\x20-\x7f]{1,12}$/;
	$.REG_ANSWER = /^([\x200-9a-zA-Z]|[\xC6-\xCB]|[\xCE-\xCF]|[\xDB-\xDC]|[\xDF-\xE0]|[\xE6-\xEB]|[\xEE-\xEF]|[\xFB-\xFC]|[\xC0]|[\xC2]|[\xC4]|[\xD4]|[\xD6]|[\xD9]|[\xE2]|[\xE4]|[\xF4]|[\xF6]|[\xF9]|[\xFF]|[\u0152]|[\u0153]|[\u0178]){1,64}$/;
	$.REG_IP = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[1-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])$/;
	$.REG_MAC = /^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$/;
	$.REG_TIME = /^([1-9]{1}|1[0-9]{1}):[0-9]{0,2}([a][m]|[p][m])$/;
	$.REG_DEVICE = /^([\x30-\x39]|[\x41-\x5A]|[\x61-\x7A]|[\x2D]){1,15}$/;
	$.REG_MEDIA_SERVER = /^([\x30-\x39]|[\x41-\x5A]|[\x61-\x7A]|[\x2D]|[\x5F]){1,64}$/;
	$.REG_WORKGROUP = /^[\x20-\x7E]{1,15}$/;
	$.REG_SHARE = /^([\x20-\x21]|[\x23-\x26]|[\x28-\x29]|[\x2b-\x2E]|[\x30-\x39]|[\x3B]|[\x3D]|[\x40-\x5C]|[\x5E-\x7B]|[\x7D-\x7F]|[\xA0]){1,31}$/;
	$.REG_WPS_PIN_ATTACH_NUM = /^(0|([1-9][0-9]{0,2}))$/;

	$.ING_FORMAT_1 = "<div id=\"waiting\" class=\"running\"></div><div class=\"doing running\"> \
			<div class=\"loadingMessage roundCorners\">";
	$.ING_FORMAT_2 = "</div></div>";
	$.ING_FORMAT_3 = "<div id=\"page_waiting\" class=\"running\"></div><div class=\"page_doing running\"> \
			  <div class=\"loadingMessage roundCorners\">";
	$.CHANGE_LANG_DIV = $.ING_FORMAT_1 + multi_wait + $.ING_FORMAT_2;
	$.WAITING_DIV = $.ING_FORMAT_1 + wait_serv + $.ING_FORMAT_2;
	$.PAGE_WAITING_DIV = $.ING_FORMAT_3 + wait_serv + $.ING_FORMAT_2;
	$.UPGRADE_DIV = $.ING_FORMAT_1 + upgrade_str + $.ING_FORMAT_2;
	$.APPLYING_DIV = $.ING_FORMAT_1 + apply_settings + $.ING_FORMAT_2;
	$.APPLYING_DIV2 = $.ING_FORMAT_1 + apply_settings2 + $.ING_FORMAT_2;
	$.PAGE_APPLYING_DIV = $.ING_FORMAT_3 + apply_settings + $.ING_FORMAT_2;
	$.UPDATEING_DIV = $.ING_FORMAT_1 + update_head + $.ING_FORMAT_2;

	$.SWITCH_LANG_DIV = "<h1>" + language + "</h1>"
			+ "<table><tr><td><hr /></td></tr>"
			+ "<tr><td>" + multi_wait + "</td></tr>"
			+ "<tr><td><hr /></td></tr></table>";

	$.REBOOT_TIME = 185; //seconds

	var sUserAgent = navigator.userAgent,
	fAppVersion = parseFloat(navigator.appVersion),
	isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows"),
	isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel"),
	isPhonePad = (navigator.platform == "iPhone") || (navigator.platform == "iPad") || (navigator.platform == "iPod"),
	isLin = (navigator.platform == "Linux i686") && !isWin && !isMac;
	var isWin95 = false, isWin98 = false, isWinNT4 = false, isWin2K = false, isWinME = false, isWinXP = false, isWinVista = false, isWin7 = false, isMac68K = false, isMacPPC = false, isMacOS = false, isLinux = false;
	if (isLin)
		isLinux =  sUserAgent.indexOf("Linux") > -1;
	if (isWin) {
		isWin95 = sUserAgent.indexOf("Win95") > -1
			|| sUserAgent.indexOf("Windows 95") > -1;
		isWin98 = sUserAgent.indexOf("Win98") > -1
			|| sUserAgent.indexOf("Windows 98") > -1;
		isWinME = sUserAgent.indexOf("Win 9x 4.90") > -1
			|| sUserAgent.indexOf("Windows ME") > -1;
		isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1
			|| sUserAgent.indexOf("Windows 2000") > -1;
		isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1
			|| sUserAgent.indexOf("Windows XP") > -1;
		isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1
			|| sUserAgent.indexOf("Windows Vista") > -1;
		isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1
			|| sUserAgent.indexOf("Windows 7") > -1;
		isWinNT4 = sUserAgent.indexOf("WinNT") > -1
			|| sUserAgent.indexOf("Windows NT") > -1
			|| sUserAgent.indexOf("WinNT4.0") > -1
			|| sUserAgent.indexOf("Windows NT 4.0") > -1
			&& (!isWinME && !isWin2K && !isWinXP);
	}
	if (isMac) {
		isMac68K = sUserAgent.indexOf("Mac_68000") > -1
			|| sUserAgent.indexOf("68K") > -1;
		isMacPPC = sUserAgent.indexOf("Mac_PowerPC") > -1
			|| sUserAgent.indexOf("PPC") > -1;
		isMacOS =  sUserAgent.indexOf("Mac OS") > -1;
	}

	$.isVista = isWinVista || isWin7;
	$.isMac = isMac68K || isMacPPC || isMacOS;
	$.isLinux = isLinux;
	$.isAndroid = sUserAgent.indexOf("Android") > -1;
	$.isPhonePad = isPhonePad;
	$.chromeTimer = sUserAgent.indexOf("Chrome") > -1 ? 1000 : 0;
	$.TS="";

	$.xss_replace = function(xss_str) {
		if ( typeof(xss_str) == "undefined" || xss_str == "" )
			return "";

		xss_str = xss_str.replace(/&#38;/g,'&').replace(/&#35;/g,'#').replace(/&#34;/g,'"').replace(/&#39;/g,"'").replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&#40;/g,"(").replace(/&#41;/g,")").replace(/&nbsp;/g," ");
		return xss_str;
	};

	$.isIE = function() {
		var browser = new Object();
		browser.version = parseInt(navigator.appVersion);
		browser.isNs = false;
		browser.isIe = false;
		if(navigator.appName.indexOf("Netscape") != -1)
			browser.isNs = true;
		else if(navigator.appName.indexOf("Microsoft") != -1)
			browser.isIe = true;

		if(browser.isNs)
			return false;
		else if (browser.isIe)
			return true;
		else
			return false;
	};

	$.getBrowser = function() {
		var agent = navigator.userAgent, res = '';
		if(agent.indexOf("MSIE") != -1 || !!window.ActiveXObject || "ActiveXObject" in window)
			res = "IE";
		else if(agent.indexOf("OPR") != -1)
			res = "Opera";
		else if(agent.indexOf("Edge") != -1 )
			res = "Edge"
		else if(agent.indexOf("Chrome") != -1 )
			res = "Chrome";
		else if(agent.indexOf("Firefox") != -1)
			res = "Firefox";
		else if(agent.indexOf("Safari") != -1 )
			res = "Safari";
		else if(agent.indexOf("Camino") != -1)
			res = "Camino";
		else if(agent.indexOf("Gecko/") != -1)
			res = "Gecko";
		return res;
	};
	$.bindChangeHandler = function(item, callback) {
		if( item == null || typeof item !== "object" ) {
			return;
		}
		var inputList = [];
		if( item.length == undefined ) {
			inputList.push(item);
		} else {
			inputList = item;
		}
		for(var i = 0; i < inputList.length; i++) {
			var input = inputList[i];
			if( "onpropertychange" in input) {
				input.onpropertychange = function() {
					var ee = (window && window.event) || event;
					(!ee || ee.propertyName == 'value') && callback ? callback(this) : '';
				}
			} else {
				input.addEventListener("input", function() {
					callback ? callback(this) : '';
				}, false);
			}
		}
	};

	/**
	*  the document ready function
	*/
	$(function () {
		/**
		 * If user using IE8-, it will tell user to using higher version
		 */
		var ua = navigator.userAgent.toLowerCase(),
		isIE = /msie/.test(ua),
		version = (ua.match( /(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1];

		if ( isIE && parseInt(version) < 8) {
			$('body').html('<table width="100%"><tr><td align="center">'+lower_browser+'</td></tr></table>');
			return;
		}
		// $.cookie('sessionEnable', '1');

		// global constants
		$.MIN_PWD_CHARACTERS = 8;

		/**
		 * @function addErrMsgAfter
		 * @param {id} - the id which the msg will add for.
		 * @param {msg} - Error msg
		 * @param {flag} - insert after the $(id) directly.
		 */
		$.addErrMsgAfter =function (id, msg, flag, err_id){
			if ( arguments.length == 4 ) {
				$(ERROR_SPAN_BEGIN+" id='"+err_id+"'>"+msg+ERROR_SPAN_END).insertAfter('#'+id);
			} else if ( arguments.length > 2 ) {
				$(ERROR_SPAN_BEGIN+' >'+msg+ERROR_SPAN_END).insertAfter('#'+id);
			} else {
				$('#'+id).parent().append(ERROR_SPAN_BEGIN+' >'+msg+ERROR_SPAN_END);
			}
		}

		/**
		 * @function enterSubmit
		 * @param {container} - the form id.
		 * @param {id} - the button id, $(id) will be triggered click function after Enter.
		 */
		$.enterSubmit = function(container, id) {
			$(container).keyup(function(e) {
				var e = e || event,
				keycode = e.which || e.keyCode;
				if(keycode == 13)
					if($('#'+id).prop('disabled') == false)
						$('#'+id).trigger('click');
			});
		};

		/**
		 * @function enterForbid
		 * @param {container} - the form id.
		 */
		$.enterForbid = function(container) {
			$(container).keypress(function(e) {
				var e = e || event,
				keycode = e.which || e.keyCode;
				if(keycode == 13)
					return false;
			});
		};
		
		/**
		 * @function enableButton
		 * @param {button id} - button ID
		 * @param {container id or class} - the id or class of the container
		 * @param {num} - the number of the item need to check in this form
		 * @param {flag} - true or false, if have this flag, it will ignore arguments {form id}, {num}
		 */
		$.enableButton = function(buttonId, container, num, flag) {
			if ( arguments.length == 4 ) {
				if ( flag ) {
					$('#'+buttonId).prop('disabled', false);
					$.enterSubmit(container, buttonId);
				} else {
					$('#'+buttonId).prop('disabled', true);
					$.enterForbid(container);
				}
			} else {
				//$.alertBox($('.activeElement', container).length);
				if ( $('.activeElement', container).length == num ) {
					$('#'+buttonId).prop('disabled', false);
					$.enterSubmit(container, buttonId);
				} else {
					$('#'+buttonId).prop('disabled', true) 
					$.enterForbid(container);
				}
			}
		};
		
		/**
		 * @function getUrlParam
		 * @param {name] - the name of the element
		 */
		 $.getUrlParam = function(name)
		{
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)","i");
			var r = window.location.search.substr(1).match(reg);
			if (r!=null) return unescape(r[2]); return null;
		};
	
		$.ID_1 = $.getUrlParam('id') == null ? "" : ("&id="+$.getUrlParam('id'));
		$.ID_2 = $.ID_1.replace(/&/g, "?");
		if ( $.getUrlParam('id') != null && $.getUrlParam('id') != "" && $.getUrlParam('id') != "null" )
			$.cookie('dsessid', $.getUrlParam('id'));

		/**
		 * @function showPassKey 
		 * @param { sec } - the security value
		 * @param { num } - the num of WEP key - Key 1,2,3,4
		 * @param { tag } - root
		 * @return security password
		 */
		$.showPassKey = function(sec, num, tag) {
			var password = "";
			if(tag == "root5g2"){
				if(sec == "2") {
					password = eval("root5g"+"Key"+num+"2");
				} else if(sec == "3" || sec == "4" || sec == "5" || sec == "6" || sec == "7" || sec == "8")
					password = eval("root5g"+"Password"+"2");
				else
					password = "";
				return password.replace(/ /g, '&nbsp;');
			}else if(tag == "client5g2"){
				if(sec == "2") {
                                        password = eval("client5g"+"Key"+num+"2");
                                } else if(sec == "3" || sec == "4" || sec == "5" || sec == "6" || sec == "7" || sec == "8")
                                        password = eval("client5g"+"Password"+"2");
                                else
                                        password = "";
                                return password.replace(/ /g, '&nbsp;');
			}else{
				if(sec == "2") {
					password = eval(tag+"Key"+num);
				} else if(sec == "3" || sec == "4" || sec == "5" || sec == "6" || sec == "7" || sec == "8")
					password = eval(tag+"Password");
				else
					password = "";
				return password.replace(/ /g, '&nbsp;');
			}
		};

		/**
		 * @function showPassKey5g
		 * @param { sec } - the security value
		 * @param { num } - the num of WEP key - Key 1,2,3,4
		 * @param { tag } - root
		 * @return security password
		 */
		$.showPassKey5g = function(sec, num, tag) {
			var password = "";
			if(sec == "2") {
				password = eval(tag+"Key5g"+num);
			} else if(sec == "3" || sec == "4" || sec == "5" || sec == "6" || sec == "7" || sec == "8")
				password = eval(tag+"Password5g");
			else
				password = "";
			return password.replace(/ /g, '&nbsp;');
		};

		/**
		 * @function formatSecType
		 * @param { security } - the security value
		 * @return security strings
		 */
		$.formatSecType = function(security) {
			var securiType = "";
			if(security == "2")
				securiType = "WEP";
			else if(security == "3")
				securiType = "WPA-PSK [TKIP]";
			else if(security == "4")
				securiType = "WPA2-PSK [AES]";
			else if(security == "5")
				securiType = "WPA/WPA2-PSK";
			else
				securiType = none;

			return securiType;
		};

		/**
		 * @function post form data.
		 * @param {container id or class} - the id or class of the container
		 * @param {url} - request url, if it's NULL or empty, it will auto get formId's action value.
		 * @param {function} - callback function
		 */
		$.postForm = function (container, url, callback) {
			//Generate JSON data
			if ( !$(container).length ) {
				$.alertBox('Error form!');
				return;
			}
			//$.post(url,$(container).serialize(),callback);
			if ( url == '') {
				if ( container.indexOf('#') > -1 ) {
					url = $(container).attr("action");
				} else {
					url = $(container).parents('form').first().attr("action");
				}
			}
			url += $.ID_1;
			var funcs = function(json) {
				if ( $.reset_login(json) )
					return false;
				if ( $.reload_page(json) )
					return false;
				resetTimer(4*60);
				if ( callback != null )
					callback(json);
			};
			var err_funcs = function() {
				var json = { "status": "0", "msg": "400 Bad Request!" };
				if ( callback != null ) {
					$('.running').remove();
					callback(json);
				}
			};
			
			$.ajax({
				url: url,
				type: "POST",
				data: $(container).serialize(),
				dataType: 'json',
				contentType: "application/json; charset=utf-8",
				success: funcs,
				error: err_funcs
			});
		};

		/**
		 * @param {url} - request url
		 * @param {function} - callback function
		 */
		$.getData = function (url, callback) {
			var new_url = url;
			if ( typeof($.ID_2) != "undefined" )
				new_url = url +$.ID_2;
				
			$.getJSON(new_url, function(json) {
				if ( $.reset_login(json) )
					return false;
				if ( $.reload_page(json) )
					return false;
				resetTimer(4*60);
				callback(json);
			});
		};

		$.getData2 = function (url, callback, ajax_error) {
                        var new_url = url;
                        if ( typeof($.ID_2) != "undefined" )
                                new_url = url +$.ID_2;

			$.ajax({
				url: new_url,
				success: function(json) {
					if ( $.reset_login(json) )
						return false;
					if ( $.reload_page(json) )
						return false;
					resetTimer(4*60);
					callback(json);
				},
				dataType: "json",
				error: function(){
					ajax_error();
				}
			});
                };

		$.check_running = function(){
			return $('.running').length || $('.modalBox:visible').length;
		}
		$.check_running_ele = function(ele){
			if ( $(ele).length ) {
				$(ele).click(function(){
					if( $.check_running() )
						return;
				});
			}
		};

		$.check_aLink = function(ele) {
			if( !$(ele).attr('href2') ) {
				$(ele).attr('href2', $(ele).attr('href'));
			}
			if( $.check_running() )
				$(ele).removeAttr('href');
			else
				$(ele).attr('href', $(ele).attr('href2'));
		};

		$.check_aLink_ele = function(ele) {
			if( $(ele).length ) {
				$(ele).mousedown(function(){
					$.check_aLink(this);
				});
				$(ele).focus(function(){
					$.check_aLink(this);
				});
			}
		};
		$('a', '.sidebar').each(function(){
			if( $(this).attr('id') == 'fwUpdate' ) {
				if( $(this).parent('li').hasClass('active') )
					$.check_aLink_ele(this);
			}
		});

		/**
		 * @function: check_filesize - check the filesize is valid or not.
		 * @param {obj_file} - this
		 * @param {max_value} - max value
		 * @param {unit} - value's unit
		 * @return - If valid return true, else return false;
		 **/
		$.check_filesize = function(obj_file, max_value, unit ) {
			var maxsize;
			switch(unit){
				case 'K':
				case 'k':
					maxsize = max_value*1024;
					break;
				case 'M':
				case 'm':
					maxsize = max_value*1024*1024;
					break;
				default:
					maxsize = max_value;
					break;
			}

			var  browserCfg = {};
			var ua = window.navigator.userAgent;
			if (ua.indexOf("MSIE")>=1){
				browserCfg.ie = true;
			}else if(ua.indexOf("Firefox")>=1){
				browserCfg.firefox = true;
			}else if(ua.indexOf("Chrome")>=1){
				browserCfg.chrome = true;
			}

			if(obj_file.value==""){
				return false;
			}
			try {
			var filesize = 0;
			if(browserCfg.firefox || browserCfg.chrome ){
				filesize = obj_file.files[0].size;
			}else if(browserCfg.ie){
				var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
				var file = fileSystem.GetFile(obj_file.value);
				filesize = file.size;
			}else{
				filesize = obj_file.files[0].size;
			}

			if(filesize==-1){
				return true;
			}else if(filesize>maxsize){
				$.alertBox(restore_select_correct);
				var textInput = $(obj_file).parents('.fileInputWidget').first().find('input[type=text]').first();
				textInput.val("");
				$(obj_file).val("");
				return false;
			}
			} catch(e) {
			}
			return true;
		};
		
		/*******************************************************************************************
		 * 
		 * Check the domain and change it.
		 * Because when the LAN IP is change, browser should change the domain.
		 * Otherwise, browser can get the webpage.
		 *
		 ******************************************************************************************/
		$.change_domain = function(page,host) {
			if ( page.indexOf("/") != 0 )
				page = "/" + page;

			var href = location.href;
			var dss = "?id="+$.cookie('dsessid');
			dss = '';
			/*
			if ( href.indexOf("www.mywifiext.net") > -1 )
				top.location.href = "http://www.mywifiext.com"+page+dss;
			else if ( href.indexOf("mywifiext.net") > -1 )
				top.location.href = "http://mywifiext.com"+page+dss;
			else if ( href.indexOf("www.mywifiext.com") > -1 )
				top.location.href = "http://www.mywifiext.net"+page+dss;
			else if ( href.indexOf("mywifiext.com") > -1 )
				top.location.href = "http://mywifiext.net"+page+dss;
			else
				top.location.href = "http://www.mywifiext.com"+page+dss;
			*/
			if(host == "mywifiext.com")
				top.location.href = "http://mywifiext.net"+page+dss;
			else if (host == "mywifiext.net")
				top.location.href = "http://www.mywifiext.com"+page+dss;
			else if (host == "www.mywifiext.com")
				top.location.href = "http://www.mywifiext.net"+page+dss;
			else
				top.location.href = "http://mywifiext.com"+page+dss;
		};

		$.change_domain2 = function(page,host) {
			if ( page.indexOf("/") != 0 )
				page = "/" + page;

			var href = location.href;
			var dss = "?id="+$.cookie('dsessid');
			dss = '';
			var nav = navigator.platform.substring(0,3);
			if( nav == "Win" ){
				top.location.href = "http://mywifiext"+page+dss;
			}else if(nav == "iPh" || nav == "iPa" || nav == "iPo" || nav == "Mac" || nav == "Lin"){
				top.location.href = "http://mywifiext.local"+page+dss;
			}else{
				if(host == "mywifiext.com")
					top.location.href = "http://mywifiext.net"+page+dss;
				else if (host == "mywifiext.net")
					top.location.href = "http://www.mywifiext.com"+page+dss;
				else if (host == "www.mywifiext.com")
					top.location.href = "http://www.mywifiext.net"+page+dss;
				else
					top.location.href = "http://mywifiext.com"+page+dss;
			}
		};

		/*******************************************************************************************
		*
		* Do the xss replace for some special characters.
		*
		******************************************************************************************/
		$.special_xss = function(ssid) {
			return ssid.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#40;/g,'(').replace(/&#41;/g,')').replace(/&#38;/g,'&').replace(/&#35;/g,'#').replace(/&#34;/g,'"').replace(/&#39;/g,"'");
		};
		$.do_xss_ssid = function(ssid) {
			return ssid.replace(/\\/g,"\\\\\\\\").replace(/`/g,"\\\\\\`").replace(/"/g,"\\\"");
		};
		$.do_xss_pass = function(password) {
			return password.replace(/\\/g,"\\\\").replace(/`/g,"\\`").replace(/"/g,"\\\"");
		};
		$.xss_format = function(xss_str) {
			xss_str = xss_str.replace(/\"/g, '&#34;').replace(/\'/g, '&#39;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/\(/g, '&#40;').replace(/\)/g, '&#41;').replace(/\`/g, '&#96;').replace(/ /g, '&nbsp;');
			return xss_str;
		};

		/****************************************************************************************
		*
		* getkey 
		* KeyCode Map
		*	~ 126	` 96	! 33	@ 64	# 35	$ 36	% 37	^ 94	~`!@#$%^(8)
		*	& 38	* 42	( 40	) 41	_ 95	+ 43	- 45	= 61	&*()_+-=(8)
		*	{ 123	} 125	[ 91	] 93	\ 92	| 124			{}[]\|	(6)
		*	; 59	: 58	' 39	" 34					;:'"	(4)
		*	< 60	> 62	, 44	. 46	? 63	/ 47			<>,.?/	(6 ==> 32)
		*	SpaceBar 32	Enter 13
		*	0-9 48-57	A-Z 65-90	a-z 97-122
		*
		****************************************************************************************/
		$.getkey = function(type, e) {
			var keycode;
			if (window.event)
				keycode = window.event.keyCode;
			else if (e)
				keycode = e.which;
			else
				return true;

			if(type == "num") {
				if(((keycode>47) && (keycode<58)) || (keycode==8)||(keycode==0))
					return true;
				else
					return false;
			} else if(type == "ipaddr") {
				if (((keycode>47) && (keycode<58))||(keycode==8)||(keycode==0)||(keycode==46)) 
					return true;
				else
					return false;
			} else if(type == "ssid") { // not allow space
				if (keycode==32) 
					return false;
				else 
					return true;
			} else if(type == "mac") {
				if (((keycode>47) && (keycode<58))||((keycode>64) && (keycode<71))||((keycode>96) && (keycode<103))||(keycode == 8)||(keycode == 0) || (keycode == 58) || (keycode == 45))
					return true;
				else 
					return false;
			} else if(type == "wps_pin") {
				if (((keycode>47) && (keycode<58)) || (keycode==8)||(keycode==0) || (keycode == 32) || (keycode == 45))
					return true;
				else
					return false;
			} else if(type == "shareName") { // not allow / * ? " : < > \ ] |
				if((keycode==47) || (keycode==42) || (keycode==63) || (keycode==34) || (keycode==58) || (keycode==60) || (keycode==62) || (keycode==92) || (keycode==93) || (keycode==124))
					return false;
				else
					return true;
			} else if(type == "mediaServerName") { // not allow / * ? " < > \ ] |
				if((keycode==47) || (keycode==42) || (keycode==63) || (keycode==34)  || (keycode==60) || (keycode==62)  || (keycode==92) || (keycode==93) || (keycode==124))
					return false;
				else
					return true;
			} else
				return false;
		};

		/****************************************************************************************
		 *
		 * getDate
		 *
		 ****************************************************************************************/
		$.getDate = function(time) {
			var curDate = new Date(time),
			date = curDate.getDate(),
			month = curDate.getMonth()+1,
			year = curDate.getFullYear();

			date = date < 10 ? '0' + date : date;
			month = month < 10 ? '0' + month : month;

			return month+'/'+date+'/'+year;
		};

		/****************************************************************************************
		 *
		 * getTime
		 *
		 ****************************************************************************************/
		$.getTime = function(time) {
			var curDate = new Date(time),
			hour = curDate.getHours(),
			minutes = curDate.getMinutes(),
			unit = am_mark;

			if ( hour == 0 ) {
				hour = 12;
			} else if ( hour > 11 ) {
				unit = pm_mark;
				if ( hour > 12 ) {
					hour -= 12;
				}
			}
			minutes = minutes < 10 ? '0' + minutes : minutes;

			return hour+':'+minutes+' '+unit;
		};

		/****************************************************************************************
		*
		* getTime
		*
		****************************************************************************************/
		$.SelectionTextLength = function(text) {
			var select_text="";
			if (document.selection&& document.selection.createRange)//IE
				select_text=document.selection.createRange().text;
			else if(select_text == "" && text.selectionStart != undefined )
				select_text=text.value.substring(text.selectionStart,text.selectionEnd);
			return select_text.length;
		};

		$.keydown = function(e,text) {
			if((e.keyCode == 190 || e.keyCode == 110) && text.value.length !=0 && $.SelectionTextLength(text)==0)
				text.form[($.getIndex(text)+1) % text.form.length].focus();
		};

		$.keyup = function(e,text) {
			if(text.value.length == 3 && ((e.keyCode >47 && e.keyCode <58) ||(e.keyCode >95 && e.keyCode <106)))
				text.form[($.getIndex(text)+1) % text.form.length].focus();
		};

		$.getIndex = function(input) {
			var index = -1,
			i = 0,
			found = false;
			while (i < input.form.length && index == -1) {
				if (input.form[i] == input)
					index = i;
				else
					i++;
			}
			return index;
		};

		$.logout = function() {
			$.ajax({
				url: "admin.cgi?/logout.html timestamp=" + $.TS + $.ID_1,
				type: "POST",
				data: { "submit_flag": "logout" },
				dataType: 'json',
				contentType: "application/json; charset=utf-8",
				success: function(json) {
					if ( $.reset_login(json) )
						return false;
					if ( $.reload_page(json) )
						return false;
					resetTimer(4*60);
					if ( typeof(no_auth) != "undefined" && no_auth == "1" )
						location.href = "/logout.html";
					else
						location.href = "/login.html";
				},
				error: function() {
					alert("Log Out fail.Please try again!");
				}
			});
		};

		if( $('#logout').length ) {
			$('#logout').click(function() {
				$.logout();
			});
		}

		function relogin() {
			$.ajax({
				url: "admin.cgi?/status.htm timestamp=" + $.TS + $.ID_1,
				type: "POST",
				data: { "submit_flag": "update_time" },
				dataType: 'json',
				contentType: "application/json; charset=utf-8",
				timeout: 15000,
				success: function(json) {
					if ( $.reload_page(json) ) {
						return false;
					}
					if ( no_auth == "1" )
						location.href = "/status.htm";
					else if ( location.pathname.indexOf("hidden_") > -1 || location.pathname.indexOf("StringTableUpload.html") > -1 )
						location.href = location.pathname;
					else
						location.href = "/login.html";
				},
				error: function() {
					document.location.reload();
				}
			});
			if ( no_auth == "1" )
				location.href = "/status.htm";
		}

		$.reset_login = function(json) {
			if ( typeof(json.reset) != "undefined" && json.reset == '1') {
				$.removeCookie('interim');
				$.alertBox(timeout_msg,  ok_mark, function(){
					relogin();
				});
				return true;
			} else if ( typeof(json.expired) != "undefined" && json.expired == '1') {
				$.removeCookie('interim');
				$.alertBox(timeout_msg,  ok_mark, function(){
					relogin();
				});
				return true;
			} else if ( typeof(json.multi) != "undefined" && json.multi == '1') {
				location.href = "/multi_login.html";
				return true;
			}
			return false;
		};
		$.reload_page = function(json) {
			if ( typeof(json.reload) != "undefined" && json.reload == '1') {
				$.alertBox(timestamp_error, '', function() {
					document.location.reload();
				});
				$('.running').remove();
				if ( typeof(timeout) != "undefined" )
					clearTimeout(timeout);
				if ( typeof(remind) != "undefined" )
					clearTimeout(remind);
				return true;
			}
			return false;
		};

		function do_search()
		{
			var key = $('#footerSearchField').val() ;
			var winoptions = "width=960,height=800,menubar=yes,scrollbars=yes,toolbar=yes,status=yes,location=yes,resizable=yes";
			var url="";
			if(key == "" || key == ent_srh_item ) {
				$('#footerSearchField').val(host_name);
				key = host_name;
				$('#footerSearchField').addClass('searchInput');
			}
			key = key.replace(/ /g,"%20")
			url = "http://www.netgear.com/search.aspx?q="+key;
			window.open(url,'_blank',winoptions);
		}

		/*******************************************************************************************
		*
		*	tablet/phone navigation
		*
		*  based on an inconsistent nav design we have to accommodate three different nav
		*  scenarios: Regular, medium width and small width.
		*
		******************************************************************************************/
		if ( $('.login').length == 0 && $('.setup').length == 0 ) {
			$('#logo').before('<div id="navButton"><i class="dnintg-menu"></i></div>');
		}
		
		function tablet_phone_navigation() {
			/**
			 *  We are not checking for any device type as that is unreliable. 
			 *  Rather we are defining behavior based on media query breakpoints that change
			 *  the ui. 
			 *  For screen sizes > 980px width the main nav is located in the left sidebar and
			 *  visible.
			 *  For screens < 980px wide a "hamburger" icon is added to the header and the main
			 *  nav is hidden by the content. When the "hamburger" is clicked, content area 
			 *  slides to the right, revealing the main nav.
			 *  For screens < 600px wide the main nav will just slide down from the header
			 *  when the "hamburger" is clicked.
			 *  using 'isTablet' for screen width from 600 to 980px
			 *  We are using two variables to indicate the states of the nav: isTablet and isPhone
			 *  
			 *  isTablet is true when the "hamburger" is visible (#navButton)
			 *  isPhone is true when the "hamburger" is visible and the byline has float left applied
			 *
			 *  These conditions are set via media queries in the main.css
			 *
			 */

			/**
			 *  to deal with touch and clicks we use a jquery event extension >> touchclick
			 *  to detect touch we use modernizr
			 *
			 */
			hasTouch = false,
			isTablet = false,
			eventType =""; 
			$.isPhone  = false;

			if (document.ontouchstart) {
				hasTouch = true;
			}

			eventType = hasTouch ? "touchstart" : "click";

			jQuery.event.special.touchclick = {
				bindType: eventType,
				delegateType: eventType
			};
			
			if ($('#navButton').css('display') === 'block') {
				isTablet = true;
			}

			if (($('#navButton').css('display') === 'block') && ($('#byline').css('float') === 'left')) {
				isTablet = false;
				$.isPhone = true;
			}

			if (isTablet || $.isPhone) {
				if ($('#language').length) {
					$('#language').find('>a').unbind('touchclick');
					$('#language').find('>a').on('touchclick', function () {
						if ($(this).hasClass('open')) {
							$(this).removeClass('open');
							$(this).next().slideUp();
						} else {
							$(this).addClass('open');
							$(this).next().slideDown();
						}   
					});
				}

				if ($('#navButton').length) {
					
					if ( $('#navButton').hasClass('open') ) {
						$('.mainNavWrap').slideDown();
					}
				}
				if (isTablet) {
					if ($('#navButton').length) { 
						$('#navButton').unbind('touchclick');
						if ( $('#navButton').hasClass('open') ) {
							$('#slider').css('marginLeft', '40%');
							$('.mainNavWrap').slideDown();
						} else {
							$('#slider').css('marginLeft', '0');
							$('.mainNavWrap').slideUp();
						}
						$('#navButton').on('touchclick', function () {
							if ($(this).hasClass('open')) {
								$(this).removeClass('open');
								$('#slider').css('marginLeft', '0');
								$('.mainNavWrap').slideUp();
							} else {
								$(this).addClass('open');
								$('#slider').css('marginLeft', '40%');
								$('.mainNavWrap').slideDown();
							}          
						});
					}
				}
				if ($.isPhone) {
					if ($('#navButton').length) {
						$('#navButton').unbind('touchclick');
						$('#slider').css('marginLeft', '0');
						if ( $('#navButton').hasClass('open') ) {
							$('.mainNavWrap').slideDown();	
						} else {
							$('.mainNavWrap').slideUp();
						}
						$('#navButton').on('touchclick', function () {
							if ($(this).hasClass('open')) {
								$(this).removeClass('open');
								$('.mainNavWrap').slideUp();
							} else {
								$(this).addClass('open');
								$('.mainNavWrap').slideDown();
							}          
						});
					}
				}
			}
			else {
				$('#slider').css('marginLeft', '0');
				$('.mainNavWrap').slideDown();
			}			
		}

		function fixed_modal() {
			//Adjust the modal postion
			if ( !$('.loadingMessage').length && !$('.modalBox').length )
				return;

			var winHeight = window.innerHeight;
			if ( typeof(window.innerHeight) == "undefined"  )
				winHeight = Math.min(document.documentElement.clientHeight, document.body.clientHeight);
			var scrollY = window.scrollY;
			if ( typeof(window.scrollY) == "undefined"  )
				scrollY = document.documentElement.scrollTop;

			var marginTop = 0,
			popUpWinHeight = 0;

			var is_5g_scanning = false;
			$('.loadingMessage').each(function(index, ele) {
				if( $(this).css('display') != 'none' && $(this).hasClass('wait5g') )
					is_5g_scanning = true;

				if ( $(this).outerHeight() > popUpWinHeight )
					popUpWinHeight = $(this).outerHeight();
			});
			$('.modalBox').each(function(ele, index) {
				if ( $(this).outerHeight() > popUpWinHeight )
					popUpWinHeight = $(this).outerHeight();
			});

			if ( $('.running:first', '.main').length ) {
				if ( scrollY + popUpWinHeight > $('.main:first').outerHeight() )
					return;
			}

			if ( popUpWinHeight < winHeight ) {
				marginTop = scrollY + (winHeight - popUpWinHeight )/3;
			} else {
				if ( scrollY + winHeight < popUpWinHeight )
					marginTop = 0;
				else
					marginTop = scrollY - popUpWinHeight + winHeight;
			}

			$('.loadingMessage').css("margin-top", marginTop);
			if(is_5g_scanning && window.innerWidth <= 640 ){
				var body_2g_height = parseInt($('#availableNetworks').css('height').replace('px', ''));
				if( $('#locationInfo').css('display') != 'none' ) {
					$('.loadingMessage').css("margin-top", marginTop - body_2g_height - 80 );
				} else{
					$('.loadingMessage').css("margin-top", marginTop - body_2g_height);
				}
			}
			$('.modalBox').css("margin-top", marginTop);
		}

		function ie8_resize() {
			if ( !isIE || parseInt(version, 10) != 8 )
				return;
			var winWidth = Math.min(document.documentElement.clientWidth, document.body.clientWidth);
			$('body').removeClass('w980 w800 w768 w650 w640 w600 w540 w525 w480 w400 w350 w280 w180');
			if ( winWidth <= 980 ) {
				$('body').addClass('w980');
			}
			if ( winWidth <= 800 ) {
				$('body').addClass('w800');
			}
			if ( winWidth <= 768 ) {
				$('body').addClass('w768');
			}
			if ( winWidth <= 650 ) {
				$('body').addClass('w650');
			}
			if ( winWidth <= 640 ) {
				$('body').addClass('w640');
			}
			if ( winWidth <= 600 ) {
				$('body').addClass('w600');
			}
			if ( winWidth <= 540 ) {
				$('body').addClass('w540');
			}
			if ( winWidth <= 525 ) {
				$('body').addClass('w525');
			}
			if ( winWidth <= 480 ) {
				$('body').addClass('w480');
			}
			if ( winWidth <= 400 ) {
				$('body').addClass('w400');
			}
			if ( winWidth <= 350 ) {
				$('body').addClass('w350');
			}
			if ( winWidth <= 280 ) {
				$('body').addClass('w280');
			}
			if ( winWidth < 180 ) {
				$('body').addClass('w180');
			}
			//status page
			$('img:first', '.currentConnection.accesspoint').attr('src','img/currentConnectionAP1.png');
			$('img:eq(2)', '.currentConnection.accesspoint').attr('src','img/currentConnectionAP2.png');
			if ( winWidth <= 540 ) {
				$("img[src$='outputPower.png']").attr('src', 'img/outputPowerSmall.png');
			} else {
				$("img[src$='outputPowerSmall.png']").attr('src', 'img/outputPower.png');
			}
			if ( winWidth <= 600 ) {
				$("img[src$='internet1.png']").attr('src','img/internet2.png');
			} else {
				$("img[src$='internet2.png']").attr('src','img/internet1.png');
			}
			if ( typeof(diff_product) != "undefined" && typeof(host_name) != "undefined" && diff_product == 1) {
				$("img[src$='product1.png']").attr('src','img/'+host_name+'/product1.png');
				$("img[src$='product2.png']").attr('src','img/'+host_name+'/product2.png');
			}
		}

		function resize_wps_img() {
			if ( $('.wps_bg').length ) {
				var winHeight = window.innerHeight,
				winWidth = window.innerWidth;
				if ( typeof(window.innerHeight ) == "undefined" ){
					winHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
					winWidth = Math.min(document.documentElement.clientWidth, document.body.clientWidth);
				}
				var imgHeight = Math.max(winHeight - $('#fixedHeader').outerHeight() - $('#fixedFooter').outerHeight() - 300, 100);
				imgHeight = Math.min(imgHeight, 278);
				var imgWidth = imgHeight * 500 / 347;
				if ( imgWidth > winWidth ) {
					imgWidth = winWidth;
					imgHeight = imgWidth * 347 / 500;
				}
				$('.wps_bg').css('width', imgWidth);
				$('.wps_bg').css('height', imgHeight);
				var wpsMainWidth = $('.wpsMain:first').outerWidth();
				var marginLeft = Math.max((wpsMainWidth - imgWidth ) / 2, 0 );
				$('.wps_bg').css('margin-left', marginLeft);
				$('.wps_bg').css('margin-right', marginLeft);
			}
		}

		function resize() {
			ie8_resize();
			if ($('.loginbox').length) {
				var newHeight  = parseInt($(window).height()) - parseInt($('.footer').height()) - parseInt($('body').css('padding-top'));
				newHeight = newHeight - parseInt($('.loginbox').css('margin-top')) - parseInt($('.loginbox').css('margin-bottom'));
				newHeight =  newHeight < parseInt($('.loginbox').css('min-height')) ? parseInt($('.loginbox').css('min-height')) : newHeight;
				$('.loginbox').css('height', newHeight+"px");
			}
			fixed_modal();
			tablet_phone_navigation();
			resize_wps_img();
		}
		
		//resize loginbox when access login page
		resize();
		
		/*******************************************************************************************
		 *
		 *	page resizing
		 *  When a browser window resize occurs we force a page reload so the page is 
		 *  initialized properly
		 *
		 ******************************************************************************************/
		$(window).resize (function () {
			resize();
		});

		$(window).scroll (function () {
			fixed_modal();

			//For Timeout
			timestamp = new Date().getTime();
		});
		$(document).click (function () {
			timestamp = new Date().getTime();
		});
		$(document).keydown (function () {
			timestamp = new Date().getTime();
		});
		
		/*******************************************************************************************
		*
		*	modal popups
		*
		******************************************************************************************/
		if ($('.modal').length) {
			var $modal = $('.modal'),
			$screen = "<div id='modalOverlay'></div>";
			// load the overlay 
			if ( !$('#modalOverlay').length )
				$('body').append($screen);

			// attach click handler on every modal link on this page
			$modal.each(function (i) {

				// we use the link index to create a unique id for each modal box
				var $thisLink = $(this),
				linkIndex = i + 1;

				/**
				* this is the first click only, we build the modal box and load the content
				* any further click will be dealt with a different click handler
				*/
			    if( '1' == have_location && '2' == confMode && 'wifiNote' == $thisLink.attr('id') ) {
				$thisLink.on('click', function (e) {
					// build the modal box
					var modalBoxID = 'modalBox' + linkIndex,
					$modalBox = $("<div id='" + modalBoxID + "' class='modalBox'><div class='loadingModal'></div></div>");

					// activate the overlay
					$('#modalOverlay').addClass('active');
					$('#modalOverlay').fadeIn('fast');
					$('body').append($modalBox);

					// check if we are overwriting the width with a data attribute
					// if width exsists we overwrite the css
					if(typeof($thisLink.data('popup-type')) != "undefined" && $thisLink.data('popup-type') !== null) {
						$('#' + modalBoxID).addClass($thisLink.data('popup-type'));
					}

					// get the url from the link
					var modalBoxContentURL = $thisLink.attr('href'),
					$thisModalBox = $('#' + modalBoxID);

					// and load the content into the modal box
					$thisModalBox.load(modalBoxContentURL, function (res, sta, xhr) {
						var json;
						try {
							json = eval("(" + res + ")");
						} catch ( e ) {
						} finally {
							if ( typeof(json) === "object" ) {
								$thisModalBox.hide();
								$.reset_login(json);
							}
						}
						// attach a close handler
						$thisModalBox.find('.close').click(function () {
							$($thisModalBox).remove();
							$('#modalOverlay').fadeOut();
						});
						fixed_modal();
					}); // end of load content

					/**
					* this is the click handler for all subsequent clicks
					*/
					$thisLink.click(function () {
						$.get($(this).attr('href'), function(res){
							var json;
							try {
								json = eval("(" + res + ")");
							} catch ( e ) {
							} finally {
								if ( typeof(json) === "object" && $.reset_login(json) )
									return false;
								$('#modalOverlay').fadeIn();
								$($thisModalBox).fadeIn("normal", function(){
									fixed_modal();
								});
							}
						});
						return false;
					});

					return false;

				}); // end first click
			    } else {
				$thisLink.one('click', function (e) {

					// build the modal box
					var modalBoxID = 'modalBox' + linkIndex,
					$modalBox = $("<div id='" + modalBoxID + "' class='modalBox'><div class='loadingModal'></div></div>");

					// activate the overlay
					$('#modalOverlay').addClass('active');
					$('#modalOverlay').fadeIn('fast');
					$('body').append($modalBox);

					// check if we are overwriting the width with a data attribute
					// if width exsists we overwrite the css
					if(typeof($thisLink.data('popup-type')) != "undefined" && $thisLink.data('popup-type') !== null) {
						$('#' + modalBoxID).addClass($thisLink.data('popup-type'));
					}

					// get the url from the link
					var modalBoxContentURL = $thisLink.attr('href'),
					$thisModalBox = $('#' + modalBoxID);

					// and load the content into the modal box
					$thisModalBox.load(modalBoxContentURL, function (res, sta, xhr) {
						var json;
						try {
							json = eval("(" + res + ")");
						} catch ( e ) {
						} finally {
							if ( typeof(json) === "object" ) {
								$thisModalBox.hide();
								$.reset_login(json);
							}
						}
						// attach a close handler
						$thisModalBox.find('.close').click(function () {
							$($thisModalBox).fadeOut();
							$('#modalOverlay').fadeOut();
						});
						fixed_modal();
					}); // end of load content

					/**
					* this is the click handler for all subsequent clicks
					*/
					$thisLink.click(function () {
						$.get($(this).attr('href'), function(res){
							var json;
							try {
								json = eval("(" + res + ")");
							} catch ( e ) {
							} finally {
								if ( typeof(json) === "object" && $.reset_login(json) )
									return false;
								$('#modalOverlay').fadeIn();
								$($thisModalBox).fadeIn("normal", function(){
									fixed_modal();
								});
							}
						});
						return false;
					});

					return false;

				}); // end first click   
			    }
			}); // end each link
		}

		/*******************************************************************************************
		 *
		 * Rewrite alert and confirm dialog
		 *
		 *******************************************************************************************/
		$.alertBox = function(msg, str, act) {
			if ( !$('#modalOverlay').length ) {
				$('body').append("<div id='modalOverlay'></div>");
			}
			$('#modalOverlay').addClass('active');
			$('#modalOverlay').fadeIn('fast');
			
			var date = new Date();
			var id = "alert"+date.getTime();
			var close = function() {
				if ( $('.modalBox:visible').length == 1 ){
					$('#modalOverlay').fadeOut();
				}
				$('#'+id).fadeOut();
				$('#'+id).remove();
			},
			action = close;

			if ( !str ) str = ok_mark;
			if ( typeof(act) == "function" ) {
				action = function() {
					act();
					close();
				}
			}

			var data = "<div id='"+id+"'class='modalBox'><div class='recommendation'><p>"
				+ msg + "</p><div class='centerButtons'><div class='boxButtons'><a class='btn primary close' id='"+id+"Ok'>"
				+ str + "</a></div></div></div></div>";
			$('body').append(data);
			$('#'+id+'Ok').click(action);
			fixed_modal();
		};

		$.confirmBox = function(msg, str1, act1, str2, act2) {
			if ( !$('#modalOverlay').length ) {
				$('body').append("<div id='modalOverlay'></div>");
			}
			$('#modalOverlay').addClass('active');
			$('#modalOverlay').fadeIn('fast');
			
			var date = new Date();
			var id = "alert"+date.getTime();
			var close = function() {
				if ( $('.modalBox:visible').length == 1 ){
					$('#modalOverlay').fadeOut();
				}
				$('#'+id).fadeOut();
				$('#'+id).remove();
			},
			action1 = close,
			action2 = close;
			if ( !str1 ) str1 = ok_mark;
			if ( !str2 ) str2 = cancel_mark;
			if ( typeof(act1) == "function" ) {
				action1 = function() {
					act1();
					close();
				};
			}
			if ( typeof(act2) == "function" ) {
				action2 = function() {
					act2();
					close();
				};
			}


			var data = "<div id='"+id+"'class='modalBox'><div class='recommendation'><p>"
				+ msg + "</p><div class='centerButtons'><div class='boxButtons'><a class='btn primary close' id='"+id+"Cancel'>"
				+ str2 + "</a><a class='btn primary close' id='"+id+"Ok'>"
				+ str1 + "</a></div></div></div></div>";
			$('body').append(data);
			$('#'+id+'Ok').click(action1);
			$('#'+id+'Cancel').click(action2);
			fixed_modal();
		};

		$.confirmBox2 = function(msg, str1, act1, str2, act2, str3, act3, str4, act4) {
			if ( !$('#modalOverlay').length ) {
				$('body').append("<div id='modalOverlay'></div>");
			}
			$('#modalOverlay').addClass('active');
			$('#modalOverlay').fadeIn('fast');

			var date = new Date();
			var id = "alert"+date.getTime();
			var close = function() {
				if ( $('.modalBox:visible').length == 1 ){
					$('#modalOverlay').fadeOut();
				}
				$('#'+id).fadeOut();
                                $('#'+id).remove();
                        },
                        action1 = close,
                        action2 = close,
			action3 = function() {
				if($('input:radio[name="change_channel"]:checked').val() == "1"){
					$(".btn.primary.ok").prop('disabled', false);
					$(".btn.primary.cancel").prop('disabled', true);
				}
			},
			action4 = function() {
				if($('input:radio[name="change_channel"]:checked').val() == "0"){
					$(".btn.primary.cancel").prop('disabled', false);
					$(".btn.primary.ok").prop('disabled', true);
				}
			};
                        if ( !str1 ) str1 = ok_mark;
                        if ( !str2 ) str2 = cancel_mark;
                        if ( typeof(act1) == "function" ) {
                                action1 = function() {
                                        act1();
                                        close();
                                };
                        }
                        if ( typeof(act2) == "function" ) {
                                action2 = function() {
                                        act2();
                                        close();
                                };
			}

			var data = "<div id='"+id+"'class='modalBox'><div class='recommendation'><p>"
                                + msg + "</p><div class=''><label for='haveChanged'><input type='radio' name='change_channel' id='haveChanged' value='1'> " 
				+ str3 + "</label><br><label for='noChanged'><input type='radio' name='change_channel' id='noChanged' value='0'> "
				+ str4 + "</label></div><div class='centerButtons'><div class='boxButtons'><input type='button' value='"
				+ cancel_mark + "' class='btn primary cancel' disabled='' id='"
				+id+"Cancel'><input type='button' value='"
				+ ok_mark +"' class='btn primary ok' id='"
				+id+"Ok' disabled=''></div></div></div></div>";
                        $('body').append(data);
                        $('#'+id+'Ok').click(action1);
                        $('#'+id+'Cancel').click(action2);
			$('#haveChanged').click(action3);
			$('#noChanged').click(action4);
                        fixed_modal();
		}

		$.submit_wait = function(container, string) {
			$(container).append(string);
			fixed_modal();
		};
			
		/*******************************************************************************************
		*
		*    support own style of checkbox.
		*
		*******************************************************************************************/
		if ($(':checkbox').length) {
			$('body').find(':checkbox').on('change', function () {
				if($(this).is(':checked')) {
					$(this).addClass('checked');
				} else {
					$(this).removeClass('checked');
				}
			});
		}

		/*******************************************************************************************
		*
		*	show password
		*
		******************************************************************************************/

		if ($('.showPwd').length) {
			// add the show password function
			// on checkbox click we adjust the password field type
			if ( isIE && parseInt(version, 10) <= 8 ) {
				$('.showPwd').each(function(i, ele){
					var passwordInput = $(ele).parents('.formElements').find('.pwd').parent();
					var newEle = "<input type=\"text\" class=\"pwdText\" style=\"display:none;\" />";
					$(passwordInput).append(newEle);
				});
			}
			$('.showPwd').on('change', function () {
				var passwordInput = $(this).parents('.formElements').find('.pwd, .primaryPwd'),
				textInput = $(this).parents('.formElements').find('.pwdText'),
				verifyPwd = $(this).parents('.formElements').find('.verifyPwd'),
				verifyText = $(this).parents('.formElements').find('.verifyText');
				if ($(this).is(':checked')) {
					// we change the type of the password field to text so we can see the password
					if ( textInput.length ) {
						var text_value = passwordInput.val();
						textInput.val(text_value);
						textInput.show();
						passwordInput.hide();
					} else {
						passwordInput.attr('type', 'text');
					}
					if ( verifyText.length ) {
						var verify_val = verifyPwd.val();
						verifyText.val(verify_val);
						verifyText.show();
						verifyPwd.hide();
					} else if( verifyPwd.length ) {
						 verifyPwd.attr('type', 'text');
					}
				} else {
					if ( isIE && parseInt(version, 10) <= 8 ) {
						textInput.hide();
						passwordInput.show();
					} else {
						passwordInput.attr('type', 'password');
					}
					if ( verifyText.length ) {
						verifyText.hide();
						verifyPwd.show();
					} else  if( verifyPwd.length ) {
						verifyPwd.attr('type', 'password');
					}
				}
			});

			// when the password field gets focus and the show password checkbox is enabled
			// we change the password field type to text
			$('.pwd').on('focus',function () {
				var textInput = $(this).parents('.formElements').find('.pwdText').first();
				if ($(this).parents('.formElements').find('.showPwd').is(':checked')) {
					// we change the type of the password field to text so we can see the password
					if ( textInput.length ) {
						textInput.show();
						$(this).hide();
					} else {
						$(this).attr('type', 'text');
					}
				} else {
					if ( textInput.length ) {
						textInput.hide();
						$(this).show();
					} else {
						$(this).attr('type', 'password');
					}
				}
			});

			// enable next button after password input
			$('.pwd').on('keyup', function () {
				var pwdInput = $(this).val(),
				textInput = $(this).parents('.formElements').find('.pwdText').first();
				var passwordInput = $(this).parents('.formElements').find('.pwd');
				passwordInput.val(pwdInput);
				if ( textInput.length ) {
					textInput.val(pwdInput);
				}
			});

			$('.pwdText').on('keyup', function () {
				var value = $(this).val(),
				passwordInput = $(this).parents('.formElements').find('.pwd');
				passwordInput.val(value);
				passwordInput.keyup();
			});
			$('.pwdText').on('mouseout', function() {
				var value = $(this).val(),
				passwordInput = $(this).parents('.formElements').find('.pwd');
				passwordInput.val(value);
				passwordInput.keyup();
			});
		} // end enterPwd

		/*******************************************************************************************
		*
		*	security select
		*
		******************************************************************************************/
		$.checkSecurity = function(secTypeId, wepEncId, pwdId) {
			var key_obj;
			if ( have_wireless_an == "1" )
				key_obj = $('.column.first').find('.key');
			else
				key_obj = $('.key'); 
			if ( $('#whatPwd').val() == "0" || $('#whatPwd').length == 0 ) {
				var sec_type = $('#'+secTypeId).val();
				switch(sec_type) {
					case '2': //WEP
						key_obj.each(function(i, ele) {
							var reg = $.REG_KEY_64,
							msg = wep_64;
							if ( $('#'+wepEncId).val() == '13' ) {
								reg = $.REG_KEY_128;
								msg = wep_128;
							}
							if ( ( $(ele).val() != '' && !reg.test($(ele).val()) )
								|| ( $(ele).parent().find('input[type=radio]').is(':checked') && !reg.test($(ele).val()) )) {
								$.addErrMsgAfter($(ele).attr('id'), msg, false, 'err_wep');
							}
						});
						break;
					case '3': // WPA-PSK [TKIP]
					case '4': // WPA2-PSK [AES]
					case '5': // WPA-PSK [TKIP] + WPA2-PSK [AES]
						 if ( !$.REG_WPA_PWD.test($('#'+pwdId).val()) ) {
							$.addErrMsgAfter(pwdId, wpa_phrase, false, 'err_pripass');
						 }
						break;
					case '1':
						break;
					default:
						$.addErrMsgAfter(secTypeId, no_security);
				}
			}
		};

		$.checkSecurity5g = function(secTypeId, wepEncId, pwdId) {
			if ( $('#whatPwd5g').val() == "0" || $('#whatPwd5g').length == 0 ) {
				var sec_type = $('#'+secTypeId).val();
				switch(sec_type) {
					case '2': //WEP
						$('.column.second').find('.key').each(function(i, ele) {
							var reg = $.REG_KEY_64,
							msg = wep_64;
						if ( $('#'+wepEncId).val() == '13' ) {
							reg = $.REG_KEY_128;
							msg = wep_128;
						}
						if ( ( $(ele).val() != '' && !reg.test($(ele).val()) )
							|| ( $(ele).parent().find('input[type=radio]').is(':checked') && !reg.test($(ele).val()) )) {
								$.addErrMsgAfter($(ele).attr('id'), msg, false, 'err_wep_5g');
							}
						});
						break;
					case '3': // WPA-PSK [TKIP]
					case '4': // WPA2-PSK [AES]
					case '5': // WPA-PSK [TKIP] + WPA2-PSK [AES]
						if ( !$.REG_WPA_PWD.test($('#'+pwdId).val()) ) {
							$.addErrMsgAfter(pwdId, wpa_phrase, false, 'err_pripass_5g');
						}
						break;
					case '1':
						break;
					default:
						$.addErrMsgAfter(secTypeId, no_security);
				}
			}
		};

		$.checkSecurity5g2 = function(secTypeId, wepEncId, pwdId) {
                        if ( $('#whatPwd5g2').val() == "0" || $('#whatPwd5g2').length == 0 ) {
                                var sec_type = $('#'+secTypeId).val();
                                switch(sec_type) {
                                        case '2': //WEP
                                                $('.column.third').find('.key').each(function(i, ele) {
                                                        var reg = $.REG_KEY_64,
                                                        msg = wep_64;
                                                if ( $('#'+wepEncId).val() == '13' ) {
                                                        reg = $.REG_KEY_128;
                                                        msg = wep_128;
                                                }
                                                if ( ( $(ele).val() != '' && !reg.test($(ele).val()) )
                                                        || ( $(ele).parent().find('input[type=radio]').is(':checked') && !reg.test($(ele).val()) )) {
                                                                $.addErrMsgAfter($(ele).attr('id'), msg, false, 'err_wep_5g');
                                                        }
                                                });
                                                break;
                                        case '3': // WPA-PSK [TKIP]
                                        case '4': // WPA2-PSK [AES]
                                        case '5': // WPA-PSK [TKIP] + WPA2-PSK [AES]
                                                if ( !$.REG_WPA_PWD.test($('#'+pwdId).val()) ) {
                                                        $.addErrMsgAfter(pwdId, wpa_phrase, false, 'err_pripass_5g2');
                                                }
                                                break;
                                        case '1':
						 break;
                                        default:
                                                $.addErrMsgAfter(secTypeId, no_security);
				}
			}
                };

		/*******************************************************************************************
                * Smart connect function
		* @param {tag} - which port(2.4g/5g/) need be changed.
				 '' means 2g;
				 '5g' mean 5g(include 5g low and 5g hign).
                * @param {tag2} - which port(2.4g/5g) should tag copy from.
				 '' means 2g;
				 '5g' mean 5g(include 5g low and 5g hign).
		* @param {num}/{num2} - '2' means 5g2;
					'' means 2g or 5g.
                *
                ******************************************************************************************/
                $.sameSecurity = function(tag, num, tag2, num2) {
			var sec_type = $('#secType'+tag+num).val();
			var sec_type2 = $('#secType'+tag2+num2).val();
			$('#secType'+tag+num).val(sec_type2);

			switch(sec_type2) {
				case '0'://Security Options
					$('.wep').slideUp();
                                        $('.wpa').slideUp();
					break;
				case '1'://None (only ap mode has)
					$('#secType'+tag+num).val(sec_type2);
					$('#secType'+tag+num).val('1');
                                        $('.wep').slideUp();
                                        $('.wpa').slideUp();
					break;
				case '2': //WEP
					$('#opmode'+tag+num).val('1');
					if(num == "2")
						$.changeWEPShowHidden5g2();
					if(tag == "5g" && num != "2")
						$.changeWEPShowHidden5g();
					if(tag != "5g" && num != "2")
						$.changeWEPShowHidden();
					var secOptions = document.getElementById('secType'+tag+num);
					secOptions.options[2].value = '2';
					secOptions.options[2].text = sec_wep_phrase;
					secOptions.options[3].value = '4';
					secOptions.options[3].text = sec_wpa2_phrase;
					secOptions.options[4] = new Option(sec_wpas_phrase, '5');new Option(sec_wpas_phrase, '5');
					$('#secType'+tag+num).val(sec_type2);
					$('.wep').slideDown();
					$('.wpa').slideUp();
					$('#wepAuth'+tag+num).val($('#wepAuth'+tag2+num2).val());
					$('#wepEnc'+tag+num).val($('#wepEnc'+tag2+num2).val());
					$('#wepEnc'+tag+num).trigger('change');
					if($('#wepKeyNo'+tag2+'1'+num2).is(':checked') ==  true){
						$('#wepKeyNo'+tag+'1'+num).prop('checked', true);
					}else if($('#wepKeyNo'+tag2+'2'+num2).is(':checked') ==  true){
                                                $('#wepKeyNo'+tag+'2'+num).prop('checked', true);
					}else if($('#wepKeyNo'+tag2+'3'+num2).is(':checked') ==  true){
                                                $('#wepKeyNo'+tag+'3'+num).prop('checked', true);
					}else if($('#wepKeyNo'+tag2+'4'+num2).is(':checked') ==  true){
                                                $('#wepKeyNo'+tag+'4'+num).prop('checked', true);
					}
					$('#key'+tag+'1'+num).val($('#key'+tag2+'1'+num2).val());
					$('#key'+tag+'2'+num).val($('#key'+tag2+'2'+num2).val());
					$('#key'+tag+'3'+num).val($('#key'+tag2+'3'+num2).val());
					$('#key'+tag+'4'+num).val($('#key'+tag2+'4'+num2).val());
					break;
				case '4'://WPA2-PSK [AES]
					$('#passphrase'+tag+num).val($('#passphrase'+tag2+num2).val());
					$('#verifyPwd'+tag+num).val($('#verifyPwd'+tag2+num2).val());
					$('.wep').slideUp();
					$('.wpa').slideDown();
					break;
				case '5':// WPA-PSK [TKIP] + WPA2-PSK [AES]
					$('#passphrase'+tag+num).val($('#passphrase'+tag2+num2).val());
                                        $('#verifyPwd'+tag+num).val($('#verifyPwd'+tag2+num2).val());
                                        $('.wep').slideUp();
                                        $('.wpa').slideDown();
                                        break;
			}
		};
		$.changeWepEncr = function(wepEncId) {
			$('#'+wepEncId).parent().parent().find('.key').val('');
			$('#'+wepEncId).parent().parent().find('.key').attr('maxlength', $('#'+wepEncId).val()*2);
			$('#'+wepEncId).parent().parent().find('.key').next().remove();// remove .errorMsg
		};

		if ($('.whatPwd').length) {
			// change of the password option will reveal the associated fields
			$('.whatPwd').on('change', function () {
				var thisParent = $(this).parents('.formElements');

				if ($(this).val() === '0') {
					thisParent.find('.securityOptionsWrap').slideDown();
					thisParent.find('.securityOptions').prop('selectedIndex', 0);
					$('.securityOptions').trigger('change');
				} else {
					thisParent.find('.securityOptionsWrap').slideUp();
					// we have selected same or none password, we'll reset all password releated selections 
					thisParent.find('.securityOptions').prop('selectedIndex', 0);
					// hide the password pane
					thisParent.find('.pwdInput').hide();
					// reset the password fields
					//thisParent.find('.pwdInput').find(':password').val('');
				}
			});

			$('.securityOptions').on('change', function () {

				var thisParent = $(this).parents('.formElements');
				var sel = thisParent.find('.whatPwd').val();

				if ($(this).val() > 2 && sel == "0") {
					thisParent.find('.wep').slideUp();
					thisParent.find('.wpa').slideDown();
				} else if ($(this).val() > 1 && sel == "0") {
					thisParent.find('.wep').slideDown();
					thisParent.find('.wpa').slideUp();
				} else {
					// hide the password pane
					thisParent.find('.pwdInput').slideUp();
					// reset the password fields
					//thisParent.find('.pwdInput').find(':password').val('');
				}   
			});
			
			$('this').trigger('change');
		}

		/*******************************************************************************************
		*
		*	switch language
		*
		******************************************************************************************/
		$.switch_language = function(value, show_value)
		{
			if ( show_value != $("#curLang").html() )
			{
				$("#curLang").html(show_value);
				$("#hiddenLangAvi").val(value);
				$("nav").hide();
				$('.container:first', '#content').hide();
				$('.main.clearfix:first').hide();
				$('#fixedFooter').hide();
				if ( $('.promo:first').length )
					$('<div class="main clearfix changing_lang">' + $.SWITCH_LANG_DIV + '</div>').insertBefore($('.promo:first'));
				if ( $('.container:first', '#content').length )
					$('<div class="container changing_lang">' + $.SWITCH_LANG_DIV + '</div>').insertAfter($('.container:first', '#content'));
				$.postForm('#langForm','',function(json) {
					$("input[name='submit_flag']", "#langForm").val('select_language');
					if ( json.status == "1" ) {
						$("input[name='submit_flag']", "#langForm").val('change_language');
						if ( json.lang_in_flash == "1" ) {
							$.postForm('#langForm','',function(json) {
								if ( json.status == "1" ) {
									document.location.reload();
								} else {
									$('.changing_lang').remove();
									$.alertBox(json.msg);
								}
							});
						} else {
							$('.changing_lang').remove();
							$.confirmBox(ml_switch+json.from+ml_curlang+json.to,
								null,
								function() {
									if ( $('.promo:first').length )
										$('<div class="main clearfix">' + $.SWITCH_LANG_DIV + '</div>').insertBefore($('.promo:first'));
									if ( $('.main.clearfix:first').length )
										$('<div class="container">' + $.SWITCH_LANG_DIV + '</div>').insertAfter($('.container:first', '#content'));
									$.postForm('#langForm','',function(json) {
										if ( json.status == "1" ) {
											document.location.reload();
										} else {
											$('.changing_lang').remove();
											$.alertBox(json.msg);
										}
								});
								}, null, null);
						}
					} else {
						$('.changing_lang').remove();
						$("nav").show();
						$('.container:first', '#content').show();
						$('.main.clearfix:first').show();
						$('#fixedFooter').show();
						$.alertBox(json.msg);
					}
				});
					
			}
			else
			{
				$("ul", "#language").css("display", "none");
				setTimeout('$("ul", "#language").removeAttr("style")', 10);
			}
		};

		/*******************************************************************************************
		 *
		 * Restart device process
		 *
		 ******************************************************************************************/
		$.processing = function(pass_time, total_time, one_wifi){
			$('nav').hide();
			$('.sidebar').hide();
			$('#slider').hide();
			$('.running').remove();
			$('.reboot').show();
			clearTimeoutVars();
			var per;
			if ( isIE && version == 8 ) {
				if( pass_time < total_time ) {
					per = parseInt((pass_time * 100 / total_time)/11,10);
					if ( per != 9 ){
						$('div:first', '.roundedProcess').attr('class', 'per'+(per*11));
						$('.perText', '.roundedProcess').html(per*11+"%");
					}
					pass_time++;
					setTimeout("$.processing("+pass_time+","+total_time+","+one_wifi+");", 1000);
				} else {
					$('div:first', '.roundedProcess').attr('class', 'per100');
					$('.perText', '.roundedProcess').html("100%");
					if( one_wifi == "1" && confMode == "2")
						$.change_domain("/status.htm", httphost);
					else
						$.change_domain2("/status.htm", httphost);
				}
			} else {
				if ( pass_time < total_time/2 ) {
					per = parseInt(pass_time * 100 / total_time, 10);
					var i = parseInt(pass_time * 360 / total_time, 10);
					$(".pie1").css("-ms-transform", "rotate(" + i + "deg)");
					$(".pie1").css("-o-transform","rotate(" + i + "deg)");
					$(".pie1").css("-moz-transform","rotate(" + i + "deg)");
					$(".pie1").css("-webkit-transform","rotate(" + i + "deg)");
					$(".pie2").css("-ms-transform", "rotate(0deg)");
					$(".pie2").css("-o-transform","rotate(0deg)");
					$(".pie2").css("-moz-transform","rotate(0deg)");
					$(".pie2").css("-webkit-transform","rotate(0deg)");
					pass_time++;
					setTimeout("$.processing("+pass_time+","+total_time+","+one_wifi+");", 1000);
				} else if ( pass_time < total_time ) {
					per = parseInt(pass_time * 100 / total_time, 10);
					var i = parseInt((pass_time - (total_time/2)) * 360 / total_time, 10);
					$(".pie2").css("-ms-transform", "rotate(" + i + "deg)");
					$(".pie2").css("-o-transform","rotate(" + i + "deg)");
					$(".pie2").css("-moz-transform","rotate(" + i + "deg)");
					$(".pie2").css("-webkit-transform","rotate(" + i + "deg)");
					$(".pie1").css("-o-transform","rotate(180deg)");
					$(".pie1").css("-moz-transform","rotate(180deg)");
					$(".pie1").css("-webkit-transform","rotate(180deg)");
					$(".pie1").css("-ms-transform", "rotate(180deg)");
					pass_time++;
					setTimeout("$.processing("+pass_time+","+total_time+","+one_wifi+");", 1000);
				} else {
					per = 100;
					$(".pie1").css("-o-transform","rotate(180deg)");
					$(".pie1").css("-ms-transform", "rotate(180deg)");
					$(".pie1").css("-moz-transform","rotate(180deg)");
					$(".pie1").css("-webkit-transform","rotate(180deg)");
					$(".pie2").css("-o-transform","rotate(180deg)");
					$(".pie2").css("-moz-transform","rotate(180deg)");
					$(".pie2").css("-webkit-transform","rotate(180deg)");
					$(".pie2").css("-ms-transform", "rotate(180deg)");
				}
				$('.perText', '.roundedProcess').html(per+"%");
				if ( per == 100 ) {
					if( one_wifi == "1" && confMode == "2")
						$.change_domain("/status.htm", httphost);
					else
						$.change_domain2("/status.htm", httphost);
				}
			}
		};

		/*******************************************************************************************
		 *
		 * Add id for each <a>
		 *
		 ******************************************************************************************/
		$('a').each(function(i, ele) {
			var old_href = $(this).attr("href");
			if ( typeof(old_href) != "undefined" && old_href != ""
				&& old_href.indexOf("http") == -1
				&& old_href != "#" && old_href.indexOf('(') == -1) {
				$(this).attr("href", old_href+$.ID_2);
			}
		});


		/*******************************************************************************************
		*
		*	footer search
		*
		******************************************************************************************/
		if ($('footer').find('.search').length) {
			// move label into the placeholder attribute
			$('footer').find('.search').find('input').each(function () {
				var inputType = $(this).attr('type'), labelText;
				labelText = $(this).siblings('label').text(); // get the label text
				$(this).attr('placeholder', labelText); // and insert it as a plceholder
				$(this).siblings('label').hide(); // now hide the label

			});
		}

		/*******************************************************************************************
		*
		*	phone table cell labels
		*  on a phone we present tables of type "devicesList in a linear form. we hide the table  
		*  header and insert label into each cell with the header text. 
		*
		******************************************************************************************/
		// for led.htm, usb_storage/usbPort.htm, connectDevices.htm
		if ($.isPhone && !isIE && $('.devicesList').length) {
			$('.devicesList').find('td').each( function () {
				// get the corresponding table header
				var $th = $(this).parents('table').find('th').eq($(this).index());
				// add a label ionto the table cell
				$(this).prepend("<span class='tdLabel'>" + $th.text() + ":</span>");
			});
		}

		/*******************************************************************************************
		*
		*	file input widget
		*
		******************************************************************************************/
		if ($('.fileInputWidget').length) {
			$('.fileInputWidget').find(':file').change( function () {
				var fileInput = $.trim($(this).val());
				$(this).parent().find('.fakeInputField').val(fileInput);
				if (fileInput != "") {
					$(this).parents('form').find(':submit').prop('disabled', false);
				} else {
					$(this).parents('form').find(':submit').prop('disabled', true);
				}
			});
		} // end file input widget

		/*******************************************************************************************
		 *
		 * search help
		 *
		 ******************************************************************************************/
		if ( $('.dnintg-search').length ) {
			$('.dnintg-search').click(function(){
				do_search()
			});
		}
		if ( $('#footerSearchField').length ) {
			$('#footerSearchField').keyup(function(e) {
				var key = $(this).val(),
				e = e || event,
				keycode = e.which || e.keyCode;

				if(key.length > 0 ) {
					$(this).addClass('searchInput');
				} else {
					$(this).removeClass('searchInput');
				}
                                
				if(keycode == 13)
					$('.dnintg-search').trigger('click');
			});
		}

		/*******************************************************************************************
		*
		*    support placeholder if the browser not support it.
		*
		*******************************************************************************************/
		// check if support placeholder.
		function placeholderSupport() {
			return 'placeholder' in document.createElement('input');
		}
		if(!placeholderSupport()) {
			$('[placeholder]').focus(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
				}
			}).blur(function() {
				var input = $(this);
				var pwdPlaceholder = "<input type='text' class='placeholder password' value='"
									+input.attr('placeholder')+"' placeholder='"
									+input.attr('placeholder')
									+"' onfocus='$(this).prev().show(); $(this).prev().focus(); $(this).remove();' />";
				if (  input.val() == '' || input.val() == input.attr('placeholder')) {
					if ( input.hasClass('password') ) {
						input.hide();
						$(pwdPlaceholder).insertAfter(input);
					} else {
						input.addClass('placeholder');
						input.val(input.attr('placeholder'));
					}
				}
			}).blur();
		}		

		// add setTimeout for refresh_wait.htm
		if ( $('#refreshWaitForm').length ) {
			setTimeout('location.href = "wifiSettings.htm'+$.ID_2+'";', 6000);
		}

		// checkbox of "Click the Continue button after you connect your WiFi devices."
		if ( $('#checkConnected').length ) {
			$('#checkConnected').click(function() {
				if( $(this).is(':checked') )
					$('#continueBt').prop('disabled', false);
				else
					$('#continueBt').prop('disabled', true);
			});
		}

		// Add bookmark function
		$.addBookmark = function() {
			var title = moduleName + ' Configuration',
			url = 'http://www.mywifiext.net';
			$.confirmBox(new_add_bookmark, yes_mark, function(){
				if (document.all) {
					window.external.addFavorite(url, title);
				} else if (window.sidebar) {
					try {
						window.sidebar.addPanel(title, url, "");
					} catch(e) {$.alertBox(msg_bookmark);
					}
				} else if (window.external) {
					try {
						window.external.AddFavorite(url, title);
					} catch(e) {$.alertBox(msg_bookmark);
					}
				} else if (window.opera && window.print) {
					$.alertBox(msg_bookmark);
				} else {
					$.alertBox(msg_bookmark);
				}
				$.checkFinish();
			}, no_mark, function(){
				$('#bookmark').prop('checked', false);
				$('#bookmark').removeClass('checked');
				$.checkFinish();
			});
		};

		//Timeout
		var timestamp, start_time, timeout, remind;
		timestamp = start_time = new Date().getTime();
		function clearTimeoutVars() {
			if ( typeof(timeout) != "undefined" )
				clearTimeout(timeout);
			if ( typeof(remind) != "undefined" )
				clearTimeout(remind);
		}
		function resetTimer(time) {
			clearTimeoutVars();
			if ( typeof(no_auth) != "undefined" && no_auth == "1")
				return false;
			timestamp = start_time = new Date().getTime();
			remind = setTimeout("$.checkTimeout();", time * 1000);
			return true;
		}
		function update_time() {
			var adjust = parseInt((timestamp - start_time)/1000, 10);
			if ( adjust == 0 )
				adjust = 5 * 60;
			$.ajax({
				url: "admin.cgi?/status.htm timestamp=" + $.TS + $.ID_1,
				type: "POST",
				data: { "submit_flag": "update_time",
					"adjust": adjust
				},
				dataType: 'json',
				contentType: "application/json; charset=utf-8",
				timeout: 45000,
				success: function(json) {
					if ( $.reset_login(json) )
						return false;
					if ( $.reload_page(json) ) {
						return false;
					}
					if ( json.status == 1 ) {
						resetTimer(adjust);
					} else {
						relogin();
					}
				},
				error: function() {
					relogin();
				}
			});
		}
		$.showTimeoutMsg = function() {
			$('.modalBox').remove();
			$('.running').remove();
			$.removeCookie('interim');
			if ( timestamp == start_time ){
				if ( typeof(timeout) != "undefined" )
					clearTimeout(timeout);
				timeout = setTimeout(function(){
						$.alertBox(timeout_msg,  ok_mark, function(){ relogin();});
					}, 3*1000);
			} else {
				update_time();
			}
		};
		$.checkTimeout = function() {
			if ( timestamp == start_time ){
				$.confirmBox(reset_timer, yes_mark, update_time, no_mark, function(){
					timestamp = start_time;
				});
				timeout = setTimeout("$.showTimeoutMsg()", (60-3) * 1000);
			} else {
				update_time();
			}
		};
			

		if (typeof(no_auth) != "undefined" && no_auth != "1" && typeof($.TS) != "undefined" && $.TS != "" && typeof(session_id) != "undefined" && session_id != ""){
			remind = setTimeout("$.checkTimeout();", 4 * 60 * 1000);
		}

		if ( $('.primaryPwd').length ) {
			if ( isIE && parseInt(version, 10) <= 8 ) {
				var newEle = "<input type=\"text\" class=\"pwdText\" style=\"display:none;\" />";
				$('.primaryPwd').parent().find('label').after(newEle);
			}

			$('.primaryPwd').focus(function () {
				var pwd = $(this).val(),
				thisParents = $(this).parents('.formElements'),
				pwdText = thisParents.find('.pwdText');

				if ($(this).parents('.formElements').find('.showPwd').is(':checked')) {
					if ( pwdText.length ) {
						pwdText.show();
						pwdText.focus();
						pwdText.val(pwd);
						$(this).hide();
					}else {
						$(this).attr('type', 'text');
					}
				}else{
					if ( pwdText.length ) {
						pwdText.hide();
						$(this).show();
					}else{
						$(this).attr('type', 'password');
					}
				}
			});

			$('.primaryPwd').keyup(function () {
				var pwd = $(this).val(),
                                thisParents = $(this).parents('.formElements'),
                                verifyPwd = thisParents.find('.verifyPwd'),
                                verifyText = thisParents.find('.verifyText'),
                                pwdText = thisParents.find('.pwdText');
                                if (pwd.length >= $.MIN_PWD_CHARACTERS) {
                                        verifyPwd.prop('disabled', false);
                                        if( verifyText.length )
                                                verifyText.prop('disabled', false);
                                        thisParents.find('span[id*=err_pripass]').remove();
                                } else {
                                        verifyPwd.prop('disabled', true);
                                        if( verifyText.length )
                                                verifyText.prop('disabled', true);
                                }

				if ( pwdText.length ) {
                                        pwdText.val(pwd);
                                }
                                var pwd2 = verifyPwd.val();
                                if(pwd2.length && pwd != pwd2) {
                                        if(!verifyPwd.hasClass('alert'))
                                                verifyPwd.addClass('alert');
                                        if(!thisParents.find('#err_passsame').length)
                                                $.addErrMsgAfter(verifyPwd.attr("id"), error_not_same_pwd, false, 'err_passsame');
                                } else if(pwd == pwd2){
                                        verifyPwd.removeClass('alert');
                                        thisParents.find('#err_passsame').remove();
                                }
			});

			$('.primaryPwd').change(function () {
				var pwd = $(this).val(),
				thisParents = $(this).parents('.formElements'),
				verifyPwd = thisParents.find('.verifyPwd'),
				verifyText = thisParents.find('.verifyText'),
				pwdText = thisParents.find('.pwdText');
				if (pwd.length >= $.MIN_PWD_CHARACTERS) {
					verifyPwd.prop('disabled', false);
					if( verifyText.length )
						verifyText.prop('disabled', false);
					thisParents.find('span[id*=err_pripass]').remove();
				} else {
					verifyPwd.prop('disabled', true);
					if( verifyText.length )
						verifyText.prop('disabled', true);
				}

				if ( pwdText.length ) {
					pwdText.val(pwd);
				}
				var pwd2 = verifyPwd.val();
				if(pwd2.length && pwd != pwd2) {
					if(!verifyPwd.hasClass('alert'))
						verifyPwd.addClass('alert');
					if(!thisParents.find('#err_passsame').length)
						$.addErrMsgAfter(verifyPwd.attr("id"), error_not_same_pwd, false, 'err_passsame');
				} else if(pwd == pwd2){
					verifyPwd.removeClass('alert');
					thisParents.find('#err_passsame').remove();
				}
			});

			$('.pwdText').on('keyup', function () {
				var value = $(this).val(),
				primaryPwd = $(this).parents('.formElements').find('.primaryPwd');
				primaryPwd.val(value);
				primaryPwd.keyup();
			});

			$('.pwdText').on('mouseout', function() {
				var value = $(this).val(),
				primaryPwd = $(this).parents('.formElements').find('.primaryPwd');
				primaryPwd.val(value);
				primaryPwd.keyup();
			});
		}

		$.pwdTextblur = function (obj, pwdId, errId) {
			var verify_obj = $(obj).parent().find('.primaryPwd');
			if( pwdId != verify_obj.attr('id') )
				return;
			var pwd = $(obj).val();
			$('#'+pwdId).val(pwd);
			$('#'+errId).remove();
			if (pwd.length < $.MIN_PWD_CHARACTERS) {
				$.addErrMsgAfter(pwdId, wpa_phrase, false, errId);
			} else {
				verify_obj.prop('disabled', false);
			}
		};
		$.checkPass = function() {
			var verify_obj;
			if ( have_wireless_an )
				verify_obj = $('.column.first').find('.primaryPwd');
			else
				verify_obj = $('.primaryPwd');
			if ( isIE && parseInt(version, 10) <= 8 ) {
				$('.pwdText').blur(function () {
					$.pwdTextblur(this, 'passphrase', 'err_pripass');
				});
			} else {
				verify_obj.blur(function () {
					var pwd = $(this).val();
					$('#err_pripass').remove();
					if ( pwd.length < $.MIN_PWD_CHARACTERS )
						$.addErrMsgAfter($(this).attr("id"), wpa_phrase, false, 'err_pripass');
					else
						verify_obj.prop('disabled', false);
				});
			}
		};

		$.checkPass5g = function() {
			if ( isIE && parseInt(version, 10) <= 8 ) {
				$('.pwdText').blur(function () {
					$.pwdTextblur(this, 'passphrase5g', 'err_pripass_5g');
				});
			} else {
				$('.column.second').find('.primaryPwd').blur(function () {
					var pwd = $(this).val();
					$('#err_pripass_5g').remove();
					if ( pwd.length < $.MIN_PWD_CHARACTERS )
					$.addErrMsgAfter($(this).attr("id"), wpa_phrase, false, 'err_pripass_5g');
					else
					$('.column.second').find('.verifyPwd').prop('disabled', false);
				});
			}
		};

		$.checkPass5g2 = function() {
                        if ( isIE && parseInt(version, 10) <= 8 ) {
                                $('.pwdText').blur(function () {
					$.pwdTextblur(this, 'passphrase5g2', 'err_pripass_5g2');
                                });
                        } else {
                                $('.column.third').find('.primaryPwd').blur(function () {
                                        var pwd = $(this).val();
                                        $('#err_pripass_5g2').remove();
                                        if ( pwd.length < $.MIN_PWD_CHARACTERS )
                                        $.addErrMsgAfter($(this).attr("id"), wpa_phrase, false, 'err_pripass_5g2');
                                        else
                                        $('.column.third').find('.verifyPwd').prop('disabled', false);
                                });
                        }
                };

		if( $('.verifyPwd').length ) {
			if ( isIE && parseInt(version, 10) <= 8 ) {
				var newEle = "<input type=\"text\" class=\"verifyText\" style=\"display:none;\" />";
				$('.verifyPwd').parent().find('label').after(newEle);
			}
			$('.verifyPwd').focus(function() {
				var thisParents = $(this).parents('.formElements'),
				pwd2 = $(this).val(),
				verifyText = thisParents.find('.verifyText');
				if ($(this).parents('.formElements').find('.showPwd').is(':checked')) {
					if ( verifyText.length ) {
						verifyText.show();
						verifyText.focus();
						verifyText.val(pwd2);
						$(this).hide();
					}else{
						$(this).attr('type', 'text');
					}
				}else{
					if ( verifyText.length ) {
						verifyText.hide();
						$(this).show();
					}else{
						$(this).attr('type', 'password');
					}
				}
			});

			$('.verifyPwd').keyup(function() {
				var thisParents = $(this).parents('.formElements'),
				verifyText = thisParents.find('.verifyText'),
				pwd = thisParents.find('.primaryPwd').val(),
				pwd2 = $(this).val();
				if(pwd == pwd2) {
					$(this).removeClass('alert');
					thisParents.find('#err_passsame').remove();
				}
				if ( verifyText.length ) {
					verifyText.val(pwd2);
				}
			});

			$('.verifyPwd').blur(function() {
				var thisParents = $(this).parents('.formElements'),
				pwd = thisParents.find('.primaryPwd').val(),
				pwd2 = $(this).val();
				thisParents.find('#err_passsame').remove();
				if(pwd != pwd2) {
					$(this).addClass('alert');
					$.addErrMsgAfter($(this).attr("id"), error_not_same_pwd, false, 'err_passsame');
				} else {
					$(this).removeClass('alert');
					thisParents.find('#err_passsame').remove();
				}
			});
			$('.verifyText').on('keyup', function () {
				var value = $(this).val(),
				verifyPwd = $(this).parents('.formElements').find('.verifyPwd');
				verifyPwd.val(value);
				verifyPwd.keyup();
			});
			$('.verifyText').on('blur', function () {
				var value = $(this).val(),
				verifyPwd = $(this).parents('.formElements').find('.verifyPwd');
				verifyPwd.val(value);
				verifyPwd.blur();
			});
		}
		if ( $('#langupg').length) {
			$('.secondary').click(function() {
				top.location.href = "status.htm" + $.ID_2;
			});
		}

		$.checkipaddr = function(ipaddr) {
			var ipArray = ipaddr.split("."),
			    ipstr = ipArray[0]+ipArray[1]+ipArray[2]+ipArray[3],
			    i = 0,
			    thisSegment = "";
			if( !$.REG_IP.test(ipaddr))
				return false;
			if( ipArray[0] > 223 || ipArray[0] == 0 )
				return false;
			if (ipaddr == "0.0.0.0" || ipaddr == "255.255.255.255")
				return false;
			var each=ipaddr.split(".");
			if (each[0] == "127")
				return false;
			if (!ipArray || ipArray.length != 4) {
				return false;
			} else {
				for (i = 0; i < 4; i++) {
					thisSegment = ipArray[i];
					if (thisSegment != "") {
						if (!(thisSegment >=0 && thisSegment <= 255)) {
							return false;
						}
					} else {
						return false;
					}
				}
			}
		};

		$.checksubnet = function(subnet) {
                        var subnetArray = subnet.split("."),
                        subnetstr = subnetArray[0]+subnetArray[1]+subnetArray[2]+subnetArray[3],
                        i = 0,
                        maskTest = 0,
                        validValue = true,
			thisSegment = "";
                        if( !$.REG_IP.test(subnet))
                                return false;
                        if (!subnetArray || subnetArray.length != 4)
                                return false;
                        else {
                                for (i = 0; i < 4; i++) {
                                        thisSegment = subnetArray[i];
                                        if (thisSegment != "") {
                                                if (!(thisSegment >=0 && thisSegment <= 255)) { //check if number?
                                                        return false;
                                                }
                                        } else {
                                                return false;
                                        }
                                }
                        }
			if( subnetArray[0] < 255 ) {
                                if( (subnetArray[1] > 0) || (subnetArray[2] > 0) || (subnetArray[3] > 0))
                                        validValue = false;
                                else
                                        maskTest = subnetArray[0];
                        } else {
                                if( subnetArray[1] < 255 ) {
                                        if( (subnetArray[2] > 0) || (subnetArray[3] > 0))
                                                validValue = false;
                                        else
                                                maskTest = subnetArray[1];
                                } else {
                                        if( subnetArray[2] < 255 ) {
                                                if( (subnetArray[3] > 0) )
                                                        validValue = false;
                                                else
                                                        maskTest = subnetArray[2];
                                        } else
                                                maskTest = subnetArray[3];
                                }
                        }
			if( validValue ) {
                                switch( maskTest ) {
                                case "0":
                                case "128":
                                case "192":
                                case "224":
                                case "240":
                                case "248":
                                case "252":
                                case "254":
                                case "255":
                                        break;
                                default:
                                        validValue = false;
                                }
                                if( subnet == "0.0.0.0" )
                                        validValue = false;
                        } else
                                validValue = false;
                        return validValue;
                };

		$.checkgateway = function(gateway) {
                        var dgArray = gateway.split("."),
                        dgstr = dgArray[0]+dgArray[1]+dgArray[2]+dgArray[3],
                        i = 0,
			thisSegment = "";
                        if( !$.REG_IP.test(gateway))
                                return false;
                        if( dgArray[0] > 223 || dgArray[0] == 0 )
                                return false;
                        if (gateway == "0.0.0.0" || gateway == "255.255.255.255")
                                return false;
                        if (gateway == "127.0.0.1")
                                return false;
                        if (!dgArray || dgArray.length != 4)
                                return false;
                        else {
                                for (i = 0; i < 4; i++) {
                                        thisSegment = dgArray[i];
                                        if (thisSegment != "") {
                                                if (!(thisSegment >=0 && thisSegment <= 255)) { //check if number?
                                                        return false;
                                                }
                                        } else {
                                                return false;
                                        }
                                }
                        }
                        return true;
                };

		$.isBroadcast = function(lanIp, lanMask) {
                        var ip_arr = lanIp.split('.'),
                        mask_arr = lanMask.split('.'),
                        ip_broadcast=0,
                        ip_str=0,
                        mask_str=0,
                        n_str=0,
                        i = 0;
                        for (i = 0; i < 4; i++) {
                                ip_str = parseInt(ip_arr[i]);
                                mask_str = parseInt(mask_arr[i]);
                                n_str = ~mask_str+256;
                                ip_broadcast=ip_broadcast*256+parseInt(ip_str | n_str)
                        }
                        return (ip_broadcast);
                };

		$.isSub = function(lanIp, lanMask) {
                        var ip_arr = lanIp.split('.'),
                        mask_arr = lanMask.split('.'),
                        ip_sub=0,
                        ip_str=0,
                        mask_str=0,
                        i = 0;
                        for (i = 0; i < 4; i++) {
                                ip_str = parseInt(ip_arr[i]);
                                mask_str = parseInt(mask_arr[i]);
                                ip_sub=ip_sub*256+parseInt(ip_str & mask_str);
                        }
                        return (ip_sub);
                };

		$.isGateway = function(lanIp, lanMask,gtwIp) {
                        var gtw_arr = gtwIp.split('.'),
                        ip_gtw=0,
                        gtw_str=0,
                        i = 0;
                        for (i = 0; i < 4; i++) {
                                gtw_str = parseInt(gtw_arr[i]);
                                ip_gtw=ip_gtw*256+parseInt(gtw_str);
                        }
                        var ip_sub=$.isSub(lanIp, lanMask),
                        ip_broadcast=$.isBroadcast(lanIp, lanMask);
                        if((parseInt(ip_sub)<parseInt(ip_gtw))&&(parseInt(ip_gtw)<parseInt(ip_broadcast)))
                                return true;
                        else
                                return false;
                };

		$.is_sub_or_broad = function(be_checkip, ip, mask) {
                        var addr_arr = be_checkip.split('.'),
                        ip_addr=0,
                        addr_str=0,
                        i = 0;
                        for (i = 0; i < 4; i++) {
                                addr_str = parseInt(addr_arr[i],10);
                                ip_addr=ip_addr*256+parseInt(addr_str);
                        }
                        var ip_sub=$.isSub(ip, mask),
                        ip_broadcast=$.isBroadcast(ip, mask);
                        if(ip_addr == ip_sub || ip_addr == ip_broadcast)
                                return false;
                        return true;
                };

		$.isSameIp = function(ipstr1, ipstr2) {
                        var count = 0,
                        ip1_array=ipstr1.split('.'),
                        ip2_array=ipstr2.split('.'),
                        num1=0,
                        num2=0,
                        i = 0;
                        for(i = 0; i < 4; i++) {
                                num1 = parseInt(ip1_array[i]);
                                num2 = parseInt(ip2_array[i]);
                                if( num1 == num2)
                                        count++;
                        }
                        if( count == 4)
                                return true;
                        else
                                return false;
                };

		$.isSameSubNet = function(lan1Ip, lan1Mask, lan2Ip, lan2Mask) {
                        var count = 0,
                        count_error_end = 0,
                        count_error_start = 0,
                        lan1a = lan1Ip.split('.'),
                        lan1m = lan1Mask.split('.'),
                        lan2a = lan2Ip.split('.'),
                        lan2m = lan2Mask.split('.'),
                        i = 0;
                        for (i = 0; i < 4; i++) {
                                var l1a_n = parseInt(lan1a[i]),
                                l1m_n = parseInt(lan1m[i]),
                                l2a_n = parseInt(lan2a[i]),
                                l2m_n = parseInt(lan2m[i]);
                                if ((l1a_n & l1m_n) == (l2a_n & l2m_n))
                                        count++;
                                var lan_error_start=(l1a_n & l1m_n),
                                l2a_n_two=0,
                                l2m_n_two=0,
                                rev = ~l2m_n,
                                lan_error_end=(rev|l2a_n);
                                rev=rev+256;
                                if (lan_error_end==l2a_n)
                                        count_error_end++;
                                if (lan_error_start==l2a_n)
                                        count_error_start++;
                                if (count_error_end == 4)
                                        return false;
                                if (count_error_start == 4)
                                        return false;
                        }
                        if (count == 4)
                                return true;
                        else
                                return false;
                };
		// on Ipad, can't input half width charactor: ' "
		$.transfer_full2half_width = function(id){
			var arr = $('#'+id).val().split('');
			var arr2 = arr.map(function(c){
				if( c.charCodeAt() == 8216 || c.charCodeAt() == 8217 ){
					return '\'';
				} else if( c.charCodeAt() == 8220 || c.charCodeAt() == 8221 ){
					return '\"';
				} else {
					return c;
				}
			});
			$('#'+id).val(arr2.join(''));
		};
		// for wifiSettings.htm, apmode/ca_access_connect.htm
		if( $('#channel').length || $('#channel5g').length || $('#channel5g2').length ) {
			$.get_outdoor_region_list = function(channel_info) {
				$.outdoor_region_list = [];
				if ( '1' != have_location || !channel_info ) {
					return;
				}
				for(var i = 0; i < 25; i++) {
					var obj = channel_info['region-'+i];
					if (!obj) {
						break;
					}
					if( obj['wifi2'] && obj['wifi2']['HT20_outdoor'] != undefined ) {
						$.outdoor_region_list.push(i.toString());
					}
				}
			}
			$.setChannelList = function(channel_id, region_code, wifix, mode, chValue) {
				//0. if the channel_info not exist, get it first
				if (!$.channel_info) {
					// $.getData('gen_wifi_channel_info.aspx', function(json) {
							// console.log('-----------> gen_wifi_channel_info');
						$.getData('channel_info.json', function(json) {
							console.log('-----------> to get channel_info');
							$.channel_info = json;
							$.get_outdoor_region_list($.channel_info);
							$.locationShowHidden();
							$.setChannelList(channel_id, region_code, wifix, mode, chValue);
						});
					// });
					return;
				}
				console.log('----[_setChannelList] ', channel_id, region_code, wifix, mode, chValue);

				//1. get regionx, wifix, htx
				var regionx = "region-"+region_code;
				var htx = 'HT20';
				if( wifix != 'wifi0' ) {
					htx = ( 1 == mode || 2 == mode || 7 == mode ) ? 'HT20' : (9==mode ? 'HT80' : 'HT40');
					if ( '1' == have_location ) {
						if ( wifix == 'wifi2'
						  && $.outdoor_region_list.includes(region_code)
						  && $('#outdoor5g').prop('checked') ) {
							htx = htx + '_outdoor';
						}
					}
				}
				console.log('\tregion wifix htx :::', regionx, $.channel_info[regionx].region, wifix, htx);

				//2. get channel_list
				var channel_list = $.channel_info[regionx][wifix][htx];
				channel_list = (channel_list || '').replace(/\ /g, '').split(',');
				console.log('\tchannel_list:::', channel_list);

				chValue = chValue || $('#'+channel_id).val();
				console.log('\tchValue:::', chValue);

				//3. set channel
				var channel = document.getElementById(channel_id);
				channel.options.length = channel_list.length+1;
				var num = 0;
				var find_value = 0;
				var i;
				for(i = 0; i < channel_list.length; i++) {
					var ch = channel_list[i] || '';
					var val = parseInt( (ch || '').split("(DFS)")[0] );
					var text = ch;
					if(wifix == 'wifi0') {
						text = ( val == 0 ) ? Auto : ( val < 10 ? '0' + val : text );
					}
					if (!isNaN(val)) {
						if( val == chValue ) {
							find_value = num;
						}
						channel.options[num].value = val;
						channel.options[num].text = text;
						num++;
					}
				}
				channel.options.length = num;
				channel.selectedIndex = find_value;
				channel.value = channel.options[find_value] ? channel.options[find_value].value : '';
				console.log('====[_setChannelList]', 'find_value channel.value:::', find_value, channel.value);
			};
		}

		if( $('.opmode').length > 0 ) {
		    $.modeOptions = function(modeId, modes, val) {
			if( !modes ) return;
			var selectMode = val || $('#'+modeId).val() || modes[0][0];
			var find_value = 0;
			// console.log('>>>1 [.modeOptions]', modeId, 'val', val, 'selectMode', selectMode, 'modes', modes);
			$('#'+modeId).empty();
			for(var i = 0; i < modes.length; i++) {
				if ( selectMode == modes[i][0] ) {
					find_value = 1;
					$('<option value="'+modes[i][0]+'" selected>'+modes[i][1]+'</option>').appendTo('#'+modeId);
				} else {
					$('<option value="'+modes[i][0]+'">'+modes[i][1]+'</option>').appendTo('#'+modeId);
				}
			}
			// console.log('>>>2 [.modeOptions]', 'find_value', find_value, modeId+" >> ", $('#'+modeId));
		    };
		}
	}); // end ready function

}(jQuery));
