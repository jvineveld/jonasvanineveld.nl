/**
   /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\
   | Main javascript file                                                       |
   |                                                                            |
   | Contents: - Tab functionality                                              |
   |           - Header characters animations                                   |
   |           - Spam protection                                                |
   |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
   | @author Jonas van Ineveld, Personal website - 2018                         |
   \~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/
 */

var out_animation_time = 500;
var $prev_tab = document.getElementById('tab-intro');

function remove_active_classes(){
    var tabs = document.querySelectorAll('[id^="tab"]')
    for(var i=0; i<tabs.length; i++){
        tabs[i].removeAttribute('data-active')
    }
}

function show_tab(el, tab){
    
    var _tab = tab ? tab : el,
        $tab = document.getElementById('tab-'+_tab)

    if($tab){
        document.getElementById('main').setAttribute('data-trans-to', _tab)

        if($prev_tab) $prev_tab.setAttribute('data-active', 'out')

        var buttons = document.querySelectorAll('aside button')

        for(var i=0; i<buttons.length; i++){
            buttons[i].removeAttribute('data-active')
        }

        if(_tab === tab) el.setAttribute('data-active', true)

        setTimeout(function(){
            remove_active_classes()

            $tab.setAttribute('data-active', true)
            document.getElementById("main").classList = _tab
            document.getElementById("main").setAttribute('data-active-tab', _tab)
            $prev_tab = $tab
        }, out_animation_time)
    }
}

var animation_lines = ['h2'];

function create_animation_lines(){
    animation_lines.forEach(function(line){
        var lines = document.querySelectorAll(line);

        if(!lines.length)
            return;
        
        for(var i=0; i<lines.length; i++){
            $line = lines[i];
            if(!$line.getAttribute('data-charanimate')){
                $line.innerHTML = $line.innerHTML.replace('&amp;', '&').replace(/./g, function(match){
                    return '<span>'+match+'</span>';
                })
    
                $line.setAttribute('data-charanimate', 'true')
            }
           
        }
    })
}

create_animation_lines()

// screw the scrapers
var n = ["94", "151", "30", "(0)85", "+31"].reverse().join(' ');
document.getElementById('phone').innerHTML = '<a href="tel:'+n.replace('(0)','').replace(/\s/g,'')+'">'+n+"</a>";
document.getElementById('email').innerHTML = [".nl", "own", "your", "eit", "mak", "@", "as", "on", "j"].reverse().join('')