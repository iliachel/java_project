from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:8081")

        # Login
        page.fill("#username", "admin")
        page.fill("#password", "admin")
        page.click("#login-btn")

        # Wait for the todo container to be visible
        page.wait_for_selector("#todo-container", state="visible")

        # Add a new todo
        page.fill("#new-todo", "My first todo")
        page.click("#add-btn")

        # Wait for the new todo to appear in the list
        page.wait_for_selector("li:has-text('My first todo')")

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)