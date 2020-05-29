#!/usr/bin/env python3

from pathlib import Path
import json
import os

def transform_dataset(dataset: str, empty: float):
    constant = 0.0
    rows = dataset.split("\n") # 99999.0 are unprocessed tiles that should not be included in
    for row in rows:
        row = [float(value) for value in row.split(",") if value]
        for value in row:
            if value != empty:
                constant += value

    return constant


def bake_chart_data(dataset_folder, output_folder):
    out_dictionary = {"metadata": {}, "data": {}}

    with open(os.path.join(dataset_folder, "metadata.json"), "r") as metadata:
        metadata = json.load(metadata)
        out_dictionary["metadata"] = metadata
    
    files = [file for file in os.listdir(dataset_folder) if file.lower().endswith(".csv")]

    for file in files:
        with open(os.path.join(dataset_folder, file), "r") as csv:
            dataset = csv.read()

        out_dictionary["data"][file.split(".")[0]] = transform_dataset(dataset, 99999.0)

    with open(os.path.join(output_folder, os.path.split(dataset_folder)[-1]+".json"), "w") as output:
        json.dump(out_dictionary, output)

if __name__ == '__main__':
    dataset_folder = Path(__file__).parent.absolute()
    output_folder = dataset_folder.parent.absolute()
    bake_chart_data(str(dataset_folder), str(output_folder))

