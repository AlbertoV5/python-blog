# [[file:../../static/glob-compare.org::*Final Test Script][Final Test Script:1]]
from pathlib import Path
from itertools import permutations
import subprocess
import cProfile
import logging
import pstats
import shutil
import os

def create_options(extensions):
    data = list(i for e in extensions for i in list(e))
    data.append("")
    return list(set("".join(c) for c in permutations(data, 4)))

def create_directories(root: str, number: int, depth: int):
    root = Path(root).resolve()
    if root.is_dir():
        shutil.rmtree(root)
    Path.mkdir(root, parents=True)
    # func
    def mk_dirs(parent, data, n, depth):
        if depth == 0:
            return 0
        for i in range(n):
            child = parent / f"{i}"
            Path.mkdir(child)
            data.append(child)
            mk_dirs(child, data, n, depth - 1)

    directories = []
    mk_dirs(root, directories, number, depth)
    directories.insert(0, root)
    return directories

def test_makefiles(ext = ["csv", "tsv", "txt"], number = 3, depth = 3):
    options = create_options(ext)
    directories = create_directories('../tests/extensions', number, depth)
    n_opt = len(options)
    n_dir = len(directories)
    ratio = int(n_opt/n_dir)
    for i in range(0, n_dir):
        for j in range(i * ratio, (i * ratio) + ratio):
            filepath = directories[i] / f"file.{options[j]}"
            subprocess.run(['touch', filepath])
        assert len(list(directories[i].glob('*'))) > number
    print('All files were created.')

def profile(func):
    def wrapper(*args, **kwargs):
        with cProfile.Profile() as pr:
            path = func(*args, **kwargs)
            stats = pstats.Stats(pr)
            stats.sort_stats(pstats.SortKey.TIME)
            stats.dump_stats(filename=f"{path / func.__name__}.prof")

    return wrapper


@profile
def test_main():
    log = logging.getLogger(__name__)
    log.setLevel(logging.DEBUG)
    ext = ['csv', 'tsv', 'txt']
    pattern = '**/*.[ct][sx][vt$]'
    rootd = '../tests/extensions'
    outcome = {"glob":[], "os":[]}

    # using glob
    def use_glob():
        for f in Path(rootd).glob(pattern):
            yield f

    def consume_glob():
        outcome["glob"] = list(Path(rootd).glob(pattern))

    # using os
    def use_os_comp():
        outcome["os"] = [
            f
            for root, dirs, files in os.walk(rootd)
            for f in files if f.split('.')[1] in ext
        ]

    def use_os():
        for root, dirs, files in os.walk(rootd):
            path = root.split(os.sep)
            for file in files:
                if file.split(".")[1] in ext:
                    outcome["os"].append(file)

    def use_os_gen():
        for root, dirs, files in os.walk(rootd):
            for file in files:
                if file.split(".")[1] in ext:
                    yield file
    # process
    times = 100
    [use_glob() for i in range(times)]
    [consume_glob() for i in range(times)]
    [use_os() for i in range(times)]
    [use_os_comp() for i in range(times)]
    [use_os_gen() for i in range(times)]

    def consume_gen(gen):
        for file in gen:
            # if file.replace("file.", "") == "csv":
                # break
            if file.suffix == ".csv":
                break

    [consume_gen(use_glob()) for i in range(times)]
    log.debug(outcome)
    return Path('tests/prof')

if __name__ == "__main__":
    ext = ['csv', 'tsv', 'txt', 'xlsx', 'jpg', 'png']
    test_makefiles(ext, 5, 5)
    test_main()
# Final Test Script:1 ends here
