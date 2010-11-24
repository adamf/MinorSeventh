soundManager.url = 'soundmanager/';
soundManager.flashVersion = 9; // optional: shiny features (default = 8)
soundManager.useFlashBlock = false; // optionally, enable when you're ready to dive in
soundManager.debugMode = false;

var notes = new Array();

notes[0] = 'C2';
notes[1] = 'C#2';
notes[2] = 'D2';
notes[3] = 'D#2';
notes[4] = 'E2';
notes[5] = 'F2';
notes[6] = 'F#2';
notes[7] = 'G2';
notes[8] = 'G#2';
notes[9] = 'A2';
notes[10] = 'A#2';
notes[11] = 'B2';
notes[12] = 'C3';
notes[13] = 'C#3';
notes[14] = 'D3';
notes[15] = 'D#3';
notes[16] = 'E3';
notes[17] = 'F3';
notes[18] = 'F#3';
notes[19] = 'G3';
notes[20] = 'G#3';
notes[21] = 'A3';
notes[22] = 'A#3';
notes[23] = 'B3';
notes[24] = 'C4';

var commonIntervals = new Array();
commonIntervals[0] = ['Unison', 'A unison is the same note played together.'];
commonIntervals[1] = ['Minor Second', "A minor second, when played ascending, is heard in the Jaws theme song. When descending, it is heard in Fur Elise."];
commonIntervals[2] = ['Major Second', "A major second, when played ascending, is heard in Happy Birthday. When descending, it is heard in Three Blind Mice."];
commonIntervals[3] = ['Minor Third', "A minor third, when played ascending, is heard in Greensleeves. When descending, it is heard in the Star Spangled Banner."];
commonIntervals[4] = ['Major Third', "A major third, when played ascending, is heard in When The Saints Go Marching In. When descending, it is heard in Beethoven's 5th Symphony."];
commonIntervals[5] = ['Perfect Fourth', "A perfect fourth, when played ascending, is heard in Here Comes The Bride. When descending, it is heard in Oh Come All Ye Faithful."];
commonIntervals[6] = ['Tritone', "A minor second, when played ascending, is heard in Maria from West Side Story. When descending, it is heard in Blue Seven."];

commonIntervals[7] = ['Perfect Fifth', "A perfect fifth, when played ascending, is heard in Twinkle, Twinkle, Little Star. When descending, it is heard in the Flintstone's theme song."];
commonIntervals[8] = ['Minor Sixth', "A minor sixth, when played ascending, is heard in the jazz standard Morning Of Carnival. When descending, it is heard in the theme from Love Story."];
commonIntervals[9] = ['Major Sixth', "A major sixth, when played ascending, is heard in America The Beautiful. When descending, it is heard in Over There"];
commonIntervals[10] = ['Minor Seventh', "A minor seventh, when played ascending, is heard in the Star Trek theme song. When descending, it is heard in An American In Paris."];
commonIntervals[11] = ['Major Seventh', "A major seventh, when played ascending, is heard in the Fantasy Island theme song. When descending, it is heard in Cole Porter's I Love You."];
commonIntervals[12] = ['Octave', "An octave, when played ascending, is heard in Somewhere Over The Rainbow. When descending, it is heard in Willow Weep For Me."];


// global configuration data
var delayBetweenIntervals = 1500; // in milliseconds
var correctAnswers = 0;
var totalAnswers = 0;
var middleCIndex = 12;

// options for the user to choose from
var currentMode = 'intervalQuiz';
var lowToHigh = true;
var twoOctave = false;
var noArpeggios = false;
var difficultyLevel = 0;  // 0 == easy, 1 == medium

// distance from first to last in half steps
var currentInterval = 0;
var lastInterval = 0;


