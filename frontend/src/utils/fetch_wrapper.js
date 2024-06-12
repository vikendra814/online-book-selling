import Cookies from "js-cookie";

export const fetchWrapper = {
  get,
  post,
  put,
  delete: _delete,
};

function get(url) {
  const requestOptions = {
    method: "GET",
    body: JSON.stringify({}),
    headers: { "Content-Type": "application/json" },
  };

  return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
  const token = Cookies.get("token") || "";
  const requestOptions = {
    method: "POST",
    headers: {token: `${token}` },
    body: body instanceof FormData ? body : JSON.stringify(body),
  };

  if (!(body instanceof FormData)) {
    requestOptions.headers["Content-Type"] = "application/json";
  } 
 

  return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch(url, requestOptions).then(handleResponse);
}

function _delete(url, body) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return fetch(url, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  return response.json().then((res) => {
    if (res.code === 0) {
      const error = res.message || "Some error occured please try again";
      return Promise.reject(error);
    }
    return res;
  });
}
