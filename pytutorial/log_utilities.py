def colored(r, g, b, text):
    return "\033[38;2;{};{};{}m{} \033[38;2;255;255;255m".format(r, g, b, text)


def error_colored(text):
    print(colored(176, 0, 32, "ERROR: " + text))


def ok_colored(text):
    print(colored(75, 181, 67, "OK: " + text))
