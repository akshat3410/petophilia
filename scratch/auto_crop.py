import os
from PIL import Image

images = ['accessories.png', 'cat.png', 'dog.png', 'food.png']
base_dir = 'public/images/categories'

for name in images:
    p = os.path.join(base_dir, name)
    if os.path.exists(p):
        im = Image.open(p)
        w, h = im.size
        
        # Detect background color from top-left corner
        bg_color = im.getpixel((5, 5))
        
        # Helper to check if pixel is background
        def is_bg(pix):
            # Allow some tolerance for JPEG/compression noise
            return sum(abs(a-b) for a, b in zip(pix[:3], bg_color[:3])) < 35

        # Scan for left edge
        left = 0
        for x in range(w // 2):
            column_pixels = [im.getpixel((x, y)) for y in range(100, h - 100, 10)]
            non_bg_count = sum(not is_bg(p) for p in column_pixels)
            if non_bg_count > len(column_pixels) * 0.15:  # more than 15% is not background
                left = x
                break
                
        # Scan for right edge
        right = w - 1
        for x in range(w - 1, w // 2, -1):
            column_pixels = [im.getpixel((x, y)) for y in range(100, h - 100, 10)]
            non_bg_count = sum(not is_bg(p) for p in column_pixels)
            if non_bg_count > len(column_pixels) * 0.15:
                right = x
                break
                
        # Scan for top edge
        top = 0
        for y in range(h // 2):
            row_pixels = [im.getpixel((x, y)) for x in range(100, w - 100, 10)]
            non_bg_count = sum(not is_bg(p) for p in row_pixels)
            if non_bg_count > len(row_pixels) * 0.15:
                top = y
                break
                
        # Scan for bottom edge
        bottom = h - 1
        for y in range(h - 1, h // 2, -1):
            row_pixels = [im.getpixel((x, y)) for x in range(100, w - 100, 10)]
            non_bg_count = sum(not is_bg(p) for p in row_pixels)
            if non_bg_count > len(row_pixels) * 0.15:
                bottom = y
                break

        print(f'{name} -> Left: {left}, Right: {right}, Top: {top}, Bottom: {bottom}')
        
        # Add a small padding of 5 pixels to avoid clipping the actual photo content, or just crop exactly
        # Ensure we have a square crop
        crop_w = right - left
        crop_h = bottom - top
        size = min(crop_w, crop_h)
        
        # Recenter the square crop
        cx = left + crop_w // 2
        cy = top + crop_h // 2
        
        new_left = max(0, cx - size // 2)
        new_top = max(0, cy - size // 2)
        new_right = min(w, cx + size // 2)
        new_bottom = min(h, cy + size // 2)
        
        cropped_im = im.crop((new_left, new_top, new_right, new_bottom))
        cropped_im.save(p)
        print(f'Cropped and saved {name} to {new_right-new_left}x{new_bottom-new_top}')
