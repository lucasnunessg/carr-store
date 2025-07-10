const express = require('express');
const router = express.Router();
const { Contact, Car } = require('../models');

// Listar todos os contatos
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate('carId', 'brand model year')
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar contato por ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('carId', 'brand model year');
    if (!contact) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar novo contato
router.post('/', async (req, res) => {
  try {
    const contactData = req.body;
    
    // Se carId foi fornecido, verificar se o carro existe
    if (contactData.carId) {
      const car = await Car.findById(contactData.carId);
      if (!car) {
        return res.status(404).json({ message: 'Carro não encontrado' });
      }
    }

    const contact = new Contact(contactData);
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar contato
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }

    Object.assign(contact, req.body);
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar contato
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contato não encontrado' });
    }

    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contato deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 