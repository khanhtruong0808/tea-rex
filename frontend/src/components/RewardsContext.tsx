import React, { createContext, useContext, useState, ReactNode } from "react";
import { config } from "../config";

interface RewardsContextProps {
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  spentPoints: number;
  setSpentPoints: React.Dispatch<React.SetStateAction<number>>;
  setTotalBeverageAmount: React.Dispatch<React.SetStateAction<number>>;
  totalBeverageAmount: number;
  handleAddPoints: (addPoints: number) => Promise<void>;
  handleRevertPendingPoints: () => Promise<boolean>;
  setContextPhoneNumber: (phoneNumber: string) => void;
  setContextPoints: (points: number) => void;
}

export const RewardsContext = createContext<RewardsContextProps | undefined>(
  undefined
);

export const RewardsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [points, setPoints] = useState(0);
  const [spentPoints, setSpentPoints] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [totalBeverageAmount, setTotalBeverageAmount] = useState(0);

  function setContextPhoneNumber(phoneNumber: string) {
    setPhoneNumber(phoneNumber);
  }

  function setContextPoints(points: number) {
    setPoints(points);
  }

  async function handleRevertPendingPoints(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await fetch(
          config.baseApiUrl + "/rewards-member-revert-pending",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phoneNumber }),
          }
        );

        const data = await response.json();
        if (data && data.points) {
          setPoints(data.points);
          setSpentPoints(0);
          setPhoneNumber("");
          resolve(true);
        } else {
          console.error("Failed to revert pending points!");
          resolve(false);
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error(`Error while reverting pending points: ${errorMessage}`);
        reject(error);
      }
    });
  }

  async function handleAddPoints(subtotal: number) {
    let addPoints = Math.round(subtotal);
    let newPoints = points + addPoints; // updating points with the 10% value
    console.log(newPoints);
    try {
      let response = await fetch(config.baseApiUrl + "/rewards-member-update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, newPoints }),
      });

      const data = await response.json();

      if (data) {
        setPoints(data.points);
        setSpentPoints(0);
      } else {
        console.error("No data!");
        return;
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(`Failed to add free points!: ${errorMessage}`);
    }
  }

  return (
    <RewardsContext.Provider
      value={{
        points,
        setPoints,
        spentPoints,
        setSpentPoints,
        setTotalBeverageAmount,
        totalBeverageAmount,
        handleAddPoints,
        handleRevertPendingPoints,
        setContextPhoneNumber,
        setContextPoints,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
};

const useRewards = () => {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error("useRewards must be used within a RewardsProvider");
  }
  return context;
};

export default useRewards;
