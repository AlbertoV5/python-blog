import { useReducer, useState } from "react"


interface NavLink {
    title: string
    href: string 
}

interface NavLinks {
    children: Array<NavLink>
}


interface ThemeState {
    theme: string;
}

const getPreferredTheme = (): ThemeState => {
    const theme = localStorage.getItem('theme');
    if (theme){
        document.documentElement.setAttribute('data-bs-theme', theme);
        return {theme: theme}
    }
    return {theme: 'dark'}
}

const Links: React.FC<NavLinks> = ({children}) => {

    const [theme, setTheme] = useState(getPreferredTheme)

    const handleClick = () => {
        setTheme((prev) => {
            const theme = prev.theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-bs-theme', theme);
            localStorage.setItem('theme', theme);
            return {theme: theme}
        })
    }

    return (
        <>
        {children.map((link, index) => (
            <li className="nav-item px-2" key={`${index}-${link.href}`}>
                <a className="nav-link" href={link.href}>{link.title}</a>
            </li>
        ))}
        <li className="nav-item">
            <button className="btn px-3 py-1 nav-link" onClick={handleClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-moon" viewBox="0 0 16 16">
                    <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/>
                </svg>
            </button>
        </li>
        </>
    )
}

const links = [
    {
        title: "Home",
        href: "/"
    },
    {
        title: "Blog",
        href: "/blog"
    },
    {
        title: "Contact",
        href: "/contact"
    }
]

const NavBar = () => {
    
    return (
        <nav
            id="navbar"
            className="navbar navbar-expand-md sticky-top py-2 bg-body border-bottom"
            style={{height: "4em"}}
        >
            <main id="navbar-content" className="container-fluid justify-content-center">
                <div className="d-flex flex-row">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-scroll" aria-controls="navbar-scroll" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse bg-body" id="navbar-scroll">
                        <ul className="navbar-nav">
                            <Links>{links}</Links>
                        </ul>
                    </div>
                </div>
            </main>
        </nav>
    )
}

export default NavBar