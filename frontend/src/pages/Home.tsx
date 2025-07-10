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
  Fab,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getCars } from '../services/carService';
import { createContact } from '../services/contactService';
import type { Car, CarFilters, Contact } from '../types';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { isAuthenticated } from '../services/auth';

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [cars, setCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState<CarFilters>({});
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
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

  // Filtro em tempo real
  useEffect(() => {
    const lower = (v: string | undefined) => (v || '').toLowerCase();
    setFilteredCars(
      cars.filter(car => {
        if (filters.brand && !car.brand.toLowerCase().includes(lower(filters.brand))) return false;
        if (filters.model && !car.model.toLowerCase().includes(lower(filters.model))) return false;
        if (filters.minPrice && car.price < filters.minPrice) return false;
        if (filters.maxPrice && car.price > filters.maxPrice) return false;
        return true;
      })
    );
  }, [cars, filters]);

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
      const contactData: Omit<Contact, '_id' | 'createdAt' | 'updatedAt'> = {
        name: contactForm.name,
        email: 'contato@carsstore.com', // Email padrão para contatos gerais
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

  const handleWhatsAppClick = () => {
    window.open('https://api.whatsapp.com/send?phone=5555999997947', '_blank');
  };

  // Adicionar uma função para abrir WhatsApp com informações do carro
  const handleWhatsAppContact = (car: Car) => {
    const message = `Olá! Tenho interesse no ${car.brand} ${car.model} ${car.year}. Poderia me passar mais informações?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5555999997947&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
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

        {filteredCars.length > 0 ? (
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
            {filteredCars.map((car) => (
              <Card key={car._id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, bgcolor: '#f5f5f5', cursor: 'pointer' }} onClick={() => handleImageClick(car)}>
                  {car.imageUrls && car.imageUrls.length > 0 ? (
                    <img
                      src={car.imageUrls[0]}
                      alt={`${car.brand} ${car.model}`}
                      style={{ maxHeight: 180, maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }}
                    />
                  ) : (
                    <span>Sem Imagem</span>
                  )}
                  {car.imageUrls.length > 1 && (
                    <Box sx={{ position: 'absolute', right: 8, top: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', px: 1, borderRadius: 1, fontSize: 12 }}>
                      +{car.imageUrls.length - 1}
                    </Box>
                  )}
                </Box>
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
                    onClick={() => handleWhatsAppContact(car)}
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
      
      {/* Botão flutuante do WhatsApp */}
      <Fab
        color="primary"
        aria-label="WhatsApp"
        onClick={handleWhatsAppClick}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          bgcolor: '#25D366', // Cor verde do WhatsApp
          '&:hover': {
            bgcolor: '#128C7E', // Verde mais escuro no hover
          },
          zIndex: 1000,
        }}
      >
        <WhatsAppIcon />
      </Fab>
    </Box>
  );
} 