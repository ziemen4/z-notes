import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const NotesIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || "Z‑Notes"
  const notes = data.allMarkdownRemark.nodes

  return (
    <Layout location={location} title={siteTitle}>
      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <ul className="posts-list">
          {notes.map(note => {
            const title = note.frontmatter.title || note.fields.slug
            return (
              <li key={note.fields.slug} className="posts-list__item">
                <Link to={note.fields.slug}>
                  <h2 className="posts-list__title">{title}</h2>
                </Link>
                <p className="posts-list__date">{note.frontmatter.date}</p>
              </li>
            )
          })}
        </ul>
      )}
    </Layout>
  )
}

export default NotesIndex

export const Head = () => <Seo title="Notes" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { fileAbsolutePath: { regex: "/content/blog/" } }
    ){
      nodes {
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
        }
      }
    }
  }
`
