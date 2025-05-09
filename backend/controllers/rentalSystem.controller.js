import Machine from "../models/Machine.js";
import Transaction from "../models/Transaction.js";
import Rental from "../models/Rental.js";
import User from "../models/User.js";

// === Gépek ===
export const getMachines = async (req, res) => {
  try {
    const machines = await Machine.find();
    res.json(machines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addMachine = async (req, res) => {
  try {
    const { code, brand, name, type, performance, weight, dailyFee, deposit } = req.body;

    if (!name || !dailyFee || !deposit) {
      return res.status(400).json({ error: "Missing required fields: name, dailyFee, deposit" });
    }

    const newMachine = new Machine({ code, brand, name, type, performance, weight, dailyFee, deposit });
    await newMachine.save();
    res.status(201).json(newMachine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateMachine = async (req, res, next) => {
  try {
    const updated = await Machine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return next(CreateError(404, "Machine not found"));
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return next(CreateError(500, err.message));
  }
};

export const deleteMachine = async (req, res, next) => {
  try {
    const deleted = await Machine.findByIdAndDelete(req.params.id);
    if (!deleted) return next(CreateError(404, "Machine not found"));
    return res.status(200).json({ success: true, message: "Machine deleted" });
  } catch (err) {
    return next(CreateError(500, err.message));
  }
};
// === Partnerek ===
export const depositToPartner = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return next(CreateError(404, "User not found"));
    }

    const depositAmount = 5000;
    user.balance += depositAmount;
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: "deposit",
      amount: depositAmount,
      description: "Egyenleg feltöltés",
      date: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Deposit successful",
      data: user,
    });
  } catch (error) {
    return next(CreateError(500, error.message));
  }
};

// === Tranzakciók ===
export const getPartnerTransactions = async (req, res) => {
  const userId = req.user.id;

  const { from, to } = req.query;

  try {
    const query = { userId };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// === Kölcsönzések ===

export const createRental = async (req, res) => {
  const { machineId, startDate } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Felhasználó nem található" });

    if (user.balance < -45000) {
      return res.status(403).json({ error: "Túl nagy tartozás, kölcsönzés nem engedélyezett." });
    }

    const machine = await Machine.findById(machineId);
    if (!machine) return res.status(404).json({ error: "Gép nem található" });

    const rentalFee = machine.deposit;
    user.balance -= rentalFee;
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: "rental",
      amount: -rentalFee,
      description: "Kölcsönzés indítás – 1 nap díj levonva",
      date: new Date(startDate),
    });

    const rental = new Rental({
      userId,
      machineId,
      startDate: new Date(startDate),
    });
    await rental.save();

    res.status(201).json({ rental, data: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserRentals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const rentals = await Rental.find({ userId }).populate("machineId");

    res.status(200).json({ success: true, data: rentals });
  } catch (error) {
    next(CreateError(500, error.message));
  }
};

export const closeRental = async (req, res) => {
  const userId = req.user.id;
  const { id, endDate, returnedInGoodCondition } = req.body;

  try {
    const rental = await Rental.findById(id).populate("machineId").populate("userId");
    if (!rental) {
      return res.status(404).json({ error: "Kölcsönzés nem található" });
    }

    if (rental.userId._id.toString() !== userId) {
      return res.status(403).json({ error: "Nincs jogosultság a bérlés lezárásához." });
    }

    // Dátumok
    const end = new Date(endDate);
    const start = new Date(rental.startDate);
    const days = Math.max(Math.ceil((end - start) / (1000 * 60 * 60 * 24)), 1);

    const rentalFee = rental.machineId.dailyFee * days;
    const deposit = rental.machineId.deposit;

    // Frissítés
    rental.endDate = end;
    rental.returnedInGoodCondition = returnedInGoodCondition;
    await rental.save();

    // Levonás és tranzakciók
    let refundTransaction = null;
    let penaltyTransaction = null;

    if (returnedInGoodCondition) {
      rental.userId.balance += deposit;
      refundTransaction = await Transaction.create({
        userId: rental.userId._id,
        type: "refund",
        amount: deposit,
        description: "Letét visszatérítve – gép épségben",
        date: end,
      });
    } else {
      const penalty = deposit * 2;
      rental.userId.balance -= penalty;
      penaltyTransaction = await Transaction.create({
        userId: rental.userId._id,
        type: "penalty",
        amount: -penalty,
        description: "Büntetés – sérült gép",
        date: end,
      });
    }

    rental.userId.balance -= rentalFee;

    const rentalTransaction = await Transaction.create({
      userId: rental.userId._id,
      type: "rental",
      amount: -rentalFee,
      description: `Bérleti díj – ${days} nap`,
      date: end,
    });

    await rental.userId.save();

    res.json({
      success: true,
      rental,
      transactions: {
        rental: rentalTransaction,
        refund: refundTransaction,
        penalty: penaltyTransaction,
      },
    });
  } catch (err) {
    console.error("Hiba a bérlés lezárásakor:", err);
    res.status(400).json({ error: err.message });
  }
};

