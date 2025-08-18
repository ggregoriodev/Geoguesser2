import express from "express";
import { getImagesFromBBox } from "./src/services/mapillaryService.js";
import cors from "cors";
import db from "./configs/db.js";
import router from "./routes/CityRouter.js";

const app = express();
app.use(express.json()); // tem q vir antes do router

app.use(
  cors({
    origin: "http://localhost:3000", // Permite requisições apenas do frontend
  })
);
app.use(router);
app.use(express.json());

async function syncDatabase() {
  try {
    await db.sync({ force: false }); // force: false para não recriar tabelas existentes
    console.log(" Banco de dados sincronizado e tabelas criadas!");
  } catch (error) {
    console.error(" Erro ao sincronizar banco de dados:", error);
  }
}

// Inicializar o servidor e sincronizar o banco
async function startServer() {
  await syncDatabase();

  app.listen(3001, () => {
    console.log(" Server is running on port 3001");
    console.log("http://localhost:3001");
  });
}

startServer();

app.get("/", async (req, res) => {
  const images = await getImagesFromBBox();
  res.json(images);
});

app.get("/api/random-image", async (req, res) => {
  try {
    const images = await getImagesFromBBox();
    if (images && images.length > 0) {
      const image = images[0];
      res.json({
        success: true,
        image: {
          id: image.id,
          url: image.thumb_1024_url,
          coordinates: image.geometry.coordinates,
          cityName: image.cityName,
        },
      });
    } else {
      res.json({ success: false, message: "Nenhuma imagem encontrada" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//TODOS OS PARAMETROS DA IMAGEM:
// id: string
// url: string
// coordinates: array
// cityname: string
// country: string
// country_code: string
