# A Globbing Puzzle

This is an exercise on using globbing<sup><a id="fnr.1" class="footref" href="#fn.1" role="doc-backlink">1</a></sup> and regular expressions to find data in a directory. We are going to use the `pathlib`<sup><a id="fnr.2" class="footref" href="#fn.2" role="doc-backlink">2</a></sup> Python library which provides the `Path` class which includes various methods that allow us to make a few useful system calls<sup><a id="fnr.3" class="footref" href="#fn.3" role="doc-backlink">3</a></sup>, one of which is the `glob`<sup><a id="fnr.4" class="footref" href="#fn.4" role="doc-backlink">4</a></sup> method.

Glob patterns are also used in `.gitignore` files so any pattern that works here probably works there and vice versa.


## Selecting Images

We are using `pathlib` and the `Pillow` <sup><a id="fnr.5" class="footref" href="#fn.5" role="doc-backlink">5</a></sup> module for processing images.

```python
from pathlib import Path
from PIL import Image
import re
```

We will define a function and write down what we want it to do before writing its content. We want to get a string and then add a couple of options for different use cases. When iterating over a directory, the results will come up unordered so we may want to sort them alphabetically using `sorted`. Then we may want to search for all directories within our target directory so we may want a recursive search.

We want to make this a generator in case we are searching for a single result, we don&rsquo;t want to hold all data in memory in case we are opening files so we are going to give control to the main procedure a file at a time so we can exit the program at any given iteration. So we are going to `yield` the file path.

```python
def get_imgs(directory: str, sort: bool = True, recursive: bool = True):
    """Yields all image files in given path.

    Args:

        directory (str): Relative directory name.
        sort (bool, optional): If generator is sorted. Default True.
        recursive (bool, optional): If glob is recursive. Default True.

    Yields:

        (Path): File path.
    """
```

Let&rsquo;s start checking if the given path exists. We are going to use `resolve` to convert any relative paths to absolute ones and then `is_dir` to check that the directory exists.

```python
path = Path(directory).resolve()
if not path.is_dir():
    raise ValueError(f"'{path}' is not a directory.")
```

Now we will create variables for `glob`, which its itself a generator, so we can use `sorted` and `glob`&rsquo;s cousin `rglob` to force recursive globbing. Our `glob` variable will hold the pattern, `frec` will return `rglob` if we want our search to be recursive and `fsort` will use `sorted` if we want to sort the results.

```python
glob = '*.[jpg png]*'
frec = lambda p, g: p.rglob(g) if recursive else p.glob(g)
fsort = lambda x: sorted(x) if sort else x
```

Now we&rsquo;ll use both lambda functions sequentially and `yield` each file path.

```python
for file in fsort(frec(path, glob)):
    yield file
```

This is our function once we put it all together.

```python
from pathlib import Path
from PIL import Image
import re


def get_imgs(directory: str, sort: bool = True, recursive: bool = True):
    """Yields all image files in given path.

    Args:

        directory (str): Relative directory name.
        sort (bool, optional): If generator is sorted. Default True.
        recursive (bool, optional): If glob is recursive. Default True.

    Yields:

        (Path): File path.
    """
    path = Path(directory).resolve()
    if not path.is_dir():
        raise ValueError(f"'{path}' is not a directory.")
    glob = '*.[jpg png]*'
    frec = lambda p, g: p.rglob(g) if recursive else p.glob(g)
    fsort = lambda x: sorted(x) if sort else x
    for file in fsort(frec(path, glob)):
        yield file

root = Path("..").resolve()
for f in get_imgs('../resources'):
    print(f.relative_to(root))
```

    resources/img/000.jpeg
    resources/img/001.jpeg
    resources/img/002.jpeg
    resources/img/006.jpeg
    resources/img/007.jpeg
    resources/img/008.jpeg
    resources/img/009.jpg
    resources/img/Screen Shot 2022-09-05 at 12.41.33.png
    resources/img/Screen Shot 2022-09-05 at 12.41.45.png
    resources/img/Screen Shot 2022-09-29 at 13.20.27.png
    resources/img/Screen Shot 2022-09-29 at 20.07.04.png
    resources/img/Screen Shot 2022-09-29 at 20.08.21.png

## Footnotes

<sup><a id="fn.1" class="footnum" href="#fnr.1">1</a></sup> <https://en.wikipedia.org/wiki/Glob_(programming)>

<sup><a id="fn.2" class="footnum" href="#fnr.2">2</a></sup> <https://docs.python.org/3/library/pathlib.html>

<sup><a id="fn.3" class="footnum" href="#fnr.3">3</a></sup> <https://en.wikipedia.org/wiki/System_call>

<sup><a id="fn.4" class="footnum" href="#fnr.4">4</a></sup> <https://docs.python.org/3/library/pathlib.html#pathlib.Path.glob>

<sup><a id="fn.5" class="footnum" href="#fnr.5">5</a></sup> <https://pillow.readthedocs.io/en/stable/>
