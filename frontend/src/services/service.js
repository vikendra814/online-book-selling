import { fetchWrapper } from "../utils/fetch_wrapper";

export  function bookListing(body) {
  return fetchWrapper.post(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}book-listing`,
    body
  );
}
export  function deletebook(body) {
  return fetchWrapper.post(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}delete-book`,
    body
  );
}



export function login(body) {
  return fetchWrapper.post(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_AUTH}login`,
    body
  );
}

export function addBook(body) {
  return fetchWrapper.post(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}add-book`,
    body
  );
}

export function signup(body) {
  return fetchWrapper.post(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_AUTH}signup`,
    body
  );
}


//userside
export  function allBookListing(body) {
  return fetchWrapper.post(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}all-book-listing`,
    body
  );
}

export  function placeOrder(body) {
  return fetchWrapper.post(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}place-order`,
    body
  );
}

export function getCartDetails(body) {
  return fetchWrapper.post(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}listing-cart`,
    body
  );
}

export function addToCart(body) {
  return fetchWrapper.post(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}add-to-cart`,
    body
  );
}


export  function orderHistory(body) {
  return fetchWrapper.post(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}order-details`,
    body
  );
}

export  function orderListing(body) {
  return fetchWrapper.post(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}order-listing`,
    body
  );
}
export  function updateStatus(body) {
  return fetchWrapper.post(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}update-status`,
    body
  );
}