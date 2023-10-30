import requests


def get():
    headers = {
        'X-CMC_PRO_API_KEY': '609363bc-bd5f-4fc9-8006-ba9aa9d1020f',
        'Accept': 'application/json',
    }
    response = requests.get(
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/historical', headers=headers)
    return response.text


def put(data):

    headers = {
        'Authorization': '609363bc-bd5f-4fc9-8006-ba9aa9d1020f',
        'Accept': 'application/json',
    }
    response = requests.post(
        'https://pro-api.coinmarketcap.com', data=data, headers=headers)
    return response.text


print(get())
