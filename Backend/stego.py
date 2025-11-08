from PIL import Image
import numpy as np

DELIMITER = '|||END|||'

def _to_binary(data: str) -> str:
    return ''.join(format(ord(c), '08b') for c in data)

def _from_binary(bin_str: str) -> str:
    chars = [bin_str[i:i+8] for i in range(0, len(bin_str), 8)]
    return ''.join(chr(int(b, 2)) for b in chars)

def encode_image(input_path: str, output_path: str, message: str) -> None:
    img = Image.open(input_path)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")

    binary_msg = _to_binary(message + DELIMITER)
    pixels = img.load()
    width, height = img.size
    data_idx = 0
    total_bits = len(binary_msg)

    for y in range(height):
        for x in range(width):
            if data_idx >= total_bits:
                break
            pixel = list(pixels[x, y])
            for channel in range(3):
                if data_idx < total_bits:
                    # Set LSB to bit of message
                    pixel[channel] = (pixel[channel] & ~1) | int(binary_msg[data_idx])
                    data_idx += 1
            pixels[x, y] = tuple(pixel)
        if data_idx >= total_bits:
            break

    img.save(output_path, "PNG")

def decode_image(input_path: str) -> str:
    img = Image.open(input_path)
    pixels = img.load()
    width, height = img.size

    binary_data = []
    for y in range(height):
        for x in range(width):
            for channel in range(3):
                binary_data.append(str(pixels[x, y][channel] & 1))

    binary_str = ''.join(binary_data)
    bytes_list = [binary_str[i:i+8] for i in range(0, len(binary_str), 8)]

    message = ''
    for b in bytes_list:
        message += chr(int(b, 2))
        if message.endswith(DELIMITER):
            return message[:-len(DELIMITER)]

    # If no delimiter found
    return ''
