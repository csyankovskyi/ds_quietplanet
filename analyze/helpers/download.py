import requests
from pathlib import Path

chunk_size = 8192

"""
urls - dict
    key - url
    value - output file name
output_folder - Path
"""
def download(urls, output_folder):
    output_folder.mkdir(exist_ok=True)

    for url in urls:
        file_name = urls[url]
        with open(output_folder / file_name, "wb") as output, requests.get(url, stream=True) as stream:
            stream.raise_for_status()
            for chunk in stream.iter_content(chunk_size=chunk_size):
                output.write(chunk)


