from main import process

import pickle
pickle_out = open(rf"model.pkl","wb")
pickle.dump(process, pickle_out)
pickle_out.close()