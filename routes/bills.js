const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const authenticateToken = require("../middleware/auth");


router.post("/", authenticateToken, async (req, res) => {
  const { customerName, customerEmail, contact, items, discount, date } = req.body;
  const userId = req.user.uid;

  if (!customerName || !items || !date) {
    return res.status(400).json({ message: "Customer name, items, and date are required" });
  }

  try {
    const billRef = db.collection("bills").doc();
    const billData = {
      userId,
      customerName,
      customerEmail: customerEmail || "",
      contact: contact || "",
      items,
      discount: Number(discount) || 0,
      date,
      createdAt: new Date().toISOString(),
    };

    await billRef.set(billData);

    res.status(201).json({ message: "Bill created successfully", billId: billRef.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/history", authenticateToken, async (req, res) => {
  const userId = req.user.uid;

  try {
    const billsSnapshot = await db
      .collection("bills")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const bills = billsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      total: doc.data().items.reduce((sum, item) => sum + item.price * item.quantity, 0) - (doc.data().discount || 0),
    }));

    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/revenue", authenticateToken, async (req, res) => {
  const userId = req.user.uid;
  const { year } = req.query; 

  try {
    const billsSnapshot = await db
      .collection("bills")
      .where("userId", "==", userId)
      .where("date", ">=", `${year}-01-01`)
      .where("date", "<=", `${year}-12-31`)
      .get();

    const bills = billsSnapshot.docs.map((doc) => doc.data());
    const monthlyRevenue = Array(12).fill(0);
    let totalBills = 0;
    let totalRevenue = 0;

    bills.forEach((bill) => {
      const month = new Date(bill.date).getMonth(); // 0-11
      const billTotal = bill.items.reduce((sum, item) => sum + item.price * item.quantity, 0) - (bill.discount || 0);
      monthlyRevenue[month] += billTotal;
      totalRevenue += billTotal;
      totalBills += 1;
    });

    const averageBillValue = totalBills > 0 ? totalRevenue / totalBills : 0;

    res.status(200).json({
      monthlyRevenue,
      totalRevenue,
      totalBills,
      averageBillValue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;