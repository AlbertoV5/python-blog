// import React from 'react'
import type { TOCProps } from "./TypesTOC"


const LeftTOC: React.FC<TOCProps> = ({className, headings}) => {
  // https://getbootstrap.com/docs/5.3/utilities/display/#hiding-elements

  const name = 'Table of Contents';
  return (
    <div
      className={className}
      style={{
        position: "sticky", 
        left: "1em",
        top: "10vh",
        height: "80vh",
        overflow: "auto",
        zIndex: "100"
      }}
    >
      <div className="container">
        <div className="row">
          <h5 className="pt-5 pb-1 px-1">
            <a href={`#top`} className="list-group-item">{name}</a>
          </h5>
          {/* <div className="input-group input-group-sm mb-3 px-1">
            <button className="btn btn-outline-secondary" type="button" id="button-addon2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
            <input type="text" className="form-control" placeholder="Search" aria-label="Search" aria-describedby="button-addon2"/>
          </div> */}
          <div className="list-group px-1 pt-2">
            {headings.map((h) => (
              <a
                key={`${h.slug}`}
                href={`#${h.slug}`} 
                className="list-group-item"
                style={{fontSize: "0.9em"}}
              >
                {`${h.text}`}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftTOC