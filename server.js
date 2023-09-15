const express = require('express')
const { PrismaClient } = require('@prisma/client')
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000',
};

const prisma = new PrismaClient()

const server = express()

server.use(cors(corsOptions));

server.use(express.json())
server.listen(5432, () => console.log('Server is running'))

// create a row
server.post('/series', async (req, res) => {
    const { name, description, release_year, rating, reviews } = req.body;

    const series = await prisma.series.create({
        data: {
            name,
            description,
            release_year,
            rating,
            reviews,
        },
    });

    res.status(201).json(series);
});

// get all the series
server.get('/series', async (req, res) => {
    const seriesList = await prisma.series.findMany();
    res.status(200).json(seriesList);
});

// get all the seasons
server.get('/season', async (req, res) => {
    const seasonList = await prisma.season.findMany();
    res.status(200).json(seasonList);
});

// delete a row by id
server.delete('/series/:id', async (req, res) => {
    const seriesId = parseInt(req.params.id);
  
    const isSeries = await prisma.series.findUnique({
      where: { id: seriesId },
    });
  
    if (!isSeries) {
      return res.status(404).json({ error: 'Series not found' });
    }

    await prisma.season.deleteMany({
      where: { series_id: seriesId },
    });
  
    await prisma.series.delete({
      where: { id: seriesId },
    });
  
    res.status(204).send({ message: 'Series deleted' });
  });
  

// update a row by id
server.put('/series/:id', async (req, res) => {
    const seriesId = parseInt(req.params.id);

    const isSeries = await prisma.series.findUnique({
        where: { id: seriesId },
    });

    if (!isSeries) {
        return res.status(404).json({ error: 'Series not found' });
    }

    const series = await prisma.series.update({
        where: { id: seriesId },
        data: req.body,
    });
    res.status(200).json(series);
});

// get all season details from a given id
server.get('/series/:id', async (req, res) => {
    const seriesId = parseInt(req.params.id);

    const isSeries = await prisma.series.findUnique({
        where: { id: seriesId },
        include: { seasons: true }
    }
    );

    if (!isSeries) {
        return res.status(404).json({ error: 'Series not found' });
    }

    res.status(200).json(isSeries);
})



