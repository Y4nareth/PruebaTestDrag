const questions = [
    {
        question: "Elije la verdadera",
        answers: [
            { 
                initial: "Virtual Network peering", 
                text: "Extends on-premise networks to the Microsoft cloud via private connection.",
                correct: "Express Route" 
            },
            {
                initial: "Express Route",
                text: "Combines two or more Azure virtual networks into a single virtual network",
                correct: "Virtual Network peering"
            },
            {
                initial: "VPN Gateway",
                text: "Provides an encrypted connection from on-premise networks to Azure via a public network.",
                correct: "VPN Gateway"
            }
        ]
    },
    {
        question: "Elije la verdadera",
        answers: [
            { 
                initial: "Disaster recovery", 
                text: "Provide a continuous user experience in the event of a resource failure.",
                correct: "High availability" 
            },
            {
                initial: "Geo-distribution",
                text: "Deploy apps and data to regional data centers that are located close to users.",
                correct: "Geo-distribution"
            },
            {
                initial: "High availability",
                text: "Compute capacity can be increased dynamically by adding RAM or CPU to a virtual machine.",
                correct: "Scalability"
            },
            {
                initial: "Scalability",
                text: "",
                correct:""
            }
        ]
    }
];

const questionElement = document.getElementById("question");
const control = document.getElementById("control");
const nextButton = document.getElementById("next-btn");
const valButton = document.getElementById("validate-btn");

let currentQuestionIndex = 0;
let score = 0;
let correctAnswer = [];

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    //valButton.innerHTML = "Confirmar";
    //nextButton.innerHTML = "Siguiente";
    showQuestion();
}

function getCorrectAnswers(currentQuestion) {
    const correctAnswers = [];
    for (let i = 0; i < currentQuestion.answers.length; i++) {
        if (currentQuestion.answers[i].correct) {
            correctAnswers.push(1);
        } else {
            correctAnswers.push(2);
        }
    }
    return correctAnswers;
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    correctAnswer = getCorrectAnswers(currentQuestion);
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    createResource(currentQuestion.answers);

    valButton.addEventListener("click", validateAnswer);
}

function createDragColumn(answers){
    var column = document.createElement("div");
    column.classList.add("column");
    column.setAttribute("id","dragColumn");

    var columnTitle = document.createElement("h3");
    column.appendChild(columnTitle);
    columnTitle.classList.add("dragZoneLabel")
    columnTitle.textContent = "Elementos";
    
    for(var i=0;i<answers.length;i++){
        var dragZone = document.createElement("div");
        dragZone.setAttribute("id","dragZone");
        dragZone.setAttribute("ondrop","drop(event)");
        dragZone.setAttribute("ondragover","allowDrop(event)");

        var dragElement = document.createElement("div");
        dragZone.appendChild(dragElement);
        dragElement.classList.add("dragElement");
        dragElement.setAttribute("id",`dragElement${i+1}`);
        dragElement.setAttribute("draggable","true");
        dragElement.setAttribute("ondragstart","drag(event)");
        dragElement.textContent = answers[i].initial;

        column.appendChild(dragZone);
    }

    return column;
}

function createDropColumn(answers){
    var column = document.createElement("div");
    column.classList.add("column");
    column.setAttribute("id","dropColumn");

    var columnTitle = document.createElement("h3");
    column.appendChild(columnTitle);
    columnTitle.classList.add("dropZoneLabel")
    columnTitle.textContent = "Respuestas";
    
    for(var i=0;i<answers.length;i++){
        var dropZone = document.createElement("div");
        dropZone.setAttribute("id","dropZone");
        dropZone.setAttribute("ondrop","drop(event)");
        dropZone.setAttribute("ondragover","allowDrop(event)");
        dropZone.dataset.correct = answers[i].correct;

        column.appendChild(dropZone);
    }

    return column;
}

function createTextColumn(answers){
    var column = document.createElement("div");
    column.classList.add("column");
    column.setAttribute("id","textColumn");

    var columnTitle = document.createElement("h3");
    column.appendChild(columnTitle);
    columnTitle.textContent = "Texto";
    
    for(var i=0;i<answers.length;i++){
        var answerText = document.createElement("div");
        answerText.classList.add("answerText");

        var spanText = document.createElement("span");
        spanText.textContent = answers[i].text;
        answerText.appendChild(spanText);

        column.appendChild(answerText);
    }

    return column;
}

function createResource(answers) {
    var dragColumn = createDragColumn(answers);
    var dropColumn = createDropColumn(answers);
    var textColumn = createTextColumn(answers);

    control.appendChild(dragColumn);
    control.appendChild(dropColumn);
    control.appendChild(textColumn);

    return 1;
}

function resetState(){
    while(control.firstChild){
        control.removeChild(control.firstChild);
        nextButton.style.display = "none";
    }
}


function validateAnswer(){
    nextButton.style.display = "inline";

    var answerOptions = document.querySelectorAll('div[id="dropZone"]');

    if(answerOptions){
        answerOptions.forEach(answerOption => {
            var answer = answerOption.children[0];
            if(answerOption.dataset.correct == answer.textContent){
                answerOption.classList.add("correct");
                answer.classList.add("correct");
            }else{
                answerOption.classList.add("incorrect");
                answer.classList.add("correct");
            }
        });
    }else{
        alert("Por favor seleccione una opción");
    }
}

function showScore(){
    resetState();
    questionElement.innerHTML = `Tu puntuación es ${score} de ${questions.length}`;
    nextButton.innerHTML = "Repetir Test";
    nextButton.style.display = "block";
}

function handleNextQuetion(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", ()=>{
    if(currentQuestionIndex < questions.length){
        handleNextQuetion();
    }else{
        startQuiz();
    }
});

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    event.target.appendChild(draggedElement);
}


startQuiz();