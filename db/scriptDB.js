/*
  -------------- USUARIOS --------
CREATE TABLE usuarios(
	id_usuario VARCHAR(150) primary key,
 	nombre_usuario VARCHAR(255),
  correo VARCHAR(255),
  rol VARCHAR (50),
  clave VARCHAR (255)
);

------------- CAJAS ---------

CREATE TABLE cajas( numero_caja INT NOT NULL PRIMARY KEY );


--------- PASILLOS ------------

CREATE TABLE pasillos(
    id_pasillo INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    numero_pasillo VARCHAR(20)
);

------ ESTANTES --------
CREATE TABLE estantes(
numero_estante INT  NOT NULL PRIMARY KEY
);

------- EXPEDIENTES -----------

CREATE TABLE expedientes(
	id_expediente INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre_expediente VARCHAR(255),
    numero_expediente VARCHAR(150),
    estado_organizativo BOOLEAN,
    serie_documental VARCHAR(255),
    caja INT,
    estante INT,
    pasillo INT,
    FOREIGN KEY (caja) REFERENCES 		cajas(numero_caja),
    FOREIGN KEY (estante) REFERENCES 	 estantes(numero_estante),
    FOREIGN KEY (pasillo) REFERENCES 	 pasillos(id_pasillo)
);

----------------- VISTA EXPEDIENTES ----------------

CREATE VIEW expedientes_vista AS SELECT ex.id_expediente, ex.nombre_expediente, ex.numero_expediente, ex.estado_organizativo,ex.serie_documental AS nombre_serie, ex.caja,ex.estante, pas.numero_pasillo FROM expedientes AS ex INNER JOIN pasillos AS pas ON id_pasillo = ex.pasillo;


*/