'use strict';

const ArticleInfoExtract = {
  getHost(article) {
    return article.web_url
        .substring(0, article.web_url.indexOf('/', 9)+1);
  },

  getImageUrl(article, size) {
    if (article.multimedia.length < 1)
      return false;
    var img = article.multimedia.filter(e => e.subtype === size)[0];
    if (img === undefined) {
      return false;
    }
    return this.getHost(article) + img.url;
  },

  getPublicDate(article) {
    if ( ! article.pub_date)
      return '';
    var pub_date = new Date(article.pub_date);
    return '['+(pub_date.getMonth()+1)
        +'-'+pub_date.getDate()
        +'-'+pub_date.getFullYear()+']';
  },

};

export default ArticleInfoExtract;
