/**
 * 🚂 IRCTC Train Ticket Booking - async/await
 *
 * IRCTC pe train ticket book karna India ka sabse mushkil kaam hai! Lekin
 * async/await se yeh kaam asan ho jaata hai. Simulate karo API calls ko
 * async functions se — seat check karo, ticket book karo, cancel karo,
 * aur status check karo. Sab kuch await se sequentially hoga.
 *
 * Function: checkSeatAvailability(trainNumber, date, classType)
 *   - async function, returns a Promise
 *   - Simulates API call with a small delay (~100ms)
 *   - Validates trainNumber: must be a string of exactly 5 digits (e.g., "12345")
 *   - Validates classType: must be one of "SL", "3A", "2A", "1A"
 *   - Validates date: must be a non-empty string
 *   - If invalid trainNumber: throws Error "Invalid train number! 5 digit hona chahiye."
 *   - If invalid classType: throws Error "Invalid class type!"
 *   - If invalid date: throws Error "Date required hai!"
 *   - If valid: returns {
 *       trainNumber, date, classType,
 *       available: true/false (randomly, ~70% chance true),
 *       seats: random number 0-50,
 *       waitlist: random number 0-20
 *     }
 *   - If seats > 0, available = true; if seats === 0, available = false
 *
 * Function: bookTicket(passenger, trainNumber, date, classType)
 *   - async function
 *   - passenger is { name, age, gender } object
 *   - Validates passenger has name, age, gender
 *   - Awaits checkSeatAvailability(trainNumber, date, classType)
 *   - If available: returns {
 *       pnr: "PNR" + Math.floor(Math.random() * 1000000),
 *       passenger, trainNumber, date,
 *       class: classType,
 *       status: "confirmed",
 *       fare: calculated (SL:250, 3A:800, 2A:1200, 1A:2000)
 *     }
 *   - If not available: returns with status: "waitlisted", waitlistNumber: random 1-20
 *
 * Function: cancelTicket(pnr)
 *   - async function
 *   - Simulates cancellation with small delay
 *   - Validates pnr: must be a non-empty string starting with "PNR"
 *   - If invalid: throws Error "Invalid PNR number!"
 *   - Returns { pnr, status: "cancelled", refund: random amount 100-1000 }
 *
 * Function: getBookingStatus(pnr)
 *   - async function
 *   - Simulates status check with small delay
 *   - Validates pnr: must start with "PNR"
 *   - If invalid: throws Error "Invalid PNR number!"
 *   - Returns { pnr, status: random from ["confirmed", "waitlisted", "cancelled"],
 *     lastUpdated: new Date().toISOString() }
 *
 * Function: bookMultipleTickets(passengers, trainNumber, date, classType)
 *   - async function
 *   - Takes array of passenger objects
 *   - Books for EACH passenger SEQUENTIALLY (await in loop, one by one)
 *   - Returns array of booking results (each is bookTicket result or error object)
 *   - If individual booking fails, catch error and include { passenger, error: message }
 *     in results, continue with next passenger
 *   - Agar passengers array empty, return empty array
 *
 * Function: raceBooking(trainNumbers, passenger, date, classType)
 *   - async function
 *   - Takes array of trainNumbers
 *   - Tries booking on ALL trains in PARALLEL
 *   - Returns first successful booking using Promise.any-like approach
 *   - If all fail, throws Error "Koi bhi train mein seat nahi mili!"
 *   - Hint: use Promise.any or map trainNumbers to bookTicket promises
 *
 * Rules:
 *   - ALL functions must be async
 *   - Use await for sequential operations
 *   - bookMultipleTickets must be sequential (one after another)
 *   - raceBooking must be parallel (all at once)
 *   - Proper error handling with try/catch
 *   - Train number format: exactly 5 digit string
 *   - PNR format: starts with "PNR"
 *
 * @example
 *   const availability = await checkSeatAvailability("12345", "2025-01-15", "3A");
 *   // => { trainNumber: "12345", date: "2025-01-15", classType: "3A",
 *   //      available: true, seats: 35, waitlist: 5 }
 *
 * @example
 *   const booking = await bookTicket(
 *     { name: "Rahul", age: 28, gender: "M" },
 *     "12345", "2025-01-15", "3A"
 *   );
 *   // => { pnr: "PNR483921", passenger: {...}, trainNumber: "12345",
 *   //      date: "2025-01-15", class: "3A", status: "confirmed", fare: 800 }
 *
 * @example
 *   const results = await bookMultipleTickets(
 *     [{ name: "Amit", age: 30, gender: "M" }, { name: "Priya", age: 25, gender: "F" }],
 *     "12345", "2025-01-15", "SL"
 *   );
 *   // => [{ pnr: "PNR...", ...}, { pnr: "PNR...", ...}]
 */

