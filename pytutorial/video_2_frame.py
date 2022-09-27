import os
import cv2
from glob import glob
import utilities
import constants
from configs import CONSTANTS as configs


def save_frame(video_path, save_dir, is_crop=False):
    name = video_path.split("/")[-1].split(".")[0]
    save_path = os.path.join(save_dir, name)
    utilities.create_dir(save_path)

    cap = cv2.VideoCapture(video_path)
    length = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    threshold_percent = int(length/10)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    gap = round(fps / 3)

    count = 0
    idx = 0
    print(f"Total frames: {length}")
    print("--- Start capturing images ---")
    while True:
        ret, frame = cap.read()

        if not ret:
            cap.release()
            break

        if idx == 0 or idx % gap == 0:
            if is_crop:
                frame = utilities.crop_frame(
                    frame, configs.X_POS, configs.WIDTH, configs.Y_POS, configs.HEIGHT
                )
            cv2.imwrite(f"{save_path}/{count}.png", frame)
            count += 1
        idx += 1
        utilities.log_percent(idx, length, threshold_percent)
    print("--- End capturing images ---")


if __name__ == "__main__":
    save_dir = constants.SNAPSHOT_PATH
    # video_paths = glob(constants.VIDEOS_PATH + "/*")

    print("--- Start processing to capture images ---")
    # for path in video_paths:
    #     save_frame(path, save_dir, True)
    save_frame(constants.VIDEOS_PATH + "/Record_runes.mp4", save_dir, True)
    print("--- End processing to capture images ---")
