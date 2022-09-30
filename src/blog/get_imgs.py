# [[file:../blog.org::#processing-the-files][Processing the files:1]]
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

if __name__ == "__main__":
    max_width = 1280
    with_path = lambda f: Path('../converted').resolve() / f.with_suffix('.jpeg').name
    root = Path("..").resolve()
    for f in get_imgs('../resources'):
        with Image.open(f) as img:
            if f.suffix == '.png':
                img = img.convert('RGB')
            if img.size[0] > max_width:
                img = ImageOps.contain(img, (max_width, max_width))
            fout = with_path(f)
            img.save(fout, quality=80)
            print(fout.relative_to(root))
# Processing the files:1 ends here
