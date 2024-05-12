
/** VISTA */
/* 
CREATE VIEW expedientes_vista AS SELECT  e.id_expediente, e.nombre_expediente,e.numero_expediente,e.estado_organizativo,e.caja,e.estante, s.nombre_serie,s.numero_Serie,t.nombre_tipo,p.numero_pasillo FROM expedientes AS e INNER JOIN serie_documental AS s ON e.serie_documental = s.id_serie INNER JOIN tipo_documento AS t ON e.tipo_expediente = t.id_tipo INNER JOIN pasillos AS p ON e.pasillo = p.id_pasillo; */