#!/usr/bin/env python3
"""Capture screenshots of the Cash Flow Visionaries site"""

import subprocess
import time
import sys

def capture_screenshot(url, output_file, width=1440, height=900):
    """Capture screenshot using chromium headless"""
    cmd = [
        'chromium',
        '--headless',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        f'--screenshot={output_file}',
        f'--window-size={width},{height}',
        '--hide-scrollbars',
        '--virtual-time-budget=3000',
        url
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
        if result.returncode == 0:
            print(f"✅ Screenshot saved: {output_file}")
            return True
        else:
            print(f"❌ Error: {result.stderr}")
            return False
    except subprocess.TimeoutExpired:
        print(f"⏱️  Timeout capturing {output_file}")
        return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def main():
    print("📸 Capturing Cash Flow Visionaries screenshots...\n")
    
    base_url = "http://localhost:8888/index.html"
    output_dir = "/root/.openclaw/media"
    
    # Desktop view
    print("1. Capturing desktop view (1440x900)...")
    capture_screenshot(
        base_url,
        f"{output_dir}/cashflow-desktop.png",
        width=1440,
        height=900
    )
    
    time.sleep(1)
    
    # Full page view
    print("\n2. Capturing full page (1440x7200)...")
    capture_screenshot(
        base_url,
        f"{output_dir}/cashflow-fullpage.png",
        width=1440,
        height=7200
    )
    
    time.sleep(1)
    
    # Mobile view
    print("\n3. Capturing mobile view (375x812)...")
    capture_screenshot(
        base_url,
        f"{output_dir}/cashflow-mobile.png",
        width=375,
        height=812
    )
    
    print("\n✨ Screenshot capture complete!")
    print(f"\nFiles saved in: {output_dir}/")
    print("  - cashflow-desktop.png (desktop hero)")
    print("  - cashflow-fullpage.png (full page)")
    print("  - cashflow-mobile.png (mobile view)")

if __name__ == "__main__":
    main()
