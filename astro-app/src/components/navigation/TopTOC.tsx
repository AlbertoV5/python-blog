// import React from 'react'
import type { TOCProps } from "./TypesTOC"


const TopTOC: React.FC<TOCProps> = ({className, headings}) => {
  // https://getbootstrap.com/docs/5.3/utilities/display/#hiding-elements
  
  const name = 'Table of Contents';
  return (
    <div
      className = {className}
      style={{
        position: "sticky",
        top: "4em",
        height: "4em", 
        zIndex: "100"
      }}
    >
      <div 
        className="container-fluid bg-body border-bottom bg-opacity-75"
        style={{backdropFilter:"blur(4px)"}}
      >
        <div className="d-flex flex-row justify-content-center py-2">
          <h5 className="pt-2 px-2" data-bs-toggle="dropdown" aria-expanded="false">
            <a href={`#top`} className="list-group-item" >{name}</a>
          </h5>
          <div className="dropdown py-1">
            <ul className="dropdown-menu p-2 rounded">
              {headings.map((h) => (
                <li key={`list-${h.slug}`}>
                  <a
                    key={`anchor-${h.slug}`}
                    href={`#${h.slug}`} 
                    className="dropdown-item border-bottom py-2"
                    style={{fontSize: "1em"}}
                  >
                    {`${h.text}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopTOC