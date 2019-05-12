import React, { Component } from 'react'
import BrowseSearchResults from '../browse/BrowseSearchResults'
import Pagination from '../browse/Pagination'
import SearchMessage from './SearchMessage'
import RedditLogo from './RedditLogo'
import { debounce } from 'throttle-debounce'

const redditBaseUrl = 'https://www.reddit.com'
const initialHeadline = 'Surf the Subreddits'
const initialActiveResultsPageIndex = 0

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headline: initialHeadline,
      searchTerm: '',
      searchFeedback: null,
      searchResults: [],
      fetchingData: false,
      showError: false,
      activeResultsPageIndex: initialActiveResultsPageIndex,
      currentSubreddit: null
    };
    this.searchTheReddits = debounce(500, this.searchTheReddits);
  }

  handleSearchTermChange = (e) => {
    let searchText = e.target.value || ''
  
    this.setState({
        searchTerm : searchText,
        showError: false
    });
    
    if(searchText && searchText.length > 2) {
        this.clearSearchResults()
        let trimmedText = searchText.replace(/\s/g, '')
        this.searchTheReddits(trimmedText)
    } 
  }

  searchTheReddits = (searchText) => {
    const subredditSearch = `/r/`
    const url = `${redditBaseUrl}${subredditSearch}${searchText}.json`
    const groupCount = 10

    this.setState({
      fetchingData : true
    });

    fetch(url)
      .then(response => response.json())
      .then(response => response["data"].children || [])
      .then(composedSearchResults => this.generateResultsGroups(composedSearchResults, groupCount))
      .then(composedSearchGroups => {
        let firstGroup = composedSearchGroups[0].list[0].data
        let currentSubreddit = firstGroup.subreddit || null
        this.setState({
          fetchingData: false,
          activeResultsPageIndex: 0,
          currentSubreddit: currentSubreddit
        })
      })
      .catch(error => {
        this.setState({
          showError: true,
          fetchingData: false,
          activeResultsPageIndex: 0
        })
      })
  }

  generateResultsGroups = (rawResults, groupSize) => {
    let index = 0
    const arrayLength = rawResults.length
    const groupList = []
    let entry = 0
    
    for (index = 0; index < arrayLength; index += groupSize) {
      let newGroup = {
        list: rawResults.slice(index, index+groupSize),
        entry: entry++
      }
      groupList.push(newGroup)
    }
    
    this.setState({
      searchResults: groupList
    })

    return groupList
  }

  resetSearch = () => {
    this.setState({
      headline: initialHeadline,
      searchTerm: '',
      searchFeedback: null,
      searchResults: [],
      fetchingData: false,
      currentSubreddit: null,
      showError: false,
      activeResultsPageIndex: initialActiveResultsPageIndex
    })
    this.refs.search.value = ''
    this.refs.search.focus()
  }

  clearSearchResults = () => {
    this.setState({
      searchResults: []
    })
  }

  incrementActiveResultsPageIndex = (upperBounds) => {
    let newIndex = this.state.activeResultsPageIndex + 1
    this.setState({
      activeResultsPageIndex: newIndex
    })
  }

  decrementActiveResultsPageIndex = () => {
    let newIndex = this.state.activeResultsPageIndex - 1
    this.setState({
      activeResultsPageIndex: newIndex
    })
  }

  componentDidMount(){
    if (this.refs && this.refs.search) {
      this.refs.search.focus()
    }
  }

  render() {
    const searchResultsFound = this.state.searchResults && this.state.searchResults.length > 0
    const searchResultsCount = searchResultsFound ? this.state.searchResults.length : 0
    const searchTermActive = this.state.searchTerm && this.state.searchTerm.length > 2
    let activeResultsGroup = this.state.searchResults[this.state.activeResultsPageIndex] || false

    return (
      <main className="subreddit-search">
        <div className="subreddit-search__input-stage">
          
          <h1 className="main-headline">
            <RedditLogo 
              fetchingData={ this.state.fetchingData } 
              resultsDisplayed={ searchResultsFound } />
            { this.state.headline }
          </h1>
          
          <input 
            type="text"
            onChange={ this.handleSearchTermChange.bind(this) }
            className="subreddit-search__input"
            placeholder="Start typing to surf the Subreddits..." 
            ref="search" />
        </div>

        <section className="actions">
          { (searchResultsFound && searchTermActive) || this.state.showError
            ? 
              <>
                <button 
                  className={`prev-results ${searchResultsFound && this.state.activeResultsPageIndex > 0 ? '' : 'disabled' }`}
                  onClick={ this.decrementActiveResultsPageIndex }> 
                    &lt;&lt; 
                </button>
                <button 
                  className="reset-search" 
                  onClick={this.resetSearch}>
                  Reset Search
                </button> 
                <button 
                  className={`next-results ${searchResultsFound && this.state.activeResultsPageIndex < searchResultsCount - 1 ? '' : 'disabled' }`}
                  onClick={ this.incrementActiveResultsPageIndex }> 
                    &gt;&gt; 
                </button>
              </>
            : null
          }
        </section>  

        <section className="results">
          { searchResultsFound && searchTermActive ? (
            <h3 className="search-results-header">
              Most Recents Post{ searchResultsCount > 1 || searchResultsCount ? 's ' : null }
              { this.state.currentSubreddit 
                ? <>
                    for <em className="current-subreddit"> { this.state.currentSubreddit }</em>
                  </>
                : null
              }
            </h3>
          ) : null
        }


          { this.state.showError && searchTermActive
            ? <SearchMessage headline="Whoops, something went wrong with your search" message="Please try a different search term or try again later. Thank you." />
            : null
          }

          { searchResultsFound && searchTermActive
            ? <Pagination 
                groups={ this.state.searchResults } 
                activeResultsPageIndex={ this.state.activeResultsPageIndex }
                activeResultsGroup={ activeResultsGroup }
              />
            : null
          }

          { activeResultsGroup && searchTermActive
            ? <BrowseSearchResults 
                redditBaseUrl={ redditBaseUrl }  
                searchResultsGroup={ activeResultsGroup } 
                searchResultsFound={ searchResultsFound }
                searchResultsCount={ searchResultsCount }
              />
            : null
          }

          { !this.state.searchTerm && !this.state.showError 
            ? <SearchMessage headline="You should enter a search term" message="What do you want to explore? Space? Waffles? Car repair? Whatever it is, we'll try to find the most recent posts." />
            : null
          }
        </section>

      </main>
    )
  }
}

export default Search;
