/**
 * Simple form validation and other funcitonality for forms.
 * @author Jonas van Ineveld
 */
(function($){
	$.fn.niceForm = function() {
		var _form = this,
			showingSubmit = false;

		this._validate = function(event){
			var valid = false,
				val = this.value,
				$field = $(this).parents('.field');

			switch(this.name)
			{
				case 'name':
					if(val.length > 4)
						valid = true;
				break;
				case 'email':
					var regex = /\S+@\S+\.\S+/;
					valid = regex.test(val);
				break;
				case 'message':
					if(val.length > 15)
						valid = true;
				break;
			}

			if(valid)
				$field.removeClass('invalid').addClass('valid');
			else
				$field.removeClass('valid').addClass('invalid');

			_form._check_for_all_valid();
		}

		this._check_for_all_valid = function(){
			var valid = false,
				$fields = $('input, textarea', _form),
				numFields = $fields.length,
				validFields = 0;

			$fields.each(function(){
				var $field = $(this).parents('.field');

				if($field.hasClass('valid'))
				{
					validFields ++;
				}
			});

			if(numFields == validFields)
				valid = true;

			var formClass = valid ? 'all-valid' : 'invalid-fields';
			$(_form).removeClass('all-valid invalid-fields').addClass(formClass)
		}

		this._placeholder_classes = function(e){
			var $field = $(this).parents('.field');

			if($(this).val()!='')
				$field.addClass('filled')
			else
				$field.removeClass('filled')
		}

		this._animate_form_success = function(msg){
			$('.response-wrap').html(msg)
			$(_form).addClass('form-send-success')

			if(typeof window.TimelineLite != 'function')
				return;

			var tl = new TimelineLite();
			tl.to($('.form-wrap'), .3, {x:-20, opacity: 0, ease:Power4.easeIn});
			tl.to($('.response-wrap'), 0, {x:20, opacity: 0});
			tl.to($('.response-wrap'), .4, {x:0, opacity: 1, ease:Power4.easeOut});
		}

		this._submit = function(e){
			e.preventDefault();

			var post_data = {
				'name': $('[name="name"]').val(),
				'email': $('[name="email"]').val(),
				'message': $('[name="message"]').val(),
				'location': $('[name="location"]').val(),
				'okidoki': 'LikeWatchingAroundHere?JustTypingSomeRandomShitABotWontGues'
			}

			$.post('/build/build.mail.php', post_data, function(resp) {
				if(resp.success)
				{
					_form._animate_form_success(resp.success);
					$(_form).trigger('send-success', resp);
				}
				else
				{
					alert('Something went wrong.. Strange.. Could you send me your message at: jonas@makeityourown.nl? Sorry for the inconvenience.');
					$(_form).trigger('send-failure', resp);
				}
			})
		}

		$('input, textarea', this).on('keyup', _form._validate);
		$('input, textarea', this).on('keyup keydown change click', _form._placeholder_classes);
		$(_form).on('submit', _form._submit);

	};
})(jQuery)