const validClassType = new Set(["SL", "3A", "2A", "1A"]);
function helper(trainNumber) {
  if (typeof trainNumber !== "string") return false;
  if (trainNumber.length < 5 || trainNumber.length > 5) return false;
  return true;
}

export async function checkSeatAvailability(trainNumber, date, classType) {
  if (!helper(trainNumber)) {
    throw new Error("Invalid train number! 5 digit hona chahiye.");
  }

  if (!validClassType.has(classType)) {
    throw new Error("Invalid class type!");
  }

  if (!date || date.trim() === "") {
    throw new Error("Date required hai!");
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const seats = Math.floor(Math.random() * 51);
      const waitlist = Math.floor(Math.random() * 21);

      const available = seats > 0;

      resolve({
        trainNumber,
        date,
        classType,
        available,
        seats,
        waitlist,
      });
    }, 100);
  });
}

export async function bookTicket(passenger, trainNumber, date, classType) {
  try {
    const response = await checkSeatAvailability(trainNumber, date, classType);
    const prices = new Map([
      ["SL", 250],
      ["3A", 800],
      ["2A", 1200],
      ["1A", 2000],
    ]);
    if (response.available) {
      return {
        pnr: "PNR" + Math.floor(Math.random() * 1000000),
        passenger,
        trainNumber,
        date,
        class: classType,
        status: "confirmed",
        fare: prices.get(classType),
      };
    } else {
      return {
        status: "waitlisted",
        waitlistNumber: response.waitlist,
      };
    }
  } catch (error) {
    return { status: "failed", message: error.message };
  }
}

export async function cancelTicket(pnr) {
  if (typeof pnr !== "string" || !/^PNR\d{6}$/.test(pnr)) {
    throw new Error("Invalid PNR number!");
  }

  return new Promise((res) => {
    setTimeout(() => {
      res({
        pnr,
        status: "cancelled",
        refund: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
      });
    }, 50);
  });
}

export async function getBookingStatus(pnr) {
  if (typeof pnr !== "string" || !/^PNR\d{6}$/.test(pnr)) {
    throw new Error("Invalid PNR number!");
  }

  const index = Math.floor(Math.random() * 3);
  const arr = ["confirmed", "waitlisted", "cancelled"];
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({
        pnr,
        status: arr[index],
        lastUpdated: new Date().toISOString(),
      });
    }, 50);
  });
}

export async function bookMultipleTickets(
  passengers,
  trainNumber,
  date,
  classType,
) {
  if (!Array.isArray(passengers) || passengers.length === 0) return [];

  let results = [];

  for (const passenger of passengers) {
    try {
      const bookingResult = await bookTicket(
        passenger,
        trainNumber,
        date,
        classType,
      );

      if (bookingResult && bookingResult.status === "failed") {
        results.push({
          passenger,
          error: bookingResult.error || "Booking failed",
        });
      } else {
        results.push(bookingResult);
      }
    } catch (error) {
      results.push({
        passenger,
        error: error.message,
      });
    }
  }

  return results;
}

export async function raceBooking(trainNumbers, passenger, date, classType) {
  const promises = trainNumbers.map((trainNumber) =>
    bookTicket(passenger, trainNumber, date, classType),
  );

  try {
    return await Promise.any(promises);
  } catch (error) {
    throw new Error("Koi bhi train mein seat nahi mili!");
  }
}
