# Glob generators with Python

![img](../resources/susan-q-yin-2JIvboGLeho-unsplash.jpg)

This is an exercise on using glob patterns<sup><a id="fnr.1" class="footref" href="#fn.1" role="doc-backlink">1</a></sup> to find image files in a directory. We are going to use the `pathlib`<sup><a id="fnr.2" class="footref" href="#fn.2" role="doc-backlink">2</a></sup> Python module which provides the `glob` method in the `Path` class.

Glob patterns are also used in `.gitignore`<sup><a id="fnr.3" class="footref" href="#fn.3" role="doc-backlink">3</a></sup> files so any pattern that works here probably works in git ignore files too and vice versa.

```shell
python --version
```

    Python 3.10.7


## Choosing a Pattern

We are going to start with either one of these patterns.

```shell
'*.[jpJP][npNP][egEG]*'
```

```shell
'*.[jpJP]*[gG$]'
```

Our first pattern means &ldquo;files with extensions that start with j/J or p/P, then continue with n/N or p/P, then e/E or g/G and continue with any characters or none&rdquo;. This will effectively match `jpg`, `jpeg`, `png` as well as their versions in caps. However this will also match something like `jpega` and `pngx`.

If we wanted to make sure we don&rsquo;t match unintended files, we can use the second pattern which means &ldquo;files with extensions that start with either j/J or p/P and end with g/G&rdquo;. This also matches `jpg`, `jpeg` and `png` and it won&rsquo;t match `jpega` or `pngx`, however it will match patterns like `jag` or `pxg`.

If we combine both patterns we can get a more strict match that makes sure the file format ends in g/G and matches all three of our target extensions.

```shell
'*.[jpJP][npNP]*[gG$]'
```


## Glob function

We are going to use the `PIL` <sup><a id="fnr.4" class="footref" href="#fn.4" role="doc-backlink">4</a></sup> module for processing images once we get their paths with `pathlib`. We are also going to include the `Generator` class for duck typing our generator function.

```python
from pathlib import Path
from PIL import Image, ImageOps
from typing import Generator
```

We will define a function and specify what we want to do before writing the code. In our arguments, we want to receive a string and a few boolean values to modify the behaviour of our function.

When iterating over a directory, the results will come up unordered so we may want to sort them alphabetically using `sorted`. We also may want to search all directories recursively and we can use `rglob` for that.

Finally, we want to make this a generator function so we can stop the procedure at any given iteration, so we are going to `yield` the file path.

```python
def get_imgs(directory: str, sort = True, recursive = True) -> Generator[Path, None, None]:
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

Our `pattern` variable will hold the glob pattern, `frec` will use `rglob` if we want our search to be recursive and `fsort` will use `sorted` if we want to sort the results.

```python
pattern = '*.[jpJP][npNP]*[gG$]'
frec = lambda p, g: p.rglob(g) if recursive else p.glob(g)
fsort = lambda x: sorted(x) if sort else x
```

Finally we&rsquo;ll use both lambda functions and `yield` each file path.

```python
for file in fsort(frec(path, pattern)):
    yield file
```

This is our function once we put it all together.

```python
from pathlib import Path
from PIL import Image, ImageOps
from typing import Generator


def get_imgs(directory: str, sort = True, recursive = True) -> Generator[Path, None, None]:
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
    pattern = '*.[jpJP][npNP]*[gG$]'
    frec = lambda p, g: p.rglob(g) if recursive else p.glob(g)
    fsort = lambda x: sorted(x) if sort else x
    for file in fsort(frec(path, pattern)):
        yield file
```

Let&rsquo;s use it in a script where we simply print all the file paths relative to the root.

```python
root = Path(".").resolve()
for f in get_imgs('./resources'):
    print(f.relative_to(root))
```

    resources/data/Screen Shot 2022-09-05 at 12.41.33.png
    resources/data/Screen Shot 2022-09-05 at 12.41.45.png
    resources/eli-francis-_M-DrbiNFa4-unsplash.jpg
    resources/final/007.jpeg
    resources/final2/000.jpeg
    resources/img/008.jpeg
    resources/img/009.jpg
    resources/img/Screen Shot 2022-09-29 at 13.20.27.png
    resources/img/Screen Shot 2022-09-29 at 20.07.04.png
    resources/img/Screen Shot 2022-09-29 at 20.08.21.png
    resources/old/002.jpeg
    resources/old/006.jpg
    resources/susan-q-yin-2JIvboGLeho-unsplash.jpg

Now let&rsquo;s move on to processing the files with `PIL`.


## Processing the files

We want to convert all `png` files into `jpeg`, as well as renaming `jpg` to `jpeg` and then resizing them all to have a given max width. The process is the following: we open the file as an image, convert it to `'RGB'` if `suffix` is `png`, then resize it with `ImageOps.contain` and save it as `jpeg` using `with_suffix`.

Before writing our main process, we will create a function that will replace the file suffix to `jpeg` as well as change its parent directory. We&rsquo;ll also create a `root` variable for printing purposes.

```python


if __name__ == "__main__":
    max_width = 1280
    with_path = lambda f: Path('./converted').resolve() / f.with_suffix('.jpeg').name
    root = Path("..").resolve()
    for f in get_imgs('./resources'):
        with Image.open(f) as img:
            if f.suffix == '.png':
                img = img.convert('RGB')
            if img.size[0] > max_width:
                img = ImageOps.contain(img, (max_width, max_width))
            fout = with_path(f)
            img.save(fout, quality=80)
            print(fout.relative_to(root))
```

    

Note that we are placing the results in a parent directory different to the one we use for searching as we are doing so recursively by default. This is because we don&rsquo;t want to get our results as inputs the second time we run the script.


## Conclusion

Generators in Python are one of the most useful tools for processing data. If we want to automate a few tasks without using bash scripts (for whatever reason), we can start with a glob generator function that yields the file types we want in an unorganized directory.

The benefit of using `glob` is that we don&rsquo;t have to use Python to check that each file suffix matches a list of file formats so we can scale our process more easily. For example, in the following code, we can replace the first comprehension with the second one.

```python
[f for f in path.iterdir() if f.suffix in ('.jpeg', '.jpg', '.png', 'JPG', 'JPEG', 'PNG')]
[f for f in path.glob('*.[jpJP][npNP]*[gG$]')]
```

We could also do it recursively with `rglob` or adding `**/` to the beginning of our pattern. The downsides are that we could be matching unintended files if our pattern is not good enough for the job, and that globs are not as powerful as regular expressions. As a bonus we can use the same glob pattern in our .gitignore file.

## Footnotes

<sup><a id="fn.1" class="footnum" href="#fnr.1">1</a></sup> <https://en.wikipedia.org/wiki/Glob_(programming)>

<sup><a id="fn.2" class="footnum" href="#fnr.2">2</a></sup> <https://docs.python.org/3/library/pathlib.html>

<sup><a id="fn.3" class="footnum" href="#fnr.3">3</a></sup> <https://git-scm.com/docs/gitignore>

<sup><a id="fn.4" class="footnum" href="#fnr.4">4</a></sup> <https://pillow.readthedocs.io/en/stable/>
