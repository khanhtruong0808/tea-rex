import React, { useState } from "react";
import LogoutHandler from "../components/LogoutButton"
import adminModeStore from "../utils/adminModeStore";

const FAQPage = () => {
  const [isAdmin] = adminModeStore((state) => [state.isAdmin]);
  const faqData = [
    {
      question: "Where can I view the menu?",
      answer:
        'You can easily view our menu by clicking on the Green "Order Now" button located at the top right of your screen.',
    },
    {
      question: "Is it true that sauces are unlimited?",
      answer:
        "Absolutely! Enjoy as many sauces as you like, but remember, each extra sauce incurs a small charge of $0.50.",
    },
    {
      question: "What can I do if I am allergic to certain food items?",
      answer:
        'If you have allergies or any other specific preferences, simply let us know in the "Special Instructions" text box during your order.',
    },
    {
      question: "What are your business hours?",
      answer:
        "We're open every day of the week from 11:00 A.M. to 8:00 P.M., including weekends.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept payments securely through Stripe, making it convenient for you.",
    },
    {
      question: "Is there a rewards system?",
      answer:
        "Yes! Our rewards program allows you to earn points with every order. These points can lead to a free drink valued at up to $8. If you ever fancy a drink that's a bit pricier, you can apply your points to lower the cost. Joining the fun is easy – simply sign up and redeem your points during checkout. It's our way of saying thanks for being a part of our tea-loving community!",
    },
    {
      question: "How can I keep in touch via social media?",
      answer:
        "Stay connected with us through our social media channels! You'll find all the links in the footer below each page.",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState<number[]>([]);

  const handleQuestionClick = (index: number) => {
    setExpandedIndex((prevIndexes) =>
      prevIndexes.includes(index)
        ? prevIndexes.filter((item) => item !== index)
        : [...prevIndexes, index],
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="font-menu mb-6 border-b-2 border-black pb-4 text-center text-6xl font-extrabold">
        Frequently Asked Questions
      </h1>
      <div className="space-y-6">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="rounded-lg bg-gradient-to-r from-orange-400 to-green-400 p-6 shadow-lg"
          >
            {" "}
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => handleQuestionClick(index)}
            >
              <h2 className="mb-2 border-b border-black text-xl font-bold">
                {item.question}
              </h2>
              <div className="text-black-500">
                {expandedIndex.includes(index) ? "▲" : "▼"}
              </div>
            </div>
            {expandedIndex.includes(index) && <p>{item.answer}</p>}
          </div>
        ))}
      </div>
      <div>
        {isAdmin && (
          <LogoutHandler />
        )}
      </div>
    </div>
  );
};

export default FAQPage;
