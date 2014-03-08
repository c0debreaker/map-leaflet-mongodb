<?php

    function connect2db() {

        // open connection to MongoDB server
        $conn = new Mongo('localhost');
        return $conn;

    }

    function accessdb($conn) {

        // access database
        $db = $conn->MapInformation;
        return $db;
    }

    function disconnectfromdb($conn) {

        // disconnect from server
        $conn->close();

    }

    function addMarkertoMap($operation, $latlon) {

        // insert a new document

        $latlon = explode(",", ereg_replace('\)','',ereg_replace('LatLng\(','', $latlon)));

        $item = array(
            'operation' => $operation,
            'lat' => $latlon[0],
            'lon' => $latlon[1]
        );

        return $item;

    }

    if (isset($_POST["operation"]) && $_POST["operation"] == "ADD") {

        try {
            $conn = connect2db();
            $db = accessdb($conn);

            // access collection
            $collection = $db->markers;

            $item = addMarkertoMap($_POST["operation"], $_POST["latlon"]);

            $collection->insert($item);

        }

        catch (MongoConnectionException $e) {
            die('Error connecting to MongoDB server');
        }

        catch (MongoException $e) {
            die('Error: ' . $e->getMessage());
        }

    }
?>
