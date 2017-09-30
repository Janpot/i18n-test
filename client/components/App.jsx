import React from 'react';

import {
  I18n_simple_tag,
  I18n_interpolated_tag,
  I18n_nested_markup,
  I18n_link
} from 'i18n';

export default class App extends React.Component {
  render() {
    const sub = <strong>interpolated jsx</strong>;
    const someHtml = '<em>hello from html string</em>';
    return (
      <div style={{textAlign: 'center'}}>
        <h1>Hello I18n</h1>
        <p>
          <I18n_simple_tag />
        </p>
        <p>
          <I18n_interpolated_tag sub1="substitution" sub2={sub} />
        </p>
        <p>
          <I18n_nested_markup />
        </p>
        <p>
          <I18n_link theText="Link text" theHref="https://www.google.com" />
        </p>
        <p>
          <I18n_interpolated_tag sub1={someHtml} sub2={<span dangerouslySetInnerHTML={{__html: someHtml}} />} />
        </p>
        <p>
          Use as function: {I18n_simple_tag()}
        </p>
      </div>);
  }
}
