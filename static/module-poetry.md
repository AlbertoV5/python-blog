# Creating Python Modules with Poetry (macOS)

Setting up a module and the development loop.

![img](../resources/pexels-suzy-hazelwood-1122865.jpg)

Photo by Suzy Hazelwood: <https://www.pexels.com/photo/closeup-photo-of-assorted-title-books-1122865/>

We are going to go over the basic steps for creating a Python module with Poetry focusing on macOS in order to keep it simple. Requirements:

1.  macOS >= 10.15.7
2.  pyenv >= 2.3.6
3.  poetry >= 1.2.2

We are creating a simple &ldquo;local&rdquo; scraper that will open HTML files in a directory with JavaScript enabled, so we will use the classic Selenium and BeautifulSoup4 combination.

We want to use this utility in many different directories over time so instead of copying and pasting it or using a git submodule, we are going to make it a Python module that we can use in our global pyenv environment.


## Creating Directories

We are going to create a directory and the necessary files for development. In this case, we are naming the module &ldquo;html-index-maker&rdquo; as we want a descriptive, short name that also follows PEP-8 <sup><a id="fnr.1" class="footref" href="#fn.1" role="doc-backlink">1</a></sup> naming convention. Alternatively, if we ever want to publish in PyPi <sup><a id="fnr.2" class="footref" href="#fn.2" role="doc-backlink">2</a></sup>, we can verify that the package name doesn&rsquo;t exist yet.

```shell
mkdir html-index-maker && cd html-index-maker
```

We create a source and module directory.

```shell
mkdir src && mkdir src/html-index-maker
```

And our init and main files in the module directory.

```shell
touch src/html-index-maker/__init__.py && touch src/html-index-maker/__main__.py
```

Then create a readme file (so Poetry will be happy).

```shell
touch ./README.md
```


## Initializing Git and Poetry

We initialize git and change the branch to &ldquo;main&rdquo; or whatever we prefer.

```shell
git init && git checkout -b main
```

Then we can start poetry.

```shell
poetry init
```

```
This command will guide you through creating your pyproject.toml config.

Package name [html-index-maker]:
Version [0.1.0]:
Description []:
Author [AlbertoV5 <58243333+AlbertoV5@users.noreply.github.com>, n to skip]:
License []:  MIT
Compatible Python versions [^3.10]:  ^3.7

Would you like to define your main dependencies interactively? (yes/no) [yes] no
Would you like to define your development dependencies interactively? (yes/no) [yes] no
```

Then we will get a resulting generated file.

```
[tool.poetry]
name = "html-index-maker"
version = "0.1.0"
description = ""
authors = ["AlbertoV5 <58243333+AlbertoV5@users.noreply.github.com>"]
license = "MIT"
readme = "README.md"
packages = [{include = "html_index_maker"}]

[tool.poetry.dependencies]
python = "^3.7"


[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

However, note that the `packages` must match the folder under **&ldquo;src&rdquo;!** So make sure to change it in the TOML file if needed.

```toml
packages = [{include = "html-index-maker", from = "src"}]
```

We can also add a .gitignore file from a template for Python and macOS like the following: <https://www.toptal.com/developers/gitignore/api/python,macos>


## Creating the Environment

Now we can start a &ldquo;venv&rdquo;. Note that Poetry tracks the absolute path of the venv directory, so try not changing the parent folder&rsquo;s name.

```shell
python -m venv ./venv
```

Make sure to activate the venv!

```shell
source ./venv/bin/activate
```

Now confirm that Poetry knows about the venv!

```shell
poetry env info
```

```
Virtualenv
Python:         3.7.13
Implementation: CPython
Path:           /Users/albertovaldez/html-index-maker/venv
Executable:     /Users/albertovaldez/html-index-maker/venv/bin/python
Valid:          True

