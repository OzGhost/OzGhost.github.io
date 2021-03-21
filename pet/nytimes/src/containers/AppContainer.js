'use strict';
import AppView from '../views/AppView';
import {Container} from 'flux/utils';
import ArticleStore from '../data/ArticleStore';
import PagingStore from '../data/PagingStore';
import Actions from '../data/Actions';

function getStores() {
  return [
    ArticleStore,
    PagingStore
  ];
}

function getState() {
  return {
    articles: ArticleStore.getState().articles,
    floating: ArticleStore.getState().floating,
    page: PagingStore.getState(),

    onNextNavigation: Actions.nextPage,
    onPreviousNavigation: Actions.previousPage,
    onPickArticle: Actions.pickArticle,
    onUnpickArticle: Actions.unpickArticle
  };
}

export default Container.createFunctional(AppView, getStores, getState);
