<?php

	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");

	$local_server = "localhost";
	$local_user = "root";
	$local_pass = "12345acbd01";
	//$local_pass = "1357";
	$case = $_GET["case"];
	$app_number = 'AP-'.$case;

	$con = mysql_connect($local_server, $local_user, $local_pass);
	mysql_select_db("wf_workflow", $con);
	mysql_query("SET NAMES utf8");
	
	$lang_qry = "SELECT APP_NUMBER, CODIGO_ARTICULO FROM REPUESTOS_SOLICITADOS_TEMP WHERE APPLICATION = '$app_number' LIMIT 1";
	$aux = mysql_query($lang_qry, $con);
	$aux = mysql_fetch_array($aux, MYSQL_ASSOC);
	$order = $aux['APP_NUMBER'];
	
	$lang_qry = "SELECT ID_CLIENTE, ORDEN_LANG, ORDEN_ORIGEN, TOTAL_COTIZACION FROM SOLICITUDES WHERE APP_NUMBER = '$order'";
	$aux = mysql_query($lang_qry, $con);
	$aux = mysql_fetch_array($aux, MYSQL_ASSOC);
	$language = $aux['ORDEN_LANG'];
	$region = $aux['ORDEN_ORIGEN'];
	$id_cliente = $aux['ID_CLIENTE'];
	
	
	$cust_qry = "SELECT NOMBRE_CLIENTE, AP_CLIENTE FROM PMT_CLIENTES WHERE ID_CLIENTE = '$id_cliente'";
	$aux = mysql_query($cust_qry, $con);
	$aux = mysql_fetch_array($aux, MYSQL_ASSOC);
	$nmb = $aux['NOMBRE_CLIENTE'];
	$apell = $aux['AP_CLIENTE'];
	$nombre_cliente = $nmb.' '.$apell;
	
	$aux = "SELECT ALMACEN_ID FROM PMT_REGIONES WHERE REGION_ID = '$region'";
	$aux = mysql_query($aux, $con);
	$aux = mysql_fetch_array($aux, MYSQL_ASSOC);
	$almacen_id = $aux['ALMACEN_ID'];
	
	$local_address = 'WAREHOUSE_ADDRESS_'.$almacen_id;
	
	$aux = "SELECT VALOR FROM PMT_CONFIG_GENERAL WHERE CATEGORIA = '$local_address'";
	$aux = mysql_query($aux, $con);
	$aux = mysql_fetch_array($aux, MYSQL_ASSOC);
	$local_address = $aux['VALOR'];
	
	$total_order = 0;
	
	$rep_sol_qry = "SELECT CODIGO_ARTICULO, DESCRIPCION_ARTICULO, PRECIO1, CANTIDAD, SUBTOTAL, APP_NUMBER FROM REPUESTOS_SOLICITADOS_TEMP WHERE APPLICATION = '$app_number'";
	
	$result = mysql_query($rep_sol_qry, $con);
	
	
	 if ($language == 'sp-001')
	 
	 {
	 $schedule = $almacen_id.'_SCHEDULE_ES';
	
	$aux = "SELECT VALOR FROM PMT_CONFIG_GENERAL WHERE CATEGORIA = '$schedule'";
	$aux = mysql_query($aux, $con);
	$aux = mysql_fetch_array($aux, MYSQL_ASSOC);
	$schedule = $aux['VALOR'];
	 
	$descripcion = 'Descripcion';
	$cantidad = 'Cantidad';
	$orden = 'Orden';
	$precio_unit = 'Precio Unitario';
	$precio_tot = 'Precio Total';
	$titulo = 'Detalle Del Retorno';
	$customer = 'Nombre Cliente';
	$total = 'Total Retorno: $';
	$order_num = 'Numero de Retorno: ';
	$order_message = 'Este es el total a ser reembolsado';
	$instruccions = 'Por favor traiga todos los items a retornar hasta nuestro deposito localizado en:: <b>'.$local_address.'.</b>';
	$instruccionsb = 'El horario para recibir los items y procesar su caso retorno es: <b>'.$schedule.'.</b></p>';
	$notice = 'Por favor tenga en mente que para tener un reembolso completo los items retornados deben estar exactamente en el mismo estado en el que le fueron vendidos (incluyendo caja y accesorios si aplica), si los items tienen algun signo de haber sido instalados/rayados/rotos o tienen partes/caja perdidas estaremos emitiendo un reembolso parcial o ningun reembolso dependiendo del caso';
	 }
	 
	  if ($language == 'en-001')
	 
	 {
	 
	 $schedule = $almacen_id.'_SCHEDULE_EN';
	
	$aux = "SELECT VALOR FROM PMT_CONFIG_GENERAL WHERE CATEGORIA = '$schedule'";
	$aux = mysql_query($aux, $con);
	$aux = mysql_fetch_array($aux, MYSQL_ASSOC);
	$schedule = $aux['VALOR'];
	
	$descripcion = 'Description';
	$cantidad = 'Quantity';
	$orden = 'Order';
	$precio_unit = 'Unit Price';
	$precio_tot = 'Total Price';
	$titulo = 'Return Detail';
	$customer = 'Customer Name';
	$total = 'Return Total: $';
	$order_num = 'Return Number: ';
	$order_message = 'This is the total to be refunded';
	$instruccions = 'Please bring all the return items to our warehouse located at: <b>'.$local_address.'.</b>';
	$instruccionsb = 'The schedule to receive the items and process your return case is: <b>'.$schedule.'.</b></p>';
	$notice = 'Please have in mind that to get a full refund the returned items must be in the exact same condition (including box and accessories if applicable) as they were sold to you, if they have some signs of have been installed/scratched/damaged or have missing box/parts, we will be issuing a partial refund (or not refund at all) according to the case.';
	 }
	
	
	
	
	
	mysql_close($con);
	

	?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
        crossorigin="anonymous"></script>
    <style>
        .cuadro-header {
            width: 102%;
            height: 150px;
            background: #eeeeee;
        }

        .cuadro-header img {
            margin: 35px 20px;
            width: 80px;
            float: left;
            border-radius: 3px degrade #F5FBFF;
        }

        .cuadro-header h1 {
            /* text-align: center; */
            padding: 47px;
            font-weight: 400;
        }

        .cuadro-header .informacion-header {
            text-align: center;
        }

        .cart-items {
            margin-right: 20px;
            margin-top: -95px;
            float: right;
            position: relative;
            cursor: pointer;
        }

        .number-rounded-cart {
            position: absolute;
            top: 0;
            left: 68%;
            background: #777;
            width: 20px;
            height: 20px;
            border-radius: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            padding: 2px;
        }

        .background-select {
            margin-top: 10px;
            padding: 10px 0px;
            background: #fcfcfc;
        }

        .thead-order-detail {
            background-color: #5F9EA0;
            color: #fff;
        }

        .message-total-price {
            text-align: end;
        }

        .total-price-order {
            display: inline;
            margin: 5px;
            border: 1px solid #000;
            padding: 10px;
            text-align: end;
            float: right;
        }

        @media (max-width: 800px) {

            .table th,
            td {
                font-family: Verdana, Geneva, Tahoma, sans-serif;
                font-size: 10px
            }
        }
    </style>


