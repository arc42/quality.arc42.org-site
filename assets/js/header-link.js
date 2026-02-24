$(function () {
    $("h1, h2, h3, h4, h5, h6").each(function () {
        var id = $(this).attr("id");
        if (id) {
            var headingText = $(this).clone().children().remove().end().text().trim();
            var linkLabel = headingText ? "Permalink to section: " + headingText : "Permalink to section";
            $(this).append(
                $("<a />")
                    .addClass("header-link")
                    .attr("href", "#" + id)
                    .attr("aria-label", linkLabel)
                    .attr("title", linkLabel)
                    .html('<i class="fa fa-link" aria-hidden="true"></i>')
            );
        }
    });
});
