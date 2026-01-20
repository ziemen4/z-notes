import * as React from "react"
import { Link } from "gatsby"
import MoonIcon from "../images/Moon.svg"
import SunIcon from "../images/Sun.svg"
import { Github, Twitter } from "lucide-react"

/* ───── Theme context ───── */
const ThemeContext = React.createContext({ dark: false, toggleDark: () => {} })

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

/* ───── Theme toggle ───── */
function ThemeToggle() {
  const { dark, toggleDark } = useTheme()
  return (
    <button className="theme-toggle" onClick={toggleDark} aria-label="Toggle theme">
      <img src={dark ? SunIcon : MoonIcon} alt="" width={20} height={20} />
    </button>
  )
}

/* ───── Layout ───── */
export function Layout({ title, children }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="global-wrapper">
      <header className="site-header">
        <div className="site-header__inner">
          <h1 className="site-title">
            <Link to="/">{title}</Link>
          </h1>

          {/* desktop nav sits right of the logo */}
          <nav className={`site-nav ${open ? "open" : ""}`}>
            <ul onClick={() => setOpen(false)}>
              <li><Link to="/"        activeClassName="active">Notes</Link></li>
              <li><Link to="/projects" activeClassName="active">Projects</Link></li>
              <li><Link to="/about"   activeClassName="active">About</Link></li>
              <li><Link to="/contact" activeClassName="active">Contact</Link></li>
            </ul>
          </nav>

          <div className="header-controls">
            {/* hamburger (mobile only) */}
            <button
              className={`hamburger ${open ? "open" : ""}`}
              onClick={() => setOpen(o => !o)}
              aria-label="Menu"
            >
              <span />
              <span />
              <span />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>



      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <div className="site-footer__social">
          <a href="https://github.com/ziemen4"  aria-label="GitHub"><Github  size={20} /></a>
          <a href="https://twitter.com/ziemannzk" aria-label="Twitter"><Twitter size={20} /></a>
        </div>
      </footer>
    </div>
  )
}

export default Layout
