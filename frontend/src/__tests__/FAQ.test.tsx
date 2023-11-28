import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FAQPage from "../pages/FAQ";

it("expands and shows the answer when a question is clicked", async () => {
  render(<FAQPage />);

  const questionToClick = screen.getByText("Where can I view the menu?");
  const correspondingAnswer =
    'You can easily view our menu by clicking on the Green "Order Now" button located at the top right of your screen.';

  // Ensure that the answer is initially not visible
  expect(screen.queryByText(correspondingAnswer)).toBeNull();

  // Click on the question
  await userEvent.click(questionToClick);

  // The answer should now be visible
  expect(screen.getByText(correspondingAnswer)).toBeInTheDocument();
});
