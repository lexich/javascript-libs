#!
# * jQuery JavaScript plugin
# * http://jquery.com/
# *
# * Copyright 2012, Efremov Alex (lexich)
# *
# * Require jquery-1.7.2.js
# * http://jquery.com/
# *
#

#
#* smooth scroll jQuery plugin
#*
#* usage:
#* <a class="nav" href="#one">One</a>
#* <!-- some staff -->
#* <a name="one">One</a>
#*
#* <script>
#*     $("a.nav").scrollPage();
#* </script>
#*


do(
  $=jQuery or $
) ->

  class Scroller
    constructor:->
      @_listenWindow = false
      @links = []

    init:($els)->
      for el in $els
        unless el in @links
          @links.push el
          $(el).click $.proxy(@event_clickLink, this)

      unless @_listenWindow
        @listenWindow()
        @_listenWindow = true

    scroll: (from, to, options) ->
      wHeight = $(window).height()
      move = (if from < to then "down" else "up")
      DELAY = 40
      memo = $.extend {
        DELAY, from, to, move
        pos: from
        delay: DELAY
        delayStep: 8
        delayCounter: 0
        delayCounterStop: 1
        step: 5
        pathStop: wHeight / 4
      }, options
      @delay @handler_delay, memo, @handler_func, memo.stop

    listenWindow:->
      handler = null
      $(window).scroll =>
        if(handler!=null)
          clearTimeout handler
        handler = setTimeout(
          $.proxy(@event_scrollPage,this),
          1000
        )

    delay: (delay, memo, func, stop) ->
      if @timeout?
        clearTimeout @timeout
        @timeout = null

      _delay = if typeof (delay) is typeof (Function) then delay(memo) else delay
      @timeout = setTimeout(=>
        return stop?() unless memo?
        _memo = func(memo)
        if _memo?
          @delay delay, _memo, func, stop
        else
          stop?()
      , _delay)

    get$Link:($el)->
      href = $el.attr "href"
      if /^#.+/.test(href) then $(href) else null


    handler_delay: (opt) ->
        if opt.delayCounter >= opt.delayCounterStop
          opt.delay -= opt.delayStep
          opt.delayCounter = 0
        else
          opt.delayCounter += 1
        opt.delay = 0  if opt.delay < 0
        delta = opt.to - opt.pos
        delta *= -1  if opt.move is "up"
        if delta < opt.pathStop
          opt.delay = opt.DELAY
          opt.delayCounterStop = 0
          opt.pathStop = 0
          opt.DELAY
        opt.delay

    handler_func: (memo) ->
        pos = 0
        stop = false
        if memo.move is "down"
          pos = memo.pos + memo.step
          stop = pos < memo.to
        else
          pos = memo.pos - memo.step
          stop = pos > memo.to
        if stop
          window.scrollTo 0, pos
          memo.pos = pos
          memo
        else
          window.scrollTo 0, memo.to
          null

    event_clickLink:(e)->
      e.preventDefault()
      $link = @get$Link $(e.target)
      return unless $link?
      from = $(window).scrollTop()
      to = $link.position().top
      move = (if from < to then "down" else "up")
      stopPos = if move is 'down' then to-100 else to + 100
      @scroll from, stopPos, {
        move
        stop:=>
          @scroll stopPos, to
      }

    event_scrollPage:->
      from = $(window).scrollTop()
      pos = from
      delta = $(document).height()
      for link in @links
         $link = @get$Link $(link)
         continue unless $link
         _pos = $link.position().top
         _delta = Math.abs(_pos-from)
         if delta > _delta
           delta = _delta
           pos = _pos
      if pos != from
        @scroll(from, pos)

  scrollPage = new Scroller


  $.fn.scrollPage = ->
    $(this).data("scrollPage",scrollPage)
    scrollPage.init($(this))


