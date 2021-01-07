<!DOCTYPE html>
<html lang="it" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title>Synced Video</title>
        <link rel="stylesheet" href="css/desktop/style.css?random=<?php echo uniqid(); ?>">
        <script src="./mp4box.min.js" charset="utf-8"></script>
        <script src="script.js?random=<?php echo uniqid(); ?>" charset="utf-8"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<script src="https://kit.fontawesome.com/0c243af6ab.js"></script>
        <script src="client.js?random=<?php echo uniqid(); ?>"   charset="utf-8"></script>
    </head>
    <body>
        <header>
            <a class="hTitle" href="./">Synced Video</a>
        </header>

        <?php
            header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
            header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
            header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
            header("Cache-Control: post-check=0, pre-check=0", false);
            header("Pragma: no-cache");
        ?>

        <div id="wrapper"></div>
        <div id="clientUsersList"><div class="originalSizeContainer"><h2>Utenti</h2></div><div class="verticalList"><div class="lineAligner"></div></div></div>

        <footer>
            <p>Fantino Davide | Synced Video Streaming Platform</p>
        </footer>
    </body>
</html>
