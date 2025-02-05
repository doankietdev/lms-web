import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export const formatCash = (number) => {
  if (number === null || number === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    currencyDisplay: 'symbol'
  }).format(number);
};
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

let getAccessTokenSilentlyFn
export const injectGetAccessTokenSilently = getAccessTokenSilently => {
  getAccessTokenSilentlyFn = getAccessTokenSilently
}

/**
 * @returns {Promise<string>}
 */
export const getAccessTokenSilently = async () => {
  return await getAccessTokenSilentlyFn()
}
