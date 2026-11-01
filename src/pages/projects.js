import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

const ProjectsPage = ({ location }) => (
  <Layout location={location} title="Z‑Notes">
    <h1>Projects</h1>
    <ul className="posts-list">
      <li className="posts-list__item">
        <a href="https://github.com/ziemen4/proofgate" target="_blank" rel="noopener noreferrer">
          <h2 className="posts-list__title">ProofGuard</h2>
        </a>
        <p className="posts-list__description">
          Developing a foundation for agent harnesses and guardrail plugins. Agents propose Bend2
          programs, which are checked against owner-defined laws before a gateway executes their actions.
        </p>
      </li>
      <li className="posts-list__item">
        <a href="https://github.com/ziemen4/zkguard" target="_blank" rel="noopener noreferrer">
          <h2 className="posts-list__title">zkguard</h2>
        </a>
        <p className="posts-list__description">
          Developing a system to prevent malicious transactions by using zero knowledge proofs to bind
          a policy to any action that a wallet performs. This work has been accepted to{" "}
          <a href="https://cyprusconferences.org/issre2026/" target="_blank" rel="noopener noreferrer">
            ISSRE 2026
          </a>
          .
        </p>
      </li>
      <li className="posts-list__item">
        <a href="https://github.com/ziemen4/zkpoex" target="_blank" rel="noopener noreferrer">
          <h2 className="posts-list__title">zkpoex</h2>
        </a>
        <p className="posts-list__description">
          Developing a framework for proving exploits in a permissionless manner by using zero knowledge
          proofs. This work was published to{" "}
          <a href="https://dl.acm.org/doi/10.1145/3748522.3779811" target="_blank" rel="noopener noreferrer">
            ACM SAC 2026
          </a>
          .
        </p>
      </li>
    </ul>
  </Layout>
)

export const Head = () => <Seo title="Projects" />
export default ProjectsPage
