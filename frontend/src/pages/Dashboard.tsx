import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCars, createCar, updateCar, deleteCar, getContacts, deleteContact } from '../services/localStorage';
import type { Car, Contact } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

export default function Dashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [carsData, contactsData] = await Promise.all([
        getCars(),
        getContacts(),
      ]);
      setCars(carsData);
      setContacts(contactsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const carData: Omit<Car, 'id'> = {
      brand: formData.get('brand') as string,
      model: formData.get('model') as string,
      year: parseInt(formData.get('year') as string),
      price: parseFloat(formData.get('price') as string),
      mileage: parseInt(formData.get('mileage') as string),
      color: formData.get('color') as string,
      fuelType: formData.get('fuelType') as string,
      transmission: formData.get('transmission') as string,
      description: formData.get('description') as string,
      imageUrls: [], // Será preenchido após o upload das imagens
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const imageFiles = formData.getAll('images') as File[];
      const imagePromises = imageFiles.map(fileToBase64);
      const imageUrls = await Promise.all(imagePromises);
      carData.imageUrls = imageUrls as string[];

      if (editingCar) {
        await updateCar(editingCar.id, carData);
      } else {
        await createCar(carData);
      }
      setOpenDialog(false);
      loadData();
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setOpenDialog(true);
  };

  const handleDeleteCar = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este carro?')) {
      try {
        await deleteCar(id);
        loadData();
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        await deleteContact(id);
        loadData();
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingCar(null);
              setOpenDialog(true);
            }}
          >
            Adicionar Carro
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Carros Cadastrados
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 6 }}>
          {cars.map((car) => (
            <Card key={car.id}>
              {car.imageUrls && car.imageUrls.length > 0 && (
                <CardMedia
                  component="img"
                  height="200"
                  image={car.imageUrls[0]}
                  alt={`${car.brand} ${car.model}`}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {car.brand} {car.model}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Ano: {car.year} | Quilometragem: {car.mileage}km
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  R$ {car.price.toLocaleString('pt-BR')}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton onClick={() => handleEdit(car)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCar(car.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
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
                <TableRow key={contact.id}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.message}</TableCell>
                  <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="error" onClick={() => handleDeleteContact(contact.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {editingCar ? 'Editar Carro' : 'Adicionar Carro'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                <TextField
                  name="brand"
                  label="Marca"
                  defaultValue={editingCar?.brand}
                  required
                  fullWidth
                />
                <TextField
                  name="model"
                  label="Modelo"
                  defaultValue={editingCar?.model}
                  required
                  fullWidth
                />
                <TextField
                  name="year"
                  label="Ano"
                  type="number"
                  defaultValue={editingCar?.year}
                  required
                  fullWidth
                />
                <TextField
                  name="price"
                  label="Preço"
                  type="number"
                  defaultValue={editingCar?.price}
                  required
                  fullWidth
                />
                <TextField
                  name="mileage"
                  label="Quilometragem"
                  type="number"
                  defaultValue={editingCar?.mileage}
                  required
                  fullWidth
                />
                <TextField
                  name="color"
                  label="Cor"
                  defaultValue={editingCar?.color}
                  required
                  fullWidth
                />
                <TextField
                  name="fuelType"
                  label="Tipo de Combustível"
                  defaultValue={editingCar?.fuelType}
                  required
                  fullWidth
                />
                <TextField
                  name="transmission"
                  label="Transmissão"
                  defaultValue={editingCar?.transmission}
                  required
                  fullWidth
                />
                <TextField
                  name="description"
                  label="Descrição"
                  multiline
                  rows={4}
                  defaultValue={editingCar?.description}
                  required
                  fullWidth
                />
                <TextField
                  name="images"
                  type="file"
                  inputProps={{ multiple: true, accept: 'image/*' }}
                  fullWidth
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
              <Button type="submit" variant="contained">
                {editingCar ? 'Salvar' : 'Adicionar'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
} 