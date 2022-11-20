# Creating Python Modules with Poetry (macOS)

The first steps and the development cycle.

![img](../resources/pexels-suzy-hazelwood-1122865.jpg)

Photo by Suzy Hazelwood: <https://www.pexels.com/photo/closeup-photo-of-assorted-title-books-1122865/>

We are going to go over the basic steps for creating a Python module with Poetry focusing on macOS just to keep it simple. Requirements:

1.  macOS >= 10.15.7
2.  pyenv >= 2.3.6
3.  poetry >= 1.2.2

```shell
sw_vers | grep ProductVersion
```

```
ProductVersion:	10.15.7
```

```shell
pyenv --version
```

```
pyenv 2.3.6
```

```shell
poetry --version
```

```
Poetry (version 1.2.2)
```


## Module Context

Before starting the process, we are going to define the type of module we are creating. In this case, we are creating a simple &ldquo;local&rdquo; scraper that will open HTML files in a directory with JavaScript enabled, so we will use the classic Selenium and BeautifulSoup4 combination.

We want to use this utility in many different directories so instead of copying and pasting it or using a git submodule, we are going to make it a python module that we can use in our global pyenv environment.


## Creating Directories

We are going to create a directory and the necessary files for development.

```shell
mkdir html-index-maker && cd html-index-maker
```

We create a source directory.

```shell
mkdir src && mkdir src/html-index-maker
```

And our init and main files.

```shell
touch src/html-index-maker/__init__.py && touch src/html-index-maker/__main__.py
```

Then create a readme file (do it or Poetry won&rsquo;t be happy).

```shell
touch ./README.md
```


## Initializing Git and Poetry

We initialize git and change to &ldquo;main&rdquo;.

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
packages = [{include = "html_index_maker", from = "src"}]

[tool.poetry.dependencies]
python = "^3.7"


[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

However, note that the `packages` must match the folder under &ldquo;src&rdquo;!

So make sure to change it in the TOML file if needed.

```toml
packages = [{include = "html-index-maker"}]
```


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

Then we will add the dev dependencies.

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
    args.add_argument("-n", "--name")
    main(args.parse_args())
```

This should print &ldquo;Hello &rdquo; and whatever name we give it as argument.

Before running the code, we can install the module in the environment, then run it via Poetry.

```shell
poetry install
```

Then run the code with &ldquo;Bob&rdquo; as argument. Note that the code should work without &ldquo;poetry run&rdquo; if we are working in the &ldquo;venv&rdquo; environment but we are keeping it as a general practice.

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

If we use &ldquo;tree&rdquo;, we can verify the state of our directory.

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

Now we can create our code for testing.

```python
import subprocess
import logging

log = logging.getLogger(__name__)

def test_main():
    command = ["poetry", "run", "python", "-m", "html-index-maker", "Bob"]
    out = subprocess.check_output(command)
    assert out.decode("utf-8") == "Hello Bob\n"
    log.debug(out)
```

And run it simply via pytest.

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

Note that we didn&rsquo;t get any log information, but we can always tell pytest to register debug messages by adding it to the &ldquo;pyproject&rdquo; file.

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

Now we can try again!

```shell
poetry run pytest
```

```
======================== test session starts =========================
platform darwin -- Python 3.7.13, pytest-7.2.0, pluggy-1.0.0
rootdir: /Users/albertovaldez/html-index-maker, configfile: pyproject.toml
collected 1 item

tests/test_main.py::test_main
--------------------------- live log call ----------------------------
2022-11-20 02:32:33 [DEBUG] (test_main.py:11): b'Hello Bob\n'
PASSED                                                         [100%]

========================= 1 passed in 1.21s ==========================
```

We get the string output in the pytest log so we can move on now!

Note: Don&rsquo;t forget to commit your changes!


## The Development Cycle

Now that everything is ready to go, we will move by following the same steps:

1.  Write / Change code
2.  Run tests

So if we change the functionality of our code, we will know if it is working as intended or not, but for that we need to change the test first to match our initial requirements.

And even before that we will add the &ldquo;Black&rdquo; code formatter into the mix, we could add it to pre-commit instead but in this case we will run Black manually and leave pre-commit for another time. So the dev cycle will look like:

1.  Write code
2.  Test it
3.  Format it

The last two steps can be reduced to:

```shell
poetry run black . && poetry run pytest
```

So we can copy and paste that line into the command line and then repeat it after we make significant changes to our code. Black will run first and then pytest to make sure we get the pytest log after whatever Black outputs to the console.


## Development

WIP &#x2026;


## Installing Globally

We can install the module in editable mode in our global pyenv environment with the following command.

```shell
pip install -e .
```

This means that we don&rsquo;t need to use the poetry command before calling it, and every change we make to it will be reflected into the global version. However, dependencies may conflict with other modules and testeability may not be ideal so we will still want to run it via poetry when developing.

However, this can allow us to run the module in any directory without the need to publish it to PyPi, and we can upload it to a public repository and anyone else can clone it and install it. Just remember than you may need to use either &ldquo;poetry build&rdquo; or &ldquo;poetry install&rdquo; to build the .whl file before using pip to install it globally in editable mode.


## Publishing to PyPi

WIP &#x2026;