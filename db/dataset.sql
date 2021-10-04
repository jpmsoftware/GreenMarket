-- ///////////////////////////////////// CREATE DATABASE ///////////////////////////////////////////
DROP DATABASE IF EXISTS heroku_7a3354ff527dacc;

CREATE DATABASE heroku_7a3354ff527dacc;

USE heroku_7a3354ff527dacc;

SET @@auto_increment_increment = 1;
-- ///////////////////////////////////// CREATE TABLES ///////////////////////////////////////////
CREATE TABLE usuarios (
	id MEDIUMINT UNSIGNED AUTO_INCREMENT,
	nombreUsuario VARCHAR(20),
    clave VARCHAR(60),
    mail VARCHAR(50),
    rol CHAR(1),
    
    PRIMARY KEY(id)
);

ALTER TABLE usuarios AUTO_INCREMENT = 1000;

CREATE TABLE categorias (
	id TINYINT UNSIGNED AUTO_INCREMENT,
    nombre VARCHAR(30),
    
    PRIMARY KEY(id)
);

ALTER TABLE categorias AUTO_INCREMENT = 1;

CREATE TABLE productos (
	id VARCHAR(20), -- pasar '0' para generar un id aleatorio
    nombre VARCHAR(80),
    categoria TINYINT UNSIGNED,
    precio DECIMAL,
    imagen VARCHAR(30),
    
    PRIMARY KEY(id),
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
							 IN _clave VARCHAR(60), 
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
							  IN _descripcion VARCHAR(50),
                              IN _categoria_id TINYINT UNSIGNED, 
                              IN _precio DECIMAL, 
                              IN _imagen VARCHAR(30) 
                              )
BEGIN
    IF _id = '0' THEN SET _id = FLOOR(RAND()*(1000000000000-5+1)+5);
    END IF;
    
	INSERT INTO productos VALUES(_id, _descripcion, _categoria_id, _precio, _imagen);
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
CREATE PROCEDURE BuscarProductos(IN _producto_nombre VARCHAR(30))
BEGIN
	SELECT productos.nombre,
		   productos.cantidad,
           productos.unidad,
           productos.precio,
           productos.imagen
           FROM productos 
	WHERE  productos.nombre LIKE CONCAT('%', _producto_nombre, '%');
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE BajaCategoria(IN _id TINYINT UNSIGNED)
BEGIN
	DELETE FROM categorias WHERE id = _id;
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
                                   IN _categoria_id TINYINT UNSIGNED, 
                                   IN _precio DECIMAL, 
                                   IN _imagen VARCHAR(30), 
                                   IN _stock SMALLINT UNSIGNED, 
                                   IN _activo BOOL)
BEGIN
	UPDATE productos SET nombre = _nombre, categoria = _categoria_id,
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
		categorias.nombre AS categoria,
        productos.precio,
        productos.imagen
	FROM productos
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
		categorias.nombre AS categoria,
        productos.precio,
        productos.imagen,
        productos.stock
	FROM productos 
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
		categorias.nombre AS categoria,
        productos.precio,
        productos.imagen
	FROM productos 
    INNER JOIN categorias
    ON productos.categoria = categorias.id
    ORDER BY
		productos.precio ASC
	LIMIT 15;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ListarMasVendidos()
BEGIN
	SELECT
		productos.id,
        productos.nombre,
		categorias.nombre AS categoria,
        productos.precio,
        productos.imagen
	FROM productos
    INNER JOIN categorias
    ON productos.categoria = categorias.id
	LIMIT 15;
END //
DELIMITER ;

-- ///////////////////////////////////// INSERT SAMPLE DATA ///////////////////////////////////////////

call AltaCategoria('Granos y semillas');
call AltaCategoria('Bebidas');
call AltaCategoria('Aderezos');
call AltaCategoria('Leches vegetales');
call AltaCategoria('Quesos y fiambres veganos');
call AltaCategoria('Congelados');
call AltaCategoria('Cuidado personal');

call AltaProducto('1654', 'Semillas de chia La Abundancia 200g', 1, 75, '1654.png');
call AltaProducto('9865', 'Semillas de lino La Abundancia 450g', 1, 150, '9865.png');
call AltaProducto('9652', 'Avena laminada La Abundancia 1kg', 1, 136, '9652.png');
call AltaProducto('6470', 'Avena arrollada Madre Tierra 500g', 1, 70, '6470.png');
 
