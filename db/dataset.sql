-- ///////////////////////////////////// CREATE DATABASE ///////////////////////////////////////////
DROP DATABASE IF EXISTS heroku_7a3354ff527dacc;

CREATE DATABASE heroku_7a3354ff527dacc;

USE heroku_7a3354ff527dacc;

SET @@auto_increment_increment = 1;
-- ///////////////////////////////////// CREATE TABLES ///////////////////////////////////////////
CREATE TABLE usuarios (
	id MEDIUMINT UNSIGNED AUTO_INCREMENT,
	nombreUsuario VARCHAR(20),
    clave VARCHAR(20),
    mail VARCHAR(50),
    rol CHAR(1),
    
    PRIMARY KEY(id)
);

ALTER TABLE usuarios AUTO_INCREMENT = 1000;

CREATE TABLE marcas (
	id SMALLINT UNSIGNED AUTO_INCREMENT,
    nombre VARCHAR(25),
    
    PRIMARY KEY(id)
);

CREATE TABLE categorias (
	id TINYINT UNSIGNED AUTO_INCREMENT,
    nombre VARCHAR(30),
    
    PRIMARY KEY(id)
);

ALTER TABLE categorias AUTO_INCREMENT = 1;

CREATE TABLE productos (
	id VARCHAR(20), -- pasar '0' para generar un id aleatorio
    nombre VARCHAR(40),
    cantidad SMALLINT UNSIGNED,
    unidad VARCHAR(10),
    marca SMALLINT UNSIGNED,
    categoria TINYINT UNSIGNED,
    precio DECIMAL,
    imagen VARCHAR(30),
    stock SMALLINT UNSIGNED,
    activo BOOL,
    
    PRIMARY KEY(id),
    FOREIGN KEY(marca) REFERENCES marcas(id),
    FOREIGN KEY(categoria) REFERENCES categorias(id)
);

CREATE TABLE ordenes (
	id INT, -- se pasa desde app.js
    total decimal,
    fechayhora DATETIME,
    cliente MEDIUMINT UNSIGNED,
    fechaEntrega DATETIME,
    entregado BOOL,
    
    PRIMARY KEY(id),
    FOREIGN KEY(cliente) REFERENCES usuarios(id)
);

CREATE TABLE ordenes_productos (
	-- Colección de productos de cada orden
	orden_id INT,
    producto_id VARCHAR(20),
    cantidad TINYINT UNSIGNED,
    
    FOREIGN KEY(orden_id) REFERENCES ordenes(id),
    FOREIGN KEY(producto_id) REFERENCES productos(id)
    
);


-- ///////////////////////////////////// CREATE STORED PROCEDURES ///////////////////////////////////////////
DELIMITER //
CREATE PROCEDURE AltaUsuario(IN _nombreUsuario VARCHAR(20), 
							 IN _clave VARCHAR(20), 
                             IN _mail VARCHAR(50), 
                             IN _rol CHAR)
BEGIN
	INSERT INTO usuarios VALUES(0, _nombreUsuario, _clave, _mail, _rol);
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE AltaCategoria(IN _nombre VARCHAR(30))
BEGIN
	INSERT INTO categorias VALUES(0, _nombre);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE AltaMarca(IN _nombre VARCHAR(25))
BEGIN
	INSERT INTO marcas VALUES(0, _nombre);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE AltaOrden(IN _id INT, 
						   IN _total decimal,
						   IN _cliente MEDIUMINT UNSIGNED, 
                           IN _fechaEntrega DATETIME)
BEGIN
	INSERT INTO ordenes VALUES(_id, _total, NOW(), _cliente, _fechaEntrega, 0);
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE AltaProducto(IN _id VARCHAR(20), 
							  IN _nombre VARCHAR(40), 
                              IN _cantidad SMALLINT UNSIGNED, 
                              IN _unidad VARCHAR(10), 
                              IN _marca_id SMALLINT UNSIGNED, 
                              IN _categoria_id TINYINT UNSIGNED, 
                              IN _precio DECIMAL, 
                              IN _imagen VARCHAR(30), 
                              IN _stock SMALLINT UNSIGNED, 
                              IN _activo BOOL)
