
<hr class="with-no-margin"/>
## Qualities tagged with \#{{ include.topic }}



<div id="search-results">
  <ul class="posts">
    {% assign sorted_posts = site.tags[include.topic] | sort_by: 'title'  | reverse %}
    {% for post in sorted_posts %}{% if post.title != null %}
    <li> <a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endif %}{% endfor %}
  </ul>
</div>
