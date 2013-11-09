var coderRageGifs = {

  constants: null, // These will be loaded later
  posts: null,
  randomPost: null,

  init: function() {
    
    var $this = this;
    $this.loadConstants();
    
    // We cannot continue execution until the constants are ready    
    var constantsAreReady = function() {
      $('.coder-rage').css('width', $this.constants.width);
      $this.getPosts();
    };

    // Keep trying to load the constants
    var loadingConstants;
    var waitForConstants = function() {
      loadingConstants = setTimeout(function() {
        if (!!$this.constants) {
          clearTimeout(loadingConstants);
          return constantsAreReady();
        }
        waitForConstants();  
      }, 10);
    };
    waitForConstants();
  },

  loadConstants: function() {
    var imported = document.createElement('script');
    imported.src = 'constants.js';
    document.head.appendChild(imported);
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

  setTemplate: function() {
    var $this = this;
    var post = $this.getRandomPost();

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

    // Add the tags
    if (!!post.tags.length) {
      $.each(post.tags, function(key, tag){
        $('.tags')
          .empty()
          .append('<li class="tag">'+tag+'</li>');
      })
    }
  },

  getStretchedHeight: function(image) {
    if (!image) {
      return null;
    }
    return Math.round(image.height * this.constants.width / image.width);
  },

  getRandomPost: function() {
    var posts = this.posts;
    var post = null;

    if (!posts) {
      return post;
    }

    this.randomPost = posts[Math.floor(Math.random() * posts.length)];
    return this.randomPost;
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
      return this.constants.corsProxyUrl + this.constants.apiBaseUrl + this.constants.apiPhotosUrl + '?api_key=' + this.constants.consumerKey;
    }

    if (type === "tag") {
     return this.constants.corsProxyUrl + this.constants.apiBaseUrl + this.constants.apiPhotosUrl + '?api_key=' + this.constants.consumerKey + '&tag=' + value; 
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