/*
 * jQuery JavaScript plugin
 * http://jquery.com/
 *
 * Copyright 2012, Efremov Alex (lexich)
 *
 * Require jquery-1.7.2.js
 * http://jquery.com/
 *
 * Require jquery.ui.js (jQuery.draggable)
 * http://jqueryui.com/
 *
 * Require jquery.prettyscroll.js
 * https://github.com/lexich/javascript-libs/
 *
 */

(function ($) {

    function Controller(options) {
        options = options || {};
        //logger function
        this.logger = options.logger || function () {
        };
        //height of slider
        this.sliderHeight = options.sliderHeight || 30;
        //width of track element
        this.trackWidth = options.trackWidth || 5;
        //css class name of base wrapper
        this.baseClass = options.baseClass || "prettyScroll";
        //css class name of track
        this.trackClass = options.trackClass || "bar";
        //css class name of content wrapper
        this.wrapperContentClass = options.wrapperContentClass || "wrapper";
        //css class name of slider
        this.sliderClass = options.sliderClass || "slider";
        this.background = "transparent";
        this.standartScrollWidth = 16;
        this.hoverClass = options.hoverClass || "scrollhover";
    }

    Controller.prototype = {
        /**
         * Update size element scroll container
         * @param scrollElement
         */
        updateSize:function (scrollElement) {
            this.logger("Controller.update() scrollElement:" + scrollElement);
            var $base = $(scrollElement).parents("." + this.baseClass);
            var $bar = $base.find("." + this.trackClass);
            var $wrapper = $base.find("." + this.wrapperContentClass);
            var w = $base.width();
            $bar.width(this.trackWidth);
            $wrapper.width(w - this.standartScrollWidth);
            $(scrollElement).width(w);
            this.activeScroll(scrollElement, $bar );
        },
        /*Create scroll controls
         * <div class='trackClass'>
         *     <div class='sliderClass'/>
         * </div>
         * */
        scrollControls:function () {
            var $bar = $("<div/>").css({
                "float":"left",
                "width":this.trackWidth,
                "background":this.background
            }).addClass("bar");
            var $slider = $("<div/>").css({
                "height":this.sliderHeight,
                "position":"absolute",
                "border-radius":5,
                "width":this.trackWidth
            }).addClass(this.sliderClass);
            $bar.append($slider);
            return $bar;
        },
        /*
         * Create scroll workflow
         * <div class='baseClass'>
         *   <div class='wrapperContentClass'>
         *       {current control}
         *   </div>
         *       {place for scroll controls}
         * </div>
         * */
        wrapper:function ($scroll) {
            var self = this;
            var maxWidth = $scroll.outerWidth() + this.standartScrollWidth;
            $scroll.wrap(function () {
                return $("<div/>").css({
                    "style":"float",
                    "width":maxWidth,
                    "overflow":"hidden"
                }).addClass(self.baseClass);
            });
            $scroll.wrap(function () {
                return $("<div/>").css({
                    "overflow":"hidden",
                    "float":"left"
                }).addClass(self.wrapperContentClass);
            });
            //insert scroll controls to place for scroll controls
            $scroll.parent().after(self.scrollControls());
        },
        isScroll:function (item) {
            var h = $(item).outerHeight();
            this.logger("isScroll height:" + h + " scrollHeight:" + item.scrollHeight);
            return item.scrollHeight > h;
        },
        activeScroll : function( item, $bar ){
            if (this.isScroll(item)) {
                $bar.show();
                return true;
            } else {
                $bar.hide();
                return false;
            }
        }
    };



    $.fn.prettyScroll = function () {
        //parce options
        var ct = new Controller(arguments[0] || {});

        //apply to all elements
        $(this).each(function () {
            var self = this;
            var $self = $(this);

            var height = $self.height();
            $self.width($self.outerWidth() + ct.standartScrollWidth);

            ct.wrapper($self);

            var $base = $(this).parents("." + ct.baseClass);
            var $bar = $base.find("." + ct.trackClass);
            var $slider = $base.find("." + ct.sliderClass);
            var $wrapper = $base.find("." + ct.wrapperContentClass);
            $bar.height($wrapper.height());

            $(this).scroll(function (e) {
                if( ct.activeScroll(self, $bar)){
                    ct.logger("scroll", e);
                    var height = this.scrollHeight -  $(this).outerHeight();
                    var pos = $(this).scrollTop();
                    var scaleEffect = pos / height;
                    var moveLine = $bar.height() - $slider.height();
                    var top = $bar.position().top + scaleEffect * moveLine;
                    $slider.css({"top" : top });
                }
            });
            ct.activeScroll(self, $bar);
            /**
             * Drap handler for slider scroll control
             */
            $slider.draggable({
                "axis":"y",
                "containment":"parent",
                "scroll":true,
                "cursor":"pointer",
                "drag":function (event, ui) {
                    ct.logger("drag", event, ui);
                    var y = ui.position.top - $bar.position().top;
                    var scrollK = y / ( $bar.height() - $(this).height());
                    var scrollHeight = $self.get(0).scrollHeight;
                    var scrollTop = (scrollHeight - $self.height()) * scrollK;
                    $self.scrollTop(scrollTop);
                }
            });

            $base.hover(function(){
                $(this).addClass(ct.hoverClass);
            }, function(){
                $(this).removeClass(ct.hoverClass);
            });
        });

        //update position

        $(this).on("customResize", function(){
            ct.logger("customResize event");
            ct.updateSize(this);
        });

        $(this).prettyScrollResize();
    };

    $.fn.prettyScrollResize = function(){
        $(this).each(function(){
            $(this).trigger("customResize");
        });
    };
})(jQuery);