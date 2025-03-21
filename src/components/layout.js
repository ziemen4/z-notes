import * as React from 'react'
import { Link } from "gatsby"

// Add Theme Context at the top of the file
const ThemeContext = React.createContext({
  dark: false,
  toggleDark: () => {},
})

// Add Theme Provider component
export function ThemeProvider({ children }) {
  const [dark, setDark] = React.useState(false)

  React.useEffect(() => {
    const isDark = localStorage?.getItem('dark') === 'true'
    setDark(isDark)
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [])

  const value = React.useMemo(
    () => ({
      dark,
      toggleDark: () => {
        const isDark = !dark
        localStorage?.setItem('dark', String(isDark))
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
        setDark(isDark)
      },
    }),
    [dark]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Add useTheme hook
export const useTheme = () => React.useContext(ThemeContext)

// Add ThemeToggle component
function ThemeToggle() {
  const { dark, toggleDark } = useTheme()
  
  return (
    <button 
      onClick={toggleDark}
      className="theme-toggle"
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        padding: '0.5rem',
        color: 'var(--textNormal)'
      }}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}

// Update Layout component imports to use local components
export function Layout({ location, title, children }) {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  const { dark } = useTheme()

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  let header = isRootPath ? (
    <h1 className="main-heading">
      <Link to="/">{title}</Link>
    </h1>
  ) : (
    <Link className="header-link-home" to="/">
      {title}
    </Link>
  )

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
        <div className="header-content">
          {header}
          <ThemeToggle />
        </div>
      </header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout