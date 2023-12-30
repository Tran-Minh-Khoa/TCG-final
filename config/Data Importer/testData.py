# import requests
# import json

# url = "https://api.pokemontcg.io/v2/cards/xy1-1"
# response = requests.get(url)

# if response.status_code == 200:
#     # The request was successful
#     data = response.json()

#     # Extracting only the necessary keys
#     keys_to_keep = ["id", "name", "supertype", "subtypes", "hp", "types", "evolvesTo", "set", "artist", "rarity" "images",  "cardmarket"]

#     filtered_data = {key: data['data'][key] for key in keys_to_keep if key in data['data']}
#     if 'set' in data['data']:
#         filtered_data['set_id'] = data['data']['set']['id']
#         del filtered_data['set']
#     if 'cardmarket' in data['data']:
#         filtered_data['market_prices'] = data['data']['cardmarket']['prices']['averageSellPrice']
#         del filtered_data['cardmarket']
#     # Writing the filtered data to a JSON file
#     with open('filtered_cards.json', 'w', encoding='utf-8') as json_file:
#         json_file.write(json.dumps(filtered_data, ensure_ascii=False, indent=2))

# else:
#     # There was an error with the request
#     print(f"Error: {response.status_code}")
#     print(response.text)
import requests
import json
import base64
from datetime import datetime
date_format = "%Y/%m/%d %H:%M:%S"

reviews = [
    {
        "name": "John",
        "content": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus ipsam culpa illo molestias vel soluta. Exercitationem, molestiae itaque! Recusandae repellendus impedit tempora eaque vitae sed sit suscipit dolorem nihil quasi!"
    },
    {
        "name": "Jane",
        "content": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus ipsam culpa illo molestias vel soluta. Exercitationem, molestiae itaque! Recusandae repellendus impedit tempora eaque vitae sed sit suscipit dolorem nihil quasi!"
    },
    {
        "name": "Bob",
        "content": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus ipsam culpa illo molestias vel soluta. Exercitationem, molestiae itaque! Recusandae repellendus impedit tempora eaque vitae sed sit suscipit dolorem nihil quasi!"
    }
]

def FilterProduct(item):
    keys_to_keep = ["id", "name", "supertype","subtypes" ,"types", "evolvesTo","updatedAt", "set", "artist", "rarity" "images",  "cardmarket"]
    filtered_item = {key: item[key] for key in keys_to_keep if key in item}
    # Replace the 'set' key with a new key 'set_id'
    if 'rarity' in item:
        filtered_item['rarity'] = item['rarity']
    if 'images' in item:
        filtered_item['image'] = item['images']['large']
    if 'set' in item:
        filtered_item['setId'] = item['set']['id']
        date_string = item['set']['updatedAt']
        filtered_item['updatedAt'] = date_string
        datetime_object = datetime.strptime(date_string, date_format)
        unix_timestamp = int(datetime_object.timestamp())
        filtered_item['timestamp'] = unix_timestamp
        del filtered_item['set']
    price = 1
    if 'cardmarket' in item:
        if('prices' in item['cardmarket']):
            price= item['cardmarket']['prices']['averageSellPrice']
        del filtered_item['cardmarket']
    price = round(price, 2)
    price = max(price, 0.1)
    filtered_item['marketPrices'] = price
    filtered_item['amount'] = 10
    filtered_item['reviews'] = reviews
    filtered_item['images'] = [
        "https://firebasestorage.googleapis.com/v0/b/wibuteam-8d09e.appspot.com/o/card-back.png?alt=media&token=2a3b69e0-c3af-4303-a910-974bbe1ba7d6",
        "https://firebasestorage.googleapis.com/v0/b/wibuteam-8d09e.appspot.com/o/card-back.png?alt=media&token=2a3b69e0-c3af-4303-a910-974bbe1ba7d6",
        "https://firebasestorage.googleapis.com/v0/b/wibuteam-8d09e.appspot.com/o/card-back.png?alt=media&token=2a3b69e0-c3af-4303-a910-974bbe1ba7d6",
    ]
    return filtered_item

def GetData(url, setID):
    response = requests.get(url +"?q=set.id:" + setID)
    if response.status_code == 200:
        # The request was successful
        data = response.json()

        filtered_data_list = []
        length = len(data['data'])
        min_value = 0 if length < 50 else 50
        max_value = min(100, length)
        for i in range (min_value, max_value):
            item = data['data'][i]
            filtered_data_list.append(FilterProduct(item))
            
        return filtered_data_list
        # Writing the filtered data to a JSON file


    else:
        # There was an error with the request
        print(f"Error: {response.status_code}")
        print(response.text)

url = "https://api.pokemontcg.io/v2/cards"
setID = ["sv3pt5","sv3","sve","sv2","sv1","swsh12pt5gg","swsh10","swsh9"]
data = []
for setid in setID:
    data += GetData(url, setid)


with open('filtered_cards.json', 'w', encoding='utf-8') as json_file:
    json.dump(data, json_file, ensure_ascii=False, indent=2)