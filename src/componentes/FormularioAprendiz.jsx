import React from "react";
import { Paper, Typography, Stack, TextField, Button, MenuItem } from "@mui/material";

const FormularioAprendiz = ({ form, setForm, editId, loading, crearAprendiz, actualizarAprendiz, limpiarFormulario, inputSX }) => {
  return (
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
  );
};

export default FormularioAprendiz;