call AltaProducto('3002', 'Kombucha sabor mandarina Prana 330 mL', 2, 145, '3002.png');
call AltaProducto('3003', 'Kombucha Prana 330 mL', 2, 145, '3003.png');
call AltaProducto('3004', 'Kombucha sabor berries Prana 330 mL', 2, 145, '3004.png');

call AltaProducto('7521', 'Mayonesa Vegenaise 425 mL', 3, 265, '7521.png');
call AltaProducto('9851', 'Mayonesa Delicia 500 g', 3, 105, '9851.png');
call AltaProducto('5324', 'Ketchup Heinz 397g', 3, 99, '5324.png');
call AltaProducto('9317', 'Salsa barbacoa Hemmer 330 g', 3, 70, '9317.png');
call AltaProducto('4613', 'Salsa barbacoa Stubbs 335 ml', 3, 235, '4613.png');
call AltaProducto('3333', 'Salsa traviata campo claro 335 ml', 3, 225, '3333.png');
call AltaProducto('2130', 'Mayonesa Hellmanns Vegana 500g', 3, 105, '2130.png');

call AltaProducto('3210', 'Bebida de almendras Valsoia 1L', 4, 150, '3210.png');
call AltaProducto('6325', 'Leche vegetal de nueces Valsoia 1L', 4, 150, '6325.png');
call AltaProducto('9746', 'Bebida de arroz sabor coco Valsoia 1L', 4, 235, '9746.png');
call AltaProducto('7745', 'Bebida de arroz sabor chocolate Valsoia 1L', 4, 185, '7745.png');
call AltaProducto('3256', 'Bebida de avena Riso Scotti 1L', 4, 164, '3256.png');

call AltaProducto('2020', 'Vegarella Etosha 200 grs', 5, 180, '2020.png');
call AltaProducto('8874', 'Rawmesan orgánico Prana 180 grs', 5, 210, '8874.png');
call AltaProducto('4110', 'Tofu Etosha 500grs', 5, 210, '4110.png');
call AltaProducto('5310', 'Queso en fetas Violife 200g', 5, 220, '5310.png');
call AltaProducto('4415', 'Fiambre vegetal Vegan Deli 160g', 5, 220, '4415.png');
call AltaProducto('5587', 'Queso Cheddar vegano Vegan Deli 160g', 5, 220, '5587.png');
call AltaProducto('6698', 'Queso parmesano vegano Follow Your Heart', 5, 124, '6698.png');

call AltaProducto('5630', 'Carne picada vegetal Beyond Meat 250g', 6, 395, '5630.png');
call AltaProducto('3579', 'Medallones de espinaca Vegetalex 4 unidades', 6, 150, '3579.png');
call AltaProducto('9630', 'Milanesas multicereal de trigo Naturezas 400 g', 6, 350, '9630.png');
call AltaProducto('2310', 'Hamburguesas de col y quinoa Ardo 1200 grs', 6, 295, '2310.png');
call AltaProducto('5163', 'Hamburguesas de lentejas Oro Verde 250grs', 6, 175, '5163.png');
call AltaProducto('8691', 'Hamburguesas de garbanzos Oro Verde 250grs', 6, 175, '8691.png');
call AltaProducto('1241', 'Hamburguesas Futuro Burger 2 unidades', 6, 250, '1241.png');

call AltaProducto('7412', 'Jabon de coco Cavallaro 200grs', 7, 59, '7412.png');
call AltaProducto('5912', 'Crema exfoliante Veganis 500g', 7, 550, '5912.png');
call AltaProducto('3365', 'Crema antiedad Veganis 500g', 7, 550, '3365.png');
call AltaProducto('2223', 'Jabon liquido Sabina 300cc', 7, 105, '2223.png');
call AltaProducto('1597', 'Cepillo dental de bambú Sudanta', 7, 150, '1597.png');
call AltaProducto('1147', 'Pasta dental Sudanta', 7, 99, '1147.png');
call AltaProducto('6363', 'Jabón Vegetal aroma Naranja Sri Sri', 7, 135, '6363.png');
