/* jSelector v0.1 | http://codefucker.github.io/jSelector/
 * © Anatoly Lunev | toliklunev.ru | toliklunev@gmail.com
 * Licensed under the MIT License */

;(function($){
	var $document = $(document);
	var $html;

	var mobile = (/mobile|android|blackberry|brew|htc|j2me|lg|midp|mot|netfront|nokia|obigo|openweb|opera\ mini|palm|psp|samsung|sanyo|sch|sonyericsson|symbian|symbos|teleca|up\.browser|wap|webos|windows\ ce/i.test(navigator.userAgent.toLowerCase()));

	var configuration = {
		//set_width : true
		btn_text: '▼'
	};

	$(function(){
		$html = $('html');

		if(!mobile){
			$html.addClass('desktop');
		}
	});

	$.fn.jselector = $.fn.jSelector = function(arg){

		if(typeof arg === 'object'){
			configuration = $.extend(configuration, arg);
		}

		else if(typeof arg === 'string'){
			switch(arg){
				case 'update':
					this.trigger('jselector:update').change();
					return;
					break;

				case 'set_width':
					this.trigger('jselector:set_width');
					return;
					break;

				case 'unset_width':
					this.trigger('jselector:unset_width');
					return;
					break;
			}
		}

		function make(){

			var $select   = $(this);
			var $selector = $select.wrap('<div class="jselector">').parent();
			var $wrap     = $('<div class="wrap">').appendTo($selector);
			var $div      = $('<div>').prependTo($wrap);
			var $span     = $('<span>').prependTo($div);
			var $button   = $('<button type="button">').html(configuration.btn_text).appendTo($wrap);
			var $dropdown = $('<div class="dropdown">').appendTo($selector);
			
			var $items,
				$selected_item,
				$selected_option,
				$options,
				$optgroups;

			var shown = false;

			var new_items = function($parent){

				var $ul = $('<ul>').appendTo($parent);

				$('option', this).each(function(){
					var $option = $(this);
					var $item = $('<li>');

					var text = $option.html();

					if($option.is(':selected')){
						$selected_item = $item.addClass('selected');
						$selected_option = $option;
					}

					if($option.is(':disabled')){
						$item.addClass('disabled').data('disabled', true);
					}

					$ul.append($item.html(text.replace(/#%/g, '<').replace(/%#/g, '>')));
				});
			};

			$selector.attr('data-name', $select.prop('name'));

			$select.bind('jselector:hide', function(){
				shown = false; 
				$selector.removeClass('is-shown');
			});

			$select.bind('jselector:show', function(){
				shown = true;
				$selector.addClass('is-shown');
			});

			$select.bind('jselector:unset_width', function(){
				$div.css('min-width', '');
				configuration.set_width = false;
			});

			// устанавливает минимальную ширину
			$select.bind('jselector:set_width', function(){
				var width = 0;
				var span = $span.html();

				$div.css('min-width', '');

				$items.each(function(){
					$span.html($(this).html());

					if($div.width() > width){
						width = $div.width();
					}
				});

				if(width){
					$div.css('min-width', width);
				}

				$span.html(span);

				configuration.set_width = true;
			});

			$select.bind('jselector:update', function(){

				$dropdown.empty();

				$optgroups = $('optgroup', $select);

				if($optgroups.size()){

					$optgroups.each(function(){
						var $optgroup = $(this);
						var $group = $('<div>').addClass('group');
						var label = $optgroup.attr('label');
						
						$group.appendTo($dropdown);

						if($optgroup.is(':disabled')){
							$group.addClass('disabled');
						}

						if(label){
							var $span = $('<span>');

							$span.text(label);
							$group.append($span)
						}

						new_items.bind(this, $group).call();
					});
				}

				else{
					new_items.bind($select, $dropdown).call()
				}

				$options = $('option', $select);
				$items = $('li', $dropdown);

				$items.click(function(){

					var $item = $(this);

					if(!$item.data('disabled')){
						$options.eq($items.index(this)).prop('selected', true);
						$select.change();
						$document.mousedown().mouseup();
					}
				});

				$dropdown.wrapInner('<div>');

				var placeholder = $select.data('placeholder');

				/* Вставляем текст плейсхолдера, если он задан, и у option нет атрибута selected */
				if(!$selected_option.filter('[selected]').length && placeholder){
					$span.html(placeholder).addClass('placeholder');
				}

				else{
					$span.html($selected_item.html());
				}

				if(configuration.set_width){
					$select.trigger('jselector:set_width');
				}
			});

			$select.trigger('jselector:update');

			$select.change(function(){

				var i = $options.index($options.filter(':selected'));
				$selected_item = $items.removeClass('selected').eq(i).addClass('selected');
				$span.html($selected_item.html()).removeClass('placeholder');
			});

			$wrap.mousedown(function(e){
				if(e.which == 1){	
					if(!shown){
						$document.one('mouseup', function(e){
							$select.trigger('jselector:show');

							setTimeout(function(){
								$document.mousedown(function(e){
									if(!$(e.target).closest($dropdown).length){
										
										e.preventDefault();

										$document.one('mouseup', function(){
											$select.trigger('jselector:hide');
										});

										$document.unbind(e);
									}
								});
							});
						});
					}
				}
			});

			if(typeof configuration.after == 'function'){
				$.proxy(configuration.after, $selector).call();
			}
		};

		this.filter(':visible').each(make);

		var $invisibles = this.not(':visible');

		if($invisibles.length){

			var checkVisibles = setInterval(function(){
				$invisibles.filter(':visible').each(make);
				$invisibles = $invisibles.not(':visible');

				if(!$invisibles.length){
					clearInterval(checkVisibles);
				}

			}, 500);
		}
	}

	$(function(){
		$('[data-jselector="init"]').jSelector();
	});
	
})(jQuery);