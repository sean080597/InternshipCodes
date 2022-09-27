import os
from glob import glob

from PIL import Image

import utilities
import constants
from configs import CONSTANTS as configs


def remove_parts_of_img(image):
    image = utilities.remove_part_img(image, configs.PADLOCK_X, configs.PADLOCK_WIDTH, configs.PADLOCK_Y,
                                  configs.PADLOCK_HEIGHT)
    image = utilities.remove_part_img(image, configs.MON_LEFT_X, configs.MON_LEFT_WIDTH, configs.MON_LEFT_Y,
                                  configs.MON_LEFT_HEIGHT)
    image = utilities.remove_part_img(image, configs.CLOSE_X, configs.CLOSE_WIDTH, configs.CLOSE_Y, configs.CLOSE_HEIGHT)
    image = utilities.remove_part_img(image, configs.MON_RIGHT_X, configs.MON_RIGHT_WIDTH, configs.MON_RIGHT_Y,
                                  configs.MON_RIGHT_HEIGHT)
    image = utilities.remove_part_img(image, configs.SET_RUNES_X, configs.SET_RUNES_WIDTH, configs.SET_RUNES_Y,
                                  configs.SET_RUNES_HEIGHT)
    return image


def save_removed_parts(snap_path, save_dir):
    name = snap_path.split("/")[-1]
    save_path = os.path.join(save_dir, name)
    utilities.create_dir(save_path)

    snap_list = glob(snap_path + "/*")
    length = len(snap_list)
    threshold_percent = int(length / 10) if int(length / 10) > 0 else length
    print("--- Start removing parts of images ---")
    for idx, f in enumerate(snap_list, 0):
        img_name = f.split("/")[-1]
        img = Image.open(f)
        img = remove_parts_of_img(img)

        rm_img_path = save_path + "/rm_" + img_name
        img.save(rm_img_path)
        utilities.log_percent(idx, length, threshold_percent)
    print("--- End removing parts of images ---")


if __name__ == "__main__":
    save_dir = constants.REMOVED_PATH
    snap_paths = glob(constants.SNAPSHOT_PATH + "/*")
    print("--- Start processing to capture images ---")
    for path in snap_paths:
        save_removed_parts(path, save_dir)
    print("--- End processing to capture images ---")
