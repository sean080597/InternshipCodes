import ast
import re

import pandas as pd

import constants
import log_utilities
import utilities


const_categories = utilities.get_constants_by_prefix("CATE")
const_prefix = utilities.get_constants_by_prefix("PREFIX")

name_ls = []
cate_ls = []
number_ls = []
level_ls = []
main_ls = []
prefix_ls = []
sub1_ls = []
sub2_ls = []
sub3_ls = []
sub4_ls = []


def init_data(headers):
    data = {}
    for h in headers:
        data.update({h: []})
    return data


def populate_data(raw_data_ls, pattern):
    for d in raw_data_ls:
        try:
            handle_properties(d, pattern)
        except Exception as e:
            log_utilities.error_colored(f"Caught: {d} --> Exception: {e}")
            return []
    return pattern


def handle_properties(properties_str, pattern):
    str_ls = properties_str.split(";")
    if "(" not in str_ls[0] or ")" not in str_ls[0]:
        for ele in str_ls:
            if any(re.match("\((.*)\)", e) for e in ele.split(" ")):
                old_idx = str_ls.index(ele)
                str_ls.insert(0, str_ls.pop(old_idx))

    pattern['name'].append(str_ls[0])

    for cate in const_categories:
        if cate in str_ls[0]:
            pattern['cate'].append(cate)
            break

    pattern['number'].append(re.search("([1-6]{1})", str_ls[0]).group(1))
    pattern['level'].append(re.search("\+?(\d+)", str_ls[0]).group(1))
    pattern['main'].append(str_ls[1])
    pattern['main_point'].append(re.search("\+(\d+%?)", str_ls[1]).group(1))

    idx_property_1 = 2
    idx_property_2 = 3
    idx_property_3 = 4
    idx_property_4 = 5
    if any(pre in str_ls[0] for pre in const_prefix):
        pattern['prefix'].append(str_ls[2])
        # print(f'{str_ls[0]}')
        pattern['prefix_point'].append(re.search("\+(\d+%?)", str_ls[2]).group(1))
        idx_property_1 = 3
        idx_property_2 = 4
        idx_property_3 = 5
        idx_property_4 = 6
    else:
        pattern['prefix'].append("")
        pattern['prefix_point'].append("")

    pattern['sub1'].append(str_ls[idx_property_1])
    pattern['sub1_point'].append(re.search("\+(\d+%?)", str_ls[idx_property_1]).group(1))

    max_len = len(str_ls)
    if idx_property_2 < max_len:
        pattern['sub2'].append(str_ls[idx_property_2])
        pattern['sub2_point'].append(re.search("\+(\d+%?)", str_ls[idx_property_2]).group(1))
    else:
        pattern['sub2'].append("")
        pattern['sub2_point'].append("")

    if idx_property_3 < max_len:
        pattern['sub3'].append(str_ls[idx_property_3])
        pattern['sub3_point'].append(re.search("\+(\d+%?)", str_ls[idx_property_3]).group(1))
    else:
        pattern['sub3'].append("")
        pattern['sub3_point'].append("")

    if idx_property_4 < max_len:
        pattern['sub4'].append(str_ls[idx_property_4])
        pattern['sub4_point'].append(re.search("\+(\d+%?)", str_ls[idx_property_4]).group(1))
    else:
        pattern['sub4'].append("")
        pattern['sub4_point'].append("")

    return pattern


def write_excel(output_path, data, headers):
    write_txt(constants.EXCEL_PATH + "/data.txt", str(data))
    df = pd.DataFrame(data, columns=headers)
    df.to_excel(output_path, index=False, header=True, sheet_name='sw_runes')


def read_excel(path):
    return pd.read_excel(path, sheet_name='config')


def write_txt(output_path, data):
    f = open(output_path, "w")
    f.write(data)
    f.close()


def read_txt_as_list(input_path):
    file = open(input_path, "r")
    data = file.read()
    res = ast.literal_eval(data)
    return res
