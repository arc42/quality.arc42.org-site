$(function () {
    // enable navigation toggle
    $('.nav-toggle').on('click', function(e) {
      e.preventDefault();
      var toggle = $(e.currentTarget);
      var target = $(toggle.data('target'));

      if (target.length) {
        toggle.toggleClass('active');
        target.toggleClass('active');
        toggle.attr('aria-expanded', target.hasClass('active') ? 'true' : 'false');
      }
    });

    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            $('.nav-toggle.active').each(function() {
                var toggle = $(this);
                var target = $(toggle.data('target'));
                toggle.removeClass('active').attr('aria-expanded', 'false');
                target.removeClass('active');
            });
        }
    });

    $(document).on('click', function(e) {
        if ($(e.target).closest('.site-header').length) return;
        $('.nav-toggle.active').each(function() {
            var toggle = $(this);
            var target = $(toggle.data('target'));
            toggle.removeClass('active').attr('aria-expanded', 'false');
            target.removeClass('active');
        });
    });

    // focus on search input with '/' key.
    $("body").on("keyup", function (e) {
        if ($(e.target).is("input, textarea, select")) return;
        e.stopPropagation();
        var slashKeys = [47, 111, 191];
        if (slashKeys.some(function (value) { return e.keyCode == value })) {
            $("#search").focus();
        }
    });

    // add `target="_blank"` into all outer links.
    var host = document.location.host;
    $("a[href]").each(function() {
        var re = new RegExp(host, "g");
        if ($(this).attr("href").match(/\/\//) && !$(this).attr("href").match(re)) {
            $(this).attr("target", "_blank");
        }
    });

    // center and linkable all images.
    var $images = $("article img:not(.emoji, .eye-catch)");
    $images.closest("p").css("text-align", "center");
    $images.each(function () {
        var imgUrl = $(this).attr("src");
        var $a = $("<a>").attr("href", imgUrl).attr("target", "_blank");
        $(this).wrap($a);
    });

    // stick aside when legacy layouts still provide one.
    var aside = $(".site-aside");
    if (aside.length && $.fn.sticky) {
        var topSpacing = aside.css("padding-top").replace(/px/, "");
        $(".site-aside .sticky").sticky({
            topSpacing: parseInt(topSpacing)
        });
    }
});
