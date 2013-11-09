var coderRageGifs = {

  constants: null, // These will be loaded later

  init: function() {
    this.loadConstants();
  },

  loadConstants: function(){
    var imported = document.createElement('script');
    imported.src = 'constants.js';
    document.head.appendChild(imported);
  },

  getPosts: {

  }
};