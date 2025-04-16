import http from "http";
import { customers, orders } from "./data.js";

const app = http.createServer((request, response) => {
  //Lấy ra đường dẫn người dùng request
  const parsedUrl = request?.url;
  //Nếu người dùng truy cập với đường dẫn /customers thi se tra ve mang customers

  if (parsedUrl === "/customers") {
    response.end(JSON.stringify(customers));
  } else if (parsedUrl.startsWith("/customers/")) {
    const parts = parsedUrl.split("/");
    const customerId = parts[2];

    if (parts.length == 3) {
      const customer = customers.find((customer) => customer.id == customerId);

      if (customer) {
        response.end(JSON.stringify(customer));
      } else {
        response.statusCode = 404;
        response.end("Customer not found");
      }
    }

    if (parts.length == 4) {
      const customerOders = orders.filter(
        (order) => order.customerId == customerId
      );

      if (customerOders) {
        response.end(JSON.stringify(customerOders));
      } else {
        response.statusCode = 404;
        response.end("Customer order not found");
      }
    }
  }

  // Trường hợp còn lại trả về Hello MindX
  response.end("Hello MindX");
});

app.listen(8080, () => {
  console.log("Server is running!");
});
