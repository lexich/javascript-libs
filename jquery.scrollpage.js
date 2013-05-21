/*!
 * jQuery JavaScript plugin
 * http://jquery.com/
 *
 * Copyright 2012, Efremov Alex (lexich)
 *
 * Require jquery-1.7.2.js
 * http://jquery.com/
 *
*/

/*
* smooth scroll jQuery plugin
*
* usage:
* <a class="nav" href="#one">One</a>
* <!-- some staff -->
* <a name="one">One</a>
*
* <script>
*     $("a.nav").scrollPage();
* </script>
* */
(function ($) {       
	var Scroller = function(){
		this.timeout = null;		
	}
	Scroller.prototype = {
		scroll:function(from, to){
			var wHeight = $(window).height();
			var pathHeight = to - from;
			var move = from < to ? 'down' : 'up';
			var delay = 80;
			var memo = {
				move: move,
				delay: delay,
				delayStep: 8,
				delayCounter:0,
				delayCounterStop:1,
				pos: from,
				from: from,				
				to: to,
				step: 5,
				pathStop: wHeight/4
			}
			var _delay = function(memo){
				if(memo.delayCounter >= memo.delayCounterStop){
					memo.delay -= memo.delayStep;
					memo.delayCounter = 0;	
				} else {
					memo.delayCounter += 1
				}
				
				if(memo.delay < 0){
					memo.delay = 0
				}
				var delta = memo.to - memo.pos;
				if(memo.move == 'up'){ delta *= -1;}				
				if(delta < memo.pathStop){
					memo.delay = delay;					
					memo.delayCounterStop = 0;					
					memo.pathStop = 0;
					return delay;
				}
				return memo.delay;
			};

			this.delay(_delay, memo, function(memo){
				var pos = 0, stop = false;
				if( memo.move == 'down'){
					pos = memo.pos + memo.step;
					stop = pos < memo.to
				} else {
					pos = memo.pos - memo.step;
					stop = pos > memo.to
				}					
				if(stop){
					window.scrollTo(0, pos);
					memo.pos = pos;
					return memo;	
				} else {
					window.scrollTo(0, memo.to);
					return null;
				}
				
			});						
		},
		delay: function(delay, memo, func){
			if(this.timeout != null){
				clearTimeout(this.timeout);
				this.timeout = null;
			}
			var self = this;
			var _delay = delay;
			if(typeof(delay) == typeof(Function)){
				_delay = delay(memo);
			}			
			this.timeout = setTimeout(function(){
				if(memo == null) return;
				var _memo = func(memo);
				if(_memo!=null){
					self.delay(delay, _memo, func);
				}				
			}, _delay);
		}
	}
    var scroll_to_aselector = function(s){
    	var scroller = new Scroller()
        var a = $("a[name="+s+"]");        
        var from = $(window).scrollTop();
        var to = a.position().top;
        
    	scroller.scroll(from, to);

		//scrollBy(0,s)
		//scrotllTo(from, to)
    };
    $.fn.scrollPage = function () {
        $(this).each(function(){
            var href = $(this).attr("href");
            var goto = href.split("#");
            $(this).attr("href","javascript:;").click(function(){
                scroll_to_aselector( goto[1] );
            });
        });
    }
})(jQuery);
