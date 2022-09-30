# [[file:../globbing.org::#globbing-function][get_imgs]]
from pathlib import Path
from PIL import Image


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
    pattern = '*.[jpJP][npNP]*[gG$]'
    frec = lambda p, g: p.rglob(g) if recursive else p.glob(g)
    fsort = lambda x: sorted(x) if sort else x
    for file in fsort(frec(path, pattern)):
        yield file
# get_imgs ends here
