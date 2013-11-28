var coderRageGifs = {

  // Tumblr Oauth
  consumerKey: 'CHifS4iLssRkgc9tDmdvjAh1HCc8Qtg5AxtfZGFbLh713R1r5T',

  // URLs
  corsProxyUrl: 'http://www.corsproxy.com/',
  apiBaseUrl: 'api.tumblr.com/v2/blog/coderrage.tumblr.com/',
  apiPhotosUrl: 'posts/photo/',

  // Posts
  posts: [],
  randomPost: null,
  tag: null,
  lastPostId: null,
  recentlySeen: [],

  // Photos
  imageWidth: 350,

  init: function() {

    var $this = this;
    var initialTemplateLoaded = false;

    $this.posts = lscache.get('posts') || [];

    if (!!$this.posts) {
      $this.setTemplate();
      initialTemplateLoaded = true;
    }

    $('.coder-rage').css('width', $this.imageWidth);
    $this.getPosts(0);

    if (!initialTemplateLoaded) {
      $this.setTemplate();
    }
  },

  getPosts: function(offset) {
    var $this = this;
    $.get(this.getApiUrl('photos',offset), function(data){
      if (data.meta && data.meta.status === 200) {
        if (!data.response.posts.length) {
          return;
        }

        if (data.response.total_posts === $this.posts.length) {
          return;
        }

        var postsAdded = false;
        $.each(data.response.posts, function(i, post){
          postsAdded = $this.addToPosts(post);
        });

        offset = offset + 20;

        if (offset < data.response.total_posts) {
          $this.getPosts(offset);
        }
      }
    });
  },

  addToPosts: function(post) {
    if (!post) {
      return false;
    }

    var $this = this;
    var addedPost = false;

    var tumblrIds = $.map($this.posts, function(post) { return post["id"]; });

    if ($.inArray(post.id, tumblrIds) < 0) {
      $this.posts.push(post);

      lscache.set('posts', $this.posts);
      addedPost = true;
    }
    return addedPost;
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

    this.lastPostId = post.id;

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
        // Since they are all Rage GIF, let's not bother showing that tag
        if (tag === "Rage GIF") return;
        $('.tags')
          .append('<li class="tag'+(selectedTag === tag ? ' selected' : '')+'" data-tag="'+tag+'">#'+tag+'</li>');
      })
    }

    $('.tag')
      .unbind('click')
      .bind('click',function(){
        $this.setTemplate($(this).attr('data-tag'));
      });
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

    this.randomPost = posts[this.getRandomPostId(posts)];
    return this.randomPost;
  },

  getRandomPostId: function(posts) {
    // $this = this;
    // console.log(posts);
    // console.log(Object.keys($this.posts));
    // var postsLeft = jQuery.grep(posts, function(element, i){
    //   console.log('id',element.id);
    //   return !jQuery.inArray(element.id, $this.recentlySeen);
    // });
    // console.log(postsLeft);

    var id;
    var count = 0;

    for (var prop in posts) {
      if (Math.random() < 1/++count) {
        id = prop;
      }
    }

    return id;
    // var id = Math.floor(Math.random() * posts.length);
    // if (posts.length > 1 && posts[id].id === this.lastPostId) {
    //   id = this.getRandomPostId(posts);
    // }
    // Return the Tumblr ID since it is unique and doesn't change if the tag does
    return id;
  },

  getPostsByTag: function(tag) {
    var $this = this;
    var posts = this.posts;

    if (!posts || !tag) {
      return null;
    }

    var taggedPosts = [];
    $.each(posts, function(key, post){
      if ($.inArray(tag, post.tags) >= 0 ) {
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
      return this.corsProxyUrl + this.apiBaseUrl + this.apiPhotosUrl + '?api_key=' + this.consumerKey + '&offset=' + value;
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