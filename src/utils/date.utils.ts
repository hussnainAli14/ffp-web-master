// Helper function to pad single-digit numbers with a leading zero
const padWithZero = (num: number): string => {
  return num < 10 ? `0${num}` : `${num}`;
};

export const formatTime12Hrs = (input?: string | null): string => {
  // Check if input not empty
  if (!input) {
    throw new Error('Time cannot be undefined, null, or empty string');
  }

  // Regular expression to match both HH:mm:ss and HH:mm formats
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])(:([0-5]?[0-9]))?$/;

  // Test if input matches the regex
  const match = input.match(timeRegex);
  if (!match) {
    throw new Error('Invalid time format. Use HH:mm or HH:mm:ss.');
  }

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  // const seconds = match[4] || '00'; // Default seconds to '00' if not provided

  // Determine AM/PM and convert to 12-hour format
  const period = hours < 12 ? 'AM' : 'PM';
  hours = hours % 12 || 12; // Convert hours to 12-hour format

  // Return formatted time as HH:mm AM/PM
  return `${padWithZero(hours)}:${minutes} ${period}`;
};

// Utils to map day names to number codes and vice versa
const dayToNumberMap: { [key: string]: number } = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const numberToDayMap: { [key: number]: string } = Object.entries(dayToNumberMap).reduce(
  (acc, [day, number]) => {
    acc[number] = day;
    return acc;
  },
  {} as { [key: number]: string }
);

export function dayToNumber(day: string): number {
  return dayToNumberMap[day.toLowerCase()] ?? -1; // Returns -1 for invalid days
}

export function numberToDay(number: number): string {
  return numberToDayMap[number] ?? ''; // Returns an empty string for invalid numbers
}
