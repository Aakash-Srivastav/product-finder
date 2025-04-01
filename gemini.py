import re
from google import genai

def gemini_rag(query):

    if query != "" and query is not None:

        client = genai.Client(api_key="AIzaSyBuvUaypyovLt0xdDU0Inwtk0kghQ2PMU0")

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"{query}. Based on this find the product and give me any one short and meaningful product name. Answer only in product name and do not print anything else other than product name",
        )
        product = response.text.replace("\n","")
        # print(re.findall(r'\d+',response.text)[-1])
        return product
    
    else:
        return(print('Please enter valid product to search...'))
