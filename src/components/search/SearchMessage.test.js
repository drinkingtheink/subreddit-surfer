import React from 'react'
import { shallow } from 'enzyme'
import SearchMessage from './SearchMessage'

const compName = 'SearchMessage'
const exampleMessageBody = {
	headline: 'This Headline',
	message: 'This Message'
}

describe(`${compName} =====================`, () => {

  it(`renders without crashing`, () => {
    const component = shallow(<SearchMessage />)
    expect(component.exists()).toBe(true)
  });

  it('renders correctly with no props', () => {
  	const component = shallow(<SearchMessage />);
	expect(component).toMatchSnapshot();
  });

  it('displays passed headline and message', () => {
    const searchMessage = shallow(<SearchMessage headline={ exampleMessageBody.headline } message={ exampleMessageBody.message } />)
    expect(searchMessage.find('h2').text()).toEqual(exampleMessageBody.headline)
  	expect(searchMessage.find('p').text()).toEqual(exampleMessageBody.message)
  });

});
