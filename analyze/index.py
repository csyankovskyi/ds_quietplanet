#!/usr/bin/env python3
from helpers.download import download
from analyze import compare_graphs
from pathlib import Path
import json
import csv
import os
import io

def transform_dataset(dataset: str, calculation_method: str, empty: float):
    constant = 0.0
    csvfile = io.StringIO(dataset.replace("\0", ""))
    reader = csv.reader(csvfile, delimiter=",")
    # values count
    count = 0
    for row in reader:
        row = [float(value) for value in row if value]

        for value in row:
            if value != empty:
                if calculation_method == "average":
                    count += 1

                if calculation_method == "average" or calculation_method == "sum":
                    constant += value
                else:
                    raise Exception("Unexpected calculation method \"{}\"".format(calculation_method))

    if calculation_method == "average" and count != 0:
        constant /= count

    return constant

def bake_chart_data(dataset_folder: str, chart: dict, output_file: str = "chart.json", write: bool = True):
    out_dictionary = { 
        "description": chart["description"], 
        "legend": chart["legend"], 
        "metadata": chart["metadata"], 
        "data": [],
        "before": None,
        "section": "No section" if not "section" in chart.keys() else chart["section"]
    }

    calculation_method = chart["calculate"]
    
    files = [file for file in os.listdir(dataset_folder) if file.lower().endswith(".csv")]

    for file in files:
        with open(os.path.join(dataset_folder, file), "r") as csv:
            dataset = csv.read()

        out_dictionary["data"].append(transform_dataset(dataset, calculation_method, 99999.0))

    if "before" in chart.keys():
        prev_chart = chart["before"]
        prev_chart["legend"] = chart["legend"]
        prev_chart["description"] = chart["description"]
        prev_chart["calculate"] = calculation_method
        prev_chart = bake_chart_data(os.path.join(dataset_folder, "before"), prev_chart, write = False)
        similarity = compare_graphs(out_dictionary, prev_chart)
        prev_chart.pop("legend", None)
        prev_chart.pop("description", None)
        prev_chart.pop("before", None)
        out_dictionary["before"] = prev_chart
        out_dictionary["similarity"] = similarity

    if write: 
        with open(output_file, "w") as output:
            json.dump(out_dictionary, output)
    else:
        return out_dictionary

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

def generate_chart(chart: dict, output_folder: str, print_info: bool = False):
    download_chart_datasets(chart["datasets"], output_folder)
    if print:
        print("Main datasets for chart \"{}\" downloaded successfully".format(chart["name"]))

    if "before" in chart.keys():
        download_chart_datasets(chart["before"]["datasets"], Path(output_folder) / "before")
        if print:
            print("Datasets for previous results for chart \"{}\" downloaded successfully".format(chart["name"]))

    bake_chart_data(output_folder, chart, os.path.join(output_folder, "chart.json"))
    if print:
        print("Baking \"{}\" chart data finished successfully".format(chart["name"]))

def generate_all_graphs(print_info: bool = False):
    charts = load_charts_list(Path(__file__).absolute().parent.parent / "graphs" / "graphs.json")
    for chart in charts:
        output_folder = Path(__file__).absolute().parent.parent / "graphs" / (chart["name"])
        output_folder.mkdir(exist_ok=True)
        generate_chart(chart, str(output_folder), print_info)
        if print_info:
            print("---")

    if print_info:
        print("Graphs generated successfully")
    return

if __name__ == "__main__":
    generate_all_graphs(True)

