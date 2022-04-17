import axios from "axios";

// export default axios.create({
//   baseURL: "http://localhost:4000",
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

export default axios.create({
  baseURL: "https://desafio-backend-03-dindin.herokuapp.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
