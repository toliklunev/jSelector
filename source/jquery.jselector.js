// todo опция устанавливать ширину

;(function($){
	$.fn.jselector = function(arg){

		function make(){
			if(typeof arg === 'string'){
				switch(arg){
					case 'update':
						$(this).trigger('jselector.update');
						return false;
						break;
				}
			}

			var $select        = $(this);
			var $selector      = $select.wrap('<div class="jselector">').parent();
			var $selector_wrap = $('<div class="wrap">').appendTo($selector);
			var $ul            = $('<ul>').hide().appendTo($selector);
			var $span          = $('<span>').prependTo($selector_wrap);
			var $dropdown      = $('<button type="button" class="dropdown">').text('▼').appendTo($selector_wrap);

			$select.bind('jselector.update', function(){

				$ul.empty();

				$('option', $select).each(function(){
					var $option = $(this);
					var $item = $('<li>');
					var text = $option.text();

					$ul.append($item.text(text));

					if($option.is(':selected')){
						$item.addClass('selected');
						$span.text(text);
					}
				});

				$('li', $ul)
				.unbind('click.jselector')
				.bind('click.jselector', function(){
					$('option', $select).eq($(this).index()).prop('selected', true);
					$select.change();
				});
			});

			$select.trigger('jselector.update');


			$select.change(function(){
				var i = $('option:selected', this).index();

				$item = $('li', $ul).removeClass('selected').eq(i);

				$item.addClass('selected');
				$span.text($item.text());
			});

			$selector_wrap.click(function(e){
				if(!$ul.is(':visible')){
					$ul.show();

					$(document).click();
					
					setTimeout(function(){
						$(document).one('click.jselector', function(){
							$ul.hide();
						});
					});
				}
			});
		};

		return this.each(make);
	}
})(jQuery);