import ActionTypes from './ActionTypes';
import Dispatcher from './Dispatcher';

const Actions = {
  articleComming(articles) {
    Dispatcher.dispatch({
      type: ActionTypes.ARTICLE_COMMING,
      articles,
    });
  },

  nextPage() {
    Dispatcher.dispatch({
      type: ActionTypes.NEXT_PAGE
    });
  },

  previousPage() {
    Dispatcher.dispatch({
      type: ActionTypes.PREV_PAGE
    });
  },

  jumpToPage(page) {
    Dispatcher.dispatch({
      type: ActionTypes.PAGE_JUMP,
      page
    });
  },

  historyTravel(pageInHistory) {
    Dispatcher.dispatch({
      type: ActionTypes.HISTORY_TRAVEL,
      page: pageInHistory
    });
  },

  pickArticle(article) {
    Dispatcher.dispatch({
      type: ActionTypes.ARTICLE_PICK,
      article
    });
  },

  unpickArticle() {
    Dispatcher.dispatch({
      type: ActionTypes.ARTICLE_UNPICK
    });
  }
};

export default Actions;
