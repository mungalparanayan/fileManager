const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://0.0.0.0/file_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Successfully');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const itemSchema = new mongoose.Schema({
  id: String,
  name: String,
  isFolder: Boolean,
  items: [this], 
  content: String 
}, { strict: false });

const Item = mongoose.model('Item', itemSchema);

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).send(newItem);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findOneAndDelete({ id: req.params.id });
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});