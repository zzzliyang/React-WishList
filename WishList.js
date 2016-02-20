import React from 'react';
import { DatePicker } from 'antd';

ReactDOM.render(<DatePicker />, document.getElementById('content'));

var WishItem = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.onWishComplete(this.props.wish);
  },
  render: function() {
    return (
      <tr>
          <td>{this.props.wish.wish}</td>
          <td>{this.props.author}</td>
          <td>
            <form ref="form" onSubmit={this.handleSubmit}>
              <button
               type="submit"
               name="completeButton" >
                Completed!
               </button>
            </form>
          </td>
      </tr>
    );
  }
});

var ArchiveItem = React.createClass({
  render: function() {
    return (
      <tr>
          <td>{this.props.wish.wish}</td>
          <td>{this.props.author}</td>
      </tr>
    );
  }
});

var CategoryRow = React.createClass({
  render: function() {
    return (
      <tr>
          <th colSpan="2">
          {this.props.category}
          </th>
      </tr>
    );
  }
});

var SearchBox = React.createClass({
  onFilterChange: function() {
    this.props.onSearch(this.refs.filterTextInput.value);
  },
  render: function() {
    return (
      <form>
          <input
           type="text"
           placeholder="serch..."
           value={this.props.filterText}
           ref="filterTextInput"
           onChange={this.onFilterChange} />
      </form>
    );
  }
});

var WishTable = React.createClass({
  render: function() {
    var lastCategory = null;
    var rows = [];
    this.props.wishes.forEach(function(wish){
      if (wish.wish.indexOf(this.props.filterText) === -1
          || wish.archived != this.props.archived) {
        return;
      }
      if (wish.category != lastCategory) {
        lastCategory = wish.category;
        rows.push(<CategoryRow category={lastCategory} key={lastCategory} />);
      }
      rows.push(
        this.props.archived?
        <ArchiveItem wish={wish} author={wish.author} key={wish.wish} />:
        <WishItem wish={wish} author={wish.author} key={wish.wish} onWishComplete={this.props.onWishComplete}/>
      );
    }.bind(this));
    return (
      <table>
        <thead>
          <tr>
            <th>Wish</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

var WishContainer = React.createClass({
  getInitialState: function() {
    return {filterText: ''};
  },
  onSearch: function(newFilter) {
    this.setState({filterText: newFilter});
  },
  render: function() {
    return (
      <div>
          <h2>Wish List</h2>
          <SearchBox onSearch={this.onSearch} />
          <WishTable
            wishes={this.props.wishes}
            filterText={this.state.filterText}
            archived={false}
            onWishComplete={this.props.onWishComplete} />
      </div>
    );
  }
});

var ArchiveContainer = React.createClass({
  getInitialState: function() {
    return {filterText: ''};
  },
  onSearch: function(newFilter) {
    this.setState({filterText: newFilter});
  },
  render: function() {
    return (
      <div>
        <h2>Archive Table</h2>
        <SearchBox
          filterText={this.state.filterText}
          onSearch={this.onSearch} />
        <WishTable
          wishes={this.props.wishes}
          filterText={this.state.filterText}
          archived={true}/>
      </div>
    );
  }
});

//TODO: layout!
var MainContainer = React.createClass({
  getInitialState: function() {
    return {wishes: []};
  },
  loadWishes: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({wishes: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadWishes();
    setInterval(this.loadWishes, this.props.interval);
  },
  handleWishComplete: function(wish) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: wish,
      success: function(data) {
        this.setState({wishes: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <WishContainer
          wishes={this.state.wishes}
          onWishComplete={this.handleWishComplete} />
        <ArchiveContainer
          wishes={this.state.wishes} />
     </div>
   );
  }
});

// ReactDOM.render(
//   <MainContainer url="/api/wishes" interval={2000} />,
//   document.getElementById('content')
// );
