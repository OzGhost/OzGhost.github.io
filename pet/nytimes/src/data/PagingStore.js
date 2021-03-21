'use strict';
import {ReduceStore} from 'flux/utils';
import Dispatcher from './Dispatcher';
import ActionTypes from './ActionTypes';
import ArticleLoader from '../utils/ArticleLoader';

class PagingStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return 0;
  }

  loadPage(page) {
    ArticleLoader.loadPage(page);
    ArticleLoader.setLocationToPage(page);
  }

  pageValidator(page) {
      return (page < 0) ? 0 : page;
  }

  reduce(state, action) {
    switch(action.type) {

      case ActionTypes.PREV_PAGE:
        var page = this.pageValidator(state - 1);
        this.loadPage(page);
        return page;

      case ActionTypes.NEXT_PAGE:
        var page = this.pageValidator(state + 1);
        this.loadPage(page);
        return page;

      case ActionTypes.PAGE_JUMP:
        var page = this.pageValidator(action.page);
        this.loadPage(page);
        return page;

      case ActionTypes.HISTORY_TRAVEL:
        var page = this.pageValidator(action.page);
        ArticleLoader.loadPage(page);
        return page;
      
      default:
        return state;
    }
  }
}

export default new PagingStore();
