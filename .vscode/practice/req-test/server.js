import express from "express";

const app = express();

// *Middleware allowing express to read req.body
app.use(express.json());

//* Testing REQ.PARAMS -- getting value after ":"
// app.get("/api/:id2/:id/pow", function (req, res) {
//   const { id2, id } = req.params;

//   res.json({
//     message: "success",
//     id,
//     id2,
//   });
// });

//* Testing REQ.QUERY -- getting value after /api/shopping?cart1=pc&cart2=ps
/**
app.get("/api/shopping", (req, res) => {
  const { cart1, cart2 } = req.query;
  res.json({
    cart1,
    cart2,
  });
});
 */

//* Testing REQ.BODY
// Getting data from the body
// app.post("/api/login", (req, res) => {
//   const { userName, passWord } = req.body;

//   res.json({
//     userID: userName,
//     userPassword: passWord,
//   });
// });

// const userCredentials = {
//   userName: "randomUser_123",
//   passWord: "randomPass_321",
// };

// fetch("http://localhost:3000/api/login", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify(userCredentials),
// })
//   .then((response) => response.json())
//   .then((response) => {
//     console.log("---RESPONSE FROM EXPRESS---");
//     console.log(response);
//   })
//   .catch((error) =>
//     console.error("Error connecting to the server", error.message),
//   );

//* Testing REQ.HEADERS
// reading response from the headers

app.get("/test1", (req, res) => {
  const customHeader = req.headers["x-custom-id"];
  res.json({
    header: customHeader,
  });
});

fetch("http://localhost:3000/test1", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "x-custom-id": "123",
  },
})
  .then((res) => res.json())
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

app.listen(3000, () => {
  console.log(`App is running on 3000 port`);
});
