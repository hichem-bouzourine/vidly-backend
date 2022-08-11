const { Customer, validateCustomer } = require("../models/customer");
const express = require("express");
const router = express.Router();

router.use(express.json());

router.get("/", async (req, res) => {
  const customers = await Customer.find();

  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("Customer with the given ID could not be found");

  res.send(customer);
});

router.post("/", async (req, res) => {
  const validUser = validateCustomer(req.body);
  if (validUser.error)
    return res.status(400).send(validUser.error.details[0].message);

  let customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });
  customer = await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  // validate it
  const result = validateGenre(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);
  // find the genre
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!customer)
    return res
      .status(404)
      .send("customer with the given ID could not be found.");
  // send it
  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("Customer with the given ID could not be found");

  res.send(customer);
});

module.exports = router;
