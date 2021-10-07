const express = require("express");
const ProductosCtrl = require("./controllers/ProductosCtrl");

const productosCtrl = new ProductosCtrl();

const router = express.Router();

router.get("/productos/listar", async (req, res) => {
    await productosCtrl.listar(req, res);
});

router.get("/productos/listar/:id", async (req, res) => {
    await productosCtrl.listarPorId(req, res);
});

router.post("/productos/guardar", async (req, res) => {
    await productosCtrl.insertar(req, res);
});

router.put("/productos/actualizar/:id", async (req, res) => {
    await productosCtrl.actualizar(req, res);
});

router.delete("/productos/eliminar/:id", async (req, res) => {
    await productosCtrl.eliminar(req, res);
});

module.exports = router;