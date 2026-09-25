import React, { useState } from "react";
import { Box, Typography, Button, TextField, Stack, CssBaseline, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getAprendices, getAprendizById, createAprendiz, updateAprendiz, deleteAprendiz } from "../service/aprendizService";
import FormularioAprendiz from "../componente/FormularioAprendiz";
import TablaAprendices from "../componente/TablaAprendices";

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
  // Fuerza el color oscuro en los inputs de texto normales
  "& .MuiInputBase-input": { color: "#111827" },
  // Fuerza el color oscuro específicamente en los selectores (dropdowns)
  "& .MuiSelect-select": { color: "#111827", fontWeight: "bold" },
  "& .MuiInputLabel-root": { color: "#374151" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#94a3b8" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#22d3ee" }
};

const ListaAprendices = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", telefono: "", direccion: "", fechaNacimiento: "", programaFormacion: "", estado: "", genero: "", documento: "" });
  const [idFiltro, setIdFiltro] = useState("");
  const [editId, setEditId] = useState(null);
  
  // NUEVO: Estado para controlar qué base de datos usar
  const [dbType, setDbType] = useState("mysql");

  const limpiarFormulario = () => {
    setForm({ 
      nombre: "", apellido: "", email: "", telefono: "", direccion: "", 
      fechaNacimiento: "", programaFormacion: "", estado: "", genero: "", documento: "" 
    });
    setEditId(null); 
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
      const datos = await getAprendices(dbType);
      setData(datos || []);
    } catch (e) {
      console.error("Error cargando aprendices:", e);
      setData([]);
    } finally { setLoading(false); }
  };

  const fetchPorId = async () => {
    if (!idFiltro) return;
    try {
      setLoading(true);
      const aprendiz = await getAprendizById(idFiltro, dbType);
      setData(aprendiz ? [aprendiz] : []);
    } catch { setData([]); } finally { setLoading(false); }
  };

  const crearAprendiz = async () => {
    try {
      setLoading(true);
      const datosAEnviar = prepararDatosParaEnvio();
      await createAprendiz(datosAEnviar, dbType);
      limpiarFormulario();
      await fetchTodos();
    } catch (e) { console.error("Error creando aprendiz:", e); }
    finally { setLoading(false); }
  };

  const eliminarPorId = async () => {
    if (!idFiltro) return;
    try { 
      setLoading(true); 
      await deleteAprendiz(idFiltro, dbType); 
      await fetchTodos(); 
    } catch (e) { console.error("Error eliminando aprendiz:", e); }
    finally { setLoading(false); }
  };

  const cargarParaEditarDesdeInput = async () => {
    if (!idFiltro) {
      alert("Por favor, ingresa un ID en la barra superior para editar.");
      return;
    }
    try {
      setLoading(true);
      const aprendiz = await getAprendizById(idFiltro, dbType);
      if (aprendiz) {
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
        // IMPORTANTE: Mongo usa _id, MySQL usa id
        setEditId(aprendiz.id || aprendiz._id);
      }
    } catch (e) { alert("No se encontró ningún aprendiz con ese ID."); } 
    finally { setLoading(false); }
  };

  const actualizarAprendiz = async () => {
    try {
      setLoading(true);
      const datosAEnviar = prepararDatosParaEnvio();
      await updateAprendiz(editId, datosAEnviar, dbType);
      alert("¡Aprendiz actualizado correctamente!");
      limpiarFormulario();
      await fetchTodos();
    } catch (e) { alert("Error al actualizar"); } 
    finally { setLoading(false); }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ mt: 4, px: { xs: 2, md: 4 } }}>
        
        {/* Barra superior de botones */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ flex: 1, fontWeight: 700, color: "text.primary" }}>
            Aprendices
          </Typography>

          {/* NUEVO: Selector de Base de Datos */}
          <FormControl size="small">
            <Select
              value={dbType}
              onChange={(e) => {
                setDbType(e.target.value);
                setData([]); // Limpiamos la tabla al cambiar de DB
                limpiarFormulario();
              }}
              sx={{ ...inputSX, width: 130, fontWeight: 'bold' }}
            >
              <MenuItem value="mysql">MySQL</MenuItem>
              <MenuItem value="mongo">MongoDB</MenuItem>
            </Select>
          </FormControl>

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

        <FormularioAprendiz 
          form={form} 
          setForm={setForm} 
          editId={editId} 
          loading={loading} 
          crearAprendiz={crearAprendiz} 
          actualizarAprendiz={actualizarAprendiz} 
          limpiarFormulario={limpiarFormulario} 
          inputSX={inputSX} 
        />

        <TablaAprendices data={data} />
        
      </Box>
    </ThemeProvider>
  );
};

export default ListaAprendices;