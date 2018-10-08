/**
   /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\
   | Javascript used for the ajax language switching                            |
   |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
   | @author Jonas van Ineveld, Personal website - 2018                         |
   \~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/
 */

window.onpopstate = function(event) {
    console.log(event)
};

function switch_language(lang, e){
    e.preventDefault();
    
    document.querySelector('#language-switcher [data-active]').removeAttribute('data-active')
    e.target.setAttribute('data-active', true)

    var url = e.target.href;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url+'lines', true);
    xhr.onreadystatechange = function(resp){
        if(xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            replace_lines(data.lines)
            replace_blocks(data.blocks)
            replace_forms(data.forms)

            create_animation_lines()

            var stateObj = { lang: lang };
            history.pushState(stateObj, document.getElementsByTagName('title')[0].innerText, url);
        }
    }
    xhr.send()
}
var num_lines_replaced = 0;
function replace_line(name, content){
    var $els = document.querySelectorAll('.md-line[data-name="'+name+'"]');

    for(var i=0; i<$els.length; i++){
        var $el = $els[i];
        var lineContent = $el.innerHTML;
        
        $el.innerHTML = '<span class="old">'+lineContent+"</span>"+ '<span class="new">'+content+"</span>";
        $el.setAttribute('data-active', true)

        setTimeout(function($_el){
            $el.setAttribute('data-active', 'animate');
        }.bind(null, $el), 100 * num_lines_replaced)
        num_lines_replaced++;
    }
}

function replace_block(name, content){
    var $els = document.querySelectorAll('.md-block[data-name="'+name+'"]');

    for(var i=0; i<$els.length; i++){
        var $el = $els[i];
        $el.innerHTML = content;
    }
}


function replace_lines(lines){
    num_lines_replaced = 0;
    for(var i=0; i<Object.keys(lines).length; i++){
        var name = Object.keys(lines)[i];
        var line = lines[name];
        replace_line(name, line)
    }
}

function replace_blocks(blocks){
    for(var i=0; i<blocks.length; i++){
        var block = blocks[i];
        replace_block(block.name, block.block)
    }
}

function replace_forms(forms){
    for (var i = 0; i < forms.length; i++) {
        var newform_html = forms[i];
        
        if(document.forms[i])
            document.forms[i].innerHTML = newform_html;
    }
}