import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

it("navbar links direct user to the correct page", async () => {
  render(<App />);
  const user = userEvent.setup();

  const homePage = screen.getByText("Home");
  await user.click(homePage);
  expect(window.location.pathname).toBe("/");

  const galleryPage = screen.getByText("Gallery");
  await user.click(galleryPage);
  expect(window.location.pathname).toBe("/gallery");

  const contactPage = screen.getByText("Contact Us");
  await user.click(contactPage);
  expect(window.location.pathname).toBe("/contact");

  const faqPage = screen.getByText("FAQ");
  await user.click(faqPage);
  expect(window.location.pathname).toBe("/faq");

  const menuPage = screen.getByText("ORDER NOW");
  await user.click(menuPage);
  expect(window.location.pathname).toBe("/menu");
});