System
Platform:   darwin
OS:         posix
Python:     3.7.13
Path:       /Users/albertovaldez/.pyenv/versions/3.7.13
Executable: /Users/albertovaldez/.pyenv/versions/3.7.13/bin/python3.7
```

We are ready to go!


## Adding dependencies

We will add the dependencies via Poetry.

```shell
poetry add BeautifulSoup4
```

```shell
poetry add selenium
```

```shell
poetry add webdriver-manager
```

Then we will add the dev dependencies, which are not required for the package to run but will help the development process.

```shell
poetry add --group dev black
```

```shell
poetry add --group dev pytest
```

Now our dependencies in the TOML file should look like this.

```toml
[tool.poetry.dependencies]
python = "^3.7"
beautifulsoup4 = "^4.11.1"
selenium = "^4.6.0"
webdriver-manager = "^3.8.5"


[tool.poetry.group.dev.dependencies]
black = "^22.10.0"
pytest = "^7.2.0"
```


## Developing the Module

We can start by adding all our code to the <span class="underline"><span class="underline">main</span></span>.py file and then, if needed, we&rsquo;ll create additional files to import into main.

Let&rsquo;s make sure we define a short loop before writing more code. So we are going to add a simple procedure to the main function and run the code via Poetry to make sure it works.

```python
from argparse import ArgumentParser, Namespace

def main(argv: Namespace):
    print("Hello", argv.name)

if __name__ == "__main__":
    args = ArgumentParser()
    args.add_argument("name")
    main(args.parse_args())
```

This should print &ldquo;Hello &rdquo; and whatever name we give it as argument.

Before running the code, we can install the module in the venv environment, then run it via Poetry.

```shell
poetry install
```

Then run the code with a &ldquo;name&rdquo; argument. Note that the code could work without &ldquo;poetry run&rdquo; if we are working inside the &ldquo;venv&rdquo; environment, but we are keeping &ldquo;poetry run&rdquo; just to be consistent.

```shell
poetry run python -m html-index-maker Bob
```

```
Hello Bob
```


## Creating Tests

We will create a test so we can verify that the code works after refactoring and adding functionality. So we will create a new directory and a new file for this.

```shell
mkdir ./tests && touch ./tests/test_main.py
```

If we use [tree](https://formulae.brew.sh/formula/tree#default), we can verify the state of our directory.

```shell
tree -I 'venv|__pycache__'
```

```
.
├── README.md
├── poetry.lock
├── pyproject.toml
├── src
│   └── html-index-maker
│       ├── __init__.py
│       └── __main__.py
└── tests
    └── test_main.py
```

Now we can create the test.

```python
import subprocess
import logging

log = logging.getLogger(__name__)

def test_file():
    command = ["poetry", "run", "python", "-m", "html-index-maker", "Bob"]
    out = subprocess.check_output(command)
    assert out.decode("utf-8") == "Hello Bob\n"
    log.debug(out)
```

And run it via **pytest**.

```shell
poetry run pytest
```

```
======================== test session starts =========================
platform darwin -- Python 3.7.13, pytest-7.2.0, pluggy-1.0.0
rootdir: /Users/albertovaldez/html-index-maker
collected 1 item

tests/test_main.py .                                           [100%]

========================= 1 passed in 0.62s ==========================
```

Note that we didn&rsquo;t get any log information, but we can always tell pytest to register debug messages by adding this to the &ldquo;pyproject&rdquo; file.

```toml
[tool.pytest.ini_options]
log_cli = true
log_cli_level = "DEBUG"
log_cli_format = "%(asctime)s [%(levelname)s] (%(filename)s:%(lineno)s): %(message)s"
log_cli_date_format = "%Y-%m-%d %H:%M:%S"
log_file = "tests/tests.log"
log_file_level = "DEBUG"
log_file_format = "%(asctime)s [%(levelname)s] (%(filename)s:%(lineno)s): %(message)s"
log_file_date_format = "%Y-%m-%d %H:%M:%S"
```

This will also create a file under **tests/tests.log** that will store the latest log with the given configuration. Now we can run the tests again!

```shell
poetry run pytest
```

```
======================== test session starts =========================
platform darwin -- Python 3.7.13, pytest-7.2.0, pluggy-1.0.0
rootdir: /Users/albertovaldez/html-index-maker, configfile: pyproject.toml
collected 1 item

tests/test_main.py::test_file
--------------------------- live log call ----------------------------
2022-11-20 02:32:33 [DEBUG] (test_main.py:11): b'Hello Bob\n'
PASSED                                                         [100%]

