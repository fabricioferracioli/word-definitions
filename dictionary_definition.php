<?php

    require_once('Definitions.class.php');

    $Definitions = new Definitions();

    $data = $Definitions->findWordMeaning($_GET);

    echo $data
    
?>