BEGIN
    IF _id = '0' THEN SET _id = FLOOR(RAND()*(1000000000000-5+1)+5);
    END IF;
    
	INSERT INTO productos VALUES(_id, _nombre, _cantidad, _unidad, _marca_id, _categoria_id, _precio, _imagen, _stock, _activo);
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE AltaProductosPorOrden(IN _orden_id INT, 
									   IN _producto_id VARCHAR(20), 
									   IN cantidad TINYINT UNSIGNED)
BEGIN
	INSERT INTO ordenes_productos VALUES(_orden_id, _producto_id, cantidad);
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE BajaCategoria(IN _id TINYINT UNSIGNED)
BEGIN
	DELETE FROM categorias WHERE id = _id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE BajaMarca(IN _id SMALLINT UNSIGNED)
BEGIN
	DELETE FROM marcas WHERE id = _id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE BajaUsuario(IN _id MEDIUMINT UNSIGNED)
BEGIN
	DELETE FROM usuarios WHERE id = _id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE BajaProducto(IN _id VARCHAR(20))
BEGIN
	DELETE FROM productos WHERE id = _id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ModificarUsuario(IN _id MEDIUMINT UNSIGNED, 
								  IN _nombreUsuario VARCHAR(20), 
                                  IN _clave VARCHAR(20), 
                                  IN _mail VARCHAR(50), 
                                  IN _rol CHAR)
BEGIN
	UPDATE usuarios SET nombreUsuario = _nombreUsuario, clave = _clave, mail = _mail, rol = _rol
    WHERE id = _id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ModificarCategoria(IN _id TINYINT UNSIGNED, 
							        IN _nombre VARCHAR(20))
BEGIN
	UPDATE categorias SET nombre = _nombre
    WHERE id = _id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ModificarMarca(IN _id SMALLINT UNSIGNED, 
								IN _nombre VARCHAR(25))
BEGIN
	UPDATE marcas SET nombre = _nombre
    WHERE id = _id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ModificarOrden(IN _id INT, 
								IN _total decimal,
								IN _fechaEntrega DATETIME, 
								IN _entregado BOOL)
BEGIN
	UPDATE ordenes SET fechaEntrega = _fechaEntrega, entregado = _entregado
    WHERE id = _id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ModificarProducto(IN _id VARCHAR(20), 
								   IN _nombre VARCHAR(30), 
                                   IN _cantidad SMALLINT UNSIGNED, 
                                   IN _unidad VARCHAR(10), 
                                   IN _marca_id SMALLINT UNSIGNED, 
                                   IN _categoria_id TINYINT UNSIGNED, 
                                   IN _precio DECIMAL, 
                                   IN _imagen VARCHAR(30), 
                                   IN _stock SMALLINT UNSIGNED, 
                                   IN _activo BOOL)
BEGIN
	UPDATE productos SET nombre = _nombre, cantidad = _cantidad, 
						unidad = _unidad, marca = _marca_id, categoria = _categoria_id,
                        precio = _precio, imagen = _imagen, stock = _stock, activo = _activo
	WHERE id = _id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ListarUsuarios()
BEGIN
	SELECT
		usuarios.id,
        usuarios.nombreUsuario,
        usuarios.mail,
        usuarios.rol
    FROM usuarios;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ListarMarcas()
BEGIN
	SELECT * FROM marcas;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ListarCategorias()
BEGIN
	SELECT * FROM categorias;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ListarProductos()