========================= 1 passed in 1.21s ==========================
```

We get the string output in the pytest log so we can move on now!


## The Development Loop

Now that everything is ready to go, we will move by following the same two steps:

1.  Write / Change code
2.  Run tests

So if we change the functionality of our code, we will know if it is working as intended or not. We must make sure the tests match the requirements, so we will change our temporary tests soon.

Before that, we will add the &ldquo;Black&rdquo; code formatter into the mix, we could add it to a pre-commit stage but in this case we will run &ldquo;Black&rdquo; manually and leave pre-commit for another time. So the dev cycle will look like:

1.  Write code
2.  Test it
3.  Format it

The last two steps can be reduced to:

```shell
poetry run black . && poetry run pytest
```

We can copy and paste that line into the command line and then repeat it after we make significant changes to our code. Black will run first and then pytest to make sure we get the pytest log after whatever Black outputs to the console.

As a last step before starting development, we will make the initial git commit.

```shell
git add . && git commit -m "initial commit"
```


## Test Driven Development

The first thing is to change our test to match the requirements. So we are going to copy a **use case** of HTML files with JavaScript functionality to a resources folder.

```shell
tree ./resources
```

```
./resources
├── deeplearning.html
├── ml.html
└── unsupervised-ml.html
```

All the files contain a few scripts in the header which will modify the id attribute of some HTML elements that we may want to scrape, so we will load the file with Selenium and then scrape it with BeautifulSoup4.

For out test, we will use the first **h2** and the first **h3** elements of the &ldquo;ml.html&rdquo; file.

```
<h2 id="machine-learning">
<span class="section-number-2">1.</span>
 Machine Learning
</h2>
<h3 id="supervised-learning"><span class="section-number-3">1.1.</span> Supervised Learning</h3>
```

Now we change our test to meet the requirements, which include a json file that will be generated from calling the command on a specific file. Then we expect the items in the json data to match the first\_header and second\_header variables, so we are defining how we want our data structure to look like.

```python
import subprocess
import logging
import json


log = logging.getLogger(__name__)


def test_file():
    command = [
        "poetry",
        "run",
        "python",
        "-m",
        "html-index-maker",
        "./resources/ml.html",
    ]
    log.debug(command)
    subprocess.run(command)
    with open("./data.json", "r") as json_file:
        data = json.loads(json_file.read())
    first_header = {
        "tag": "h2",
        "id": "machine-learning",
        "text": "1. Machine Learning",
    }
    second_header = {
        "tag": "h3",
        "id": "supervised-learning",
        "text": "1.1. Supervised Learning",
    }
    assert data[0]["headers"][0] == first_header
    assert data[0]["headers"][1] == second_header
```

```

```

If we run the test now, we get an error, so we will start development by matching those expectations.

```
E       FileNotFoundError: [Errno 2] No such file or directory: './data.json'
```


## Matching the Expectations

We can start developing the main file now. We are going to do the following:

1.  Create an **Arguments** class to keep track of our ArgumentParser&rsquo;s values (use Protocol from typing in Python >= 3.8).
2.  Create a Selenium driver factory function, named **get\_driver**.
3.  Create a **scrape** function that will take the Selenium driver and the path to an html file and return a dictionary with the data we want.
4.  Develop the **main** function so it handles the logic of the program, if the filepath given is a directory, we assume that we want to get all HTML files in that directory so we return a list of results, if not, we return a list of one result.

```python
from selenium.webdriver import Chrome
from argparse import ArgumentParser
from pathlib import Path


class Arguments:
    filepath: str


def get_driver() -> Chrome:
    """Creates a headless driver with Selenium."""
    ...


def scrape(driver: Chrome, htmlfile: Path) -> dict:
    """Returns a dictionary from the scraped htmlfile."""
    ...


def main(argv: Arguments):
    path = Path(argv.filepath).resolve()
    driver = get_driver()
    if not path.is_dir():
        return [scrape(driver, path)]
    return [scrape(driver, filepath) for filepath in path.glob("**/*.html")]


if __name__ == "__main__":
    args = ArgumentParser()
    args.add_argument("filepath", help="File path or directory to scrape.")
    main(args.parse_args())

