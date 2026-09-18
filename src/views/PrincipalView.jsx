import React, { useState } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Button, TextField, Stack, CssBaseline, MenuItem
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#22d3ee" },       // cian
    secondary: { main: "#a78bfa" },     // violeta
    error: { main: "#ef4444" },
    background: { default: "#0b1220", paper: "#111827" }, // dark limpio
    text: { primary: "#e5e7eb", secondary: "#94a3b8" }
  }
});

const inputSX = {
  bgcolor: "#f3f4f6",       // fondo claro para inputs
  borderRadius: 1,
  input: { color: "#111827" },
  "& .MuiInputLabel-root": { color: "#374151" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#94a3b8" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#22d3ee" }
};

const ListaAprendices = () => {
  const API_BASE = "http://localhost:8080/api/v1/aprendiz";
  //const API_BASE = "https://backadso-production.up.railway.app/api/v1/aprendiz"


  //  Por qué hacemos esto: El formulario de React es ciego;
  //  no sabe si estás llenando datos para crear alguien nuevo o para actualizar a alguien viejo.
  //  Esta variable editId guardará el ID de la persona que estamos editando.
  //  Si está en null, React sabrá que estamos en modo "Crear".

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", telefono: "", direccion: "", fechaNacimiento: "", programaFormacion: "", estado: "", genero: "", documento: "" });
  const [idFiltro, setIdFiltro] = useState("");
  const [editId, setEditId] = useState(null);

  const limpiarFormulario = () => {
  setForm({ 
    nombre: "", apellido: "", email: "", telefono: "", direccion: "", 
    fechaNacimiento: "", programaFormacion: "", estado: "", genero: "", documento: "" 
  });
  setEditId(null); // Aquí aseguramos que el formulario olvide el ID y vuelva a modo "Crear"
  };

  const prepararDatosParaEnvio = () => {
  return {
    ...form,
    fechaNacimiento: form.fechaNacimiento === "" ? null : form.fechaNacimiento,
    estado: form.estado === "" ? null : form.estado,
    genero: form.genero === "" ? null : form.genero
   };
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      setData(res.data || []);
    } catch (e) {
      console.error("Error cargando aprendices:", e);
      setData([]);
    } finally { setLoading(false); }
  };

  const fetchPorId = async () => {
    if (!idFiltro) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/${idFiltro}`);
      setData(res.data ? [res.data] : []);
    } catch { setData([]); } finally { setLoading(false); }
  };

  const crearAprendiz = async () => {
    try {
      setLoading(true);
      await axios.post(API_BASE, form, { headers: { "Content-Type": "application/json" } });
      limpiarFormulario(); // <-- Reemplazamos el setForm manual por nuestra nueva función completa
      await fetchTodos();
    } catch (e) { console.error("Error creando aprendiz:", e); }
    finally { setLoading(false); }
  };

  const eliminarPorId = async () => {
    if (!idFiltro) return;
    try { setLoading(true); await axios.delete(`${API_BASE}/${idFiltro}`); await fetchTodos(); }
    catch (e) { console.error("Error eliminando aprendiz:", e); }
    finally { setLoading(false); }
  };

  const cargarParaEditarDesdeInput = async () => {
  if (!idFiltro) {
    alert("Por favor, ingresa un ID en la barra superior para editar.");
    return;
  }

  try {
    setLoading(true);
    // Hacemos un GET al backend con el ID específico
    const res = await axios.get(`${API_BASE}/${idFiltro}`);
    const aprendiz = res.data;

    if (aprendiz) {
      // Llenamos las 10 casillas del formulario con los datos que llegaron
      setForm({
        nombre: aprendiz.nombre || "",
        apellido: aprendiz.apellido || "",
        email: aprendiz.email || "",
        telefono: aprendiz.telefono || "",
        direccion: aprendiz.direccion || "",
        fechaNacimiento: aprendiz.fechaNacimiento || "",
        programaFormacion: aprendiz.programaFormacion || "",
        estado: aprendiz.estado || "",
        genero: aprendiz.genero || "",
        documento: aprendiz.documento || ""
      });
      // ¡Clave! Le decimos a React que ahora estamos en modo "Edición"
      setEditId(aprendiz.id);
    }
  } catch (e) {
    alert("No se encontró ningún aprendiz con ese ID.");
  } finally {
    setLoading(false);
  }
};

  const actualizarAprendiz = async () => {
  try {
    setLoading(true);
    // Usamos la función que ya tenía para limpiar los nulos antes de enviar
    const datosAEnviar = prepararDatosParaEnvio();

    // Axios.put es el método estándar para actualizar en APIs REST
    await axios.put(`${API_BASE}/${editId}`, datosAEnviar, { headers: { "Content-Type": "application/json" } });

    alert("¡Aprendiz actualizado correctamente!");
    limpiarFormulario();
    await fetchTodos();
  } catch (e) { 
    alert("Error al actualizar: " + (e.response?.data?.message || e.message));
  } finally { setLoading(false); }
};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ mt: 4, px: { xs: 2, md: 4 } }}>
        {/* Barra de acciones */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ flex: 1, fontWeight: 700, color: "text.primary" }}>
            Aprendices
          </Typography>
          <Button variant="contained" color="primary" onClick={fetchTodos} disabled={loading}>
            {loading ? "Cargando..." : "VER TODOS"}
          </Button>
          <TextField
            size="small" label="ID" value={idFiltro} onChange={(e) => setIdFiltro(e.target.value)}
            sx={{ ...inputSX, width: 140 }}
          />
          <Button variant="contained" color="secondary" onClick={fetchPorId} disabled={loading || !idFiltro}>
            BUSCAR POR ID
          </Button>
          <Button variant="contained" color="secondary" onClick={cargarParaEditarDesdeInput} disabled={loading || !idFiltro}>
          ACTUALIZAR POR ID
          </Button>
          <Button variant="contained" color="error" onClick={eliminarPorId} disabled={loading || !idFiltro}>
            ELIMINAR POR ID
          </Button>
        </Stack>

        {/* Formulario creación */}
      <Paper elevation={4} sx={{ p: 2, mb: 3, border: "1px solid #334155", bgcolor: "background.paper" }}>
       <Typography sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
        {editId ? `Actualizando Aprendiz ID: ${editId}` : "Crear nuevo aprendiz"}
      </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} useFlexGap flexWrap="wrap">
            <TextField label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} sx={{ ...inputSX, flex: "1 1 200px" }} />
            <TextField label="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} sx={{ ...inputSX, flex: "1 1 200px" }} />
            <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} sx={{ ...inputSX, flex: "1 1 200px" }} />
            <TextField label="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} sx={{ ...inputSX, flex: "1 1 200px" }} />
            <TextField label="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} sx={{ ...inputSX, flex: "1 1 200px" }} />
            
            {/* PASO 3: Agregamos los 5 Inputs visuales al formulario. Usamos type="date" para el calendario y "select" para forzar opciones fijas en los enums. */}
            <TextField label="Fecha Nacimiento" type="date" value={form.fechaNacimiento || ""} InputLabelProps={{ shrink: true }} onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })} sx={{ ...inputSX, flex: "1 1 200px" }} />
            <TextField label="Programa Formación" value={form.programaFormacion} onChange={(e) => setForm({ ...form, programaFormacion: e.target.value })} sx={{ ...inputSX, flex: "1 1 200px" }} />
            
            <TextField select label="Estado" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} sx={{ ...inputSX, flex: "1 1 200px" }}>
              <MenuItem value="ACTIVO">Activo</MenuItem>
              <MenuItem value="INACTIVO">Inactivo</MenuItem>
            </TextField>
            
            <TextField select label="Género" value={form.genero} onChange={(e) => setForm({ ...form, genero: e.target.value })} sx={{ ...inputSX, flex: "1 1 200px" }}>
              <MenuItem value="MASCULINO">Masculino</MenuItem>
              <MenuItem value="FEMENINO">Femenino</MenuItem>
            </TextField>

            <TextField label="Documento" value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} sx={{ ...inputSX, flex: "1 1 200px" }} />
           </Stack>
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
          {editId && (
           <Button variant="outlined" color="error" onClick={limpiarFormulario}>
             CANCELAR EDICIÓN
           </Button>
          )}
          <Button variant="contained" color={editId ? "secondary" : "primary"} onClick={editId ? actualizarAprendiz : crearAprendiz} disabled={loading}>
            {editId ? "GUARDAR CAMBIOS" : "CREAR"}
          </Button>
        </Stack>
        </Paper>

        {/* Tabla */}
        <TableContainer component={Paper} elevation={3} sx={{ border: "1px solid #334155", bgcolor: "background.paper" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#22d3ee" }}>
                {["ID","Nombre","Apellido","Email","Teléfono","Dirección","Fecha Nac.","Programa","Estado","Género","Documento"].map((h) => (
                  <TableCell key={h} sx={{ color: "#0b1220", fontWeight: 700 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <TableRow
                  key={row.id ?? i}
                  sx={{
                    backgroundColor: i % 2 === 0 ? "#0f172a" : "#111827",
                    "&:hover": { backgroundColor: "#1f2937" }
                  }}
                >
                  <TableCell sx={{ color: "text.primary" }}>{row.id}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.nombre}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.apellido}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.email}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.telefono}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.direccion}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.fechaNacimiento}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.programaFormacion}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.estado}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.genero}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.documento}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: "text.secondary" }}>
                    Sin registros
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
};

export default ListaAprendices;
