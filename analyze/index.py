#!/usr/bin/env python3
from helpers.download import download
from pathlib import Path
import json
import os

def transform_dataset(dataset: str, calculation_method: str, empty: float):
    constant = 0.0
    rows = dataset.split("\n") # 99999.0 are unprocessed tiles that should not be included in
    # values count
    count = 0
    for row in rows:
        row = [float(value) for value in row.split(",") if value]

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
        "before": None 
    }

    calculation_method = chart["calculate"]
    
    files = [file for file in os.listdir(dataset_folder) if file.lower().endswith(".csv")]

    for file in files:
        with open(os.path.join(dataset_folder, file), "r") as csv:
            dataset = csv.read()

        out_dictionary["data"].append(transform_dataset(dataset, calculation_method, 99999.0))

    if "before" in chart.keys():
        chart_result = chart["before"]
        chart_result["legend"] = chart["legend"]
        chart_result["description"] = chart["description"]
        chart_result["calculate"] = calculation_method
        chart_result = bake_chart_data(os.path.join(dataset_folder, "before"), chart_result, write = False)
        chart_result.pop("legend", None)
        chart_result.pop("description", None)
        chart_result.pop("before", None)
        out_dictionary["before"] = chart_result

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

    if chart["before"]:
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

    return

if __name__ == "__main__":
    generate_all_graphs(True)

