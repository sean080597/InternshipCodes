import os
import re

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


if __name__ == "__main__":
    str = utilities.read_text_from_img_path(constants.REMOVED_PATH + "/Record_runes/rm_128.png")
    str_ls = utilities.remove_redundant_output_list(str)
    print(",".join(str_ls))
    #
    # print("-----------------------------------------------")
    # str = utilities.read_text_from_img(constants.CROPPED_PATH + "/rm_spd2.jpg")
    # str_ls = utilities.remove_redundant_text(str)
    # print(str_ls)

    # file_name = constants.REMOVED_PATH + "/Record_runes/rm_1316.png"
    # utilities.removePartImg(constants.CROPPED_PATH + "/1.png", constants.CROPPED_PAT  H, 380, 60, 540, 340)
    # utilities.preview_remove_part_img(file_name, configs.SET_RUNES_X, configs.SET_RUNES_WIDTH, configs.SET_RUNES_Y, configs.SET_RUNES_HEIGHT)

    # img_name = "spd2.jpg"
    # img = utilities.crop_image(constants.CROPPED_PATH + "/" + img_name, configs.X_POS, configs.WIDTH, configs.Y_POS, configs.HEIGHT)
    # cv2.imwrite(constants.CROPPED_PATH + "/cropped_" + img_name, img)

    # img_name = "14.png"
    # img = Image.open(constants.CROPPED_PATH + "/" + img_name)
    # img = remove_parts_of_img(img)
    # str = utilities.read_text_from_img(img)
    # img.save(constants.CROPPED_PATH + "/rm_" + img_name)
    # str = utilities.read_text_from_img_path(constants.CROPPED_PATH + "/rm_" + img_name)
    # print(str)
