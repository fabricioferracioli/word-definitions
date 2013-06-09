<?php

    class Definitions
    {
        private $wikipedia;
        private $dictionary;

        public function __construct()
        {
            $this->wikipedia['endpoint'] = 'http://pt.wikipedia.org/w/api.php';
            $this->wikipedia['format'] = 'json';
            $this->wikipedia['userAgent'] = 'Get Wikipedia definitions by <fabricioferracioli@gmail.com>';
            $this->wikipedia['action'] = null;

            $this->dictionary['endpoint'] = 'http://dicionario-aberto.net/search-json';
            $this->dictionary['userAgent'] = 'Get Dictionary definitions by <fabricioferracioli@gmail.com>';
        }
        
        public function findWikipediaTerms($params)
        {
            $data = false;
            $this->wikipedia['action'] = 'opensearch';
            if (!empty($params['search']))
            {
                if (empty($params['format']))
                {
                    $params['format'] = $this->wikipedia['format'];
                }

                $data = $this->callWikipediaApi($params);
            }
            
            return $data;
        }

        public function findWikipediaDefintion($params)
        {
            $data = false;
            $this->wikipedia['action'] = 'query';
            $params['prop'] = 'extracts';
            $params['redirects'] = true;
            $params['exintro'] = true;
            $params['explaintext'] = 'plain';
            $params['exchars'] = 140;
            if (!empty($params['titles']))
            {
                if (empty($params['format']))
                {
                    $params['format'] = $this->wikipedia['format'];
                }
                $data = $this->callWikipediaApi($params);
            }

            return $data;
        }

        public function findDictionaryWords($params)
        {
            $data = false;

            if (!empty($params) && !empty($params['term']))
            {
                $query = '?like=' . $params['term'];
                $data = $this->callDictionaryApi($query);
            }

            return $data;
        }

        public function findWordMeaning($params)
        {
            $data = false;

            if (!empty($params) && !empty($params['term']))
            {
                $query = '/' . $params['term'];
                $data = $this->callDictionaryApi($query);
            }

            return $data;
        }

        private function callWikipediaApi($params)
        {
            $data = false;
            
            if (!empty($params))
            {
                $params['action'] = $this->wikipedia['action'];
                $get_params = http_build_query($params);
                $curl = curl_init($this->wikipedia['endpoint'] . '?' . $get_params);

                curl_setopt($curl, CURLOPT_USERAGENT, $this->wikipedia['userAgent']);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

                $data = curl_exec($curl);
                curl_close($curl);
            }

            return $data;
        }

        private function callDictionaryApi($params)
        {
            $data = false;

            if (!empty($params))
            {
                $curl = curl_init($this->dictionary['endpoint'] . $params);

                curl_setopt($curl, CURLOPT_USERAGENT, $this->wikipedia['userAgent']);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

                $data = curl_exec($curl);
                curl_close($curl);
            }
            
            return $data;
        }
    }

?>