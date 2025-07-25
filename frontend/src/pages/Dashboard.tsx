import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { getCars, createCar, updateCar, deleteCar } from '../services/carService';
import { getContacts, deleteContact } from '../services/contactService';
import type { Car, Contact } from '../types';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [cars, setCars] = useState<Car[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<Partial<Car>>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    description: '',
    mileage: 0,
    fuelType: '',
    transmission: '',
    color: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [carsData, contactsData] = await Promise.all([
        getCars(),
        getContacts()
      ]);
      setCars(carsData);
      setContacts(contactsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (car?: Car) => {
    if (car) {
      setEditingCar(car);
      setFormData(car);
    } else {
      setEditingCar(null);
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        description: '',
        mileage: 0,
        fuelType: '',
        transmission: '',
        color: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCar(null);
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      description: '',
      mileage: 0,
      fuelType: '',
      transmission: '',
      color: '',
    });
    setImageFiles([]);
  };

  const handleSubmit = async () => {
    try {
      const requiredFields = [
        'brand', 'model', 'year', 'price', 'description', 'mileage', 'fuelType', 'transmission', 'color'
      ];
      
      const missingFields = requiredFields.filter(field => {
        const value = formData[field as keyof Car];
        return value === undefined || value === null || value === '';
      });

      if (missingFields.length > 0) {
        alert(`Por favor, preencha todos os campos obrigatórios: ${missingFields.join(', ')}`);
        return;
      }

      const carData = {
        brand: formData.brand as string,
        model: formData.model as string,
        year: Number(formData.year) || 0,
        price: Number(formData.price) || 0,
        description: formData.description as string,
        mileage: Number(formData.mileage) || 0,
        fuelType: formData.fuelType as string,
        transmission: formData.transmission as string,
        color: formData.color as string,
      };

      if (editingCar) {
        await updateCar(editingCar._id, carData, imageFiles);
      } else {
        await createCar(carData, imageFiles);
      }
      handleClose();
      loadData();
    } catch (error) {
      console.error('Error saving car:', error);
      alert('Erro ao salvar o carro. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    console.log('Tentando deletar carro com ID:', id);
    if (window.confirm('Tem certeza que deseja excluir este carro?')) {
      try {
        console.log('Chamando deleteCar com ID:', id);
        await deleteCar(id);
        console.log('Carro deletado com sucesso');
        loadData();
      } catch (error) {
        console.error('Error deleting car:', error);
        alert('Erro ao deletar o carro. Por favor, tente novamente.');
      }
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        await deleteContact(id);
        loadData();
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
          sx={{
            background: theme.palette.primary.main,
            '&:hover': {
              background: theme.palette.primary.dark,
            },
          }}
        >
          Adicionar Carro
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Carros
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3,
          mb: 4,
        }}
      >
        {cars.map((car) => (
          <Card key={String(car._id)} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="200"
              image={car.imageUrls[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPgogIDx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TZW0gSW1hZ2VtPC90ZXh0Pgo8L3N2Zz4K'}
              alt={`${car.brand} ${car.model}`}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="div">
                {car.brand} {car.model}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ano: {car.year}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preço: R$ {car.price.toLocaleString('pt-BR')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quilometragem: {car.mileage.toLocaleString('pt-BR')} km
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <IconButton onClick={() => handleOpen(car)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(String(car._id))} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Box>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Contatos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Mensagem</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={String(contact._id)}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.message}</TableCell>
                <TableCell>
                  {contact.createdAt &&
                    (typeof (contact.createdAt as any).toDate === 'function'
                      ? (contact.createdAt as any).toDate().toLocaleDateString('pt-BR')
                      : new Date(contact.createdAt).toLocaleDateString('pt-BR'))}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteContact(String(contact._id))} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCar ? 'Editar Carro' : 'Adicionar Carro'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Marca"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
            <TextField
              label="Modelo"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
            <TextField
              label="Ano"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 0 })}
            />
            <TextField
              label="Preço"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            />
            <TextField
              label="Descrição"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              label="Quilometragem"
              type="number"
              value={formData.mileage}
              onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
            />
            <TextField
              label="Tipo de Combustível"
              value={formData.fuelType}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
            />
            <TextField
              label="Transmissão"
              value={formData.transmission}
              onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
            />
            <TextField
              label="Cor"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
            <TextField
              label="Imagens"
              type="file"
              inputProps={{ multiple: true, accept: 'image/*' }}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                const files = target.files;
                if (files) {
                  setImageFiles(Array.from(files));
                }
              }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCar ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 