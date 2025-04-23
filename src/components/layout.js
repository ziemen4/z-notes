import * as React from "react"
import { Link } from "gatsby"
import MoonIcon from "../images/Moon.svg"
import SunIcon from "../images/Sun.svg"
import { Github, Twitter } from "lucide-react"  // keep for your footer socials

/* ───────────────────────────────────────────────
   Theme context & provider
─────────────────────────────────────────────── */
const ThemeContext = React.createContext({
  dark: false,
  toggleDark: () => {},
})

export function ThemeProvider({ children }) {
  const [dark, setDark] = React.useState(false)

  React.useEffect(() => {
    const saved = localStorage?.getItem("dark") === "true"
    setDark(saved)
    document.documentElement.setAttribute("data-theme", saved ? "dark" : "light")
  }, [])

  const value = React.useMemo(
    () => ({
      dark,
      toggleDark: () => {
        const next = !dark
        localStorage?.setItem("dark", String(next))
        document.documentElement.setAttribute("data-theme", next ? "dark" : "light")
        setDark(next)
      },
    }),
    [dark]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => React.useContext(ThemeContext)

/* ───────────────────────────────────────────────
   ThemeToggle (now using your SVGs)
─────────────────────────────────────────────── */
function ThemeToggle() {
  const { dark, toggleDark } = useTheme()

  return (
    <button
      className="theme-toggle"
      onClick={toggleDark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <img
        src={dark ? SunIcon : MoonIcon}
        alt=""               /* decorative; aria-label conveys purpose */
        width={20}
        height={20}
      />
    </button>
  )
}

/* ───────────────────────────────────────────────
   Layout component
─────────────────────────────────────────────── */
export function Layout({ location, title, children }) {
  return (
    <div className="global-wrapper">
      <header className="site-header">
        <div className="site-header__inner">
          {/* site title */}
          <h1 className="site-title">
            <Link to="/">{title}</Link>
          </h1>

          {/* nav + toggle */}
          <nav className="site-nav">
            <ul>
              <li>
                <Link to="/" activeClassName="active">
                  Notes
                </Link>
              </li>
              <li>
                <Link to="/about" activeClassName="active">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" activeClassName="active">
                  Contact
                </Link>
              </li>
              <li>
                <ThemeToggle />
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <div className="site-footer__social">
          <a
            href="https://github.com/ziemen4"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://twitter.com/ziemannzk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </a>
        </div>
      </footer>
    </div>
  )
}

export default Layout
