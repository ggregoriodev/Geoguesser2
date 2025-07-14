import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.MAPILLARY_TOKEN;

const KNOWN_LOCATIONS = [
  { lat: 40.7128, lng: -74.0060, name: 'Nova York' },
  { lat: 51.5074, lng: -0.1278, name: 'Londres' },
  { lat: 48.8566, lng: 2.3522, name: 'Paris' },
  { lat: 35.6762, lng: 139.6503, name: 'Tóquio' },
  { lat: -33.8688, lng: 151.2093, name: 'Sydney' },
  { lat: 41.9028, lng: 12.4964, name: 'Roma' },
  { lat: 52.5200, lng: 13.4050, name: 'Berlim' },
  { lat: 55.7558, lng: 37.6176, name: 'Moscou' },
  { lat: -23.5505, lng: -46.6333, name: 'São Paulo' },
  { lat: 19.4326, lng: -99.1332, name: 'Cidade do México' },
  { lat: 34.0522, lng: -118.2437, name: 'Los Angeles' },
  { lat: 41.8781, lng: -87.6298, name: 'Chicago' },
  { lat: 25.7617, lng: -80.1918, name: 'Miami' },
  { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
  { lat: 45.5152, lng: -122.6784, name: 'Portland' }
];

function getRandomBBox(size = 0.01) {
  const location = KNOWN_LOCATIONS[Math.floor(Math.random() * KNOWN_LOCATIONS.length)];
  
  const latVariation = (Math.random() - 0.5) * 0.1; 
  const lngVariation = (Math.random() - 0.5) * 0.1;
  
  const centerLat = location.lat + latVariation;
  const centerLng = location.lng + lngVariation;

  // Cria bbox ao redor do centro
  const bbox = [
    (centerLng - size / 2).toFixed(6),  // minLng
    (centerLat - size / 2).toFixed(6),  // minLat
    (centerLng + size / 2).toFixed(6),  // maxLng
    (centerLat + size / 2).toFixed(6)   // maxLat
  ];

  console.log(`Buscando em ${location.name}: [${centerLat.toFixed(6)}, ${centerLng.toFixed(6)}]`);
  
  // Retorna string no formato esperado pela API
  return { bbox: bbox.join(','), location }; // Retorna bbox e localização
}

async function getImagesFromBBox() {
  const url = 'https://graph.mapillary.com/images';

  const bboxData = getRandomBBox(); // Pega bbox e localização
  const params = {
    access_token: token,
    bbox: bboxData.bbox, // Usa apenas a string do bbox
    fields: 'id,thumb_1024_url,geometry',
    limit: 1
  };

  try {
    const response = await axios.get(url, { params });
    const data = response.data.data;
    
    // Adiciona o nome da cidade aos dados
    if (data && data.length > 0) {
      data[0].cityName = bboxData.location.name; // Adiciona nome da cidade
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar imagens:', error.message);
    throw error;
  }
}

  getImagesFromBBox().then(console.log).catch(console.error);


export { getImagesFromBBox };
// parametros aceitos pela api:
// bbox: string no formato 'minLng,minLat,maxLng,maxLat'
// fields: string com campos a serem retornados
// limit: número máximo de imagens a serem retornadas
// access_token: token de acesso à API


