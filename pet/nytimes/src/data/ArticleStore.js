import {ReduceStore} from 'flux/utils';
import ActionTypes from './ActionTypes';
import Dispatcher from './Dispatcher';

class ArticleStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return {
      articles: [],
      floating: ''
    };
  }

  reduce(state, action) {
    switch(action.type) {

      case ActionTypes.ARTICLE_COMMING:
        return {
          articles: action.articles,
          floating: false
        };

      case ActionTypes.ARTICLE_PICK:
        return Object.assign({}, state, {floating: action.article});

      case ActionTypes.ARTICLE_UNPICK:
        return Object.assign({}, state, {floating: false});

      default:
        return state;
    }
  }
}

export default new ArticleStore();

