import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        try:
            await page.goto("http://localhost:8080")

            # Login
            await page.get_by_placeholder("Username").fill("user")
            await page.get_by_placeholder("Password").fill("password")
            await page.get_by_role("button", name="Login").click()

            # Wait for the todo container to be visible
            await expect(page.locator("#todo-container")).to_be_visible()

            # Add a new todo
            await page.get_by_placeholder("New todo").fill("My new todo with checkbox")
            await page.get_by_role("button", name="Add").click()

            # Verify the new todo is in the list and has a checkbox
            new_todo_li = page.locator('li:has-text("My new todo with checkbox")')
            await expect(new_todo_li).to_be_visible()

            checkbox = new_todo_li.locator('input[type="checkbox"]')
            await expect(checkbox).to_be_visible()
            await expect(checkbox).not_to_be_checked()

            # Click the checkbox and verify the change
            await checkbox.check()
            await expect(new_todo_li.locator("span")).to_have_css("text-decoration-line", "line-through")
            await expect(checkbox).to_be_checked()

            # Take a screenshot for verification
            await page.screenshot(path="jules-scratch/verification/verification.png")

            print("Verification script completed successfully. Screenshot saved.")

        except Exception as e:
            print(f"An error occurred: {e}")
            print("Please ensure the application server is running on http://localhost:8080 before executing this script.")

        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())