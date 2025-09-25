// Initialize parking slots (null = available, object = occupied with timestamp)
const express = require('express'); const cors = require('cors'); const app = express(); app.use(cors()); // allow cross-origin requests if frontend is separate 
app.use(express.json());
const parkingSlots = {
  A: Array(20).fill(null),
  B: Array(24).fill(null),
  C: Array(24).fill(null),
  D: Array(26).fill(null),
  E: Array(26).fill(null),
  F: Array(24).fill(null),
  G: Array(24).fill(null),
  H: Array(18).fill(null),
  I: Array(20).fill(null),
  J: Array(12).fill(null)
};

// GET /allocate - find and occupy the next available slot
app.get('/allocate', (req, res) => {
  const userId = req.query.userId; 
  for (let block in parkingSlots) {
    const idx = parkingSlots[block].findIndex(slot => slot === null); // find first free
    if (idx !== -1) {
      parkingSlots[block][idx] = {
        occupied: true,
        startTime: Date.now()
      };
      return res.json({ block: block, number: idx + 1 });
    }
  }
  return res.status(404).json({ error: "No available slots" });
});

// GET /occupied - return all occupied slots
app.get('/occupied', (req, res) => {
  const occupied = [];
  for (let block in parkingSlots) {
    parkingSlots[block].forEach((slot, idx) => {
      if (slot) {
        occupied.push({ block: block, number: idx + 1});
      }
    });
  }
  res.json(occupied);
});
app.get("/slots", (req, res) => {
  res.json(parkingSlots);
});


// POST /release - mark a slot as available and return duration parked
// POST /release - mark a slot as available and return duration parked
app.post('/release', (req, res) => {
  const { block, number } = req.body;

  if (!block || !number 
      || !parkingSlots[block] 
      || number < 1 
      || number > parkingSlots[block].length) {
    return res.status(400).json({ error: "Invalid slot" });
  }

  const slot = parkingSlots[block][number - 1];
  if (!slot) {
    return res.status(400).json({ error: "Slot is already free" });
  }

  // Calculate time difference
  const endTime = Date.now();
  const durationMs = endTime - slot.startTime;

  const totalMinutes = Math.floor(durationMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Format as HH:MM (zero padded)
  const durationFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  // Free the slot
  parkingSlots[block][number - 1] = null;

  res.json({
    duration: durationFormatted
  });
});
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});