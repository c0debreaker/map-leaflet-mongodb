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

    function removeMarkerFromMap($operation, $id) {

        // delete an existing document

        $criteria = array(
            '_id' => new MongoId($id),
        );

        return $criteria;

    }


    if (isset($_POST["operation"]) && $_POST["operation"] == "REMOVE") {

        try {
            $conn = connect2db();
            $db = accessdb($conn);

            // access collection
            $collection = $db->markers;

            $criteria = removeMarkerFromMap($_POST["operation"], $_POST["id"]);

            $collection->remove($criteria);

        }

        catch (MongoConnectionException $e) {
            die('Error connecting to MongoDB server');
        }

        catch (MongoException $e) {
            die('Error: ' . $e->getMessage());
        }

    }
?>
