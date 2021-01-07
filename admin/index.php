<!DOCTYPE html>
<html lang="it" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>Admin | Synced Video</title>

        <link rel="stylesheet" href="../css/desktop/style.css?random=<?php echo uniqid(); ?>">
        <script src="adminScript.js?random=<?php echo uniqid(); ?>" charset="utf-8"></script>
        <script src="./mp4box.min.js" charset="utf-8"></script>
		<script src="https://kit.fontawesome.com/0c243af6ab.js"></script>
        <script src="adminClient.js?random=<?php echo uniqid(); ?>"   charset="utf-8"></script>
    </head>
    <body>
        <header>
            <a class="hTitle" href="./">Admin Dashboard</a>
        </header>

        <?php
            header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
            header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
            header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
            header("Cache-Control: post-check=0, pre-check=0", false);
            header("Pragma: no-cache");
        ?>

        <div id="wrapper">
            <?php
                if(!isset($_POST["pwd"]) || $_POST["pwd"]!="passwordFiga"){
                    /*if($_GET["nick"] && campo!="nick"){
                        saveGet.type = "text";
                        saveGet.name = "nick";
                        saveGet.value = get("nick");
                    }else if(get("vidUrl") && campo!="vidUrl"){
                        saveGet.type = "text";
                        saveGet.name = "vidUrl";
                        saveGet.value = get("vidUrl");
                    }*/


                    /*echo "<div class=\"optionsPanel\">";
                        echo "<form method=\"get\" action=\"./\">";
                            echo "<div class=\"originalSizeContainer\"><h2>Admin Login</h2></div>";
                            echo "<div class=\"optionsContainer\"><input type=\"password\" name=\"pwd\" placeholder=\"Password\"></label></div>";
                            echo "<div class=\"originalSizeContainer\"><input type=\"submit\" id=\"vidOptSend\" value=\"Invia\"></div>";
                        echo "</form>";
                    echo "</div>";*/

                    echo "<script>window.addEventListener(\"load\",function(){popUp(\"Admin Login\",\"pwd\",\"Password\",\"post\");})</script>";
                }else{
                    echo "<div class=\"optionsPanel\">";
                        echo "<div class=\"originalSizeContainer\"><h2>Video Options</h2></div>";
                        echo "<div class=\"optionsContainer\"><label>Video URL <input type=\"url\" id=\"inputVidUrl\" placeholder=\"Video URL\"></label></div>";
                        //echo "<div class=\"optionsContainer\" disabled><label>Greeting <input type=\"text\" placeholder=\"Greeting\"></label></div>";
                        echo "<div class=\"originalSizeContainer\"><input type=\"button\" id=\"vidOptSend\" value=\"Invia\"></div>";
                    echo "</div>";

                    echo "<div class=\"optionsPanel\">";
                        echo "<div class=\"originalSizeContainer\"><h2>Synced Commands</h2></div>";
                        echo "<div class=\"optionsContainer syncedCommands\"><label>Avvia dal secondo<input type=\"number\" min=\"0\" step=\"5\" max=\"9999\" value=\"0\" id=\"inputStartSec\" placeholder=\"Secondo\"><input type=\"button\" id=\"btnStartFromSec\" value=\"Invia\"></label></div>";
                        echo "<div class=\"optionsContainer syncedCommands\"><label>Riprendi<input type=\"button\" id=\"btnPlayFromActual\" value=\"Invia\"></label></div>";
                        echo "<div class=\"optionsContainer syncedCommands\"><label>Pausa<input type=\"button\" id=\"btnPause\" value=\"Invia\"></label></div>";
                        echo "<div class=\"optionsContainer syncedCommands\"><label>Imposta secondo<input type=\"number\" min=\"0\" step=\"5\" max=\"9999\" value=\"0\" id=\"inputSetSec\" placeholder=\"Secondo\"><input type=\"button\" id=\"btnSetSec\" value=\"Invia\"></label></div>";
                        echo "<div class=\"optionsContainer syncedCommands\"><label>Imopsta schermo intero<input type=\"button\" id=\"btnSetFullscreen\" value=\"Invia\"></label></div>";
                        echo "<div class=\"optionsContainer syncedCommands\"><label>Esci schermo intero<input type=\"button\" id=\"btnExitFullscreen\" value=\"Invia\"></label></div>";
                        echo "<div class=\"optionsContainer syncedCommands\"><label>Start manuale<input type=\"button\" id=\"btnManualStart\" value=\"Invia\"></label></div>";
                        echo "<div class=\"optionsContainer syncedCommands\"><label>Abilita controlli<input type=\"button\" id=\"btnEnableControls\" value=\"Invia\"></label></div>";
                        echo "<div class=\"optionsContainer syncedCommands\"><label>Disabilita controlli<input type=\"button\" id=\"btnDisableControls\" value=\"Invia\"></label></div>";
                    echo "</div>";

                    echo "<div class=\"optionsPanel\">";
                        echo "<div class=\"originalSizeContainer\"><h2>Connected Users</h2></div>";
                        echo "<div class=\"optionsContainer\"><div class=\"lineAligner\"><span class=\"userName\">User</span><span class=\"ping\">Ping</span><span class=\"vidTime\">VideoTime</span></div></div>";
                        echo "<div class=\"verticalList\" id=\"userList\">";
                            //echo "<div class=\"lineAligner\"><span class=\"userName\">TestUserName</span><span class=\"ping\">1000 ms</span></div>";
                        echo "</div>";
                    echo "</div>";

                    echo "<div class=\"optionsPanel\">";
                        echo "<div class=\"originalSizeContainer\"><h2>Audio Chat Room</h2></div>";
                        echo "<div class=\"optionsContainer\"><label>Room URL<input type=\"url\" id=\"inputAdCharUrl\" placeholder=\"Room URL\"></label></div>";
                        echo "<div class=\"originalSizeContainer\"><a href=\"https://linkello.com/\" target=\"_blank\">Linkello</a></div>";
                        //echo "<div class=\"optionsContainer\" disabled><label>Greeting <input type=\"text\" placeholder=\"Greeting\"></label></div>";
                        echo "<div class=\"originalSizeContainer\"><input type=\"button\" id=\"adCharSendUrlBtn\" value=\"Invia\"></div>";
                    echo "</div>";
                }

            ?>
        </div>

        <footer>
            <p>Fantino Davide | Synced Video Streaming Platform</p>
        </footer>
    </body>
</html>