soundManager.onload = function() {
  // SM2 has loaded - now you can create and play sounds!
    var i = 0;


    for(i = 0; i < notes.length; i++) {
      soundManager.createSound({ id: notes[i], url: 'samples/' + notes[i].replace(/#/gi, "sharp") + '.mp3'});
      soundManager.createSound({ id: 'C3-' + notes[i], url: 'samples/C3-' + notes[i].replace(/#/gi, "sharp") + '.mp3'});
    }

    setupQuiz();



};



function wait(milliseconds)
{
    var date = new Date();

    var currrentDate = null;

    do { currrentDate = new Date(); } while(currrentDate - date < milliseconds);
} 


function setNewInterval()
{
    $("#playButton").button({label: "Play"});
    currentInterval = Math.floor(Math.random() * commonIntervals.length)
    while(currentInterval == lastInterval) {
	currentInterval = Math.floor(Math.random() * commonIntervals.length)
    }
    lastInterval = currentInterval;
}

function playInterval(element, interval, showIntervalInformation)
{
    var isRepeat = (interval != null) & (showIntervalInformation == false);
    var lastNote = notes.length; // default to an octave
    var elID = "#" + element.id;

    if(interval == null) {
	interval = currentInterval;
    }

    if(showIntervalInformation) {
	$("#intervalInfo").html(commonIntervals[interval][1]);
    } else {
	$("#intervalInfo").html("");
    }

    if (lowToHigh) {
        lastNote = middleCIndex + interval;
    } else {
        lastNote = middleCIndex - interval;
    }

    $(elID).button( "option", "disabled", true );
    soundManager.play(notes[middleCIndex] + '-' + notes[lastNote]);

    if(noArpeggios == false) {
	setTimeout("soundManager.play(notes[" + middleCIndex + "]);",delayBetweenIntervals);
	setTimeout("soundManager.play(notes[" + lastNote + "]); $('" + elID + "').button('option', 'disabled', false);",delayBetweenIntervals * 2);
    } else {
	$(elID).button( "option", "disabled", false );
    }

    if (! isRepeat) {
        $("#playButton").button({label: "Play Again"});
        results('', correctAnswers, totalAnswers);
    } 
}


function setupQuiz()
{
    setNewInterval();

    $(":button").removeAttr('disabled');
    $(":input").removeAttr('disabled');
    $("#direction").buttonset();
    $("#arpeggiate").buttonset();
    $("#mode").buttonset();
    $("#trainer").hide();


    var i;
    for(i = 0; i < commonIntervals.length; i++) {
	$("#answers").append("<button id='answer" + i + "' onclick='guess(" + i + ");'>" + commonIntervals[i][0] + "</button>");
	$("#trainer").append("<button id='trainer" + i + "' onclick='playInterval(this, " + i + ", true);'>" + commonIntervals[i][0] + "</button>");
    }

    $("#answers").append("<button id='showAnswer' onclick='showAnswer();'>Show Answer</button>");

    $("*:button").button();

    
}


function setMode(mode)
{
    if (mode == currentMode) { return; }
    if (mode == 'intervalQuiz') {
	currentMode = mode;
        $("#intervalInfo").html("");
	$("#trainer").hide();
	$("#answers").show();
        $("#playButton").button({label: "Play"});
	$("#playButton").show();
        results("Click 'Play' to begin training.", correctAnswers, totalAnswers);
    } else if(mode == 'intervalTrainer') {
	currentMode = mode;
	$("#answers").hide();
	$("#playButton").hide();
	$("#trainer").show();
        $("#results").html("<br/>Press any interval to hear that interval.<br/>");
    }

}

function showAnswer()
{
    results("The correct interval was " + commonIntervals[currentInterval][0] + ".", correctAnswers, totalAnswers);
    setNewInterval();
}

function guess(guessedInterval)
{
    if($("#playButton").button('option', 'label') === 'Play')
    {
        return;
    }
    totalAnswers++;
    if(guessedInterval == currentInterval) {
        setNewInterval();
	correctAnswers++;
        var msg = "Correct! <button id='hear_again' onclick='playInterval(this, " + guessedInterval + ", false, false);'>Hear it again.</button>";
        results(msg, correctAnswers, totalAnswers);
        $("#playButton").button({label: "Play"});
    } else {
        results("Incorrect, try again.", correctAnswers, totalAnswers);
    }
}

function results(message, correctAnswers, totalAnswers)
{
    if(totalAnswers == 1) {
	$("#results").html(message + "<br/>" + correctAnswers + " correct out of " + totalAnswers + " guess.");
    } else {
	$("#results").html(message + "<br/>" + correctAnswers + " correct out of " + totalAnswers + " guesses.");
    }
}
