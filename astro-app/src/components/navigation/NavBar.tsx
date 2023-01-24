import React, { useEffect, useReducer, useState } from "react"
import ThemeIcon from "./ThemeIcon"


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

const changeTheme = (theme: string) => {
    // https://getbootstrap.com/docs/5.3/customize/color-modes/#javascript
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
}

const swapThemeState = (prev: string, action: any): string => {
    // if auto, set swap it by matching preferred color scheme
    if (prev === 'auto'){
        return window.matchMedia('(prefers-color-scheme: dark)').matches?'light':'dark';
    }
    return prev === 'dark' ? 'light' : 'dark'
}

const initThemeState = () => {
    let stored = localStorage?.getItem('theme');
    return stored ? stored : 'auto'; // auto if no stored
}

const NavBar = () => {
    
    const [theme, dispatch] = useReducer(swapThemeState, 'auto', initThemeState)
    // on state change, change the theme
    useEffect(() => {
        changeTheme(theme);
    }, [theme]); 
    
    return (
        <nav
            id="navbar"
            className="navbar navbar-expand-md sticky-top py-2 bg-body border-bottom bg-opacity-75"
            style={{height: "4em", backdropFilter:"blur(4px)", zIndex: "300"}}
        >
            <main id="navbar-content" className="container-fluid justify-content-center">
                <div className="d-flex flex-row">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-scroll" aria-controls="navbar-scroll" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbar-scroll">
                        <ul className="navbar-nav">
                            <Links>{links}</Links>
                            <li className="nav-item">
                                <button 
                                    className="btn px-3 py-1 nav-link" 
                                    onClick={dispatch}
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