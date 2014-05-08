$(document).ready(function(){var e=setupCalendarData();calendarMoment.init($("#calendar"),moment(),e);$(window).resize($.debounce(250,function(){calendarMoment.equalHeight()}))});var calendarMoment={init:function(e,t,n){"use strict";calendarMoment.events=n||null;calendarMoment.$targetCalendar=e;e.on("click",".cm_nav button",function(e){$(this).hasClass("cm_prev")?t.month(t.month()-1):$(this).hasClass("cm_next")?t.month(t.month()+1):$(this).hasClass("cm_now")&&(t=moment());calendarMoment.build(t)});calendarMoment.build(t)},build:function(e){"use strict";function w(e){var t="",n="",r=function(e,t){n=t;return'<div class="cm_event"><div class="cm_event__content"><div class="cm_event__title"><a class="cm_event__link" href="'+calendarMoment.events[e].url+'">'+calendarMoment.events[e].title+"</a>"+"</div>"+'<div class="cm_event__location">'+calendarMoment.events[e].where+"</div>"+'<div class="cm_event__desc">'+n+"</div>"+"</div>"+"</div>"};for(var i=0;i<calendarMoment.events.length;i++){var s=parseInt(moment(calendarMoment.events[i].startTime).format("YYYYMMDD")),o=parseInt(moment(calendarMoment.events[i].endTime).format("YYYYMMDD"));e===s?t=r(i," cm_event--start"):e===o?t=r(i," cm_event--end"):e>s&&e<o&&(t=r(i," cm_event--middle"))}return{eventString:t,eventClass:n}}function E(){var t=moment(),n=calendarMoment.$targetCalendar.find("#cm_nav .cm_prev"),r=calendarMoment.$targetCalendar.find("#cm_nav .cm_now"),i=calendarMoment.$targetCalendar.find("#cm_nav .cm_next");if(e.month()===t.month()){n.prop("disabled",!0);r.prop("disabled",!0);i.prop("disabled",!1)}else if(moment(e).isBefore(t)){n.prop("disabled",!0);r.prop("disabled",!1);i.prop("disabled",!1)}else if(moment(e).isAfter(t)){n.prop("disabled",!1);r.prop("disabled",!1);i.prop("disabled",!1)}calendarMoment.$dayCells=calendarMoment.$targetCalendar.find(".cm_day");calendarMoment.$eventCells=calendarMoment.$targetCalendar.find(".cm_event");calendarMoment.equalHeight()}var t=e.clone(),n='<header class="cm_header"><div class="cm_title">'+e.format("MMMM, YYYY")+'</div><nav id="cm_nav" class="cm_nav"><button class="cm_prev" disabled><< Prev</button><button class="cm_now" disabled>Now</button><button class="cm_next" disabled>Next >></button></nav></header>',r='<ul class="cm_weekdays"><li>Sunday</li><li>Monday</li><li>Tuesday</li><li>Wednesday</li><li>Thursday</li><li>Friday</li><li>Saturday</li></ul>',i='<section class="cm_weeks"><ul class="cm_days">',s="</section>",o=n+r+i,u="",a=t.month(),f=t.daysInMonth(),l=t.date(t.daysInMonth()).weekday(),c=t.date(1).weekday(),h=!1,p=!1,d=1-c,v=6-l+f,m=v+c;t.date(d);for(var g=0;g<m;g++){var y="",b=w(parseInt(t.format("YYYYMMDD")));h=d<1?!0:!1;p=d>f?!0:!1;if(h||p)y+=" out_of_range";b.eventString===""?y+=" no_event":y+=b.eventClass;var u='<li class="cm_day'+y+'">'+'<div class="cm_day-cell">'+'<div class="cm_date-title">'+'<span class="cm_day">'+t.format("dddd")+", </span>"+'<span class="cm_month">'+t.format("MMM")+"</span>"+'<span class="cm_date"> '+t.format("Do")+"</span>"+"</div>"+b.eventString+"</div>"+"</li>";(g+1)%7===0&&d<f&&(u+='</ul><ul class="cm_days">');d++;o+=u;t.add("days",1)}o+="</ul>"+s;calendarMoment.$targetCalendar.addClass("cm").html(o);return E()},equalHeight:function(e){"use strict";function r(e){var n=e.height();n>t&&(t=n)}calendarMoment.$dayCells.removeAttr("style");var t=0,n=0;if(e){calendarMoment.$dayCells.removeAttr("height");calendarMoment.$eventCells.removeAttr("height")}calendarMoment.$eventCells.each(function(){r($(this))}).height(t);calendarMoment.$dayCells.each(function(){r($(this))}).height(t)}};