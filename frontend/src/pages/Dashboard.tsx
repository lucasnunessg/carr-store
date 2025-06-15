import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import type { Car, Contact } from '../types';
import { createCar, updateCar, deleteCar, getCars } from '../services/cars';
import { getContacts, deleteContact } from '../services/contacts';
import { formatPrice } from '../utils/format';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function Dashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [carForm, setCarForm] = useState<Partial<Car> & { images?: File[] }>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    description: '',
    mileage: 0,
    color: '',
    fuelType: '',
    transmission: '',
    images: [],
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleCarSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(carForm).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'images') {
          formData.append(key, value.toString());
        }
      });
      if (carForm.images && carForm.images.length > 0) {
        carForm.images.forEach((file) => {
          formData.append('images', file);
        });
      }
      if (editingCar) {
        await updateCar(editingCar.id, formData);
      } else {
        await createCar(formData);
      }
      setOpenDialog(false);
      setCarForm({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        description: '',
        mileage: 0,
        color: '',
        fuelType: '',
        transmission: '',
        images: [],
      });
      setEditingCar(null);
      loadData();
    } catch (error) {
      console.error('Error saving car:', error);
    }
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

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setCarForm({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      color: car.color,
      fuelType: car.fuelType,
      transmission: car.transmission,
      description: car.description,
      images: [],
    });
    setOpenDialog(true);
  };

  const handleImageClick = (car: Car) => {
    if (car.imageUrls && car.imageUrls.length > 1) {
      setSelectedCar(car);
      setCurrentImageIndex(0);
      setImageDialogOpen(true);
    }
  };

  const handleNextImage = () => {
    if (selectedCar && selectedCar.imageUrls) {
      setCurrentImageIndex((prev) => 
        prev === selectedCar.imageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedCar && selectedCar.imageUrls) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedCar.imageUrls.length - 1 : prev - 1
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setCarForm(prev => ({
        ...prev,
        images: Array.from(files)
      }));
    }
  };

  const handleDeleteContact = async (id: number) => {
    try {
      await deleteContact(id);
      loadData();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Typography variant="h4">Dashboard</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingCar(null);
              setCarForm({
                brand: '',
                model: '',
                year: new Date().getFullYear(),
                price: 0,
                mileage: 0,
                color: '',
                fuelType: '',
                transmission: '',
                description: '',
                images: [],
              });
              setOpenDialog(true);
            }}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Adicionar Carro
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Carros Cadastrados
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr',
            },
            gap: 3,
            mb: 6,
          }}
        >
          {cars.map((car) => (
            <Card key={car.id}>
              {car.imageUrls && car.imageUrls.length > 0 && (
                <Box 
                  sx={{ 
                    position: 'relative', 
                    height: 200,
                    cursor: car.imageUrls.length > 1 ? 'pointer' : 'default'
                  }}
                  onClick={() => handleImageClick(car)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:3000${car.imageUrls[0]}`}
                    alt={`${car.brand} ${car.model}`}
                    sx={{ objectFit: 'cover' }}
                  />
                  {car.imageUrls.length > 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      +{car.imageUrls.length - 1} imagens
                    </Box>
                  )}
                </Box>
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {car.brand} {car.model}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Ano: {car.year} • {car.mileage.toLocaleString()} km
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  {formatPrice(car.price)}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditCar(car)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteCar(car.id)}
                  >
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

        <Box sx={{ mt: 4 }}>
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
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth fullScreen={fullScreen}>
          <DialogTitle>
            {editingCar ? 'Editar Carro' : 'Adicionar Carro'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Marca"
                value={carForm.brand}
                onChange={(e) => setCarForm({ ...carForm, brand: e.target.value })}
                fullWidth
              />
              <TextField
                label="Modelo"
                value={carForm.model}
                onChange={(e) => setCarForm({ ...carForm, model: e.target.value })}
                fullWidth
              />
              <TextField
                label="Ano"
                type="number"
                value={carForm.year}
                onChange={(e) => setCarForm({ ...carForm, year: parseInt(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Preço"
                type="number"
                value={carForm.price}
                onChange={(e) => setCarForm({ ...carForm, price: parseFloat(e.target.value) })}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
              <TextField
                label="Quilometragem"
                type="number"
                value={carForm.mileage}
                onChange={(e) => setCarForm({ ...carForm, mileage: parseInt(e.target.value) })}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">km</InputAdornment>,
                }}
              />
              <TextField
                label="Cor"
                value={carForm.color}
                onChange={(e) => setCarForm({ ...carForm, color: e.target.value })}
                fullWidth
              />
              <TextField
                label="Combustível"
                value={carForm.fuelType}
                onChange={(e) => setCarForm({ ...carForm, fuelType: e.target.value })}
                fullWidth
              />
              <TextField
                label="Transmissão"
                value={carForm.transmission}
                onChange={(e) => setCarForm({ ...carForm, transmission: e.target.value })}
                fullWidth
              />
              <TextField
                label="Descrição"
                value={carForm.description}
                onChange={(e) => setCarForm({ ...carForm, description: e.target.value })}
                multiline
                rows={4}
                fullWidth
              />
              <TextField
                label="Imagens"
                type="file"
                inputProps={{ multiple: true, accept: 'image/*' }}
                onChange={handleImageChange}
                fullWidth
              />
              {editingCar?.imageUrls && editingCar.imageUrls.length > 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 1 }}>
                  {editingCar.imageUrls.map((url, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={url}
                      alt={`Imagem ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleCarSubmit} variant="contained">
              {editingCar ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={imageDialogOpen}
          onClose={() => setImageDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogContent sx={{ position: 'relative', p: 0 }}>
            {selectedCar && selectedCar.imageUrls && (
              <>
                <Box
                  component="img"
                  src={selectedCar.imageUrls[currentImageIndex]}
                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '80vh',
                    objectFit: 'contain',
                  }}
                />
                {selectedCar.imageUrls.length > 1 && (
                  <>
                    <IconButton
                      onClick={handlePrevImage}
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.7)',
                        },
                      }}
                    >
                      <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleNextImage}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.7)',
                        },
                      }}
                    >
                      <NavigateNextIcon />
                    </IconButton>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      {selectedCar.imageUrls.map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: index === currentImageIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.5)',
                            cursor: 'pointer',
                          }}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </Box>
                  </>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
} 