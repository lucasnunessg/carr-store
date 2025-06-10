import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { getCars, createContact } from '../services/api';
import type { Car, CarFilters } from '../types';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { formatPrice } from '../utils/format';

export default function Home() {
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

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const data = await getCars(filters);
      setCars(data);
    } catch (error) {
      console.error('Error loading cars:', error);
    }
  };

  const handleContactSubmit = async () => {
    try {
      await createContact({
        name: contactForm.name,
        phone: contactForm.phone,
        message: contactForm.message,
      });

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
                  <Button
                    variant="contained"
                    color="primary"
                    href={`https://wa.me/55999997647?text=Olá, tenho interesse no ${car.brand} ${car.model}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<WhatsAppIcon />}
                    fullWidth
                  >
                    Contato
                  </Button>
                </CardContent>
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
                  src={`http://localhost:3000${selectedCar.imageUrls[currentImageIndex]}`}
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