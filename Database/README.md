# TCG Shop - Python Data Import Script

This README provides instructions on how to use the Python script to import data into the TCG Shop project's MongoDB database. Make sure you have Python installed on your system before proceeding.

## Prerequisites

Make sure you have the following installed on your machine:

- [Python](https://www.python.org/)
- [pymongo](https://pypi.org/project/pymongo/)

You can install pymongo with this line if you have pip installed

    pip install pymongo

## Usage

1. Navigate to the data-migration.py file and change <strong>mongo_uri</strong> and <strong>database_name</strong> to match with the MongoDB database you want to import to.

   ```bash
   # MongoDB connection details
   mongo_uri = 'mongodb+srv://admin:admin123@test.avkutv7.mongodb.net/?retryWrites=true&w=majority'  # Replace with your MongoDB connection details
   database_name = 'test'  # Replace with your database name
   ```

2. Navigate to the Database folder and run the python file with the terminal

   ```bash
   python data-migration.py
   ```
