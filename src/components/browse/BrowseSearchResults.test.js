import React from 'react'
import { shallow } from 'enzyme'
import BrowseSearchResults from './BrowseSearchResults'
import { exampleSearchResultsGroups } from './test/exampleSearchResultsGroups'

const redditBaseUrl = 'https://www.reddit.com'
const exampleSearchResultGroup = exampleSearchResultsGroups[0]

const wrapper = shallow(<BrowseSearchResults 
  redditBaseUrl={ redditBaseUrl }
  searchResultsGroup={ exampleSearchResultGroup }
 />)

describe(`BrowseSearchResults =====================`, () => {

  it(`renders with props`, () => {
    expect(wrapper).toMatchSnapshot();
  });
});