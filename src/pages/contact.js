import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

const ContactPage = ({ location }) => (
  <Layout location={location} title="Z‑Notes">
    <h1>Contact</h1>
    <p>
      Feel free to message me at <a href="mailto:ziemen44@gmail.com">ziemen44@gmail.com</a>
      , or ping me on <a href="https://x.com/ziemannzk">Twitter / X</a>
    </p>
  </Layout>
)

export const Head = () => <Seo title="Contact" />
export default ContactPage
