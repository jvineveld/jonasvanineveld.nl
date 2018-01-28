var site=function(){this.el={logo:document.getElementById("logo"),headerLine:document.querySelector("#header .line"),contactLink:document.querySelector("#header .contact-link"),aboutLink:document.querySelector("#header .about-me"),topHalf:document.getElementById("ia-top"),bottomHalf:document.getElementById("ia-bottom"),blocks_wrap:document.querySelectorAll(".blocks"),blocks:document.querySelectorAll(".blocks .block"),blocks_close:document.querySelectorAll(".blocks .block .close-link")};var e=this;this.start_animation=function(){var a=e.nodeListToArray(e.el.logo.childNodes);a.shift(),tl=new TimelineLite,logoPos=a[0].getBoundingClientRect(),line=e.el.headerLine,contact=e.el.contactLink,about=e.el.aboutLink,jQuery("#logo").css("opacity",1),tl.staggerFrom(a,1.5,{x:-100,opacity:0,delay:.5,ease:Elastic.easeOut,force3D:!0},.075);var o=e.el.blocks_wrap,t=e.el.blocks;tl.from(o,1,{y:-100,opacity:0,delay:-.5,ease:Back.easeOut.config(.5)}),tl.staggerFrom(t,1.5,{y:-50,opacity:0,delay:-.5,ease:Power2.easeOut,force3D:!0},.1)},this.page_swift_animation=function(){var a=new TimelineLite,o=e.el.topHalf,t=e.el.bottomHalf;a.from(o,1,{fill:"#fff",delay:2,ease:Power3.easeInOut,force3D:!0}),a.from(t,1,{fill:"#fff",delay:2,ease:Power3.easeInOut,force3D:!0},.13)},this.nodeListToArray=function(e){for(var a=[],o=e.length;o--;a.unshift(e[o]));return a},this.addClass=function(e,a){e.length||(e=[e]);for(var o=0,t=e.length;o<t;o++)(" "+e[o].className+" ").indexOf(" "+a+" ")>=0&&(e.className+=" "+a)},this.set_event_listeners=function(){jQuery(document).on("click",".action-link",e.clicked_action)},this.clicked_action=function(a){switch($(this).data("action")){case"open-about":e.display_page("about",!0);break;case"open-projects":e.display_page("projects");break;case"open-development":e.display_page("development");break;case"open-contact":e.display_page("contact",!0);break;case"close":e.close_page();break}},this.close_page=function(){e.adjust_card_size("close",function(){$("#v-card").removeClass("active")})},this.display_page=function(a,o){var t=$("#v-card");t.data("orig-width")||t.data("orig-height",t.outerHeight()).data("orig-width",t.outerWidth());var i=$("#page-"+a);i.siblings().removeClass("active"),i.addClass("active"),t.addClass("active"),e.adjust_card_size("open",o)},this.adjust_card_size=function(e,a){var o=new TimelineLite,t=jQuery("#v-card"),i=.5;switch(o.timeScale(1),o.progress(.5),t.height(t.height()),t.width(t.width()),e){case"open":var l=Back.easeOut.config(1.5),s=$("#v-card .front"),c=$("#v-card .close-link"),n=$("#v-card .page.active"),d=n.data("height"),r=n.data("width"),y=.7,p=-55,g=$(window).width()<650;if(g&&(d=$(window).height()-60+"px",r="100%",y=.5,p=-60),o.to(t,0,{overflow:"hidden"}),o.to(s.find(".inner"),.3,{y:200,opacity:0,delay:0,display:"none",ease:Power4.easeIn}),o.to(s.find("#logo"),.3,{y:-20,x:p,scale:y,delay:-.2,ease:Power4.easeIn}),o.to(c,0,{display:"block",opacity:0,x:-20}),o.to(c,.3,{x:0,opacity:1,ease:l}),o.to(t,.5,{width:r,delay:-.3,ease:l}),o.to(t,.5,{height:d,delay:-.4,ease:l}),o.to(n,0,{display:"block",delay:-.3,ease:Power4.easeIn}),o.to(n.find(".content"),.3,{opacity:1,delay:-.2,ease:Power4.easeIn}),o.to(t,0,{overflow:"visible",delay:0}),a){var u=$("#logo"),h=$("#logo #Jonas"),f=$("#logo #About"),w=$("#logo #Contact"),v=$("#logo #slash"),m=$("#logo #close_tag");$lt=$("#logo #lt"),u.addClass("active");var b=400;b+=300,g||(o.to(m,.5,{x:650,delay:0,opacity:1,display:"block",ease:l}),o.to(v,.7,{x:405,delay:-.6,opacity:1,ease:l}),o.to($lt,.5,{x:-42,delay:-.5,ease:Power4.easeOut})),"page-about"==n.attr("id")?(o.to(f,0,{x:320,opacity:0,display:"block",delay:-.5}),o.to(f,.7,{x:350,opacity:1,delay:-.4,ease:Power4.easeOut})):"page-contact"==n.attr("id")&&(o.to(w,0,{x:305,opacity:0,display:"block",delay:-.5}),o.to(w,.7,{x:325,opacity:1,delay:-.4,ease:l}))}break;case"close":var n=$("#v-card .page.active"),u=$("#logo"),h=$("#logo #Jonas"),f=$("#logo #About"),w=$("#logo #Contact"),v=$("#logo #slash"),m=$("#logo #close_tag");$lt=$("#logo #lt"),s=$("#v-card .front"),u.removeClass("active"),"page-about"==n.attr("id")?o.to(f,.3,{x:0,opacity:0,display:"none",delay:0,ease:Power4.easeIn}):"page-contact"==n.attr("id")&&o.to(w,.3,{x:0,opacity:0,display:"none",delay:0,ease:Power4.easeIn}),o.to(m,.5,{x:0,delay:0,opacity:0,display:"none",ease:Power1.easeIn}),o.to(v,.7,{x:0,delay:-.6,opacity:1,ease:Power4.easeOut}),o.to($lt,.5,{x:0,delay:-.5,ease:Power4.easeOut});var s=$("#v-card .front"),c=$("#v-card .close-link"),l=Back.easeOut.config(1.2);o.to(t,0,{overflow:"hidden"}),o.to(n.find(".content"),.2,{opacity:0,delay:-.5,ease:Power4.easeOut}),o.to(n,0,{display:"none",ease:Power4.easeIn}),o.to(t,.5,{height:t.data("orig-height"),delay:0,ease:l}),o.to(t,.5,{width:t.data("orig-width"),delay:-.4,ease:l}),o.to(c,.3,{display:"none",x:-20,opacity:0,delay:-.4,ease:Power4.easeOut}),o.to(s.find("#logo"),.3,{y:0,x:0,scale:1,delay:-.7,ease:Power4.easeInOut}),o.to(s.find(".inner"),.5,{y:0,opacity:1,delay:-.5,display:"block",ease:Power4.easeOut}),o.to(t,0,{overflow:"visible"});break}},this.initialize=function(){e.set_event_listeners(),jQuery("#contact-form").niceForm(),"#!/contact"==document.location.hash&&e.display_page("contact")}},awesome=new site,waiting=setInterval(function(){"function"==typeof TimelineLite&&(window.yey=awesome.initialize(),clearInterval(waiting))},100);