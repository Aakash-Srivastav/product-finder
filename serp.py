import requests

SERP_API_KEY = "f5b3e2903450f5c64561b78d0589e1cc73df2d33b07b08b42dda8607613d71e1"

def search_home_depot(query):
    url = "https://serpapi.com/search"
    params = {
        "engine": "home_depot_product",
        "product_id": query,
        "api_key": SERP_API_KEY
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        try:
            print({data["search_information"]["taxonomy"][-1]["title"]})
            print(data["search_information"]["taxonomy"][-1]["link"])
            link = data["search_information"]["taxonomy"][-1]["link"]
            title = data["search_information"]["taxonomy"][-1]["title"]
            return link, title
        # ,"title":data["search_information"]["taxonomy"][-1]["title"]
        except:
            return (print("No product found!"))
    else:
        return (print("Error fetching product details!"))

# if __name__ == "__main__":
#     query = input("Enter product description: ")
#     product_link = search_home_depot(query)
#     print(f"Product Link: {product_link}")
