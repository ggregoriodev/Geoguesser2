import axios from "axios";
import dotenv from "dotenv";
import City from "../../models/CityModel.js";

dotenv.config();

const token = process.env.MAPILLARY_TOKEN;

const Locations = async () => {
  try {
    const cities = await City.findAll();

    // Mapeia os dados do banco para o formato esperado pela função getRandomBBox
    const locations = cities.map((city) => ({
      //A função map() transforma cada item de um array em algo
      lat: parseFloat(city.latitude),
      lng: parseFloat(city.longitude),
      name: city.name,
    }));

    return locations;
  } catch (error) {
    console.error("Erro ao buscar cidades do banco:", error.message);
    throw error;
  }
};

async function getRandomBBox(size = 0.01) {
  try {
    const locations = await Locations();

    if (!locations || locations.length === 0) {
      throw new Error("Nenhuma cidade encontrada no banco de dados");
    }

    const location = locations[Math.floor(Math.random() * locations.length)];

    const latVariation = (Math.random() - 0.5) * 0.1;
    const lngVariation = (Math.random() - 0.5) * 0.1;

    const centerLat = location.lat + latVariation;
    const centerLng = location.lng + lngVariation;

    const bbox = [
      (centerLng - size / 2).toFixed(6), // minLng
      (centerLat - size / 2).toFixed(6), // minLat
      (centerLng + size / 2).toFixed(6), // maxLng
      (centerLat + size / 2).toFixed(6), // maxLat
    ];

    console.log(
      `Buscando em ${location.name}: [${centerLat.toFixed(
        6
      )}, ${centerLng.toFixed(6)}]`
    );

    // Retorna string no formato esperado pela API
    return { bbox: bbox.join(","), location }; // Retorna bbox e localização
  } catch (error) {
    console.error("Erro ao gerar bbox:", error.message);
    throw error;
  }
}

async function getImagesFromBBox() {
  const url = "https://graph.mapillary.com/images";

  const bboxData = await getRandomBBox(); // Pega bbox e localização
  const params = {
    access_token: token,
    bbox: bboxData.bbox, // Usa apenas a string do bbox
    fields: "id,thumb_1024_url,geometry",
    limit: 1,
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
    console.error("Erro ao buscar imagens:", error.message);
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
