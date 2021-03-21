'use strict';
import React from 'react';
import Article from  './Article';
import ArticleInfoExtract from '../utils/ArticleInfoExtract';

function AppView(props){
  return (
      <div>
        <Header {...props}/>
        <Main {...props}/>
        <Modal {...props}/>
        <Footer {...props}/>
      </div>
  );
}

function Header(props) {
  return (
    <header id="header">
      <h1>New York Times News</h1>
    </header>
  );
}

function Main(props) {
  if (props.articles.length === 0) {
    return null;
  }

  return (
    <section id="main">
      <div id="article-list">
        {props.articles.map(article => (
          <Article art={article} key={article._id} onClick={props.onPickArticle}/>
        ))}
      </div>
    </section>
  );
}

function Modal(props) {
  if ( ! props.floating)
    return null;
  const imageUrl = ArticleInfoExtract.getImageUrl(props.floating, 'xlarge');
  const image = imageUrl ? <img className="cover" src={imageUrl}/> : null;
  const pub_date = ArticleInfoExtract.getPublicDate(props.floating);
  var source = props.floating.source
    ? <span><small>Source: </small>{props.floating.source}</span>
    : null;

  return (
    <div className="modal">
      <div
        className="modal-ground"
        onClick={() => {props.onUnpickArticle()} }
      ></div>
      <div className="modal-ctx">
        <span className="dismiss" onClick={() => {props.onUnpickArticle()} }>
          &times;
        </span>
        <h3>Article views</h3>
        <hr/>
        {image}
        <p>{props.floating.snippet}</p>
        <p>
          {source}
          <small> {pub_date}</small>
        </p>
      </div>
    </div>
  );
}

function Footer(props) {
  if (props.articles.length === 0) {
    return null;
  }

  return (
    <footer id="footer">
      <div className="page-navigator chain">
        <button onClick={ () => props.onPreviousNavigation() }>
          &lt;&lt; Previous &lt;&lt;
        </button>
        <span>Page: {props.page + 1}</span>
        <button onClick={ () => props.onNextNavigation() }>
          &gt;&gt; Next &gt;&gt;
        </button>
      </div>
    </footer>
  );
}

export default AppView;