BEGIN
	SELECT 
		productos.id,
        productos.nombre,
        productos.cantidad,
        productos.unidad,
        marcas.nombre AS marca,
		categorias.nombre AS categoria,
        productos.precio,
        productos.imagen,
        productos.stock,
        productos.activo
	FROM productos 
    INNER JOIN marcas
    ON productos.marca = marcas.id
    INNER JOIN categorias
    ON productos.categoria = categorias.id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ListarOrdenes()
BEGIN
	SELECT
		ordenes.id,
        ordenes.total,
        ordenes.fechayhora,
        usuarios.id AS cliente,
        ordenes.fechaEntrega,
        ordenes.entregado
    FROM ordenes
    INNER JOIN usuarios
    ON ordenes.cliente = usuarios.id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ListarOrdenesPorCliente(IN _idCliente MEDIUMINT UNSIGNED)
BEGIN
	SELECT
		ordenes.id,
        ordenes.fechayhora,
        ordenes.fechaEntrega,
        ordenes.entregado
    FROM ordenes
    INNER JOIN usuarios
    ON ordenes.cliente = usuarios.id
    WHERE usuarios.id = _idCliente;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ListarProductosPorOrden(IN _ordenId INT)
BEGIN
	SELECT
		orden_id,
        producto_id
    FROM ordenes_productos
    WHERE orden_id = _ordenId;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ListarProductosPorCategoria(IN _categoria VARCHAR(30))
BEGIN
	SELECT 
		productos.id,
        productos.nombre,
        productos.cantidad,
        productos.unidad,
        marcas.nombre AS marca,
		categorias.nombre AS categoria,
        productos.precio,
        productos.imagen,
        productos.stock
	FROM productos 
    INNER JOIN marcas
    ON productos.marca = marcas.id
    INNER JOIN categorias
    ON productos.categoria = categorias.id
    WHERE categorias.nombre = _categoria 
    AND productos.activo = 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ListarOfertas()
BEGIN
	SELECT
		productos.id,
        productos.nombre,
        productos.cantidad,
        productos.unidad,
        marcas.nombre AS marca,
		categorias.nombre AS categoria,
        productos.precio,
        productos.imagen,
        productos.stock
	FROM productos 
    INNER JOIN marcas
    ON productos.marca = marcas.id
    INNER JOIN categorias
    ON productos.categoria = categorias.id
    WHERE productos.activo = 1
    ORDER BY
		productos.precio ASC
	LIMIT 12;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ListarMasVendidos()
BEGIN
	SELECT
		productos.id,
        productos.nombre,
        productos.cantidad,
        productos.unidad,
        marcas.nombre AS marca,
		categorias.nombre AS categoria,
        productos.precio,
        productos.imagen,
        productos.stock
	FROM productos 
    INNER JOIN marcas
    ON productos.marca = marcas.id
    INNER JOIN categorias
    ON productos.categoria = categorias.id
    WHERE productos.activo = 1
	LIMIT 12;
END //
DELIMITER ;

-- ///////////////////////////////////// INSERT SAMPLE DATA ///////////////////////////////////////////

call AltaMarca('Beyond Meat');
call AltaMarca('Etosha');
call AltaMarca('Follow your heart');
call AltaMarca('La Abundancia');
call AltaMarca('La sin rival');
call AltaMarca('Naturezas');
call AltaMarca('Ardo');
call AltaMarca('Delicia');
call AltaMarca('Orgran');
call AltaMarca('Prana');
call AltaMarca('Vegetalex');
call AltaMarca('Silk');
call AltaMarca('Heinz');
call AltaMarca('Hemmer');
call AltaMarca('Valsoia');
call AltaMarca('The Bridge');
call AltaMarca('Violife');
call AltaMarca('Madre Tierra');
call AltaMarca('Cavallaro');
call AltaMarca('Veganis');
call AltaMarca('Sabina');

call AltaCategoria('Granos y semillas');
call AltaCategoria('Bebidas');
call AltaCategoria('Aderezos');
call AltaCategoria('Leches vegetales');
call AltaCategoria('Quesos y fiambres veganos');
call AltaCategoria('Congelados');
call AltaCategoria('Cuidado personal');

