<?php
session_start();
?>
<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <h1>Homepage<?php echo $_SESSION['uname']; ?></h1>
        <form method='post' action="home.php">
            <input type="submit" value="Logout" name="but_logout" id="but_logout">
        </form>
    </body>
</html>