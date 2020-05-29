#!/usr/bin/env python3
from helpers.download import download
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

def bake_chart_data(dataset_folder: str, chart: dict, output_file: str):
    out_dictionary = { "description": "", "legend": [], "metadata": [], "data": [] }
    out_dictionary["legend"] = chart["legend"]
    out_dictionary["description"] = chart["description"]
    out_dictionary["metadata"] = chart["metadata"]
    
    files = [file for file in os.listdir(dataset_folder) if file.lower().endswith(".csv")]

    for file in files:
        with open(os.path.join(dataset_folder, file), "r") as csv:
            dataset = csv.read()

        out_dictionary["data"].append(transform_dataset(dataset, 99999.0))

    with open(output_file, "w") as output:
        json.dump(out_dictionary, output)

def load_charts_list(charts_json_path: str):
    with open(charts_json_path) as charts_json:
        charts = json.load(charts_json)
        return charts

def download_chart_datasets(datasets: list, output_folder: str):
    urls = {}
    for i in range(len(datasets)):
        filename = str(i + 1) + ".csv"
        urls[datasets[i]] = filename

    download(urls, output_folder)

def generate_chart(chart_obj: dict, output_folder: str):
    download_chart_datasets(chart_obj["datasets"], output_folder)
    bake_chart_data(output_folder, os.path.join(output_folder, "chart.json"))

def generate_all_graphs():
    charts = load_charts_list(Path(__file__).absolute().parent.parent / "graphs" / "graphs.json")
    for chart in charts:
        output_folder = Path(__file__).absolute().parent.parent / "graphs" / (chart["name"])
        output_folder.mkdir(exist_ok=True)
        download_chart_datasets(chart["datasets"], str(output_folder))
        bake_chart_data(str(output_folder), chart, str(output_folder / "chart.json"))

    return

if __name__ == "__main__":
    generate_all_graphs()

