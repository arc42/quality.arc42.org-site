<hr class="with-no-margin"/>

## <span style="background-color:var(--quality-color)">Qualities tagged with #{{ include.topic }}</span>

<div id="search-results">
  <ul class="posts">
    {% assign sorted_posts = site.tags[include.topic] | sort_by: 'title'  | reverse %}
    {% assign sorted_posts = sorted_posts | where: "categories", "qualities" %}
    {% for post in sorted_posts %}{% if post.title != null %}
    <li> <a href="{{ post.url | prepend: site.baseUrl }}">{{ post.title }}</a></li>
    {% endif %}{% endfor %}
  </ul>
</div>

## <span style="background-color:var(--qual-req-color)">Requirements tagged with #{{ include.topic }}</span>

{% assign qualities_unsorted = site.posts | where: "categories", "qualities" %}
{% assign qualities = qualities_unsorted | sort %}

<div id="search-results">
    <ul class="posts">
    {% assign sorted_posts = site.tags[include.topic] | sort: 'title' %}
    {% assign sorted_posts = sorted_posts | where: "categories", "requirements" %}
    {% for post in sorted_posts %}{% if post.title != null %}
    <li  class="no-bullets"> <a class="reqs" href="{{ post.url | prepend: site.baseUrl }}"><i class="fa fa-lightbulb fa-xs as-bullet" style="color: var(--req-text-color);"> </i>{{ post.title }}</a></li>
    {% endif %}
    {% for quality in qualities %}
        {% assign check_title = quality.title | downcase %}
        {% assign related = post.related | split: ", "%}
        {% if related contains check_title %}
            <li class="small"><a href="{{ quality.url | prepend: site.baseUrl }}"> {{quality.title}} </a></li>
        {% endif %}
    {% endfor %}
{% endfor %}
  </ul>
</div>


    

