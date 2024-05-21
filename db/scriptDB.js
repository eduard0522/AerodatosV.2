/*
  -------------- USUARIOS --------
CREATE TABLE usuarios(
	id_usuario VARCHAR(150) primary key,
 	nombre_usuario VARCHAR(255),
  correo VARCHAR(255),
  rol VARCHAR (50),
  clave VARCHAR (255)
);

--------- PASILLOS  ------------
CREATE TABLE pasillos(
    id_pasillo INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    numero_pasillo VARCHAR(20)
);

------- EXPEDIENTES ----------

CREATE TABLE expedientes( 
  id_expediente INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   nombre_expediente VARCHAR(255),
    numero_expediente VARCHAR(150), 
    estado_organizativo BOOLEAN, 
    serie_documental INT,
    caja INT, 
    estante INT,
    pasillo INT,
    FOREIGN KEY (serie_documental) REFERENCES serie_documental (id_serie), 
    FOREIGN KEY (pasillo) REFERENCES pasillos(id_pasillo) );

----------------- VISTA EXPEDIENTES ----------------

CREATE VIEW expedientes_vista AS SELECT ex.id_expediente, ex.nombre_expediente, ex.numero_expediente, ex.estado_organizativo,se.nombre_serie AS nombre_serie, ex.caja,ex.estante, pas.numero_pasillo FROM expedientes AS ex INNER JOIN pasillos AS pas ON id_pasillo = ex.pasillo INNER JOIN serie_documental AS se ON se.id_serie = ex.serie_documental;

*/