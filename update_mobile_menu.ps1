$files = @('hilfe-opfer.html', 'hilfe-pedo.html', 'kontakt.html', 'praevension.html', 'social.html', 'team.html')

foreach ($file in $files) {
    # Add hamburger menu structure
    (Get-Content $file) -replace '<nav>.*?</nav>', @'
    <nav>
        <div class="menu-toggle" onclick="toggleMenu()">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="nav-links" id="nav-links">
            <a href="index.html">Home</a>
            <a href="team.html">Team</a>
            <a href="hilfe-opfer.html">Hilfe für Opfer</a>
            <a href="hilfe-pedo.html">Hilfe für Pedos</a>
            <a href="praevension.html">Prävention</a>
            <a href="social.html">Social Media</a>
            <a href="kontakt.html">Kontakt</a>
        </div>
    </nav>
'@ | Set-Content $file

    # Add mobile menu styles
    (Get-Content $file) -replace '<style>.*?</style>', @'
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Courier New', monospace;
            background-color: #000;
            color: #0f0;
            overflow-x: hidden;
        }
        
        .menu-toggle {
            display: none;
            flex-direction: column;
            justify-content: space-between;
            width: 30px;
            height: 21px;
            cursor: pointer;
            padding: 10px;
            position: absolute;
            right: 20px;
            top: 20px;
            z-index: 1001;
        }
        
        .menu-toggle span {
            width: 100%;
            height: 3px;
            background-color: #0f0;
            transition: all 0.3s ease;
        }
        
        @media screen and (max-width: 768px) {
            .menu-toggle {
                display: flex;
            }
            
            .nav-links {
                position: fixed;
                top: 0;
                right: -100%;
                width: 80%;
                height: 100vh;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                z-index: 1000;
            }
            
            .nav-links.active {
                right: 0;
            }
            
            .nav-links a {
                margin: 20px 0;
                font-size: 24px;
            }
        }
        
        nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            padding: 20px;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }
        h1, h2, h3, h4, h5, h6 {
            color: #0f0;
        }
        a {
            color: #0f0;
        }
        .matrix-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            object-fit: cover;
            z-index: -1;
            filter: brightness(0.8) contrast(1.2);
        }
        .matrix-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 32px;
            text-align: center;
            animation: matrixText 5s infinite;
            text-shadow: 0 0 10px #0f0;
        }
        @keyframes matrixText {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .content {
            padding: 120px 40px;
            max-width: 1000px;
            margin: 0 auto;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            border-radius: 10px;
        }
        .section {
            margin: 40px 0;
            padding: 20px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            border: 1px solid rgba(0, 255, 0, 0.1);
        }
        h2 {
            color: #0f0;
            margin-top: 0;
            text-shadow: 0 0 5px #0f0;
        }
        p {
            line-height: 1.6;
            margin: 15px 0;
        }
    </style>
'@ | Set-Content $file

    # Add mobile menu JavaScript
    (Get-Content $file) -replace '</body>', @'
    <script>
        function toggleMenu() {
            const navLinks = document.getElementById('nav-links');
            navLinks.classList.toggle('active');
        }
    </script>
</body>
'@ | Set-Content $file
}
