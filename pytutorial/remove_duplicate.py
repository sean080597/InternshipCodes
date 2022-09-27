import os
import cv2
import constants

def remove_dup_2_imgs(imgpath1, imgpath2):
    img1 = cv2.imread(imgpath1)
    img2 = cv2.imread(imgpath2)
    if img1.shape == img2.shape:
        print("2 images have same size and channels")
        differ = cv2.subtract(img1, img2)
        b, g, r = cv2.split(differ)

        cv2.imshow("differ", differ)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        if cv2.countNonZero(b) == 0 and cv2.countNonZero(g) == 0 and cv2.countNonZero(r) == 0:
            print("Duplicate ==> " + imgpath1 + " & " + imgpath2)
        else:
            print("Not duplicate ==> " + imgpath1 + " & " + imgpath2)

def process_remove_dup(path):
    folders = os.listdir(path)
    print(folders)
    for f in folders:
        subpath = os.path.join(path, f)
        files = os.listdir(subpath)
        if len(files) != 0:
            print(f + " is not empty - has len: " + str(len(files)))

def read_img(path):
    img = cv2.imread("save/sw_runes/20.png")
    print(img.shape)
    winname = "Test"
    cv2.namedWindow(winname)        # Create a named window
    cv2.imshow(winname, img)
    cv2.waitKey()
    cv2.destroyAllWindows()

def read_video(path):
    cap = cv2.VideoCapture(path)
    length = str(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width  = str(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = str(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps    = str(cap.get(cv2.CAP_PROP_FPS))
    print("length = " + length)
    print("width = " + width)
    print("height = " + height)
    print("fps = " + fps)

def read_video_frame(path):
    cap = cv2.VideoCapture(path)
    length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if cap.set(cv2.CAP_PROP_POS_AVI_RATIO, round(240/length, 1)):
      print("Set CAP_PROP_POS_AVI_RATIO = True")
    else:
      print("Set CAP_PROP_POS_AVI_RATIO = False")
    ret, frame = cap.read()
    cv2.imwrite(f"test.png", frame)

if __name__ == "__main__":
    # print(cv2.getBuildInformation())
    save_dir = "save"
    print("--- Start processing to remove dup images ---")
    # process_remove_dup(save_dir)
    remove_dup_2_imgs(constants.SNAPSHOT_PATH + "/sw_runes/0.png", constants.SNAPSHOT_PATH + "/sw_runes/1.png")
    # read_img("save/sw_runes/20.png")
    # read_video_frame("videos/sw_runes.mp4")
    print("--- End processing to remove dup images ---")

