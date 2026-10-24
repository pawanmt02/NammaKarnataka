"""
Namma Kannada - 2-Minute Full Application Showcase Video Generator
Automates browser testing of all modules via Playwright, captures high-res frames,
overlays module metadata and progress telemetry, and compiles into a 120-second MP4 video.
"""

import os
import sys
import time
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Set UTF-8 encoding
sys.stdout.reconfigure(encoding="utf-8")

OUTPUT_VIDEO = r"c:\Users\Pawan\NammaKannada\namma_kannada_showcase_2min.mp4"
TOTAL_DURATION_SEC = 120
FPS = 30
TOTAL_FRAMES = TOTAL_DURATION_SEC * FPS  # 3600 frames
FRAME_WIDTH = 1280
FRAME_HEIGHT = 720

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE_URL = "http://localhost:3000"

# Module breakdown schedule (cumulative seconds)
SCENES = [
    {
        "id": "home",
        "title": "Module 1: Platform Overview & Heritage Explorer",
        "kannada": "ಮುಖ್ಯ ಪುಟ — ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆ",
        "url": f"{BASE_URL}",
        "duration": 12,
        "actions": ["scroll_down", "scroll_up"],
    },
    {
        "id": "map",
        "title": "Module 2: Interactive Karnataka Dialect Map",
        "kannada": "ಸಂವಾದಾತ್ಮಕ ಕರ್ನಾಟಕ ಉಪಭಾಷಾ ನಕ್ಷೆ",
        "url": f"{BASE_URL}/map",
        "duration": 14,
        "actions": ["click_north", "click_coastal", "click_malnad"],
    },
    {
        "id": "stt",
        "title": "Module 3: Real-Time Speech-to-Text Dialect Transcriber",
        "kannada": "ಧ್ವನಿ ಪರಿವರ್ತಕ — ನೈಜ-ಸಮಯದ ಲಿಪ್ಯಂತರ",
        "url": f"{BASE_URL}/map",
        "duration": 12,
        "actions": ["open_stt", "simulate_speech"],
    },
    {
        "id": "translate",
        "title": "Module 4: Generative AI Dialect Translator (Gemini 1.5 Pro)",
        "kannada": "AI ಉಪಭಾಷಾ ಅನುವಾದಕ — ಜೆಮಿನಿ ತಂತ್ರಜ್ಞಾನ",
        "url": f"{BASE_URL}/translate",
        "duration": 14,
        "actions": ["type_translate", "view_notes"],
    },
    {
        "id": "quiz",
        "title": "Module 5: Gamified Linguistic Challenges & Badges",
        "kannada": "ಭಾಷಾ ರಸಪ್ರಶ್ನೆ ಮತ್ತು ಗೌರವ ಪದಕಗಳು",
        "url": f"{BASE_URL}/quiz",
        "duration": 14,
        "actions": ["start_quiz", "answer_quiz"],
    },
    {
        "id": "leaderboard",
        "title": "Module 6: Karnataka Linguistic Scholars Leaderboard",
        "kannada": "ವಿದ್ವಾಂಸರ ಮುಂಚೂಣಿ ಫಲಕ",
        "url": f"{BASE_URL}/leaderboard",
        "duration": 10,
        "actions": ["scroll_leaderboard"],
    },
    {
        "id": "museum",
        "title": "Module 7: WebXR 3D Cultural Artifact Museum",
        "kannada": "3D ಸಾಂಸ್ಕೃತಿಕ ವಸ್ತುಸಂಗ್ರಹಾಲಯ (WebXR)",
        "url": f"{BASE_URL}/museum",
        "duration": 14,
        "actions": ["view_artifacts", "rotate_3d"],
    },
    {
        "id": "etymology",
        "title": "Module 8: Visual Etymology Knowledge Graph",
        "kannada": "ಶಬ್ದ ವ್ಯುತ್ಪತ್ತಿ ಮತ್ತು ವಿಕಾಸ ಜಾಲ",
        "url": f"{BASE_URL}/etymology",
        "duration": 12,
        "actions": ["view_graph"],
    },
    {
        "id": "contribute",
        "title": "Module 9: Crowdsourced Field Collection & Offline PWA",
        "kannada": "ಸ್ಥಳೀಯ ಪದಗಳ ಸಂಗ್ರಹ ಮತ್ತು ಆಫ್‌ಲೈನ್ ಮೋಡ್",
        "url": f"{BASE_URL}/contribute",
        "duration": 10,
        "actions": ["fill_contribution"],
    },
    {
        "id": "admin",
        "title": "Module 10: Human-in-the-Loop Admin Moderation Dashboard",
        "kannada": "ತಜ್ಞರ ಪರಿಶೀಲನಾ ಪೋರ್ಟಲ್ ಮತ್ತು AI ನಿಯಂತ್ರಣ",
        "url": f"{BASE_URL}/admin",
        "duration": 10,
        "actions": ["review_submission", "approve_submission"],
    },
    {
        "id": "api_docs",
        "title": "Module 11: Developer REST API & Sandbox",
        "kannada": "ಡೆವಲಪರ್ REST API ಮತ್ತು ದತ್ತಾಂಶ ಪ್ರವೇಶ",
        "url": f"{BASE_URL}/api-docs",
        "duration": 8,
        "actions": ["view_code"],
    },
]


