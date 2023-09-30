import React, { useState, useEffect } from "react";
import { config } from "../../config";
import { useShoppingCart } from "../ShoppingCartContext";

/*  
	NOTES: ---------------------------------------------------------------
	test phone numbers: 44444444444444444
                      	444444444
	phoneNumber = cleanPhoneNumber(phoneNumber); must be added before grabbing a phone number from the database. 
	Phone numbers are stored as 4444444444, not (444) 444-4444
	-----------------------------------------------------------------------
*/

interface RewardsSystemProps {
    subtotal: number;
	total: number;
	currDiscount: number;
    updateDiscount: (newDiscount: number) => void;
	setIsRewardsMember: React.Dispatch<React.SetStateAction<boolean>>;
	setRewardsMemberPhoneNumber: (rewardsMemberPhoneNumber: string) => void;
}
const RewardsSystem = ({subtotal, total, currDiscount, updateDiscount, setIsRewardsMember, setRewardsMemberPhoneNumber}: RewardsSystemProps) => {
	const { getCartItems } = useShoppingCart();
    const [isShowingRewardsInfo, setIsShowingRewardsInfo] = useState(false);
    const [points, setPoints] = useState(0);
	const [spendingPoints, setSpendingPoints] = useState(10); //default spend points is 10
	const [spentPoints, setSpentPoints] = useState(0);
	const [addPoints, setAddPoints] = useState(10); //default add points is 10 DELETE THIS LATER BEFORE FINAL DEPLOYMENT!!!!
	let [phoneNumber, setPhoneNumber] = useState("");
	const cart = getCartItems();

    const formatPhoneNumber = (input: string) => {
        let cleaned = ('' + input).replace(/\D/g, '');
        if (cleaned.length == 0) {
			return '';
		} else if (cleaned.length <= 3) {
            return '(' + cleaned;
        } else if (cleaned.length <= 6) {
            return '(' + cleaned.slice(0, 3) + ') ' + cleaned.slice(3);
        } else {
            return '(' + cleaned.slice(0, 3) + ') ' + cleaned.slice(3, 6) + '-' + cleaned.slice(6, 10);
        }
    };

    const handlePhoneChange = (e: { target: { value: string; }; }) => {
        if (e.target.value.replace(/\D/g, '').length <= 10) {
            setPhoneNumber(formatPhoneNumber(e.target.value));
        }
    };

	const cleanPhoneNumber = (input:string) => {
		return ('' + input).replace(/\D/g, '');
	};

	const applyBeverageDiscount = (points:number) => {
		const totalBeverageDiscount = cart.reduce((acc: number, item) => {
			if (item.item.menuType == "beverage") {
				const beverageDiscount = item.item.price * (Math.min(points, 100) / 100);
				return acc + beverageDiscount;
			}
			return acc;
		}, 0);
		return totalBeverageDiscount;
	}

	//This function only triggers when the user does a reload or exits the window, not when the user clicks on a new tab on the website.
    useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (spentPoints > 0) {
				event.preventDefault();
				event.returnValue = "You have spent points, are you sure you want to leave?";
				handleRevertPendingPoints();  
			} else {
				console.log("spentPoints: " + spentPoints);
			}
		};
	
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [spentPoints]);

	const handleRevertPendingPoints = async () => {
		phoneNumber = cleanPhoneNumber(phoneNumber);
	
		try {
			let response = await fetch(config.baseApiUrl + "/rewards-member-revert-pending", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ phoneNumber })
			});
	
			const data = await response.json();
			if (data && data.points) {
				setPoints(data.points);
				setSpentPoints(0);
				updateDiscount(0);
			} else {
				console.error("Failed to revert pending points!");
			}
		} catch (error) {
			const errorMessage = (error as Error).message;
			console.error(`Error while reverting pending points: ${errorMessage}`);
		}
	};

	const handleAddPoints = async () => {
		phoneNumber = cleanPhoneNumber(phoneNumber);
		let newPoints = points! + addPoints; //change add points to be a percentage of the subTotal
		try {
			let response = await fetch(config.baseApiUrl + "/rewards-member-update", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ phoneNumber, newPoints })
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
			console.log(`Failed to add free points!: ${errorMessage}`);
		}
	}

	const handleSpendPoints = async () => {
		if (subtotal === currDiscount) {
			console.log("You are already getting food for free!!");
			return;
		}
	
		if (points === 0) {
			console.log("Not enough points!");
			return;
		}
	
		phoneNumber = cleanPhoneNumber(phoneNumber);
	
		try {
			let response = await fetch(config.baseApiUrl + "/rewards-member-pend-spend", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ phoneNumber, spendingPoints })
			});
	
			const data = await response.json();
	
			if (data) {
				if (data.points !== undefined && data.pendingPoints !== undefined) {
					setPoints(data.points);
					setSpentPoints(data.pendingPoints);
					
					console.log(`Points left: ${data.points}, Pending points: ${data.pendingPoints}`);
	
					const potentialDiscount = applyBeverageDiscount(data.pendingPoints);
					if (potentialDiscount >= subtotal) {
						updateDiscount(subtotal);
					} else {
						updateDiscount(potentialDiscount);
					}
	
					if (total - potentialDiscount > 0) {
						console.log(`You are potentially saving $${potentialDiscount}!`);
					}
				} else {
					console.error("Response did not contain points or pendingPoints information.");
					return;
				}
			} else {
				console.error("No data received from the server!");
				return;
			}
		} catch (error) {
			const errorMessage = (error as Error).message;
			console.error(`Failed to pend points for spending: ${errorMessage}`);
		}
	}
	
    const handleSubmit = async () => {
    	if(!phoneNumber) {
        	console.error("Phone number is empty or undefined");
        	return;
      	}

		phoneNumber = cleanPhoneNumber(phoneNumber);

      	try {
        	let response = await fetch(config.baseApiUrl + "/rewards-member-check", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ phoneNumber })
          	});
  
          	let data = await response.json();
  
          	if (data && data.exists) {
				setPoints(data.points);
				setIsShowingRewardsInfo(true);
				setIsRewardsMember(true);
				setRewardsMemberPhoneNumber(data.phoneNumber);
				console.log(`Phone Number: ${data.phoneNumber}, Points: ${data.points}`);

				if (!response.ok) {
					throw new Error("Failed to increment points");
				}

          } else {
				response = await fetch(config.baseApiUrl + "/rewards-member-add", 
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ phoneNumber, points: 0 })
				});
	
				if (!response.ok) {
					throw new Error("Failed to create new member");
				}
				setPoints(0);
				setIsShowingRewardsInfo(true);
				console.log("New member created!");
          }
  
      } catch (error) {
			const errorMessage = (error as Error).message;
			console.log(`Error: ${errorMessage}`);
      }
  }

    return (
        <div className="border border-gray-300 p-4 rounded-md">
			<label className="block text-sm font-medium text-gray-600 mb-2">
				Sign up for our rewards system, or if you already have your phone with us, input your phone number to gain points on your order!
			</label>
			<input type="text" className="p-2 border border-gray-200 rounded w-full" placeholder="(111) 111-1111" value={phoneNumber}onChange={handlePhoneChange} 
			/>
			<button onClick={handleSubmit} className="mt-2 px-4 py-2 bg-lime-700 text-white font-semibold rounded hover:scale-110 transition lg:block">
				Submit
			</button>

			{isShowingRewardsInfo && (
				<div className="mt-4">
					Points: {points}
						<div>
						Spend points! Discount only applies to beverages!
							<button onClick={handleSpendPoints} className="mt-2 px-4 py-2 bg-lime-700 text-white font-semibold rounded hover:scale-110 transition lg:block">
							Spend points
							</button>
							<button onClick={handleAddPoints} className="mt-2 px-4 py-2 bg-lime-700 text-white font-semibold rounded hover:scale-110 transition lg:block">
							Add points THIS IS A TESTING BUTTON DELETE LATER!!!!
							</button>
						</div>
				</div>
			)}
        </div>
      );
    };
    
export default RewardsSystem;