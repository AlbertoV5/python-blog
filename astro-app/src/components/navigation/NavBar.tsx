import { useEffect, useReducer, useState, useRef, useLayoutEffect } from "react"
import ThemeIcon from "./ThemeIcon"


interface NavLink {
    title: string
    href: string 
}

interface NavLinks {
    children: Array<NavLink>
}

const Links: React.FC<NavLinks> = ({children}) => {
    return (
        <>
        {children.map((link, index) => (
            <li className="nav-item px-2" key={`${index}-${link.href}`}>
                <a className="nav-link" href={link.href}>{link.title}</a>
            </li>
        ))}
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

const changeTheme = (theme: string) => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
}

const NavBar = () => {

    const [theme, setTheme] = useState(() => {
        let stored = localStorage?.getItem('theme');
        return stored ? stored : 'auto'; // auto if no stored
    })

    // on state change
    useEffect(() => {
        changeTheme(theme);
    }, [theme]); 

    const swapTheme = () => {
        // https://getbootstrap.com/docs/5.3/customize/color-modes/#javascript
        setTheme((prev) => {
            // if auto, set swap it by matching preferred color scheme
            if (prev === 'auto'){
                return window.matchMedia('(prefers-color-scheme: dark)').matches?'light':'dark';
            }
            // if no auto, then just swap themes
            return prev === 'dark' ? 'light' : 'dark'
        })
    }
    
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
                            <li className="nav-item">
                                <button 
                                    className="btn px-3 py-1 nav-link" 
                                    onClick={swapTheme}
                                >
                                    <ThemeIcon isDark={theme !== 'light'}></ThemeIcon>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </nav>
    )
}

export default NavBar;