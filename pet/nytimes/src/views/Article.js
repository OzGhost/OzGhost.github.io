'use strict';

import React from 'react';
import ArticleInfoExtract from '../utils/ArticleInfoExtract';

class Article extends React.Component {

  constructor(props) {
    super(props)
  }
  
  render() {
    const imageUrl = ArticleInfoExtract.getImageUrl(this.props.art, 'wide');
    const image = imageUrl ? <img src={imageUrl}/> : null;
    const pub_date = ArticleInfoExtract.getPublicDate(this.props.art);
    var article_class = imageUrl ? 'article-full' : 'article-text-only';
    article_class += ' chain article';

    var source = this.props.art.source
      ? <span><small>Source: </small>{this.props.art.source}</span>
      : null;

    return (
      <div
        className={article_class}
        onClick={ () => {this.props.onClick(this.props.art)} }
      >
        {image}
        <div className="article-ctx">
          {this.props.art.snippet}
          <p>
            {source}
            <small> {pub_date}</small>
          </p>
        </div>
      </div>
    );
  };
}

export default Article;
