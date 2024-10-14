import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import posts from './posts';

import 'katex/dist/katex.min.css'; // Import KaTeX styles

function Post() {
  const { id } = useParams();
  const post = posts[id];

  return (
    <div>
      <h2>{post.title}</h2>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {post.content}
      </ReactMarkdown>
    </div>
  );
}

export default Post;