```


## Separating Concerns

In order to keep things organized, we will create two new files in the html-index-maker path.

```shell
tree src/html-index-maker -I __pycache__
```

```
src/html-index-maker
├── __init__.py
├── __main__.py
├── driver.py
└── scraper.py
```

Then driver will contain the function that will give us a headless chrome driver from Selenium.

```python
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver import Chrome


def get_driver() -> Chrome:
    """Creates a headless driver with Selenium."""
    options = Options()
    options.headless = True
    service = Service(ChromeDriverManager().install())
    return Chrome(service=service, options=options)
```

So we can focus on the scraper file now, which will contain the following:

1.  A function **scrape** to load the HTML file with the Chrom driver.
2.  A function **get\_headers** which will match all headers with a given pattern.

```python
from selenium.webdriver import Chrome
from bs4 import BeautifulSoup
from pathlib import Path
import re


def scrape(driver: Chrome, htmlfile: Path) -> dict:
    """Returns a dictionary from the scraped htmlfile."""
    driver.get(f"file://{htmlfile}")
    if driver.page_source is not None:
        return {"file": str(htmlfile), "headers": get_headers(driver.page_source)}


def get_headers(page_source: str) -> dict:
    """Get all h2 and h3 headers in html page."""
    html = BeautifulSoup(page_source, "html.parser")
    headers = html.find_all(re.compile("^h[2-3]$"))
    data = []
    for header in headers:
        if header is not None:
            id = header.get("id")
            if id is not None:
                data.append({"tag": header.name, "id": id, "text": header.text})
    return data
```

This should be enough for us so we can focus on the logic of writting the output file. So we are going to back to main and refactor it so it writes the list of dictionaries as a json file.


## Refactoring Main

Now that we placed the logic for scraping the data in separated files, we will finish the main function logic by adding the outputs after we&rsquo;ve scraped the data from our inputs. So we will:

1.  Add new arguments.
2.  Move the scraping logic to a helper function.
3.  Use the json module to write the output.

```python
from argparse import ArgumentParser
from pathlib import Path
import json

from .driver import get_driver
from .scraper import scrape


class Arguments:
    filepath: str
    outpath: str


def scrape_files(path: Path) -> list:
    driver = get_driver()
    if not path.is_dir():
        return [scrape(driver, path)]
    return [scrape(driver, filepath) for filepath in path.glob("**/*.html")]


def main(argv: Arguments):
    data = scrape_files(Path(argv.filepath).resolve())
    with open(Path(argv.outpath).resolve(), "w") as json_file:
        json_file.write(json.dumps(data, indent=2))


if __name__ == "__main__":
    args = ArgumentParser()
    args.add_argument("filepath", help="File path or directory to scrape.")
    args.add_argument("--outpath", help="Output JSON file path.", default="./data.json")
    main(args.parse_args())

```


## Running the Tests

We can go back to our favorite command, pytest.

```shell
poetry run black . && poetry run pytest
```

```
======================== test session starts =========================
platform darwin -- Python 3.7.13, pytest-7.2.0, pluggy-1.0.0
rootdir: /Users/albertovaldez/html-index-maker, configfile: pyproject.toml
collected 1 item

tests/test_main.py::test_file
--------------------------- live log call ----------------------------
2022-11-20 16:19:36 [DEBUG] (test_main.py:18): ['poetry', 'run', 'python', '-m', 'html-index-maker', './resources/ml.html']
PASSED                                                         [100%]

========================= 1 passed in 5.48s ==========================
```

Our test passed! We can move on to finishing our module now. We know that the module works with a single file but we want to make sure it works with a directory, so we will refactor the tests once more.


## Adding more Tests

We will add another test function but this time we want to check the results from multiple files. In order to keep it simple, we will hard-code the tests to this specific use case, no special lookup tables, functions or parametrization, just checking that the values match the expectations.

```python
def test_directory():
    command = [
        "poetry",
        "run",
        "python",
        "-m",
        "html-index-maker",
        "./resources",
    ]
    log.debug(command)
    subprocess.run(command)
    with open("./data.json", "r") as json_file:
        data = json.loads(json_file.read())
    for file in data:
        if "/unsupervised-ml.html" in file["file"]:
            assert file["headers"][0]["id"] == "unsupervised-machine-learning"
            assert file["headers"][1]["id"] == "clustering"
        if "/ml.html" in file["file"]:
            assert file["headers"][0]["id"] == "machine-learning"
            assert file["headers"][1]["id"] == "supervised-learning"
        if "/deeplearning.html" in file["file"]:
            assert file["headers"][0]["id"] == "deep-learning"
            assert file["headers"][1]["id"] == "neural-networks"
