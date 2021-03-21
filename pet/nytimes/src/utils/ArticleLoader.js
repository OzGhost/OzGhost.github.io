'use strict';
import Actions from '../data/Actions';
import Shipper from './Shipper';

const link = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=5763846de30d489aa867f0711e2b031c&q=singapore&page=';


const ArticleLoader = {
  loadPage(page) {
    new Shipper(link+page).asGet().send().then(
        (payload) => {
          Actions.articleComming(payload.response.docs);
        }, () => {
          console.log('Fail to retrieve article from api');
        }
    );
  },

  setLocationToPage(page) {
    var location = window.location.href;
    var locateWithoutQuery = location.substring(0, location.indexOf('?'));
    var newLocation = locateWithoutQuery + "?page="+page;
    window.history.pushState({'page': page}, '', newLocation);
  },

  getPageFromQuery() {
    var location = window.location.href;
    var query = location.substring(location.indexOf('?') + 1, location.length);
    var qUpper = query.toUpperCase();
    if (qUpper.indexOf('PAGE') < 0)
      return 0;

    var qPart = qUpper.split('&');
    for (var i = 0; i < qPart.length; i++) {
      var keyVal = qPart[i].split('=');
      if (keyVal[0] === 'PAGE') {
        var pageIndex = +keyVal[1]
        if  (Number.isNaN(pageIndex) || pageIndex < 0)
          return 0;
        else
        return pageIndex;
      }
    }
    return 0;
  }
};

export default ArticleLoader;
