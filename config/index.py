"""Build an index.html file that redirects to given file."""
from pathlib import Path
import xml.etree.ElementTree as ET
import argparse


def main(argv: argparse.Namespace):
    """Expects argv to have one argument named index and other named path."""
    index = Path(argv.index)
    target = Path(argv.path)
    template = f"""
    <!DOCTYPE html>
    <html>
        <head>
            <title>Redirecting</title>
            <link rel="shortcut icon" href="./resources/theme/favicon.ico" />
            <meta http-equiv = "refresh" content = "0.2; url = {target}" />
        </head>
        <body style = "background-color: rgb(24, 24, 24);">
            <div class = "article-container" style = "margin: 33%; display: flex; justify-content: center; align-items: center;">
                <div style = "margin: auto; color: rgba(245, 245, 245, 0.925);">
                    <p>Redirecting...</p>
                    <p><a href="https://www.flaticon.com/free-icons/book" title="book icons">Book icons created by Freepik - Flaticon</a></p>
                </div>
            </div>
        </body>
    </html>
    """
    xml: ET.Element = ET.fromstring(template)
    ET.ElementTree(xml).write(index)
    # print(f"\033[1m-> {index} -> {target}\x1b[0m")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate a redirecting index.html")
    parser.add_argument(
        "path", metavar="path", type=str, help="path to redirect from index.html"
    )
    parser.add_argument(
        "index",
        metavar="index path",
        type=str,
        help="path for the index.html, including 'index.html'",
    )
    args = parser.parse_args()
    main(args)