</head>

<body>
    <header>
        <div class="cuadro-header">
            <div class="container">
                <div class="row">
                    <div class="col-12 informacion-header">
                        <img src="img/logo.jpg" alt="">
                        <h1 class="tittle trn" data-trn-key="search-parts-title"><?php echo $titulo; ?></h1>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <section class="main">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <p><?php echo $customer.': '.$nombre_cliente; ?></p>
                </div>
                <div class="col-12">
                    <p>
                    <?php echo $order_num.$app_number ; ?>
                    </p>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <table class="table table-striped tabla-responsive">
                        <thead class="thead-order-detail">
                            <tr>
                                <th><?php echo $descripcion; ?></th>
                                <th><?php echo $cantidad; ?></th>
                                <th><?php echo $orden; ?></th>
                                <th><?php echo $precio_unit; ?></th>
                                <th><?php echo $precio_tot; ?></th>
                            </tr>
                        </thead>
                        <tbody>
                        <?php while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) { 
		
                            $codigo = $row['CODIGO_ARTICULO'];
                            $qty = $row['CANTIDAD'];
                            $descripcion = $row['DESCRIPCION_ARTICULO'];
                            $price = $row['PRECIO1'];
                            $price_total = $row['SUBTOTAL'];
                            $order_row = $row['APP_NUMBER'];
                            $total_order = $total_order + $price_total;
                            ?>
                            
                            <tr>
                        
                                <td><?php echo $descripcion; ?></td>
                                <td><?php echo $qty; ?></td>
                                <td><?php echo $order_row; ?></td>
                                <td><?php echo $price; ?></td>
                                <td><?php echo $price_total; ?></td>
                                
                            </tr>
                            <?php } ?>
                
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="row">
                <div class="col-12 message-total-price">
                    <h6><?php echo $order_message; ?></h6>

                </div>
            </div>

            <div class="">
                <div class="col total-price-order">
                    <b><?php echo $total.$total_order; ?></b>
                </div>
            </div>
            <br></br>
            <div>
                <div class="line-order">
                    <hr>
                </div>
                <p style="text-align: center;border-style: dashed;">

                </p>
                <p style="text-align: center;">
                <p style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 4; text-align: center;">
                <?php echo $instruccions; ?></p>
                </p>
                <p style="text-align: center;">
                <p style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 4; text-align: center;">
                <?php echo $instruccionsb; ?></p>
                </p>
                <p style="text-align: center;border-style: dashed;">

                </p>
                <p style="text-align: left;">
                <p style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 4;">
                    <b><?php echo $notice; ?></b>
                </p>
            </div>
        </div>
    </section>
</body>

</html>