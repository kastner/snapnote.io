<?php
require_once('../phplib/Storage.php');

header('Access-Control-Allow-Methods', 'POST');
header('Access-Control-Allow-Origin', 'http://snapnote.io');

$response =
  (new Storage())->post();

if($response['status'] != 200) {
    header('HTTP/1.0 ' . $response['status']);
}
print json_encode($response);
exit;
