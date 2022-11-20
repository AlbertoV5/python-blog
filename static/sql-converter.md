# SQL Converter

Have you ever had to convert dozens of SQL tables to Python models? Well, you can always turn to Regex.

![img](../resources/pexels-李进-3172740.jpg)

Photo by 李进: <https://www.pexels.com/photo/low-angle-photography-of-gray-spiral-building-3172740/>

In this article we will go over the steps for reading an SQL schema and match all the &ldquo;CREATE TABLE&rdquo; statements with a very simple Regex pattern, then write strings of Python classes/models with the column information.

Final code [here.](https://github.com/AlbertoV5/psql-to-models)

Note that we will use Python 3.10 for this exercise. The results are designed to be used with FastAPI 0.86.0, SQLAlchemy 1.4 and Pydantic 1.10. We are also following [this](https://github.com/faraday-academy/fast-api-lms) style of FastAPI.

Finally, we will use [this](https://github.com/MIT-LCP/mimic-code/blob/main/mimic-iii/buildmimic/postgres/postgres_create_tables.sql) SQL schema as our use case, so we want to convert all 26 tables without partitions to SQLAlchemy/Pydantic models.

```shell
pyenv local 3.10.7 & python --version
```

```
Python 3.10.7
```


## Starting at the End

This will be a retrospective process as the utility is already written, so we will start with the main function and then go down from there.

We want to read a .sql file, then output 2 .py files, one for the SQLAlchemy models and other for the Pydantic models.

```python
def main(argv: Arguments):
    """Read .sql file with CREATE TABLE queries and store models"""
    with open(Path(argv.input).resolver()) as file:
        sql_string = file.read()
    # Match pattern
    pattern = r"(?:CREATE TABLE )((.|\n*?));"
    tables: list[Table] = [
        Table.from_string(table[0]) for table in re.findall(patterb, sql_string)
    ]
    # String processing
    alchemy_data = ALCHEMY_HEADER
    pydantic_data = PYDANTIC_HEADER
    for model, pydantic in generate_strings(tables):
        alchemy_data += model
        pydantic_data += pydantic
    # Output
    with open(Path(argv.alchemy).resolve(), "w") as file:
        file.write(alchemy_data)
    with open(Path(argv.pydantic).resolve(), "w") as file:
        file.write(pydantic_data)
```

The regex pattern is really simple, it says &ldquo;look for CREATE TABLE but don&rsquo;t include it&rdquo;, then &ldquo;include any number of subgroups that are made of anything or a linebreak&rdquo;, then &ldquo;repeat that subgroup any number of times in a non-greedy way&rdquo;, then finally &ldquo;end with a semicolon&rdquo;. The non-greedy part means that it will match as few repetitions as possible, so we stop at &ldquo;;&rdquo; <sup><a id="fnr.1" class="footref" href="#fn.1" role="doc-backlink">1</a></sup>.

Note that we include a lot of constants, classes and methods that we haven&rsquo;t talked about, so let&rsquo;s take a look at those.


## The Header Constants

We are generating python files that depend on other libraries, so we will create strings that match our setup. In this case we need the SQLAlchemy types along with our `declarative base` <sup><a id="fnr.2" class="footref" href="#fn.2" role="doc-backlink">2</a></sup> for the alchemy file and the Pydantic BaseModel and datetime type for the pydantic file. <sup><a id="fnr.3" class="footref" href="#fn.3" role="doc-backlink">3</a></sup>

```python
ALCHEMY_HEADER = '''"""
SQLAlchemy Models
"""
from sqlalchemy import Column, Integer, String, CHAR, TIMESTAMP, SmallInteger
from sqlalchemy.dialects.postgresql import DOUBLE_PRECISION
from db.setup import Base
'''

PYDANTIC_HEADER = '''"""
Pydantic Models
"""
from pydantic import BaseModel
from datetime import datetime
'''
```


## Helper Functions

The last step before writing the output files is to iterate over the results of our parsed SQL string in order to generate the strings of the Models. So we will use a couple of helper functions for appending to our final string.

```python
BANNED_TABLES = ["chartevents_"]

def is_valid(table: Table) -> bool:
    """Whether table is in banned tables or not."""
    for banned in BANNED_TABLES:
        if banned in table.name:
            return False
    return True


def generate_strings(tables: list[Table]) -> Generator[tuple[str, str], None, None]:
    """Yields SQLAlchemy and Pydantic Models as strings for each table."""
    for table in tables:
        table.get_constraints()
        alchemy = f"\n{table.make_alchemy()}" if is_valid(table) else ""
        pydantic = f"\n{table.make_pydantic()}" if is_valid(table) else ""
        yield alchemy, pydantic
```

The generate\_strings function will iterate over a list of &ldquo;Table&rdquo; object that represent each SQL table and then simply call a method to create a string and yield them to the main function. We use the is\_valid function as a crutch for our Regex pattern as we don&rsquo;t mind matching ALL tables and then filtering out the ones that are not needed.


## Top and Bottom of main

Before taking a look at the implementation of the &ldquo;Table&rdquo;, we will include the imports in the main function and the argument parser so we can focus on the rest.

```python
"""
This script will read the postgres_create_tables.sql file from MIMIC and
generate python files for the sqlalchemy models and pydantic schemas for the API.
"""
from typing import Generator, Protocol
from argparse import ArgumentParser
from pathlib import Path
import re

from .table import Table


class Arguments(Protocol):
    input: str
    alchemy: str
    pydantic: str
```

Then the arguments are simply the file locations.

```python
if __name__ == "__main__":
    default_sql_input = "./schema.sql"
    default_alchemy_output = "./models_alchemy.py"
    default_pydantic_output = "./models_pydantic.py"
    args = ArgumentParser(
        prog="Convert PostgreSQL schema to SQLAlchemy and Pydantic Models.",
        usage=f"python -m psql-to-models",
        description="Regex-match the .sql schema file and outputs SQLAlchemy and Pydantic models as .py files.",
    )
    args.add_argument(
        "-i",
        "--input",
        metavar="input",
        default=f"{default_sql_input}",
        help=f"PostgreSQL Schema input file. Defaults to {default_sql_input}.",
    )
    args.add_argument(
        "-a",
        "--alchemy",
        metavar="output_alchemy",
        default=f"{default_alchemy_output}",
        help=f"SQLAlchemy Models output. Defaults to {default_alchemy_output}",
    )
    args.add_argument(
        "-p",
        "--pydantic",
        metavar="output_pydantic",
        default=f"{default_pydantic_output}",
        help=f"Pydantic Models output. Defaults to {default_alchemy_output}",
    )
    main(args.parse_args())
```


## The Table class

Now that we have the overall logic of our program, we will go down one more layer to the &ldquo;Table&rdquo;, which is simply a data class that splits the SQL string into pieces.

```python
"""
Table representation and processor.
Call any get_* functions before calling make_* functions.
"""
from dataclasses import dataclass
from .column import Column


@dataclass
class Table:
    name: str
    columns: list[Column]

    @classmethod
    def from_string(cls, table: str) -> "Table":
        """Create Table from string."""
        data = table.split("\n")
        return Table(
            name=data[0], columns=[Column.from_string(col) for col in data[2:-1]]
        )

    def get_constraints(self) -> None:
        """Use the CONSTRAINT columns to modify the rest of the columns."""
        constraints = [col.params for col in self.columns if col.name == "CONSTRAINT"]
        data = [c.replace(")", "").split("(") for c in constraints]
        data = {k.strip(): v.strip() for v, k in data}
        for column in self.columns:
            for k in data:
                if column.name == k:
                    column.primary_key = (
                        "primary_key=True" if data[k] == "PRIMARY KEY" else ""
                    )
                    column.unique = "unique=True" if data[k] == "UNIQUE" else ""

    def make_alchemy(self) -> str:
        """Make SQLAlchemy model string from this Table."""
        cols = "\n    ".join(
            col.make_alchemy_column()
            for col in self.columns
            if col.name != "CONSTRAINT"
        )
        return (
            f"class {self.name.capitalize()}(Base):\n\n"
            f'    __tablename__ = "{self.name.lower()}"\n\n'
            f"    {cols}\n\n"
        )

    def make_pydantic(self) -> str:
        """Make Pydantic model string from this Table."""
        params = "\n    ".join(
            col.make_pydantic_column()
            for col in self.columns
            if col.name != "CONSTRAINT"
        )
        return (
            f"class {self.name.capitalize()}(BaseModel):\n\n"
            f"    {params}\n\n"
            f"    class Config:\n"
            f"        orm_mode = True\n\n"
        )
```

```

```

Note that the constructor we want to use is a class method, it could be a post init process, or we could have created it as an external factory function but we simply keep it as part of the Table for convenience. We can also get rid of the dataclass decorator and be a bit more hands on but we like the convenience of the data class. <sup><a id="fnr.4" class="footref" href="#fn.4" role="doc-backlink">4</a></sup>

The Column class is similar to the Table but specializes in parsing the SQL column STATEMENT (&ldquo;column\_name INT NOT NULL&rdquo;) and creating the strings for the Python class attributes.

The design of the Table class is to separate the processing in &ldquo;get&rdquo; methods which process the information in the list of Columns, and &ldquo;make&rdquo; methods which convert the Columns into strings. We use get\_constraints to look for the &ldquo;CONSTRAINT&rdquo; SQL statements in the list of &ldquo;Columns&rdquo; and then modify the attributes of the &ldquo;actual&rdquo; Columns, this includes the &ldquo;primary\_key&rdquo; attribute, the &ldquo;unique&rdquo; one, etc.

The &ldquo;make&rdquo; methods will join the Columns into a string that Python understands as a class.


## The Column Class

This class should probably be named &ldquo;Statement&rdquo; as it includes any other SQL statement that may not be a column, but we generalize and filter at the Table level.

We need to split the single SQL statement into different attributes that we can use to describe names or types, as well as expressing CONSTRAINTS like &ldquo;unique&rdquo; in SQLAlchemy or &ldquo;optional&rdquo; in Pydantic.

```python
"""
Column representation and processor.
"""
from dataclasses import dataclass
from .types import TYPE_LOOKUP


@dataclass
class Column:
    name: str
    type: str
    params: str
    primary_key: str = ""
    unique: str = ""

    @classmethod
    def from_string(cls, col: str) -> "Column":
        """Create column from string."""
        data = col.strip().replace(",", "").split(" ", maxsplit=2)
        return Column(
            name=data[0], type=data[1], params=data[2] if len(data) > 2 else ""
        )

    def get_type(self, sqlalchemy: bool = True) -> str:
        """
        Lookup types and return either SQLAlchemy's or Pydantic's.
        """
        t = self.type.replace(")", "").split("(")
        index = 0 if sqlalchemy else 1
        if len(t) > 1:
            return (
                f"{TYPE_LOOKUP[t[0]][index]}({t[1]})"
                if sqlalchemy
                else TYPE_LOOKUP[t[0]][index]
            )
        return TYPE_LOOKUP[self.type][index]

    def make_alchemy_column(self) -> str:
        """Make SQLAlchemy Model column string."""
        return (
            f"{self.name.lower()} = Column("
            f"{self.get_type()}"
            f"{', nullable=False' if 'NOT NULL' in self.params else ''}"
            f"{'' if self.primary_key == '' else f', {self.primary_key}'}"
            f"{'' if self.unique == '' else f', {self.unique}'}"
            f")"
        )

    def make_pydantic_column(self) -> str:
        """Make Pydantic Model column string."""
        return (
            f"{self.name.lower()}: "
            f"{self.get_type(sqlalchemy=False)}"
            f"{'' if 'NOT NULL' in self.params else ' | None'}"
        )

```

We repeat the &ldquo;class method as constructor&rdquo; pattern as well as the &ldquo;get&rdquo; then &ldquo;make&rdquo; pattern from the Table class but this time we include the &ldquo;TYPE\_LOOKUP&rdquo; constant which will help us &ldquo;translate&rdquo; the SQL types to other types that interest us.

Note that the Optional pattern is converted to the &ldquo;new&rdquo; Python 3.10 syntax <sup><a id="fnr.5" class="footref" href="#fn.5" role="doc-backlink">5</a></sup>, so it should be modified to support &ldquo;Optional or Union&rdquo; for previous Python versions.


## Type Lookup Table

This is the current TYPE\_LOOKUP table as of the time of writing this article.

```python
"""Define constants for type lookup."""

TYPE_LOOKUP: dict[str, tuple[str, str]] = {
    "INT": ("Integer", "int"),
    "SMALLINT": ("SmallInteger", "int"),
    "VARCHAR": ("String", "str"),
    "TIMESTAMP": ("TIMESTAMP", "datetime"),
    "DOUBLE": ("DOUBLE_PRECISION", "float"),
    "CHAR": ("CHAR", "str"),
    "TEXT": ("String", "str"),
}
"""Values are tuples of SQLAlchemy Model Type and Pydantic/Python Type."""
```

This forces us to use a tuple instead of a second level of keys for accesing each value as we assume we are only going to use this tool for two target models, and any other models can simply be included by extending the tuple length.


## Reviewing Main

Now that we know the internals of the string splitting, we can go back and review the core of this utility, which is matching the pattern, then storing and processing the strings with our data classes, and creating a new &ldquo;Python string&rdquo; that Python will understand as classes, and then SQLAlchemy and Pydantic will understand as models.

```python
    # Pattern Matching
    pattern = r"(?:CREATE TABLE )((.|\n)*?);"
    tables: list[Table] = [
        Table.from_string(table[0]) for table in re.findall(pattern, sql_string)
    ]
    # String Processing
    alchemy_data = ALCHEMY_HEADER
    pydantic_data = PYDANTIC_HEADER
    for model, pydantic in generate_strings(tables):
        alchemy_data += model
        pydantic_data += pydantic
```

The only things we need to change in every use case is the HEADER constants and our LOOKUP\_TYPE dictionary as we may have different sets of columns and requirements.

In my case, this tool solves the problem I was facing so I leave it as is and share it with the intention of both coming back to it in the future for other projects or motivate any other user that may find it useful to adapt it to their needs, so there you go, I hope this was useful in any way.

## Footnotes

<sup><a id="fn.1" class="footnum" href="#fnr.1">1</a></sup> <https://stackoverflow.com/questions/766372/python-non-greedy-regexes>

<sup><a id="fn.2" class="footnum" href="#fnr.2">2</a></sup> <https://docs.sqlalchemy.org/en/14/orm/mapping_styles.html#orm-declarative-mapping>

<sup><a id="fn.3" class="footnum" href="#fnr.3">3</a></sup> <https://pydantic-docs.helpmanual.io/usage/models/>

<sup><a id="fn.4" class="footnum" href="#fnr.4">4</a></sup> <https://docs.python.org/3/library/dataclasses.html>

<sup><a id="fn.5" class="footnum" href="#fnr.5">5</a></sup> <https://docs.python.org/3/library/typing.html#typing.Optional>