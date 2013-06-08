<?php

    require_once('Definitions.class.php');

    $Definitions = new Definitions();

    $data = $Definitions->findWikipediaDefintion($_GET);

    echo $data

?>