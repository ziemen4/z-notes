// src/pages/about.js

import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const AboutPage = ({ location }) => (
  <Layout location={location} title="Z‑Notes">
    <h1>About</h1>

    <p>
      Hi there! I’m Ziemann. Welcome to <strong>Z‑Notes</strong>, my personal space for sharing notes and insights.
    </p>

    <p>
      I’m primarily working on <a href="https://github.com/ziemen4/zkguard" target="_blank" rel="noopener noreferrer">zkguard</a> (see a practical implementation using Safe Wallet <a href="https://github.com/ziemen4/safe-zkguard" target="_blank" rel="noopener noreferrer">here</a>), and also work on <a href="https://github.com/ziemen4/zkpoex" target="_blank" rel="noopener noreferrer">zkpoex</a>. I’m actively learning about zero‑knowledge
      proofs and, when possible, contributing to <a href="https://github.com/ultrasoundlabs" target="_blank" rel="noopener noreferrer">Ultrasound Labs</a>.
    </p>

    <p>
      I’m passionate about the future of crypto and blockchain technologies, and I have several interests including applied mathematics,
      cryptography, AI, and neuroscience.
    </p>
  </Layout>
)

export const Head = () => <Seo title="About" />
export default AboutPage
