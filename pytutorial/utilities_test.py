import ast
import re
import unittest

import excel_utilities
import utilities
import constants


def test_read_text_from_img():
    str = utilities.read_text_from_img_path(constants.TEST_PATH + "/rm_atk_flat.jpg")
    assert "ATK +118" in str
    assert "ATK +19%" in str
    assert "Accuracy +10%" in str
    assert "HP +245" in str
    assert "HP +15%" in str

    str = utilities.read_text_from_img_path(constants.TEST_PATH + "/rm_cri_dmg.jpg")
    assert "CRI Dmg +11%" in str
    assert "SPD +4" in str
    assert "Accuracy +7%" in str
    assert "DEF +16" in str
    assert "DEF +5%" in str


def test_get_constants_by_prefix():
    data = utilities.get_constants_by_prefix("PREFIX")
    assert 'Strong' in data
    assert 'Tenacious' in data
    assert 'Quick' in data
    assert 'Ferocious' in data
    assert 'Powerful' in data
    assert 'Sturdy' in data
    assert 'Durable' in data
    assert 'Cruel' in data
    assert 'Mortal' in data
    assert 'Resistant' in data
    assert 'Intricate' in data
    print(f'\n{data}')


def test_init_data():
    headers = utilities.get_constants_by_prefix("CELL")
    data = excel_utilities.init_data(headers)
    print(f'\n{data}')


def test_search_number():
    str = "+15 Violent Rune (1)"
    data = re.search("\((.*)\)", str).group(1)
    print(f'\n{data}')


def test_search_level():
    str = "+15 Violent Rune (1)"
    data = re.search("\+(\d+%?)", str).group(1)
    print(f'\n{data} - % in str: {"%" in str}')

    str = "ATK +240"
    data = re.search("\+(\d+%?)", str).group(1)
    print(f'\n{data} - % in str: {"%" in str}')

    str = "ATK +19%"
    data = re.search("\+(\d+%?)", str).group(1)
    print(f'\n{data} - % in str: {"%" in str}')

    str = "Accuracy +11%"
    data = re.search("\+(\d+%?)", str).group(1)
    print(f'\n{data} - % in str: {"%" in str}')

    str = "Resistance +11%"
    data = re.search("\+(\d+%?)", str).group(1)
    print(f'\n{data} - % in str: {"%" in str}')

    str = "CRI Rate +4%"
    data = re.search("\+(\d+%?)", str).group(1)
    print(f'\n{data} - % in str: {"%" in str}')

    str = "CRI Dmg +7%"
    data = re.search("\+(\d+%?)", str).group(1)
    print(f'\n{data} - % in str: {"%" in str}')


def test_write_txt():
    output_txt_path = constants.EXCEL_PATH + "/cache.txt"
    data = {'name': ['+15 Violent Rune (1)', '+15 Violent Rune (1)', '+15 Violent Rune (1)', '+15 Violent Rune (1)',
                     '+15 Quick Violent Rune (1)'],
            'cate': ['Violent', 'Violent', 'Violent', 'Violent', 'Violent'],
            'number': ['1', '1', '1', '1', '1'],
            'level': ['15', '15', '15', '15', '15'],
            'main': ['ATK +160', 'ATK +160', 'ATK +160', 'ATK +160', 'ATK +160'],
            'main_point': ['160', '160', '160', '160', '160'],
            'prefix': ['', '', '', '', 'SPD +5'],
            'prefix_point': ['', '', '', '', '5'],
            'sub1': ['ATK +19%', 'Accuracy +11%', 'Resistance +12%', 'ATK +12%', 'CRI Dmg +20%'],
            'sub1_point': ['19%', '11%', '12%', '12%', '20%'],
            'sub2': ['SPD +8', 'CRI Dmg +5%', 'HP +7%', 'SPD +18', 'Accuracy +15%'],
            'sub2_point': ['8', '5%', '7%', '18', '15%'],
            'sub3': ['Resistance +8%', 'ATK +20%', 'SPD +20', 'CRI Dmg +6%', 'ATK +18%'],
            'sub3_point': ['8%', '20%', '20', '6%', '18%'],
            'sub4': ['Accuracy +7%', 'CRI Rate +15%', 'CRI Rate +5%', 'Accuracy +8%', 'CRI Rate +5%'],
            'sub4_point': ['7%', '15%', '5%', '8%', '5%']}
    excel_utilities.write_txt(output_txt_path, str(data))


def test_read_txt():
    file = open(constants.EXCEL_PATH + "/cache.txt", "r")
    data = file.read()
    res = ast.literal_eval(data)
    print(f'\n{res}\n{type(res)}')


def test_move_ele():
    ls = ['HP +14%', 'DEF +17%', 'SPD +21', 'HP +434', '+15 Swift Rune (3)', 'DEF +160', 'rm_562.png']
    print(f"\nold => {ls}")
    for ele in ls:
        if any(re.match("\((.*)\)", e) for e in ele.split(" ")):
            old_idx = ls.index(ele)
            ls.insert(0, ls.pop(old_idx))
    print(f"\nnew => {ls}")


def test_other():
    const_properties = utilities.get_constants_by_prefix("PROPERTY")
    a = "ATK 415%"
    b = "ATK 47%"
    c = "ATK415%"
    d = "ATK47%"
    e = "ATK 415"
    f = "ATK415"
    x = f

    if "+" not in x:
        for pro in const_properties:
            if pro in x:
                point = x[len(pro):].strip()
                print(f'\n"{point}"')
                print(f'\n"{point[1:]}"')
                result = pro + " +" + point[1:]
                print(f'\n{result}')
                break


def test_handle_properties():
    pattern = {'name': [], 'cate': [], 'number': [], 'level': [], 'main': [], 'main_point': [], 'prefix': [], 'prefix_point': [], 'sub1': [], 'sub1_point': [], 'sub2': [], 'sub2_point': [], 'sub3': [], 'sub3_point': [], 'sub4': [], 'sub4_point': []}
    property_str = '+9 Vampire Rune (4);HP +38%;SPD +17;HP +147;CRI Dmg +11%;rm_949.png'
    property_str = '+12 Sturdy Guard Rune (5);HP +1530;DEF +11;CRI Rate +20%;ATK +6%;Resistance +8%;SPD +5;rm_1127.png'
    property_str = '+15 Violent Rune (6);HP +51%;Accuracy +5%;SPD +8;DEF +37;CRI Dmg +3%;rm_1325.png'
    property_str = '+6 Ferocious Rage Rune (4);CRI Rate +25%;ATK +18;CRI Dmg +14%;DEF +15;HP +14%;ATK +8%;rm_788.png'
    property_str = 'Fight Rune (1);ATK +22;SPD +4;HP +7%;rm_236.png'
    rs = excel_utilities.handle_properties(property_str, pattern)
    print(f'\n{rs}')


class MyTestCase(unittest.TestCase):
    pass


if __name__ == '__main__':
    unittest.main()
