import os
import re
import shutil
import time

import cv2
import pytesseract
from PIL import Image
import numpy as np

import constants


def get_constants_by_prefix(prefix):
    return [value for name, value in vars(constants).items() if name.startswith(prefix)]


const_properties = get_constants_by_prefix("PROPERTY")


def create_dir(path):
    try:
        if os.path.exists(path):
            shutil.rmtree(path)
        os.makedirs(path)
        print("--- Created path at " + path + " ---")
    except OSError:
        print(f"ERROR: creating directory with name {path}")


def crop_image(img_path, x_pos, width, y_pos, height):
    img = cv2.imread(img_path)
    x = x_pos
    y = y_pos
    w = width
    h = height
    return img[y:y + h, x:x + w]


def crop_frame(frame, x_pos, width, y_pos, height):
    x = x_pos
    y = y_pos
    w = width
    h = height
    return frame[y:y + h, x:x + w]


def init_tesseract():
    pytesseract.pytesseract.tesseract_cmd = r'/usr/local/Cellar/tesseract/4.1.1/bin/tesseract'


def read_text_from_img_path(img_path):
    init_tesseract()
    # Make the image grey
    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    gray, img_bin = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    gray = cv2.bitwise_not(img_bin)
    kernel = np.ones((2, 1), np.uint8)
    img = cv2.erode(gray, kernel, iterations=1)
    img = cv2.dilate(img, kernel, iterations=1)
    # Use OCR to read the text from the image
    return pytesseract.image_to_string(img)


def read_text_from_img(img):
    init_tesseract()
    # Make the image grey
    img = np.array(img)
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    gray, img_bin = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    gray = cv2.bitwise_not(img_bin)
    kernel = np.ones((2, 1), np.uint8)
    img = cv2.erode(gray, kernel, iterations=1)
    img = cv2.dilate(img, kernel, iterations=1)
    # Use OCR to read the text from the image
    return pytesseract.image_to_string(img)


def remove_redundant_output_list(img_str):
    # remove blank lines
    img_str = "".join([s for s in img_str.splitlines(True) if s.strip()])
    str_ls = img_str.split("\n")

    # remove empty last ele
    if not str_ls[len(str_ls) - 1]:
        del str_ls[len(str_ls) - 1]

    # loop list to remove some characters, then convert 'ATK 415%' --> 'ATK +15%'
    for idx, x in enumerate(str_ls, 0):
        x = re.sub("[^A-Za-z0-9()+% ]+", "", x).strip()
        str_ls[idx] = x
        if "+" not in x:
            for pro in const_properties:
                if pro in x:
                    point = x[len(pro):].strip()
                    str_ls[idx] = pro + " +" + point[1:]
                    break

    return str_ls


def remove_redundant_output_str(img_str, join_char):
    str_ls = remove_redundant_output_list(img_str)
    return join_char.join(str_ls)


def remove_redundant_output_str_test(file_path, img_str, join_char):
    str_ls = remove_redundant_output_list(img_str)
    str_ls.append(os.path.basename(file_path))
    return join_char.join(str_ls)


def preview_remove_part_img(img_path, rm_x_pos, rm_width, rm_y_pos, rm_height):
    img = Image.open(img_path)
    print(img.size)
    print(img.mode)
    img_arr = np.array(img)
    img_arr[rm_y_pos: (rm_y_pos + rm_height), rm_x_pos: (rm_x_pos + rm_width)] = (0, 0, 0)
    img = Image.fromarray(img_arr)
    img.show()


def remove_part_img(img, rm_x_pos, rm_width, rm_y_pos, rm_height):
    img_arr = np.array(img)
    img_arr[rm_y_pos: (rm_y_pos + rm_height), rm_x_pos: (rm_x_pos + rm_width)] = (0, 0, 0)
    img = Image.fromarray(img_arr)
    return img


def remove_duplicate_array(array):
    res = []
    [res.append(x) for x in array if x not in res]
    return res


def log_percent(current, total, threshold):
    if current % threshold == 0:
        print(f"index: {current} --> {int(current / total * 100)}%")


def current_milli_time():
    return round(time.time() * 1000)
