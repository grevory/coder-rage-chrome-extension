var coderRageGifs = {

  // Tumblr Oauth
  consumerKey: 'CHifS4iLssRkgc9tDmdvjAh1HCc8Qtg5AxtfZGFbLh713R1r5T',

  // URLs
  corsProxyUrl: 'http://www.corsproxy.com/',
  apiBaseUrl: 'api.tumblr.com/v2/blog/coderrage.tumblr.com/',
  apiPhotosUrl: 'posts/photo/',

  // Posts
  posts: null,
  randomPost: null,
  tag: null,

  // Photos
  imageWidth: 350,

  init: function() {
    
    var $this = this;
    
    $('.coder-rage').css('width', $this.imageWidth);
    $this.getPosts();
  },

  getPosts: function() {
    var $this = this;
    $.get(this.getApiUrl(), function(data){
      if (data.meta.status === 200) {
        if (!data.response.posts.length) {
          return null;
        }
        $this.posts = data.response.posts;

        $this.setTemplate();
      }
    });
  },

  setTemplate: function(selectedTag) {
    var $this = this;

    if (!!selectedTag) {
      $this.tag = selectedTag;
    }

    var post = $this.getRandomPost(selectedTag);
    if (!post) {
      return null;
    }

    var image = $this.extractImage(post);

    // Draw the image
    $('.thumbnail img')
      .attr('src', image.url)
      .show();
    $('.thumbnail a')
      .attr('href', post.post_url);
    $('.thumbnail .url').show();
    $('.thumbnail .url p')
      .text(post.short_url)
      .click(function(){
        $this.highlightText('urlText');
      });
    $('.thumbnail')
      .animate({height: $this.getStretchedHeight(image) + 42}, 500);
    $('.reload-image')
      .show()
      .unbind('click')
      .bind('click',function(){
        $this.setTemplate();
      });
    $('.tags')
      .empty()

    // Add the tags
    if (!!post.tags.length) {
      $.each(post.tags, function(key, tag){
        $('.tags')
          .append('<li class="tag'+(selectedTag === tag ? ' selected' : '')+'" onclick="coderRageGifs.setTemplate(\''+tag+'\')">#'+tag+'</li>');
      })
    }
  },

  getStretchedHeight: function(image) {
    if (!image) {
      return null;
    }
    return Math.round(image.height * this.imageWidth / image.width);
  },

  getRandomPost: function(tag) {
    var posts = this.posts;
    var post = null;

    if (!posts) {
      return post;
    }

    if (!!tag) {
      posts = this.getPostsByTag(tag);
    }

    this.randomPost = posts[Math.floor(Math.random() * posts.length)];
    return this.randomPost;
  },

  getPostsByTag: function(tag) {
    var $this = this;
    var posts = this.posts;

    if (!posts || !tag) {
      return null;
    }

    var taggedPosts = [];
    $.each(posts, function(key, post){
      if ($.inArray(tag, post.tags) >=0 ) {
        taggedPosts.push(post);
      }
    });

    return taggedPosts;
  },

  extractImage: function(post) {
    if (!post) {
      return null;
    }

    if (!post.photos.length) {
      return null;
    }

    var image = post.photos[0].original_size;
    image.caption = post.photos[0].caption;
    return image;
  },

  getApiUrl: function(type, value) {
    if (type === "photos" || !type) {
      return this.corsProxyUrl + this.apiBaseUrl + this.apiPhotosUrl + '?api_key=' + this.consumerKey;
    }

    if (type === "tag") {
     return this.corsProxyUrl + this.apiBaseUrl + this.apiPhotosUrl + '?api_key=' + this.consumerKey + '&tag=' + value; 
    }
  },

  // Scored from http://stackoverflow.com/a/987376
  highlightText: function(element){
    var text = document.getElementById(element);
    var selection = window.getSelection();
    selection.setBaseAndExtent(text, 0, text, 1);
  }
};

coderRageGifs.init();