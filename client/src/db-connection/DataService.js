import http from "./PathConnect";

const get = (path) => {
  return http.get(`/${path}`);
};
const getFriendProfile = (path) => {
  return http.get(`users${path}`);
};

const getAuth = (path, token) => {
  return http.get(`/${path}`, {
    headers: { Authorization: "Bearer " + token },
  });
};

const postAuth = (path, token) => {
  return http.post(`/${path}`, {
    headers: { Authorization: "Bearer " + token },
  });
};



//create or update new sheet
const create = (path, data) => {
  return http.post(`/${path}`, data);
};

const createAuth = (path, data, token) => {
  return http.post(`/${path}/cover`, data, {
    headers: {
       Authorization: "Bearer " + token,
       "Content-Type": "multipart/form-data",
      },
  });
};
const createAuthP = (path, data, token) => {
  return http.post(`/${path}/avatar`, data, {
    headers: {
       Authorization: "Bearer " + token,
       "Content-Type": "multipart/form-data",
      },
  });
};

const update = (id, data) => {
  return http.put(`${id}`, data);
};

const patch = (id, data) => {
  return http.patch(`/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/${id}`);
};

export default {
  getAuth,
  get,
  create,
  update,
  remove,
  patch,
  createAuth,
  createAuthP,
  getFriendProfile,
  postAuth,
}
