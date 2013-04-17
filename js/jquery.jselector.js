// todo опция устанавливать ширину

;(function($){
	$.fn.jselector = function(options){
		this.each(function(){

			var $select   = $(this);
			var $selector = $select.wrap('<div class="jselector">').parent();
			var $ul       = $('<ul>').hide().appendTo($selector);
			var $span     = $('<span>').prependTo($selector);
			var $dropdown = $('<button type="button" class="dropdown">').text('▼').appendTo($selector);

			$('option', $select).each(function(i){

				var $option = $(this);
				var $item = $('<li>');
				var text = $option.text();

				$ul.append($item.text(text));

				if($option.is(':selected')){
					$item.addClass('selected');
					$span.text(text);
				}
			});

			$('li', $ul).click(function(){

				var $item = $(this);

				$('option', $select).eq($item.index()).attr('selected', true);
				$item.addClass('selected').siblings().removeClass('selected');
				$span.text($item.text());
			});

			$selector.click(function(){
				if(!$ul.is(':visible')){
					$ul.show();

					setTimeout(function(){
						$(document).bind('click.selector', function(){
							$(document).unbind('click.selector');
							$ul.hide();
						});
					}, 1)
				}
			});
		});
	}
})(jQuery);