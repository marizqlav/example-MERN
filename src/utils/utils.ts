import { red, cyan, green } from "colorette";
import Stripe from "stripe";

//local imports
import { Rol } from "../models/rol";
import { User } from "../models/user";
import { STRIPE_SECRET_KEY, STRIPE_PRIZE_ID } from "../config";
import exp from "constants";
import { get } from "http";
import { Lobby } from "../models/lobby";

export const roles = [
  { name: "admin" },
  { name: "anonymous" },
  { name: "customer" },
  { name: "authenticated" },
];

async function createRoles() {
  for (const role of roles) {
    const rol = await Rol.findOne({ name: role.name });
    if (!rol) {
      await Rol.create(role);
    }
  }
}

async function createModels() {
  try {
    await createRoles();
    console.log(green("Creating models..."));
    //cada linea va a hacer crear la conexion de las tablas de la base de datos que sean padres(users)
    await User.createCollection();
    await Lobby.createCollection();
    console.log(cyan("Models created"));
  } catch (error: any) {
    console.log(red(`Can't create the models:${error.message}`));
  }
}

export async function createDatabase() {
  try {
    await createModels();
    console.log(cyan("Database created"));
  } catch (error: any) {
    console.log(red(`Can't create the database:${error.message}`));
  }
}

export async function getUserByEmailOrUsername(
  email: string,
  username: string
) {
  return await User.findOne({ $or: [{ email }, { username }] });
}

export async function createCheackoutSession(email: string) {
  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    success_url: "http://example.com/success",
    cancel_url: "http://example.com/cancel",
    payment_method_types: ["card"],
    customer_email: email,
    mode: "subscription",
    line_items: [
      {
        price: STRIPE_PRIZE_ID,
        quantity: 1,
      },
    ],
  });
  return session;
}

async function getCustomerByEmail(email: string) {
  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const customers = await stripe.customers.list({ email: email });
  return customers.data[0].id;
}

export async function getCustomerSuscriptionByEmail(email: string) {
  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const customerId = await getCustomerByEmail(email);
  const subscription = await stripe.subscriptions.list({
    customer: customerId,
  });
  return subscription.data[0].id;
}
