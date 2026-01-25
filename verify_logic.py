from playwright.sync_api import sync_playwright
import time

def run():
    print("Starting E2E Logic Verification...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
        
        try:
            # 1. Navigate
            print("Navigating to http://127.0.0.1:3000...")
            page.goto("http://127.0.0.1:3000", timeout=60000)
            
            # 2. Check Title
            print("Checking Title...")
            title = page.title()
            print(f"Page Title: {title}")
            assert "운세 AI" in title or "Anti-Gravity" in title
            
            # 3. Fill Form
            print("Filling Form...")
            # We assume inputs have no specific ID but are in grid order or named.
            # Based on page.tsx: inputs are by order.
            # Name, Year, Month, Day, Hour
            inputs = page.locator("input")
            inputs.nth(0).fill("TestUser")
            inputs.nth(1).fill("2024")
            inputs.nth(2).fill("1")
            inputs.nth(3).fill("1")
            inputs.nth(4).fill("12")
            
            # 4. Submit
            print("Submitting Ritual...")
            page.get_by_text("INITIATE RITUAL").click()
            
            # 5. Wait for Loading (RitualLoader)
            print("Waiting for Ritual Animation...")
            # Wait for loader to appear
            try:
                page.wait_for_selector("text=CALCULATING CELESTIAL COORDINATES", timeout=2000)
                print("Ritual Animation Detected.")
            except:
                print("Ritual Animation skipped or too fast.")

            # 6. Wait for Result
            print("Waiting for Result (Max 60s)...")
            # Backend might take time if LLM is cold.
            # Look for "FOUR PILLARS"
            page.wait_for_selector("text=FOUR PILLARS", timeout=60000)
            
            # 7. Extract Data
            year_pillar = page.get_by_text("Year Pillar").locator("..").text_content() # Approximate selector need refinement
            # Actually layout is:
            # DIV (text: YEAR) -> Next DIV (text: Pillar)
            # visual check:
            pillars = page.locator(".text-3xl.font-serif.font-bold").all_text_contents()
            print(f"Detected Pillars: {pillars}")
            
            analysis = page.locator("div.text-sm.text-gray-400.text-center").text_content()
            print(f"Analysis Preview: {analysis[:100]}...")
            
            print(f"✅ VERIFICATION PASSED: Logic flow is functional. Taking screenshot...")
            page.screenshot(path="ui_design_v4_toss.png")
            
        except Exception as e:
            print(f"❌ VERIFICATION FAILED: {e}")
            page.screenshot(path="verification_failure.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
