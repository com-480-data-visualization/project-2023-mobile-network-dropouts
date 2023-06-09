"""
This module generates various stats, which are then saved in the data/ folder.
"""
import os
import sys
import tqdm
import storage
import compute_game_stats

DOWNLOAD_PATH = storage.DOWNLOAD_PATH
DATASET_NAME = "lichess_db_standard_rated_2017-04.pgn"

GAMES_PER_CHUNK = 100000
MAX_CHUNKS = 10000

def get_chunks_names():
    """
    Returns the names of the chunks generated by the `split_dataset` function.
    """
    return [DOWNLOAD_PATH + i for i in os.listdir(DOWNLOAD_PATH)]

def split_dataset():
    """
    Splits the dataset into chunks of at most {GAMES_PER_CHUNK} games.
    It also makes sure to not write more than {MAX_CHUNKS} files, to not overload the filesystem.
    """
    total_nr_games = 0
    # initial archive file
    fin = open(f"{DOWNLOAD_PATH}{DATASET_NAME}", "rb")
    # last line of the previous chunk, which was not printed
    last_line = b""

    print("Splitting dataset into chunks...")
    # read chunks
    for chunk_nr in range(MAX_CHUNKS):
        print(f"Creating chunk #{chunk_nr}...")
        fout = open(f"{DOWNLOAD_PATH}/chunk-{chunk_nr:04}.pgn", "wb")
        fout.write(last_line)

        games_left_to_read = GAMES_PER_CHUNK + (1 if last_line == b"" else 0)

        while games_left_to_read > 0:
            last_line = fin.readline()
            
            # reached end of file
            if last_line == b'':
                sys.exit()

            # reached a new game
            if last_line.startswith(b"[Event"):
                games_left_to_read -= 1
                total_nr_games += 1
            # read all games for chunk
            if games_left_to_read == 0:
                break
                
            # just dump the line
            fout.write(last_line)

    print(f"Finished splitting dataset into chunks. Found {total_nr_games} games.")

def download_and_split_dataset():
    """
    This function downloads the dataset from the lichess.com website,
    and splits it into "chunks", each containing at most {GAMES_PER_CHUNK} games.
    This split allows for a paralel parsing of the files.
    """
    # if data is not empty, we assume we don't have to download.
    if os.getenv("GENERATE_DATA_IGNORE_DOWNLOAD") is not None:
        return
    
    os.makedirs(DOWNLOAD_PATH, exist_ok=True)

    # check if we have chunks inside
    items = [i for i in os.listdir(DOWNLOAD_PATH) if "chunk" in i]
    if items != []:
        return
    
    # download the dataset if it does not exist
    if not os.path.exists(f"{DOWNLOAD_PATH}{DATASET_NAME}.zst"):
        print(f"Downloading dataset...")
        ret_code = os.system(f"wget -P {DOWNLOAD_PATH} https://database.lichess.org/standard/{DATASET_NAME}.zst")
        if ret_code != 0:
            raise f"Unable to wget: got ret_code of {ret_code}"
    
    # extract the dataset if not already extracted
    if not os.path.exists(f"{DOWNLOAD_PATH}{DATASET_NAME}"):
        print(f"Extracting archive...")
        os.system(f"pzstd -d {DOWNLOAD_PATH}{DATASET_NAME}.zst -o {DOWNLOAD_PATH}/{DATASET_NAME}")
    
    # split into chunks
    split_dataset()

    # delete archive and db
    os.remove(f"{DOWNLOAD_PATH}{DATASET_NAME}")
    os.remove(f"{DOWNLOAD_PATH}{DATASET_NAME}.zst")

def compute_data():
    """
    Computes the statistics we are interested in.
    This function should mostly call other functions that compute specific stats.
    """
    compute_game_stats.compute_game_stats()

def generate_data():
   """
   This functions does:
    1. Downloads the dataset from the online archive, and splits it into smaller chunks for easy processing.
    2. Actually compute stuff based on it, which can then be served to the API.
   """
   download_and_split_dataset()
   compute_data()