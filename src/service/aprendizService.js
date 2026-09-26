import axios from "axios";

//ruta base apuntando al servidor Flask
//const FLASK_BASE = "http://127.0.0.1:5000/api/v1";

// ruta base apuntando al servidor Flask en Railway
const FLASK_BASE = "https://backend-api-aprendiz-production.up.railway.app/api/v1";


// Función auxiliar para elegir la URL según la base de datos seleccionada
const getUrl = (dbType) => {
  return dbType === "mongo" 
    ? `${FLASK_BASE}/mongo/aprendices` 
    : `${FLASK_BASE}/aprendices`;
};

// Por defecto usará MySQL ('mysql'), pero si le cambio 'mongo' cambiará la automáticamente
export const getAprendices = async (dbType = "mysql") => {
  const response = await axios.get(getUrl(dbType));
  return response.data;
};

export const getAprendizById = async (id, dbType = "mysql") => {
  const response = await axios.get(`${getUrl(dbType)}/${id}`);
  return response.data;
};

export const createAprendiz = async (datos, dbType = "mysql") => {
  const response = await axios.post(getUrl(dbType), datos, { 
    headers: { "Content-Type": "application/json" } 
  });
  return response.data;
};

export const updateAprendiz = async (id, datos, dbType = "mysql") => {
  const response = await axios.put(`${getUrl(dbType)}/${id}`, datos, { 
    headers: { "Content-Type": "application/json" } 
  });
  return response.data;
};

export const deleteAprendiz = async (id, dbType = "mysql") => {
  const response = await axios.delete(`${getUrl(dbType)}/${id}`);
  return response.data;
};