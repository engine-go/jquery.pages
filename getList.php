<?php

$page = isset($_GET['page'])?$_GET['page']:1;
$pageLimit = isset($_GET['pageLimit'])?$_GET['pageLimit']:10;

$datas = file_get_contents('data.json');

$datas = json_decode($datas, true);

$list = array_slice($datas, ($page-1)*$pageLimit, $pageLimit);
$count = count($datas);

echo json_encode(array('list'=>$list, 'count'=>$count));