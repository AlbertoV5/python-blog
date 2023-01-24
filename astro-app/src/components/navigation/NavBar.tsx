
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
            <li className="nav-item" key={`${index}-${link.href}`}>
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

const NavBar = () => {
    
    return (
        <nav
            id="navbar"
            className="navbar navbar-expand-md sticky-top py-2 bg-body border-bottom"
            style={{height: "4em"}}
        >
            <main id="navbar-content" className="container-fluid">
                <div className="d-flex flex-row justify-content-center">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarScroll">
                        <ul className="navbar-nav me-auto my-2 my-md-0 navbar-nav-scroll">
                            <Links>{links}</Links>
                        </ul>
                    </div>
                </div>
            </main>
        </nav>
    )
}

export default NavBar