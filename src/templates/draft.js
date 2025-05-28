import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

export const Head = () => (
  <meta name="robots" content="noindex,nofollow" />
)

export default function DraftTemplate({ data }) {
  const post = data.markdownRemark
  return (
    <Layout title={`Draft: ${post.frontmatter.title}`}>
      <Seo title={post.frontmatter.title} />
      <article>
        <header>
          <h1>{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </Layout>
  )
}

export const query = graphql`
  query DraftByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
