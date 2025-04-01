from sentence_transformers import SentenceTransformer, util
import pandas as pd

# Load the model
model = SentenceTransformer('all-MiniLM-L6-v2') 

def prod_map(query):
    if query != '' and query is not None:
        data = pd.read_excel("home-depot_data_cleaned.xlsx")

        title_list = data['title'].tolist()

        # Encode query and other sentences into embeddings
        query_embedding = model.encode(query, convert_to_tensor=True)
        sentence_embeddings = model.encode(title_list, convert_to_tensor=True)

        # Compute cosine similarities
        cosine_scores = util.pytorch_cos_sim(query_embedding, sentence_embeddings)

        # Find the most similar sentence
        best_match_idx = cosine_scores.argmax().item()
        best_match = title_list[best_match_idx]

        # Print results
        # print(f"Query Sentence: {query}")
        # print(f"Best Match: {best_match}")
        # print(f"Similarity Score: {cosine_scores[0][best_match_idx].item():.4f}")
        return data['product_id'][best_match_idx]
    else:
        return(print('Please enter valid product to search...'))

prod_map('prevents transmission fluid from leaking out of the transmission where the output shaft extends from the transmission housing')