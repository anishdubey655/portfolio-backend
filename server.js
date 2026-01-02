const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("connection to Database"))
    .catch((err) => console.error("DB not Connect", err));

const messageSchema = new mongoose.Schema({
    name: { type: String, default: "Guest User" },
    email: { type: String, default: "No Email Provided" },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);


app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!message) return res.status(400).json({ success: false, error: "Write message!" });

        const newMessage = new Message({ 
            name: name || "Portfolio Visitor", 
            email: email || "visitor@example.com", 
            message 
        });
        
        await newMessage.save();
        res.status(201).json({ success: true, message: "Save ho gaya!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});

app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ date: -1 }); 
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ success: false, message: "Fetch nahi ho paya" });
    }
});

app.delete('/api/messages/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Message uda diya!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete error" });
    }
});

app.get('/', (req, res) => res.send("Portfolio Backend is Running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));