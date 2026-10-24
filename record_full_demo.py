"""
Namma Kannada - Comprehensive Live Interactive Tour & Video Generator
Automates a full 2-minute live walkthrough of every module on http://localhost:3000
using Playwright's native 60fps video recorder, then encodes into universal H.264 MP4.
"""

import os
import sys
import time
import subprocess
from pathlib import Path
import imageio_ffmpeg
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")

WORKSPACE = Path(r"c:\Users\Pawan\NammaKannada")
RAW_VIDEO_DIR = WORKSPACE / "raw_video"
OUTPUT_MP4 = WORKSPACE / "namma_kannada_website_working_demo.mp4"
BASE_URL = "http://localhost:3000"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

RAW_VIDEO_DIR.mkdir(parents=True, exist_ok=True)


def smooth_scroll(page, total_distance, steps=10, delay=100):
    """Smoothly scroll the page down or up."""
    step_distance = total_distance // steps
    for _ in range(steps):
        page.evaluate(f"window.scrollBy({{ top: {step_distance}, behavior: 'smooth' }});")
        page.wait_for_timeout(delay)


def run_tour():
    print("================================================================")
    print(" Starting Namma Kannada 2-Minute Live Video Tour Automation")
    print("================================================================")

    p = sync_playwright().start()
    browser = p.chromium.launch(
        executable_path=CHROME_PATH,
        headless=True,
        args=[
            "--disable-web-security",
            "--allow-file-access-from-files",
            "--no-sandbox",
            "--disable-blink-features=AutomationControlled",
        ],
    )

    context = browser.new_context(
        viewport={"width": 1280, "height": 720},
        record_video_dir=str(RAW_VIDEO_DIR),
        record_video_size={"width": 1280, "height": 720},
    )
    page = context.new_page()

    # ─────────────────────────────────────────────────────────────
    # Module 1: Landing Page & Platform Overview (0:00 - 0:15)
    # ─────────────────────────────────────────────────────────────
    print("[1/10] Recording Module 1: Home / Platform Landing Experience...")
    page.goto(BASE_URL, wait_until="networkidle")
    page.wait_for_timeout(2000)

    # Hover across dialect pills
    pills = page.locator("a[href*='/map?region=']")
    pill_count = pills.count()
    for i in range(min(pill_count, 5)):
        pills.nth(i).hover()
        page.wait_for_timeout(500)

    # Scroll through features grid and stats
    smooth_scroll(page, 700, steps=7, delay=250)
    page.wait_for_timeout(1500)
    smooth_scroll(page, 700, steps=7, delay=250)
    page.wait_for_timeout(1500)
    page.evaluate("window.scrollTo({ top: 0, behavior: 'smooth' });")
    page.wait_for_timeout(1500)

    # ─────────────────────────────────────────────────────────────
    # Module 2: Interactive Karnataka Dialect Map (0:15 - 0:35)
    # ─────────────────────────────────────────────────────────────
    print("[2/10] Recording Module 2: Interactive Dialect Map & Explorer...")
    page.goto(f"{BASE_URL}/map", wait_until="networkidle")
    page.wait_for_timeout(2500)

    # Click North Karnataka dialect button
    page.evaluate(
        """() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const nkBtn = buttons.find(b => b.textContent.includes('ಉತ್ತರ ಕರ್ನಾಟಕ') || b.textContent.includes('North Karnataka'));
        if (nkBtn) nkBtn.click();
    }"""
    )
    page.wait_for_timeout(2500)

    # Click Coastal Karnataka button
    page.evaluate(
        """() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const coastalBtn = buttons.find(b => b.textContent.includes('ಕರಾವಳಿ') || b.textContent.includes('Coastal'));
        if (coastalBtn) coastalBtn.click();
    }"""
    )
    page.wait_for_timeout(2500)

    # Click Malnad (Havyaka) button
    page.evaluate(
        """() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const malnadBtn = buttons.find(b => b.textContent.includes('ಮಲೆನಾಡು') || b.textContent.includes('Malnad'));
        if (malnadBtn) malnadBtn.click();
    }"""
    )
    page.wait_for_timeout(2500)

    # Search filter test
    search_input = page.locator("input[placeholder*='Search']")
    if search_input.count() > 0:
        search_input.fill("ಕಾಪಿ")
        page.wait_for_timeout(1500)
        search_input.fill("")
        page.wait_for_timeout(1000)

    # ─────────────────────────────────────────────────────────────
    # Module 3: Real-Time Speech-to-Text Transcriber (0:35 - 0:50)
    # ─────────────────────────────────────────────────────────────
    print("[3/10] Recording Module 3: Real-Time STT Transcriber...")
    # Click to toggle STT drawer
    page.evaluate(
        """() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const sttBtn = buttons.find(b => b.textContent.includes('Speech-to-Text') || b.textContent.includes('STT'));
        if (sttBtn) sttBtn.click();
    }"""
    )
    page.wait_for_timeout(2000)

    # Click quick try sample phrases to demonstrate real-time normalization
    page.evaluate(
        """() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const sample1 = buttons.find(b => b.textContent.includes('ಏನ ಮಾಡ್ತೀಯ'));
        if (sample1) sample1.click();
    }"""
    )
    page.wait_for_timeout(2500)

    page.evaluate(
        """() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const sample2 = buttons.find(b => b.textContent.includes('ಎಂತ ಸಂಗತಿ'));
        if (sample2) sample2.click();
    }"""
    )
    page.wait_for_timeout(2500)

    page.evaluate(
        """() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const sample3 = buttons.find(b => b.textContent.includes('ಮನೆಗೆ ಬಪ್ಪಾ'));
        if (sample3) sample3.click();
    }"""
    )
    page.wait_for_timeout(2500)

    # ─────────────────────────────────────────────────────────────
    # Module 4: Generative AI Dialect Translator (0:50 - 1:08)
    # ─────────────────────────────────────────────────────────────
    print("[4/10] Recording Module 4: Gemini Dialect Translator...")
    page.goto(f"{BASE_URL}/translate", wait_until="networkidle")
    page.wait_for_timeout(2000)

    # Type translation prompt
    textarea = page.locator("textarea")
    if textarea.count() > 0:
        textarea.fill("ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ? ಕಾಫಿ ಕುಡಿಯಲು ನಮ್ಮ ಮನೆಗೆ ಬನ್ನಿ.")
        page.wait_for_timeout(1000)

    # Select target dialect: North Karnataka
    select_dialect = page.locator("select")
    if select_dialect.count() > 0:
        select_dialect.select_option("north_karnataka")
        page.wait_for_timeout(1000)

    # Click Translate button
    page.evaluate(
        """() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const trBtn = buttons.find(b => b.textContent.includes('Translate') || b.textContent.includes('ಅನುವಾದಿಸಿ') || b.textContent.includes('Send') || b.querySelector('svg'));
        if (trBtn) trBtn.click();
    }"""
    )
    page.wait_for_timeout(3500)

    # Scroll down to dialect cards
    smooth_scroll(page, 400, steps=5, delay=200)
    page.wait_for_timeout(2000)

    # ─────────────────────────────────────────────────────────────
    # Module 5: Gamified Challenges & Badges (1:08 - 1:25)
    # ─────────────────────────────────────────────────────────────
    print("[5/10] Recording Module 5: Linguistic Challenges & Badges...")
    page.goto(f"{BASE_URL}/quiz", wait_until="networkidle")
    page.wait_for_timeout(2000)

    # Start Quiz
    page.evaluate(
        """() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const startBtn = buttons.find(b => b.textContent.includes('Start') || b.textContent.includes('ಆರಂಭಿಸಿ') || b.textContent.includes('Quiz'));
        if (startBtn) startBtn.click();
    }"""
    )
    page.wait_for_timeout(2000)

    # Answer option click
    page.evaluate(
        """() => {
        const options = Array.from(document.querySelectorAll('button, div[role="button"]'));
        const opt = options.find(o => o.textContent.includes('A') || o.textContent.includes('B') || o.textContent.includes('North') || o.textContent.includes('ಉತ್ತರ'));
        if (opt) opt.click();
    }"""
    )
    page.wait_for_timeout(3000)

    # Scroll to view badges gallery
    smooth_scroll(page, 500, steps=5, delay=200)
    page.wait_for_timeout(2500)

    # ─────────────────────────────────────────────────────────────
    # Module 6: Linguistic Scholars Leaderboard (1:25 - 1:35)
    # ─────────────────────────────────────────────────────────────
    print("[6/10] Recording Module 6: Leaderboard...")
    page.goto(f"{BASE_URL}/leaderboard", wait_until="networkidle")
    page.wait_for_timeout(2000)
    smooth_scroll(page, 350, steps=5, delay=250)
    page.wait_for_timeout(2000)

    # ─────────────────────────────────────────────────────────────
    # Module 7: WebXR 3D Cultural Artifact Museum (1:35 - 1:50)
    # ─────────────────────────────────────────────────────────────
    print("[7/10] Recording Module 7: WebXR 3D Cultural Artifact Museum...")
    page.goto(f"{BASE_URL}/museum", wait_until="networkidle")
    page.wait_for_timeout(2500)

    # Hover and click artifact card
    cards = page.locator(".cursor-pointer, [role='button']")
    if cards.count() > 0:
        cards.first.hover()
        page.wait_for_timeout(1000)
        cards.first.click()
        page.wait_for_timeout(3000)

    # Drag on 3D canvas to demonstrate OrbitControls
    canvas = page.locator("canvas")
    if canvas.count() > 0:
        box = canvas.bounding_box()
        if box:
            page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
            page.mouse.down()
            page.mouse.move(box["x"] + box["width"] / 2 + 100, box["y"] + box["height"] / 2 - 40, steps=10)
            page.mouse.up()
            page.wait_for_timeout(2000)

    # ─────────────────────────────────────────────────────────────
    # Module 8: Visual Etymology Knowledge Graph (1:50 - 2:02)
    # ─────────────────────────────────────────────────────────────
    print("[8/10] Recording Module 8: Visual Etymology Knowledge Graph...")
    page.goto(f"{BASE_URL}/etymology", wait_until="networkidle")
    page.wait_for_timeout(2500)

    # Click suggested word pill 'ದಸರಾ'
    page.evaluate(
        """() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const pill = buttons.find(b => b.textContent.includes('ದಸರಾ'));
        if (pill) pill.click();
    }"""
    )
    page.wait_for_timeout(2500)

    # ─────────────────────────────────────────────────────────────
    # Module 9: Crowdsourced Field Collection & Offline Mode (2:02 - 2:12)
    # ─────────────────────────────────────────────────────────────
    print("[9/10] Recording Module 9: Field Crowdsourcing & Audio Recording...")
    page.goto(f"{BASE_URL}/contribute", wait_until="networkidle")
    page.wait_for_timeout(2000)

    smooth_scroll(page, 350, steps=5, delay=200)
    page.wait_for_timeout(2500)

    # ─────────────────────────────────────────────────────────────
    # Module 10: Linguist Admin Moderation Portal (2:12 - 2:22)
    # ─────────────────────────────────────────────────────────────
    print("[10/10] Recording Module 10: Linguist Admin Moderation Portal...")
    page.goto(f"{BASE_URL}/admin", wait_until="networkidle")
    page.wait_for_timeout(2000)

    # Click approve button on submission to show instant live publishing toast
    page.evaluate(
        """() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const approveBtn = buttons.find(b => b.textContent.includes('Approve'));
        if (approveBtn) approveBtn.click();
    }"""
    )
    page.wait_for_timeout(3000)

    # ─────────────────────────────────────────────────────────────
    # Finish and Save Recording
    # ─────────────────────────────────────────────────────────────
    print("Tour sequence complete. Finalizing recording...")
    page.wait_for_timeout(1000)
    page.close()
    context.close()
    browser.close()
    p.stop()

    # Find the recorded WebM file
    webm_files = list(RAW_VIDEO_DIR.glob("*.webm"))
    if not webm_files:
        raise RuntimeError("No recorded WebM video found in raw_video directory!")

    raw_webm = max(webm_files, key=lambda f: f.stat().st_mtime)
    print(f"Recorded raw WebM: {raw_webm} ({raw_webm.stat().st_size / (1024*1024):.2f} MB)")

    # Transcode using bundled FFmpeg 7.1 to standard H.264 MP4
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    print(f"Encoding into universal H.264 MP4 using FFmpeg: {ffmpeg_exe}...")

    cmd = [
        ffmpeg_exe,
        "-y",
        "-i",
        str(raw_webm),
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "19",
        "-pix_fmt",
        "yuv420p",
        "-vf",
        "scale=1280:720",
        "-r",
        "30",
        str(OUTPUT_MP4),
    ]

    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        print(f"FFmpeg error: {result.stderr}")
        raise RuntimeError(f"FFmpeg transcoding failed with code {result.returncode}")

    mp4_size = OUTPUT_MP4.stat().st_size / (1024 * 1024)
    print("\n================================================================")
    print(f" Website Working Video Successfully Created!")
    print(f" File: {OUTPUT_MP4}")
    print(f" File Size: {mp4_size:.2f} MB")
    print(" Format: Universal H.264 MP4 (Plays in any browser & media player)")
    print("================================================================\n")


if __name__ == "__main__":
    run_tour()
