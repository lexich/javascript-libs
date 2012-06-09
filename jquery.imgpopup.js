/*
 * jQuery JavaScript plugin
 * http://jquery.com/
 *
 * Copyright 2012, Efremov Alex (lexich)
 *
 */
$.fn.imgPopup = function(){
    var options = arguments[0] || {};
    var wrapClass = options.wrapClass || "imgPopup";

    function imgPopupUpdateSize($cloneObject){
        if( $(window).height() > $cloneObject.height()){
            $cloneObject.css({"max-width" : $(window).width() * 0.8});
        } else if( $(window).width() > $cloneObject.width() ){
            $cloneObject.css({"max-height" : $(window).height() * 0.8});
        } else {
            var x = $(window).width() / $cloneObject.width();
            var y = $(window).height() / $cloneObject.height();
            if( x > y ){
                $cloneObject.css({"max-width" : $(window).width() * 0.8 / x });
            } else {
                $cloneObject.css({"max-height" : $(window).height() * 0.8 / x });
            }
        }
        $cloneObject.css({"left" : ($(window).width() - $cloneObject.width()) /2 });
    }
    $(this).each(function () {
        var href = $(this).attr("src");
        var $self = $(this);
        $self.click(function(){
            var $cloneObject = $self.clone();
            $cloneObject.css({
                "position" : "fixed",
                "top" : 50
            }).addClass(wrapClass);
            $("#body").after($cloneObject);
            imgPopupUpdateSize($cloneObject);

            var resizeHandler = function(){
                imgPopupUpdateSize($cloneObject);
            };

            var bInit = false;
            var handler = function(e){
                if( bInit ){
                    $cloneObject.remove();
                    $(document).unbind("click", handler );
                    $(document).unbind("resize", resizeHandler );
                } else {
                    bInit = true;
                }
            };
            $(window).bind("resize",resizeHandler);
            $(document).bind("click", handler );
        });
    });
};