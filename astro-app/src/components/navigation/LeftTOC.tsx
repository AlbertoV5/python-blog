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
        id="left-toc"
      >
        <div className="container">
          <div className="row">
            <h5 className="pt-5 pb-1 px-1">
              <a href={`#top`} className="list-group-item">{name}</a>
            </h5>
            <ul className="list-group px-1 pt-2">
              {headings.map((h) => (
                <li
                  key={`toc-${h.slug}`}
                  className="list-group-item list-group-item-action"
                >
                  <a
                    key={`${h.slug}`}
                    className={`nav-link`}
                    href={`#${h.slug}`}
                    style={{fontSize: "0.9em"}}
                  >
                    {`${h.text}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
}

export default LeftTOC