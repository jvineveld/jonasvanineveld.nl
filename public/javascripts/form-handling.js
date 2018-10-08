/**
   /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\
   | Ajax form handeling and validation                                         |
   |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
   | @author Jonas van Ineveld, Personal website - 2018                         |
   \~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/
 */


var errors = [];
var lastError = {};
var $errorWrap = document.getElementById('validation-info')

function show_form_error(msg){
    var $error = document.createElement('div')
    $error.innerHTML = msg;

    if(lastError.$el){
        lastError.$el.parentElement.removeChild(lastError.$el)

        if(lastError.fade_timeout)
            clearTimeout(lastError.fade_timeout)

        if(lastError.remove_timeout)
            clearTimeout(lastError.remove_timeout)
    }

    lastError.$el = $error;
    lastError.fade_timeout = setTimeout(function(){
        $errorWrap.setAttribute('data-fadeout', true)

        lastError.remove_timeout = setTimeout(function(){
            $errorWrap.removeChild($error)

            lastError = {};
        }, 1000)
    }, 1000)

    $errorWrap.appendChild($error)
}

function send_form(values){
    let postdata = function(data){
        var str = '';
        var names = Object.keys(data);
        for(var i=0; i<names.length; i++){
            str += (str==='') ? '' : '&';
            str += names[i] + '=' + data[names[i]]
        }

        return str;
    }(values)

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/mail", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function(resp){
        if(xhr.readyState === 4 && xhr.status === 200) {
            var resp = JSON.parse(xhr.responseText);
            var $contact = document.getElementById('tab-contact');
            
            console.log(resp.success, resp)
            if(resp.success)
                $contact.setAttribute('data-send', true)
            else
                $contact.setAttribute('data-send', false)
        }
    }	
    xhr.send(postdata);
}

function validateFields(e){

    var fields = document.forms.contactform.elements,
        errors = [],
        values = {}
    
    for(var i=0; i<fields.length; i++){
        let $field = fields[i],
            is_valid = $field.parentElement.dataset.valid === 'valid';

        if($field.name!=='' && !is_valid){
            errors.push($field.dataset.validationMsg)
        } else {
            values[$field.name] = [$field.value]
        }
    }

    if(errors.length){
        show_form_error(errors[0])
    } else {
        e.setAttribute('disabled', true)
        show_form_error('[# md-line | form_sending | true #]')
        send_form(values);
    }

    return false;
}

function validate_email(email){
    return email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
}

function validateInput(el, type){
    var val = el.value,
        valid = el.parentElement.dataset.valid

    if(val.length > 0 && !valid)
    {
        el.parentElement.setAttribute('data-valid', 'filled')
    }
    else if(val.length === 0 && valid !== true)
    {
        el.parentElement.removeAttribute('data-valid')

        return;
    }

    switch(type){
        case 'name':
            if(val.length >= 4 && valid !== 'valid')
                el.parentElement.setAttribute('data-valid', 'valid')
            else if(val.length > 0 && val.length < 4 && valid === 'valid')
                el.parentElement.setAttribute('data-valid', 'filled')
            return;
        break;
        case 'contact':

            var $typeLabel = document.getElementById('email_phone_type'),
                is_mail = isNaN(val[0]) && val[0] !== '+' ? true : val.includes('@') ? true : false,
                label = 'Email';
                
            if(!is_mail)
            {
                label = 'Telefoon';
                el.dataset.validationMsg = el.dataset.phoneValidationMsg;

                if(val.length >= 10 && valid !== 'valid')
                    el.parentElement.setAttribute('data-valid', 'valid')
                else if(val.length < 10 && valid === 'valid')
                    el.parentElement.setAttribute('data-valid', 'filled')
            }
            else{
                el.dataset.validationMsg = el.dataset.emailValidationMsg;

                if(validate_email(val) && valid !== 'valid')
                    el.parentElement.setAttribute('data-valid', 'valid')
                else if(!validate_email(val) && valid === 'valid')
                    el.parentElement.setAttribute('data-valid', 'filled')
            }

            $typeLabel.innerHTML = label;
                
            return;
        break;
        case 'description':
            if(val.length > 60 && valid !== 'valid')
                el.parentElement.setAttribute('data-valid', 'valid')
            
            return;
        break;
    }
}

function scrollToInput(element){
    if(document.body.clientWidth < 800){
        setTimeout(function(){
            document.getElementById('tab-contact').scrollTop = element.getBoundingClientRect().top;
        }, 250)
    }
}