var commentData = [], currentCommentList = [];

var randomJsonEnding = function(array) {
	return array[parseInt(Math.random() * array.length)] + ".json";
};

var CommentBox = React.createClass({
	getInitialState: function() {
		return {data: []};
	},
	loadComments: function() {
		var self = this;
		var variations = [1, 2, 3];
		var url = this.props.url+randomJsonEnding(variations);
		$.getJSON(url).done(function(data) {
			currentCommentList = data.concat(commentData);
        self.setState({data: currentCommentList});
		}).fail(function(xhr, status, err) {
        console.error(url, status, err.toString());
		});
	},
	handleCommentSubmit: function(comment) {
    // TODO: this is such a hack
		currentCommentList.push(comment);
		commentData.push(comment);
		this.setState({data: currentCommentList});
	},
	componentDidMount: function() {
		this.loadComments();
		setInterval(this.loadComments, this.props.pollInterval);
	},
  render: function() {
    return (
      <div className="commentBox">
				<h4>Comments</h4>
				<CommentList data={this.state.data}/>
				<CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
		var commentNodes = this.props.data.map(function (comment) {
      return (
		  		<Comment author={comment.author}>
		  		{comment.text}
		  	</Comment>
      );
		});
		return (
				<div className="commentList">
				  {commentNodes}
				</div>
		);
	}
});

var CommentForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
		this.props.onCommentSubmit({author: author, text: text});

    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return;
	},
  render: function() {
    return (
			  <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author"/>
        <input type="text" placeholder="Say something not boring..." ref="text" />
        <input type="submit" value="Post" />
				</form>
    );
  }
});

var converter = new Showdown.converter();
var Comment = React.createClass({
  render: function() {
		var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
				<span dangerouslySetInnerHTML={{__html: rawMarkup}}/>
      </div>
    );
  }
});

React.render(
	<CommentBox url="json/comments" pollInterval={2000}/>,
  document.getElementById('content')
);
