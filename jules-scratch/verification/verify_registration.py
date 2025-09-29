from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Go to the login page
    page.goto("http://localhost:8081/")

    # Click the link to show the registration form
    page.get_by_role("link", name="Register here").click()

    # Expect the registration form to be visible
    expect(page.locator("#registration-container")).to_be_visible()

    # Take a screenshot of the registration form
    page.screenshot(path="jules-scratch/verification/registration_form.png")

    # Fill out the registration form
    page.get_by_placeholder("Username").nth(1).fill("testuser")
    page.get_by_placeholder("Password").nth(1).fill("password")
    page.get_by_placeholder("Confirm Password").fill("password")

    # Handle the alert dialog
    page.once("dialog", lambda dialog: dialog.dismiss())

    # Click the register button
    page.get_by_role("button", name="Register").click()

    # Wait for the login container to be visible after registration
    expect(page.locator("#login-container")).to_be_visible()

    # Take a screenshot of the login page after registration
    page.screenshot(path="jules-scratch/verification/registration_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)