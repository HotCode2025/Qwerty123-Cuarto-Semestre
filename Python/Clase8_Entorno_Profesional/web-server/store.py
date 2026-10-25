import requests


def get_razas():
    r = requests.get('https://dog.ceo/api/breeds/list/all')
    print(r.status_code)
    # print(r.text)
    print(type(r.text))  # En este caso es un string

    razas = r.json()
    for raza in razas:
        print(raza['name'])