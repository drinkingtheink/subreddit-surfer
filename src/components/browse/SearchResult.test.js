import React from 'react'
import { mount, shallow } from 'enzyme'
import SearchResult from './SearchResult'
import { exampleSearchResult } from './test/exampleSearchResult.js'

const redditBaseUrl = 'https://www.reddit.com'

describe(`Search Result =====================`, () => {

  it(`renders without crashing`, () => {
    const component = shallow(<SearchResult result={ exampleSearchResult } />)
    expect(component.exists()).toBe(true)
  });

  it('displays passed result data', () => {
    const searchResult = mount(<SearchResult result={ exampleSearchResult } redditBaseUrl={ redditBaseUrl } />)
    expect(searchResult.find('.post-title').text()).toEqual(exampleSearchResult.title)
    expect(searchResult.find('.prefixed-subreddit').text()).toEqual(exampleSearchResult.subreddit_name_prefixed)
    expect(searchResult.find('.post-comments-count').text()).toEqual(`${exampleSearchResult.num_comments} Comments`)
    expect(searchResult.find('.post-headline a').prop('href')).toEqual(`${redditBaseUrl}/${exampleSearchResult.permalink}`)
    expect(searchResult.find('.post-headline a').prop('target')).toEqual('_blank')
  });

});
