import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  InputAdornment,
  Paper,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getCars } from '../services/carService';
import { createContact } from '../services/contactService';
import type { Car, CarFilters, Contact } from '../types';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { isAuthenticated } from '../services/auth';

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [cars, setCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState<CarFilters>({});
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const carsData = await getCars();
      setCars(carsData);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async () => {
    try {
      const contactData: Omit<Contact, 'id' | 'createdAt'> = {
        name: contactForm.name,
        phone: contactForm.phone,
        message: contactForm.message,
      };

      await createContact(contactData);

      setContactForm({
        name: '',
        phone: '',
        message: '',
      });

      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    } catch (error) {
      console.error('Error creating contact:', error);
      alert('Erro ao enviar mensagem. Por favor, tente novamente.');
    }
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Encontre o Carro dos Seus Sonhos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Explore nossa seleção de veículos de alta qualidade
          </Typography>
          {isAuthenticated() && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/dashboard')}
              sx={{ mt: 2 }}
            >
              Ir para Dashboard
            </Button>
          )}
        </Box>

        <Box sx={{ mb: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Buscar Carros
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                  md: '1fr 1fr 1fr 1fr',
                },
                gap: 2,
              }}
            >
              <TextField
                label="Marca"
                value={filters.brand || ''}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                fullWidth
              />
              <TextField
                label="Modelo"
                value={filters.model || ''}
                onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                fullWidth
              />
              <TextField
                label="Preço Mínimo"
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
              <TextField
                label="Preço Máximo"
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={() => loadCars()}
                sx={{ mr: 1 }}
              >
                Buscar
              </Button>
              <Button
                variant="outlined"
                onClick={() => setFilters({})}
              >
                Limpar
              </Button>
            </Box>
          </Paper>
        </Box>

        {cars.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {cars.map((car) => (
              <Card key={car.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={car.imageUrls[0] || 'https://via.placeholder.com/300x200?text=Sem+Imagem'}
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
                  <Typography variant="body2" color="text.secondary">
                    Cor: {car.color}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Combustível: {car.fuelType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Transmissão: {car.transmission}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {car.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleImageClick(car)}
                    sx={{
                      background: theme.palette.primary.main,
                      '&:hover': {
                        background: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Entrar em Contato
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4, mb: 6 }}>
            <Typography variant="h6" color="text.secondary">
              Nenhum carro encontrado com os filtros selecionados
            </Typography>
          </Box>
        )}

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Não Encontrou o Carro Ideal?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Preencha o formulário abaixo e nossa equipe entrará em contato para ajudar você a encontrar o carro perfeito.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
              },
              gap: 2,
            }}
          >
            <TextField
              label="Nome"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Telefone"
              value={contactForm.phone}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Modelo Desejado"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              fullWidth
              multiline
              rows={3}
              required
            />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleContactSubmit}
              disabled={!contactForm.name || !contactForm.phone || !contactForm.message}
            >
              Enviar
            </Button>
          </Box>
        </Paper>

        {/* Image Carousel Dialog */}
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