/* Options (in any order):

 start (number|string)
    Index number of default tab. ex: $(...).idTabs(0)
    String of id of default tab. ex: $(...).idTabs("tab1")
    default: class "selected" or index 0
    Passing null will force it to not select a default tab

 change (boolean)
    True - Url will change. ex: $(...).idTabs(true)
    False - Url will not change. ex: $(...).idTabs(false)
    default: false

 click (function)
    Function will be called when a tab is clicked. ex: $(...).idTabs(foo)
    If the function returns true, idTabs will show/hide content (as usual).
    If the function returns false, idTabs will not take any action.
    The function is passed four variables:
      The id of the element to be shown
      an array of all id's that can be shown
      the element containing the tabs
      and the current settings

 selected (string)
    Class to use for selected. ex: $(...).idTabs(".current")
    default: ".selected"

 event (string)
    Event to trigger idTabs on. ex: $(...).idTabs("!mouseover")
    default: "!click"
    To bind multiple event, call idTabs multiple times
      ex: $(...).idTabs("!click").idTabs("!focus")
      
 automatic switchover (string)
    ex: $(...).idTabs("~3000")
*/
(function() {
	var init = function() { (function($) {
			$.fn.idTabs = function() {
				var s = {};
				for (var i = 0; i < arguments.length; ++i) {
					var a = arguments[i];
					switch (a.constructor) {
					case Object:
						$.extend(s, a);
						break;
					case Boolean:
						s.change = a;
						break;
					case Number:
						s.start = a;
						break;
					case Function:
						s.click = a;
						break;
					case String:
						if (a.charAt(0) == '.') s.selected = a;
						else if (a.charAt(0) == '!') s.event = a;
						else if (a.charAt(0) == '~')
						{
							s.auto = true;
							if(a.substr(1)) s.speed = a.substr(1);
						}
						else s.start = a;
						break;
					}
				}
				if (typeof s['return'] == "function")
				 s.change = s['return'];
				return this.each(function() {
					$.idTabs(this, s);
				});
			}
			$.idTabs = function(tabs, options) {
				var auto_time;
				var auto_change = function(){
					var $next = list.eq(0);
					var _sel = null;
					list.each(function() {
						if(_sel) {
							$next = $(this);
							return false;
						}
						if($(this).hasClass(s.selected)) _sel = true;
					});
					$next.trigger(s.event);
					auto_time = setTimeout(auto_change, s.speed);
				}
				var meta = ($.metadata) ? $(tabs).metadata() : {};
				var s = $.extend({}, $.idTabs.settings, meta, options);
				if (s.selected.charAt(0) == '.') s.selected = s.selected.substr(1);
				if (s.event.charAt(0) == '!') s.event = s.event.substr(1);
				if (s.start == null) s.start = -1;
				var showId = function() {
					if(s.auto) {
						clearTimeout(auto_time);
						$(this).one("mouseout", function(){
							auto_time = setTimeout(auto_change, s.speed);
						});
					}
					if ($(this).is('.' + s.selected))
					 return s.change;
					var id = "#" + this.href.split('#')[1];
					var aList = [];
					var idList = [];
					$("a", tabs).each(function() {
						if (this.href.match(/#/)) {
							aList.push(this);
							idList.push("#" + this.href.split('#')[1]);
						}
					});
					if (s.click && !s.click.apply(this, [id, idList, tabs, s])) return s.change;
					for (i in aList) $(aList[i]).removeClass(s.selected);
					for (i in idList) $(idList[i]).hide();
					$(this).addClass(s.selected);
					$(id).show();
					return s.change;
				}
				var list = $("a[href*='#']", tabs).unbind(s.event, showId).bind(s.event, showId).attr('hidefocus', 'true');
				list.each(function() {
					$("#" + this.href.split('#')[1]).hide();
				});
				var test = false;
				if ((test = list.filter('.' + s.selected)).length);
				else if (typeof s.start == "number" && (test = list.eq(s.start)).length);
				else if (typeof s.start == "string" && (test = list.filter("[href*='#" + s.start + "']")).length);
				if (test) {
					test.removeClass(s.selected);
					test.trigger(s.event);
				}
				
				if(s.auto) {
					auto_time = setTimeout(auto_change, s.speed);
				}
				return s;
			}
			$.idTabs.settings = {
				start: 0,
				change: false,
				click: null,
				selected: ".selected",
				event: "!click",
				auto: false,
				speed: 3000
			};
			$.idTabs.version = "2.2";
			$(function() {
				$(".idTabs").idTabs();
			});
		})(jQuery);
	}
	return init();
})();
