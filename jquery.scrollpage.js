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
* </scropt>
* */
(function ($) {
    function SmartScroll(stepnumbers, wait) {
        this.stepnumbers = stepnumbers;
        this.step = 0;
        this.wait = wait;
        this.timeout_handler = null;
        this.start = 0;
        this.end = 0;
        this.pos = 0;
        this.speed = 2;
    }
    SmartScroll.prototype = {
        log:function(txt){
            //console.log( "SmartScroll." + txt);
        },
        dump:function(name){
            //this.log( name + " pos=" + this.pos + " start="+this.start+" ,end="+this.end+" ,step="+this.step );
        },
        run:function (from, to) {
            this.log("run() from="+from + " to="+to);
            this.start = from;
            this.end = to;
            this.pos = from;
            this.step = (to - from) / this.stepnumbers;
            if (Math.abs(this.step) < 50) {
                this.step = 50 * Math.abs(this.step) / this.step
            }
            if (this.timeout_handler != null) {
                clearTimeout(this.timeout_handler);
            }
            this.dump("run()->scroll()");
            this.scroll();
        },
        isStop: function(){
            var stop = (this.pos-this.start)/(this.end-this.start);
            return stop >= 1;
        },
        scroll:function () {
            var s = this.step;
            this.step *= this.speed;
            this.pos += s;
            if (this.isStop()) {
                window.scrollTo($(window).scrollTop(),this.end);
                this.clearTimeout();
                this.dump("scroll()->stop");
                this.log("s="+s);
            } else {
                this.dump("scroll()");
                window.scrollBy(0, s);
                this.setTimeout();
            }

        },
        setTimeout:function () {
            this.clearTimeout();
            var self = this;
            this.timeout_handler = setTimeout(function () {
                self.scroll();
            }, this.wait);
        },
        clearTimeout:function () {
            this.dump("clearTimeout()");
            if (this.timeout_handler != null) {
                clearTimeout(this.timeout_handler);
                this.timeout_handler = null;
            }
        }
    };
    var smart_scroll = new SmartScroll(10,100);
    var scroll_to_aselector = function(s){
        var a = $("a[name="+s+"]");
        var top = a.position().top;
        smart_scroll.run($(window).scrollTop(), top);
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

