from pymongo import MongoClient
import json
from os.path import join

# MongoDB connection details
mongo_uri = 'mongodb+srv://admin:admin123@test.avkutv7.mongodb.net/?retryWrites=true&w=majority'  # Replace with your MongoDB connection details
database_name = 'test'  # Replace with your database name

# JSON files to import
files_to_import = [
    'test.users.json',
    'test.types.json',
    'test.subtypes.json',
    'test.sets.json',
    'test.rarities.json',
    'test.orders.json',
    'test.orderdetails.json',
    'test.carts.json',
    'test.cards.json'
]

client = MongoClient(mongo_uri)
database = client[database_name]

def import_json_data(file_path, collection_name):
    with open(file_path, 'r') as file:
        data = json.load(file)
        for document in data:
            document.pop('_id', None)
        collection = database[collection_name]
        collection.insert_many(data)
        print(f"Data from {file_path} imported into {collection_name} collection.")

for file_to_import in files_to_import:
    file_path = join('', file_to_import)  
    collection_name = file_to_import.split('.')[1] 
    import_json_data(file_path, collection_name)

client.close()
