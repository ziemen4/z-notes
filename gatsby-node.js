/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

// Define the template for blog post
const blogPost = path.resolve(`./src/templates/blog-post.js`)
const draftTemplate = path.resolve(`./src/templates/draft.js`)

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { frontmatter: { date: ASC } }
        limit: 1000
        filter: { fields: { slug: { ne: null } } }
      ) {
        nodes {
          id
          fields {
            slug
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }

  const draftResult = await graphql(`
    {
      allMarkdownRemark(
        filter: { fields: { draftSlug: { ne: null } } }
      ) {
        nodes {
          id
          fields {
            draftSlug
            draftUUID
          }
        }
      }
    }
  `)

  if (draftResult.errors) {
    reporter.panicOnBuild(`Error loading draft posts`, draftResult.errors)
    return
  }

  draftResult.data.allMarkdownRemark.nodes.forEach(node => {
    const pagePath = `/draft${node.fields.draftSlug}`
  
    createPage({
      path: pagePath,
      component: draftTemplate,
      context: { id: node.id },
    })
  })
}

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const fileNode = getNode(node.parent)
    const source = fileNode.sourceInstanceName

    if (source === `blog`) {
      // your existing slug logic
      const slug = createFilePath({ node, getNode, basePath: `content/blog` })
      createNodeField({ name: `slug`, node, value: slug })
    }

    if (source === `draft`) {
      // build a draft-only slug and pull out the UUID folder name
      const draftPath = createFilePath({ node, getNode, basePath: `content/draft` })
      const [, uuid] = draftPath.split(`/`).filter(Boolean)

      createNodeField({
        node,
        name: `draftSlug`,
        value: draftPath,
      })
      createNodeField({
        node,
        name: `draftUUID`,
        value: uuid,
      })
    }
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
      draftSlug: String    # ← newly added
      draftUUID: String    # ← newly added
    }
  `)
}
