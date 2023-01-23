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
      <div className="container-fluid bg-body border-bottom">
        <div className="d-flex flex-row justify-content-center py-2">
          <h5 className="py-2 px-2"><a href={`#${headings[0].slug}`} className="list-group-item">{name}</a></h5>
          <div className="dropdown py-1">
            <button className="btn btn-light dropdown-toggle mx-2" type="button" style={{width: "40px", height:"36px"}} data-bs-toggle="dropdown" aria-expanded="false">
            </button>
            <ul className="dropdown-menu p-2 rounded">
              {headings.slice(1, undefined).map((h) => (
                <li>
                  <a
                    key={`${h.slug}`}
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