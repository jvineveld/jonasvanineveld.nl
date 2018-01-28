/* ClassCarousel v1.5 by Jonas van Ineveld - @license: use it */
!function($){$.fn.classCarousel=function(e){function t(e){var t=s.items;return(t.length+e%t.length)%t.length}var s=this;this.items=[];var i=$.extend({visible:4,offset:0,cycle_set_timout:50,cycle:!0,child_selector:".items > *"},e);return this.refresh_items=function(){s.items=[];var e=0;$(i.child_selector,s).each(function(){$el=this,s.items.push({$item:$el,position:e+1}),e++})},this.remove_classes=function(e){return e.removeClass(function(e,t){return(t.match(/\bloc_\S+/g)||[]).join(" ")}),e.removeClass("hidden-left hidden-right"),e},this.set_no_slide_classes=function(){for(var e=0;e<s.items.length;e++){var t=s.items[e],i=$(t.$item);i.addClass("loc_"+(e+1))}},this.hide_item=function(e,t,i){var n="hidden-"+e;i&&t.addClass("no-transition"),s.remove_classes(t),t.addClass(n),i&&(t[0].offsetHeight,t.removeClass("no-transition"))},this.change_classes=function(e){var n=s.items.length,c=i.visible;if(n<c)return s.set_no_slide_classes(),void console.info("Not enough items for carousel",s);for(var a=0;a<n;a++){var r=s.items[a],l=$(r.$item),o=l.hasClass("hidden-left"),_=l.hasClass("hidden-right"),h=r.position,f=t(h+e),m=h-f;changing_sides=Math.abs(m)>2,extra_items_left=3,last_first=n-extra_items_left,0==f?s.hide_item("left",l,_):f<=c?(s.remove_classes(l),l.addClass("loc_"+f)):f>c&&f<last_first?s.hide_item("right",l,o):s.hide_item("left",l,_),s.items[a].position=f}},this.add_event_listeners=function(){$("[cc-control]",s).on("click",function(e){e.preventDefault();var t=$(this).attr("cc-control");switch(t){case"next":s.next_item();break;case"prev":s.prev_item();break;case"next-set":s.next_set();break;case"prev-set":s.prev_set()}})},this.cycle_set=function(e){var t=0,n=setInterval(function(){t<i.visible?"next"==e?s.next_item():s.prev_item():clearInterval(n),t++},i.cycle_set_timout)},this.next_item=function(){s.change_classes(-1)},this.prev_item=function(){s.change_classes(1)},this.next_set=function(){s.cycle_set("next")},this.prev_set=function(){s.cycle_set("prev")},this.initialize=function(){return s.refresh_items(),s.add_event_listeners(),s.items.length<i.visible?void s.set_no_slide_classes():void s.change_classes(i.offset)},s.initialize(),s}}(jQuery);