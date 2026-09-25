import React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const TablaAprendices = ({ data }) => {
  return (
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
              <TableCell colSpan={11} align="center" sx={{ color: "text.secondary" }}>
                Sin registros
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaAprendices;