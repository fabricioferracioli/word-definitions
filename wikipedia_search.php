<?php

    require_once('Definitions.class.php');

    $Definitions = new Definitions();

    $data = $Definitions->findWikipediaTerms($_GET);

    echo $data;

?>