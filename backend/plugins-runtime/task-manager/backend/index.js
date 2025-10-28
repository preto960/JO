"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasks_1 = __importDefault(require("./routes/tasks"));
// Este archivo será el punto de entrada del plugin en el backend
// Las rutas se montarán en /api/plugins/task-manager
const router = (0, express_1.Router)();
// Montar las rutas de tareas
router.use('/', tasks_1.default);
exports.default = router;
