//require jquery
//require jquery.ui
//requere jquery.prettyscroll

(function($){
    function Controller( options ){
        this.menu = options.menu || "i-dropdown-menu";
        this.scroll = options.scroll || "i-dropdown-scroll";
        this.push = options.push || "i-dropdown-push";
        this.elements = options.elements || "li > a";
        this.scrolloptions = options.scrolloptions || {};
    }
    Controller.prototype = {
        updateByContext : function(input, $base ){
            var val = $(input).val().toLowerCase();
            $base.find(this.elements).each(
                function(){
                    var text = $(this).text().toLowerCase();
                    if( text.indexOf(val) != -1 ){
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            $base.find("."+this.menu).prettyScrollResize();
        }
    };

    $.fn.dropDownScroll = function(){
        var ct = new Controller( arguments[0] || {} );

        if( !ct.scrolloptions.baseClass){
            ct.scrolloptions.baseClass = ct.scroll;
        }
        $(this).each(function(){
            var $self = $(this);
            var $push = $self.find("."+ct.push);

            $("." + ct.menu).prettyScroll(ct.scrolloptions);
            var handler = function (e) {
                var h = $("." + ct.scroll);
                if(h.has( $(e.target)).length == 0 ){
                    h.hide();
                    $(document).unbind("mousedown", handler);
                }
            };
            $push.mouseup(
                    function () {
                        $(document).bind("mousedown", handler);
                        $("."+ct.scroll).show();
                    }
            );
            $push.keyup(
                function(){
                    ct.updateByContext(this, $self );
                }
            );
            ct.updateByContext($push.get(0), $self );

            $("."+ct.scroll).css({
                "position":"absolute"
            });
            $("."+ ct.scroll).hide();

        });

    }
})(jQuery);
