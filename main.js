        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
        import { getFirestore, collection, addDoc, doc, setDoc, getDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

        const firebaseConfig = {
            apiKey: "AIzaSyCPdrvp8wn0qqo2pSRXrCmC4PMRprzPFN0",
            authDomain: "ncaa-bracket-challenge.firebaseapp.com",
            projectId: "ncaa-bracket-challenge",
            storageBucket: "ncaa-bracket-challenge.appspot.com",
            messagingSenderId: "654181665464",
            appId: "1:654181665464:web:f6d4fd1b4cf20789ee824d",
            measurementId: "G-50BYF49X2K"
        };

        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const db = getFirestore(app);

        async function addWeightClass(db, weightClassName, participants) {
            const docRef = doc(db, "WeightClasses", weightClassName);
            await setDoc (docRef, {
                weightClass: weightClassName,
                participants: participants
            });
            console.log("Document written with ID: ", docRef.id);
        }

        async function getWeightClass(db, weightClassName) {
            const weightClassesRef = collection(db, "WeightClasses");
            const q = query(weightClassesRef, where("weightClass", "==", weightClassName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    console.log("Document data:", doc.data());
                });
                return querySnapshot.docs[0].data().participants;
            } else {
                console.log("No such document!");
                return [];
            }
        }

        function toTitleCase(str) {
            return str.replace(/\w\S*/g, function(txt){
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }

        function toUpperCase(str) {
            return str.toUpperCase();
        }

        function formatName(name) {
            let [firstname, ...lastname] = name.split(' ');
            lastname = lastname.join(' '); // in case the last name has multiple words
            return `${toTitleCase(firstname)} ${toUpperCase(lastname)}`;
        }
        
        addWeightClass(db, "125 lbs", [
            { name: "Spencer Lee", school: "Iowa", seed: 1},
            { name: "Pat Glory", school: "Princeton", seed: 2},
            { name: "Liam Cronin", school: "Nebraska", seed: 3},
            { name: "Matt Ramos", school: "Purdue", seed: 4},
            { name: "Caleb Smith", school: "Appalachian State", seed: 5},
            { name: "Stevo Poulin", school: "Northern Colorado", seed: 6},
            { name: "Brandon Kaylor", school: "Oregon State", seed: 7},
            { name: "Anthony Noto", school: "Lehigh", seed: 8},
            { name: "Eric Barnett", school: "Wisconsin", seed: 9},
            { name: "Brandon Courtney", school: "Arizona State", seed: 10},
            { name: "Patrick McKee", school: "Minnesota", seed: 11},
            { name: "Michael DeAugustino", school: "Northwestern", seed: 12},
            { name: "Dean Peterson", school: "Rutgers", seed: 13},
            { name: "Noah Surtin", school: "Missouri", seed: 14},
            { name: "Brett Ungar", school: "Cornell", seed: 15},
            { name: "Jack Medley", school: "Michigan", seed: 16},
            { name: "Ethan Berginc", school: "Army", seed: 17},
            { name: "Ryan Miller", school: "Penn", seed: 18},
            { name: "Braxton Brown", school: "Maryland", seed: 19},
            { name: "Jarrett Trombley", school: "NC State", seed: 20},
            { name: "Jore Volk", school: "Wyoming", seed: 21},
            { name: "Diego Sotelo", school: "Harvard", seed: 22},
            { name: "Jake Ferri", school: "Kent State", seed: 23},
            { name: "Nick Babin", school: "Columbia", seed: 24},
            { name: "Joey Prata", school: "Oklahoma", seed: 25},
            { name: "Jack Wagner", school: "Michigan", seed: 26},
            { name: "Eddie Ventresca", school: "Virginia Tech", seed: 27},
            { name: "Killian Cardinale", school: "West Virginia", seed: 28},
            { name: "Nico Provo", school: "Stanford", seed: 29},
            { name: "Antonio Lorenzo", school: "Cal Poly", seed: 30},
            { name: "Reece Witcraft", school: "Oklahoma State", seed: 31},
            { name: "Tanner Jordan", school: "South Dakota State", seed: 32},
            { name: "Tucker Owens", school: "Air Force", seed: 33}
        ]).then(() => getWeightClass(db, "125 lbs"))
        .then(participants => {
            console.log(participants.find(participant => participant.seed === 19));
            console.log(participants); // logs the participants data first. 
            participants.forEach(participant => {
                try {
                    const nameParts = participant.name.split(' ');
                    const firstName = toTitleCase(nameParts[0]);
                    const lastName = nameParts[1].toUpperCase();

                    console.log(`firstname${participant.seed}`);
                    document.getElementById(`firstname${participant.seed}`).textContent = firstName;
                    console.log(`lastname${participant.seed}`);
                    document.getElementById(`lastname${participant.seed}`).textContent = lastName;
                    console.log(`school${participant.seed}`);
                    document.getElementById(`school${participant.seed}`).textContent = toTitleCase(participant.school);
                    console.log(`seed${participant.seed}`);
                    document.getElementById(`seed${participant.seed}`).textContent = participant.seed;
                } catch (error) {
            console.error(`Error processing participant with seed ${participant.seed}:`, error);
        }
            });
        })
        .catch(error => console.error("Error processing data:", error));

        let clickedParticipant = null; 

        window.selectParticipant = function(element) {
            // Get the match, next match IDs, and replace slot from the element's data attributes
            var matchId = element.getAttribute('data-match');
            var nextMatchId = element.getAttribute('data-next-match');
            var nextMatchLoserId = element.getAttribute('data-next-match-loser');
            var replaceSlotLoser = element.getAttribute('data-replace-slot-loser');
            var replaceSlot = element.getAttribute('data-replace-slot');

            // Fetch the participant details
            var participantData = getParticipantData(element);

            // If nextMatchId is 'predictedChampion', assign the values directly
            if (nextMatchId === 'predictedChampion') {
                updateParticipantData(document.getElementById(nextMatchId), participantData);
            } else {
                // Get the next match element
                var nextMatchElem = document.getElementById(nextMatchId);

                // Use replaceSlot to determine which participant to replace
                var participantElem = nextMatchElem.querySelector(`.participant[data-slot="${replaceSlot}"]`);
                updateParticipantData(participantElem, participantData);
            }

            // If nextMatchLoserId exists, move the unselected participant to the consolation bracket
            if (nextMatchLoserId && replaceSlotLoser) {
                // Get the match element that contains this participant
                var matchElem = document.getElementById(matchId);

                // Get the other participant in this match
                var otherParticipantElem = matchElem.querySelector(`.participant:not([data-slot="${element.getAttribute('data-slot')}"])`);

                // Get the next match for the loser element
                var nextMatchLoserElem = document.getElementById(nextMatchLoserId);

                // Use replaceSlotLoser to determine which participant to replace
                var participantLoserElem = nextMatchLoserElem.querySelector(`.participant[data-slot="${replaceSlotLoser}"]`);
                updateParticipantData(participantLoserElem, getParticipantData(otherParticipantElem));
            }
        };

        // This function returns the data of a participant
        function getParticipantData(element) {
            var seed = element.getElementsByClassName('seed')[0].innerText;
            var firstName = element.getElementsByClassName('firstName')[0].innerText;
            var lastName = element.getElementsByClassName('lastName')[0].innerText;
            var school = element.getElementsByClassName('school')[0].innerText;

            return {
                seed: seed,
                firstName: firstName,
                lastName: lastName,
                school: school
            };
        }

        // This function updates the data of a participant
        function updateParticipantData(element, participantData) {
            element.getElementsByClassName('seed')[0].innerText = participantData.seed;
            element.getElementsByClassName('firstName')[0].innerText = participantData.firstName;
            element.getElementsByClassName('lastName')[0].innerText = participantData.lastName;
            element.getElementsByClassName('school')[0].innerText = participantData.school;
        }



        $(document).ready(function() {
            // Zoom levels and functionality
            var zoomLevels = [1, 0.5, 0.2];
            var currentZoomLevel = 0;
            var lastClickX = 0;
            var lastClickY = 0;

            // Participant selection and advancement reset functionality
            function resetAdvancements(element) {
                var advancedParticipants = document.querySelectorAll(`[data-prev-match="${element.dataset.match}"]`);
                for (let i = 0; i < advancedParticipants.length; i++) {
                    var participant = advancedParticipants[i];
                    participant.querySelector('.seed').innerText = '';
                    participant.querySelector('.firstName').innerText = '';
                    participant.querySelector('.lastName').innerText = '';
                    participant.querySelector('.school').innerText = '';
                    resetAdvancements(participant);
                }
            }

            function selectParticipant(element) {
                resetAdvancements(element);
            }

            // Get the stored zoom level from localStorage
            var storedZoomLevel = localStorage.getItem('zoomLevel');

            if (storedZoomLevel !== null) {
                currentZoomLevel = parseInt(storedZoomLevel, 10);
                
                var viewportCenterX = $(window).scrollLeft() + $(window).width()/2;
                var viewportCenterY = $(window).scrollTop() + $(window).height()/2;

                $('#zoom-container').css({
                    'transform': 'scale(' + zoomLevels[currentZoomLevel] + ')',
                    'transform-origin': viewportCenterX + 'px ' + viewportCenterY + 'px'
                });
            }


        var zoomingIn = false;

        $('#zoom-out-button').click(function(e) {
            e.stopPropagation(); // Prevent the click event from bubbling up

            // Capture scroll position and viewport dimensions before zooming
            var preZoomScrollTop = $(window).scrollTop();
            var preZoomScrollLeft = $(window).scrollLeft();
            var viewportWidth = $(window).width();
            var viewportHeight = $(window).height();

            // Capture the mouse position relative to the viewport
            var mouseX = e.clientX;
            var mouseY = e.clientY;

            // Calculate the point of interest's relative position in the viewport
            var pointOfInterestX = (mouseX + preZoomScrollLeft) / viewportWidth;
            var pointOfInterestY = (mouseY + preZoomScrollTop) / viewportHeight;

            // Zooming in or out code
            if (zoomingIn) {
                currentZoomLevel--;
                if (currentZoomLevel < 0) {
                    currentZoomLevel = 1;
                    zoomingIn = false;
                }
            } else {
                currentZoomLevel++;
                if (currentZoomLevel >= zoomLevels.length) {
                    currentZoomLevel = zoomLevels.length - 2;
                    zoomingIn = true;
                }
            }

            // Determine the viewport center
            var viewportCenterX = $(window).scrollLeft() + $(window).width() / 2;
            var viewportCenterY = $(window).scrollTop() + $(window).height() / 2;

            // Apply the zoom level
            $('#zoom-container').css({
                'transform': 'scale(' + zoomLevels[currentZoomLevel] + ')',
                'transform-origin': viewportCenterX + 'px ' + viewportCenterY + 'px'
            });

            // Set the new scroll positions to keep the point of interest in the same relative position
            var newScrollLeft = pointOfInterestX * viewportWidth - mouseX;
            var newScrollTop = pointOfInterestY * viewportHeight - mouseY;

            $(window).scrollTop(newScrollTop);
            $(window).scrollLeft(newScrollLeft);

            // Store the current zoom level in localStorage
            localStorage.setItem('zoomLevel', currentZoomLevel);
        });






            // Scroll tracking and storage functionality
            $(window).scroll(function() {
                var scrollTopPercent = $(window).scrollTop() / $(document).height();
                localStorage.setItem('scrollTop', scrollTopPercent);

                localStorage.setItem('scrollX', $(window).scrollLeft());
                localStorage.setItem('scrollY', $(window).scrollTop());

            });

            // Click animation functionality
            $(document).click(function(e) {
                // create a new div element
                var clickAnimation = $('<div>').addClass('click-animation');

                // set the position of the element
                clickAnimation.css({
                    top: e.pageY - 25, // subtracting half of the final size to center the animation
                    left: e.pageX - 25 // subtracting half of the final size to center the animation
                });

                // add the element to the body
                $('body').append(clickAnimation);

                // remove the element after the animation has completed
                setTimeout(function() {
                    clickAnimation.remove();
                }, 200); // matches the animation duration
            });
        });



    /* Adds an animation to a participant when they are clicked */
    $('.participant').click(function() {
        $(this).siblings('.participant').removeClass('checked');
        $(this).addClass('checked');

        // Add an animation
        $(this).animate({
            opacity: 0.5,
            'font-size': '100%',
            'font-weight': 'bold' // Add the font-weight property
        }, 1, function() {
            // Animation complete.
            $(this).animate({
                opacity: 1.0,
                'font-size': '100%',
                'font-weight': 'bold' // Reset the font-weight property
            }, 1);
        });
    });




    // Start of the function that shows and hides the championship and consolation brackets when a tab is clicked

        $(document).ready(function() {
        // Initially hide all brackets
        $('.bracket').hide();

        // Show the championship bracket by default
        $('#championshipbracket').show();

        $('#championshipButton').click(function() {
            $('.bracket').hide();
            $('#championshipbracket').show();
        });

        $('#consolationButton').click(function() {
            $('.bracket').hide();
            $('#consolationbracket').show();
        });

        $('#thirdFifthButton').click(function() {
            $('.bracket').hide();
            $('#thirdFifthbracket').show();
        });

        $('#allAmericansButton').click(function() {
            $('.bracket').hide();
            $('#allAmericansbracket').show();
        });
    });




    // End of tab click function to show and hide the brackets 






