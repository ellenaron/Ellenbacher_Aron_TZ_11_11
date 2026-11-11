SELECT s.*, k.nev as kategoria_nev FROM szolgaltatasok s INNER JOIN kategoriak k ON s.kategoria_id = k.id;

SELECT * FROM szolgaltatasok WHERE aktiv = 1 AND munkaido_perc <= 60;

SELECT * FROM szolgaltatasok WHERE megnevezes LIKE "?";

SELECT k.nev AS kategoria_nev, COUNT(s.id) AS szolgaltatasok_szama, AVG(s.alapar) AS atlagos_alapat FROM kategoriak k INNER JOIN szolgaltatasok s ON k.id = s.kategoria_id GROUP BY k.nev;

SELECT megnevezes, alapar, munkaido_perc FROM szolgaltatasok WHERE alapar > 25000 ORDER BY munkaido_perc DESC;