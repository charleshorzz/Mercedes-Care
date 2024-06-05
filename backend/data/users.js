import bcrypt from "bcryptjs";

const users = [
  {
    name: "Charles Hor",
    email: "horyuanli43@gmail.com",
    password: await bcrypt.hash("123456", 10),
    phone: "0189154390",
    isAdmin: true,
  },
  {
    name: "Brandon Leong",
    email: "brandon123@gmail.com",
    password: await bcrypt.hash("123456", 10),
    phone: "0123456789",
    isAdmin: false,
  },
];

export default users;