def add_hud_overlay(img_np: np.ndarray, title: str, kannada_title: str, current_sec: float, total_sec: float) -> np.ndarray:
    """Overlays professional header banner, progress bar, and timestamp onto frame."""
    pil_img = Image.fromarray(cv2.cvtColor(img_np, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(pil_img, "RGBA")

    # Header bar background (dark translucent glass)
    draw.rectangle([(0, 0), (FRAME_WIDTH, 52)], fill=(15, 23, 42, 235))
    draw.line([(0, 52), (FRAME_WIDTH, 52)], fill=(234, 179, 8, 180), width=2)

    # Header texts
    draw.text((20, 10), "ನಮ್ಮ ಕನ್ನಡ", fill=(250, 204, 21), font=None)
    draw.text((115, 12), f"• {title}", fill=(255, 255, 255), font=None)
    draw.text((115, 30), f"{kannada_title}", fill=(203, 213, 225), font=None)

    # Time display (MM:SS)
    curr_min = int(current_sec // 60)
    curr_s = int(current_sec % 60)
    tot_min = int(total_sec // 60)
    tot_s = int(total_sec % 60)
    time_str = f"{curr_min:02d}:{curr_s:02d} / {tot_min:02d}:{tot_s:02d}"
    draw.text((FRAME_WIDTH - 120, 18), time_str, fill=(248, 250, 252), font=None)

    # Bottom progress bar
    draw.rectangle([(0, FRAME_HEIGHT - 6), (FRAME_WIDTH, FRAME_HEIGHT)], fill=(30, 41, 59, 255))
    progress_w = int((current_sec / total_sec) * FRAME_WIDTH)
    if progress_w > 0:
        draw.rectangle([(0, FRAME_HEIGHT - 6), (progress_w, FRAME_HEIGHT)], fill=(234, 179, 8, 255))

    return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)


def run_showcase():
    print(f"Starting Namma Kannada 2-Minute Video Generator ({TOTAL_FRAMES} frames)...")
    from playwright.sync_api import sync_playwright

    p = sync_playwright().start()
    browser = p.chromium.launch(
        executable_path=CHROME_PATH,
        headless=True,
        args=["--disable-web-security", "--allow-file-access-from-files"],
    )
    context = browser.new_context(viewport={"width": FRAME_WIDTH, "height": FRAME_HEIGHT})
    page = context.new_page()

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    video_writer = cv2.VideoWriter(OUTPUT_VIDEO, fourcc, float(FPS), (FRAME_WIDTH, FRAME_HEIGHT))

    frame_count = 0
    start_time = time.time()

    for scene_idx, scene in enumerate(SCENES):
        print(f"\n[{scene_idx + 1}/{len(SCENES)}] Capturing {scene['title']} ({scene['duration']}s)...")
        target_scene_frames = scene["duration"] * FPS

        try:
            page.goto(scene["url"], wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(1000)
        except Exception as e:
            print(f"Warning: navigation wait timeout for {scene['url']}: {e}")

        # Capture multiple intermediate sub-states during the scene duration
        sub_frames_to_write = target_scene_frames
        sub_interval = max(1, sub_frames_to_write // 4)

        for step in range(4):
            # Perform specific interactive action per step
            try:
                if scene["id"] == "home":
                    if step == 1:
                        page.evaluate("window.scrollBy({top: 400, behavior: 'smooth'});")
                    elif step == 2:
                        page.evaluate("window.scrollBy({top: 400, behavior: 'smooth'});")
                    elif step == 3:
                        page.evaluate("window.scrollTo({top: 0, behavior: 'smooth'});")

                elif scene["id"] == "map":
                    if step == 1:
                        # Click on North Karnataka button or marker
                        page.evaluate("document.querySelectorAll('button')[2]?.click();")
                    elif step == 2:
                        # Click on Coastal Karnataka
                        page.evaluate("document.querySelectorAll('button')[3]?.click();")
                    elif step == 3:
                        # Click on Malnad
                        page.evaluate("document.querySelectorAll('button')[4]?.click();")

                elif scene["id"] == "stt":
                    if step == 1:
                        # Click quick try sample phrase
                        page.evaluate("document.querySelectorAll('button').forEach(b => { if(b.textContent.includes('ಏನ ಮಾಡ್ತೀಯ')) b.click(); });")
                    elif step == 2:
                        page.evaluate("document.querySelectorAll('button').forEach(b => { if(b.textContent.includes('ಎಂತ ಸಂಗತಿ')) b.click(); });")

                elif scene["id"] == "translate":
                    if step == 1:
                        page.fill("textarea", "How are you doing today my friend?")
                    elif step == 2:
                        page.select_option("select", "north_karnataka")
                        page.evaluate("document.querySelectorAll('button').forEach(b => { if(b.textContent.includes('Translate') || b.textContent.includes('ಅನುವಾದಿಸಿ')) b.click(); });")

                elif scene["id"] == "quiz":
                    if step == 1:
                        # Start quiz
                        page.evaluate("document.querySelectorAll('button').forEach(b => { if(b.textContent.includes('Start') || b.textContent.includes('ಆರಂಭಿಸಿ') || b.textContent.includes('North')) b.click(); });")
                    elif step == 2:
                        page.evaluate("document.querySelectorAll('button')[5]?.click();")

                elif scene["id"] == "leaderboard":
                    if step == 1:
                        page.evaluate("window.scrollBy({top: 300, behavior: 'smooth'});")

                elif scene["id"] == "museum":
                    if step == 1:
                        page.evaluate("document.querySelectorAll('.cursor-pointer')[0]?.click();")
                    elif step == 2:
                        page.evaluate("window.scrollBy({top: 250, behavior: 'smooth'});")

                elif scene["id"] == "etymology":
                    if step == 1:
                        page.fill("input", "ದಸರಾ")
                        page.evaluate("document.querySelector('form button')?.click();")

                elif scene["id"] == "contribute":
                    if step == 1:
                        page.evaluate("window.scrollBy({top: 200, behavior: 'smooth'});")

                elif scene["id"] == "admin":
                    if step == 1:
                        page.evaluate("window.scrollBy({top: 250, behavior: 'smooth'});")
                    elif step == 2:
                        # Approve first item
                        page.evaluate("document.querySelectorAll('button').forEach(b => { if(b.textContent.includes('Approve')) b.click(); });")

                elif scene["id"] == "api_docs":
                    if step == 1:
                        page.evaluate("window.scrollBy({top: 350, behavior: 'smooth'});")

                page.wait_for_timeout(300)
            except Exception as e:
                print(f"Action error in step {step}: {e}")

            # Grab screenshot buffer
            screenshot_bytes = page.screenshot()
            img_arr = np.frombuffer(screenshot_bytes, dtype=np.uint8)
            img = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)

            # Resize if needed
            if img.shape[0] != FRAME_HEIGHT or img.shape[1] != FRAME_WIDTH:
                img = cv2.resize(img, (FRAME_WIDTH, FRAME_HEIGHT))

            # Write segment frames
            frames_for_step = sub_frames_to_write // 4
            for f in range(frames_for_step):
                current_time_sec = frame_count / FPS
                hud_frame = add_hud_overlay(img, scene["title"], scene["kannada"], current_time_sec, float(TOTAL_DURATION_SEC))
                video_writer.write(hud_frame)
                frame_count += 1

    # Fill remainder up to exactly 3600 frames
    while frame_count < TOTAL_FRAMES:
        current_time_sec = frame_count / FPS
        hud_frame = add_hud_overlay(img, "Namma Kannada Showcase Complete", "ನಿಮ್ಮ ಭಾಷೆ, ನಿಮ್ಮ ಹೆಮ್ಮೆ", current_time_sec, float(TOTAL_DURATION_SEC))
        video_writer.write(hud_frame)
        frame_count += 1

    video_writer.release()
    browser.close()
    p.stop()

    elapsed = time.time() - start_time
    file_size_mb = os.path.getsize(OUTPUT_VIDEO) / (1024 * 1024)
    print(f"\n=======================================================")
    print(f" Showcase Video Generated Successfully!")
    print(f" File: {OUTPUT_VIDEO}")
    print(f" Frames: {frame_count} frames ({frame_count / FPS:.1f} seconds)")
    print(f" Size: {file_size_mb:.2f} MB")
    print(f" Processing Time: {elapsed:.1f} seconds")
    print(f"=======================================================\n")


if __name__ == "__main__":
    run_showcase()
