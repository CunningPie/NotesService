const apiPoints = {
  createPoint: (url, data) => {
    const options = {
      method: 'POST',
      // mode: "cors",
      // cache: "no-cache",
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      // redirect: "follow",
      // referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    };
    return fetch(`${url}/api/Points`, options);
  },

  deletePoint: (url, data) => {
    const options = {
      method: 'DELETE',
      // mode: "cors",
      // cache: "no-cache",
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      // redirect: "follow",
      // referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    };

    return fetch(`${url}/api/Points/${data.id}`, options);
  },

  updatePoint: (url, data) => {
    const options = {
      method: 'PUT',
      // mode: "cors",
      // cache: "no-cache",
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      // redirect: "follow",
      // referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    };

    return fetch(`${url}/api/Points/${data.id}`, options);
  },
};

const apiComments = {
  createComment: (url, data) => {
    const options = {
      method: 'POST',
      // mode: "cors",
      // cache: "no-cache",
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      // redirect: "follow",
      // referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    };
    return fetch(`${url}/api/Comments`, options);
  },

  deleteComment: (url, data) => {
    const options = {
      method: 'DELETE',
      // mode: "cors",
      // cache: "no-cache",
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      // redirect: "follow",
      // referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    };

    return fetch(`${url}/api/Comments/${data.id}`, options);
  },

  updateComment: (url, data) => {
    const options = {
      method: 'PUT',
      // mode: "cors",
      // cache: "no-cache",
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      // redirect: "follow",
      // referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    };

    return fetch(`${url}/api/Comments/${data.id}`, options);
  },
};

export {
  apiPoints,
  apiComments,
};
