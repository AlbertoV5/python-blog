import type { MarkdownHeading } from "astro"

export interface TOCProps extends React.PropsWithChildren {
    className: string
    headings: Array<MarkdownHeading>
}