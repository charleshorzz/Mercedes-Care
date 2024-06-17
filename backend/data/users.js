import bcrypt from "bcryptjs";

const users = [
  {
    name: "Charles Hor",
    email: "horyuanli43@gmail.com",
    password: await bcrypt.hash("123456", 10),
    phone: "+60189154390",
    isAdmin: true,
    location: "BR Jaya SDN BHD",
  },
  {
    name: "Brandon Leong",
    email: "brandon123@gmail.com",
    password: await bcrypt.hash("123456", 10),
    phone: "+60123456789",
    isAdmin: false,
  },
];

export default users;
