<?php

require_once 'sdk.class.php';

class Storage {
    const STATUS_OK = 200;
    const BUCKET_NAME = 'images.snapnote.io';

    private $amazonS3 = null;


    public function __construct() {
        $this->amazonS3 = new AmazonS3();
        $this->amazonS3->disable_ssl_verification(false);
        header('Content-type: application/json');
    }

    private function reply($status, $map) {
        if($status != 200) {
            header('HTTP/1.0 ' . $status);
        }
        print json_encode($map);
        exit;
    }

    private function getFilenameForId($id) {
        return wordwrap($id, 2, "/", true).'.png';
    }

    public function post() {
      $blob = file_get_contents("php://input");
      $hash = 's'.substr(base64_encode(md5($blog, true)), 0, 5);
      $this->put($hash);
      return $hash;
    }

    /**
     * Store an object
     */
    public function put($id) {
        $blob = file_get_contents("php://input");

        // Convert canvas.toDataURL data to a proper
        // PNG
        $blob =
          base64_decode(substr(str_replace(' ','+', $blob),
            strlen('data:image/png;base64,')));

        // Don't store anything if we don't have data
        if(strlen($blob) < 1 ||
           strlen($blob) > 1048576) {
            $this->reply(500, array('id' => $id, 'success' => false));
        }

        $filename = $this->getFilenameForId($id);

        $response =
            $this->amazonS3->create_object(self::BUCKET_NAME,
                $filename,
                array('body' => $blob,
                      'contentType' => 'application/png'));

        if($response->status != 200) {
            $this->reply($response->status,
                array('id' => $id, 'success' => false));
        }
        else {
            $this->reply(self::STATUS_OK,
                array('id' => $id, 'success' => true));
        }
    }

    public function getData($id) {
        $response =
            $this->amazonS3->get_object(self::BUCKET_NAME,
                $this->getFilenameForId($id));

        if($response->status != 200) {
            return null;
        }

        return json_decode($response->body);
    }

    /**
     * Get an object
     */
    public function get($id) {
        $response =
            $this->amazonS3->get_object(self::BUCKET_NAME,
                $this->getFilenameForId($id));

        if($response->status != 200) {
            $this->reply($response->status,
                array('id' => $id, 'success' => false));
        }

        $this->reply(self::STATUS_OK, json_decode($response->body));
    }
}
