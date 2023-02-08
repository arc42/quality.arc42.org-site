
<hr class="with-no-margin"/>

## <font style="background-color:var(--quality-color)">Qualities tagged with #{{ include.topic }}</font>

<div id="search-results">
  <ul class="posts">
    {% assign sorted_posts = site.tags[include.topic] | sort_by: 'title'  | reverse %}
    {% assign sorted_posts = sorted_posts | where: "categories", "qualities" %}
    {% for post in sorted_posts %}{% if post.title != null %}
    <li> <a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endif %}{% endfor %}
  </ul>
</div>


 
## <font style="background-color:var(--qual-req-color)">Requirements tagged with #{{ include.topic }}</font>

<div id="search-results">
  <ul class="posts">
    {% assign sorted_posts = site.tags[include.topic] | sort: 'title' %}
    {% assign sorted_posts = sorted_posts | where: "categories", "requirements" %}
    {% for post in sorted_posts %}{% if post.title != null %}
    <li> <a href="{{ post.url }}">{{ post.title }}</a>&nbsp; | &nbsp; <i>
        <small> <i class="fa fa-tags" style="color: #1675b9;"> </i> &nbsp; </small>
        {% for tag in post.tags %}
        <small> <a href="/tag-{{tag}}">#{{tag}}</a> </small>
        {% endfor %}
    </i></li>
    {% endif %}{% endfor %}
  </ul>
</div>


    

