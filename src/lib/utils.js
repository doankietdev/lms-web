import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import {  } from 'react-router-dom'

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

let loginWithRedirectFn
export const injectLoginWithRedirect = loginWithRedirect => {
  loginWithRedirectFn = loginWithRedirect
}
/**
 * 
 * @param {import('@auth0/auth0-react').RedirectLoginOptions<import('@auth0/auth0-react').AppState>} options 
 */
export const loginWithRedirect = async (options) => {
  loginWithRedirectFn(options)
}

let navigateFn
export const injectNavigate = navigate => {
  navigateFn = navigate
}
/**
 * @param {import('react-router-dom').To} to 
 * @param {import('react-router-dom').NavigateOptions} options 
 */
export const navigate = (to, options) => {
  navigateFn(to, options)
}