call AltaProducto('1654', 'Semillas de chia', 200, 'g', 4, 1, 75, '1654.jpg', 20, TRUE);
call AltaProducto('9865', 'Semillas de lino', 450, 'g', 4, 1, 150, '9865.jpg', 20, TRUE);
call AltaProducto('9652', 'Avena laminada', 1, 'kg', 4, 1, 136, '9652.jpg', 20, TRUE);
call AltaProducto('6470', 'Avena arrollada', 500, 'g', 18, 1, 70, '6470.jpg', 20, TRUE);
 
call AltaProducto('3002', 'Kombucha sabor mandarina', 330, 'mL', 10, 2, 145, '3002.jpg', 20, TRUE);
call AltaProducto('3003', 'Kombucha', 330, 'mL', 10, 2, 145, '3003.jpg', 20, TRUE);
call AltaProducto('3004', 'Kombucha sabor berries', 330, 'mL', 10, 2, 145, '3004.jpg', 20, TRUE);

call AltaProducto('7521', 'Mayonesa', 425, 'mL', 3, 3, 265, '7521.jpg', 20, TRUE);
call AltaProducto('9851', 'Mayonesa', 500, 'g', 8, 3, 105, '9851.jpg', 20, TRUE);
call AltaProducto('5324', 'Ketchup', 397, 'g', 13, 3, 99, '5324.jpg', 20, TRUE);
call AltaProducto('9317', 'Salsa barbacoa', 330, 'g', 14, 3, 70, '9317.jpg', 20, TRUE);

call AltaProducto('3210', 'Bebida de almendras', 1, 'L', 15, 4, 150, '3210.jpg', 20, TRUE);
call AltaProducto('6325', 'Leche vegetal de nueces', 1, 'L', 15, 4, 150, '6325.jpg', 20, TRUE);
call AltaProducto('9746', 'Bebida de arroz sabor coco', 1, 'L', 16, 4, 235, '9746.jpg', 20, TRUE);
call AltaProducto('7745', 'Bebida de arroz sabor chocolate', 1, 'L', 16, 4, 185, '7745.jpg', 20, TRUE);

call AltaProducto('2020', 'Vegarella', 200, 'g', 2, 5, 180, '2020.jpg', 20, TRUE);
call AltaProducto('8874', 'Rawmesan', 180, 'g', 10, 5, 210, '8874.jpg', 20, TRUE);
call AltaProducto('4110', 'Tofu', 500, 'g', 5, 5, 210, '4110.jpg', 20, TRUE);
call AltaProducto('5310', 'Queso en fetas', 200, 'g', 17, 5, 220, '5310.jpg', 20, TRUE);

call AltaProducto('5630', 'Carne picada vegetal', 250, 'g', 1, 6, 395, '5630.jpg', 20, TRUE);
call AltaProducto('3579', 'Medallones de espinaca', 4, 'unidades', 11, 6, 150, '3579.jpg', 20, TRUE);
call AltaProducto('9630', 'Milanesas multicereal de trigo', 400, 'g', 6, 6, 350, '9630.jpg', 20, TRUE);
call AltaProducto('2310', 'Hamburguesas de col y quinoa', 1200, 'g', 9, 6, 295, '2310.jpg', 20, TRUE);

call AltaProducto('7412', 'Jabon de coco', 200, 'g', 19, 7, 59, '7412.jpg', 20, TRUE);
call AltaProducto('5912', 'Crema exfoliante', 500, 'g', 20, 7, 550, '5912.jpg', 20, TRUE);
call AltaProducto('3365', 'Crema antiedad', 500, 'g', 20, 7, 550, '3365.jpg', 20, TRUE);
call AltaProducto('2223', 'Jabon líquido', 300, 'cc', 21, 7, 105, '2223.jpg', 20, TRUE);
