import os
from glob import glob

import excel_utilities
import log_utilities
import utilities
import constants


def export_excel(output_path, raw_data_ls):
    headers = utilities.get_constants_by_prefix("HEADER")
    pattern = excel_utilities.init_data(headers)
    result = excel_utilities.populate_data(raw_data_ls, pattern)
    if len(result) > 0:
        excel_utilities.write_excel(output_path, result, headers)
        log_utilities.ok_colored("Export Excel Successfully")
    else:
        log_utilities.error_colored("Export Excel Failed")


def read_removed_parts(removed_path):
    removed_list = glob(removed_path + "/*")
    length = len(removed_list)
    threshold_percent = int(length / 10) if int(length / 10) > 0 else length
    print("--- Start reading parts of images ---")

    join_ls = []
    for idx, f in enumerate(removed_list, 0):
        str = utilities.read_text_from_img_path(f)
        str_rm = utilities.remove_redundant_output_str(str, ";")
        # str_rm = utilities.remove_redundant_output_str_test(f, str, ";")
        join_ls.append(str_rm)
        utilities.log_percent(idx, length, threshold_percent)

    result = utilities.remove_duplicate_array(join_ls)
    print("--- End reading parts of images ---")
    return result


if __name__ == "__main__":
    # sw_runes/Record_runes
    input_path = constants.REMOVED_PATH + "/Record_runes"
    output_path = constants.EXCEL_PATH + "/sw_runes_output.xlsx"
    txt_path = constants.EXCEL_PATH + "/cache.txt"

    print("--- Start processing to extract text ---")
    if os.path.exists(txt_path):
        raw_data_ls = excel_utilities.read_txt_as_list(txt_path)
    else:
        raw_data_ls = read_removed_parts(input_path)
        excel_utilities.write_txt(txt_path, str(raw_data_ls))

    export_excel(output_path, raw_data_ls)
    print("--- End processing to extract text ---")
