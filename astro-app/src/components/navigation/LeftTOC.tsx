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
      <div className="container-fluid">
        <div className="row">
          <h5 className="pt-5 pb-1 px-1">
            <a href={`#${headings[0].slug}`} className="list-group-item">{name}</a>
          </h5>
          <div className="list-group px-1">
            {headings.slice(1, undefined).map((h) => (
              <a
                key={`${h.slug}`}
                href={`#${h.slug}`} 
                className="list-group-item"
                style={{paddingLeft: `${(h.depth-1) * 10}px`, fontSize: "0.9em"}}
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