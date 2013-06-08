<?php

    require_once('Definitions.class.php');

    $Definitions = new Definitions();

    $data = $Definitions->findDictionaryWords($_GET);

    echo $data

?>