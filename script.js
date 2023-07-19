
        const apiUrl = 'https://restcountries.com/v3.1/all'; // Replace with the API of your choice
        const questionTypes = ['capital', 'flag']; // Types of questions

        // Function to fetch questions from the API
        function getQuizQuestions() {
            return fetch(apiUrl)
                .then(response => response.json())
                .then(data => generateRandomQuestions(data))
                .catch(error => {
                    console.error('Error fetching quiz questions:', error);
                });
        }

        // Function to generate random questions from the received data
        function generateRandomQuestions(data) {
            const questions = [];

            // Get two random countries for capital questions
            const capitalCountries = getRandomElements(data, 2);
            capitalCountries.forEach(country => {
                const question = `What is the capital of ${country.name.common}?`;
                const options = generateOptions(data, country.capital);
                questions.push({
                    type: 'capital',
                    question,
                    options,
                    correctAnswer: options.indexOf(country.capital)
                });
            });

            // Get two random countries for flag questions
            const flagCountries = getRandomElements(data, 2);
            flagCountries.forEach(country => {
                const question = `Which country does this flag belong to? <br><img src="${country.flags.png}" alt="${country.name.common} Flag" height="100">`;
                const options = generateOptions(data, country.name.common);
                questions.push({
                    type: 'flag',
                    question,
                    options,
                    correctAnswer: options.indexOf(country.name.common)
                });
            });

            return questions;
        }

        // Function to get random elements from an array
        function getRandomElements(array, count) {
            const shuffled = array.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        }

        // Function to generate options for questions
        function generateOptions(data, correctAnswer) {
            const options = getRandomElements(data.map(c => c.name.common), 3);
            options.push(correctAnswer);
            return shuffleArray(options);
        }

        // Function to shuffle an array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Function to display questions and options on the page
        function displayQuestion(index, question, options) {
            const questionContainer = document.getElementById('question-container');
            const optionsContainer = document.getElementById('options-container');

            questionContainer.innerHTML = `Question ${index + 1}: ${question}`;

            optionsContainer.innerHTML = '';
            options.forEach((option, i) => {
                const optionElement = document.createElement('div');
                optionElement.innerHTML = `
                    <input type="radio" name="question${index}" value="${i}" id="option${i}">
                    <label for="option${i}">${option}</label>
                `;
                optionsContainer.appendChild(optionElement);
            });
        }

        // Function to load a new question
        function loadNextQuestion(questions, currentQuestion) {
            const { question, options } = questions[currentQuestion];
            displayQuestion(currentQuestion, question, options);
        }

        // Function to calculate and display the final score
        function displayScore(score, totalQuestions) {
            const scorePercentage = (score / totalQuestions) * 100;
            alert(`Quiz completed!\nYour score: ${score} out of ${totalQuestions}\nPercentage: ${scorePercentage.toFixed(2)}%`);
        }

        // Main function to start the quiz
        function startQuiz() {
            getQuizQuestions().then(questions => {
                let score = 0;
                let currentQuestion = 0;

                if (questions) {
                    loadNextQuestion(questions, currentQuestion);

                    const submitBtn = document.getElementById('submit-btn');
                    submitBtn.addEventListener('click', () => {
                        const selectedOption = document.querySelector(`input[name="question${currentQuestion}"]:checked`);
                        if (selectedOption) {
                            const selectedAnswer = parseInt(selectedOption.value);
                            const correctAnswer = questions[currentQuestion].correctAnswer;

                            if (selectedAnswer === correctAnswer) {
                                score++;
                            }

                            currentQuestion++;
                            if (currentQuestion < questions.length) {
                                loadNextQuestion(questions, currentQuestion);
                            } else {
                                displayScore(score, questions.length);
                            }
                        } else {
                            alert('Please select an option before submitting.');
                        }
                    });
                }
            });
        }

        // Start the quiz when the page loads
        startQuiz();
   
