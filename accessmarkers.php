<?php

    if ($_POST["operation"] && $_POST["operation"] == "GET") {
        try {
            // open connection to MongoDB server
            $conn = new Mongo('localhost');

            // access database
            $db = $conn->MapInformation;

            // access collection
            $collection = $db->markers;

            // execute query
            // retrieve all documents
            $cursor = $collection->find();

            // disconnect from server
            $conn->close();
        }

        catch (MongoConnectionException $e) {
            die('Error connecting to MongoDB server');
        }

        catch (MongoException $e) {
            die('Error: ' . $e->getMessage());
        }

        header('Content-type: application/json');
        $jsonContents = json_encode(iterator_to_array($cursor));
        echo $jsonContents;
    }
?>
