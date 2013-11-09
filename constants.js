(function(){
  // Make sure coderRageGifs exists
  if (!coderRageGifs && typeof coderRageGifs !== "object") {
    return null;
  }

  // CONSTANTS
  coderRageGifs.constants = {
    
    // Authentication
    consumerKey: 'CHifS4iLssRkgc9tDmdvjAh1HCc8Qtg5AxtfZGFbLh713R1r5T', // YOUR API KEY HERE

    // URLs
    corsProxyUrl: 'http://www.corsproxy.com/',
    apiBaseUrl: 'api.tumblr.com/v2/blog/coderrage.tumblr.com/',
    apiPhotosUrl: 'posts/photo/',

    // Photos
    width: 350
  };
}());