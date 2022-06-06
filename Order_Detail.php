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

$aux = "SELECT ID_CLIENTE, ORDEN_LANG, ORDEN_ORIGEN, TOTAL_COTIZACION, SESION_STATUS FROM SOLICITUDES WHERE APP_NUMBER = '$app_number' AND SESION_STATUS = 'active'";
$aux = mysql_query($aux, $con);
$aux = mysql_fetch_array($aux, MYSQL_ASSOC);
$language = $aux['ORDEN_LANG'];
$region = $aux['ORDEN_ORIGEN'];
$id_cliente = $aux['ID_CLIENTE'];
$total_order = $aux['TOTAL_COTIZACION'];
$sesion_status = $aux['SESION_STATUS'];

if ($id_cliente == '')
{

$aux = "SELECT ID_CLIENTE, ORDEN_LANG, ORDEN_ORIGEN, TOTAL_COTIZACION, SESION_STATUS FROM SOLICITUDES WHERE APP_NUMBER = '$app_number' AND SESION_STATUS = 'inactive'";
$aux = mysql_query($aux, $con);
$aux = mysql_fetch_array($aux, MYSQL_ASSOC);
$language = $aux['ORDEN_LANG'];
$region = $aux['ORDEN_ORIGEN'];
$id_cliente = $aux['ID_CLIENTE'];
$total_order = $aux['TOTAL_COTIZACION'];
$sesion_status = $aux['SESION_STATUS'];

$aux = "SELECT VALOR FROM PMT_CONFIG_GENERAL WHERE CATEGORIA = 'SERVER_PORT'";
$aux = mysql_query($aux, $con);
$aux = mysql_fetch_array($aux, MYSQL_ASSOC);
$port = $aux['VALOR'];

$aux = "SELECT VALOR FROM PMT_CONFIG_GENERAL WHERE CATEGORIA = 'URL_DNS'";
$aux = mysql_query($aux, $con);
$aux = mysql_fetch_array($aux, MYSQL_ASSOC);
$dns = $aux['VALOR'];

$app_number = '';

header('Location: http://'.$dns.':'.$port.'/Detail_Expired.php?app_number='.$app_number);

}// END if ($id_cliente == '')



$cust_qry = "SELECT NOMBRE_CLIENTE, AP_CLIENTE FROM PMT_CLIENTES WHERE ID_CLIENTE = '$id_cliente'";
$aux = mysql_query($cust_qry, $con);
$aux = mysql_fetch_array($aux, MYSQL_ASSOC);
$nmb = $aux['NOMBRE_CLIENTE'];
$apell = $aux['AP_CLIENTE'];
$nombre_cliente = $nmb.' '.$apell;


$rep_sol_qry = "SELECT NUMERO_PARTE_REPUESTO, DESCRIPCION_REPUESTO, CANTIDAD_REPUESTO, MONTO_REPUESTO_SOLICITADO, MONTO_TOTAL_REPUESTO FROM REPUESTOS_SOLICITADOS WHERE APP_NUMBER = '$app_number'";

$result = mysql_query($rep_sol_qry, $con);


 if ($language == 'sp-001')
 
 {
$descripcion = 'Descripcion';
$cantidad = 'Cantidad';
$precio_unit = 'Precio Unitario';
$precio_tot = 'Precio Total';
$titulo = 'Detalle De La Orden';
$customer = 'Nombre Cliente';
$total = 'Total Orden: $';
$order_num = 'Numero de Orden: ';
$order_message = 'Este es el total de su orden, si, los impuestos estan incluidos!';
 }
 
  if ($language == 'en-001')
 
 {
$descripcion = 'Description';
$cantidad = 'Quantity';
$precio_unit = 'Unit Price';
$precio_tot = 'Total Price';
$titulo = 'Order Detail';
$customer = 'Customer Name';
$total = 'Order Total: $';
$order_num = 'Order Number: ';
$order_message = 'This is your order total, yes, taxes are included!';
 }

mysql_close($con);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <style>
        .cuadro-header{
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
        .cart-items{
            margin-right: 20px;
            margin-top: -95px;
            float: right;
            position: relative;
            cursor: pointer;
        }
        .number-rounded-cart{
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
        .background-select{
            margin-top: 10px;
            padding: 10px 0px;
            background: #fcfcfc;
        }
        .thead-order-detail{
            background-color: #5F9EA0;
            color: #fff;
        }
        .message-total-price{
            text-align: end;
        }
        .total-price-order{
            display: inline;
            margin: 5px;
            border: 1px solid #000;
            padding: 10px;
            text-align: end;
            float: right;
        }
        .thresponsive{
            text-align: center;
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
                    <p><?php echo $order_num.$app_number ; ?></p>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <table class="table table-striped tabla-responsive">
                        <thead class="thead-order-detail">
                            <tr>
                                <th class="thresponsive"><?php echo $descripcion; ?></th>
                                <th><?php echo $cantidad; ?></th>
                                <th><?php echo $precio_unit; ?></th>
                                <th><?php echo $precio_tot; ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) { 
		
                                $codigo = $row['NUMERO_PARTE_REPUESTO'];
                                $qty = $row['CANTIDAD_REPUESTO'];
                                $descripcion = $row['DESCRIPCION_REPUESTO'];
                                $price = $row['MONTO_REPUESTO_SOLICITADO'];
                                $price_total = $row['MONTO_TOTAL_REPUESTO'];  ?>
                                
                                <tr>
                                    <td><?php echo $descripcion; ?></td>
                                    <td><?php echo $qty; ?></td>
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
        </div>
    </section>
</body>
</html>