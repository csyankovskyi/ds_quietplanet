from pathlib import Path
import requests

chunk_size = 8192

def download(urls: dict, output_folder: str):
    Path(output_folder).mkdir(exist_ok=True)

    for url in urls:
        file_name = urls[url]
        with open(Path(output_folder) / file_name, "wb") as output, requests.get(url, stream=True) as stream:
            stream.raise_for_status()
            for chunk in stream.iter_content(chunk_size=chunk_size):
                output.write(chunk)