```

We run the tests again.

```shell
poetry run black . && poetry run pytest
```

```
======================== test session starts =========================
platform darwin -- Python 3.7.13, pytest-7.2.0, pluggy-1.0.0
rootdir: /Users/albertovaldez/html-index-maker, configfile: pyproject.toml
collected 2 items

tests/test_main.py::test_file
--------------------------- live log call ----------------------------
2022-11-20 16:34:46 [DEBUG] (test_main.py:18): ['poetry', 'run', 'python', '-m', 'html-index-maker', './resources/ml.html']
PASSED                                                         [ 50%]
tests/test_main.py::test_directory
--------------------------- live log call ----------------------------
2022-11-20 16:34:52 [DEBUG] (test_main.py:46): ['poetry', 'run', 'python', '-m', 'html-index-maker', './resources']
PASSED                                                         [100%]

========================= 2 passed in 13.89s =========================
```

We are basically done! Any other change to the module can be tested programatically and because this is a very simple program, we can live with two tests and a single use case. However, when wanting to generalize the code more, adding more command line arguments, etc. we will need to think of more tests to cover more possibilities. We know the steps, it&rsquo;s just a matter of executing to match the requirements and expectations.


## Result Example

This is the JSON file that results from this use case:

<https://github.com/AlbertoV5/html-index-maker/blob/main/data.json>

This is the end of this article, but development of the module keeps going. Make sure to update the README.md file and writing documentation, then we can publish it!


## Installing Globally

We can install the module in editable mode in our global pyenv environment with the following command.

```shell
pip install -e .
```

This means that we don&rsquo;t need to use the poetry command before calling it, and every change we make to it will be reflected into the global version. However, dependencies may conflict with other modules and testeability may not be ideal so we will still want to run it via poetry when developing.

However, this can allow us to run the module in any directory without the need to publish it to PyPi, and we can upload it to a public repository and anyone else can clone it and install it. Just remember than you may need to use either &ldquo;poetry build&rdquo; or &ldquo;poetry install&rdquo; to build the .whl file before using pip to install it globally in editable mode.


## Publishing to PyPi

We need three things to publish to PyPi:

1.  We need a PyPi token for authorization <https://pypi.org/help/#apitoken>
2.  We need to store the token in our environment variables.

For the first one, we can follow the PyPi instructions, and then go to our environment file, which we can find in the root directory of our user account. We can open the environment file with our favorite editor.

```shell
code ~/.zshrc
```

Then you can add the following lines:

```
export pypiuser="__token__"
export pypipass="pypi-................."
```

Make sure to identify which file is exporting the environment variables in your setup. Include your PyPi password in &ldquo;pypipass&rdquo; and then update the current environment by running:

```shell
source ~/.zshrc
```

Now we can publish to PyPi by:

1.  Build the package.
2.  Publish it with the credentials.

```shell
poetry build
```

**CAUTION**: Make sure to remove any credentials, keys and private information from your package before publishing it. Also it doesn&rsquo;t hurt to read PyPi&rsquo;s [Terms of Use](https://pypi.org/policy/terms-of-use/).

```shell
poetry publish -u $pypiuser -p $pypipass
```

Here is the module from this article: <https://pypi.org/project/html-index-maker/>

And the repository: <https://github.com/AlbertoV5/html-index-maker>

Note that is likely that there were changes made to the module, tests and resources.

## Footnotes

<sup><a id="fn.1" class="footnum" href="#fnr.1">1</a></sup> <https://peps.python.org/pep-0008/#package-and-module-names>

<sup><a id="fn.2" class="footnum" href="#fnr.2">2</a></sup> <https://pypi.org/>