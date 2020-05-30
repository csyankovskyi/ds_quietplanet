import json
import sys


def get_deltas(graph: dict):
    deltas = []
    present = 0
    for key in graph["data"]:
        last = present
        present = key
        deltas.append(last-present)
    return deltas[1:]


def get_tempo(deltas: list):
    tempo = []
    present = 0
    for delta in deltas:
        last = present
        present = delta
        tempo.append(last - present)
    return tempo[1:]


def compare_tempos(tempos_1, tempos_2):
    correlations = 0
    if len(tempos_1) > len(tempos_2):
        shortest = len(tempos_2)
    else:
        shortest = len(tempos_1)
    for i in range(shortest):
        if (tempos_1[i] > 0 and tempos_2 > 0) or (tempos_1 < 0 and tempos_2) < 0:
            correlations += 1
    return correlations/shortest


if __name__ == '__main__':
    json_1, json_2 = sys.argv[1:]
    with open(json_1) as unpacked_graph:
        graph_1 = json.load(unpacked_graph)
    with open(json_2) as unpacked_graph:
        graph_2 = json.load(unpacked_graph)
    deltas_1 = get_deltas(graph_1)
    deltas_2 = get_deltas(graph_2)
    tempo_1 = get_tempo(deltas_1)
    tempo_2 = get_tempo(deltas_2)
    print(compare_tempos(tempo_1, tempo_2))