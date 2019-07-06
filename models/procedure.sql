CREATE DEFINER=`root`@`localhost` PROCEDURE `aprova_reserva`()
BEGIN

CREATE TEMPORARY TABLE reserva_evento (rid int, eid int, estado int);
INSERT INTO reserva_evento
	SELECT r.id AS rid, e.id AS eid, r.estado AS estado
    FROM evento e
    INNER JOIN reserva r
    ON r.id = e.reserva_id;

UPDATE reserva res
SET res.estado = 
	CASE WHEN
		(
			(
				SELECT COUNT(id)
				FROM evento
				WHERE reserva_id = res.id
			) = (	
				SELECT COUNT(e1.id)
				FROM evento e1
				INNER JOIN evento e2
				ON e1.dia = e2.dia
				AND e1.horario_id = e2.horario_id
				AND e1.sala_numero = e2.sala_numero
				INNER JOIN reserva_evento re
				ON re.eid = e2.id
				WHERE e1.reserva_id = res.id
				AND re.estado != 1
			)
		)
	THEN 2
    ELSE 1
    END
WHERE res.estado = 0;
DROP TABLE IF EXISTS reserva_evento;
END