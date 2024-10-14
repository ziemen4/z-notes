import React from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import Post from './Post'; // A component to render blog posts
import posts from './posts'; // Importing list of posts

function App() {
  return (
    <Router>
      <div>
        <h1>My Blog</h1>
        <ul>
          {posts.map((post, index) => (
            <li key={index}>
              <Link to={`/post/${index}`}>{post.title}</Link>
            </li>
          ))}
        </ul>

        <Route path="/post/:id" component={Post} />
      </div>
    </Router>
  );
}

export default App;
