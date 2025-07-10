const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const { Car } = require('../models');

// Configuração do Multer para upload de imagens
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Função para validar ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Listar todos os carros
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar carro por ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Carro não encontrado' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar novo carro
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    console.log('Dados recebidos:', req.body);
    console.log('Arquivos recebidos:', req.files);
    
    const carData = req.body;
    let imageUrls = [];

    // Se tiver imagens, converter para base64 e salvar no MongoDB
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const base64Image = file.buffer.toString('base64');
        const mimeType = file.mimetype;
        const imageUrl = `data:${mimeType};base64,${base64Image}`;
        imageUrls.push(imageUrl);
      });
    }

    const car = new Car({
      ...carData,
      imageUrls: imageUrls
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    console.error('Erro ao criar carro:', error);
    res.status(400).json({ message: error.message });
  }
});

// Atualizar carro
router.put('/:id', upload.array('images', 10), async (req, res) => {
  try {
    console.log('Atualizando carro com ID:', req.params.id);
    const car = await Car.findById(req.params.id);
    if (!car) {
      console.log('Carro não encontrado para atualização');
      return res.status(404).json({ message: 'Carro não encontrado' });
    }

    const carData = req.body;
    let imageUrls = [...car.imageUrls];

    // Se tiver novas imagens, adicionar à lista
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const base64Image = file.buffer.toString('base64');
        const mimeType = file.mimetype;
        const newImageUrl = `data:${mimeType};base64,${base64Image}`;
        imageUrls.push(newImageUrl);
      });
    }

    Object.assign(car, carData, { imageUrls });
    await car.save();

    console.log('Carro atualizado com sucesso');
    res.json(car);
  } catch (error) {
    console.error('Erro ao atualizar carro:', error);
    res.status(400).json({ message: error.message });
  }
});

// Deletar carro
router.delete('/:id', async (req, res) => {
  try {
    console.log('Tentando deletar carro com ID:', req.params.id);
    
    // Validar se o ID é um ObjectId válido
    if (!isValidObjectId(req.params.id)) {
      console.log('ID inválido:', req.params.id);
      return res.status(400).json({ message: 'ID inválido' });
    }
    
    const car = await Car.findById(req.params.id);
    if (!car) {
      console.log('Carro não encontrado');
      return res.status(404).json({ message: 'Carro não encontrado' });
    }

    console.log('Carro encontrado:', car.brand, car.model);
    const result = await Car.findByIdAndDelete(req.params.id);
    console.log('Resultado da deleção:', result);
    res.json({ message: 'Carro deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar carro:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 