//require jquery
//require jquery.ui
//requere jquery.prettyscroll

(function($){
    $.fn.dropDownScroll = function(){
        var options = arguments[0] || {};
        var menu = options.menu || "i-dropdown-menu";
        var scroll = options.scroll || "i-dropdown-scroll";
        var push = options.push || "i-dropdown-push";
        var scrolloptions = options.scrolloptions || {};
        if( !scrolloptions.baseClass){
            scrolloptions.baseClass = scroll;
        }
        $(this).each(function(){
            $("." + menu).prettyScroll(scrolloptions);
            var handler = function (e) {
                var h = $("." + scroll);
                if(h.has( $(e.target)).length == 0 ){
                    h.hide();
                    $(document).unbind("mousedown", handler);
                }
            };
            $(this).find("."+push).mouseup(
                    function () {
                        $(document).bind("mousedown", handler);
                        $("."+scroll).show();
                    }
            );
            $("."+scroll).css({
                "position":"absolute"
            });
            $("."+scroll).hide();

        });
    }
})(jQuery);
