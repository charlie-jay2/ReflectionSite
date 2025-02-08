<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Reflection Bot" />
    <meta property="og:description" content="Reflection Bot by Flexa Group, Under Construction." />
    <meta property="og:image" content="https://www.realreflection.co.uk/assets/logo.png" />
    <meta property="og:url" content="https://realreflection.co.uk" />
    <meta property="og:type" content="website" />

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:title" content="Reflection Bot" />
    <meta name="twitter:description" content="Reflection Bot by Flexa Group, Under Construction." />
    <meta name="twitter:image" content="https://www.realreflection.co.uk/assets/logo.png" />
    <meta name="twitter:card" content="summary_large_image" />

    <link rel="icon" href="assets/logo-favicon.png" type="image/png">
    <link rel="stylesheet" href="styles.css">
    <title>Reflection Bot</title>

    <style>
        /* CSS remains unchanged */
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: url("assets/Site Background.png") no-repeat center center fixed;
            background-size: cover;
            overflow-x: hidden;
        }

        .hidden {
            display: none;
        }

        .mobile-message-container {
            display: none;
            text-align: center;
            color: white;
            font-size: 1.5rem;
            background: black;
            height: 100vh;
            align-items: center;
            justify-content: center;
        }

        .popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            display: none;
        }

        .popup button {
            background: linear-gradient(to bottom, #794d11, black 40%);
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            font-size: 1rem;
            border-radius: 5px;
        }
    </style>
</head>

<body>

    <!-- Desktop Content -->
    <div class="textbox-container">
        <img src="./assets/text/textbox.png" class="textbox" draggable="false" id="textbox">
    </div>

    <div class="button-container">
        <img src="./assets/Buttons/ADD REFLECTION TO YOUR SERVER.png" class="button1" draggable="false">
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=flexagroupofficial@gmail.com" target="_blank">
            <img src="./assets/Buttons/GET IN TOUCH.png" class="button2" draggable="false">
        </a>
        <a href="https://discord.gg/5jkuhd79QV" target="_blank">
            <img src="./assets/Buttons/JOIN THE OFFICIAL COMMUNITY.png" class="button3" draggable="false">
        </a>
    </div>

    <!-- Mobile Message -->
    <div class="mobile-message-container">
        <div>This site is unavailable for mobile.</div>
        <div>Add the bot here -- Unavailable</div>
        <div>
            Join the Discord <a href="https://discord.gg/5jkuhd79QV">here</a>
        </div>
    </div>

    <!-- Video Embed -->
    <div>
        <iframe
            src="https://www.dropbox.com/scl/fi/p2nlxbl93jc3otb60xw0y/vidcard-3.mp4?rlkey=aeumwbegguoxbhdtn5ehg5kps&st=c1vducua&raw=1"
            class="video" id="videotag" allow="autoplay; fullscreen"></iframe>
    </div>

    <!-- Popup for audio -->
    <div id="popup" class="popup">
        <div>Do you wish to play the transcript?</div>
        <button id="playBtn">PLAY</button>
        <button id="stopBtn">STOP</button>
    </div>

    <script>
        const firstAudio = new Audio("./assets/Audio/First - Style.wav");
        const secondAudio = new Audio("./assets/Audio/2nd - Paragraph.wav");
        const thirdAudio = new Audio("./assets/Audio/3rd - 2025.wav");
        const finalAudio = new Audio("./assets/induction.wav");

        const textbox = document.getElementById("textbox");
        const popup = document.getElementById("popup");
        const playBtn = document.getElementById("playBtn");
        const stopBtn = document.getElementById("stopBtn");

        const playAudioSequence = () => {
            firstAudio.play();
            firstAudio.onended = () => {
                setTimeout(() => {
                    secondAudio.play();
                    secondAudio.onended = () => {
                        setTimeout(() => {
                            thirdAudio.play();
                            thirdAudio.onended = () => {
                                setTimeout(() => {
                                    finalAudio.play();
                                }, 1000);
                            };
                        }, 1500);
                    };
                }, 1500);
            };
        };

        textbox.onclick = () => { popup.style.display = "block"; };
        playBtn.onclick = () => { playAudioSequence(); popup.style.display = "none"; };
        stopBtn.onclick = () => {
            [firstAudio, secondAudio, thirdAudio, finalAudio].forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
            popup.style.display = "none";
        };
    </script>

</body>

</html>