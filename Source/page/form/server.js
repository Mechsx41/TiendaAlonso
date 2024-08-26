const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/guardar-pedido', (req, res) => {
    const pedido = req.body;
    const filePath = path.join(__dirname, 'pedidos.json');

    console.log('Recibiendo pedido:', pedido);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ message: 'Error al leer el archivo' });
        }

        let pedidos = [];
        try {
            pedidos = JSON.parse(data);
        } catch (parseError) {
            console.error('Error al parsear el archivo:', parseError);
            return res.status(500).json({ message: 'Error al parsear el archivo' });
        }

        pedidos.push(pedido);

        fs.writeFile(filePath, JSON.stringify(pedidos, null, 2), 'utf8', (writeError) => {
            if (writeError) {
                console.error('Error al guardar el pedido:', writeError);
                return res.status(500).json({ message: 'Error al guardar el pedido' });
            }
            console.log('Pedido guardado exitosamente.');
            res.json({ message: 'Pedido guardado correctamente' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
